---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Purview]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Microsoft Purview

*Das **Dach-Portfolio für Data Governance, Security und Compliance** bei Microsoft — Sensitivity Labels, DLP, Data Map (Catalog), Insider Risk Management, Compliance Manager, [[Purview DSPM]]. Für AI-Governance: die Schicht, die „welche Daten darf Copilot/Agent sehen?" beantwortet.*

> **Analogie:** Was Collibra + OneTrust zusammen abdecken, versucht Purview als einheitliche MS-Produktsuite zu sein — mit dem Vorteil nativer M365-/Azure-Integration.

---

## Einsatz

**JTBD:** When I regulierte Daten verarbeite und nachweisen muss, welche Klassen wo liegen, wer Zugriff hat und ob AI-Systeme sie verwenden dürfen, I want to eine einheitliche Governance-Plattform, die M365 + Azure + externe Quellen einheitlich abdeckt, so I can Compliance-Nachweise ohne manuelles Excel-Mapping führen.

**Trigger-Signale:**
- „Copilot hat sensible Daten in einer Antwort preisgegeben."
- „Der Datenschutzbeauftragte fragt nach DSGVO-Klassifizierung für AI."
- „NIS2-Audit steht an."

**Szenarien:** (1) Sensitivity Labels → Copilot respektiert Labels in Outputs, (2) DLP-Policies über Teams/Exchange/SharePoint, (3) Insider Risk Management.

**Empfehlung:** 🟢 für jeden regulierten Kunden + Copilot-Einsatz in EU. Meist schon in E5 vorhanden, aber nicht aktiviert.

---

## Status & Pricing

- **Status:** GA (Dach-Portfolio mit mehreren Einzelprodukten)
- **Pricing:** Großteils in E5 / M365 Compliance Add-ons inkludiert; einzelne Komponenten (DSPM, Insider Risk Premium) separat
- **Region:** global, EU-Datencenter verfügbar

---

## Kernkonzept

Purview ist **kein einzelnes Produkt**, sondern ein Umbrella über:
- **Information Protection** (Sensitivity Labels, Encryption)
- **Data Loss Prevention (DLP)** — verhindert Leak sensitiver Daten
- **Data Lifecycle Management** (Retention, Records)
- **[[Purview DSPM]]** — Data Security Posture Management (Risk-Scoring)
- **[[Purview Data Map]]** — Data-Catalog, Lineage
- **Insider Risk Management** — Anomalie-Erkennung (Insider Threat)
- **Compliance Manager** — Compliance-Score + Framework-Mapping
- **Communication Compliance** — Teams/Exchange-Content-Scanning
- **Audit** — unified Audit Log über M365

Für AI-Szenarien sind **Sensitivity Labels + DLP + DSPM** die wichtigsten Bausteine.

### Kern-Fähigkeiten (AI-relevant)

1. **Sensitivity Labels mit AI-Integration** — Labels werden von Copilot respektiert, Label-Propagation in Agent-Outputs
2. **DLP Policies über AI-Apps** — Regeln für „welche Daten dürfen in Copilot-Prompts"
3. **Audit-Trail für AI-Interaktionen** — jede Copilot-Query im Unified Audit Log

---

## Limitierungen

- **Konfigurations-Komplexität** — hunderte Policies, Interdependenzen
- **AI-Policy-Reife wächst schnell** — Doku-Stand oft hinter tatsächlichem Produkt

### Fallstricke

- **Labels nicht vor Copilot-Rollout aktivieren** — Copilot kann dann sensible Daten unklassifiziert zeigen. *Gegenmittel: Label-Auto-Classification-Pilot vor GA.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Microsoft Purview Overview | https://learn.microsoft.com/en-us/purview/purview | 2026-04-22 |
| Docs | Purview for AI | https://learn.microsoft.com/en-us/purview/ai-microsoft-purview | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
