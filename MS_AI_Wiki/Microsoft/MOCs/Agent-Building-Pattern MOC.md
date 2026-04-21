---
type: moc
tags: [moc, microsoft, lens, agent-building]
last_verified: 2026-04-21
---

# Agent-Building-Pattern MOC

*Lens-MOC (einseitig). Beantwortet die **eine Schlüsselfrage**: „Wenn ein Kunde sagt 'wir wollen einen Agenten in X', welche SDKs brauchen wir mindestens, welche optional?" — Diese MOC verlinkt bestehende Produkt-Notes quer, ohne dass die Produkte selbst etwas von dieser Lens wissen.*

> [!note] Lens-Regel
> Als Lens-MOC darf diese Note **nicht** im `moc:`-Frontmatter eines Produkts auftauchen. Verlinkung ist **einseitig** — hier nach außen, nicht zurück.

---

## Zweck

Einstieg für die **SDK-Auswahl-Frage** in Kundengesprächen. Sechs SDKs, klare Layer, eine Matrix — Ziel: Berater hat nach 30 Sekunden eine Antwort ohne den Kunden zu verwirren.

---

## Landkarte — Der SDK-Stack

```
┌────────────────────────────────────────────────────────────────────┐
│ GOVERNANCE           [[Agent 365]] SDK                            │
│                      (Identity, RBAC, Audit)                       │
├────────────────────────────────────────────────────────────────────┤
│ TESTING / EVAL       [[Azure AI Evaluation SDK]]                   │
│                      (Regression-Testing, Offline-Judge)           │
├────────────────────────────────────────────────────────────────────┤
│ HOSTING / RUNTIME    [[M365 Agents SDK]]                           │
│                      (Activity Protocol, Teams/Web/Copilot)        │
├────────────────────────────────────────────────────────────────────┤
│ UI / KANAL           [[Teams SDK]]                                 │
│                      (Adaptive Cards, Teams-Events)                │
├────────────────────────────────────────────────────────────────────┤
│ AGENT LOGIC          [[Microsoft Agent Framework]] (MAF)          │
│                      (Multi-Agent, Tool-Use, Threads)              │
├────────────────────────────────────────────────────────────────────┤
│ CLOUD-API            [[Foundry SDKs]] (AIProjectClient 2.0)       │
│                      (Foundry-Services-Zugriff)                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Die Matrix — welche SDKs für welches Target?

| Kundensituation | MAF | M365 Agents SDK | Teams SDK | Foundry SDK | Agent 365 SDK | Eval SDK |
|-----------------|-----|------------------|-----------|-------------|---------------|----------|
| **„Agent in Teams, ohne Custom Code"** | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| (→ **Copilot Studio**, keine SDK-Frage) | | | | | | |
| **„Pro-Code-Agent, nur über HTTP-Endpunkt"** | ✅ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| **„Pro-Code-Agent in Teams deployen"** | ✅ | ✅ | ✅ | ⚪ | ⚪ | ⚪ |
| **„Cloud-managed Hosting über Foundry"** | ✅ | ⚪ | ⚪ | ✅ | ⚪ | ⚪ |
| **„Regulierte Branche, Governance Pflicht"** | ✅ | ✅ | ✅ | ⚪ | ✅ | ⚪ |
| **„Mit CI-Eval-Schutz vor Regression"** | ✅ | ✅ | ✅ | ⚪ | ⚪ | ✅ |
| **„Volles Enterprise-Setup: Teams + Foundry-managed + Governance + Eval"** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

Legende: ✅ = Pflicht · ⚪ = nicht notwendig / optional.

---

## Entscheidungs-Regeln

1. **Fang immer mit MAF + Eval SDK an.** Alles andere ist Deploy-Target-abhängig und kommt später.
2. **Teams-Kanal?** → dann zwingend **M365 Agents SDK + Teams SDK**. Einer reicht nicht — die beiden decken unterschiedliche Layer ab (Activity Protocol vs. Teams-UI).
3. **Foundry Agent Service als Hosting?** → dann **Foundry SDK** (AIProjectClient) als Bonus. Ohne ist MAF-Agent rein lokal/ACA.
4. **Governance Pflicht?** → **Agent 365 SDK** parallel zu MAF. Keine Alternative, wenn der Kunde Agent 365 als Policy-Plane einsetzt.
5. **CI/CD mit Regression-Tests?** → **Eval SDK** ist optional aber stark empfohlen für Produktiv-Einsatz.

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Agents MOC]] — Primary Home für alle beteiligten SDKs
- [[Azure AI MOC]] — Foundry SDK lebt formal dort
- [[Security & Identity MOC]] — Agent 365 SDK lebt formal dort

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | M365 Agents SDK | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/ | 2026-04-21 |
| MS Hub-Page | Agent Framework | https://learn.microsoft.com/en-us/agent-framework/ | 2026-04-21 |
| MS Hub-Page | Foundry SDKs | https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der Lens-MOC mit SDK-Matrix |
