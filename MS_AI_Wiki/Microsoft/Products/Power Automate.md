---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Power Automate, MS Flow, Agent Flows, Power Automate for Desktop]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
  - "[[Agents MOC]]"
---

# Power Automate

*Microsofts **Citizen-Dev-Workflow-Engine** in der Power Platform — **dieselbe Runtime wie [[Logic Apps]]**, aber mit M365-Lizenz-Modell, Power-Platform-Designer und drei Produktlinien: **Cloud Flows** (iPaaS-artig), **Desktop Flows** (RPA auf Windows) und — seit Wave 2 2025 — **Agent Flows** als deklaratives Aktions-Framework für [[Copilot Studio]]-Agenten. Hebel für SMB: Business-User bauen und pflegen Agent-Integrationen ohne Azure-Subscription, ohne Pro-Dev-Toolchain.*

> **Analogie:** Was Zapier im SaaS-Land ist, ist Power Automate im Microsoft-365-Land — mit dem Unterschied, dass der Flow-Designer direkt in [[Copilot Studio]], Teams und SharePoint lebt und Dataverse als geteilter Backing-Store fungiert. Oder kurz: **Logic Apps für Office-Leute mit Office-Lizenz.**

---

## Einsatz

### Job-to-be-done

*When I* Business-User befähigen will, **Agent-Aktionen und Routine-Integrationen selbst zu pflegen** — Mails senden, Teams-Messages absetzen, SharePoint-Items anlegen, Approvals einholen, Legacy-UI klickweise automatisieren — *I want to* einen Low-Code-Designer mit 1000+ Konnektoren direkt im M365-Stack + Copilot Studio, *so I can* IT von Routine-Tickets entlasten und Agenten deterministische Tools geben, ohne eine Azure-Subscription oder Pro-Dev-CI/CD aufzusetzen. Seit 2026: *so I can* Copilot-Studio-Agenten mit Agent Flows ausstatten, die pro Aktion via **Copilot Credits** abgerechnet werden statt pro Nutzer-Lizenz.

### Trigger-Signale

- *„Unsere Fachabteilung hat schon mehrere Flows gebaut — jetzt sollen die mit dem Copilot-Agent zusammenspielen."*
- *„Wir brauchen Zugriff auf eine Legacy-Windows-App, für die es keine API gibt."*
- *„Wir haben M365 E3/E5, aber keine Azure-Subscription. Wie automatisieren wir Approval-Flows in Teams?"*
- *„Der Copilot-Studio-Agent soll ein ERP-Ticket öffnen — wir wollen keinen MCP-Server selbst schreiben."*
- *„Der Kollege hat alle Flows gebaut und verlässt die Firma — was passiert jetzt mit den Automationen?"* (Orphan-Flow-Signal → Governance-Hebel)

### Einsatz-Szenarien

1. **Agent Flows als Tool in Copilot-Studio-Agent** — SMB hat HR-Agent in [[Copilot Studio]]. Agent Flow als Tool mit Trigger *„When an agent calls the flow"* + Actions *„Create SharePoint item"*, *„Send adaptive card in Teams"*, *„Respond to the agent"*. Business-User pflegt Agent-Prompt **und** Flow im selben Tool, IT setzt nur Governance-Leitplanken. **Vorteil gegenüber [[Logic Apps]]**: Kein Azure-Tenant, keine ARM-Pipelines, keine VNet-Planung — dafür Copilot-Credit-Billing pro Aktion.
2. **Desktop Flow auf Hosted Machines für Legacy-Integration** — Treuhandkanzlei hat Abacus-Windows-Client ohne API. Desktop Flow automatisiert Maskenklicks. **Hosted Machines** (Windows 11 Enterprise Cloud PC in Azure, von MS verwaltet) statt lokale VM → keine on-prem-Infra, aber $215/Bot/Monat Hosted-Process-Lizenz. Seit 2026 Wave 1: **AI-assistiertes Authoring + Self-Healing** bei UI-Änderungen.
3. **Cloud Flow als M365-Integration-Glue** — Klassischer SMB-Fall: Bei neuer Offerte in Dynamics/SharePoint automatisch Teams-Channel anlegen, Einladung versenden, OneDrive-Ordner erstellen. Standard-Konnektoren aus M365-Seeded-Entitlement → **kostet effektiv nichts extra** solange keine Premium-Konnektoren (SAP, Salesforce, HTTP, Custom) im Spiel sind.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | M365 Business/E3/E5 enthält **Standard-Power-Automate-Nutzung mit Standard-Connectors**. Für Premium-Connectors (SAP, Salesforce, HTTP, Custom, on-prem Data Gateway): **Power Automate Premium** $15/User/Monat. Für RPA-Bots unattended: **Power Automate Process** $150/Bot/Monat oder **Hosted Process** $215/Bot/Monat. Für Agent Flows: **Copilot-Studio-Capacity** (prepaid $200/25 000 Credits/Monat oder PAYG). |
| **Tenant / Infrastruktur** | M365-Tenant mit Power-Platform-Environment (Standard: Default-Environment; Best Practice: dedizierte Environments pro Projekt). **Dataverse** als Backing-Store für Agent Flows und Solution-verwaltete Flows (implizit aktiv, kommt mit Power Automate Premium / Copilot Studio). Für Desktop Flows unattended: Hosted-Machine-Lizenz oder eigene Windows-11-VM mit Data Gateway. |
| **Skills / Rollen** | **Citizen Developer** (Business-User mit Prozess-Domänenwissen, der Designer-UI beherrscht), **Power Platform Admin** (Environments, DLP-Policies, Capacity-Monitoring), **optional CoE-Team** ab ~50 Flows für Governance. Für Agent Flows zusätzlich Copilot-Studio-Maker-Wissen. **Kein Pro-Dev-Skill zwingend** — das ist der Haupt-Unterschied zu [[Logic Apps]]. |
| **Compliance-Rahmen** | Data Residency folgt **Power Platform Environment-Region** (nicht dem M365-Tenant-Land direkt). **Switzerland North**-Region seit 2020 verfügbar für Environment-Erstellung — CH-Banken/Healthcare können lokal deployen. EU-Data-Boundary-Commitment für EU-Regionen aktiv. DPA über Microsoft Product Terms. EU-AI-Act: produktspezifisch nicht klassifiziert, Einzel-Flow-Bewertung durch Kunde. |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Einzel-Cloud-Flow-PoC: 1–3 Tage. Agent-Flow + Copilot-Studio-Agent: 3–7 Tage. Desktop-Flow-RPA auf Legacy-App: 5–15 Tage (UI-Stabilität-Testing dominiert). CoE-/Governance-Setup (DLP-Policies, Environments, Monitoring): 5–10 Tage initial. |
| **Laufende Lizenzkosten** | M365-seeded Flows: $0 extra. Power Automate Premium: $15/User/Monat (oft 2–5 Maker nötig = $30–75/Monat). Process-Bot (unattended RPA): $150–215/Monat pro Bot. Agent Flows: Copilot-Credit-basiert — ab ~$200/Monat prepaid, skaliert mit Aktions-Volumen. Process Mining Add-on: $5 000/Tenant/Monat. |
| **Laufender Betrieb** | Flow-Monitoring, Orphan-Flow-Review, Connection-Refresh, Premium-Connector-Lizenz-Checks: 0.5–2 Tage/Monat bei <20 Flows, 3–5 Tage/Monat bei einer CoE-Organisation mit >100 Flows. Desktop-Flow-Wartung (UI-Break-Fixing) ist der dominante Posten. |

