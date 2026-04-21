import { XMLParser } from "fast-xml-parser";
import type { Source } from "./config.js";

export interface RawItem {
  source_id: string;
  source_url: string;
  item_id: string;
  title: string;
  summary: string;
  link: string;
  published?: string;
  fetched_at: string;
  raw_hash: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

function hash(str: string): string {
  // Cheap, non-crypto rolling hash — enough to detect "same content" for dedup.
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function asArray<T>(x: T | T[] | undefined): T[] {
  if (x === undefined || x === null) return [];
  return Array.isArray(x) ? x : [x];
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Journai-MS-AI-Wiki-Bot/0.1 (+https://github.com/)",
      Accept: "application/rss+xml, application/atom+xml, application/json, text/*;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  const text = await res.text();
  const ct = res.headers.get("content-type") ?? "";
  // Hart: wenn ein Feed-Endpunkt HTML liefert, ist er meist umgezogen oder
  // blockiert uns. Das lieber als Fehler behandeln, damit fetch.ts einen
  // `errors: [...]`-Eintrag setzt, statt stillschweigend 0 Items zu speichern.
  if (/html/i.test(ct) && !/xml|json/i.test(ct)) {
    throw new Error(`feed ${url} returned ${ct} — endpoint likely moved or blocked`);
  }
  return text;
}

export async function fetchRss(source: Source): Promise<RawItem[]> {
  const xml = await fetchText(source.url);
  const doc = parser.parse(xml);
  // RSS 2.0
  const rssChannel = doc?.rss?.channel;
  if (rssChannel) {
    const items = asArray(rssChannel.item);
    return items.map((it: any) => {
      const title = String(it.title?.["#text"] ?? it.title ?? "");
      const link = String(it.link?.["#text"] ?? it.link ?? "");
      const desc = String(it.description?.["#text"] ?? it.description ?? "");
      const pub = String(it.pubDate ?? it["dc:date"] ?? "");
      const guid = String(it.guid?.["#text"] ?? it.guid ?? link ?? title);
      const summary = stripHtml(desc).slice(0, 2000);
      return {
        source_id: source.id,
        source_url: source.url,
        item_id: guid || hash(title + link),
        title: stripHtml(title),
        summary,
        link,
        published: pub || undefined,
        fetched_at: new Date().toISOString(),
        raw_hash: hash(title + link + summary),
      };
    });
  }
  // Atom 1.0
  const feed = doc?.feed;
  if (feed) {
    const entries = asArray(feed.entry);
    return entries.map((e: any) => {
      const title = String(e.title?.["#text"] ?? e.title ?? "");
      const linkRaw = e.link;
      let link = "";
      if (Array.isArray(linkRaw)) {
        link = String(linkRaw[0]?.["@_href"] ?? "");
      } else if (linkRaw) {
        link = String(linkRaw["@_href"] ?? linkRaw ?? "");
      }
      const id = String(e.id ?? link ?? title);
      const summary = stripHtml(
        String(e.summary?.["#text"] ?? e.summary ?? e.content?.["#text"] ?? e.content ?? ""),
      ).slice(0, 2000);
      const pub = String(e.updated ?? e.published ?? "");
      return {
        source_id: source.id,
        source_url: source.url,
        item_id: id,
        title: stripHtml(title),
        summary,
        link,
        published: pub || undefined,
        fetched_at: new Date().toISOString(),
        raw_hash: hash(title + link + summary),
      };
    });
  }
  return [];
}

export async function fetchGithubReleases(source: Source): Promise<RawItem[]> {
  const json = JSON.parse(await fetchText(source.url));
  const list = Array.isArray(json) ? json : [];
  return list.map((r: any) => {
    const title = `${r.name || r.tag_name} — ${r.tag_name}`;
    const summary = String(r.body ?? "").slice(0, 2000);
    return {
      source_id: source.id,
      source_url: source.url,
      item_id: String(r.id),
      title,
      summary,
      link: String(r.html_url ?? source.url),
      published: r.published_at || r.created_at,
      fetched_at: new Date().toISOString(),
      raw_hash: hash(title + r.id + summary),
    };
  });
}

export async function fetchJsonFeed(source: Source): Promise<RawItem[]> {
  const json = JSON.parse(await fetchText(source.url));
  const list = Array.isArray(json?.items) ? json.items : Array.isArray(json) ? json : [];
  return list.map((it: any) => {
    const title = String(it.title ?? it.name ?? "");
    const summary = stripHtml(
      String(it.content_text ?? it.content_html ?? it.summary ?? it.description ?? ""),
    ).slice(0, 2000);
    const id = String(it.id ?? it.guid ?? it.url ?? title);
    const link = String(it.url ?? it.link ?? "");
    const pub = String(it.date_published ?? it.published ?? "");
    return {
      source_id: source.id,
      source_url: source.url,
      item_id: id,
      title,
      summary,
      link,
      published: pub || undefined,
      fetched_at: new Date().toISOString(),
      raw_hash: hash(title + link + summary),
    };
  });
}

export async function fetchSource(source: Source): Promise<RawItem[]> {
  switch (source.type) {
    case "rss":
    case "atom":
      return fetchRss(source);
    case "github-releases":
      return fetchGithubReleases(source);
    case "json-feed":
      return fetchJsonFeed(source);
    case "html":
      // Walking-Skeleton: HTML-Scraping bewusst nicht implementiert; gib leere
      // Liste zurück und logge — wird später mit cheerio/readability nachgeliefert.
      console.warn(`[feeds] html source '${source.id}' not implemented yet; skipping`);
      return [];
    default:
      return [];
  }
}
