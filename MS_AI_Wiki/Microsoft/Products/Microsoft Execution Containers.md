---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - MXC
  - Microsoft Execution Containers
  - Agent Containers
moc:
  - '[[Microsoft MOC]]'
  - '[[Security & Identity MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Microsoft Execution Containers (MXC)

*OS-Level Sicherheits-Container für AI-Agenten — vorgestellt auf Build 2026. Vier Isolations-Stufen vom Prozess bis zur dedizierten Cloud-PC, damit Agenten kontrolliert ausgeführt werden ohne dass sie das System gefährden.*

> **Analogie:** Was Docker für Code-Container war, ist MXC für Agent-Container — mit dem Unterschied, dass MXC OS-Level-Isolation auf Windows-Native-Basis bietet, nicht auf Hypervisor-Ebene.

---

## Was leistet es?

Vier Isolations-Modi je nach Risiko-Profil:

| Modus | Isolation-Tiefe | Use-Case |
|---|---|---|
| **Process** | Prozess-Ebene (lightweight) | Agent läuft als getrennter Prozess, geteilte Resources |
| **Session** | User-Session (mittel) | Agent in eigener Windows-Session, eigene Berechtigungen |
| **Machine** | Maschine-Ebene (schwer) | Agent in dedizierter VM oder Sandbox-Container |
| **Cloud PC** | Voll isoliert (max.) | Agent in dedizierter [[Windows 365 for Agents]]-Cloud-PC |

## Status

- GA seit Build 2026
- Bestandteil von Windows 12 / Windows Server 2026

## Wo passt es in die Architektur?

- **Layer:** GOVERNANCE
- **Verbindungen:**
  - `secured-by` ← MAF, M365 Agents SDK (wenn Agent auf Windows läuft)
  - `uses` → Windows 365 for Agents (für Cloud-PC-Modus)
  - benachbart zu Defender for AI (Defender überwacht, MXC isoliert)

## Beratungs-Relevanz für Journai

**Hoch für regulierte Schweizer Kunden.**

Banken, Versicherer, öffentlicher Sektor haben oft strikte Anforderungen an Sandbox-Isolation von autonom-handelnden Software-Komponenten. MXC erfüllt das auf Native-Windows-Level:

- **FINMA-konform:** dedizierte Cloud-PC-Isolation entspricht den Anforderungen an "operationelle Risiken bei autonomen Systemen"
- **DSGVO Art. 32:** "technisch-organisatorische Massnahmen" — MXC ist eine konkrete Massnahme
- **ISO 27001:** Privileged-Access-Management auf Agenten-Ebene

Empfehlung für Sicherheits-sensitive Kunden:
> "Production-Agents in MXC ausführen, mindestens Session-Isolation, bei kritischen Workflows Machine- oder Cloud-PC-Isolation."

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Performance-Overhead pro Isolation-Modus
- [ ] Pricing-Auswirkung (besonders Cloud-PC)
- [ ] Integration mit Defender für AI

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [theneuron.ai — Build 2026](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
