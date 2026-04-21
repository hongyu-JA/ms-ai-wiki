---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [DSPM, Data Security Posture Management]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Purview DSPM

*Microsoft's **Data Security Posture Management** — Teil von [[Microsoft Purview]]. Kontinuierliches Scanning von Datenbeständen in M365, Azure (Storage, SQL, Cosmos) und zunehmend Dritt-Clouds, um **sensitive Daten + deren Schutzzustand sichtbar zu machen**. Liefert Risk-Scores, Policy-Gaps und Remediation-Pfade.*

> **Analogie:** Was Qualys / Tenable für Netzwerk-Vulnerabilities ist, ist DSPM für Daten — eine kontinuierliche Risk-Posture-Analyse, nicht nur ein einmaliger Audit.

---

## Einsatz

**JTBD:** When I wissen will, wo sensitive Daten liegen und wie gut sie geschützt sind (ohne manuellen Audit zu fahren), I want to eine dashboard-getriebene Sicht auf Daten-Risk-Posture, so I can priorisiert handeln statt Policy-Bolzhaufen anzulegen.

**Trigger-Signale:**
- „Wir wissen gar nicht, wo überall PII liegt."
- „Audit fragt nach Risk-Score für unsere Datenbestände."
- „Wir haben Sensitivity Labels, aber wissen nicht ob sie greifen."

**Szenarien:** (1) DSGVO-PII-Inventar-Scan, (2) Vor Copilot-Rollout → Risk-Check, (3) M&A Due Diligence (Daten-Baseline).

**Empfehlung:** 🟢 für regulierten Kunden vor jeder AI-Ausrollung. Hilft „blinden Flecken" sichtbar zu machen.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** Separate E5-Compliance-Add-on-Lizenz *{TODO: aktuelle SKU + Per-User-Preis}*
- **Region:** EU verfügbar

---

## Kernkonzept

DSPM scannt kontinuierlich **Datenstores** (SharePoint, OneDrive, Exchange, Teams, Azure Blob, Azure SQL, Cosmos DB, externe Clouds), klassifiziert Content via **Sensitive Information Types** (Built-in für GDPR-Entitäten + Custom), prüft angewandte **Sensitivity Labels + DLP Policies**, errechnet einen **Risk Score** pro Datenstore.

Output: Dashboard mit „wo liegt welche Klasse, welche Schutzstufe, welche Gaps" + Remediation-Vorschläge.

### Kern-Fähigkeiten

1. **Cross-Cloud Data Discovery** (M365 + Azure + zunehmend AWS / GCP)
2. **Sensitive Information Type Detection** (PII, PCI, HIPAA, 400+ Built-ins)
3. **Risk Scoring** pro Datenstore + Trend über Zeit
4. **Remediation Workflows** — Policy-Vorschlag + Ein-Klick-Anwendung

---

## Limitierungen

- **Scanning-Latenz** — Scan-Cycles sind nicht real-time (stundlich bis täglich)
- **False Positives** bei Custom Sensitive Info Types
- **Third-Cloud-Support noch nicht vollständig**

### Fallstricke

- **DSPM-Score ohne Kontext als KPI nutzen** — Score sinkt nicht proportional zum Risiko-Abbau, sondern zum Datenvolumen-Wachstum.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Purview DSPM | https://learn.microsoft.com/en-us/purview/dspm | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