### Empfehlung

**Status:** 🟢 **Empfehlen** — als **Standard-Automation-Layer für SMB-Kunden mit M365-Schwerpunkt**. Reif, breite Adoption, Copilot-Studio-Integration ist strategisch. 🟡 **Beobachten** für Agent Flows in regulierten Szenarien — Copilot-Credit-Pricing ist neu und lässt sich im ersten Jahr schwer kalkulieren. 🔴 **Meiden** für Szenarien mit Enterprise-Konnektoren (SAP, Oracle, EDI) oder VNet-Pflicht → dafür ist [[Logic Apps]] die richtige Wahl.

**Nächster Schritt für Journai:** (1) **„Logic Apps vs. Power Automate"-Entscheidungs-Canvas** als SMB-Workshop bauen (gemeinsam mit [[Logic Apps]]-Note, beide im [[Integration & Compute MOC]] verknüpft). (2) **Agent-Flow-Referenzarchitektur** für einen typischen SMB-Copilot-Studio-Agent (HR/Travel/Approval) bauen und die Copilot-Credit-Kalkulation dokumentieren. (3) **Governance-Starter-Kit**: DLP-Policy-Template + Orphan-Flow-Reassignment-Runbook + Service-Principal-Ownership-Pattern (wir haben diesen Schmerz bei mindestens zwei Bestandskunden schon gesehen).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** — Cloud Flows seit 2016, Desktop Flows seit 2020, Hosted Machines seit 2022, **Agent Flows GA** seit Wave 2 2025 (November 2025). Wave 1 2026 (Apr–Sep 2026): **AI-Authoring + Self-Healing für Desktop Flows, object-centric Process Mining, MCP-Server für Process Intelligence**. |
| **GA-Datum** | Power Automate (vorher „Flow"): 2016 · Power Automate Desktop: 2020 · Hosted RPA: 2022 · Agent Flows: 2025-W2 (GA) · Wave-1-2026-Features: schrittweise Apr–Sep 2026 |
| **Standalone-Preis (USD)** | **Power Automate Premium**: $15/User/Monat (Cloud Flows + attended Desktop Flows + Process/Task Mining 50 MB + Dataverse-Entitlements). **Power Automate Process**: $150/Bot/Monat (unattended Desktop Flows, eigene VM). **Power Automate Hosted Process**: $215/Bot/Monat (unattended + MS-gehostete Windows-11-VM). **Process Mining Add-on**: $5 000/Tenant/Monat (100 GB, setzt Premium voraus). **Copilot Studio Capacity (für Agent Flows)**: $200/Monat für 25 000 Copilot Credits (annual billing) oder Pay-as-you-go ($0.01/Credit). *{Preise laut Power-Platform-Pricing-Page, Sichtung 2026-04-22}* |
| **Standalone-Preis (EUR/CHF)** | Nicht separat publiziert — Umrechnung über Microsoft-Pricing-Tools mit Region/Currency-Filter. *{UNCLEAR — CH-Pricing und EUR-Fix explizit verifizieren, Power-Platform-Preise folgen oft nicht 1:1 dem USD-Satz}* |
| **Lizenz-Bundle** | **M365 E3/E5 und Business-Pläne enthalten „Power Automate for M365"** — Cloud Flows mit **Standard-Konnektoren nur** (keine Premium, kein HTTP, kein Custom, kein Data Gateway). Dynamics-365-Pläne enthalten häufig eingeschränkte PA-Entitlements. **Copilot Studio** (als Agent-Plattform) enthält Agent-Flow-Nutzung über Copilot-Credits. |
| **Voraussetzung** | M365-Lizenz (für Standard-Flows) oder Power Automate Premium (für Premium-Connectors). Für Agent Flows: Copilot-Studio-Capacity im Environment. Kein Azure-Sub nötig (Haupt-Differentiator zu [[Logic Apps]]). |
| **Region-Verfügbarkeit** | Global mit regional gebundenen Environments. EU-Regionen: Europe (Dublin/Amsterdam), France, Germany, Norway, UK. **Switzerland**: ✅ Region verfügbar. **EU-Data-Boundary-Commitment** für Kunden-Daten und Service-Daten in EU-Regionen aktiv. |
| **CSP-Promo / Discounts** | EA/MCA/CSP-Standard-Rabatte. **Flow Groups** (Wave 1 2026): ermöglicht Process-Lizenz-Sharing über mehrere Flows — reduziert Per-Bot-Kosten bei Low-Volume-Szenarien. Keine klassischen Reserved-Capacity-Rabatte. |
| **Hidden Costs** | (1) **Premium-Connector-Lizenz-Explosion** — ein einziger SAP/Salesforce/HTTP-Action-Flow zwingt **alle Nutzer des Flows** auf Premium-Lizenz. (2) **Copilot Credits für Agent Flows** werden pro Aktion abgerechnet — ein Agent-Flow mit 10 Actions kostet pro Run 10× Credit-Abzug. (3) **Process-Mining-Addon** mit $5k/Monat Einstiegspreis — fast immer overkill für SMB. (4) **Dataverse-Capacity** wird von Flows mitverbraucht (Storage, API-Calls). (5) **AI-Builder-Seeded-Credits entfallen ab 01.11.2026** — Bestandskunden, die implizit auf AI-Builder-Flows gebaut haben, zahlen dann Copilot-Credits zusätzlich. |
| **Upgrade-Pfad** | **Power Automate Cloud Flow → Agent Flow**: In-Place-Konvertierung über Solution-Flow + Plan-Wechsel „Copilot Studio". **Einwegs-Operation** — Billing wechselt von PA zu Copilot-Credits, kein Rollback. **Power Automate → [[Logic Apps]]**: Export-Funktion im PA-Designer erzeugt Logic-Apps-Consumption-Definition, aber **Premium-Connectors brauchen Re-Wiring** (Connector-Parity 1:1 nicht gegeben). |

---

## Kernkonzept

### Was es im Kern ist

Power Automate ist Microsofts **Low-Code-Workflow-Engine für M365-/Power-Platform-nahe Automatisierung**. Technische Pointe: Power Automate **teilt die Workflow-Runtime und den JSON-Workflow-Graph mit [[Logic Apps]]** (Azure Workflow Definition Language) — der Designer und viele Connectors sind identisch. **Was Power Automate einzigartig macht, ist nicht die Engine, sondern das kommerzielle + Persona-Modell drumherum:** M365-Seat-Lizenz statt Azure-Consumption, Business-User-Designer mit „natural language"-Flow-Erstellung via Copilot, Power-Platform-Environments mit Dataverse als geteilter Datenbasis, tiefe Integration in Copilot Studio.

Drei **produktlogisch getrennte Linien**, die sich im Designer aber zunehmend vermischen:

1. **Cloud Flows** — serverless, Trigger-basiert (Event, Schedule, Manual), 1000+ Konnektoren, läuft multitenant auf Microsofts Power-Platform-Runtime. Das iPaaS-Pendant im M365-Lizenzraum.
2. **Desktop Flows (Power Automate for Desktop, RPA)** — lokaler Windows-Client, der UI-Automation macht (Klicks, Tastatureingaben, Maskenlesen). Zwei Betriebsmodi: **attended** (User sitzt vor dem PC) und **unattended** (Bot läuft auf dedizierter Maschine, idealerweise **Hosted Machine** = MS-gemanagte Cloud-PC-VM). Relevant für Legacy-Systeme ohne API.
3. **Agent Flows** (GA seit Wave 2 2025) — deklaratives Aktions-Framework, das sich bewusst von Cloud Flows abgrenzt: läuft **in Copilot Studio**, wird über **Copilot Credits** abgerechnet (nicht über PA-Lizenzen), nutzt denselben Designer, aber **mit anderem Billing-Model und anderen Lifecycle-Regeln** (kein Copy/Share/Co-Ownership/Run-Only wie Cloud Flows; dafür Solution-verwaltet und Version-kontrolliert).

Die zentrale strategische Wette Microsofts mit **Agent Flows**: Agent-Aktionen sollen **deterministisch** (immer gleicher Output bei gleichem Input), **beobachtbar** und **Business-User-pflegbar** sein — im Gegensatz zu LLM-generiertem Tool-Calling, das nichtdeterministisch ist. Agent Flows sind also der „rule-based path" neben dem probabilistischen Agent-Reasoning. Das ist der Haupt-Unterschied zu Tools, die in [[Copilot Studio]] direkt als HTTP-Call oder MCP-Action definiert werden.

Bidirektionalität zwischen Agent und Flow (wichtig für Verständnis):
- **Agent → Flow**: Trigger „When an agent calls the flow" + Action „Respond to the agent" macht den Flow zum Tool des Agenten.
- **Flow → Agent**: Seit Wave 1 2026 gibt es einen **Agent-Node** im Flow-Designer, mit dem ein Cloud-/Agent-Flow einen Copilot-Studio-Agent als Workflow-Step aufrufen kann, um LLM-Reasoning, Knowledge-Retrieval oder Tool-Use abzurufen.

Damit ist Power Automate nicht mehr nur „Zapier im MS-Land", sondern **der Citizen-Dev-Klebstoff zwischen deterministischer Automation und probabilistischen Agenten**.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Workflow-Definition** | JSON-Graph (Trigger, Actions, Control-Flow) — geteilt mit [[Logic Apps]] | Power Automate / Logic Apps (Azure Workflow Definition Language) |
| **Designer** | Low-Code-Web-UI + VS-Code-Extension (eingeschränkt) + Copilot-NL-Authoring | Power Platform (in Copilot Studio für Agent Flows, in make.powerautomate.com für Cloud Flows) |
| **Runtime — Cloud** | Workflow-Ausführung multitenant | MS-managed Power Platform Runtime |
| **Runtime — Desktop** | UI-Automation auf Windows-Client | Power Automate Desktop (lokal) oder Hosted Machine (MS-managed Cloud-PC) |
| **Runtime — Agent Flows** | Actions-Ausführung + Copilot-Credit-Abrechnung | Copilot Studio Runtime (baut auf PA-Engine, eigene Billing-Pipe) |
| **Connector-Layer** | 1000+ Konnektoren (Standard / Premium / Custom) | Power Platform Connector Catalog — geteilt mit Logic Apps |
| **State / Storage** | Run-History, Solutions, Agent-Flow-Metadaten | **Dataverse** (implizit für Solution-Flows und Agent Flows) |
| **Governance** | Environments, DLP-Policies, Capacity, Orphan-Flow-Handling | Power Platform Admin Center + CoE-Starter-Kit |

### Kern-Fähigkeiten

#### 1. Cloud Flows — das iPaaS-Pendant im M365-Raum

Trigger-basierte Workflows mit 1000+ Konnektoren. Trigger-Typen: **automatisch** (bei Event in einem Drittsystem), **zeitplan-basiert** (Cron-ähnlich), **manuell** (Button/Teams/PowerApps), **Copilot-initiated** (Agent-Call). Actions decken M365 breit ab (Outlook, SharePoint, Teams, OneDrive, Planner), Dynamics 365, Azure-Services (Storage, Service Bus, Functions) und SaaS-Drittwelt (Salesforce, ServiceNow, SAP — letztere als Premium-Connector).

**Copilot-assistiertes Authoring** ist seit 2024 in den Designer integriert: „Create a flow that emails my team when a SharePoint list item is added" erzeugt ein Flow-Skelett, das der Maker verfeinert. Seit Wave 1 2026: auch **Flow-Optimization durch Copilot** (erkennt ineffiziente Patterns, schlägt bessere Connectors vor).

**Grenze:** Reine Cloud Flows haben keine VNet-Integration, keine eigenen Compute-Instanzen und kein ARM-basiertes CI/CD. Für Pro-Dev-Szenarien mit diesen Anforderungen ist [[Logic Apps]] Standard die richtige Wahl.

#### 2. Desktop Flows (RPA) — UI-Automation für Legacy-Systeme

Der Hauptgrund, dass Power Automate im Enterprise so stark gewachsen ist. Lokaler **Power-Automate-Desktop-Client** auf Windows 10/11 zeichnet UI-Aktionen auf oder man baut sie per Drag&Drop. Zwei Modi:

- **Attended**: Bot läuft, während der User am PC ist (z.B. Makros, die eine Task erledigen, auf Knopfdruck). Teil von Power Automate Premium.
- **Unattended**: Bot läuft ohne User-Session auf dedizierter Maschine. Braucht **Process-Lizenz** ($150/Bot/Monat) auf eigener VM oder **Hosted-Process-Lizenz** ($215/Bot/Monat) auf von MS gehosteter Windows-11-Enterprise-Cloud-PC-VM.

**Hosted Machines** (GA seit 2022, Wave 1 2026: Entra Hybrid Join Public Preview, Committed-Bot-Auto-Scaling) sind der Game-Changer für SMB: keine eigene RPA-Infrastruktur mehr nötig. VM wird on-demand provisioniert, auf MS-Patching-Rhythmus gehalten, Azure-seitig isoliert.

**Wave 1 2026** bringt **AI-gestütztes Authoring** (Agent beschreibt Prozess in natürlicher Sprache → Flow wird generiert) und **Self-Healing** (wenn UI-Element sich ändert, versucht der Agent eine Neu-Bindung statt Flow-Failure). Das adressiert den Haupt-Pain-Point von RPA direkt.

**Grenze:** UI-Scraping bleibt strukturell fragil — jedes Software-Update kann einen Flow brechen. Kein Ersatz für eine API-Integration, wenn API verfügbar ist.

#### 3. Agent Flows — deklarativer Aktions-Layer für Copilot Studio

Die wichtigste 2025/26-Neuerung. Agent Flows sind **Flows, die in Copilot Studio leben** und sich in drei Punkten von Cloud Flows abheben:

| Dimension | Agent Flow | Cloud Flow |
|-----------|:---|:---|
| **Authoring-Ort** | Copilot Studio (Flows-Panel) oder Power Automate mit Plan-Wechsel | make.powerautomate.com |
| **Billing** | **Copilot Credits pro Action** (25 000 für $200/Monat prepaid oder $0.01/Credit PAYG) | Power Automate Lizenz (Seeded / Premium / Process) |
| **Lizenz-Anforderung pro Nutzer** | **Keine** — M365-Copilot-User lösen keine Kosten aus, Agent-Flow-Actions werden aus Environment-Capacity gezogen | Premium-Connector = alle Nutzer brauchen Premium-Lizenz |
| **Lifecycle** | Solution-verwaltet, Drafts + Versioning, **kein** Copy/Share/Co-Owner/Run-Only | Copy + Share + Co-Ownership + Run-Only-Permissions |
| **Typischer Trigger** | „When an agent calls the flow" (Flow wird zum Agent-Tool) oder Schedule/Event | Event/Schedule/Button/Teams |
| **Premium-Connectors** | ✅ Agent Flows sind **Premium by default** — alle Connectors nutzbar, ohne Per-User-Lizenz | Premium-Connector zieht alle Nutzer in Premium-Plan |
| **Desktop-Flows aufrufen** | ❌ Nicht möglich (Stand 04/2026) → dafür regulären Cloud Flow nutzen | ✅ (Hybrid-Szenarien) |

Authoring-Modi: **Natural Language** („Copilot, erstelle einen Flow, der bei neuem Ticket in ServiceNow eine Teams-Nachricht sendet und eine Approval anfordert") oder **Designer** (Drag&Drop). **Action-Typen**: AI Capabilities (LLM-Prompt, Agent-Call, natural-language-Reply), Human-in-the-Loop (Approvals), Built-in (Loops, Conditions, Data-Ops), Connectors (M365, Third-Party, Custom).

**Bidirektionalität** mit Agenten:
- Agent ruft Flow als Tool (Trigger „When an agent calls the flow" + Action „Respond to the agent")
- Flow ruft Agent als Workflow-Step (neuer **Agent-Node** in Wave 1 2026, Agent reasoning/retrieval/tool-use als Sub-Schritt)

**Billing-Mechanik** (wichtig für Kosten-Kalkulation):
- Flow aus **Topic** aufgerufen: 1× „Classic answer" + n× Agent-Flow-Actions
- Flow aus **generative Orchestration**: 1× „Autonomous action" + n× Agent-Flow-Actions
- Flow im **Test-Chat** oder **Flow-Designer**: 0 Credits (Test-Runs frei)
- **Kapazitäts-Erschöpfung**: Neue Runs werden **geblockt**, laufende laufen zu Ende. M365-Copilot-User sind ausgenommen — deren Credits werden aus der M365-Copilot-Lizenz gezogen, nicht aus der Environment-Capacity.

**Grenze:** Kein Desktop-Flow-Aufruf, keine klassischen Share/Run-Only-Pattern, Credit-Pricing vor allem bei vielen Actions pro Run schwer zu prognostizieren.

#### 4. AI Builder + Copilot-assistiertes Authoring

In den Designer eingebaute AI-Bausteine: Document-Extraction, Text-Classification, Form-Processing, Sentiment-Analysis. Historisch über „AI Builder Credits" abgerechnet — **entfallen ab 01.11.2026** komplett: die seeded Credits aus Power-Apps-Premium- und Dynamics-365-Lizenzen werden entzogen, Nutzung wechselt auf **Copilot Credits**. Für Bestandskunden relevant: Flows, die implizit auf AI-Builder-Features basieren, bekommen einen neuen Kostenträger.

#### 5. Governance & Environments

Power-Platform-Environments sind der Isolations-Layer: Dev/Test/Prod, Geo-Zuordnung, DLP-Policies (welche Connectors dürfen zusammen in einem Flow verwendet werden? — verhindert z.B. M365-Daten → Drittsystem-Exfiltration). **CoE Starter Kit** (Microsoft-offizieller Toolkit) bietet Dashboards für Flow-Inventar, Orphan-Flow-Detection, Admin-Automationen.

**Service-Principal-Ownership** (seit 2023 GA) ist der Production-Governance-Hebel: Statt personenbezogener Flow-Owner (der bei Kündigung Orphan-Flows erzeugt) gehört der Flow einem Service-Principal, individuelle User als Co-Owner. Für jeden business-critical Flow: Must-Have.

### Typischer Workflow

1. **Setup** (Journai / Kunde · 0.5–2 Tage) — Power-Platform-Environment anlegen (eigenes für Prod, nicht Default). DLP-Policies definieren (typischer SMB-Start: Business-Connectors + M365 in einer Gruppe, Non-Business getrennt). Capacity-Monitoring im Power-Platform-Admin-Center einrichten. Für Agent Flows: Copilot-Studio-Capacity dem Environment zuweisen.
2. **Build / Configure** (Maker · 1–10 Tage je Flow) — Im make.powerautomate.com oder Copilot-Studio-Flows-Panel: Trigger wählen, Actions via Drag&Drop oder NL-Copilot konfigurieren. Connections via OAuth / Service Principal / Managed Connector. Testen im Flow-Run-Panel mit synthetischem Input. Für Desktop Flows: Power-Automate-Desktop-Client installieren, UI aufzeichnen, Actions nachschärfen.
3. **Deploy** (Maker / Admin · 0.5–2 Tage) — Flow in Solution packen (für Versioning + Environment-Transport), via „Export Solution" in Ziel-Environment importieren. Connections neu bauen (Connection-Portierung unsicher). Für Agent Flows: aus Flow-Panel direkt „Publish", Agent bindet ihn als Tool.
4. **Operate** (Admin · 0.5–3 Tage/Monat) — Power-Platform-Admin-Center: Flow-Runs monitoren, Fehler-Alerts konfigurieren (oft als eigener Flow auf Exception-Counter!), Orphan-Flow-Review wenn Mitarbeiter wechseln, Connection-Refresh bei abgelaufenen OAuth-Tokens. Für Agent Flows zusätzlich: Copilot-Credit-Verbrauch pro Flow tracken.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | Flow-Designer-Basics, Connector-Auth-Konzepte (OAuth, Service Principal), Dataverse-Grundlagen, Copilot-Studio-Authoring für Agent Flows. Kein Code-Skill zwingend, aber JSON-Verständnis hilft bei komplexeren Expressions. |
| **Admin (beim Kunden)** | Power-Platform-Admin-Rechte, Verständnis für Environments + DLP-Policies, Entra-Basics (Service Principals, Conditional Access für Connectors). |
| **End-User (beim Kunden)** | Keine für Cloud-/Agent-Flows (laufen im Hintergrund). Bei attended Desktop Flows: User startet Flow per Button. Bei Teams-Bots: reine Chat-Interaktion. |
| **Citizen Developer / Maker** | Domänenwissen des Prozesses, Designer-Affinität, idealerweise ein Flow-Champion-Programm im Unternehmen. |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **VNet-Integration / Private Endpoints** | [[Logic Apps]] Standard; on-prem Data Gateway als Teil-Lösung (nur für SQL/SharePoint-on-prem etc., nicht als volle Netzwerk-Isolation) |
| **Pro-Dev-CI/CD (ARM/Bicep, VS-Code-first, git-native)** | [[Logic Apps]] Standard mit Zip-Deploy; Power Platform Solutions sind git-kompatibel, aber Merge-Experience unreif |
| **Sub-50-ms-Latenz / High-Throughput-Integration** | [[Azure Functions]] + [[APIM AI Gateway]]; Logic Apps Standard mit Built-in Connectors |
| **EDI/AS2/X12/EDIFACT-B2B** | [[Logic Apps]] Standard + Integration Account |
| **Desktop Flows aus Agent Flows aufrufen** | Cloud Flow als Bridge: Agent Flow → Cloud Flow → Desktop Flow. Oder Wave-1-2026-Feature abwarten: „Call desktop flows directly from Copilot Studio" angekündigt. |
| **Air-gapped / vollständig on-prem** | [[Logic Apps]] Hybrid (Arc-enabled AKS + on-prem SQL). Power Automate hat keinen Hybrid-Modus. |
| **Multi-Agent-Orchestrierung mit komplexem State** | [[Microsoft Agent Framework]] + [[Azure Functions]] Durable — Agent Flows sind deterministisch-linear, nicht für lang laufende Agent-Konversationen ausgelegt |
| **Streaming-Outputs von LLMs** | MAF + Azure Functions + SignalR; Copilot Studio Tools mit Streaming |
| **Vollständige Connector-Parity zu Logic Apps** | Einige Built-in-Connectors aus Logic Apps Standard existieren nur dort; umgekehrt einige PA-Premium-Konnektoren fehlen in Logic Apps |

### Typische Fallstricke im Einsatz

- **Premium-Connector-Lizenzkosten-Explosion** — Der Klassiker. Ein einzelner SAP/Salesforce/HTTP-Action-Flow **zwingt alle Nutzer, die den Flow auslösen, auf Power Automate Premium** ($15/User/Monat). In einem 50-Personen-SMB mit genau einem Premium-Flow: $750/Monat statt $15 (wenn nur 1 Maker). *Gegenmittel*: Service-Principal-Ownership + API-First als Connector (Standard-Action bleibt) oder Agent Flow (Premium by default, aber kein Per-User-Zwang).
- **Agent Flows mit Cloud Flows verwechseln** — Unterschiedliche Billing-Pipe, unterschiedliche Lifecycle-Rules (kein Share/Copy bei Agent Flows!), Konvertierung ist Einwegs-Operation. Vor Produktiv-Einsatz: Team briefen, welcher Flow-Typ welche Governance-Pattern braucht.
- **Desktop-Flow-Stabilität (UI-Scraping-Fragilität)** — Jede Software-Aktualisierung der Zielanwendung kann den Flow brechen. Self-Healing (Wave 1 2026) mildert das, ersetzt aber kein Monitoring. *Gegenmittel*: Alert-Flow auf Fail-Rate, API-First wo möglich (auch wenn teurer zu bauen).
- **Orphan-Flows bei Mitarbeiter-Wechsel** — Flow-Owner (User) verlässt Firma → Flow läuft zunächst weiter, aber bei abgelaufenem OAuth-Token schlagen Connections fehl (silent). *Gegenmittel*: Service-Principal-Ownership für business-kritische Flows von Anfang an, CoE-Kit-Reports für Orphan-Flows monatlich.
- **Copilot-Credit-Kapazitäts-Exhaustion** — Agent-Flow-Actions aus generativer Orchestration verbrauchen **pro Action** einen Credit. Ein Agent, der 5 Tools mit je 8 Actions aufruft, verbraucht 40+ Credits pro User-Turn. Bei 200 000 Credits Monats-Capacity → ~5 000 solcher Turns. Bei viraler Agent-Adoption schnell zu knapp. *Gegenmittel*: PAYG-Billing als Backup + Capacity-Alert bei 70 %.
- **Agent-Flow-Ownership ohne Share** — Agent Flows können **nicht geteilt werden**, haben **keine Co-Owner**. Bei Maker-Wechsel muss der Flow entweder re-authored oder komplex migriert werden. Das kostet — auf Cloud-Flow-Sharing-Convenience ist nicht Verlass. *Gegenmittel*: Solution-basierte Versionierung + Dokumentations-Standard pro Agent Flow.
- **DLP-Policy-Fail-Open im Default-Environment** — Viele Kunden starten mit Flows im Default-Environment, wo DLP-Policies oft Fail-Open konfiguriert sind. M365-Daten → Dropbox/Google-Drive per Flow = Compliance-Incident wartet darauf. *Gegenmittel*: Dedizierte Environments + restriktive Default-DLP + CoE-Governance vor dem ersten Premium-Flow.
- **Copilot-NL-Authoring bekommt den Flow nie ganz richtig** — „Erzähl Copilot einfach, was du willst" klappt für Grundgerüst, der Feinschliff (Expressions, Error-Handling, Retry-Policies) passiert im Designer. Enttäuschung vorprogrammiert, wenn das Kunde als „one-click"-Feature erwartet.
- **AI-Builder-Seeded-Credits-Sunset 01.11.2026** — Bestandskunden, deren Flows AI-Builder-Actions nutzen, bekommen zum Jahresende 2026 ein Kostenüberraschung, weil die seeded Credits entfernt werden → Umstellung auf Copilot-Credits. *Gegenmittel*: Kunden bis Q3 2026 aktiv über Flows mit AI-Builder informieren und Migrationsplan machen.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Copilot Studio]]** | Haupt-Partner. Agent Flows als Tool für Declarative Agents, Agent-Node im Flow als Reasoning-Step | GA (Wave 2 2025) | Credit-Billing vs. Copilot-Lizenz-Billing sorgt für Verwirrung; keine Agent-Flow-Sharing-Pattern |
| **[[Dataverse]]** | Implizit als Backing-Store für Solution-Flows, Agent Flows, AI-Builder-Metadata; Dataverse-Connector für CRUD | GA | Dataverse-Capacity wird mitverbraucht; bei freien Dev-Environments Frustration über API-Limits |
| **[[Microsoft 365 Copilot]]** | M365-Copilot-User können Agent Flows ohne Credit-Verbrauch aus ihrer M365-Copilot-Lizenz triggern | GA | Policy-Abgrenzung zur Environment-Capacity nicht trivial |
| **[[Microsoft Graph]]** | Graph-Connector (Standard für Basic, Premium für erweiterte Operationen) | GA | Neue Graph-API-Features meist mit Delay im Connector; Graph-Beta nicht abgedeckt |
| **[[Logic Apps]]** | Teilen Engine + Designer + viele Connectors; Flows können zu Logic Apps exportiert werden | GA | Connector-Parity nicht 1:1 (Premium-Unterschiede); kein In-Place-Migrationspfad |
| **Power Apps** | Flow als Backend-Action für Canvas/Model-Driven Apps | GA | App-Maker muss Flow-Ownership verstehen |
| **Power BI** | Data-Alerts triggern Flows; Flows schreiben in semantic models | GA | Premium-Connector für Power-BI-Admin-Operationen |
| **[[Microsoft Agent Framework]]** | MAF-Agent ruft Flow via HTTP-Trigger; Flow kann MAF-Agent nicht direkt als Tool-Action einbinden (nur via generic HTTP) | GA (indirekt) | Kein nativer MAF-FunctionTool-Decorator für PA-Flows |
| **Dynamics 365** | Eingebettete Flow-Entitlements in D365-Plänen; tiefe Connector-Abdeckung | GA | D365-PA-Entitlement ist eingeschränkt (nur D365-Connectors) |
| **Azure OpenAI / Foundry** | Connector für Chat-Completion, Embedding, DALL·E in Flows | GA | Premium-Connector, Token-Kosten extra; kein Streaming |
| **Teams** | Adaptive Cards, Channel-Events, Approvals, Copilot-in-Teams-Trigger | GA | Adaptive-Card-Experience beim Maker steil; Approvals-State im Dataverse |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **Salesforce, ServiceNow, SAP, Workday, Oracle EBS** | CRUD + Event-Abos | GA (Premium Connector) | Premium-Lizenz-Zwang für alle Flow-Nutzer; für Enterprise-Depth → [[Logic Apps]] bevorzugen |
| **Zapier / n8n / Make** | Überlappende Use-Cases; in SMB oft schon vorhanden | — | Migration mühsam; PA-Haupt-USP: M365 + Copilot-Studio-Tiefe, die dort fehlt |
| **GitHub / Jira / Slack** | Standard-Connectors für DevOps-/PM-Flows | GA | Slack-Connector ist Premium (überraschend) |
| **SFTP / FTP / SMTP / HTTP** | Klassische Integrations-Primitive | GA (HTTP = Premium!) | HTTP-Action ist der häufigste Premium-Trigger-Auslöser |

