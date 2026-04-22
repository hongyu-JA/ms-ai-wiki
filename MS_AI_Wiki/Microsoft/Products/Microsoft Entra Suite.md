---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Entra Suite, Microsoft Entra, Identity Suite, Entra ID Premium Suite]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Microsoft Entra Suite

*Microsofts **Identity-+-Access-Bundle** aus **fünf Komponenten** (Entra ID Governance, Entra ID Protection, Entra Internet Access, Entra Private Access, Entra Verified ID) — **zusätzlich** zu einer Entra-ID-P1-Baseline. In [[Microsoft 365 E7]] vollständig inkludiert, standalone für **$12/User/Monat** (Annual Commit) erhältlich. De-facto-**Voraussetzung für [[Entra Agent ID]]**-Governance und Conditional Access auf AI-Workloads.*

> **Analogie:** Was Okta + Zscaler (SSE) + SailPoint (Governance) + Ping (Verified Credentials) gemeinsam abdecken, packt Microsoft in ein SKU-Bundle — mit dem Argument „alles aus einer Hand, nativ M365-/Azure-integriert, in Zero-Trust-Architektur vorverdrahtet".

---

## Einsatz

### Job-to-be-done

When I Identity, Zugangskontrolle, Netzzugang (SSE/ZTNA) und Credential-Issuing als **zusammenhängendes Zero-Trust-System** auf M365/Azure ausrichten will, I want to ein vorintegriertes Lizenz-Bundle statt fünf SKU-Verhandlungen mit fünf Produkten, so I can Identity-Governance + AI-Agent-Readiness in einem Rollout fahren, nicht in fünf parallelen Sub-Projekten.

### Trigger-Signale

- *„Wir evaluieren Zero Trust — Entra Suite oder Okta + Zscaler?"*
- *„[[Agent 365]] / [[Entra Agent ID]] kommt — welche Entra-Lizenz brauchen wir dafür wirklich?"*
- *„Unsere Mitarbeiter greifen remote auf interne Apps zu — VPN soll weg, ZTNA her."* → Entra Private Access
- *„Wir sehen Shadow AI im Netzwerk — Mitarbeiter nutzen ChatGPT, wir haben keine Übersicht."* → Entra Internet Access als AI-Gateway
- *„Access-Reviews müssen quartalsweise laufen, HR-Prozess Joiner/Mover/Leaver ist manuell."* → Entra ID Governance
- *„Externer Partner soll sich als Mitarbeiter von X ausweisen, ohne dass wir ein Gast-Konto provisionieren."* → Verified ID

### Einsatz-Szenarien

1. **M365-E5-Kunde plant Agent-365-Einführung** — Kunde hat E5, überlegt Agent 365 oder E7-Upgrade. Wenn parallel ZTNA/SSE-Projekt ansteht oder Access-Reviews bisher manuell laufen: Entra-Suite-Standalone auf E5 draufsetzen ist der **Upgrade-Pfad zum E7-Feature-Set zu halbem Preis** ($12 vs. $39 Copilot+A365). Wichtig: Suite alleine bringt keinen Copilot, keinen Agent-365.
2. **SMB mit ZTNA-Migration** — Klassischer Use-Case: VPN ersetzen, Internet-Traffic filtern, Private-Apps (SAP-On-Prem, Legacy-ERP) Cloud-Connector-basiert erreichbar machen. Entra Private + Internet Access ersetzt Zscaler/Netskope-SKU, wenn Identity-Kontext ohnehin Entra ist.
3. **Regulierte KMU (FINMA/NIS2/EU-AI-Act)** — Access-Reviews, Entitlement-Management und Lifecycle-Workflows sind für DSGVO-Art.-5-Abs.-2-Rechenschaftspflicht quasi Pflicht. Entra ID Governance liefert die Toolchain; Verified ID adressiert Nachweispflichten für Mitarbeiter-Credentials (Weiterbildung, Zertifikate).
4. **Agent-Governance-Readiness** — Wer [[Entra Agent ID]] **Lifecycle-Workflows** (Sponsor-Transfer) und **Access Packages** für Agents nutzen will, braucht Entra ID Governance-Lizenzen auf Tenant-Ebene — diese sind im Suite-Bundle enthalten.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Entra ID P1 **pro User, der die Suite nutzt** (in M365 E3/E5 enthalten). Entra Suite ist **Additive** auf P1 — nicht Ersatz. Für E5-Kunden: Special-Pricing via „Entra Suite Step-up". Im [[Microsoft 365 E7]] voll inkludiert. |
| **Tenant / Infrastruktur** | Entra-ID-Tenant; für Private/Internet Access: **Global Secure Access** aktiviert, Connector-VMs on-prem oder in Azure für Private-Apps, Client-Agent auf Endgeräten (Windows/macOS/iOS/Android). |
| **Skills / Rollen** | **Identity-Admin** (Entra Governance, Access Packages), **Network-Admin** (für SSE/ZTNA-Rollout — Connector-Setup, Traffic-Profile), **Verified-ID-Admin** (Issuer-Setup, DID-Verwaltung) als separate Rolle. Für Agent-Kontext zusätzlich Conditional-Access-Admin. |
| **Compliance-Rahmen** | DPA über Standard-OST abgedeckt. EU-Kunden: EU Data Boundary greift für Entra-ID-Kern. Verified ID: eigener Rechtsrahmen für Credential-Issuance (wer darf was signieren) vor Rollout klären. |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Vollständiger Suite-Rollout: **6–12 Wochen** für SMB (5 Produkte = 5 Workstreams, wenn alle aktiviert). Teil-Rollout (nur Governance + Internet Access): **3–4 Wochen**. Agent-Governance-Readiness on top: +3–5 Tage (siehe [[Entra Agent ID]]). |
| **Laufende Lizenzkosten** | **$12/User/Monat** standalone (Annual Commit, Stand 2026-04). Plus Entra ID P1 ($6) → Effektiv **$18/User** für Suite-on-P1. In [[Microsoft 365 E7]] ($99) voll inkludiert. Für E5-Bestand: Suite-Step-up oft günstiger als E7-Full-Upgrade. |
| **Laufender Betrieb** | Monatliche Access-Reviews (2–4 h), quartalsweise Entitlement-Package-Reviews (4–8 h), SSE-Policy-Maintenance (2–4 h/Monat). Lifecycle Workflows automatisieren Joiner/Mover/Leaver — laufend ca. 4–8 h/Monat für SMB mit <500 Usern. |

