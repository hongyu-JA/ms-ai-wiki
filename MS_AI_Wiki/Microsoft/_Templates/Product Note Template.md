---
watch:           # close | standard | passive
status:          # announced | preview | ga | deprecated
last_verified:   # YYYY-MM-DD - Datum der letzten inhaltlichen Prüfung (= neuester Changelog-Eintrag)
aliases: []      # Frühere oder alternative Produktnamen (z.B. ["Azure AI Studio", "Cognitive Search"])
moc:
  - "[[Microsoft MOC]]"
---

<!--
=====================================================================================
TEMPLATE-ANLEITUNG (beim Instanziieren diesen Kommentar-Block entfernen)
=====================================================================================

ZWECK DIESER NOTE
  Die Product-Notes sind Journais Beratungs-Wissensbasis für das Microsoft-AI-
  Ökosystem. Sie sind KEINE Lernunterlagen und KEINE Feature-Kopien aus den
  MS-Docs. Sie beantworten im Kundengespräch vier Fragen:

    1. Passt dieses Produkt zur Kundensituation? (→ Einsatz)
    2. Kann der Kunde es kaufen/nutzen? (→ Status & Pricing)
    3. Was wird in Marketing-Materialien verschwiegen? (→ Limitierungen & Fallstricke)
    4. Ist die Information noch aktuell? (→ Changelog + Monitoring)

  Jede Sektion muss den Test bestehen: „Liefere ich hier mehr als die MS-Docs?"
  Wenn nicht: kürzen oder streichen.

WATCH-SYSTEM steuert die Beobachtungsintensität UND welche Sektionen ausgefüllt werden.
  Das Feld `watch` sagt aus, wie viel Aufmerksamkeit das Produkt von Journai bekommt -
  je enger wir beobachten, desto tiefer die Note.

  watch: close     → Engmaschige Beobachtung (wöchentlich).
                     Hohe Änderungsdynamik oder direkter Geschäftsimpact.
                     → ALLE Sektionen ausfüllen.
                     Beispiele: Microsoft Agent Framework, Microsoft Foundry,
                                Copilot Studio, Agent 365, Azure AI Search,
                                M365 E7, MCP

  watch: standard  → Regelmäßige Beobachtung (monatlich).
                     Moderate Änderungsdynamik oder Impact - wir müssen fundiert
                     einordnen können.
                     → Pflicht + Integrationen + Security & Compliance.
                     Beispiele: M365 Agents SDK, Dataverse, Logic Apps,
                                Purview für AI, Entra Agent ID, Teams SDK

  watch: passive   → Reaktive Beobachtung (quartalsweise / nur bei Events).
                     Stabil oder nur situativ relevant - Überblick genügt.
                     → Nur Pflicht-Sektionen.
                     Beispiele: Visual Studio 2026 AI, Cosmos DB for AI,
                                Azure OpenAI PTU-Pricing, Deprecation-Radar-Einträge

  Wichtig: `watch` ist dynamisch. Ein Produkt kann wandern (z.B. Bot Framework:
  close → passive → deprecated). Änderungen im Changelog festhalten.

PFLICHT-SEKTIONEN (alle Watch-Levels):
  - Elevator Pitch + Analogie
  - Einsatz (Trigger-Signale + Szenarien + Voraussetzungen + Empfehlung + Next Step)
  - Status & Pricing
  - Kernkonzept (Architektur + Stack + Kern-Fähigkeiten + Typischer Workflow)
  - Limitierungen & Fallstricke
  - Offizielle Referenzen & Monitoring
  - Changelog

OPTIONALE SEKTIONEN (nach Watch-Level):
  - Integrationen              [close + standard]
  - Security & Compliance      [close + standard]
  - Abgrenzung & Wettbewerb    [close]

