---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Microsoft Web IQ
moc:
  - '[[Microsoft MOC]]'
  - '[[Data & Knowledge MOC]]'
  - '[[Microsoft IQ]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Web IQ

*Teil der [[Microsoft IQ]]-Familie. Gibt Agenten Echtzeit-Zugriff auf das offene Web — modell-agnostisch und MCP-nativ. Praktisch: was ChatGPT Search ist, in Microsoft-First-Party-Form.*

> **Analogie:** Wenn Microsoft Graph der Bibliotheks-Katalog für interne Firmen-Daten ist, ist Web IQ der globale Such-Katalog für externe Web-Inhalte — mit Frische-Tracking und Quellen-Verifikation.

---

## Was leistet es?

- **Frisches Web-Wissen:** Agenten können aktuelle Ereignisse, News, Live-Daten abfragen
- **MCP-native Architektur:** Web IQ ist als MCP-Server gebaut, jeder MCP-fähige Agent kann es nutzen (Claude, MAF, Foundry Service)
- **Modell-Agnostik:** funktioniert nicht nur mit OpenAI-Modellen, sondern jedem Provider
- **Grounding mit Quellen-Nachverfolgung:** liefert nicht nur Inhalte sondern auch URL-Provenance

## Status

- GA seit Build 2026
- Region: US, EU (genauere Region-Liste tba)

## Wo passt es in die Architektur?

- **Layer:** KNOWLEDGE
- **Verbindungen:**
  - `grounds-on` ← MAF, Copilot Studio
  - `integrated-via` → [[Model Context Protocol]] (MCP-native)
  - `calls` → Foundry Models (optional, für Snippet-Re-Ranking)

## Beratungs-Relevanz

**Hoch — neue Default-Empfehlung für "der Agent soll Web-Suche können".**

Bisher Beratungs-Antwort: "Bing Search API + Custom Wrapper, oder ChatGPT-Plugin-Pattern."

Neue Antwort: "Web IQ — built-in, MCP-native, kein Custom-Code."

**Strategische Bedeutung:** Microsoft adoptiert MCP nicht nur passiv (als Konsument), sondern baut native Services auf MCP-Basis. Das verstärkt unsere Empfehlung "MCP ist der Standard, nicht nur eine Option".

## Konkrete MCP-Integration

```python
# Über Foundry Agent Service (MCP-Host)
from foundry_agent import Agent
agent = Agent(model="mai-large")
agent.mcp_tools.add("microsoft/web-iq")

response = agent.run("Wer hat letzte Woche das Microsoft Build 2026 Keynote gehalten?")
# Web IQ wird automatisch aufgerufen, Quellen werden in response.sources zurückgegeben
```

```python
# Über MAF direkt
from agent_framework.mcp import MCPClient
web_iq = MCPClient.connect("https://webiq.microsoft.com/mcp")
agent.add_tool(web_iq.search)
```

Auch von Claude-Agents (Anthropic) nutzbar — das ist der "MCP-native"-Punkt: vendor-agnostisch.

## Pricing (vorläufig)

- **Free Tier:** 100 Queries/Monat pro Tenant
- **PAYG:** $0.01 pro Query
- **Volumen-Bundles:** ab 100k Queries/Monat reduzierter Preis (~$0.005)

Schätzung mittlerer Kunde (1000 Queries/Tag): ca. **CHF 250-300/Monat**.

## Use-Cases (typisch)

1. **Marktforschungs-Bot:** _"Wer sind unsere Top-5 Wettbewerber, basierend auf aktuellem Marktstand?"_
2. **News-Briefing:** _"Was war diese Woche in der Schweizer Banken-Regulierung?"_
3. **Fact-Checking:** Agent prüft Behauptungen gegen offizielle Quellen
4. **Sales-Vorbereitung:** _"Was sind die letzten Pressemitteilungen von Kunde X?"_
5. **Tech-Watch:** Daily Recap über Microsoft-Roadmap-Updates (ironischerweise wie unsere eigene Wiki)

## Vergleich: Web IQ vs Alternativen

| Aspekt | Web IQ | Bing Search API | Tavily / Perplexity |
|---|---|---|---|
| MCP-native | ✓ | ✗ | teilweise |
| Multi-Provider | ✓ | OpenAI-zentriert | ✓ |
| Quellen-Provenance | ✓ (URL + Snippet) | ✓ | ✓ |
| Microsoft-First-Party | ✓ | ✓ | ✗ |
| Pricing | mittel | tief | mittel-hoch |
| Quellen-Whitelist | ✓ (Build 2026) | begrenzt | ✗ |
| Schweizer Compliance | Microsoft DPA | Microsoft DPA | externer Vendor |

**Faustregel:** für Microsoft-zentrische Stacks → Web IQ. Für Hochvolumen-Cost-sensitive → Bing API direkt. Für Cross-Cloud-Agnostik → Tavily.

## Häufige Stolpersteine

1. **Web IQ ≠ Real-Time-Web-Crawl.** Cached + indexed mit ~24h Frische — für minute-aktuelle Daten (Börsen-Tickers) nicht geeignet.
2. **Quellen-Whitelist ist Tenant-weit.** Kann nicht pro Agent variieren — bei mehreren Anwendungen mit unterschiedlichem Risiko-Appetit problematisch.
3. **Schweizerdeutsche Quellen schwach indexiert.** Hochdeutsche Quellen (SRF, NZZ) gut, dialektale Inhalte teilweise schlecht.
4. **Rate-Limits:** Free Tier reicht NICHT für produktive Bots — Pricing-Verträge früh klären.

## Quellen-Whitelist für regulierte Kunden

Build-Keynote-Demo zeigte explizit, dass Tenant-Admin eine Whitelist der erlaubten Domains konfigurieren kann:

```yaml
# Beispiel-Konfiguration für Banken-Kunde
web_iq_whitelist:
  - finma.ch
  - bis.org
  - swissbanking.ch
  - sif.admin.ch
  - microsoft.com
  - github.com
blocked_categories:
  - social_media
  - news_unverified
  - user_generated
```

**Beratungs-Wert für Banken/Versicherer:** wir können dem Compliance-Officer eine Liste vorlegen, die er genehmigt — danach kann der Agent **nur** aus diesen Quellen ziehen.

## Schweizer Compliance-Implikationen

- **Datenfluss:** Anfrage geht zu Microsoft → Antwort kommt zurück. Wenn Anfrage sensitive Daten enthält (Kunden-Namen, Vertragsdetails), ist das **Datenexport in Cloud** → DPA notwendig
- **Whitelist-Approach** macht Web IQ auch für FINMA-relevante Kunden nutzbar
- **EU-Region** ab Q3/2026 — bis dahin Banken-Compliance grenzwertig
- **Audit-Trail:** jede Anfrage + Antwort + Quellen-Liste loggbar in Purview

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] POC: Web IQ in MAF-Agent integrieren + Quellen-Whitelist testen
- [ ] Frische-Latenz für Schweizer Banking-News messen
- [ ] Vergleich-Test mit Bing Custom Search bei 100 typischen Anfragen
- [ ] Pricing-Modell mit Microsoft für 3 unserer Bestandskunden simulieren

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
