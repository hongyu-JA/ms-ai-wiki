---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Teams SDK, Teams AI Library, Microsoft Teams SDK]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Teams SDK

*Teams-spezifische **UI/UX- und Channel-Library** für Agents in Microsoft Teams — Adaptive Cards, Messaging Extensions, Meeting-Hooks, Tabs mit SSO, Dialogs. Ergänzt [[M365 Agents SDK]] auf Protocol-/Hosting-Ebene und konsumiert typischerweise [[Microsoft Agent Framework]] als Agent-Logik. Umbenannt von „Teams AI Library" zu „Teams SDK" am 2025-11-17.*

> **Analogie:** Was React Native für Mobile-UI-Komponenten ist, ist Teams SDK für Teams-native UI-Elemente — eine kuratierte Library für das Teams-Rendering-Modell, die Adaptive Cards, Messaging Extensions und Meeting-Context-APIs zu einer konsistenten Programmier-Oberfläche zusammenfasst.

---

## Einsatz

### Job-to-be-done

When I einen Agent in Microsoft Teams deployen und das volle Teams-UI-Erlebnis nutzen will (Adaptive Cards, Messaging Extensions, Meeting-Side-Panel, Tab-SSO, Activity Feed Notifications), I want to eine Teams-spezifische Abstraktion nutzen, die Activity-Protocol-Handling, Teams-Events und Adaptive-Cards-Rendering sauber kapselt, so I can die Unterschiede zu generischem Chat ohne Boilerplate nutzen — statt manuell JSON für Teams-Channel-Data zu bauen.

### Trigger-Signale

- „Wir wollen unseren Agent-Output in hübschen Adaptive Cards, nicht nur Text — mit Buttons, Formularen und Refresh ohne Reload."
- „Der Agent soll in Teams-Meetings als Side-Panel-App mitlaufen und Meeting-Context auswerten."
- „Wir haben Teams-Bots auf `Microsoft.Teams.AI` v1 im Einsatz — was jetzt nach der Umbenennung?"
- „Wir brauchen eine Messaging Extension, damit Kollegen aus dem Compose-Box heraus CRM-Datensätze ziehen können."
- „Unser Tab-App soll Entra-SSO nutzen, damit Nutzer nicht noch einmal einloggen müssen."

### Einsatz-Szenarien