WAS IST EINE MOC?
  MOC = Map of Content = thematischer Einstiegspunkt im Vault. Eine MOC ist
  KEIN Produkt, sondern bündelt Produkte, die zusammen ein Geschäftsfeld
  beschreiben. Sie erklärt Zusammenhänge (Stack-Diagramme, Eskalations-
  leitern, Decision-Trees) - das kann keine Single-Product-Note leisten.

  Jede Product-Note verlinkt per `moc:`-Frontmatter auf die MOCs, zu denen
  sie thematisch gehört. Mehrfachzuordnung ist erlaubt und erwünscht, wenn
  ein Produkt mehrere Themen berührt.

VERFÜGBARE MOCs (Hybrid-Struktur, Stand 2026-04-17):

  --- ROOT ---
  - [[Microsoft MOC]]                 → Root-Index, jede Product-Note bekommt diesen

  --- 6 PRIMARY HOME (jedes Produkt hat genau EINE Home-MOC) ---
  - [[Agents MOC]]                    → Agenten bauen & orchestrieren: MAF, Copilot
                                         Studio, M365 Agents SDK, Teams SDK, Foundry
                                         Agent Service, Agent 365, MCP, Power
                                         Automate, Dataverse MCP Server, deprecated
                                         SDKs (Bot Framework, SK, AutoGen)
  - [[Copilot MOC]]                   → Copilot & AI-Produktivität: M365 Copilot,
                                         Copilot Cowork, Wave 3, Work IQ,
                                         Copilot Connectors
  - [[Azure AI MOC]]                  → Azure-AI-Plattform (Foundry als Dach):
                                         Microsoft Foundry + alle Foundry-Sub-
                                         Komponenten (Models, IQ, Control Plane,
                                         Tools, Local, SDK, Agent Service),
                                         Azure AI Search, Azure OpenAI, Content
                                         Safety, Document Intelligence, Content
                                         Understanding, Azure ML, Eval SDK, App
                                         Insights
  - [[Data & Knowledge MOC]]          → Daten & Knowledge: Microsoft Graph,
                                         Fabric, OneLake, Dataverse, Fabric Data
                                         Agents, Cosmos DB for AI
  - [[Security & Identity MOC]]       → Security, Governance & Identity: Agent 365,
                                         Entra Agent ID, Entra Suite, Purview
                                         (Portfolio + DSPM + Data Map), Defender
                                         for AI, Content Safety
  - [[Integration & Compute MOC]]     → Integration & Compute: Azure Functions,
                                         Container Apps, APIM AI Gateway, Logic Apps

  --- 2 LENS-HUBS (verlinken quer, KEIN Home!) ---
  - [[Agent-Building-Pattern MOC]]    → „Welche SDKs für welchen Agent-Build?"
  - [[RAG Pattern MOC]]               → „Welches RAG-Backend wofür?"

  --- 1 COMMERCIAL-QUERSCHNITT ---
  - [[Licensing & SKUs MOC]]          → M365 E7, Frontier Program, Wave 3, Copilot-
                                         Lizenz, Azure-OpenAI-Pricing

ZUORDNUNGS-HEURISTIK:
  - Jede Note: [[Microsoft MOC]] + genau EINE Primary-Home-MOC + ggf. [[Licensing
    & SKUs MOC]] (wenn kommerziell relevant)
  - Lens-MOCs werden NICHT als Home referenziert - sie verlinken Produkte quer
    von ihrer Seite aus. Das Produkt hat nur Home-MOC + Microsoft MOC.
  - Beispiele:
      Agent 365       → [[Microsoft MOC]], [[Agents MOC]], [[Security & Identity MOC]]
                        (Ausnahme: Agent 365 hat zwei Homes - Governance-Charakter)
      Copilot Studio  → [[Microsoft MOC]], [[Agents MOC]]
      M365 Copilot    → [[Microsoft MOC]], [[Copilot MOC]]
      Microsoft Foundry → [[Microsoft MOC]], [[Azure AI MOC]]
      Foundry IQ      → [[Microsoft MOC]], [[Azure AI MOC]]
                        (Lens RAG Pattern verlinkt sie von dort aus)
      MAF             → [[Microsoft MOC]], [[Agents MOC]]
                        (Lens Agent-Building-Pattern verlinkt sie quer)
      M365 E7         → [[Microsoft MOC]], [[Licensing & SKUs MOC]]
      Microsoft Graph → [[Microsoft MOC]], [[Data & Knowledge MOC]]
      Azure Functions → [[Microsoft MOC]], [[Integration & Compute MOC]]
      Semantic Kernel (deprecated) → [[Microsoft MOC]], [[Agents MOC]]

