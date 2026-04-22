---
watch: close
status: preview
research_depth: deep
last_verified: 2026-04-22
aliases: [Microsoft Entra Agent ID, Entra Agent, Entra Agent Identity Platform]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Entra Agent ID

*Microsoft's **Identity-Primitive für AI-Agents** — ein eigener Entra-Objekt-Klassen-Baum (Blueprint, Blueprint Principal, Agent Identity, Agent User) für nicht-menschliche Prinzipale. **Nicht** das neue Agent 365, sondern die **darunterliegende Identity-Plane**, auf der [[Agent 365]] seine Governance-UI aufsetzt. Gibt jedem Agent eine eigene, massen-skalierbare Identity mit eigener Lifecycle-Logik, eigener Conditional-Access-Semantik und eigenen Risk-Signals — statt User-Token zu leihen oder Service-Principals zweckzuentfremden.*

> **Analogie:** Was Service Principals für App-Services waren (statisch, langlebig, manuell provisioniert), ist Entra Agent ID für AI-Agents (ephemer, massenhaft, Blueprint-basiert). Oder: Service Principal verhält sich zu Agent Identity wie VM zu Container.

---

## Einsatz

### Job-to-be-done

When I einen AI-Agent Zugriff auf Unternehmens-Ressourcen gebe, I want to weder User-Tokens leihen (macht Audit unmöglich, verletzt Least-Privilege) noch Service-Principals als Agent-Stand-Ins missbrauchen (statisch, kein Sponsor, keine Agent-spezifische Risk-Detection), so I can jeden Agent **individuell auditieren, suspendieren und mit Agent-spezifischen CA-Policies belegen** — auch wenn pro Tag tausende Agent-Instanzen aus einem Blueprint entstehen.

### Trigger-Signale

- *„Bot Framework hat mit App Registration gearbeitet — was ist Agent ID anders?"*
- *„Unser [[Copilot Studio]]-Agent braucht Graph-Zugriff, aber nicht mit meinem User-Token — ich will, dass Logs zeigen **der Agent** hat's gemacht, nicht ich."*
- *„Compliance fragt: wer ist verantwortlich, wenn der Agent Mist baut?"* → Sponsor-Konzept
- *„Wir haben jetzt 40 Copilot-Studio-Agents, keiner weiß mehr welche Berechtigungen welche Agent hat."* → Registry
- *„Ein Agent hat angefangen, Mitternacht Graph abzufragen — das ist neu."* → ID Protection for Agents

### Einsatz-Szenarien

1. **Copilot-Studio-Mehrwertplattform mit >5 Agents** — wenn Kunde via [[Copilot Studio]] produktive Agents baut, schaltet „Automatically create Entra agent identities" die Agent-ID-Provisionierung an. Entra Agent ID wird der **natürliche Audit-Punkt** statt dass jeder Agent als namenslose App-Registration im Tenant floated.

2. **[[Foundry Agent Service]]-Deployment** — Foundry provisioniert Agent Identities **automatisch** beim Publishing. Der Consultant braucht Entra Agent ID Wissen, um dem Kunden Least-Privilege-Scoping auf Blueprint-Ebene zu empfehlen (statt Breitband-Graph-Permissions).

3. **Multi-Tenant-ISV mit SaaS-Agent** — Anbieter-Szenario: Ein Software-Haus bietet einen Agent als Service. Multitenant-Blueprint wird in Kunden-Tenants installiert → Kundenseitig sauberer Audit-Trail, anbieterseitig zentrale Credential-Verwaltung. *(Journai aktuell nicht relevant.)*

4. **Regulierte Branchen (FINMA/BaFin/Gesundheit)** — DSGVO-Art.-5-Abs.-2-Rechenschaftspflicht verlangt, dass jede Agent-Aktion einem verantwortlichen Menschen zuordenbar ist. Sponsor = natürliche Person auf Agent Identity ist der **technische Erfüllungs-Mechanismus**.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | M365 Copilot-Lizenz + Frontier-Programm aktiviert. [[Entra ID P2]] für Lifecycle-Workflows & Access Packages. [[Microsoft Entra Suite]] empfohlen für Conditional-Access-Advanced. Ab GA 2026-05-01 alternativ [[Agent 365]] $15 standalone oder [[Microsoft 365 E7]]. |
| **Tenant / Infrastruktur** | Entra-ID-Tenant, M365 Admin Center Zugang, Copilot-Frontier-Toggle aktiviert (Billing Admin nötig). |
| **Skills / Rollen** | **Identity-Admin** der OAuth-Flows & Blueprint-Design versteht (nicht nur Entra-Basics). **Conditional Access Administrator** für Agent-Policies. **Security Reader/Operator** für Risky-Agent-Report. |
| **Compliance-Rahmen** | Sponsor-Konzept in HR-Prozess verankern (Joiner/Mover/Leaver muss Agent-Sponsor-Transfer triggern). |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 3–5 Tage Consulting für sauberen Blueprint-Katalog (custom security attributes, Sponsor-Policy, CA-Policies im Report-Only) — vor dem ersten produktiven Agent. |
| **Laufende Lizenzkosten** | Ab GA: in [[Agent 365]] ($15/User/Monat) oder [[Microsoft 365 E7]] ($99) enthalten. Bis dahin Frontier-gegated (erfordert M365 Copilot). [[Entra ID P2]] für Governance bleibt separat (~$9/User/Monat) bzw. via [[Microsoft Entra Suite]]. |
| **Laufender Betrieb** | Monatlicher Access-Review + quartalsweiser Orphan-Agent-Check: 2–4 h/Monat für SMB mit <50 Agents. Lifecycle-Workflows automatisieren Sponsor-Transfer, Rest ist Monitoring. |

### Empfehlung

**Status:** 🟡 **Beobachten bis GA 2026-05-01** — danach 🟢 **als Default-Identity-Schicht für alle produktiven Agents**, sobald Kunde >3 Agents hat oder in regulierter Branche arbeitet.

Begründung: Die Architektur (Blueprint + Identity + Sponsor) ist technisch überzeugend und adressiert echte Lücken von Service Principals. **Aber** die Kern-Preview-Warnings sind noch aktiv, das Frontier-Gate schließt Kunden ohne M365 Copilot bis GA aus, und die ID-Protection-Detections sind alle „offline" (d.h. Batch, keine Real-Time-Enforcement).