### Empfehlung

**Status:** 🟢 **Empfehlen für alle M365-E5-Kunden mit >100 Usern, die (a) Zero-Trust-Netzwerk-Migration planen, (b) Access-Governance über Excel-Sheets hinaus brauchen, oder (c) AI-Agents produktiv einsetzen wollen.** Für kleinere SMB (<50 Users) ohne ZTNA-Bedarf: Entra ID P2 alleine kann reichen.

Begründung: Die Bundle-Logik funktioniert wirtschaftlich — $12 vs. kombinierte Einzel-SKUs (~$17–$23 je nach Base). Und für Agent-Governance ist die Suite de facto Pflicht-Lizenz, weil Entra ID Governance-Features (Access Packages, Lifecycle Workflows) dort liegen. **Aber** komplett-Rollout ist ein 6-Produkt-Projekt mit echten Skills-Anforderungen — „gekauft und liegengelassen" ist der wahrscheinlichste Misserfolgspfad.

**Nächster Schritt für Journai:** Entscheidungsmatrix für Beratungsgespräch fertig bauen: „Welche 2 von 5 Komponenten zuerst aktivieren?" (Standard-Empfehlung für DACH-SMB: **Governance + Internet Access** als Phase 1, **Private Access** Phase 2 wenn VPN-Migration ansteht, **Verified ID** nur bei konkretem Use-Case). Parallel: Suite als **Pflicht-Baseline für alle Agent-365-PoCs** im Angebot markieren — nicht nachträglich nachschieben.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** seit 2024-07-11 (ursprüngliche Entra-Suite-Einführung), laufend um neue Komponenten erweitert (Internet Access AI-Gateway-Features 2025/26, Shadow-AI-Discovery Q1 2026) |
| **GA-Datum** | 2024-07-11 initial; als Teil von [[Microsoft 365 E7]] **2026-05-01** |
| **Standalone-Preis (USD)** | **$12.00/User/Monat** (Annual Commit, Stand 2026-04-22) |
| **Standalone-Preis (EUR/CHF)** | EUR: ~11.20 €/User/Monat (listed). CHF: nicht separat publiziert, typisch EUR-Parität im Swiss-Tenant-Listing. *{UNCLEAR für CH-Wiederverkäufer-Rabatte}* |
| **Lizenz-Bundle** | In [[Microsoft 365 E7]] ($99/User/Monat, GA 2026-05-01) vollständig inkludiert. **Nicht** in M365 E5. Separate Add-on-SKU für E5-Kunden mit Special-Pricing. |
| **Voraussetzung** | Entra ID P1 pro lizenziertem User als **Prerequisite** — Suite ist additiv, nicht Ersatz. In E3/E5 bereits enthalten; bei Standalone-Kauf separat mit $6/User/Monat. |
| **Region-Verfügbarkeit** | Global inkl. EU/EFTA. EU Data Boundary greift für Entra-ID-Kern und die Suite-Services; Switzerland In-Country-Processing verfügbar für FINMA-regulierte Kunden (Teil der Swiss-Cloud-Sovereignty-Initiative 2026). |
| **CSP-Promo / Discounts** | Special-Pricing für E5/P2-Bestandskunden beim Step-up. Keine öffentlichen zeitlichen Rabatte aktuell; CSP-Staffeln abhängig vom Distributor. |
| **Hidden Costs** | (1) Entra ID P1 als Prereq (falls nicht über E3/E5 vorhanden). (2) Global Secure Access Connector-VMs (Azure-Compute-Kosten für Private Access). (3) Verified ID: Azure Key Vault + Azure Storage für Issuer-Setup. (4) Defender for Cloud Apps für tiefe Shadow-AI-Analyse (sonst nur Entra-interne Basic-Discovery). |
| **Upgrade-Pfad** | Entra ID P1 → Entra ID P2 → Entra Suite ist der offizielle Pfad. Co-Terming mit M365-Laufzeit über CSP möglich. Bestands-Permissions-Management-Kunden: **Retired 2025-11-01**, Migration zu Defender-for-Cloud-CIEM oder Delinea/SailPoint erforderlich. |

