---
watch: close
status: preview
last_verified: 2026-04-22
aliases: [Microsoft Agent 365]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
  - "[[Security & Identity MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Agent 365

*Microsoft's **Governance-Control-Plane für Agents** — Identity (via [[Entra Agent ID]]), RBAC, Audit, Lifecycle, Conditional Access. **GA am 2026-05-01** (in 9 Tagen). Eigenständig $15/user/month oder Teil von [[Microsoft 365 E7]] ($99). Kritisch: **„AI Teammate"-Szenario (Agent mit Mailbox/OneDrive) bleibt Preview**, nur OBO-Flow + Registry + Lifecycle werden GA.*

> **Analogie:** Was Active Directory für User-Identities war, ist Agent 365 für Agent-Identities — mit Sponsor-Konzept, Lifecycle-Workflows und Zero-Trust-Policies speziell auf Agents zugeschnitten.

---

## Einsatz

**JTBD:** When I mehrere Agents in einer Organisation einsetze, I want to jeden Agent eine eigene Identity haben, Conditional-Access-Policies anwenden, Aktivitäten zentral auditieren und Lifecycle (create/rotate/suspend/revoke) steuern können, so I can Compliance und Security auf Agent-Ebene einhalten, ohne pro Agent zu improvisieren.

**Trigger-Signale:**
- „Wir haben jetzt drei Agents in [[Copilot Studio]] und keiner weiß mehr, wer welche Berechtigung hat."
- „Unsere Compliance-Abteilung fragt, wie wir Agent-Aktionen protokollieren."
- „Wir brauchen Conditional Access, aber der Agent ist kein User."

**Szenarien:** (1) Regulierter SMB (Finanz/Gesundheit/Anwalt) mit 3+ Agents, (2) Audit-Trail-Pflicht für Agent-Aktionen, (3) Automatisierte Rotation/Revoke bei Sponsor-Offboarding.

**Empfehlung:** 🟡 **Beobachten bis GA 2026-05-01**, danach 🟢 für Kunden mit 3+ Agents oder regulatorischem Druck.

---

## GA-Scope 2026-05-01 vs. Preview

```
┌───────────────────────────────────────────────────────────────────┐
│ GA am 2026-05-01 (General Availability)                           │
├───────────────────────────────────────────────────────────────────┤
│  ✅ On-Behalf-Of-Flow (OBO) — User-Agent-Delegation              │
│  ✅ Agent Registry im M365 Admin Center (Shadow-Agent-Discovery) │
│  ✅ Lifecycle-/Approval-Workflows (Access Packages, Expiry,      │
│     Sponsor-Transfer bei Offboarding)                             │
│  ✅ RBAC-Rollen (Agent ID Developer, Agent Registry Administrator)│
│  ✅ Conditional Access für Agents (Agent-Risk als Signal)         │
├───────────────────────────────────────────────────────────────────┤
│ 🟡 Bleibt Preview nach 2026-05-01                                 │
├───────────────────────────────────────────────────────────────────┤
│  🟡 Agent-Identity-Authentication mit eigener Mailbox/OneDrive    │
│     („AI Teammate"-Szenario — das, was in Marketing oft gezeigt  │
│     wird, ist noch nicht GA)                                      │
│  🟡 Security Posture Management für Foundry/Copilot-Studio-Agents│
│  🟡 Detection & Response (Agent 365 Tools Gateway)                │
│  🟡 Developer-SDK + agentic-user-Capabilities                     │
└───────────────────────────────────────────────────────────────────┘
```

**Fallstrick für Kunden-Briefing**: MS-Marketing sagt „GA 2026-05-01" — das bezieht sich auf **die Steuerungs-Primitive**, nicht auf das vollständige „AI Teammate"-Bild.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | Preview → **GA 2026-05-01** (Frontier-Programm) |
| **Pricing Standalone** | **$15/user/month** — **pro Human User**, Agents unter ihm sind abgedeckt (keine Per-Agent-Lizenz!) |
| **In E7 Bundle** | inkludiert in [[Microsoft 365 E7]] ($99/user/month) |
| **EUR-Preis** | *{UNCLEAR: nicht offiziell publiziert}* |
| **Voraussetzung Frontier-Aktivierung** | M365 Copilot-Lizenz im Tenant + Modern Billing + Terms-Akzeptanz |
| **EU-Regionen** | *{UNCLEAR: keine spezifische Agent-365-Region-Matrix publiziert — läuft auf M365/Entra/Purview/Defender-Infrastruktur und fällt unter EU Data Boundary}* |

### Lizenz-Stack für vollen Governance-Funktionsumfang

```
           ┌─────────────────────────────────────┐
           │ M365 Copilot-Lizenz                 │
           │ (Frontier-Gate-Pflicht)             │
           └─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────────────────┐
           │ Entra ID P2                         │
           │ (für Access Packages +              │
           │  Lifecycle Workflows)               │
           └─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────────────────┐
           │ Microsoft Entra Suite (empfohlen)   │
           │ (Conditional Access Advanced +      │
           │  ID Governance)                     │
           └─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────────────────┐
           │ Agent 365 (standalone $15 oder      │
           │  in E7 $99)                         │
           └─────────────────────────────────────┘
```

---

## Kernkonzept

### Identity-Modell — vier neue Entra-Objekt-Typen

Agent 365 ist **nicht** einfach Service Principal + Label. Es bringt **vier völlig neue Objekttypen** in den Entra-Stack:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Agent Identity Blueprint                                     │
│    Die "Klasse" eines Agents — definiert welche Scopes,         │
│    welche CA-Policies, welcher Sponsor-Pool.                    │
├─────────────────────────────────────────────────────────────────┤
│ 2. Agent Identity Blueprint Principal                           │
│    Service-Principal-ähnliches Objekt zur Token-Akquise         │
│    FÜR den Blueprint (nicht pro Agent-Instanz).                 │
├─────────────────────────────────────────────────────────────────┤
│ 3. Agent Identity                                               │
│    Die konkrete Instanz — ephemer, kann tausende Male pro       │
│    Minute erzeugt werden. Hat KEINE eigenen Credentials;        │
│    bekommt Tokens vom Blueprint-Principal.                      │
├─────────────────────────────────────────────────────────────────┤
│ 4. Agent User                                                   │
│    Wenn Agent als "Teammate" auftritt (Mailbox, OneDrive —      │
│    Preview). Mensch-ähnliches Identity-Objekt mit User-Scope.   │
└─────────────────────────────────────────────────────────────────┘
```

**Unterschied zu Service Principal**: statisch, lange-lebend, eigene Secrets. Agent Identity: ephemer, massenhaft, Blueprint-basiert, keine Secret-Rotation pro Agent.

### Sponsor-Konzept (DSGVO-relevant)

Jeder Agent hat einen **Sponsor** = verantwortliche **natürliche Person**. Wenn der Sponsor aus der Firma geht, wird der Agent automatisch an den Manager übertragen (oder gemäß Offboarding-Policy deaktiviert). Das ist der **Mechanismus für DSGVO Art. 5 Abs. 2 Rechenschaftspflicht** auf Agent-Ebene.

### Kern-Fähigkeiten

| Fähigkeit | GA-Status | Details |
|-----------|-----------|---------|
| **Agent Registry** | GA | Single-pane-Inventory: Entra-Agents + self-registered + erkannte Shadow-Agents. Attribute: Name, Sponsor/Owner, Publisher, Framework, Permissions, Status |
| **RBAC-Rollen** | GA | **Agent ID Developer** (voll-Lifecycle für Blueprints/Identities/agentic users) · **Agent Registry Administrator** (Metadaten im Admin Center) |
| **Conditional Access für Agents** | GA | CA-Policies targeting Agents; **„agent risk"** als neues Signal (Frequenz, Location, anomales Tool-Nutzungsmuster) |
| **Audit + Purview-Integration** | GA | Alle Agent-Auth + Activity in Entra-Logs, Agent 365 Dashboard konsolidiert Purview-Compliance + Defender-Threat-Signale |
| **Lifecycle-Management** | GA | Access Packages mit Expiry · Sponsor-Notifications · Auto-Transfer an Manager bei Offboarding · Auto-Expiry inaktiver Agents · Flagging ownerless · Block risky |
| **AI-Teammate Szenario** | 🟡 Preview | Agent mit eigener Mailbox + OneDrive (das Marketing-Bild); bleibt Preview nach GA |
| **Security Posture Mgmt** (für Foundry/Copilot-Studio-Agents) | 🟡 Preview | — |
| **Runtime-Threat-Protection via Agent 365 Tools Gateway** | 🟡 Public Preview seit April 2026 | Defender-Integration |

---

## Integration mit bestehenden Produkten

```
┌────────────────────────────────────────────────────────────────────┐
│  Agent 365 — Governance Layer (horizontal über alle Agent-Sources) │
└────────────────────────────────────────────────────────────────────┘
             │            │            │            │
             ▼            ▼            ▼            ▼
   ┌───────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │ Foundry Agent │ │ Copilot  │ │ MAF-Self-│ │ 3rd-Party /  │
   │ Service       │ │ Studio   │ │ Hosted   │ │ OSS Agents   │
   │               │ │          │ │ (ACA/    │ │ (unter Entra)│
   │ auto-register │ │ auto-    │ │ Functions│ │              │
   │ on publishing │ │ assign   │ │ /Teams)  │ │ manual       │
   │ → Blueprint + │ │ when     │ │          │ │ register     │
   │   Identity    │ │ enabled  │ │          │ │              │
   └───────────────┘ └──────────┘ └──────────┘ └──────────────┘
```

**Cross-Platform-Reichweite**: Agent 365 verwaltet Agents aus [[Copilot Studio]], [[Power Automate]], [[Foundry Agent Service]] sowie 3rd-Party-Frameworks, solange sie unter Entra ID registriert sind.

### [[Entra Agent ID]] — separate Nutzbarkeit?

**Nein.** MS positioniert Entra Agent ID explizit als Teil von Agent 365. Zugang ging bis 2026-05-01 nur via Frontier-Programm (M365 Copilot-Lizenz nötig); ab GA ersetzt eine Agent-365-$15-Lizenz oder E7 das Frontier-Gating.

---

## Abgrenzungen

| Frage | Agent 365 | Alternative |
|-------|-----------|-------------|
| „Agent braucht Identity für Graph-Zugriff" | ✅ Agent Identity | oder klassische Entra App Registration (ohne Sponsor, ohne Audit, ohne Registry) — nicht skaliert |
| „Wir brauchen Runtime-Schutz gegen Prompt-Injection" | **nein** — das ist [[Defender for AI]] | Beide koexistieren: Agent 365 konsumiert Defender-Alerts im Registry |
| „Power-Platform-Env-Governance" | Power Platform Admin Center bleibt für Env/DLP/Connectors | Agent 365 greift ab Publishing-Registrierungs-Event |
| „Nur ein Agent im Unternehmen" | 🟡 Overkill | Einzelne Entra App Registration |

---

## Compliance-Positionierung

- **DSGVO** — Sponsor = natürliche Person = Art. 5 Abs. 2 Rechenschaftspflicht; Audit-Logs = Nachweis
- **EU AI Act (ab August 2026)** — Agent 365 liefert **Bausteine** für technische Compliance-Kontrollen bei High-Risk-Systemen (kein Pauschal-Zertifikat, MS garantiert keinen AI-Act-Compliance-Stempel)
- **NIS2** — Protokollierung + Vorfallsmeldung: Audit-Log + Defender-Integration decken das ab
- **Regulierte Branchen** — Finanz (BaFin, FINMA), Gesundheit, Öffentlicher Sektor als Erstkunden erwartet

---

## Limitierungen & Fallstricke

### Harte Grenzen (Stand April 2026)

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **„AI Teammate" (Mailbox/OneDrive) NOT GA** am 2026-05-01 | In Kunden-Briefings explizit abgrenzen; Standardszenario bleibt OBO + Agent ohne eigene Mailbox |
| **Runtime-Threat-Protection** (Tools Gateway) Preview | Kombi mit [[Defender for AI]] direkt |
| **Agent-Risk-CA-Signal** neu — Fehldetektions-Raten noch nicht publiziert | Logging-Modus vor Enforcement |
| **Max Anzahl Agent Identities pro Tenant** *{UNCLEAR}* | Dokumentation erwähnt „scale and ephemerality", keine harten Limits publiziert |
| **Shadow-AI-Discovery** nur bedingt (nur was durch Purview/Defender-Sensoren erfasst wird) | Ergänzende Auto-Discovery-Tools |

### Typische Fallstricke

- **Marketing vs. GA-Scope verwechseln** — das „AI Teammate"-Bild ist nicht GA. *Gegenmittel: dieses Dokument für Kunden-Briefing nutzen.*
- **Agent 365 als Ersatz für Defender for AI sehen** — sind komplementär (Governance vs. Runtime-Schutz).
- **Frontier-Aktivierung vergessen** — Tenant braucht M365-Copilot-Lizenz + Frontier-Enable, bevor Agent 365 provisionierbar ist.
- **Sponsor-Rolle undefiniert** — ohne klaren Sponsor bleibt der Agent „ownerless" und wird im Lifecycle geflagged.

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | Microsoft Agent 365 | https://www.microsoft.com/en-us/microsoft-agent-365 | 2026-04-22 |
| Docs Overview | Agent 365 Overview | https://learn.microsoft.com/en-us/microsoft-agent-365/overview | 2026-04-22 |
| Docs Capabilities | Protect Agent Identities with Entra | https://learn.microsoft.com/en-us/microsoft-agent-365/admin/capabilities-entra | 2026-04-22 |
| Docs Entra Agent ID | What are Agent Identities? | https://learn.microsoft.com/en-us/entra/agent-id/identity-platform/what-is-agent-id | 2026-04-22 |
| Docs Governance | Governing Agent Identities (Preview) | https://learn.microsoft.com/en-us/entra/id-governance/agent-id-governance-overview | 2026-04-22 |
| Docs Best Practices | Entra Agent ID Best Practices | https://learn.microsoft.com/en-us/entra/agent-id/best-practices-agent-id | 2026-04-22 |
| Docs Registry | Agent Registry in M365 Admin | https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-registry?view=o365-worldwide | 2026-04-22 |
| Docs Copilot Studio Integration | Auto-create Entra Agent Identities | https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities | 2026-04-22 |
| Docs Foundry Integration | Agent Identity in Foundry | https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/agent-identity | 2026-04-22 |
| Blog Ankündigung | Frontier Suite 09.03.2026 | https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/ | 2026-04-22 |
| Blog Security | Secure Agentic AI for Frontier | https://www.microsoft.com/en-us/security/blog/2026/03/09/secure-agentic-ai-for-your-frontier-transformation/ | 2026-04-22 |
| Tech Community | Agent 365 GA Announcement | https://techcommunity.microsoft.com/discussions/agent-365-discussions/agent-365-will-be-generally-available-on-may-1-2026/4500380 | 2026-04-22 |
| DevBlog | From Innovation to Enterprise Trust | https://devblogs.microsoft.com/microsoft365dev/from-innovation-to-enterprise-trust-with-microsoft-agent-365/ | 2026-04-22 |
| M365 Roadmap | ID 558940 | https://www.microsoft.com/en-us/microsoft-365/roadmap?id=558940 | 2026-04-22 |
| Analyst | Licensing.Guide — May 1 GA not final | https://licensing.guide/may-1-ga-is-not-yet-the-final-frontier-for-agent-365/ | 2026-04-22 |
| Analyst | SAMexpert Agent 365 Licensing | https://samexpert.com/agent-365/ | 2026-04-22 |
| Analyst | Oasis Security — Agent 365 vs Classic Identity | https://www.oasis.security/blog/agent-365-oasis-for-ai-agent-governance | 2026-04-22 |

---

## UNCLEAR

1. EUR/CHF-Preise für Agent 365 standalone ($15 USD bekannt)
2. EU-Regionen-Matrix für Agent 365 zum Tag 1
3. Backward-Compat: was passiert mit Preview-Agents bei GA-Switch?
4. Formale Lifecycle-State-Machine (Provisioned → Active → Deprecated → Retired) — nicht in Docs benannt
5. Max Agent Identities pro Tenant
6. CA-Agent-Risk-Signal Fehldetektions-Quote (Logging-Modus vor Enforcement)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Kompletter Ausbau: GA-Scope-Diagramm (was GA, was bleibt Preview), Identity-Modell (4 neue Entra-Objekttypen), Sponsor-Konzept als DSGVO-Artefakt, Lizenz-Stack, Integration-Diagramm, Compliance-Positionierung (DSGVO/EU-AI-Act/NIS2), 17 Primary-Quellen | Learn + Blogs + Analysten |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