### APIs / Protokolle

- **Azure Workflow Definition Language** (JSON) — geteilt mit [[Logic Apps]], auf Wunsch direkt editierbar
- **Power Platform REST API / Management API** — Flow-Lifecycle, Run-History, Connection-Management
- **Dataverse Web API (OData)** — für Solutions, Agent-Flow-Metadaten, CoE-Reports
- **Connector-Framework** — Custom-Connector via OpenAPI/Swagger-Definition (Premium-Nutzung)
- **MCP (Model Context Protocol)** — **Process-Intelligence-MCP-Server** ab Wave 1 2026 angekündigt (Process Mining als MCP-Tool für Foundry-Agenten). Für Flows selbst: indirekt via Copilot-Studio-Agent-Tool-Layer.

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Flow-Daten, Run-History und Dataverse-State folgen der **Power Platform Environment-Region** (nicht dem M365-Tenant-Haupt-Land). **Switzerland North**: verfügbar seit 2020. EU-Regionen abgedeckt durch EU-Data-Boundary-Commitment (Kunden-Daten + Service-Daten in EU). **Cross-Region-Move** für Copilots/AI-Agents nur in definierten Fällen (z.B. Modell-Nicht-Verfügbarkeit in Region) — für regulierte Szenarien explizit konfigurieren. |
| **Prompts & Outputs** | Cloud-Flow-Inputs/Outputs werden in Run-History gespeichert (Retention konfigurierbar, Default 28 Tage). Keine Nutzung für Modell-Training (Azure-/M365-DPA-Standard). Für AI-Actions (AI Builder, Copilot) zusätzlich Azure-OpenAI-/Foundry-DPA. Opt-out für Run-History → nicht standardmäßig, Workaround: sensitive Inputs via `secureInputs: true` im Flow-JSON. |
| **Data Processing Addendum (DPA)** | Vollständig in Microsoft Product Terms + M365-/Power-Platform-DPA abgedeckt. Keine separaten Anlagen nötig (im Gegensatz zu einigen Foundry-Preview-Features). |
| **EU-AI-Act-Klassifizierung** | Keine produktspezifische MS-Einordnung. Agent Flows, die LLM-Actions nutzen, müssen vom Kunden Use-Case-bezogen bewertet werden (Limited-Risk bei typischen Produktivitäts-Szenarien, High-Risk bei HR/Kreditentscheidungen/etc.). |