---

## Kernkonzept

### Was es im Kern ist

Entra Suite ist **kein einheitliches Produkt**, sondern ein **Lizenz-Aggregat** über fünf Einzelprodukte, die alle unter der Entra-Brand laufen. Historischer Kontext: Microsoft hat 2023 „Azure AD" in „Entra ID" umbenannt und dabei das Identity-Portfolio neu strukturiert — die Suite war im Juli 2024 die erste kommerzielle Antwort auf die Frage „Was ist der Entra-Portfolio-Upsell über P2 hinaus?". 2025 kam die Permissions-Management-Retirement-Ankündigung (EOS 2025-10-01, EOL 2025-11-01) — das ursprünglich 6. Suite-Element ist **weg** und nicht durch ein Nachfolger-Produkt in der Suite ersetzt (CIEM-Funktionen wanderten in Defender for Cloud).

Das **zentrale Design-Prinzip** der Suite ist die **Zero-Trust-Access-Fabric**: Identity (wer?), Governance (darf er?), Verification (ist er wirklich er?), Network Access (auf welchem Weg?). Alle fünf Komponenten teilen sich **eine Policy-Engine** (Conditional Access), **ein Audit-Log** (Entra Monitoring) und **ein Admin Center** (entra.microsoft.com) — das ist der wesentliche Unterschied zum „Best-of-Breed"-Ansatz mit Okta+Zscaler+SailPoint, wo jedes Produkt eigene Policies, eigene Logs, eigenes Admin-UI hat.

Die **zweite Wette** ist der **AI-Access-Gateway-Pivot**: Seit Q4 2025 positioniert Microsoft Entra Internet Access **nicht mehr** als „Secure Web Gateway" (Zscaler-Konkurrent), sondern als **„Secure AI Gateway"** mit Prompt-Injection-Protection, Shadow-AI-Discovery und Defender/Purview-Integration. Das ist strategisch: Microsoft wettet, dass der nächste Netzwerk-Trust-Layer nicht „SaaS-Traffic inspizieren" ist, sondern „AI-API-Calls inspizieren" — und dass Entra die logische Ebene dafür ist (weil Entra den Caller kennt).

Die **dritte Design-Entscheidung** ist die **Agent-Readiness**: Mit [[Entra Agent ID]] als **Identity-Primitive** hat die Suite de-facto-Pflicht-Status bekommen, weil Agent-Governance (Access Packages für Agents, Lifecycle Workflows für Sponsor-Transfer) auf Entra-ID-Governance-Lizenzen angewiesen ist. Wer AI-Agents produktiv und compliant betreiben will, landet bei Suite oder E7.

### Wo es im Stack sitzt

| Layer | Rolle | Suite-Komponente |
|-------|-------|------------------|
| **Identity-Core** | Authentication, User/Group Management, SSO | Entra ID P1 (**Prereq**, nicht Teil der Suite) |
| **Risk & Protection** | Risk-based Auth, Compromised-User-Detection, Agent Risk | **Entra ID Protection** (früher Teil P2, jetzt Suite-Komponente) |
| **Governance** | Access Reviews, Entitlement Management, Lifecycle Workflows, PIM | **Entra ID Governance** |
| **Network / SSE** | Internet Access (Secure Web/AI Gateway), Private Access (ZTNA) | **Entra Internet Access** + **Entra Private Access** |
| **Credential Verification** | Verifiable Credentials (W3C-Standard), DID-basiert | **Entra Verified ID** |
| **Agent Identity** | Blueprint, Agent Identity, Sponsor, Agent Risk | [[Entra Agent ID]] (separate Plane, **nicht** Teil der Suite, aber auf Suite-Lizenzen angewiesen) |
| **Governance-UI für Agents** | Agent Registry, Dashboard | [[Agent 365]] (separates Produkt) |

### Kern-Fähigkeiten

#### 1. Entra ID Governance — Access Packages, Lifecycle Workflows, PIM

Der **wichtigste Suite-Bestandteil für SMB**. Enthält vier Teil-Capabilities, die auch als Standalone-Lizenz „Entra ID Governance" (~$7/User/Monat) verkauft werden:

- **Entitlement Management (Access Packages)**: Bündel aus Group-Memberships, App-Role-Assignments und Azure-Resource-Rollen, die **per Approval-Workflow** zugewiesen werden. Selbstbedienungs-Portal für End-User (`myaccess.microsoft.com`). Limit: 50 aktive Access Packages pro Tenant ohne weitere Skalierungslizenzen.
- **Access Reviews**: Wiederkehrend (wöchentlich/monatlich/quartalsweise/jährlich), mit **AI-powered Recommendations** (Security Copilot) seit 2025. Reviewer sieht „Last Sign-in: 180 Tage" → ein Klick „Deny". Pflicht-Mechanismus für DSGVO-Art.-32 (TOM-Angemessenheit).
- **Lifecycle Workflows**: Joiner/Mover/Leaver-Automation via Attribute-Trigger (z.B. `employeeHireDate -7d` → Prep-Workflow). Built-in Tasks: Add to Groups, Enable User, Send Email, Revoke Refresh Tokens, Remove from Access Packages. Limit: 50 Workflows + 100 Custom Task Extensions (Logic Apps / Functions) pro Tenant.
- **Privileged Identity Management (PIM)**: Just-in-time Role Activation (z.B. Global Admin nur für 1h gegen Ticket-Referenz). Für Entra-Rollen + Azure-Resource-Rollen + M365-Rollen + Gruppen. **Pflicht-Baseline** für jeden Produktions-Tenant ab 10 Admins.

**Kritischer Hinweis**: PIM ist auch in Entra ID P2 enthalten (**ohne** Suite). Wer **nur** PIM will, braucht keine Suite — P2 reicht. Suite ist nur lohnend, wenn mehrere Governance-Features oder SSE/ZTNA im Spiel sind.

#### 2. Entra ID Protection — Risk-Based Auth + Agent Risk

Automatisches Risk-Scoring für Sign-ins (User-Risk, Sign-in-Risk) und — neu mit [[Entra Agent ID]] — **Agent-Risk** (6 Detection-Typen, siehe Entra-Agent-ID-Note). Conditional Access kann auf Risk-Level reagieren: „Block if High, MFA if Medium". Für Agents: nur Block (Agents können kein MFA).

**Kern-Grenze**: Alle Detections sind **offline (Batch)** — kein Real-Time-Enforcement. Für Live-Runtime-Schutz (Prompt-Injection, Data-Exfiltration) ist [[Defender for AI]] zuständig.

#### 3. Entra Internet Access — Secure AI Gateway

Microsofts **Secure Service Edge**-Baustein für Internet- und SaaS-Traffic. Seit Q4 2025 positioniert als **AI-Gateway** statt klassisches SWG — die drei neuen AI-Features sind:

- **Shadow AI Discovery**: Netzwerk-Visibility in GenAI-Tools, die User unauthorisiert verwenden (ChatGPT, Claude.ai, Perplexity, …). Übersicht im Admin Center + Sanctioning-Workflow.
- **Prompt Injection Protection**: Netzwerk-Layer-Inspection von AI-API-Requests, Block bei bekannten Prompt-Injection-Patterns. **Real-Time**, kein Code-Change auf Agent-Seite nötig.
- **Purview-Integration**: Network-Filter respektiert Purview-Sensitivity-Labels → z.B. „Dokumente mit DLP-Label X dürfen nicht an externe AI-APIs gehen".

Ersetzt für viele SMB den Zscaler-/Netskope-SKU, **wenn** Identity-Kontext ohnehin Entra ist und Defender for Cloud Apps bereits im Stack lebt.

#### 4. Entra Private Access — Zero Trust Network Access (ZTNA)

Der **VPN-Ersatz** der Suite. Client-Agent auf Endgerät → authentifiziert gegen Entra → baut per-App-Tunnel zu On-Prem-/Private-Cloud-Resources über **Global Secure Access Connector**-VMs auf. Kein Netzwerk-Layer-VPN mehr, kein Full-Tunnel.

**Kernnutzen**: App-spezifische Conditional-Access-Policies statt VPN-Pauschalzugang. „SAP-On-Prem darf nur von compliant Devices aus EU-Region zwischen 6–22 Uhr erreicht werden" wird als CA-Policy konfiguriert, nicht als Firewall-Regel.

**Friction**: Connector-VMs müssen gemanagt werden (High-Availability, Patching, Monitoring). Kein Mac/Linux-Client-Parity zu Windows. Legacy-Protokolle (z.B. nicht-TCP) nur eingeschränkt.

#### 5. Entra Verified ID — Verifiable Credentials

