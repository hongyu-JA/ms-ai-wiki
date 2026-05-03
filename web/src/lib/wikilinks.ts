import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text, PhrasingContent } from "mdast";

/**
 * Wandelt Obsidian-style [[Note Name]] in normale markdown-Links um.
 *
 * Slug = lowercase + spaces/slashes → hyphens.
 * Display name strippt den `deprecated/` Prefix wenn vorhanden.
 *
 * Unterstützt Obsidian-Alias-Syntax `[[Target|Display]]`:
 *   - Target wird für Slug verwendet
 *   - Display wird als Link-Text verwendet (statt Target)
 *
 * ACHTUNG GFM-Tabellen: `[[Target|Display]]` in einer Tabellenzelle
 *   funktioniert NICHT — der GFM-Tabellen-Parser (Block-Level) frisst das
 *   `|` als Spalten-Trenner, bevor dieser Remark-Plugin (Inline-Level)
 *   überhaupt ausgeführt wird. Der Wikilink landet dann als defekter
 *   Rohtext in der Zelle (`[[Foundry Agent Service` + leere Spalte).
 *   Workaround: Alias in Tabellenzellen weglassen und nur `[[Target]]`
 *   verwenden — der Display-Name wird dann aus dem Target abgeleitet.
 *
 * Bsp.: [[Microsoft Agent Framework]] → [Microsoft Agent Framework](/products/microsoft-agent-framework)
 *       [[deprecated/Bot Framework]]   → [Bot Framework](/products/deprecated-bot-framework)
 *       [[Foundry Agent Service|Hosted Models]] → [Hosted Models](/products/foundry-agent-service)
 *
 * KNOWN GOTCHA: Wikilinks zu deprecated Produkten MÜSSEN den Pfad mit
 * angeben (`[[deprecated/Bot Framework]]`, nicht `[[Bot Framework]]`),
 * sonst zeigt der Link auf /products/bot-framework — diese Route existiert
 * nicht. Kein Build-Fehler, aber 404 bei Klick. Authoring-Konvention.
 */
export const remarkWikilinks: Plugin<[], Root> = () => (tree) => {
  visit(tree, "text", (node: Text, index, parent) => {
    if (!parent || index === undefined) return;
    const value = node.value;
    // Match [[Target]] OR [[Target|Display]] — display alias is optional
    const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    if (!re.test(value)) return;

    re.lastIndex = 0;
    const newChildren: PhrasingContent[] = [];
    let lastEnd = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(value)) !== null) {
      if (match.index > lastEnd) {
        newChildren.push({ type: "text", value: value.slice(lastEnd, match.index) });
      }
      const target = match[1];
      const aliasDisplay = match[2];
      const display = aliasDisplay ?? target.replace(/^deprecated\//, "");
      const slug = target.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");
      newChildren.push({
        type: "link",
        url: `/products/${slug}`,
        children: [{ type: "text", value: display }],
      });
      lastEnd = re.lastIndex;
    }
    if (lastEnd < value.length) {
      newChildren.push({ type: "text", value: value.slice(lastEnd) });
    }

    parent.children.splice(index, 1, ...newChildren);
    return index + newChildren.length;
  });
};
