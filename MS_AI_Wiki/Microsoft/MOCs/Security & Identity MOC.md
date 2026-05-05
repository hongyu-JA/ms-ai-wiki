---
type: moc
tags: [moc, microsoft, security, identity, compliance]
last_verified: 2026-05-05
---

# Security & Identity MOC

*Primary-Home für Security, Governance, Identity und Compliance im Kontext von Agents: **Agent 365** (Control Plane, GA 01.05.2026), **Entra Agent ID** (Agent-Identity), **Entra Suite**, **Purview** (Governance/DSPM/Data Map), **Defender for AI**, **Azure AI Content Safety** (Prompt Shields).*

---

## Zweck

Einstieg für regulierte Branchen und Compliance-sensitive Projekte. Diese MOC beantwortet: **„Wer darf was, wer sieht was, was wird geloggt, wie verhindern wir Prompt-Injection?"** Sie ist Pflicht für jeden Tier-1-Agent in der EU, spätestens mit Agent 365 GA ab 01.05.2026.

---

## Landkarte — 3-Säulen-Portfolio (Microsoft-Darstellung)

```
┌────────────────────────────────────────────────────────────────────┐
│  1. GOVERNANCE                                                    │
│     [[Microsoft Purview]] (Dach)                                   │
│       ├─ [[Purview DSPM]] — Data Security Posture Management      │
│       └─ [[Purview Data Map]] — Data-Governance-Säule             │
│     [[Agent 365]] — Agent-Governance-Control-Plane                │
├────────────────────────────────────────────────────────────────────┤
│  2. SECURITY                                                       │
│     [[Defender for AI]] — Runtime-Schutz, Prompt-Injection        │
│     [[Azure AI Content Safety]] — Prompt Shields, Content-Filter  │
├────────────────────────────────────────────────────────────────────┤
│  3. IDENTITY                                                       │
│     [[Microsoft Entra Suite]] — Identity-Bundle, Teil von E7       │
│     [[Entra Agent ID]] — Agent-eigene Identity + Conditional      │
│                          Access                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Produkte in dieser MOC


<!-- AUTO-INDEX-START: produkte -->

| Produkt | Was es ist (1 Satz) | Tier | Watch |
| ------- | ------------------- | ---- | ----- |
| 🟢 [[Entra Agent ID]] | Agent-eigene Identity, Grundlage für Conditional Access auf Agents | T1 | close |
| 🟢 [[Azure AI Content Safety]] | Prompt Shields als Eingangs-Filter, Content-Filter | T2 | standard |
| 🟢 [[Defender for AI]] | Runtime-Schutz gegen Prompt Injection, Jailbreak | T2 | standard |
| 🟢 [[Microsoft Entra Suite]] | Identity-Bundle, Voraussetzung für Entra Agent ID, Teil von E7 | T2 | standard |
| 🟢 [[Microsoft Purview]] | Compliance-Dach: Governance + Security + Compliance (inkl. DSPM, Data Map, Sensitivity Labels) | T2 | standard |
| 🟢 [[Purview DSPM]] | Data Security Posture Management — kontinuierliches Risk-Scoring sensitiver Daten | T2 | standard |
| 🟢 [[Purview Data Map]] | Data-Governance-Säule von Purview (Data Catalog) — Kontrast zu DSPM | T3 | passive |

<!-- AUTO-INDEX-END: produkte -->

## Letzte Aktivität

_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-22 | [[Azure AI Content Safety]] | Deep-Dive Content Safety: Prompt Shields (User+Document Attacks), Content-Filter-Categories (0–7-Severity), Groundedness Detection (Reaso… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure AI Content Safety]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Defender for AI]] | Deep-Dive Defender for AI: Coverage (Defender for Cloud AI Services GA + Defender XDR Security for AI Agents Preview), Detection-Methoden… | Hongyu / Deep-Research |
| 2026-04-22 | [[Defender for AI]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Entra Agent ID]] | Kompletter Ausbau von Stub → Deep-Research-Note (watch: close). Abgrenzung zu [[Agent 365]] (Entra Agent ID = Identity-Plane darunter, ni… | Hongyu / Deep-Research |
| 2026-04-22 | [[Microsoft Entra Suite]] | Deep-Dive Entra Suite: Korrektur auf **5 Komponenten** (Permissions Management retired 2025-11-01), Internet Access als AI-Gateway mit Sh… | Hongyu / Deep-Research |
| 2026-04-22 | [[Microsoft Entra Suite]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Microsoft Purview]] | Deep-Dive Purview: 3-Säulen-Portfolio, Sensitivity Labels für Copilot, Agent-Governance-Hooks, Lizenz-Matrix | Hongyu / Deep-Research |
| 2026-04-22 | [[Microsoft Purview]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Purview Data Map]] | Deep-Dive Data Map: Data-Governance-Säule, Abgrenzung zu DSPM, SMB-Relevanz (meist irrelevant für AI-Kunden ohne Data-Engineering-Team) | Hongyu / Deep-Research |
| 2026-04-22 | [[Purview Data Map]] | Initial Stub (wartet auf Deep-Research) | Hongyu |
| 2026-04-22 | [[Purview DSPM]] | Deep-Dive DSPM + DSPM for AI: Risk-Signale, Coverage-Matrix, Pricing, Copilot-spezifische Detections | Hongyu / Deep-Research |
| 2026-04-22 | [[Purview DSPM]] | Initial Stub | Hongyu |
| 2026-04-21 | [[Entra Agent ID]] | Initial Stub | Hongyu |

<!-- AUTO-INDEX-END: activity -->

---

## Eskalationsleiter / Entscheidungslogik

| Kundensituation | Wahl | Begründung |
|-----------------|------|------------|
| „Wir haben 3+ Agents, wer darf was? Wer sieht Logs?" | [[Agent 365]] + [[Entra Agent ID]] | Ab ~3 Agents unerlässlich |
| „Kunde fragt nach DSGVO-Klassifizierung unserer Daten" | [[Microsoft Purview]] + [[Purview DSPM]] | DSPM gibt Inventar + Risk-Score |
| „Prompt-Injection-Sorge (User-Input geht ans Modell)" | [[Defender for AI]] (Runtime) + [[Azure AI Content Safety]] (pre-Modell-Filter) | Beide kombinieren, nicht einzeln |
| „Copilot auf sensitiven Daten — wie Label-Policies erzwingen?" | [[Microsoft Purview]] Sensitivity Labels + Copilot Policies | Purview-Labels werden von Copilot respektiert |
| „Existing Entra-P2-Kunde fragt nach Agent-Auth" | [[Entra Agent ID]] (Teil von [[Microsoft Entra Suite]]) | Identity-Bundle konsolidiert |

---

## Regulierungs-Kontext

- **DSGVO** — Data Residency + DPA + Purview-Klassifizierung sind die Werkzeuge
- **EU-AI-Act** — Foundry Control Plane Evaluation + Defender for AI Logs sind Audit-Material
- **NIS2** (EU) — Protokollierung + Vorfallsmeldung: Agent 365 + App Insights liefern die Protokolle
- **Branchen-spezifisch** — Finanzsektor (BaFin), Gesundheit (MDR/HIPAA äquivalent): Foundry Local als Offline-Option

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Agents MOC]] — Agent 365 ist dort Home (doppelt geführt)
- [[Azure AI MOC]] — Foundry Control Plane integriert Entra RBAC + Content Safety
- [[Copilot MOC]] — Purview-Labels + Copilot-Policies
- [[Licensing & SKUs MOC]] — Entra Suite ist Teil von E7

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Microsoft Purview | https://learn.microsoft.com/en-us/purview/ | 2026-04-21 |
| MS Hub-Page | Microsoft Entra | https://learn.microsoft.com/en-us/entra/ | 2026-04-21 |
| MS Hub-Page | Defender for AI | https://learn.microsoft.com/en-us/defender-xdr/defender-for-ai | 2026-04-21 |
| MS Hub-Page | Azure AI Content Safety | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der MOC |