BIDIREKTIONALITÄT:
  Wenn du eine neue Product-Note anlegst, prüfe auch die Ziel-MOC(s) und
  ergänze das Produkt in deren „Produkte in dieser MOC"-Tabelle. Sonst ist
  die Verknüpfung einseitig und die MOC bleibt unvollständig. Bei Lens-MOCs:
  Die Produkte verweisen NICHT auf die Lens, aber die Lens muss das Produkt
  in ihrer Referenz-Tabelle haben.

SCHREIB-PRINZIPIEN:
  - Bezieh Stellung. Vage Formulierungen ("kann hilfreich sein") streichen.
  - „Unklar" ist OK - weglassen nicht.
  - Jede Aussage braucht entweder eine Quelle (unter Referenzen) oder ein
    „(eigene Einschätzung)" am Ende.
  - Wenn Microsoft etwas umbenennt/ändert: nicht überschreiben - im Changelog
    eintragen, alte Info unter Kernkonzept als „Historisch" belassen wenn für
    Bestandskunden relevant.

=====================================================================================
-->

# {Produkt-Name}

*{1–2 Sätze Positionierung für einen Kunden, der das Produkt nie gehört hat: Was ist es, für wen, was macht es im Kern besonders. Keine Feature-Liste, kein Marketing. Ziel: Der Kunde versteht in 20 Sekunden, ob es für ihn relevant ist.}*