W3C-standardbasierter Credential-Issuer + Verifier. Issue-Side: Entra stellt signierte Credentials aus („User X ist Mitarbeiter von Firma Y, Abteilung Z, gültig bis Datum"). Verify-Side: Partner-Organisationen verifizieren gegen Entra-Issuer, **ohne** dass User ein Gast-Konto beim Partner anlegen muss.

**SMB-Use-Cases (realistisch)**:
- **Onboarding neuer Mitarbeiter**: First-Login ohne Passwort via Verified Credential.
- **Partner-Discounts / B2B-Access**: „Ich beweise ohne Konto-Anlage bei Partner X, dass ich Mitarbeiter von Firma Y bin."
- **Weiterbildungs-Nachweise**: Externer Trainer stellt Credential „User Z hat Schulung A abgeschlossen" aus → in User-Wallet.
- **Face Check**: Biometrische Face-Matching-Option für hochsensitive Verification (z.B. vor PIM-Aktivierung).

**Realität**: Verified ID ist **unterbeworben** und hat wenig ausgerollte SMB-Praxis in DACH. Als **Zukunfts-Optional** in der Suite, nicht als Tagesgeschäft.

### Typischer Workflow

1. **Evaluation (2–4 Wochen)**: Usage-Mapping — welche der 5 Komponenten braucht der Kunde? Pre-Purchase-Check gegen Ist-Zustand: VPN-Migration geplant? Access-Reviews heute Excel? Agent-365 im Roadmap? Shadow-AI sichtbar?
2. **Phase 1 — Governance (3–4 Wochen)**: Entra ID Governance aktivieren. 3–5 Access Packages pilotieren (z.B. „New Hire Sales"), 2–3 Lifecycle Workflows (Joiner, Leaver, Manager-Change). PIM für alle Admin-Rollen. Access-Review-Schedule für PIM-eligible Users quartalsweise.
3. **Phase 2 — Network (4–8 Wochen)**: Global Secure Access aktivieren, Connector-VMs deployen (min. 2 pro Region für HA), Client-Rollout auf Windows-Fleet. Erst Internet Access (Traffic beobachten), dann Private Access für 1–2 On-Prem-Apps (SAP, File-Server). Policies in Report-Only starten.
4. **Phase 3 — Verified ID (optional, 2–4 Wochen)**: Issuer-Setup (Azure Key Vault + Azure Storage), Pilot-Credential (z.B. Mitarbeiter-Ausweis für Onboarding). Nur wenn konkreter Use-Case vorhanden.
5. **Operate**: Monatliche Access-Reviews, quartalsweise Entitlement-Reviews, laufende SSE-Policy-Tuning (neue SaaS-Apps kommen laufend dazu). Shadow-AI-Discovery als wöchentlicher Security-Ops-Touchpoint.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Journai Consultant** | Entra-Admin-Erfahrung (CA, Governance), Basis Network (Proxy-/VPN-Konzepte für ZTNA), DID/W3C-VC-Grundlagen für Verified ID |
| **Identity-Admin beim Kunden** | Entra ID P1/P2 Vorkenntnis, Access Package Design, Lifecycle-Workflow-Konfiguration. **Kein Low-Code nötig** — Workflows sind konfigurativ mit Logic-Apps-Escape-Hatch. |
| **Network-Admin beim Kunden** | Global Secure Access Connector-Deployment + -Monitoring, Traffic-Profile-Konfiguration, DNS-/Proxy-Kenntnisse für SSE-Rollout |
| **End-User / Sponsor** | Keine. MyAccess-Portal ist selbsterklärend. Wallet-App (Microsoft Authenticator) für Verified ID. |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Permissions Management (CIEM)** — 2025-10-01 End-of-Sale, 2025-11-01 End-of-Life. War ursprünglich 6. Suite-Element, ist **raus**. | CIEM-Features in [[Microsoft Defender for Cloud]] (CSPM-Plan); Third-Party-CIEM (Delinea PCCE als MS-empfohlener Migrationspfad, Palo Alto Prisma, SailPoint, Saviynt) |
| **Tiefe Shadow-AI-Klassifikation** — Entra Internet Access zeigt Traffic, aber ohne Context. | Defender for Cloud Apps für 30k+ SaaS-App-Katalog + Risk-Scoring (separate Lizenz). Microsoft Purview für Content-Klassifikation. |
| **Mac/Linux-Parity im Private Access Client** | Browser-based Access als Fallback; Nicht-TCP-Protokolle eingeschränkt |
| **Keine Real-Time-Agent-Risk-Enforcement** | Entra Internet Access (Network-Layer, Real-Time für Prompt Injection) + [[Defender for AI]] für Runtime-Threat |
| **Verified ID ist Infrastruktur, kein End-Produkt** — Kunde muss Issuer/Verifier-Apps selbst bauen | Azure Marketplace: vorgefertigte Verified-ID-Issuer-Apps (Credential Issuer Starter Pack). Consulting für Custom-Issuer. |
| **Suite ist nicht à-la-carte** — man kauft alle 5 Komponenten, auch wenn man nur 2 nutzt | Entra ID Governance standalone ($7), Entra Private/Internet Access nicht einzeln verfügbar ohne Suite |
| **SSE-Connector-VMs sind ongoing Azure-Kosten** außerhalb der Lizenz | Budget-Position für Azure-Compute separat kalkulieren (~$50–$200/Monat pro Connector-VM je nach Größe) |

### Typische Fallstricke im Einsatz

- **„Suite kaufen, nur 1–2 Produkte nutzen"** — häufigster Fehler. $12/User für ein einzelnes Sub-Feature ist Verschwendung. *Gegenmittel: Pre-Purchase-Usage-Mapping pro Komponente, harte „wird genutzt / wird nicht genutzt"-Entscheidung.*
- **Entra ID P1 als Prereq vergessen** — Kunde kauft Suite, hat aber nur Entra ID Free (z.B. M365 Business Basic). Suite aktiviert nicht. *Gegenmittel: Lizenz-Baseline-Check als erste Frage im Beratungsgespräch.*
- **Permissions Management in Angeboten von 2024/2025** — veraltete Materialien, Kunde erwartet das Feature. Ist seit 2025-11 weg. *Gegenmittel: Alle Angebote / Präsentationen nach Okt 2025 auf Permissions-Management-Erwähnungen checken.*
- **Access Packages ohne Review-Schedule angelegt** — läuft 2 Jahre, niemand prüft, dann Audit-Finding. *Gegenmittel: Review-Schedule als Pflichtfeld in Package-Definition; Journai-Template mit Default-90-Tage-Review.*
- **Lifecycle Workflows ohne HR-Integration** — Workflows werden gebaut, aber HR-System (Personio, SAP SuccessFactors) triggert sie nicht, weil Attribute nicht synchronisiert. *Gegenmittel: HR-Sync-Check als Voraussetzung, vor Workflow-Design.*
- **Private Access vor Connector-HA-Design rollout** — 1 Connector, geht down, Users kommen nicht mehr an SAP. *Gegenmittel: min. 2 Connector-VMs, Azure Availability Zone-Split, Monitoring-Alert auf Connector-Health.*
- **Verified ID im Kunden-Briefing überverkauft** — klingt nach „Self-Sovereign Identity, Web3-Revolution", Realität ist begrenzte Partner-Readiness. *Gegenmittel: Verified-ID als „Zukunfts-Optional" framen, nicht als Tagesgeschäft.*
- **Shadow-AI-Discovery ohne Policy-Follow-up** — Kunde sieht Report „87 User nutzen ChatGPT", passiert nichts. *Gegenmittel: Discovery + Policy-Entscheidung + Sanctioning-Workflow als Paket verkaufen, nicht nur „Report aktivieren".*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft 365 E7]] | Suite vollständig in E7 inkludiert | GA 2026-05-01 | $99-Bundle inkl. Copilot + Agent 365; für reine Suite-Nutzer overkill |
| [[Microsoft 365 E5]] | Special-Pricing für Suite-Step-up | GA | Upgrade-Kalkulation: Suite-Add-on ($12) vs. E7-Vollupgrade (Delta) |
| [[Entra Agent ID]] | Suite liefert Governance-Plane (Access Packages, Lifecycle Workflows, Sponsor-Transfer) für Agents | Suite: GA; Agent ID: Preview → GA 2026-05-01 | Agent Governance-Features Preview, Suite-Lizenz nötig für vollen Funktionsumfang |
| [[Agent 365]] | Agent-Governance-UI nutzt Entra-Governance-Primitive aus der Suite | GA 2026-05-01 | Suite + A365 sind komplementär, nicht konkurrierend — Agent 365 ist UI-Layer über Suite-Backend |
| [[Microsoft Purview]] | Entra Internet Access respektiert Purview-Sensitivity-Labels für AI-DLP | GA | Integration setzt Purview-Setup voraus; ohne Labels kein Content-Scoping |
| [[Defender for AI]] | Komplementär: Entra liefert Identity-Risk, Defender Runtime-Risk | Preview/GA je Feature | Zwei Dashboards bis Agent 365 konsolidiert |
| [[Microsoft Defender for Cloud]] | CIEM-Features (aus retiredem Permissions Management) | GA in Defender CSPM | CIEM **nicht** in Entra Suite — Missverständnis in Alt-Materialien |
| Microsoft Defender for Cloud Apps | Tiefe Shadow-SaaS-Klassifikation ergänzt Entra Internet Access | GA | Separate Lizenz, nicht in Suite |
| Azure AD Connect / Entra Cloud Sync | On-Prem AD → Entra für Governance-Input | GA | Sync-Attribute müssen für Lifecycle Workflows vorhanden sein |
| [[Microsoft Graph]] | Alle Governance-Ressourcen via Graph API (auch Beta für neue Agent-Features) | GA / Beta mixed | `/beta`-Endpoints für Agent-Governance noch nicht stabil |
| Microsoft Sentinel | Entra-Logs + Audit-Events in Sentinel für SIEM-Korrelation | GA | Diagnostic Settings konfigurieren; Retention-Kosten planen |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **Okta / Ping** | Föderation mit Entra als Trust-Partner (wenn Kunde heterogen) | GA | Entra ist primary IdP für M365/Azure; Co-Existenz mit Okta möglich, aber redundante Access-Governance-Features |
| **SailPoint / Saviynt** | Enterprise-IGA über Entra ID Governance hinaus | GA | Für KMU Überkill; ab Konzern-Scope (10k+ Users, 100+ Apps) relevant |
| **Delinea / Palo Alto Prisma** | CIEM-Replacement für retiredem Permissions Management | GA | Migration-Fenster bis Ende 2025 abgeschlossen; Restkunden jetzt in Defender for Cloud |
| **Zscaler / Netskope** | SSE-Alternative zu Entra Internet/Private Access | GA | Entra Suite ersetzt Zscaler für M365-First-Kunden; Zscaler tiefer bei Non-MS-SaaS-Katalog |
| **W3C-VC-Ecosystem** | Verified ID ist W3C-Standard-konform, interoperabel | GA | Partner-Readiness in DACH begrenzt; kein Mass-Market-Use-Case |

