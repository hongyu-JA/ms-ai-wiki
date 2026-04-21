---
type: moc
tags: [moc, microsoft, security, identity, compliance]
last_verified: 2026-04-21
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

| Produkt | Was es ist (1 Satz) | Watch |
|---------|---------------------|-------|
| [[Agent 365]] | Control Plane für Agent-Governance, GA 2026-05-01 *(auch in [[Agents MOC]])* | close |
| [[Entra Agent ID]] | Agent-eigene Identity, Grundlage für Conditional Access auf Agents | close |
| [[Microsoft Entra Suite]] | Identity-Bundle, Voraussetzung für Entra Agent ID | standard |
| [[Microsoft Purview]] | Compliance-Dach: Governance + Security + Compliance | standard |
| [[Purview DSPM]] | Data Security Posture Management | standard |
| [[Defender for AI]] | Runtime-Schutz gegen Prompt Injection, Jailbreak | standard |
| [[Azure AI Content Safety]] | Prompt Shields als Eingangs-Filter | standard |
| [[Purview Data Map]] | Data-Governance-Säule (Kontrast zu DSPM) | passive |

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