> **Analogie:** *{Ein-Satz-Analogie als mentales Modell. Gute Analogien verknüpfen das Produkt mit einem Konzept, das der Kunde bereits kennt. Beispiel (Agent 365): „Was Active Directory für User-Identities war, ist Agent 365 für Agent-Identities."}*

---

## Einsatz

*Die wichtigste Sektion der Note. Hier verbindet sich abstraktes Produktwissen mit konkreter Journai-Beratung. Wir fragen nicht „welcher Kundentyp?" (zu starr), sondern „welche Kundensituation macht dieses Produkt relevant?".*

### Job-to-be-done

*{Welches abstrakte Problem löst das Produkt? Schreib es aus der Perspektive eines Kunden, der noch nicht weiß, dass dieses Produkt existiert. Was war sein Schmerz vorher? Was ist jetzt möglich, was vorher nicht ging? 2–4 Sätze, keine Feature-Liste. Prinzip: „When I ____, I want to ____, so I can ____."}*

### Trigger-Signale

*{Was sagt oder erlebt ein Kunde, bei dem dieses Produkt auf den Tisch gehört? Konkrete Zitate/Situationen - das ist der Aha-Moment für den Berater. Beispiel (Agent 365): „Kunde sagt: 'Wir haben jetzt drei Agents in Copilot Studio und keiner weiß mehr, wer welche Berechtigung hat.'"}*

- *{Zitat oder Situation 1}*
- *{Zitat oder Situation 2}*
- *{Zitat oder Situation 3}*

### Einsatz-Szenarien

*{2–3 konkrete Situationen, in denen wir dieses Produkt einsetzen würden. Idealerweise mit Bezug zu einem echten oder potenziellen Journai-Kunden. „Gibt's bei uns aktuell nicht" ist eine legitime Antwort - ehrlicher als gekünstelte Beispiele.}*

1. **{Szenario-Titel}** - *{Ausgangssituation · Ziel · warum dieses Produkt der richtige Hebel ist · ggf. konkreter Kunde (Name nur wenn abgestimmt, sonst generisch)}*
2. **{Szenario-Titel}** - *{...}*
3. **{Szenario-Titel}** - *{...}*

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | *welche MS-Lizenzen müssen vorhanden sein?* |
| **Tenant / Infrastruktur** | *z.B. M365-Tenant, Azure Subscription, spezifische Regionen* |
| **Skills / Rollen** | *welche Personen-Rollen müssen beim Kunden vorhanden sein?* |
| **Compliance-Rahmen** | *DSGVO-Setup, DPA signiert, Data-Residency-Anforderungen* |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | *Tage/Wochen Beratungsaufwand für typischen SMB* |
| **Laufende Lizenzkosten** | *EUR/Monat für typisches SMB-Deployment* |
| **Laufender Betrieb** | *Wartungsaufwand pro Monat* |

### Empfehlung

*{Klarer Standpunkt, keine „sowohl als auch"-Formulierungen. Drei mögliche Signale:}*

- 🟢 **Empfehlen** - *aktiv anbieten, ausgereift, kommerziell attraktiv*
- 🟡 **Beobachten** - *noch nicht reif / unklare EU-Situation / Alternative besser / bessere Timing-Option*
- 🔴 **Meiden** - *deprecated / kommerziell unattraktiv / technisch schwach / Ersatz existiert*

**Status:** {🟢 / 🟡 / 🔴} - *{1–2 Sätze Begründung mit konkreter Logik, nicht Marketing}*

**Nächster Schritt für Journai:** *{Was konkret tun? - z.B. „PoC mit Kunde X bis Q3 aufsetzen" / „beobachten bis EU-Verfügbarkeit geklärt" / „nicht verfolgen, Kunden auf Alternative Y hinweisen" / „Workshop-Angebot entwickeln"}*

---

## Status & Pricing

*Kommerzielle Realität - der Kunde muss es lizenzieren können, sonst spielt der Rest keine Rolle. Hier präzise und mit Datum, weil sich Preise und GA-Datums häufig verschieben.*

| Detail | Wert |
|--------|------|
| **Aktueller Status** | *announced / preview / GA / deprecated - mit Datum* |
| **GA-Datum** | *YYYY-MM-DD oder „TBD" - was davor an Preview/CTP verfügbar* |
| **Standalone-Preis (USD)** | *$ pro User/Monat oder pro Conversation oder Consumption-basiert - mit Datum der Sichtung* |
| **Standalone-Preis (EUR)** | *falls publiziert, sonst „nicht publiziert, erwartet YYYY-MM-DD"* |
| **Lizenz-Bundle** | *Welches Microsoft-Bundle inkludiert das? (E5, E7, Copilot, Frontier)* |
| **Voraussetzung** | *Welche Lizenzen/Services braucht der Kunde vorher?* |
| **Region-Verfügbarkeit** | *Globale Verfügbarkeit vs. nur bestimmte Regionen - EU-Status explizit erwähnen* |
| **CSP-Promo / Discounts** | *Staffeln, zeitlich begrenzte Rabatte, Early-Adopter-Programme* |
| **Hidden Costs** | *was nicht im Standard-Preis enthalten ist - Premium-Features, Nutzungs-Limits, Overage-Pricing* |
| **Upgrade-Pfad** | *wie kommt ein Bestandskunde von Vorgänger/ähnlichem Produkt dorthin? Co-Terming möglich?* |

---

## Kernkonzept

*Die wichtigste Wissens-Sektion für einen Berater. Ziel: Ein Teammitglied, das die Note einmal liest, versteht das Produkt wirklich - nicht nur den Namen und die Features, sondern die Architektur, das Design-Prinzip und wie es sich anfühlt zu nutzen. Diese Sektion darf und soll ausführlich sein. Kein Feature-Limit - so viel, wie nötig zum Verstehen.*

### Was es im Kern ist

*{2–4 Absätze. Die tiefere Architektur: Wo beginnt das Produkt, wo hört es auf? Was ist das zentrale Design-Prinzip? Welche Annahmen trifft Microsoft mit diesem Produkt über die Welt? Was ist die „Seele" des Produkts, die man nicht aus der Feature-Liste ableiten kann?*

*Beispiele für Tiefe:*
*- Copilot Studio: Low-Code-Builder, der Declarative-Agents als erste Bürger behandelt und Skills als YAML-Primitive - das ist eine Wette, dass Business-User Prompts besser beschreiben als Entwickler sie programmieren.*
*- Microsoft Agent Framework: Orchestration-Layer über Model-APIs, der bewusst weder Hosting noch UI kennt. Das zwingt zu Trennung von Agent-Logik und Deployment - konsequent konträr zu LangGraph, das oft beides vermischt.}*

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| {z.B. UI / Presentation} | *{was passiert auf diesem Layer}* | *{dieses Produkt oder anderes}* |
| {z.B. Orchestration} | *{...}* | *{...}* |
| {z.B. Model Runtime} | *{...}* | *{...}* |
| {z.B. Storage} | *{...}* | *{...}* |

### Kern-Fähigkeiten

*{So viele Fähigkeiten wie nötig, damit man das Produkt wirklich versteht - kein hartes Limit. Sortiert nach Relevanz für SMB-Kunden. Pro Fähigkeit 2–4 Sätze:*

*- **Was macht sie konkret** (technische Mechanik, nicht Marketing-Sprech)*
*- **Wie funktioniert sie im Kern** (welches Pattern / welche Architektur)*
*- **Wann ist sie relevant** (welche Kundensituation)*
*- **Wo stößt sie an Grenzen** (1 Satz Capability-Grenze - Brücke zur Limitierungen-Sektion)*

*Wenn eine Fähigkeit komplex ist, gerne mit Sub-Bullets oder kurzer Tabelle erklären.}*

#### {Fähigkeit 1 - Name}

*{Was sie macht · wie sie im Kern funktioniert · wann sie relevant wird · wo sie an Grenzen stößt.}*

#### {Fähigkeit 2 - Name}

*{...}*

#### {Fähigkeit 3 - Name}

*{...}*

*{Weitere Fähigkeiten nach Bedarf - keine künstliche Obergrenze.}*

### Typischer Workflow

*{Wie fühlt sich die Nutzung an? Chronologisch: Konfiguration → Entwicklung → Deployment → Betrieb. Welche Rollen machen was? Welche Tools werden wie benutzt? Das ist der Verstehen-Hebel, den Marketing-Material nie liefert.*

*Beispiel-Struktur:}*

1. **Setup** - *wer macht was mit welchem Tool, wie lange dauert das*
2. **Build / Configure** - *Entwickler-Erfahrung, Debug-Loop, Test-Möglichkeiten*
3. **Deploy** - *wie kommt das Produkt in den Kunden-Tenant, was braucht es an CI/CD*
4. **Operate** - *Monitoring, Update-Pfade, wer schaut auf den Betrieb*

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | *z.B. Python + Azure Grundlagen* |
| **Admin (beim Kunden)** | *z.B. Entra/M365 Admin-Rechte, keine Coding-Skills* |
| **End-User (beim Kunden)** | *z.B. keine, reines Teams-Chat-Interface* |

---

## Limitierungen & Fallstricke

*Was MS nicht auf der Produkt-Seite schreibt. Der Haupt-Wettbewerbsvorteil einer guten Beratung. Hier ehrlich, nicht beschönigend - das ist der einzige Ort, der Vertrauen schafft.*

### Was das Produkt NICHT kann

*{Harte, konzeptionelle Grenzen der Capability. Keine versions-spezifischen Bugs - die veralten. Nur architektonische / strategische Limits. Jeder Punkt mit einer Alternative, damit der Berater eine Antwort hat.}*

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
|             |                          |

### Typische Fallstricke im Einsatz

*{Was übersehen Kunden erfahrungsgemäß? Was führt zu fehlgeschlagenen Projekten? Sehr konkret - „Kunde denkt, Agent 365 ersetze Copilot Studio" / „Entra Agent ID braucht separates RBAC-Konzept, sonst Silent Failures". Konzeptionell statt versions-spezifisch - hier haben kurzlebige Bug-Reports nichts zu suchen.}*

- **{Fallstrick 1}** - *{was passiert · warum Kunden das übersehen · wie man es vermeidet}*
- **{Fallstrick 2}** - *{...}*
- **{Fallstrick 3}** - *{...}*

---

<!-- OPTIONAL [close + standard]: Integrationen - bei watch: passive entfernen -->

## Integrationen

*Welche Verbindungen existieren zu anderen Produkten? Nicht „listet 200 Connector-Namen", sondern die für Beratung relevanten Integrationen und ihre Friction-Points.*

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
|     |       |           |                 |

### Third-Party

*{Welche non-MS-Systeme spielen gut zusammen? (n8n, Zapier, Salesforce, SAP). Welche NICHT?)}*

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
|     |       |           |                 |

### APIs / Protokolle

*{MCP, Graph, REST, GraphQL, OData. Welche offenen Standards werden unterstützt? Welche proprietären Protokolle zwingen in Lock-In?}*

---

<!-- OPTIONAL [close + standard]: Security & Compliance - bei watch: passive entfernen -->

## Security & Compliance

*DSGVO-Realität für DE/EU-Kunden. Diese Sektion wird von Kunden mit Compliance-Verantwortlichen gelesen - präzise formulieren.*

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | *welche Regionen? Können Daten in EU bleiben?* |
| **Prompts & Outputs** | *werden sie gespeichert? Für Training verwendet? Opt-out möglich?* |
| **Data Processing Addendum (DPA)** | *ist es im MS DPA abgedeckt? Separate Anlagen nötig?* |
| **EU-AI-Act-Klassifizierung** | *Limited risk / High risk / Prohibited? Gibt es eine Einordnung?* |

### Microsoft-Compliance-Stack

*{Welche Rolle spielen Purview, Defender, Entra, Conditional Access für dieses Produkt? Was muss der Kunde konfigurieren?}*

### Bekannte Compliance-Lücken

*{Ehrlich: Wo hapert es? (Beispiel: Claude-Integration in Copilot ist in EU/EFTA/UK per Default deaktiviert - muss aktiv eingeschaltet werden.)}*

---

<!-- OPTIONAL [close nur]: Abgrenzung & Wettbewerb - bei watch: standard/passive entfernen -->

## Abgrenzung & Wettbewerb

*Wann dieses Produkt, wann ein anderes? Zwei Perspektiven:*

### Microsoft-intern: Wann dieses Produkt vs. welches andere MS-Produkt?

*{Die häufigste Verwechslungs-Frage. Konkrete Entscheidungs-Kriterien, keine Features.}*

| Frage-Situation | Dieses Produkt | Alternative MS-Produkt |
|-----------------|----------------|------------------------|
| *„Wenn Kunde X will..."* | ✅ wählen wenn {Kriterium} | ⚠️ stattdessen {Alternative} wenn {Kriterium} |

### Externe Alternativen

*{Wer außerhalb des MS-Ökosystems macht dasselbe? n8n, LangGraph, OpenAI Agents, CrewAI, Salesforce Agentforce, AWS Bedrock AgentCore - je nach Produkt. Mit Stärken/Schwächen-Dimensionen.}*

| Dimension | {MS-Produkt} | {Competitor 1} | {Competitor 2} |
|-----------|--------------|----------------|----------------|
| **Fokus** | | | |
| **Pricing** | | | |
| **EU-Data-Residency** | | | |
| **Integrationstiefe in MS** | | | |
| **Multi-Cloud** | | | |
| **Stärke** | | | |
| **Schwäche** | | | |

### Empfehlungs-Regel

*{1 Satz: „Wir nehmen dieses Produkt über Alternative X, wenn der Kunde Y hat. Sonst eher Alternative X." - klare Entscheidungs-Heuristik.}*

---

## Offizielle Referenzen & Monitoring

*Zwei Zwecke in einer Sektion:*
*1. **Quellen-Nachweis** für diese Note (mit Datum der letzten Sichtung).*
*2. **Monitoring-Anker** - wo schaut man regelmäßig hin, um Änderungen zu entdecken?*

*Nach jedem Update der Note: betroffene Zeilen im `Zuletzt gesichtet`-Datum aktualisieren und im `Changelog` festhalten, was sich geändert hat.*

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | *microsoft.com / learn.microsoft.com - Produkt-Übersicht* | | YYYY-MM-DD | *allgemeine Änderungen* |
| **Quickstart / Tutorial** | *learn.microsoft.com - offizieller „Hello World"-Pfad* | | YYYY-MM-DD | *Einstieg bei Demos / PoCs* |
| Docs Hub | *learn.microsoft.com - Developer-Dokumentation* | | YYYY-MM-DD | *API-/SDK-Updates* |
| Release Notes / Changelog | *wenn verfügbar* | | YYYY-MM-DD | *Versionsänderungen* |
| Tech Blog | *techcommunity.microsoft.com · devblogs.microsoft.com* | | YYYY-MM-DD | *neue Features, Roadmap* |
| Roadmap | *microsoft.com/microsoft-365/roadmap · azure.microsoft.com/updates* | | YYYY-MM-DD | *geplante GAs* |
| M365-Admin-Message-Center | *Message Center ID(s)* | | YYYY-MM-DD | *für Kunden relevante Änderungen* |
| Ignite/Build/AI-Tour-Session | *Session-Code + Jahr* | | YYYY-MM-DD | *Strategische Ankündigungen* |
| GitHub Repository | *wenn Open Source / Samples* | | YYYY-MM-DD | *Code-Änderungen, Issues* |
| Pricing Page | *microsoft.com/licensing oder azure.microsoft.com/pricing* | | YYYY-MM-DD | *Preisänderungen* |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Directions on Microsoft | | YYYY-MM-DD | *kritisch-neutrale Analyst-Sicht* |
| SAMexpert | | YYYY-MM-DD | *Licensing-Spezialist* |
| Office Watch / Office-Insider | | YYYY-MM-DD | *Detail-Reporting zu Lizenzierung/Features* |
| Gartner / Forrester (wenn öffentlich) | | YYYY-MM-DD | *Marktposition* |

### Tertiary (Community / MVPs / Blogs)

*{Nur einzelne MVPs / Blogs mit nachweislich guter Signal-Rate. Keine Marketing-LinkedIn-Posts.}*

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
|       |              | YYYY-MM-DD        |                 |

### Events / Konferenzen zum Beobachten

*{Wo werden Ankündigungen zu diesem Produkt erwartet? Nächste Termine.}*

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| *Microsoft Ignite 2026* | *Nov 2026* | *nächste Agent-365-Iteration* |
| *Microsoft Build 2026* | *Mai 2026* | *SDK-Updates* |
| *AI Tour Zürich 2026* | *29.04.2026* | *regionale EU-Details* |

---

## Changelog

*Chronologisches Protokoll aller substanziellen Änderungen an dieser Note. Neueste Einträge oben.*

*Triggers für Changelog-Eintrag (nicht vollständig):*
*- MS ändert GA-Datum, Pricing, Verfügbarkeit*
*- MS kündigt neues Feature / Deprecation an*
*- Eigene Einschätzung (Einsatz, Empfehlung) ändert sich*
*- Neue Erkenntnisse aus PoC / Kunden-Projekt*
*- Neue konzeptionelle Limitierung entdeckt*

*Nicht für: Typo-Fixes, Formatierung, reine Link-Updates ohne inhaltliche Änderung.*

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| *YYYY-MM-DD* | *{Kürzel}* | *{1-Zeiler, was sich geändert hat}* | *{Link oder Referenz unter „Offizielle Referenzen"}* |
| *YYYY-MM-DD* | *{Kürzel}* | *Initial-Erstellung der Note, watch: {close/standard/passive}, Status {Y}* | - |
