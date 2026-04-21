---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Microsoft Defender for AI, Defender XDR for AI]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Defender for AI

*Microsoft's **Runtime-Schutz für AI-Workloads** — Teil der Defender-Familie. Erkennt und blockt Prompt Injection, Jailbreak-Versuche, Data Exfiltration über LLM-Outputs, anomales Agent-Verhalten. Ergänzt präventive Filter ([[Azure AI Content Safety]]) um Runtime-Detection + Incident-Response.*

> **Analogie:** Was Defender for Endpoint für Malware-Runtime-Schutz ist, ist Defender for AI für LLM-Angriffe — präventive Filter + Detection + Response-Workflow.

---

## Einsatz

**JTBD:** When I Produktiv-Agents betreibe und Angriffs-Vektoren (Prompt Injection, Jailbreak, Exfiltration) mir Sorgen machen, I want to Runtime-Monitoring mit Detection-Signalen und SOC-Integration, so I can Incidents nicht erst in Post-Mortem entdecke.

**Trigger-Signale:**
- „Wir hatten einen Fall, wo ein Agent Kunden-PII in einer Antwort zurückgegeben hat."
- „Prompt Injection in einem unserer PoCs getestet — wie erkennen wir das real?"
- „SOC-Team braucht Incidents zu AI-Angriffen im XDR."

**Szenarien:** (1) Runtime-Schutz für Copilot + Custom Engine Agents, (2) Jailbreak-Detection + Alert, (3) DLP-Korrelation (sensitive Daten in LLM-Output).

**Empfehlung:** 🟢 ab erstem Produktiv-AI-Workload in regulierter Umgebung.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** Teil von Defender XDR-Add-on bzw. E5-Security *{TODO: exakte SKU}*
- **Region:** global

---

## Kernkonzept

Defender for AI ergänzt den Defender-XDR-Stack (Endpoint, Cloud, Identity, Office, IoT) um einen **AI-Workload-Sensor**. Er instrumentiert LLM-Calls (via API-Hooks in Azure OpenAI / Foundry Models), scannt Prompts + Responses auf Angriffs-Pattern, korreliert mit anderen Signalen (User-Behavior, Endpoint-Auffälligkeiten).

Incidents landen im Defender XDR Portal neben anderen Security Events — gleiche SOC-Workflows, gleiche Triage-Playbooks.

### Kern-Fähigkeiten

1. **Prompt Injection Detection**
2. **Jailbreak Detection** (Bekannte Patterns + heuristisch)
3. **Anomalie-Erkennung** bei Agent-Verhalten (unusual tool-call patterns, exfil-ähnliche output)
4. **XDR-Integration** — Incidents, Timelines, Automated Response

---

## Limitierungen

- **False Positives** bei legitimen Security-Testing-Szenarien
- **Nur Azure-OpenAI / Foundry / Copilot** — externe LLMs nicht gecovered

### Fallstricke

- **Defender for AI als Ersatz für Content Safety sehen** — sind komplementär. *Gegenmittel: Content Safety pre-Modell-Filter + Defender for AI runtime-Detection kombinieren.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Defender for AI | https://learn.microsoft.com/en-us/defender-xdr/defender-for-ai | 2026-04-22 |
| Docs | AI Threat Model | https://learn.microsoft.com/en-us/security/ai-threat-model | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
