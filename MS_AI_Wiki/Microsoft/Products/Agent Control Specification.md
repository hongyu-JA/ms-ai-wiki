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

## Konkretes Policy-YAML-Beispiel (Build-Keynote-Demo)

```yaml
# agent-policy.yaml
apiVersion: agent-control/v1
kind: AgentPolicy
metadata:
  name: contract-analyzer-policy
  agent_id: contract-analyzer
spec:
  # Capability-Grenzen
  capabilities:
    read:
      - filesystem: /data/contracts/**
      - source: foundry-iq
    write:
      - filesystem: /data/output/**
    deny:
      - network: outbound
      - subprocess: any

  # Konfidenz-Schwellen
  confidence:
    minimum: 0.75
    human_review_threshold: 0.95
    fallback_on_below: human

  # Attestation-Pflichten
  attestation:
    sign_each_action: true
    key_source: azure-confidential-compute
    audit_storage: purview

  # Compliance-Tags
  compliance:
    - finma-2023-01
    - fadp-art-25
    - iso-27001-a9
```

Diese Policy wird der Agent-Runtime mitgegeben — egal ob MAF, Studio, oder externes Framework, das die Spec implementiert.

## Vergleich: Agent Control Spec vs andere Frameworks

| Framework | Scope | Status | Microsoft-Relation |
|---|---|---|---|
| **Agent Control Spec** | Agent-Runtime-Governance | angekündigt, Spec Q3/2026 | Microsoft-led |
| **NIST AI Risk Management Framework** | Organisations-AI-Risiko | publiziert seit 2023 | nicht runtime-spezifisch |
| **EU AI Act** | Regulatorisch (gesetzlich) | in Kraft, Compliance-Pflicht ab 2025 | nicht Runtime-spezifisch |
| **MCP** | Tool-Communication | publiziert, breite Adoption | Microsoft adoptiert |
| **OpenAI Agents Spec** | OpenAI-spezifisch | Vendor-only | konkurrierend |

**Verhältnis untereinander:** EU AI Act = "was muss erreicht werden", NIST = "wie sollte man strukturieren", Agent Control Spec = "wie technisch implementieren". Komplementär, nicht konkurrierend.

## Verhältnis zum EU AI Act

EU AI Act fordert (Art. 14) "Human-Oversight" für High-Risk-AI-Systeme. Agent Control Spec bietet konkrete technische Mechanismen:

- **Confidence-Schwelle für Human-Review** → erfüllt Art. 14 "Risk-based Intervention"
- **Attestation jeder Aktion** → erfüllt Art. 12 "Audit-Logging"
- **Capability-Deklaration** → erfüllt Art. 15 "Accuracy & Robustness"

**Beratungs-Argument:** _"Agent Control Spec ist die technische Antwort auf die regulatorischen Fragen, die EU AI Act stellt."_ Wir können das in Banken-/Versicherer-Pitches positionieren.

## Strategische Bedeutung für Microsoft (und uns)

Mit der Veröffentlichung als offener Standard verfolgt Microsoft zwei Ziele:

1. **De-facto-Standard werden** bevor EU/USA/China eigene Standards setzen
2. **Vendor-Lock-in reduzieren-Argument:** "wir sind nicht vendor-lock-in, wir bieten offenen Standard"

Für uns als Berater:
- **Frühzeitig die Spec verstehen** → wir können beim Kunden die "Standards-Diskussion" anführen
- **Multi-Vendor-Mandate gewinnen** → Spec ermöglicht uns, Microsoft-Beratung in Multi-Cloud-Setups zu bringen
- **Demo-Material:** Agent-Policy-Demo macht Compliance-Officer happy

## Häufige Stolpersteine

1. **Spec ist noch nicht final.** Empfehlungen können sich ändern bis Q3/2026 Release.
2. **Microsoft-Implementation ungleich Spec.** Microsoft baut Agent 365 als Implementation — andere Vendors könnten anders implementieren. Kompatibilität nicht garantiert.
3. **Adoption ist Wunsch, nicht Realität.** AWS, Google, Anthropic haben sich noch nicht öffentlich committet. Realistisch erst Q2/2027 echte Cross-Vendor-Adoption.
4. **Policy-Maintenance-Aufwand:** Policies müssen gepflegt werden — Code drift. Governance-Team beim Kunden nötig.

## Schweizer Compliance-Implikationen

- **FINMA-Rundschreiben 2023/01:** Spec-konforme Implementation = klares Audit-Argument
- **FADP Art. 25 (Data Protection by Design):** deklarative Policy = "by Design"-Erfüllung
- **EU AI Act:** wie oben — Spec adressiert mehrere Artikel direkt
- **NIST AI RMF Compliance:** Spec-Implementation = NIST-konform

**Konkretes Beratungs-Angebot:** _"Agent Governance Audit"_ — wir prüfen Kunden-Agent-Infrastruktur gegen Agent Control Specification, identifizieren Lücken, schreiben Policies. 3-5 Tage pro Kunde, CHF 12-25k.

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Spec-Veröffentlichung verfolgen (Microsoft-Newsletter, GitHub-Repo)
- [ ] Policy-Beispiele für unsere 3 typischsten Use-Cases (Bank, Versicherer, Treuhand) entwickeln
- [ ] Cross-Vendor-Adoption-Status quartalsweise prüfen
- [ ] "Agent Governance Audit"-Beratungs-Produkt formalisieren — Template + Pricing

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
