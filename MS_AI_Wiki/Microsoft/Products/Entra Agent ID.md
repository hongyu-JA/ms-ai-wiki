---
watch: close
status: preview
last_verified: 2026-04-21
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Entra Agent ID

*Microsoft's **Identity-Primitive für AI-Agents** innerhalb der Entra-Familie. Gibt jedem Agent eine eigene Identity (kein User-Delegate), auf die Conditional Access, RBAC und Audit angewendet werden können. Grundlage für [[Agent 365]].*

> **Analogie:** Was Service Principals für Apps in Entra sind, ist Agent ID für Agents — nur mit eigener Lifecycle-Logik (Rotation, Suspend, Audit).

---

## Einsatz

**JTBD:** When I einen Agent Ressourcen zugreifen lasse, I want to nicht User-Tokens leihen, sondern eine eigene, granular gesteuerte Agent-Identity haben, so I can Least-Privilege sauber umsetzen und bei Incidents gezielt sperren kann.

**Trigger-Signale:**
- „Bot Framework hat mit App Registration gearbeitet — was ist Agent ID anders?"
- „Unser Agent braucht Graph-Zugriff, aber nicht mit User-Token, sondern mit seiner eigenen Identity."

**Empfehlung:** 🟢 nach GA — als Default für alle Produktiv-Agents ab 2026.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | Preview · GA erwartet zusammen mit [[Agent 365]] 2026-05-01 |
| **Pricing** | Teil von [[Microsoft Entra Suite]] (Teil von E7) *{TODO: Standalone-Verfügbarkeit prüfen}* |
| **Region** | *{TODO}* |

---

## Kernkonzept

Entra Agent ID erweitert den Entra-Identity-Stack um eine neue Klasse: **nicht User, nicht Service Principal, nicht Managed Identity, sondern Agent**. Unterschied zu Managed Identity: Agent IDs haben **spezialisierte Lifecycle-Events** (Agent wird retired → automatic credential revocation), **Agent-spezifische Telemetry** (welche Prompts wurden an welche Tools weitergeleitet) und **Conditional-Access-Policies, die auf Agent-Verhalten reagieren** (Rate-Limits, Anomalie-Detection).

### Kern-Fähigkeiten

1. **Agent-Registry** — Create/Read/Update/Delete für Agent-Identities
2. **Conditional Access Policies** — analog zu User-CA, erweitert um Agent-Attribute
3. **Audit-Integration** — Agent-Aktionen in Entra-Audit-Log
4. **Credential-Rotation** — automatisch + auf Demand

*{TODO: Detail-Review nach GA}*

---

## Limitierungen

- **Preview** — API-Änderungen möglich
- **Entra-Suite-Abhängigkeit** — Entra P2 + Suite-Lizenz nötig

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs (Preview) | Entra Agent ID | https://learn.microsoft.com/en-us/entra/agent-id/ *{TODO: verifizieren}* | 2026-04-21 |
| Ankündigung | Entra Blog | https://techcommunity.microsoft.com/t5/microsoft-entra-blog/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub |
