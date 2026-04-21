---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Entra Suite, Entra ID Premium Suite]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Microsoft Entra Suite

*Identity-Bundle von Microsoft — **Entra ID P2 + Entra ID Governance + Entra Internet Access + Entra Private Access + Entra Permissions Management + Entra Verified ID**. Teil von [[Microsoft 365 E7]]. Voraussetzung für [[Entra Agent ID]] und Conditional Access auf AI-Workloads.*

> **Analogie:** Was Okta + Zscaler + CyberArk + Ping Identity gemeinsam abdecken, packt Microsoft in ein SKU-Bundle — mit dem Argument „alles aus einer Hand, nativ M365-/Azure-integriert".

---

## Einsatz

**JTBD:** When I Identity + Access + ZTNA als zusammenhängendes System auf M365/Azure ausrichten will, I want to ein Lizenz-Bundle mit vorintegrierten Komponenten, so I can Identity-Projekte ohne 6 SKU-Verhandlungen angehen kann.

**Trigger-Signale:**
- „Wir evaluieren Zero Trust — Entra Suite oder Okta?"
- „Agent 365 kommt, wir brauchen Entra Agent ID — was dazu?"
- „Conditional Access soll auf AI-Workloads greifen."

**Szenarien:** (1) Zero Trust Readiness für AI-Einsatz, (2) Vorbereitung für Agent 365, (3) Identity Governance (Access Reviews, Lifecycle).

**Empfehlung:** 🟢 wenn M365 E5/E7-Kunde, ohnehin im Bundle. Standalone: teurer als Einzel-SKUs ohne alle Komponenten zu nutzen.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** ~$12/user/month standalone (Stand Q4/2025), in [[Microsoft 365 E7]] inkludiert
- **Region:** global, EU-Tenants

---

## Kernkonzept

Entra Suite bündelt sechs Einzelprodukte:

1. **Entra ID P2** — IAM-Kern (Conditional Access, Risk-based Auth, Identity Protection)
2. **Entra ID Governance** — Access Reviews, Entitlement Management, Lifecycle
3. **Entra Internet Access** — Secure Web Gateway (SaaS-Traffic inspizieren)
4. **Entra Private Access** — ZTNA (Zero Trust Network Access zu On-Prem-/Private-Apps)
5. **Entra Permissions Management** — CIEM (Cloud Infrastructure Entitlement Management, Multi-Cloud)
6. **Entra Verified ID** — Decentralized Identity Credentials

Für AI-Szenarien kritisch: **Entra ID P2** (Conditional Access für User + AI-Agents), **Entra ID Governance** (Lifecycle für Agent Identities), **Entra Agent ID** (eigene Note) als neu hinzugekommenes Primitive.

---

## Limitierungen

- **Kompletter Einsatz = großer Rollout-Aufwand** (6 Produkte)
- **Multi-Cloud-Tiefe** bei Permissions Management gut, andere Komponenten Azure-first

### Fallstricke

- **Suite kaufen, nur ein Teilprodukt nutzen** — Kostenverschwendung. *Gegenmittel: Pre-Purchase Usage-Mapping.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Microsoft Entra | https://learn.microsoft.com/en-us/entra/ | 2026-04-22 |
| Suite Overview | Entra Suite | https://www.microsoft.com/en-us/security/business/microsoft-entra | 2026-04-22 |
| Pricing | | https://www.microsoft.com/en-us/security/business/microsoft-entra-pricing | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