### APIs / Protokolle

- **Microsoft Graph** (v1.0 und Beta) für alle Governance-Ressourcen (Access Packages, Lifecycle Workflows, Access Reviews, PIM)
- **OAuth 2.0 / OIDC** als Standard für Suite-Komponenten-Integration
- **SCIM 2.0** für Cross-IdP-Sync (Okta → Entra)
- **W3C Verifiable Credentials Data Model** für Verified ID (OID4VC-Standard für Issuance)
- **Conditional Access Graph API** für Policy-as-Code-Management
- **Global Secure Access APIs** (Preview) für SSE-Policy-Automation

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Entra-ID-Tenant-Region bestimmt Storage. EU/EFTA-Tenants: EU Data Boundary aktiv (Identity Core, Sign-in Logs, Audit Logs innerhalb EU). Switzerland: In-Country Processing seit Q1 2026 für Entra verfügbar (Teil der Swiss-Cloud-Sovereignty-Initiative). |
| **Prompts & Outputs (AI-Gateway)** | Entra Internet Access inspiziert AI-Traffic metadata-basiert; Prompt-Content wird nicht persistent gespeichert (nur Flow-Metadaten im Audit-Log). Für Inhalts-DLP: Purview-Integration nötig. |
| **Data Processing Addendum (DPA)** | Standard MS Online Services Terms (OST) decken alle Suite-Komponenten ab. Kein separater DPA-Anhang. |
| **EU-AI-Act-Klassifizierung** | Entra Suite ist Identity/Security-Infrastruktur, **kein AI-System** im AI-Act-Sinn. Liefert Bausteine für Art. 12 (Automatic Logging) und Art. 14 (Human Oversight) via ID-Governance-Lifecycle. |

### Microsoft-Compliance-Stack

- **[[Microsoft Purview]]** — Audit-Log-Retention, eDiscovery, Content-Labels für Internet-Access-AI-DLP
- **[[Microsoft Defender for AI]]** — Runtime-Threat-Protection, komplementär zu Entra ID Protection (Batch)
- **[[Microsoft Defender for Cloud]]** — CIEM-Ersatz für retiredem Permissions Management
- **Microsoft Sentinel** — SIEM-Integration via Diagnostic Settings
- **Microsoft 365 Compliance Center** — Overlap mit Purview, Regulatory Reporting

### Bekannte Compliance-Lücken

- **FINMA-Outsourcing-Attestation**: Entra ID ist FINMA-approved, aber laufend werden neue Suite-Features (AI-Gateway, Shadow-AI) ausgerollt, die nicht separat attestiert sind. *Empfehlung: Bei FINMA-Kunden aktueller Microsoft Trust Center Compliance Report pro Feature prüfen.*
- **EU-AI-Act Retention**: Standard-Entra-Audit-Log-Retention (90 Tage) reicht nicht für AI-Act-Art.-12 (bis 10 Jahre für High-Risk-AI). → Export nach Sentinel/Log Analytics mit eigenem Retention-Setting **Pflicht**.
- **Verified ID + DSGVO**: Credential-Issuance = Personendaten-Verarbeitung. Datenschutz-Folgenabschätzung (DPIA) nötig vor produktiver Nutzung, auch wenn technisch DID-basiert (kein zentraler Personendaten-Store).
- **Private Access Client auf BYOD**: Device-Compliance-Check funktioniert nur mit Intune-managed oder Entra-registered Geräten. Reines BYOD (unmanaged) bekommt nur Basis-Access.
- **Shadow-AI-Discovery in DACH-Betriebsrat-Kontext**: Netzwerk-Monitoring von User-Aktivität braucht BR-Abstimmung. *Empfehlung: DE-Kunden vor Aktivierung Betriebsrat einbeziehen, Policy-Scope dokumentieren.*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Microsoft Entra | https://www.microsoft.com/en-us/security/business/microsoft-entra | 2026-04-22 | Suite-Positionierung |
| Pricing Page | Entra Pricing | https://www.microsoft.com/en-us/security/business/microsoft-entra-pricing | 2026-04-22 | $12-Preis-Validierung |
| Docs Hub | Microsoft Entra | https://learn.microsoft.com/en-us/entra/ | 2026-04-22 | Alle Kernprodukte |
| Docs | Entra Licensing Fundamentals | https://learn.microsoft.com/en-us/entra/fundamentals/licensing | 2026-04-22 | Prereq-Matrix |
| Docs | Entra ID Governance Overview | https://learn.microsoft.com/en-us/entra/id-governance/identity-governance-overview | 2026-04-22 | Governance-Features |
| Docs | ID Governance Licensing | https://learn.microsoft.com/en-us/entra/id-governance/licensing-fundamentals | 2026-04-22 | SKU-Details Governance |
| Docs | Entra Internet Access | https://learn.microsoft.com/en-us/entra/global-secure-access/ | 2026-04-22 | SSE / AI-Gateway |
| Docs | Entra Private Access | https://learn.microsoft.com/en-us/entra/global-secure-access/concept-private-access | 2026-04-22 | ZTNA-Architektur |
| Docs | Shadow AI Discovery | https://learn.microsoft.com/en-us/entra/global-secure-access/concept-shadow-ai-discovery | 2026-04-22 | AI-Gateway-Feature |
| Docs | Prompt Injection Protection | https://learn.microsoft.com/en-us/entra/global-secure-access/how-to-ai-prompt-injection-protection | 2026-04-22 | Real-Time-AI-Schutz |
| Docs | Entra Verified ID | https://learn.microsoft.com/en-us/entra/verified-id/ | 2026-04-22 | VC-Architektur |
| Docs | Access Reviews | https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview | 2026-04-22 | Access-Review-Setup |
| Permissions-Mgmt-EOL | MS Tech Community Announcement | https://techcommunity.microsoft.com/blog/microsoft-entra-blog/important-change-announcement-microsoft-entra-permissions-management-end-of-sale/4399382 | 2026-04-22 | Retirement-Historie |
| Blog | Securing AI-era starts with identity | https://techcommunity.microsoft.com/blog/microsoft-entra-blog/securing-the-ai-era-starts-with-identity/4478952 | 2026-04-22 | Agent-Readiness-Story |
| Blog | Secure agentic AI (Frontier) | https://www.microsoft.com/en-us/security/blog/2026/03/09/secure-agentic-ai-for-your-frontier-transformation/ | 2026-04-22 | E7/Agent-365-Kontext |
| Blog | Four priorities identity 2026 | https://www.microsoft.com/en-us/security/blog/2026/01/20/four-priorities-for-ai-powered-identity-and-network-access-security-in-2026/ | 2026-04-22 | Roadmap-Signals |
| Roadmap | M365 Roadmap | https://www.microsoft.com/en-us/microsoft-365/roadmap | 2026-04-22 | Feature-GA-Daten |
| Tech Blog | Microsoft Entra Blog | https://techcommunity.microsoft.com/t5/microsoft-entra-blog/bg-p/Identity | 2026-04-22 | Laufende Updates |