**Nächster Schritt für Journai:** PoC-Blueprint mit einem Frontier-tauglichen Pilotkunden (1 Copilot-Studio-Agent + Autom-Entra-Identity-Toggle) bis Ende Q2 2026, damit wir **vor dem Agent-365-GA-Hype** Praxis-Wissen haben und nicht aus Doku beraten müssen. Parallel: interner Blueprint-Template-Katalog für DACH-SMB-Standardszenarien (Customer-Support-Agent, Finance-Report-Agent, HR-Onboarding-Agent) als Vorbereitung.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **Public Preview** (Stand 2026-04-22) — alle Docs tragen expliziten Preview-Disclaimer |
| **GA-Datum** | **Erwartet zusammen mit [[Agent 365]] am 2026-05-01**, ABER: Entra Agent ID ist **nicht monolithisch**. Kern-Primitive (Agent Identity, Blueprint, OBO-/Client-Credentials-Flow, CA für Agents, Registry) gehen wohl GA. Sub-Features (Agent User mit Mailbox/„AI Teammate", ID Protection for Agents, Access Packages für Agents, Lifecycle-Workflows) tragen weiterhin Preview-Labels in den Docs — unklar ob alle davon am 2026-05-01 GA werden. *{UNCLEAR: genaue GA-Scope-Liste für Sub-Features}* |
| **Standalone-Preis** | **Nicht standalone verkauft.** Entra Agent ID ist Plattform-Feature; Gate läuft über M365 Copilot + Frontier (Preview) bzw. [[Agent 365]]-Lizenz (GA). ID Protection for Agents explizit „included with Entra P2 while in preview". |
| **Standalone EUR/CHF** | N/A — keine Standalone-SKU. |
| **Lizenz-Bundle** | Preview-Zugang: M365 Copilot + Frontier-Opt-In. GA-Zugang: [[Agent 365]] ($15/User) oder [[Microsoft 365 E7]] ($99/User). [[Entra ID P2]] für Governance-Features. |
| **Voraussetzung** | Billing Admin muss Frontier-Toggle in M365 Admin Center > Copilot > Settings > User Access > Copilot Frontier aktivieren. |
| **Region-Verfügbarkeit** | Läuft auf Entra-ID-Infrastruktur → **erbt EU Data Boundary** aus Entra ID (customer data für EU/EFTA-Tenants wird in EU Data Boundary gespeichert, mit Entra-typischen Ausnahmen). **Keine Agent-ID-spezifische Regionen-Matrix publiziert** *{UNCLEAR: ob Preview-Traffic denselben EU-Boundary-Regeln folgt oder ausgenommen ist — Preview-Services historisch häufig unter den „temporarily excluded" Services}*. |
| **CSP-Promo** | Keine bekannt. |
| **Hidden Costs** | [[Entra ID P2]] nötig für Access Packages, Lifecycle Workflows, ID Protection (und damit Agent-Risk-Signal). Ohne P2 hat man Agent Identity, aber halbes Governance. |
| **Upgrade-Pfad** | Bestehende Copilot-Studio-Agents ohne Entra-Agent-Identity müssen nach Toggle-Umlegung **neu provisioniert** werden, um eine Agent Identity zu erhalten — alte Agents laufen weiter als App-Registration ohne Blueprint. Migration ist nicht dokumentiert. *{UNCLEAR: automatische Migration oder manuelle Re-Provisionierung bei GA?}* |

---

## Kernkonzept

### Was es im Kern ist

Entra Agent ID ist **keine neue Entra-Suite-Feature** und **kein neues Admin-Portal** — es ist eine **neue Objekt-Klasse im Entra-Directory-Schema**, nämlich vier miteinander verwandte Typen (Blueprint, Blueprint Principal, Agent Identity, Agent User) plus die dazugehörigen OAuth-Flows, CA-Integration und Audit-Log-Erweiterungen. Es sitzt **unterhalb** der Agent-365-Control-Plane: Agent 365 gibt den Admins die konsolidierte UI (Agent Registry, Dashboard), Entra Agent ID liefert die Identity-Plumbing darunter.

Das zentrale Design-Prinzip ist die **Blueprint-Instance-Trennung**: Credentials, Permissions und CA-Policies leben auf dem **Blueprint** (langlebig, stabil), die tatsächlich authentifizierenden **Agent Identities** sind ephemer (Minuten-Lebensdauer, tausendfach pro Tag erzeugbar) und haben **keine eigenen Credentials** — sie holen Tokens über einen mehrstufigen `jwt-bearer`-Impersonation-Flow vom Blueprint. Das ist die Antwort auf die Haupt-Schwäche von Service Principals bei Agents: Service Principals sind 1:1-statisch, ein Million-Agent-Szenario würde ihr RBAC-Modell zerschießen.

Die zweite Wette ist das **Sponsor-Konzept**: Jede Agent Identity hat einen verantwortlichen **Menschen** (keine Gruppe, keine Service-Identity) als Sponsor — konzeptionell analog zu einem „Account-Manager" für den Agent. Bei Ausscheiden des Sponsors geht die Verantwortung automatisch auf dessen Manager über (via Lifecycle Workflows). Das ist der **DSGVO-Art.-5-Abs.-2-Rechenschaftspflicht-Anker** auf Agent-Ebene — und genau das, was bisher bei Service Principals fehlte und worunter Compliance-Teams litten.

Die dritte Design-Entscheidung, unterschätzt aber folgenreich: **Agents sind confidential clients ohne interaktive Flows**. Kein `/authorize`-Endpoint, keine Redirect-URLs, keine Public-Client-Capabilities. Das zwingt alle Agent-Auth-Flows in programmatic token exchanges — und macht Interactive-MFA für Agents konzeptionell unmöglich (was Microsoft explizit festhält: „agents can't satisfy interactive controls like MFA, so create separate policies").

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert |
|-------|-------|------------------|
| **Governance-UI / Registry** | Single Pane für Admins: Agent-Liste, Lifecycle-State, Shadow-AI-Discovery | [[Agent 365]] + M365 Admin Center |
| **Governance-Primitive** | Access Packages, Lifecycle Workflows, Access Reviews, Sponsor-Transfer | Entra ID Governance (P2) |
| **Identity-Plane** | **Entra Agent ID** — Blueprint, Blueprint Principal, Agent Identity, Agent User, OAuth-Flows | **Diese Note** |
| **Zero-Trust-Enforcement** | Conditional Access für Agents + ID Protection for Agents (Risky-Agent-Signals) | Entra ID P1 (CA), P2 (ID Protection) |
| **Token Exchange Endpoint** | `AAD Token Exchange Endpoint: Public` (Resource ID `fb60f99c-7a34-4190-8149-302f77469936`) für Blueprint→Identity-Impersonation | Microsoft Identity Platform |
| **Audit** | `agentSignIn` Resource Type in Sign-in Logs; Audit-Logs re-used (Create user, Create service principal, Delete application) | Entra Monitoring |

### Kern-Fähigkeiten

#### Vier neue Entra-Objekttypen

Das Herzstück von Entra Agent ID. Nicht ein Typ, sondern vier — und das Verstehen der Beziehungen ist der Kern-Hebel für Beratung:

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Agent Identity Blueprint                                      │
│    - Template/Klasse eines Agent-Typs                            │
│    - Hält: Credentials, OAuth-Permissions, OptionalClaims,       │
│      App Roles, Verified Publisher, Description                  │
│    - Langlebig, stabil, zentraler Credential-Rotations-Punkt     │
│    - Spezial-Permission: AgentIdentity.CreateAsManager           │
│    - Schema: Microsoft Graph /beta agentIdentityBlueprint        │
├──────────────────────────────────────────────────────────────────┤
│ 2. Agent Identity Blueprint Principal                            │
│    - Service-Principal-ähnliches Objekt zur Token-Akquise FÜR    │
│      den Blueprint (nicht pro Agent-Instanz!)                    │
│    - Entsteht beim Install eines Blueprints im Tenant            │
│    - Einzige Aufgabe: provision/deprovision Agent Identities     │
│    - Multitenant-Szenario: ein Blueprint Principal pro Tenant,   │
│      wo der Blueprint installiert ist                            │
├──────────────────────────────────────────────────────────────────┤
│ 3. Agent Identity                                                │
│    - Die konkrete, ephemere Agent-Instanz                        │
│    - KEINE eigenen Credentials                                   │
│    - Holt Tokens via jwt-bearer-Flow vom Blueprint-Principal     │
│    - Erbt OAuth-Delegated-Scopes vom Blueprint                   │
│    - Eigene zusätzliche Resource-Access via Access Packages      │
│    - Im Audit-Log: erscheint als „Create service principal"      │
├──────────────────────────────────────────────────────────────────┤
│ 4. Agent User                                                    │
│    - Optional: wenn Agent als „User" auftritt (Mailbox,          │
│      Teams-Präsenz, OneDrive) — „AI Teammate"-Szenario           │
│    - 1:1-Beziehung zu einer Agent Identity                       │
│    - Im Audit-Log: erscheint als „Create user"                   │
│    - Bleibt auch am 2026-05-01 im Preview-Status                 │
└──────────────────────────────────────────────────────────────────┘
```

**Abgrenzung zu klassischen Entra-Objekten**:

| Aspekt | Service Principal | Managed Identity | Agent Identity |
|--------|-------------------|------------------|----------------|
| Lifecycle | lang-lebend, manuell | an Azure-Resource gebunden | ephemer, Blueprint-basiert |
| Credential | eigene (Secret/Cert) | Plattform-managed | **keine eigenen** — Token via Blueprint |
| Sponsor | nein | nein | **Pflicht: natürliche Person** |
| Skalierung | 1:1 | 1:Azure-Resource | 1:N ab einem Blueprint, massen-skalierbar |
| Interactive Auth | möglich | nein | **explizit verboten** |
| Shadow-Discovery | nein | nein | **ja**, via Copilot-Studio-Channel |

#### OAuth-Flows — Impersonation über Federated Identity Credentials

Alle Agent-Auth-Flows nutzen OAuth 2.0 mit einem Kunstgriff: der Blueprint **impersoniert** die Agent Identity über einen mehrstufigen Token-Tausch. Der Blueprint-Principal hat Federated Identity Credentials (FIC) → holt Token vom AAD Token Exchange Endpoint → reicht den Token weiter an die Agent Identity, damit diese Resource-Tokens anfordern kann.

**Drei Flows sind supported**:

1. **Agent on-behalf-of Flow** (interaktive Agents): Klassischer OBO. User authentifiziert sich, Agent bekommt User-Scoped-Token. Unterschied zum normalen OBO: auf beiden Enden (Blueprint → Identity → Resource) können CA-Policies greifen.
2. **Autonomous App Flow** (Client Credentials): Agent agiert ohne User-Kontext; App-only Permissions auf dem Blueprint. Am häufigsten in Produktion.
3. **Agent's User Account Flow** (Agent User): Agent tritt als „Teammate" auf, eigene Mailbox. Token basiert auf Agent User Principal statt Service Principal.

**Explizit nicht supported**: `/authorize`-Endpoint-basierte Interactive Flows, Public Client, Redirect URIs. → Kein Browser-Popup-Login für Agents, nie.

**Empfohlene Credential-Hierarchie** (aus MS Best-Practices):
1. **Federated Identity Credentials + Managed Identity** (keine Secrets überhaupt)
2. **Client Certificate** (privater Key in Key Vault)
3. **Client Secret** — nur Dev/Test, **nie Produktion**

Microsoft empfiehlt dringend, nicht manuell zu implementieren, sondern **Microsoft.Identity.Web** / **Microsoft Entra SDK for Agent ID** (aka.ms/entra/sdk/agentid) zu nutzen.

#### Conditional Access für Agents

Echtes Agent-aware CA — nicht nur „workload identity"-Filter wiederverwendet.

**Assignment-Scopes** (wer?):
- Alle Agent Identities im Tenant
- Spezifische Agent Identities via `objectId`
- Agent Identities mit bestimmten **Custom Security Attributes** (z.B. `Environment=Prod`, `DataSensitivity=PII`)
- Agent Identities **gruppiert nach Blueprint** (Blueprint-Target = alle Instanzen)
- Alle Agent Users

**Target Resources** (wo hin?):
- Alle Resources
- Alle Agent Resources (Agent→Agent-Flows!)
- Resources nach Custom Security Attribute oder `appId`
- Agent Blueprints

**Conditions**:
- **Agent Risk** (High / Medium / Low) — kommt aus [[Entra ID Protection]] for Agents
- Keine Device Compliance, keine MFA, keine Named Locations als Primär-Condition (sind für Agents sinnlos)

**Grant Controls**: Nur **Block**. Kein Grant-with-MFA, kein Require-Compliant-Device. → CA für Agents ist **binär** (allow/deny), nicht konditional im User-Sinn.

**Wo CA NICHT greift** (Fallstrick):
- Blueprint → Graph (Create Agent Identity) — bewusst, sonst könnte man die Agent-Erzeugung nicht mal auditieren
- Blueprint/Identity → `AAD Token Exchange Endpoint` (interne Impersonation)
- Wenn Security Defaults aktiv sind

**Kritische Empfehlung**: Bestehende „All users must MFA"-Policies müssen **refactored** werden, um Agents explizit auszuschließen (Agents können MFA nicht erfüllen → blockieren silent), und durch dedizierte Agent-Policies ergänzt werden.

#### Identity Protection for Agents — Risky Agent Detection

In Preview, inkludiert in [[Entra ID P2]]. **Alle Detections sind offline (Batch)** — keine Real-Time-Enforcement bei Sign-in. Agent wird retroaktiv geflagged, CA-Policy greift erst beim **nächsten** Token-Request.

**6 Detection-Typen**:

| Detection | riskEventType | Beschreibung |
|-----------|---------------|--------------|
| **Unfamiliar Resource Access** | `unfamiliarResourceAccess` | Agent zielt auf Ressourcen, die er normalerweise nicht anfragt |
| **Sign-in Spike** | `signInSpike` | Auffällig viele Sign-ins vs. Baseline |
| **Failed Access Attempt** | `failedAccessAttempt` | Token-Replay gegen unautorisierte Resource |
| **Sign-in by Risky User** | `riskyUserSignIn` | OBO-Flow mit kompromittiertem User |
| **Admin Confirmed Compromised** | `adminConfirmedAgentCompromised` | Manuelle Eskalation |
| **Microsoft Entra Threat Intelligence** | `threatIntelligenceAccount` | MS-interne Threat-Intel-Korrelation |

**Retention**: 90 Tage für Risk Detections (reviewable unter ID-Protection-Menu).

**Kritische Einordnung**: „offline" ist das zentrale Caveat. Prompt-Injection in Echtzeit erkennt das hier nicht — dafür ist [[Defender for AI]] Runtime-Protection zuständig. Die beiden Systeme sind komplementär, nicht überlappend.

#### Governance — Access Packages, Sponsor-Transfer, Access Reviews

Via [[Entra ID Governance]] (P2-Lizenz). Nicht Agent-ID-spezifisch eingebaut, sondern um Agent-Identity-Typ erweitert.

**Access Packages für Agents**:
- Security-Group-Memberships
- Application OAuth API Permissions (inkl. Graph App-Permissions)
- Entra Roles
- Assignment via drei Pfade: Agent selbst (programmatisch!), Sponsor-on-behalf-of, Admin-Direct-Assign
- **Expiry-Workflow**: 6-12 Monate typisch; 30 Tage vorher Sponsor-Notification, Extension möglich, sonst Auto-Expire

**Sponsor-Auto-Transfer** (Lifecycle Workflows):
- Sponsor verlässt Org → Agent wird automatisch auf dessen Manager übertragen
- Cosponsor-Notifications
- Co-Sponsor-Eskalation wenn Manager nicht reagiert
- **DSGVO-Mechanismus**: Rechenschaftspflicht Art. 5 Abs. 2 operationalisiert

#### Audit- & Sign-in-Logs

Entra Agent ID **erweitert** bestehende Logs, statt eine separate Log-Quelle zu schaffen:

**Audit-Logs** (basieren auf Basis-Identity-Typ):
- Create Agent Identity Blueprint → `Add application`
- Create Agent Identity → `Create service principal`
- Create Agent User → `Create user`
- Delete Blueprint → `Delete application`

→ SIEM-Rules auf diese Events müssen um Agent-Context-Filter erweitert werden, sonst mischen sich Agent-Lifecycle-Events mit Standard-App-Lifecycle-Events.

**Sign-in-Logs**:
- Neuer Resource-Type `agentSignIn` mit zusätzlichen Properties (Agent App vs. Instance, Agent-Type)
- Filter im Admin Center: `agentType` ∈ {`Agent ID user`, `Agent Identity`, `Agent Identity Blueprint`, `Not Agentic`}
- **Verteilt** auf vier Sign-in-Log-Typen: Agent Identity → Service-Principal-Sign-ins; Agent User → Non-interactive User-Sign-ins; User-zu-Agent → User-Sign-ins
- Graph API: `GET /beta/auditLogs/signIns?$filter=signInEventTypes/any(t: t eq 'servicePrincipal') and agent/agentType eq 'AgentIdentity'`

**Sentinel/Log-Analytics-Integration**: Über die bestehenden Diagnostic Settings von Entra ID (keine Agent-spezifische Pipeline). Empfehlung für SMB: Retention gemäß eigener Compliance (90 Tage ist Default).

### Typischer Workflow

1. **Setup (Admin, einmalig, 1–2 Tage)**:
   - Frontier aktivieren (M365 Admin Center, Billing Admin)
   - Custom Security Attributes definieren (`Environment`, `Department`, `DataSensitivity`, `AgentApprovalStatus`)
   - CA-Policy-Templates deployen (Block-High-Risk-Agent, Block-Non-Production-Access) — **in Report-Only** starten
   - Sponsor-Transfer-Lifecycle-Workflow konfigurieren
   - RBAC: **Agent ID Developer** Role an Dev-Team, **Agent Registry Administrator** an Admin-Ops

2. **Build / Configure (Developer, pro Agent-Typ)**:
   - Entscheidung: Copilot Studio (auto-create Agent Identity), Foundry (auto-provision on Publish), App Service/Functions (manual via Managed Identity + FIC), oder Graph API direkt
   - Blueprint definieren: Description, OAuth-Permissions (least-privilege!), App Roles, OptionalClaims, Verified Publisher
   - Credential-Type wählen: **Managed Identity + FIC preferred**; Certificate als Fallback
   - Sponsor + Owner zuweisen (Pflicht)
   - Metadata (Tags, Description) ausfüllen — verschlampt das Dev-Team → Orphan-Agent-Risiko

3. **Deploy**:
   - Blueprint wird via Graph API oder supported Channel (Copilot Studio UI, Foundry Publish-Event, Agent 365 CLI) instanziiert
   - Agent Identity Instances entstehen zur Runtime automatisch — KEIN manueller Schritt pro Instance
   - CA-Policy von Report-Only auf Enforce umlegen, nachdem Sign-in-Log zeigt keine False-Positives

4. **Operate**:
   - **Sponsor** sieht Agent in `myaccount.microsoft.com` → kann enable/disable direkt
   - **Access-Review** jede 6-12 Monate: Sponsor bestätigt, dass Agent noch gebraucht wird
   - **Risky-Agent-Report** unter Entra Admin Center > ID Protection > Risky Agents → Security Ops reviewed Detections, confirmed compromise / safe / dismiss
   - **Quarterly Orphan-Check**: Agents ohne aktiven Sponsor oder ohne Sign-in-Traffic suchen und decommissionen
   - **Credential-Rotation**: bei FIC automatisch; bei Cert mindestens jährlich

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | OAuth 2.0 (OBO, Client Credentials), Microsoft.Identity.Web, Managed Identity + Federated Identity Credentials, Graph API `/beta` für Agent-ID-Resources |
| **Admin (beim Kunden)** | Entra-Admin + Conditional-Access-Admin-Erfahrung, Custom Security Attributes, Lifecycle Workflows, Governance-Policies. **Nicht**: tiefe Coding-Skills. |
| **Security Ops (beim Kunden)** | ID-Protection-Risk-Report lesen, confirmed-compromise vs. dismiss-Entscheidung, Sentinel-Queries bauen, Entra-Audit-Log-Schema |
| **Sponsor-Mensch (Fachabteilung)** | **Keine technischen Skills**. Muss nur verstehen: „Agent X gehört mir, ich bin verantwortlich." Joiner/Mover/Leaver-HR-Workflow muss Sponsor-Transfer triggern. |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Real-Time Agent-Risk-Enforcement** — alle ID-Protection-Detections sind offline (Batch). Agent läuft bis zum nächsten Sign-in mit altem Risk-Level weiter. | Runtime-Threat-Protection: [[Defender for AI]] (Prompt-Injection) + Agent-365-Tools-Gateway (Public Preview seit April 2026). Entra Agent ID & Defender for AI sind **komplementär**. |
| **Interactive Auth / MFA für Agents** — konzeptionell unmöglich (no `/authorize`, no Public Client, no Redirect URI). | Pairing: Human-User macht MFA einmal, Agent bekommt OBO-Token. Für App-only-Agents: Least-Privilege + Managed-Identity-Credential ist der „MFA-Ersatz". |
| **Standalone-Lizenzierung** — nicht einzeln kaufbar, gegated über [[Agent 365]] / M365 Copilot Frontier / E7. | Kein Workaround — wenn Kunde kein Copilot hat, kein Entra Agent ID in Preview. GA 2026-05-01 öffnet via $15-SKU. |
| **Grant Controls in CA** — nur Block, kein Require-Compliant-Device, kein Require-MFA-for-Resource. | Feingranulare Autorisierung: Custom Security Attributes + Access Packages für Rollen-Management statt CA-Conditions. |
| **Shadow-Agent-Discovery außerhalb Copilot Studio / Foundry** — Agents aus Third-Party-Frameworks werden nicht automatisch erkannt. | Manuelle Registrierung über Graph API `AgentIdentity.CreateAsManager` + Purview-DSPM-Signale. [[Agent 365]] Registry verbessert Discovery, nicht Entra Agent ID selbst. |
| **Keine Region-Auswahl** — Agent-ID-Metadaten liegen dort, wo Entra-ID-Tenant-Daten liegen. Keine separate „Swiss Sovereign Cloud"-Option. | Für Swiss-FINMA-Kunden mit Sovereign-Cloud-Pflicht: unklar, ob Preview-Services denselben EU-Data-Boundary-Regeln folgen. *{UNCLEAR — als Risk-Flag in Kunden-Briefings nennen, bis GA explizit klärt}* |
| **Agent User („AI Teammate") bleibt Preview** nach 2026-05-01 | Nur OBO + App-only Agents sind GA-taugliche Produktions-Szenarien. Mailbox-Agent = Preview = keine SLA. |
| **Max Agent Identities pro Tenant** — Docs sprechen von „scale and ephemerality", harte Limits nicht publiziert | *{UNCLEAR: keine Zahl bekannt; MS positioniert es als „massen-skalierbar", aber kein SLA-Statement}* |

### Typische Fallstricke im Einsatz

- **CA-Policy-Kollision mit User-MFA-Policies**: Ein bestehendes „All users must MFA" blockiert Agents silent (sie können MFA nicht erfüllen). *Gegenmittel: bei Entra-Agent-ID-Einführung **alle** CA-Policies auditieren und Agents explizit ausschließen. Dedizierte Agent-Policies bauen.*

- **Blueprint vs. Instance-Verwechslung**: Admins geben aus Gewohnheit Permissions auf Instanz-Ebene → funktioniert auf Blueprint-Ebene anders. Credentials **immer** auf Blueprint; API-Permissions via Blueprint-Inheritance. *Gegenmittel: Review-Checkliste beim Production-Handshake.*

- **Sponsor-Rolle als HR-Prozess verpassen**: Mensch verlässt die Firma, niemand denkt an Agent-Sponsor-Transfer → Agent wird geflagged, Service-Abbruch. *Gegenmittel: Leaver-Workflow in HRIS mit Entra-Lifecycle-Workflow koppeln, nicht „wir machen das später".*

- **„Frontier aktivieren" übersehen**: Kunde hat M365 Copilot, aber Billing Admin hat Frontier-Toggle nie umgelegt → Agent Identity ist unsichtbar. *Gegenmittel: Frontier-Status als erster Schritt im PoC-Setup-Checklist.*

- **Auto-Entra-Identity-Toggle für Copilot Studio nicht aktiviert**: Agents laufen ohne Agent Identity, Audit-Trail fehlt → Agent-365-Governance läuft mit leerer Registry. *Gegenmittel: im Copilot-Studio-Setup-PoC expliziter Step.*

- **Client Secrets in Produktion**: Dev-Team migriert Dev-Secret aus Prototyp nach Prod → MS-Docs warnen explizit davor, aber ist verführerisch einfach. *Gegenmittel: Policy „Prod-Blueprints dürfen keine Client Secrets haben" als Code-Review-Check.*

- **CA-Agent-Risk-Logging-Mode vergessen**: Policies direkt auf Enforce → false-positive blockiert wichtigen Agent an Tag 1. *Gegenmittel: immer Report-Only mindestens 2 Wochen, dann Enforce.*

- **„AI Teammate"-Marketing-Narrativ in Kunden-Präsentation**: „der Agent hat ein eigenes Postfach" → bleibt Preview, keine Produktions-Zusage möglich. *Gegenmittel: in Kunden-Briefings GA-Scope von Preview-Features sauber trennen (siehe [[Agent 365]]-Note).*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Agent 365]] | Agent 365 ist die Governance-UI über Entra Agent ID | GA 2026-05-01 (A365 Control-Plane), Entra-Agent-ID-Kern-Primitive Preview→GA | Agent 365 Registry konvergiert mit Entra Agent ID („Agent Registry convergence") — unklar ob Auto-Migration vor-Preview-Agents |
| [[Copilot Studio]] | Admin-Toggle: automatisch Entra-Agent-Identities für neue Agents | Preview | Toggle muss **explizit** aktiviert werden; alte Agents nicht automatisch migriert |
| [[Foundry Agent Service]] | Automatische Blueprint + Identity-Erzeugung beim Agent-Publish | Preview | Projekt-Ebene hat Shared Default-Identity (riskant für Mandanten-Trennung) |
| [[Microsoft Agent Framework]] | MAF-Agents können Agent Identity als OAuth Client nutzen (via Microsoft.Identity.Web) | Preview | Dev muss SDK-Pattern kennen; keine MAF-spezifische Agent-ID-Abstraktion |
| Azure App Service / Functions | Agent Identity als Credential für App Service App | Preview | `overview-agent-identity`-Doku neu; Überlappt mit Managed Identity, Trennung unscharf |
| Teams (Developer Portal) | Blueprints via Teams Dev Portal | Preview | Nur für Teams-native Apps; nicht für Copilot-Studio-Agents im Teams-UI |
| [[Entra ID P2]] / ID Governance | Access Packages, Lifecycle Workflows, Access Reviews für Agent Identities | Preview | Erfordert P2-Lizenz zusätzlich zu Agent 365 / Copilot Frontier |
| [[Entra ID Protection]] | Agent-Risk-Signals (6 Detection-Typen) | Preview, „included with P2 while in preview" | Alle Detections offline (Batch) — kein Real-Time |
| Microsoft Graph `/beta` | CRUD auf Agent-ID-Resources + `riskyAgents`, `agentRiskDetections`, `auditLogs/signIns` | Beta | `/beta` = kein SLA, Breaking Changes möglich |
| [[Microsoft Purview]] | Agent-Aktivitäten via Purview DSPM konsolidiert in Agent 365 Dashboard | Preview | Sichtbarkeit nur bei Purview-Sensor-Coverage |
| [[Defender for AI]] | Runtime-Threat-Signals fließen in Agent-365-Dashboard; Entra ID Protection triggert auf Entra-Sign-in-Ebene | Preview | Zwei Systeme, zwei Dashboards — bis Agent 365 sie konsolidiert |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| 3rd-Party / OSS Agent-Frameworks (LangChain, CrewAI, OpenAI Agents SDK) | Agent kann unter Entra registriert werden und Agent Identity nutzen | Möglich, nicht automatisiert | Manuelle Registrierung via Graph; keine Native-Integration — SDK-Wrapper selbst bauen |
| Anthropic Claude, OpenAI | Token-Flows funktionieren unabhängig vom LLM-Anbieter (Agent Identity regelt **Entra-**Token, nicht LLM-API-Keys) | N/A | Identity-Platform ist LLM-agnostisch by design |

### APIs / Protokolle

- **OAuth 2.0** (Client Credentials, On-Behalf-Of mit `jwt-bearer`, Refresh Token)
- **OIDC** implizit (Entra als OP)
- **Microsoft Graph `/beta`** (alle CRUD-Ops)
- **Microsoft.Identity.Web** SDK (bevorzugt statt Raw-OAuth)
- **Microsoft Entra SDK for Agent ID** (aka.ms/entra/sdk/agentid) — Agent-spezifisch
- **Federated Identity Credentials (FIC)** als Credential-Type
- **A2A (Agent-to-Agent)** Token-Flows mit Agent-Blueprint als Resource-App
- **MCP (Model Context Protocol)** in Foundry mit Agent-Identity-Auth

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Entra-Agent-ID-Metadaten folgen Entra-ID-Tenant-Region. EU/EFTA-Tenants: EU Data Boundary (mit Entra-typischen Ausnahmen: threat intelligence, multi-tenant auth). Preview-Services historisch oft „temporarily excluded" — *{UNCLEAR ob Entra Agent ID Preview diesen Ausnahmen unterliegt}*. |
| **Prompts & Outputs** | Entra Agent ID **speichert keine Prompts/Outputs** — ist reine Identity-Plane. Prompt-Speicherung passiert auf Agent-Runtime-Ebene (Copilot Studio, Foundry). |
| **Data Processing Addendum (DPA)** | Unter Standard-Entra-ID-DPA abgedeckt. Kein separater DPA-Anhang für Agent ID erforderlich. |
| **EU-AI-Act-Klassifizierung** | Entra Agent ID selbst ist **Identity-Infrastruktur**, kein AI-System → nicht AI-Act-klassifiziert. Die **Agents**, die es verwaltet, fallen unter AI Act; Entra Agent ID **liefert technische Bausteine** für Art. 12 (Logging) und Art. 14 (Human Oversight via Sponsor-Konzept). |

### Microsoft-Compliance-Stack

- **[[Microsoft Purview]]** — Audit-Logs aus Agent Sign-ins werden in Purview für Retention / eDiscovery propagiert (über Standard-Entra-Log-Pipeline).
- **[[Defender for AI]]** — Runtime-Schutz; Entra Agent ID **ersetzt nicht** Defender, sondern liefert das Identity-Target, auf das Defender-Detections refereren.
- **[[Microsoft Entra Suite]]** — empfohlen für Conditional-Access-Advanced-Features und ID Governance (Access Packages, Lifecycle Workflows). Ohne Suite hat man die Kern-Identity-Primitive, aber halbe Governance.
- **Conditional Access** — separate Policies für Agents zwingend; Bestands-User-Policies refactoren.

### Bekannte Compliance-Lücken

- **Preview-Status** = keine SLA-Garantien; kein MS-Versprechen auf Data-Residency-Treue.
- **Agent User (Mailbox-Agent)** bleibt Preview → für regulierte Kunden nicht empfehlbar.
- **ID-Protection-Detections alle offline** — NIS2-Anforderung „unverzügliche Vorfallsmeldung" wird nur mit ergänzendem Runtime-Monitoring erfüllt.
- **Swiss FINMA Cloud-Outsourcing** — Entra ID ist FINMA-approved, aber **Entra-Agent-ID-Preview-Services** sind nicht separat gelistet. Consulting-Empfehlung für FINMA-Kunden: **bis GA warten**, dann Compliance-Check mit aktueller MS-Attestation.
- **EU AI Act ab 2026-08-01** — Art. 12 (automatic logging) ist mit Entra-Agent-ID-Sign-in-Logs + Audit-Logs technisch erfüllbar, aber **Aufbewahrungsfristen** (bis zu 10 Jahre für High-Risk-AI) übersteigen Entra-Standard-Retention (30 Tage Sign-in-Logs, 90 Tage für Audit). → Export nach Sentinel / Log Analytics mit eigenem Retention-Setting **Pflicht**.

---

## Abgrenzung & Wettbewerb

### Microsoft-intern: Wann Entra Agent ID vs. welches andere MS-Produkt?

| Frage-Situation | Entra Agent ID | Alternative MS-Produkt |
|-----------------|----------------|------------------------|
| „Agent braucht Identity für Graph/Azure-Zugriff" | ✅ Agent Identity (wenn >5 Agents oder reguliert) | Klassische Entra **App Registration** (wenn 1 Bot-Framework-Legacy-Agent, keine Governance-Anforderung) |
| „Azure-Compute braucht Identity" | ❌ nicht primary Use-Case | [[Managed Identity]] (Azure-Resource-gebunden, stabiler Lifecycle) |
| „AI-System braucht Runtime-Schutz gegen Prompt-Injection" | ❌ Identity-Ebene, nicht Runtime | [[Defender for AI]] + Agent-365-Tools-Gateway |
| „Ich will eine Agent-Registry-UI für Admins" | ❌ technische Primitive, keine UI | [[Agent 365]] (Registry, Dashboard, Lifecycle-Workflows) |
| „Ich will Agent-Governance auf Zugriffs-Ebene (Access Reviews, Rollen)" | nur Identity; Governance kommt von [[Entra ID Governance]] | [[Entra ID Governance]] (Access Packages, Lifecycle Workflows) — baut **auf** Entra Agent ID auf |
| „Human-User braucht MFA + CA" | ❌ verwendet Agents explizit nicht | Standard Entra ID + CA + [[Entra ID Protection]] (für User) |

### Externe Alternativen

| Dimension | Entra Agent ID | AWS IAM Identity Center + Bedrock Agent IAM | Okta Workforce Identity for Non-Human Identities | OSS: Auth0 / Keycloak + Custom Layer |
|-----------|----------------|---------------------------------------------|--------------------------------------------------|----------------------------------------|
| **Fokus** | Agent-spezifische Identity mit Blueprint/Sponsor/Agent-Risk | IAM Roles + Service-Control-Policies für Bedrock-Agents; kein Agent-spezifischer Identity-Typ | Okta führt „Non-Human Identity" als Kategorie, **kein Agent-spezifisches Objekt** in 2026 | DIY-Pattern mit Service Accounts; keine Sponsor-/Agent-Risk-Primitive |
| **Pricing** | Gegated via M365 Copilot / [[Agent 365]] / E7 | Pay-per-API + Bedrock-Compute | Pay-per-Identity, separate SKU | Infra-Kosten + Dev-Zeit |
| **EU-Data-Residency** | Entra-Data-Boundary (EU für EU-Tenants, mit Preview-Ausnahmen) | AWS Region-Auswahl möglich; Bedrock-Regionen-Scope enger | EU-Tenant-Option | Self-hosted |
| **Integrationstiefe in MS-Stack** | ✅ native: Copilot Studio, Foundry, Agent 365, M365, Purview, Defender | schwach (nur via Workload-Identity-Federation) | mittel (SCIM-sync in Entra/M365) | schwach |
| **Multi-Cloud** | ⚠️ primär MS-first; Entra ist federation-capable, Agent-ID-Pattern ist MS-proprietär | ✅ AWS-native | ✅ vendor-agnostisch | ✅ |
| **Stärke** | Blueprint-Instance-Model, Sponsor-Konzept, integrierte Agent-Risk-Detection | AWS-native Bedrock-Integration; starke Policy-Engine | Identity-Agnostisch, best-of-breed | maximal flexibel |
| **Schwäche** | Nur MS-Stack; Preview-Status; Frontier-Gate | kein Sponsor-Konzept; kein Agent-Risk-Signal; kein Mailbox-Agent | noch keine Agent-spezifischen Primitive, reines Service-Account-Renaming | kein Compliance-Support out-of-the-box |

### Empfehlungs-Regel

**Wir empfehlen Entra Agent ID, wenn der Kunde:** (a) M365-zentrisch ist, (b) [[Copilot Studio]] oder [[Foundry Agent Service]] nutzt, (c) >3 produktive Agents hat, und (d) reguliert ist (DSGVO-Rechenschaftspflicht / NIS2 / FINMA). Sonst bei Einzel-Agent und MS-fremden Agent-Frameworks: klassische App-Registration als Übergang, Re-Evaluation bei Agent-Zuwachs.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Microsoft Entra Agent ID | https://www.microsoft.com/security/business/identity-access/microsoft-entra-agent-id | 2026-04-22 | Positionierung, GA-Status |
| Docs Hub | What are agent identities? | https://learn.microsoft.com/en-us/entra/agent-id/identity-platform/what-is-agent-id | 2026-04-22 | Konzept-Basis |
| Docs | Best practices for Entra Agent ID | https://learn.microsoft.com/en-us/entra/agent-id/best-practices-agent-id | 2026-04-22 | Operative Leitplanken |
| Docs | Agent identity blueprints | https://learn.microsoft.com/en-us/entra/agent-id/agent-blueprint | 2026-04-22 | Blueprint-Schema |
| Docs | Agent OAuth protocols | https://learn.microsoft.com/en-us/entra/agent-id/agent-oauth-protocols | 2026-04-22 | Auth-Flow-Details |
| Docs | Sign-in and audit logs for agents | https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents | 2026-04-22 | Log-Schema, SIEM-Integration |
| Docs | Conditional Access for agents | https://learn.microsoft.com/en-us/entra/identity/conditional-access/agent-id | 2026-04-22 | CA-Semantik, Agent-Risk |
| Docs | ID Protection for agents | https://learn.microsoft.com/en-us/entra/id-protection/concept-risky-agents | 2026-04-22 | Risk-Detection-Typen |
| Docs Governance | Governing Agent Identities | https://learn.microsoft.com/en-us/entra/id-governance/agent-id-governance-overview | 2026-04-22 | Access Packages, Sponsor-Transfer |
| Docs | Administrative relationships (Sponsors) | https://learn.microsoft.com/en-us/entra/agent-id/agent-owners-sponsors-managers | 2026-04-22 | Sponsor-Model |
| Docs | Agent identities sign-in event data | https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents | 2026-04-22 | `agentSignIn`-Schema |
| Docs | Copilot Studio auto-create identities | https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities | 2026-04-22 | Copilot-Studio-Integration |
| Docs | Foundry Agent Identity | https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/agent-identity | 2026-04-22 | Foundry-Auto-Provision |
| Docs | App Service / Functions Agent Identity | https://learn.microsoft.com/en-us/azure/app-service/overview-agent-identity | 2026-04-22 | Self-Hosted-Agents |
| Graph API | agentIdentityBlueprint resource | https://learn.microsoft.com/en-us/graph/api/resources/agentidentityblueprint | 2026-04-22 | Schema-Referenz |
| SDK | Microsoft Entra SDK for Agent ID | https://aka.ms/entra/sdk/agentid | 2026-04-22 | Dev-Kit |
| Tech Community | Microsoft Entra Blog | https://techcommunity.microsoft.com/t5/microsoft-entra-blog/bg-p/Identity | 2026-04-22 | Preview→GA-Übergang |
| Roadmap | M365 Roadmap | https://www.microsoft.com/en-us/microsoft-365/roadmap | 2026-04-22 | GA-Daten Sub-Features |
| Blog | Frontier Suite Announcement | https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/ | 2026-04-22 | Agent-365-Kontext |

### Secondary (Analysten & Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| SAMexpert — Agent 365 Licensing | https://samexpert.com/agent-365/ | 2026-04-22 | Lizenzierung + Entra-Agent-ID-Gating präzise |
| Oasis Security — Agent 365 vs Classic Identity | https://www.oasis.security/blog/agent-365-oasis-for-ai-agent-governance | 2026-04-22 | Gute kritische Einordnung Entra Agent ID vs. klassisches Service-Principal-Modell |
| Licensing.Guide — May 1 GA not final | https://licensing.guide/may-1-ga-is-not-yet-the-final-frontier-for-agent-365/ | 2026-04-22 | Hinweise auf Preview-Sub-Features nach GA |
| Directions on Microsoft | *{TODO: Agent-ID-spezifische Analyse suchen}* | 2026-04-22 | — |

### Tertiary (MVPs / Community)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant |
|-------|--------------|-------------------|----------------|
| Merill Fernando (MS, Identity) | https://merill.net | 2026-04-22 | Identity-MVP, liefert Preview-Details |
| Tobias Zimmergren | https://zimmergren.net | 2026-04-22 | Azure-Identity-praktikerisch |
| Daniel Chronlund | https://danielchronlund.com | 2026-04-22 | CA-Policy-Deep-Dives |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| **AI Tour Zürich 2026** | 2026-04-29 | DACH-Kontext für Agent 365 + Entra Agent ID GA |
| **Microsoft Build 2026** | Mai 2026 | Developer-Details Agent-ID-SDK, MCP-A2A-Flows |
| **Agent 365 GA** | 2026-05-01 | Entra-Agent-ID-Kern-GA-Scope; welche Sub-Features Preview bleiben |
| **Microsoft Ignite 2026** | Nov 2026 | Nächste Iteration: Agent-Risk-Real-Time? Mailbox-Agent-GA? |
| **EU AI Act Inkrafttreten** | 2026-08-01 | Verstärkter Compliance-Druck, MS reagiert mit Audit-Features |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Kompletter Ausbau von Stub → Deep-Research-Note (watch: close). Abgrenzung zu [[Agent 365]] (Entra Agent ID = Identity-Plane darunter, nicht gleich), 4-Objekt-Modell (Blueprint, Blueprint Principal, Agent Identity, Agent User) im Detail, OAuth-Flow-Beschreibung (3 Flows, `jwt-bearer`-Impersonation, FIC preferred), Conditional-Access-Semantik (nur Block-Control, 6 Risk-Detection-Typen, alle offline), Audit-Log-Schema (`agentSignIn`), Sponsor-Konzept als DSGVO-Mechanismus, Skills-Matrix, externe Alternativen-Tabelle, Compliance-Lücken (EU-AI-Act-Retention, FINMA-Gap). | Learn.microsoft.com (Entra Agent ID Docs-Cluster, Conditional Access Agent ID, ID Protection Risky Agents, Blueprint Schema, OAuth Protocols, Sign-in/Audit Logs, Governance Overview) |
| 2026-04-21 | Hongyu | Initial Stub | — |