### Microsoft-Compliance-Stack

- **Entra ID** — Authentifizierung für Designer-Zugriff, OAuth für Connectors, **Service Principal** für Production-Flow-Ownership (Best Practice)
- **Conditional Access** — auf Power-Platform-Environment-Zugriff anwendbar, Connector-spezifische Policies via **Power Platform Customer Savings Plan + DLP**
- **DLP (Data Loss Prevention) Policies** — zentraler Governance-Hebel: welche Connectors dürfen in einem Flow zusammen auftauchen? Beispiel-Policy: „M365-Data-Group (SharePoint, OneDrive, Outlook)" + „Non-Business-Group (Dropbox, Gmail, Twitter)" → Flows können nicht beide in einem Graph nutzen
- **Microsoft Purview** — Governance-Abdeckung für Power-Platform-Ressourcen (Flow-Inventar, Sensitivity-Labels auf Dataverse-Tabellen, DLP-Integration)
- **Defender for Cloud Apps** — Power-Platform-App-Governance-Erweiterung seit 2024; Anomalie-Erkennung bei Flow-Runs
- **Managed Environments** — Premium-Governance-Layer (Weekly Digests, Sharing-Limits, Solution-Checker) — relevant ab ~50 Flows
- **CoE Starter Kit** — offizieller Microsoft-Toolkit, Must-Have für Kunden ab ~20 Makern

