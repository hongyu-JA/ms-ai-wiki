---
watch: close
status: preview
last_verified: 2026-04-21
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
  - "[[Security & Identity MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Agent 365

*Microsoft's **Governance-Control-Plane für Agents** — Identity, RBAC, Conditional Access, Audit, Lifecycle-Management. GA **2026-05-01**. Für regulierte und größere Kunden Pflicht, sobald mehrere Agents im Einsatz sind. Nutzt [[Entra Agent ID]] als Identity-Primitive.*

> **Analogie:** Was Active Directory für User-Identities war, ist Agent 365 für Agent-Identities.

---

## Einsatz

**JTBD:** When I mehrere Agents in einer Organisation einsetze, I want to jeden Agent eine Identity haben, Conditional-Access-Policies anwenden, Aktivitäten zentral auditieren und Lifecycle (create/rotate/revoke) steuern können, so I can Compliance und Security auf Agent-Ebene einhalten, ohne pro Agent zu improvisieren.

**Trigger-Signale:**
- „Wir haben jetzt drei Agents in Copilot Studio und keiner weiß mehr, wer welche Berechtigung hat."
- „Unsere Compliance-Abteilung fragt, wie wir Agent-Aktionen protokollieren."
- „Wir brauchen Conditional Access, aber der Agent ist kein User."

**Szenarien:** (1) Regulierter SMB (Finanz/Gesundheit) mit 3+ Agents, (2) Audit-Trail-Pflicht für Agent-Aktionen, (3) Rotation von Agent-Credentials automatisieren.

**Empfehlung:** 🟡 **Beobachten** bis GA 2026-05-01, dann 🟢 für Kunden mit 3+ Agents oder Compliance-Druck.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | Preview (im Wave-3-Programm), **GA 2026-05-01** |
| **Pricing** | In [[Microsoft 365 E7]] enthalten; standalone Preis *{TODO: recherchieren}* |
| **Bundle** | E7 ($99/user/month) bündelt es mit E5 + Copilot + Entra Suite |
| **Region** | *{TODO: EU-Availability zu GA klären}* |
| **Voraussetzung** | [[Microsoft Entra Suite]] (Teil von E7) |

---

## Kernkonzept

### Was es im Kern ist

Agent 365 adressiert das Problem: **Agents sind keine User**, aber sie handeln im Tenant. Ohne eigene Identity, ohne Conditional Access, ohne Audit-Trail wird eine 3-Agent-Organisation schnell ungovernable. Agent 365 ist Microsoft's Antwort.

Zentrale Primitive: **Agent-Identity** (via Entra Agent ID — separate Identity-Klasse), **Agent-RBAC** (welcher Agent darf welche Ressource), **Conditional Access für Agents** (z.B. „Agent X darf Dataverse nur in Arbeitszeiten schreiben"), **Audit-Log** (jede Agent-Aktion in einheitlichem Log), **Lifecycle** (Create / Rotate / Suspend / Revoke).

### Kern-Fähigkeiten

1. **Agent-Identity-Registry** — jeder Agent bekommt seine eigene Identity (nicht User-Identity geliehen)
2. **Conditional Access für Agents** — Policy-Framework analog zu User-CA
3. **Audit-Trail** — zentrale Agent-Aktivitäts-Logs (via Purview / Defender integrierbar)
4. **Lifecycle-Management** — Rotate Credentials, Suspend on Anomalie, Revoke

*{TODO: Deep-dive auf jede Fähigkeit nach GA-Announcement im Mai 2026}*

---

## Limitierungen & Fallstricke

- **Pre-GA (Stand 2026-04)** — API-Änderungen bis 2026-05-01 möglich
- **E7-Lock-in** — aktuell nur via Entra Suite, die Teil von E7 ist. SMB-Kunden ohne E7 haben noch keinen günstigen Pfad *{TODO: Standalone-Preis bei GA recherchieren}*
- **Fallstrick:** „Agent 365 ersetzt Copilot Studio" — tut es nicht, es ist Governance-Layer über allen Agents. *Gegenmittel: in jeder Kunden-Demo explizit abgrenzen.*

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Ankündigung | Microsoft Blog Agent 365 | https://blogs.microsoft.com/ *{TODO: Ankündigung-URL}* | 2026-04-21 |
| Docs | Agent 365 Overview (Preview) | https://learn.microsoft.com/en-us/agent-365/ *{TODO: verifizieren}* | 2026-04-21 |
| Roadmap | M365 Roadmap (Agent 365-Einträge) | https://www.microsoft.com/microsoft-365/roadmap | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub, watch: close, GA 2026-05-01 erwartet |
