---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Agent Control Spec
  - Agent Governance Spec
  - Portable Agent Runtime Governance
moc:
  - '[[Microsoft MOC]]'
  - '[[Security & Identity MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Agent Control Specification

*Auf Build 2026 angekündigt — eine portable Runtime-Governance-Spezifikation für Agenten. Soll plattformübergreifend funktionieren (nicht nur Microsoft) und definiert, wie Agenten-Verhalten dokumentiert, beschränkt und auditierbar gemacht wird.*

> **Analogie:** Was OpenTelemetry für Observability ist, soll Agent Control Specification für Agent-Governance werden — ein offener Standard, gegen den Hersteller ihre Lösungen ausrichten können.

---

## Was leistet es?

- **Portable Policy-Definition:** Regeln für Agent-Verhalten in einem standardisierten Format
- **Cross-Platform:** funktioniert auf Microsoft-Stack, aber theoretisch auch auf AWS Bedrock, Google Vertex AI, eigenen Plattformen
- **Audit-fähig:** jede Agent-Aktion gegen Policy nachvollziehbar
- **Integration mit Agent 365:** Microsoft-Implementation der Spezifikation

Konkrete Bestandteile:
- **Agent Attestation:** kryptografische Signatur jeder Agent-Aktion (Azure Confidential Computing)
- **Agent Confidence Scores:** automatisch zugewiesene Reliabilität pro Aktion; unter 95 % → Human Review
- **Policy YAML:** deklarative Definition von Erlaubnis-Grenzen

## Status

- Spezifikation angekündigt
- Microsoft-Implementation in Agent 365 beginnt 2026
- Cross-Vendor-Adoption tba (Microsoft hofft auf Standard-Status)

## Wo passt es in die Architektur?

- **Layer:** GOVERNANCE (übergreifender Standard)
- **Verbindungen:**
  - implementiert von [[Agent 365]]
  - betrifft alle Agenten in MAF, Studio, M365 SDK
  - kompatibel mit MCP-Standard

## Beratungs-Relevanz für Journai

**Hoch für Beratungs-Positionierung — auch wenn die konkrete Spec noch nicht final ist.**

Strategische Bedeutung: dies ist Microsofts Versuch, Standards für AI-Agent-Governance zu setzen — ähnlich wie sie es bei MCP getan haben (Anthropic-erfunden, Microsoft adoptiert). Wir sollten unsere Kunden frühzeitig darauf aufmerksam machen:

> "Wenn ihr eine Multi-Vendor-Agent-Strategie habt, achtet auf Agent Control Specification als kommenden Standard. Vermeidet Vendor-spezifische Governance-Tools, wenn ihr darauf bauen wollt."

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Spec-Veröffentlichungsdatum
- [ ] Konkrete Policy-YAML-Beispiele
- [ ] Status anderer Hersteller (AWS, Google, Anthropic) bei Adoption
- [ ] Vergleich mit existierenden Frameworks (NIST AI RMF, EU AI Act)

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