### Secondary (Analysten & Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| SAMexpert — Entra ID Licensing Guide | https://samexpert.com/entra-id-licensing-guide/ | 2026-04-22 | Präzise SKU-Preise, Bundle-Vergleiche |
| SAMexpert — M365 E7 Breakdown | https://samexpert.com/microsoft-365-e7-licensing-guide/ | 2026-04-22 | E7-Decomposition, Suite-Anteil |
| Directions on Microsoft — Entra Services | https://www.directionsonmicrosoft.com/reports/microsoft-entra-the-collected-services/ | 2026-04-22 | Kritisch-neutrale Entra-Analyse |
| KuppingerCole — MS Sovereign Cloud 2026 | https://www.kuppingercole.com/blog/small/microsofts-sovereign-cloud-in-2026 | 2026-04-22 | Sovereignty-Einordnung |
| ic-consult — Entra License Models | https://ic-consult.com/en/resources/blogs/microsoft-entra-id-license-models-explained-p1-p2-and-entra-suite/ | 2026-04-22 | P1/P2/Suite-Delta |
| MajorKey Tech — ID Governance | https://www.majorkeytech.com/blogs/microsoft-entra-id-governance-whats-new-and-why-it-matters | 2026-04-22 | Governance-Deep-Dive |
| Kocho — E7 | https://kocho.co.uk/news/microsoft-365-e7-licence/ | 2026-04-22 | UK-Berater-Sicht |

### Tertiary (MVPs / Community)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant |
|-------|--------------|-------------------|----------------|
| Merill Fernando (MS, Identity) | https://merill.net | 2026-04-22 | Entra-Deep-Dives, Preview-Details |
| Daniel Chronlund | https://danielchronlund.com | 2026-04-22 | CA-Policy-Patterns |
| Tobias Zimmergren | https://zimmergren.net | 2026-04-22 | Azure-Identity-Praxis |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| **AI Tour Zürich 2026** | 2026-04-29 | DACH-Kontext, Swiss-Sovereignty + E7-Timeline |
| **Microsoft Build 2026** | Mai 2026 | Governance-Graph-APIs, SSE-Policy-as-Code |
| **M365 E7 GA** | 2026-05-01 | Entra-Suite-in-E7 final, Pricing-Validierung |
| **EU AI Act Inkrafttreten** | 2026-08-01 | Compliance-Features-Druck, Audit-Retention |
| **Microsoft Ignite 2026** | Nov 2026 | Suite-Evolution: neue Komponenten? AI-Gateway-Roadmap |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Entra Suite: Korrektur auf **5 Komponenten** (Permissions Management retired 2025-11-01), Internet Access als AI-Gateway mit Shadow-AI + Prompt-Injection-Protection, Agent-Governance-Hooks via ID Governance, E7-Inkludierung, FINMA/Swiss-Sovereignty-Kontext, typische Phasen-Roadmap (Governance → SSE → Verified ID), Fallstricke-Katalog, Verified-ID-SMB-Use-Cases. | https://learn.microsoft.com/en-us/entra/ + samexpert.com Licensing-Guides + MS Tech Community Blogs |
| 2026-04-22 | Hongyu | Initial Stub | — |