### Bekannte Compliance-Lücken

- **Default-Environment fail-open** — Microsoft provisioniert initial ein Default-Environment ohne DLP-Restriktionen. Kunden bauen dort erste Flows, und M365→Third-Party-Exfil wird nicht blockiert. *Hebel für Journai*: Bei jedem Kunden-Engagement: dedizierte Environments + restriktive Default-DLP als Tag-1-Maßnahme.
- **Service-Principal-Ownership nicht Default** — Flows werden initial auf den erstellenden User geownt. Bei Mitarbeiter-Austritt: Orphan-Flow-Risiko. MS empfiehlt Service-Principals, aber kein Nudge im Designer. *Hebel*: als Production-Gate im Governance-Canvas.
- **Premium-Connector-Auth ohne OBO** — Einige Premium-Connectors (HTTP mit Custom-Auth, SAP) arbeiten mit statischen Credentials im Connection-Store statt User-Impersonation. Bei Flow, der User-Kontext braucht, Custom-Wiring nötig.
- **Copilot-Studio-Agent-Flow-Credits ≠ M365-Copilot-User-Credits** — für lizenzierte M365-Copilot-User entfällt Capacity-Zug, für andere User nicht — schwer zu erklären im Kundengespräch.
- **EU-AI-Act-Einordnung produktspezifisch fehlt** — für Kunden mit HR-/Credit-Decision-Agents via Agent Flows: Dokumentation zum Risk-Tier muss selbst geschaffen werden. *{TODO: beobachten, ob MS bis Q4 2026 publizierte Einstufung liefert}*.
- **Cross-Region-Data-Move** — Für einige Copilot-Features sendet MS Anfragen regionsfremd, wenn Modell in Heimat-Region nicht verfügbar. Für regulierte CH-Banken-Szenarien Region-Pin für zugrunde liegende Azure-OpenAI-Ressource Pflicht.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Power Automate Overview | https://learn.microsoft.com/en-us/power-automate/ | 2026-04-22 | allgemeine Änderungen |
| Docs | Agent Flows Overview (Copilot Studio) | https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview | 2026-04-22 | Agent-Flow-Konzept + Billing |
| Docs | Agent Flows FAQ | https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs | 2026-04-22 | Abgrenzung zu Cloud Flows, Lizenzmodell |
| Docs | Use agent flows with your agent | https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-flow | 2026-04-22 | bidirektionale Agent/Flow-Integration |
| Docs | Hosted RPA Overview | https://learn.microsoft.com/en-us/power-automate/desktop-flows/hosted-rpa-overview | 2026-04-22 | Hosted-Machine-Pattern |
| Docs | Premium RPA Features | https://learn.microsoft.com/en-us/power-automate/desktop-flows/premium-features | 2026-04-22 | RPA-Lizenz-Grenzen |
| Docs | Service Principal Support | https://learn.microsoft.com/en-us/power-automate/service-principal-support | 2026-04-22 | Production-Ownership-Pattern |
| Docs | Manage Orphan Flows | https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/flow-management/manage-orphan-flow-when-owner-leaves-org | 2026-04-22 | Governance bei Mitarbeiter-Wechsel |
| Docs | Regions Overview | https://learn.microsoft.com/en-us/power-automate/regions-overview | 2026-04-22 | Data-Residency-Planung |
| Docs | EU Data Boundary | https://learn.microsoft.com/en-us/power-automate/flow-eudb | 2026-04-22 | EU-Compliance |
| Docs | Power Automate Migration (to Logic Apps) | https://learn.microsoft.com/en-us/azure/logic-apps/power-automate-migration | 2026-04-22 | Eskalationspfad zu Logic Apps |
| Docs | Integration Platform Comparison | https://learn.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs | 2026-04-22 | Positionierung PA / LA / Functions |
| Pricing | Power Automate Pricing | https://www.microsoft.com/en-us/power-platform/products/power-automate/pricing | 2026-04-22 | Preisänderungen |
| Pricing | Power Platform Licensing Guide (Apr 2026) | https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/bizapps/Power-Platform-Licensing-Guide-April-2026.pdf | 2026-04-22 | autoritative Lizenz-Referenz |
| Docs | End of AI Builder Credits (2026-11-01) | https://learn.microsoft.com/en-us/ai-builder/endofaibcredits | 2026-04-22 | Kosten-Migration Q4 2026 |
| Release Plan | Power Automate 2026 Wave 1 | https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/power-automate/ | 2026-04-22 | Feature-Roadmap Apr–Sep 2026 |
| Release Plan | Copilot Studio 2025 Wave 2 | https://learn.microsoft.com/en-us/power-platform/release-plan/2025wave2/microsoft-copilot-studio/ | 2026-04-22 | Agent-Flow-GA-Kontext |
| Release Plan | Invoke agents as workflow steps (Agent-Node) | https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/microsoft-copilot-studio/invoke-agents-as-workflow-steps-agent-node | 2026-04-22 | Flow → Agent-Richtung (Wave 1 2026) |

