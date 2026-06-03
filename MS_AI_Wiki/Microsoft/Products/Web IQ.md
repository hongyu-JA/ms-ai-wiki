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

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Pricing (per Query? Volumen-Bundles?)
- [ ] Quellen-Whitelist-Konfiguration für regulierte Kunden
- [ ] Vergleich mit Bing Custom Search

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