1. **Adaptive-Card-zentrischer Teams-Agent** — MAF-basierter Agent antwortet nicht mit reinem Text, sondern mit strukturierten Adaptive Cards (Ticket-Status, Formular-Eingabe, Bestätigungs-Dialog). Universal Actions (`Action.Execute`) erlauben eine Card-Refresh ohne neuen Chat-Turn. *Journai-Fit: Standard-Muster für jeden Pro-Code-Teams-Agent mit UI-Anspruch.*
2. **Meeting-Extension mit Side-Panel** — In einem Meeting läuft eine Side-Panel-App, die Live-Notes, Entscheidungen und Action-Items an einen Agent (MAF) schickt, der am Ende eine Zusammenfassung ins Chat postet und Tasks in Planner anlegt. *Journai-Fit: konkret bei Kunden mit strukturierter Meeting-Kultur (Beratung, Projektmanagement).*
3. **Messaging Extension für Line-of-Business-Daten** — Nutzer triggert im Teams-Compose-Box `@CRM` und erhält eine durchsuchbare Result-Liste (Search-Command) oder öffnet ein Dialog (Action-Command) zum Anlegen eines neuen Kontakts. Link-Unfurling zeigt Card-Vorschau beim Einfügen einer CRM-URL. *Journai-Fit: klassisches SMB-Szenario für CRM/ERP-Integration.*
4. **Migration Teams AI Library v1 → Teams SDK v2** — Bestandskunden-Bot auf neuem SDK umstellen (Package-Rename, `ActionPlanner` → Tool-Calling, `functions`+`actions` konsolidiert). *Journai-Fit: Bestandskunden-Pflege, v1 seit 2025-09-18 deprecated.*

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | SDK selbst kostenlos (OSS, MIT) · Teams-Lizenzen für End-User · bei Custom Engine Agent im M365 Copilot zusätzlich M365-Copilot-Lizenz · bei Messaging-Extension-Publishing in AppSource: Partner-Center-Account |
| **Tenant / Infrastruktur** | M365-Tenant mit Teams · Azure Bot Registration (für Bot-/Messaging-Extension-Szenarien) · Entra-App-Registration (Delegated + App-Only je nach Szenario) · Hosting in Azure Container Apps / App Service / Functions |
| **Skills / Rollen** | Pro-Code-Entwickler (C# .NET 8+, Node.js 20+, Python 3.10+) · Adaptive-Cards-Authoring-Skills (eigener Lern-Stack!) · Teams-Admin für App-Sideloading und -Publishing · Entra-Admin für App-Registration und Admin-Consent |
| **Compliance-Rahmen** | Teams-Daten fließen durch MS-globale Bot-Service-Endpoints (regionale Weiterleitung möglich) · EU Data Boundary deckt *Teams-Customer-Data*, aber Bot-Service-Channel-Data nicht vollständig ab · DPA via MS Online Services DPA |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Minimal-Teams-Bot mit Adaptive Card: 1–2 Beratertage · Messaging Extension mit Search + Link-Unfurling: 3–5 Tage · Meeting-Extension mit Side-Panel + Stage: 5–8 Tage · Migration v1 → v2: 2–5 Tage je Bot |
| **Laufende Lizenzkosten** | SDK kostenlos · Hosting 30–150 EUR/Monat (Container Apps B1 / App Service) · Teams- und Copilot-Lizenzen beim Kunden vorhanden · keine SDK-Runtime-Gebühren |
| **Laufender Betrieb** | 0,5 Tag/Monat Monitoring + Manifest-Updates · bei Adaptive-Card-Schema-Evolution gelegentlich größere Refactorings *(eigene Einschätzung)* |

### Empfehlung

**Status:** 🟢 **Empfehlen** — Standard-Library für alle Teams-zentrischen Pro-Code-Agents ab 2026. Die Konsolidierung Teams-AI-Library + TeamsFx zu „Teams SDK" ist inhaltlich sauber (weniger Boilerplate, native MCP/A2A-Unterstützung, konsistente API über C#/JS/Python). Für rein chat-basierte Agents ohne Teams-UI-Spezifika reicht [[M365 Agents SDK]] allein — dann ist Teams SDK Overkill.

**Nächster Schritt für Journai:**
- Internes Referenz-Deployment „MAF + M365 Agents SDK + Teams SDK" mit Adaptive-Card-Antwort und Messaging-Extension in eigenem Tenant
- Migration-Runbook „Teams AI Library v1 → Teams SDK v2" (TypeScript + C#) bis Mai 2026
- Workshop-Baustein „Adaptive Cards richtig designen" für SMB-Kunden entwickeln — Adaptive-Cards-Authoring ist ein eigener Skill und wird regelmäßig unterschätzt

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA für **C#** und **JavaScript/TypeScript** · **Public Preview** für Python (Stand 2026-04) |
| **GA-Datum** | 2025-09 (Teams AI Library v2) · Rename zu „Teams SDK" 2025-11-17 · aktives Release-Kadence ~ alle 2 Wochen (zuletzt: 2026-04-14) |
| **Standalone-Preis (USD)** | SDK kostenlos (MIT-Lizenz, OSS via `github.com/microsoft/teams-sdk`) |
| **Standalone-Preis (EUR)** | n/a — keine Gebühren; Kosten nur auf Hosting + Azure Bot Service |
| **Lizenz-Bundle** | Kein SDK-Bundle. Teams-Lizenzen beim End-User Pflicht; M365-Copilot-Lizenz nur für Custom-Engine-Agent-Publishing im Copilot |
| **Voraussetzung** | .NET 8.0 / Node.js 20+ / Python 3.10+ · Azure Bot Registration · Entra-App-Registration · M365 Agents Toolkit (VS Code / Visual Studio) empfohlen |
| **Region-Verfügbarkeit** | SDK global · Teams-Channel global · Azure Bot Service mit regionalen Endpoints (Europe wählbar); Customer-Data-Routing geht trotzdem initial durch globalen Endpoint *(DSGVO-Flag, siehe Security)* |
| **CSP-Promo / Discounts** | Nicht anwendbar (OSS) |
| **Hidden Costs** | Application-Insights-Log-Ingestion bei hohem Chat-Volumen · Direct-Line-Channel-Traffic (falls für Web-Embed genutzt) ~0,50 USD / 1.000 Messages · Adaptive-Card-Designer ist kostenlos, aber Design-Aufwand nicht zu unterschätzen |
| **Upgrade-Pfad** | **Teams AI Library v1 → v2/Teams SDK**: Package-Swap (`@microsoft/teams-ai` → `@microsoft/teams.apps`), ActionPlanner → natives Tool-Calling, `functions`+`actions` konsolidiert zu `functions`, Auth-Config neu. Migration seit 2025-09-18 verpflichtend (v1 deprecated). **TeamsFx → Teams SDK**: TeamsFx wird vom Teams SDK absorbiert (Tabs, Bots, Message Extensions, Dialogs), TeamsFx-Package formell in Wartungsmodus. |

---

## Kernkonzept

### Was es im Kern ist

Das Teams SDK ist die **Teams-UX- und Protocol-Adaption-Library** für Agents, die in Microsoft Teams laufen. Es implementiert drei Dinge in einem gemeinsamen API-Shape:

1. **Activity-Protocol-Bindings für Teams-spezifische Events** — Meeting-Start/Stop, Channel-Message-Edit, Message-Reaction, Messaging-Extension-Invokes, Tab-Context-Events. Das sind alles Activity-Subtypen, die im generischen Bot-Framework-Protokoll existieren, aber im Teams SDK eine typisierte, idiomatische API bekommen.
2. **Adaptive-Card-Authoring und -Rendering** — strict-typisierte C#/TS/Python-Objekte für das Adaptive-Card-Schema (aktuell bis v1.5 voll in Teams, mit Mobile-Schema-1.6-Enhancements), inklusive Action-Handlers für `Action.Execute` (Universal Actions), `Action.Submit`, `Action.OpenUrl`.
3. **Teams-JS-Integration für Tabs und Dialogs** — die clientseitige TeamsJS-Library (`@microsoft/teams-js`) wird vom SDK typisiert gekapselt; Tabs können so Context, Auth-Token und Theme des Teams-Clients programmatisch abfragen, Dialogs (früher „Task Modules") sowohl HTML- als auch Card-basiert öffnen.

Die zentrale Architektur-Wette des SDK ist: **Teams-UI gehört nicht in die Agent-Logik.** Ein MAF-Agent kennt nur Strings-in/Strings-out plus Tool-Calls; das Teams SDK wandelt dazwischen zwischen Adaptive Cards, Meeting-Context und Activity-Events. Die andere Wette ist **Konsolidierung**: Teams AI Library v1, TeamsFx, Botbuilder-Teams-Extensions und Teams-JS werden alle in einem Paket-Namespace versammelt (`@microsoft/teams.*` in JS, `Microsoft.Teams.*` in .NET), statt weiterhin als lose Fragmente zu existieren. Laut Microsoft-Messaging reduziert das Boilerplate um 70–90 % — das ist Marketing, aber die Richtung ist real.

Wichtige Abgrenzungen, die in Kundengesprächen ständig auftauchen:

- **Teams SDK ≠ [[M365 Agents SDK]]**: Agents SDK ist der Activity-Protocol- und Multi-Channel-Hosting-Layer (Teams + WebChat + Slack + …); Teams SDK ist die *Teams-Spezialisierung* darauf. Beide können zusammen eingesetzt werden, Teams SDK greift unter der Haube auf die Agents-SDK-Primitiven zurück. Für einen Teams-only-Agent reicht Teams SDK allein; für Multi-Channel zusätzlich Agents SDK.
- **Teams SDK ≠ Teams Toolkit / Agents Toolkit**: Teams SDK ist eine Code-Library (Runtime); Agents Toolkit (ex Teams Toolkit) ist die VS-Code/Visual-Studio-Extension für Scaffolding, Manifest-Generation, Debug-Tunnel, App-Packaging. Beide Namen verwenden „Teams", sind aber unterschiedliche Produkte (Library vs. Tooling). Das Agents Toolkit gehört entwicklerseitig zu [[M365 Agents SDK]], wird aber auch für Teams-SDK-Projekte benutzt.
- **Teams SDK ≠ [[Copilot Studio]]**: Copilot Studio ist Low-Code; Teams SDK ist Pro-Code. Ein Copilot-Studio-Agent kann in Teams publiziert werden, nutzt aber intern andere Rendering-Primitiven.
- **Teams SDK ≠ [[Microsoft Agent Framework]]**: MAF ist Agent-Logik (Prompts, Tool-Use, Multi-Agent); Teams SDK ist UI/Channel. Typische Produktions-Kombination: MAF für Logik + M365 Agents SDK für Protocol/Hosting + Teams SDK für Teams-UI.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| Governance / Identity | Agent-Identität, Lifecycle, Audit | [[Agent 365]] + [[Entra Agent ID]] |
| **UI / UX** | **Adaptive Cards, Messaging Extensions, Tabs, Dialogs, Meeting-Apps, Activity-Feed-Notifications** | **Teams SDK** (diese Note) + TeamsJS (client-side) |
| Channel / Protocol | Activity-Protocol, Multi-Channel-Adapter, State, Auth | [[M365 Agents SDK]] |
| Agent Logic (Orchestration) | System Prompts, Tool-Use, Multi-Agent-Patterns | [[Microsoft Agent Framework]] · LangChain · eigener Code |
| Model APIs | Chat-Completion, Embeddings | Azure OpenAI · Foundry Models |
| Compute | Container, Functions, App Service | Azure Container Apps · Azure Functions · Foundry Agent Service |
| Data / Knowledge | RAG, Graph-Zugriff, Files | Azure AI Search · [[Microsoft Graph]] · Foundry IQ |

### Kern-Fähigkeiten

#### Adaptive Cards — Authoring, Rendering, Universal Actions

Teams SDK liefert strict-typisierte Card-Builder für das Adaptive-Card-Schema. In Teams werden Karten offiziell bis **Schema 1.5** voll gerendert; Schema-1.6-Features sind nur partiell verfügbar (speziell Mobile-Rendering-Enhancements wie dynamic typeahead). Karten-Versionen ≥ 1.6 können stillschweigend Fallback auslösen — ein häufiger Fallstrick. Das SDK zwingt zur Version-Deklaration (`version = "1.5"`) und validiert lokal.

**Universal Actions** (`Action.Execute`) sind der moderne Action-Mechanismus: eine Karten-Action geht durch den Bot, der sie verarbeitet und mit einem neuen Karten-Zustand antwortet. Das erlaubt *In-place-Updates* einer Karte ohne neuen Chat-Turn — etwa Ticket-Status-Wechsel, Form-Validierung oder Multi-Step-Workflows. Das SDK kapselt den `invoke`-Activity-Turn und bietet `onCardAction(...)`-Handler. Grenze: ohne Fallback auf `Action.Submit` brechen alte Teams-Clients; das Pattern `fallback: Action.Submit` ist Pflicht und vom SDK aus nicht erzwungen — das muss der Entwickler manuell beachten.

#### Messaging Extensions — Search / Action / Link Unfurling

Drei orthogonale Extension-Typen, alle typisiert im SDK:

- **Search-Command**: Nutzer tippt in Compose-Box `@MyApp query`, Bot antwortet mit Result-Liste (je Ergebnis eine Card). Typisch für CRM-Record-Lookup, SharePoint-Suche.
- **Action-Command**: Compose-Box-Aktion öffnet Dialog (HTML oder Card), der Daten sammelt und als Card zurück in den Chat postet. Typisch für „Neuen Eintrag anlegen"-Flows.
- **Link-Unfurling**: Wenn ein Nutzer einen URL-Link einfügt, invoziert Teams den Bot, der mit einer Preview-Card antwortet. Cache: 30 Minuten pro URL. **Zero-Install-Link-Unfurling** funktioniert auch *vor* App-Installation — ein unterschätzter Distribution-Hebel.

Grenze: Messaging Extensions werden über den Bot-Framework-Channel ausgeliefert, erzwingen also Azure Bot Registration. Meta-Metadaten (Icon, Beschreibung) landen im Teams-Manifest, nicht im Code.

#### Meeting-Apps — Side-Panel, Stage, Meeting-Events

Teams SDK kapselt die Meeting-spezifischen Capabilities: **Side-Panel** (App als Panel neben dem Meeting-Stage, 320 px breit, persistent sichtbar), **Share-to-Stage** (programmatischer Wechsel einer Teilansicht in den Main-Stage), **Meeting-Events** (Start, Stop, Participant-Join, Participant-Leave via Event-Subscription), **In-Meeting-Tab**. Side-Panel und Stage sind HTML-basierte Tab-Apps mit Meeting-Context (Meeting-ID, aktuelle Teilnehmer, Rolle). Der Meeting-Context-Payload enthält bewusst keine Transcripts — dafür ist die Graph-API bzw. [[Microsoft Agent Framework]]-Integration mit Meeting-Summarization zuständig. **Live Share SDK** ist ein *separates* Paket (siehe Integrationen) für kollaborative Multi-User-Zustände und wird nicht vom Teams SDK abgedeckt. Grenze: Meeting-Apps brauchen explizites Manifest-Permission (`meetings`) und sind in BYOK/Gov-Tenants teils eingeschränkt.

#### Tabs mit Entra-SSO

Tabs sind HTML-basierte In-Teams-Webviews. SSO läuft über einen zweistufigen Flow: (1) TeamsJS fordert einen Auth-Token beim Teams-Client an (`authentication.getAuthToken()`), der Token ist ein Entra-ID-Token für die App-Registration; (2) der Bot-Backend tauscht diesen Token via On-Behalf-Of-Flow gegen Graph-oder-Tool-Tokens mit den nötigen Scopes. Teams SDK automatisiert Schritt (2), TeamsJS den Client-seitigen Schritt (1). **Agents Toolkit** übernimmt die Entra-App-Registration-Verdrahtung. Grenze: Admin-Consent ist bei delegierten Scopes Pflicht — Consumer-Tenants ohne Admin-Consent sehen bei ersten Calls einen Dialog, den Teams-Admins oft übersehen. Multi-Tenant-SSO ist möglich, braucht aber explizite `azure` + `audience`-Konfiguration.

#### Dialogs (ex Task Modules)

Modal-Overlays in Tabs oder Bot-Conversations. Seit TeamsJS v2.8 gibt es `dialog.url.open` (HTML) und `dialog.adaptiveCard.open` (Card-basiert) — `tasks.startTask()` aus v1 ist deprecated, läuft aber noch. Dialogs sind der richtige Ort für strukturierte Form-Eingabe (Multi-Field-Validation, File-Upload-Stub); für Single-Field-Inputs reicht ein Adaptive-Card-Formular in der Chat-Timeline. Grenze: Dialog-Größe max. 1060×720 px in Desktop; Mobile-Rendering rollt separat.

#### Activity Feed Notifications

Programmatischer Push in die Teams-Activity-Bell (rechts-oben-Icon). Technisch läuft das nicht über das Teams SDK, sondern über **Microsoft Graph** (`POST /teams/{id}/sendActivityNotification`). Das Teams SDK liefert dazu nur einen typisierten Graph-Helper. Batch-Limit: 100 User pro Call. Das Manifest muss `webApplicationInfo` mit Entra-App-ID enthalten. Use-Case: „Ticket #123 dir zugewiesen" ohne Teams-Chat-Spam. Grenze: Activity-Feed-Notifications sind reine Benachrichtigungen — keine Interaktion, kein Reply; der Click öffnet nur ein Deep-Link-Ziel (Tab, Chat, Card).

#### MCP- und A2A-Integration (neu in v2)

Teams SDK v2 bringt native **MCP-Client**-Unterstützung: ein Teams-Agent kann MCP-Server aufrufen (Graph-MCP, Dataverse-MCP, Third-Party-MCP) und deren Tools in der Adaptive-Card-Antwort rendern. **A2A** (Agent-to-Agent) erlaubt, dass ein Teams-Agent andere Agents als Tools aufruft — das Pattern kommt von MAF und wird im Teams-SDK-Kontext durch einheitliches Context-Passing (State-Sharing via `ConversationReference`) unterstützt. Der Detaillierungsgrad dieser Integration ist bei Microsoft noch dünn dokumentiert (Stand 04/2026); die Primitiven existieren, aber die „Best-Practice"-Patterns sind noch nicht kanonisiert *(eigene Einschätzung — ergänzen nach AI Tour Zürich)*.

#### Streaming / Rich-Output

Für LLM-typische Token-Streaming-Antworten hat das SDK einen `StreamingUX`-Mechanismus: der Bot signalisiert `typing` + partielle Zwischenstände, Teams-Client rendert diese inkrementell. Grenze: nur in modernen Channels (Teams-Chat, M365-Copilot-WebChat); klassische Direct-Line-Embedded-Widgets rendern nicht inkrementell.

### Typischer Workflow

1. **Setup** — Agents Toolkit in VS Code installieren, Template „Basic AI Agent with Teams" oder „Message Extension" wählen. Das Toolkit erstellt Entra-App, Azure Bot Registration und scaffold das Manifest (`manifest.json`) mit allen nötigen Capability-Nodes. Alternativ manuell: `dotnet add package Microsoft.Teams.Apps` / `npm install @microsoft/teams.apps`.
2. **Build / Configure** — `AgentApplication` (aus M365 Agents SDK) anlegen, Teams-SDK-Erweiterungen einhängen (`.use(TeamsMessagingExtensions())`, `.use(AdaptiveCards())`). Agent-Logik (MAF / LangChain) hinter Service-Interface, Tools als MCP-Server oder annotierte Funktionen. Adaptive Cards als typisierte Objekte oder via `AdaptiveCards.io`-Designer als JSON importieren.
3. **Local Debug** — F5 im Agents Toolkit: startet Dev-Tunnel (ehemals ngrok), registriert Bot-Endpoint temporär, sideloaded Manifest in den Teams-Web-Client. Debug-Breakpoints funktionieren im Backend; Adaptive-Card-Preview via Karten-Designer-Browser-Plugin.
4. **Deploy** — Hosting: Container Apps (Standard) oder App Service. CI/CD via Agents Toolkit (`teamsapp deploy`) oder GitHub Actions. Teams-App-Package (`.zip` mit `manifest.json` + Icons) nach Teams Admin Center oder — für organisationsinterne Distribution — direkt in den Teams-App-Katalog.
5. **Publish** — **Org-intern**: Teams Admin Center → Manage Apps → Upload. **AppSource/Commercial Marketplace**: Partner-Center-Validation, Review-Prozess 3–6 Wochen. **M365-Copilot-Custom-Engine-Agent**: via Agents Toolkit mit `copilotAgents`-Node im Manifest (neu seit 2026).
6. **Operate** — Application Insights für Tracing, Teams Admin Center für App-Metrics (Installationen, Aktive User), Agent 365 (ab Mai 2026) für Agent-Identity-Governance.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | .NET 8 / Node.js 20 / Python 3.10+ · ASP.NET Core / Express / FastAPI · **Adaptive-Cards-Authoring** (eigener Skill — Designer nutzen!) · Teams-Manifest-Schema · Entra-App-Registration · Agents Toolkit in VS Code |
| **Admin (beim Kunden)** | Teams-Admin für Sideloading / App-Katalog-Publishing · Entra-Admin für App-Registration + Admin-Consent · bei Messaging-Extension-Publishing Partner-Center-Zugang |
| **End-User (beim Kunden)** | Keine — konsumiert via Teams-Chat / Messaging-Extension-Compose-Box / Meeting-Side-Panel |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Nur für Teams** — nicht portabel zu WebChat, Slack, Direct Line ohne Aufwand | [[M365 Agents SDK]] für Multi-Channel; Teams SDK als Teams-Spezialisierung dazu |
| **Adaptive Cards offiziell nur bis Schema 1.5** | Fallback-Patterns deklarieren; für ≥1.6 auf Mobile beschränken |
| **Keine Agent-Logik** (kein Prompt-Orchestrator, kein Tool-Router eingebaut) | [[Microsoft Agent Framework]], LangChain, CrewAI, eigener Code |
| **Kein Live-State-Sharing zwischen Teilnehmern** (Meeting-Apps) | [[Live Share SDK]] (separates Paket) |
| **Keine DSGVO-konforme Message-Persistenz out-of-the-box** | Eigener State-Store in EU-Region; Bot-Customer-Data-Routing bewusst konfigurieren |
| **Activity Feed Notifications nicht via Bot-API, sondern Graph** | Graph-`sendActivityNotification` + `webApplicationInfo` im Manifest |
| **Python nur Public Preview** (Stand 04/2026) | Für produktive Systeme C# oder TypeScript nutzen |
| **Keine Task-Module-Imports aus altem Bot-Framework-Composer** | Neuimplementierung als Dialog (HTML oder Card) |

### Typische Fallstricke im Einsatz

- **Teams SDK und M365 Agents SDK als Alternativen statt komplementär sehen** — Sie sind keine Entweder-Oder-Wahl. Agents SDK ist Protocol/Hosting, Teams SDK ist UI. Ohne beides wird ein Teams-Bot entweder Feature-arm (nur Agents SDK) oder nicht Multi-Channel-fähig (nur Teams SDK). *Gegenmittel: Stack-Tabelle oben im Kundengespräch zeigen, Referenz-Deployment vorhalten.*
- **Teams Toolkit ≠ Teams SDK** — gleicher Markenname, zwei Produkte. Das Toolkit ist Scaffolding-Extension (Agents Toolkit heißt es seit 2025), das SDK ist Runtime-Library. Kunden verwenden den Namen synonym und bekommen falsche Erwartungen. *Gegenmittel: in Schreiben immer explizit unterscheiden („Library" vs. „Toolkit").*
- **Adaptive-Cards-Schema-Upgrade als „einfach Version hochsetzen" annehmen** — Teams rendert offiziell nur bis 1.5 voll; Features aus ≥1.6 können stillschweigend fallen. *Gegenmittel: Version bewusst auf `"1.5"` setzen, Fallback-Patterns für Universal Actions.*
- **Messaging Extension ohne Azure Bot Registration bauen wollen** — Die Extension invoziert den Bot-Framework-Channel. Ohne Registration bekommt man HTTP 401 Responses, die schwer zu debuggen sind. *Gegenmittel: Agents Toolkit nutzen, das legt die Registration automatisch an.*
- **Rate-Limits unterschätzen** — Per Bot per Thread: 7 Messages/sec, 60 Messages/30 sec. Global per Tenant: 50 RPS. Bei Multi-User-Broadcasts (Activity Feed) hart spürbar. Bei Überschreitung HTTP 429 mit exponentieller Backoff-Pflicht. *Gegenmittel: Aktiv Backoff implementieren, Broadcasts batchen (Graph-API erlaubt 100 User/Call).*
- **DSGVO für Teams-Customer-Data vs. Bot-Service-Data verwechseln** — Teams-Chat-Daten selbst sind in EU Data Boundary abgedeckt. Aber Bot-Service-Channel-Data (die Activity-Payloads, die durch Azure Bot Service fließen) gehen initial durch den globalen Endpoint, bevor sie in die Region geroutet werden. Für regulierte Kunden ist das ein DPO-Gespräch. *Gegenmittel: Region-Selection + Assessment durch DPO, Dokumentation der Data-Flows.*
- **Manifest-Schema-Evolution ignorieren** — Teams-Manifest erhält regelmäßig neue Capability-Nodes (`copilotAgents`, `agenticUserTemplates`, `webApplicationInfo`). Mit veraltetem Schema verliert man Feature-Zugang. *Gegenmittel: Schema-Version immer auf `devPreview` oder aktuellstes GA-Schema, vor jedem Publish Validate-Step.*
- **„Custom Engine Agent"-Publishing für M365 Copilot als Teams-App missverstehen** — Beides nutzt das Teams-Manifest, aber die Publishing-Pfade sind separat (Teams App Catalog vs. M365 Copilot-Katalog). Ein Agent kann in beide publiziert werden, braucht dann aber zwei getrennte Metadaten-Bäume. *Gegenmittel: Publishing-Strategie in Solution-Architecture-Phase entscheiden.*
- **Teams AI Library v1 Bestandscode als „läuft noch, lassen wir"** — v1 ist seit 2025-09-18 deprecated. Keine neuen Features, Security-Patches nur noch bis unbestimmte Frist. *Gegenmittel: Migration als Projekt aufsetzen, nicht als Wartungsaufgabe.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[M365 Agents SDK]] | Protocol + Multi-Channel-Hosting-Fundament | GA, nativ | gering technisch, aber Abgrenzung MAF-vs-Agents-SDK-vs-Teams-SDK im Kundengespräch oft unklar |
| [[Microsoft Agent Framework]] | Agent-Logik (Prompts, Tools, Multi-Agent) | GA, Python 1.1.0 / .NET | gering — Teams SDK ruft MAF-Agent auf, liefert UI drumherum |
| [[Microsoft Graph]] | Aktivitäts-Notifications, Teams-Roster, Chat-History, Files | GA | mittel — Delegated vs. App-Only Auth bewusst wählen |
| Azure Bot Service | Channel-Endpoint für Teams / WebChat / Messaging Extensions | GA | gering — Registration via Agents Toolkit automatisiert |
| Agents Toolkit (VS Code / Visual Studio) | Scaffolding, Debug-Tunnel, Manifest, Publishing | GA, v6.6 (März 2026) | gering — ersetzt TeamsFx |
| [[Microsoft 365 Copilot]] (Custom Engine Agent) | Agent im Copilot-Store publizieren | GA | mittel — Manifest-Schema `copilotAgents`-Node; separates Publishing |
| [[Copilot Studio]] | Low-Code-Alternative | GA | Copilot-Studio-Agents können auch in Teams publiziert werden — Build/Buy-Entscheidung |
| Live Share SDK | Co-Editing / Multi-User-State in Meetings | GA | separates Paket, nicht im Teams SDK enthalten |
| [[Entra Agent ID]] | Agent-Identity (Mai 2026 GA) | Preview / GA | hoch — muss bei Solution-Design bedacht werden |
| Application Insights / Foundry Control Plane | Observability | GA (OTel-native) | gering |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| AdaptiveCards.io Designer | Visuelles Card-Authoring | OSS | gering — exportiert JSON, vom SDK direkt konsumierbar |
| MCP-Server (beliebig) | Tool-Integration (Jira, GitHub, Confluence, CRM) | GA | gering — via Standard-Protokoll |
| LangChain / LangGraph (als Agent-Logik-Alternative) | Orchestrator anstelle von MAF | GA | gering — SDK orchestrator-agnostisch |
| n8n / Zapier / Power Automate | Workflow-Trigger aus Teams-Bot-Events | GA | mittel — Power Automate nativer |
| ngrok (Legacy) | Dev-Tunnel | vorhanden | ersetzt durch Dev Tunnels im Agents Toolkit |

### APIs / Protokolle

- **Activity Protocol** (für Teams-Events, Messaging-Extension-Invokes)
- **Adaptive Cards Schema 1.5** (mit Mobile-1.6-Extensions)
- **Model Context Protocol (MCP)** für externe Tools
- **Microsoft Graph** für Activity-Feed-Notifications, Roster, Context
- **Entra / MSAL** (OAuth2 + On-Behalf-Of) für SSO
- **OpenTelemetry** für Observability
- **TeamsJS** (`@microsoft/teams-js`) für Client-seitige Tabs/Dialogs-APIs

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Teams-Customer-Data (Chat-Inhalte) unter EU Data Boundary für EU-Tenant abgedeckt. **Bot-Service-Channel-Data** läuft *initial* durch globalen Azure-Bot-Service-Endpoint, dann Routing auf regionalen Endpoint (Europe wählbar für Bot-Creator). Für DSGVO-kritische Kunden: Region-Selection in Azure-Bot-Resource + Hosting-Compute in EU + Modell-Endpoint in EU erzwingen. |
| **Prompts & Outputs** | SDK selbst speichert nichts. Activity-Payloads fließen durch Bot Service (Transit, nicht Persistenz). Persistenz-Verantwortung beim Entwickler (State-Store + Modell-Logs). Teams-Chat-History persistiert in Exchange Mailbox (compliance-relevant). |
| **DPA** | Azure Bot Service + Teams + Azure Container Apps + Azure OpenAI unter MS Online Services DPA. M365 DPA zusätzlich für Teams-Channel. |
| **EU-AI-Act** | SDK = Infrastruktur, kein direkter Adressat. Use-Case des Agents entscheidet die Einordnung (z. B. HR-Screening-Agent → High Risk). |

### Microsoft-Compliance-Stack

- **[[Purview für AI]]** — klassifiziert Agent-Outputs, DLP-Policies wirken auf Teams-Channel (sensible Dokumente blockierbar)
- **[[Entra Agent ID]]** — Agent-Identity ab Mai 2026 GA, Voraussetzung für gouvernierte MCP-Tool-Calls
- **[[Agent 365]]** — Control Plane für Agent-Lifecycle, Conditional Access, Audit-Log (ab GA)
- **Azure AI Content Safety** — Prompt-Shields als Eingangs-/Ausgangs-Filter (Agent-Logik-Ebene, nicht SDK)
- **Defender for AI** — Runtime-Schutz der Hosting-Ressource

### Bekannte Compliance-Lücken

- **Bot-Service-Data-Routing nicht vollständig in EU Data Boundary** — initial-Requests laufen durch globalen Endpoint. Für hochregulierte Kunden (Finance, Health, Public Sector) separates Assessment nötig, ggf. auf sovereigne Cloud ausweichen
- **CLOUD-Act-Exposition** — als MS-Produkt potenziell CLOUD-Act-Zugriff auf Teams-Bot-Kommunikation; kein technischer Workaround außer Sovereign-Cloud
- **Federated Chats (Multi-Tenant) umgehen EU Data Boundary** — wenn externe User an Teams-Chat beteiligt, geht Chat-Data an deren Tenant-Region; bei Agent-Antworten in solchen Chats Impact bewerten
- **Activity-Feed-Notifications via Graph sind App-Only-Auth** — Agent kann Notifications an *jeden* User im Tenant senden, solange Graph-Permission (`TeamsActivity.Send`) gewährt; kein per-Conversation-Gating — Governance-Risiko wenn mehrere Agents parallel laufen
- **Adaptive-Card-Input-Felder haben kein eingebautes PII-Redaction** — Nutzer-Eingabe geht als Klartext an Bot; für DSGVO-Relevantes manuell Redaction/Encryption implementieren
- *{TODO: nach Agent 365 GA (Mai 2026) Compliance-Matrix aktualisieren — insbesondere Tenant-externe Agent-Aufrufe}*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Teams SDK (ex Teams AI Library) | https://learn.microsoft.com/en-us/microsoftteams/platform/teams-ai-library/ | 2026-04-22 | allgemeine Änderungen |
| Dev Portal / Docs Hub | Teams Platform Docs | https://learn.microsoft.com/en-us/microsoftteams/platform/ | 2026-04-22 | Feature-Matrix, Manifest, APIs |
| SDK Site (Product Site) | microsoft.github.io/teams-sdk | https://microsoft.github.io/teams-sdk/ | 2026-04-22 | API-Deep-Dives pro Sprache |
| Migration Guide (v1) | Migrating from Teams SDK v1 | https://learn.microsoft.com/en-us/microsoftteams/platform/teams-sdk/migrations/v1 | 2026-04-22 | Package-/Namespace-Mapping |
| Tools & SDKs Overview | Build-and-Test Overview | https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/tool-sdk-overview | 2026-04-22 | SDK-Positionierung |
| Manifest Schema | Microsoft 365 App Manifest Schema | https://learn.microsoft.com/en-us/microsoft-365/extensibility/schema/ | 2026-04-22 | Schema-Evolution für Packaging |
| Agents Toolkit Docs | M365 Agents Toolkit | https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/agents-toolkit-fundamentals | 2026-04-22 | Tooling-Releases |
| Adaptive Cards (offiziell) | AdaptiveCards.io | https://adaptivecards.io | 2026-04-22 | Schema-Versionen, Designer |
| GitHub Repository (Hauptrepo) | microsoft/teams-sdk | https://github.com/microsoft/teams-sdk | 2026-04-22 | Code, Issues, Releases |
| GitHub Repository (Python) | microsoft/teams.py | https://github.com/microsoft/teams.py | 2026-04-22 | Python-spezifische Entwicklung |
| Rate-Limit-Doku | Bots — Rate Limiting | https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/rate-limit | 2026-04-22 | Throttling-Pattern-Monitoring |
| Tech Blog | M365 Dev Blog | https://devblogs.microsoft.com/microsoft365dev/ | 2026-04-22 | Ankündigungen, Tutorials |
| What's New | Teams Platform What's New | https://learn.microsoft.com/en-us/microsoftteams/platform/whats-new | 2026-04-22 | regelmäßige Change-Übersicht |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Voitanos Blog (Andrew Connell) | https://www.voitanos.io/blog/ | 2026-04-22 | Teams-SDK-Evolution-Tracking, kritische Einordnung |
| Directions on Microsoft | — | — | *{TODO: Teams-SDK-Positionierung bei Directions suchen}* |

### Tertiary (Community / MVPs)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
| Copilot Developer Camp | https://microsoft.github.io/copilot-camp/ | 2026-04-22 | Hands-on-Labs für Teams-SDK-Custom-Engine-Agents |
| Microsoft Teams Samples | https://github.com/OfficeDev/Microsoft-Teams-Samples | 2026-04-22 | Referenz-Implementierungen C# / TS |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| AI Tour Zürich 2026 | 2026-04-29 | regionale EU-Details, Agents-Stack-Updates |
| Microsoft Build 2026 | Mai 2026 | Teams-SDK-Deep-Dives, Python-GA, Copilot-Integration |
| Microsoft Ignite 2026 | November 2026 | Next-Gen-Capabilities, Agent-365-Integration, Activity-Feed-Vertiefung |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive inkl. SDK-Sandwich-Positionierung, Teams-Primitiven, Adaptive Cards, Meeting-Hooks, Manifest-Workflow | https://learn.microsoft.com/en-us/microsoftteams/platform/ |
| 2026-04-22 | Hongyu | Initial Stub | — |