### Secondary (Tech Community / Blogs / Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Power Platform Blog — Hosted RPA Latest Updates | https://www.microsoft.com/en-us/power-platform/blog/power-automate/announcing-new-releases-for-microsoft-power-automate-hosted-rpa/ | 2026-04-22 | Hosted-Machine-Evolution |
| Power Platform Blog — Business Apps Smarter with AI (2026-04-15) | https://www.microsoft.com/en-us/power-platform/blog/2026/04/15/making-business-apps-smarter-with-ai-copilot-and-agents-in-power-apps/ | 2026-04-22 | Agent-Integration-Vision Wave 1 2026 |
| Tech Community — Azure Functions vs Logic Apps vs Power Automate | https://techcommunity.microsoft.com/discussions/azure/azure-functions-vs-logic-apps-vs-power-automate-when-to-use-what/4438720 | 2026-04-22 | Abgrenzungs-Entscheidungsraster |
| Source EMEA — Microsoft Digital Sovereignty Switzerland | https://news.microsoft.com/source/emea/2026/02/how-microsoft-is-addressing-digital-sovereignty-in-switzerland/ | 2026-04-22 | CH-Banking-/Healthcare-Relevanz |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Wave 1 2026 Desktop-Flow-AI-Authoring, Self-Healing, Process-MCP-Server Details |
| AI Tour Zürich | 29.04.2026 | CH-Region-Datenresidenz-Details, SMB-Patterns |
| Microsoft Ignite 2026 | Nov 2026 | Wave-2-2026-Agent-Flow-Evolution, Copilot-Credit-Pricing-Review nach einem Jahr |

---

## UNCLEAR

1. **Copilot-Credit-Verbrauch pro Action-Typ** — Microsoft-Doku nennt „Agent flow action" generisch. Ob AI-Actions (Run a prompt, Call an agent) höhere Credit-Kosten haben als klassische Connector-Actions, nicht explizit dokumentiert.
2. **Agent-Flow-Sharing-Roadmap** — Die Einschränkung „kein Copy/Share/Co-Owner" ist Stand 04/2026. Ob Wave 2 2026 das adressiert, unklar.
3. **EUR/CHF-Pricing** — Power-Platform-Pricing-Page zeigt USD. Für CH-/EU-Kunden genaue Local-Currency-Preise via Admin-Center oder CSP-Partner verifizieren.
4. **Desktop Flows aus Agent Flows aufrufen** — Wave 1 2026 kündigt „calling desktop flows directly from Copilot Studio" an. Ob das via Agent Flow oder nur via klassischer Cloud-Flow-Bridge geht, noch nicht klar.
5. **MAF-als-MCP-Tool-Integration** — Keine offizielle Doku, die MAF-Agenten als native Tools in Agent Flows zeigt. Stand 04/2026 nur via HTTP-Wrapper. Ob das Wave-1-2026-Agent-Node-Feature auch MAF-Agenten erfasst, nicht dokumentiert.
6. **EU-AI-Act-Einordnung für Agent Flows mit AI-Actions** — Produktspezifische Klassifizierung fehlt.

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Power Automate: Cloud/Desktop/Agent Flows, Lizenz-Matrix, Abgrenzung zu Logic Apps, Copilot-Credit-Modell | https://learn.microsoft.com/en-us/power-automate/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
