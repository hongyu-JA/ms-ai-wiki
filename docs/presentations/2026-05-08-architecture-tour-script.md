# Architektur-Tour — Verbatim-Skript pro Folie

**Termin:** Freitag, 2026-05-08
**Publikum:** Christoph (Founder, Journai)
**Vortragender:** Hongyu Zhou
**Dauer:** ca. 22 Minuten + Q&A
**Slide-Deck:** `2026-05-08-architecture-tour.html` (17 Folien)
**Q&A-Bank:** `../team-updates/2026-05-08-christoph-qa-bank.md`

**So funktioniert die Präsentation:**
- HTML-Datei in Browser öffnen (Chrome / Edge empfohlen, Vollbild = `F`)
- Pfeil rechts = nächste Folie · Pfeil links = zurück
- Taste `S` = Speaker-View (Notes auf zweitem Bildschirm)
- Taste `ESC` = Übersicht aller Folien
- Architektur-Diagramm bleibt **persistent** links — nur Highlight wechselt
- Layer-Namen (SURFACE, AGENT BUILDING, ...) sind **immer sichtbar**

**Designprinzip:** Kein Tool wird genannt, ohne dass es per Beispiel oder Analogie verständlich ist. Wenn ich technische Begriffe verwende, kommt sofort eine einfache Übersetzung.

---

## Folie 1 — Title (15 Sek.)

> [Begrüssung, kein Diagramm sichtbar]

Hoi Christoph, danke dass du dir die Zeit nimmst.

Was du gleich siehst, ist eine geführte Tour durch das Microsoft AI Ökosystem. In ungefähr zwanzig Minuten gehen wir gemeinsam durch alle Tools, die für unsere Beratung wichtig sind, und vor allem durch die Verbindungen zwischen ihnen.

Bevor wir ins Diagramm reingehen, erkläre ich dir kurz, wie ich die Tools sortiert habe. Das ist der Schlüssel, damit das Diagramm danach Sinn macht.

---

## Folie 2 — Die 7 Schichten erklärt (90 Sek.) ⭐ NEU

> [Sieben farbige Streifen mit Beispielen — kein Diagramm]

Bevor wir reinzoomen, kurz die sieben Schichten erklärt.

Stell dir den Microsoft AI Stack vor wie ein Mehrfamilienhaus. Sieben Stockwerke, jedes mit eigener Funktion.

Ganz oben — das Penthouse — ist **SURFACE**. Hier sieht der Mitarbeiter die AI. Konkret: das Chat-Fenster in Outlook, in Word, in Teams.

Eine Etage tiefer ist **AGENT BUILDING**. Hier sitzen die Werkzeuge, mit denen man den Bot baut. Wie ein Architekten-Büro plus die Schreinerei zusammen.

Die **HOSTING**-Etage darunter ist die Infrastruktur — Server, auf denen der fertige Bot läuft. Ohne Strom kein Betrieb.

**KNOWLEDGE** ist die Bibliothek. Aus welchen Quellen zieht der Bot die Antworten? Der SharePoint mit den Verträgen, das CRM mit den Kunden-Daten, das interne Wiki.

**CONTENT PROCESSING** ist eine Spezial-Werkstatt. Hier werden rohe Inhalte vorbereitet — etwa PDFs in strukturierte Tabellen umwandeln, bevor der Bot darauf zugreift.

**GOVERNANCE** ist die Sicherheits-Etage. Wer darf was. Wer schaut zu. Wer alarmiert bei Angriffen. Wie ein Pförtner-System plus Alarmanlage in einem.

Ganz unten — im Keller, wenn man so will — ist **FOUNDATION**. Die Modelle selbst. GPT-4o, Phi-4, Llama. Das eigentliche AI-Gehirn.

Und das ist der wichtigste Punkt zum Mitnehmen: diese Sortierung ist meine. Microsoft selbst sortiert nicht so — Microsoft sortiert nach Marken. Azure-Familie, Foundry-Familie, Copilot-Familie. **Wir sortieren nach Funktion.** Das ist genau, was unsere Beratungs-Sicht ausmacht.

Jetzt zur Karte.

---

## Folie 3 — Das ganze Bild (50 Sek.)

> [Diagramm erscheint, alles farbig, Layer-Namen sichtbar]

Das ist die ganze Karte. **39 Microsoft-Tools, 48 Verbindungen.**

Ich gehe nicht alle gleichzeitig durch — das wäre Überforderung. Ich gehe Schicht für Schicht. Was farbig ist, ist gerade Thema. Was grau ist, kommt entweder noch oder ist gerade nicht relevant.

Wichtig: die Layer-Namen — SURFACE, AGENT BUILDING, HOSTING und so weiter — bleiben **immer sichtbar**. Das ist die Orientierung, damit du nicht verlorengehst.

Die sechs Linien-Typen unten links erklären sich selbst, wenn wir sie unterwegs antreffen.

Wir starten ganz oben.

---

## Folie 4 — SURFACE (50 Sek.)

> [Nur SURFACE-Schicht farbig — M365 Copilot]

Schicht 1: SURFACE. Nur ein Bewohner — **Microsoft 365 Copilot**.

Das ist das Chat-Fenster, das deine Mitarbeiter heute schon kennen — in Outlook, in Teams, in Word. Hier oben sieht der End-User die AI.

Vier Linien gehen von ihm weg. Zwei zu den Bauwerkzeugen unten — Copilot Studio und Microsoft Agent Framework — weil Custom-Bots, die wir bauen, hier oben erscheinen. Zwei zur Bibliothek — Microsoft Graph für M365-Daten, Connectors für externe Systeme wie Salesforce.

**Was du dir merken sollst:** hier oben ist das Endnutzer-Erlebnis — sehr sichtbar. Aber die ganze Architektur-Arbeit, das was unsere Beratung wert ist, liegt darunter. Da gehen wir jetzt rein.

---

## Folie 5 — AGENT BUILDING Aktiv (95 Sek.)

> [AGENT BUILDING farbig — fünf aktive Tools, drei deprecated bleiben grau]

Schicht 2: AGENT BUILDING. Hier baust du den AI-Agent.

Drei Werkzeuge sind die wichtigen — und sie passen zu drei verschiedenen Kunden-Profilen.

**Erstens: Microsoft Agent Framework, kurz MAF.** Das ist der Profi-Werkzeugkasten. Wenn der Kunde ein Dev-Team hat und Multi-Agent-Anforderungen — also wenn mehrere Bots zusammenarbeiten sollen wie ein Team — dann MAF. GA seit April. Du wirst gleich sehen: das ist der Hub, der alles zusammenhält.

**Zweitens: Copilot Studio.** Das ist der Lego-Baukasten. Kein Code nötig. Wenn der Kunde keine Entwickler hat, aber Power-Apps-Erfahrung — dann Studio. Tausende vorgefertigte Bausteine.

**Drittens: M365 Agents SDK.** Spezial-Werkzeug für Bots, die nur in Teams-Chats leben sollen. Wenn der Use-Case Teams-zentrisch ist, ist das der Pfad.

Daneben gibt es zwei Hilfs-Werkzeuge: **Teams SDK** wandert offiziell in M365 Agents SDK rein — also nicht mehr separat lernen. Und **Power Automate** ist wie Klebstoff zwischen Tools — Studio benutzt es, wenn der Bot zum Beispiel eine Email schicken oder ein SAP-System aufrufen soll.

Eine Sache merkst du dir: **Studio kann unter der Haube MAF benutzen.** Das heisst, ein Studio-Bot ist nicht eine Sackgasse — wenn er irgendwann komplexer wird, wandert er ins MAF-Land, ohne neu geschrieben zu werden.

Drei Werkzeuge auf der Karte sind grau ausgegraut. Das sind die abgekündigten — kommt jetzt.

---

## Folie 6 — Migration (75 Sek.)

> [Bot Framework, SK, AutoGen + ihre Migrations-Pfeile farbig]

Drei Werkzeuge, die noch im Markt sind, aber abgekündigt — und das ist für uns Beratungs-Goldgrube.

**Bot Framework** war jahrelang Microsofts Standard für Chatbots. Ende der Unterstützung am **31. Dezember 2025** — das ist hart. Migration: zum M365 Agents SDK. Wichtig: der bestehende Bot-Code läuft weiter, nur das Toolkit wechselt. Halber Tag bis zwei Tage Aufwand pro Bot, je nach Komplexität.

**Semantic Kernel und AutoGen** werden beide in MAF konsolidiert. Semantic Kernel war das Code-First-Framework. AutoGen war das Multi-Agent-Forschungs-Framework. Jetzt eines, MAF.

Eine Warnung: **AutoGen Studio** — das war ein UI-Werkzeug, mit dem man visuell Multi-Agent-Setups bauen konnte — hat keinen 1-zu-1-Ersatz. Da bleibt nur Code-Migration.

Was du im Diagramm siehst: drei farbige Pfeile von den deprecated Knoten zu ihren neuen Zielen. **Das sind die drei Migrations-Pfade**, die wir bei jedem Microsoft-Bestandskunden im Erstgespräch durchgehen.

Strategischer Punkt: andere Boutique-Beratungen wissen das auch — aber bei uns ist die Antwort sofort sichtbar in der Karte. Wir sparen den Kunden die Recherche.

---

## Folie 7 — HOSTING (90 Sek.)

> [HOSTING-Schicht farbig — fünf Optionen]

Schicht 3: HOSTING. Wo läuft dein Agent eigentlich, wenn er fertig ist?

Fünf Optionen — und das ist eine der wichtigsten Architektur-Entscheidungen für Schweizer Kunden.

**Erstens: Foundry Agent Service.** Microsofts vorgefertigtes Hosting für Agents. Aber: aktuell **nur in Nord-USA** verfügbar. Für unsere Schweizer Kunden mit DSGVO heisst das — kann nicht ohne Datenschutz-Folgenabschätzung verwendet werden. Eventuell mit einem Sponsor-Konzept lösbar, aber nicht der Standard-Pfad.

**Zweitens: Azure Functions.** Das ist der **EU-konforme Pfad**. Selbst gehostet in Switzerland North. Scale-to-zero — wenn der Bot nicht läuft, kostet er nichts. Erst bei Anfragen entstehen Kosten. Das ist der Standard für Schweizer Production-Workloads.

**Drittens: Container Apps.** Wenn dein Bot länger als zehn Minuten arbeitet — etwa für eine umfangreiche Recherche — dann reichen Functions nicht, weil die haben Timeouts. Container Apps ist dann der Pfad.

**Viertens: APIM AI Gateway.** Das ist nicht direkt Hosting für Agents, sondern ein **Türsteher davor**. Macht Verbrauchs-Tracking — also wer wie viele Tokens verbraucht hat — plus Rate-Limits, plus Fallback wenn ein Modell ausfällt. Praktisch unverzichtbar für jeden Production-Bot.

**Fünftens: Logic Apps.** Das ist der Low-Code-Pfad. Wenn der Use-Case einfach ist — Beispiel: _'neue Datei kommt in SharePoint an, klassifiziere automatisch und lege sie ab'_ — dann brauchst du keinen Code. Logic Apps mit AI-Connector reicht.

Im Diagramm: drei violette Linien gehen von MAF nach unten zu drei Hosting-Optionen. Das sagt dir: **MAF kann auf drei Arten deployed werden, je nach Anforderung**.

---

## Folie 8 — KNOWLEDGE (95 Sek.)

> [KNOWLEDGE-Schicht farbig — acht Quellen]

Schicht 4: KNOWLEDGE. Aus welchen Quellen zieht der Agent seine Antworten?

Acht Quellen — die grösste Auswahl in der Karte. Drei sind in der Praxis am wichtigsten.

**Erstens: Azure AI Search.** Der Goldstandard für Text-Inhalte. Lass mich kurz erklären, wie das funktioniert, weil das ist ein wichtiges Konzept für Kunden-Gespräche.

Stell dir vor: jeder Text wird in einen **'Bedeutungs-Fingerabdruck'** umgewandelt — eine Art Zahlen-Reihe, die die Bedeutung des Textes repräsentiert. Bei der Suche vergleicht das System diese Fingerabdrücke statt der Wörter selbst. Konkretes Beispiel: ein User fragt _'wie kündige ich?'_ — die klassische Stichwortsuche findet vielleicht nichts, weil im Vertrag steht _'Vertragsauflösung'_. Die Bedeutungs-Suche hingegen findet beides, weil _'kündigen'_ und _'Vertragsauflösung'_ ähnliche Fingerabdrücke haben. Plus Document-Level-Security — heisst, der Mitarbeiter sieht nur, was er sehen darf.

**Zweitens: Microsoft Graph.** Der eingebaute Pfad zu allen M365-Daten. Mails, Teams-Chats, SharePoint-Dokumente, OneDrive-Files. Kein Connector nötig, kein Setup. Built-in.

**Drittens: Copilot Connectors.** Über hundert vorgefertigte Brücken zu externen Systemen — ServiceNow, Jira, Confluence, Salesforce. Berechtigungen werden respektiert.

Plus fünf Spezialisten:
- **Foundry IQ** ist _'AI Search für Faule'_ — vorgefertigt, weniger Konfiguration
- **Dataverse** plus **Dataverse MCP** für strukturierte Power-Platform-Daten
- **Fabric Data Agents** für Big-Data — der Bot kann eigenständig SQL-Anfragen stellen
- **Cosmos DB for AI** als Vector-Speicher für Agent-Erinnerung — also damit der Bot Gespräche behält

Im Diagramm: grüne Linien sind `grounds-on` — das heisst Knowledge-Anbindung. Du siehst — MAF groundet auf Search, IQ und Cosmos. Studio auf Graph, Connectors und Dataverse. **Jedes Bauwerkzeug hat seine bevorzugten Quellen.**

---

## Folie 9 — CONTENT PROCESSING (60 Sek.)

> [CONTENT-Schicht farbig — zwei Tools]

Schicht 5: CONTENT PROCESSING. Eine kleine, aber sehr nützliche Schicht — zwei Werkzeuge.

**Erstens: Document Intelligence.** Das ist nicht ein Sprach-Modell, sondern ein Spezial-Werkzeug für strukturierte Extraktion aus Dokumenten. Tabellen aus PDFs, Felder aus Formularen, Klauseln aus Verträgen. Das Wichtige: man kann **eigene Modelle trainieren**. Für Schweizer Kunden besonders relevant — etwa für Lohnausweise mit unserem Layout, oder für QR-Rechnungen mit dem Schweizer Zahlungs-Format.

**Zweitens: Content Understanding.** Das ist Document Intelligence plus Multi-Modal — also auch Audio, Video, Bilder. Beispiel: Kunde hat 1000 aufgezeichnete Sales-Calls in MP3 und will sie durchsuchbar machen. Content Understanding extrahiert Sprecher, Themen, wichtige Stellen.

Wo passt das in den Architektur-Fluss? Diese Schicht sitzt **vor** der Knowledge-Schicht. Stell dir den Use-Case vor: Kunde hat zehntausend Verträge in PDF. Workflow: PDF kommt rein, Document Intelligence extrahiert Tabellen und Felder strukturiert, das Ergebnis geht in Azure AI Search, dann groundet der Agent auf Search.

Praxis-Hinweis für die Beratung: viele Kunden überschätzen, was ein LLM aus einem PDF rausholen kann. Die Antwort ist fast immer: **kombiniere Document Intelligence + AI Search + LLM**. Drei Schritte, drei Werkzeuge, jedes in seiner Spezialität.

---

## Folie 10 — GOVERNANCE (110 Sek.)

> [GOVERNANCE-Schicht farbig — sechs Tools, längster Block]

Schicht 6: GOVERNANCE und IDENTITY. Sechs Werkzeuge — und das ist die Schicht, die in Beratungs-Gesprächen gerne unterschätzt wird.

Lass mich zwei Geschichten erzählen, weil hier die strategische Botschaft liegt.

### Geschichte eins: Identity

Bisher hatten in Microsoft-Systemen nur Menschen eine Identität. **Entra Agent ID** ändert das fundamental — jetzt hat jeder Bot eine eigene Identität. Stell dir das vor wie einen **digitalen Personalausweis für den Bot**. Damit kann ich Zugangs-Regeln auf den Bot anwenden. Beispiele: _'dieser Bot darf nur aus dem Schweizer Netzwerk kommen'_, oder _'dieser Bot darf nur mit einem Mitarbeiter reden, der sich mit Multi-Faktor authentifiziert hat'_.

Daneben **Agent 365** — das ist sozusagen das **HR-System für Bots**. Alle Bots auf einer Tafel: wer hat welche Rechte, wer hat was wann gemacht, wer ist der menschliche Verantwortliche.

**Microsoft Entra Suite** ist der Umbrella, in dem alles Identity-Bezogene lebt. Conditional Access, Identity Protection — alles, was für menschliche User gilt, gilt jetzt auch für Bot-Identitäten.

### Geschichte zwei: Daten-Sicherheit

**Microsoft Purview** ist der Hub. Stell dir Purview vor wie einen **Daten-Wächter**, der jeden Bot-Zugriff auf eure Daten beobachtet. Wenn ein Bot versucht, eine sensible Datei an einen externen Endpoint zu senden, schlägt Purview Alarm und blockiert. Sensitivity Labels werden respektiert, Audit-Logs werden protokolliert.

Daneben **Defender for AI** — das ist sozusagen ein **Antivirus für AI**. Erkennt sogenannte Prompt-Injection-Versuche — wenn jemand versucht, den Bot mit manipulativen Eingaben zu hacken — und Anomalien im Traffic.

Und **Azure AI Content Safety** ist der **Filter** auf das, was der Bot ausgibt. Hate, Sexual, Violence, Self-Harm — werden gefiltert. Plus auch Prompt-Injection-Detection auf Inputs.

### Beratungs-Punkt

Wenn ein Kunde fragt _'was muss ich für Compliance bauen?'_, dann ist die ehrliche Antwort **nicht ein Tool**. Es sind **sechs Bausteine**. Das sind echte Implementierungs-Kosten, die wir im Angebot transparent machen müssen — sonst gibt es Überraschungen im Projekt.

---

## Folie 11 — FOUNDATION (90 Sek.)

> [FOUNDATION-Schicht farbig — sieben Knoten]

Schicht 7: FOUNDATION. Die unterste Schicht — hier kommen die eigentlichen Tokens her, hier liegen die Modelle.

Sieben Knoten in zwei Gruppen.

### Gruppe eins: die Foundry-Plattform

**Microsoft Foundry** ist der Container-Begriff — die Multi-Tenant-Plattform, in der alles AI-Bezogene lebt. **Foundry Models** sind die eigentlichen Sprach-Modelle — GPT-4o, Phi-4, Llama, Mistral, neuerdings auch Anthropic Claude.

Wichtige Compliance-Information: in EU und EFTA ist **Anthropic-Integration default-OFF**, seit dem 17. April. Vor Aktivierung muss die Datenschutz-Folgenabschätzung aktualisiert werden — das ist ein Punkt, den wir in jedem Schweizer Kunden-Projekt abfragen müssen.

Daneben **Foundry Control Plane** — die Management-Schicht. **Foundry SDKs** — Bibliotheken, mit denen man Modelle aus dem eigenen Code aufruft. **Foundry Local** — der Edge-Pfad, wo Modelle direkt auf dem Laptop oder Server des Kunden laufen. Kein Cloud-Roundtrip. Sehr relevant für Kunden mit Daten-Lokalitäts-Anforderungen.

### Gruppe zwei: Protokoll-Standards

**Model Context Protocol**, kurz **MCP**. Erkläre ich kurz mit einer Analogie:

> Stell dir vor, jedes AI-Werkzeug hat seinen eigenen Stecker. Bot von Microsoft, Bot von Anthropic, Bot von Google — jeder mit eigenem Anschluss. Das ist Chaos. **MCP ist wie USB-C für AI** — ein einheitlicher Stecker, in den alle passen.

Anthropic hat MCP erfunden, Microsoft hat es adoptiert. Praktischer Vorteil: ein Tool einmal als MCP-Server bauen, dann kann es jeder MCP-fähige Bot nutzen. **Das reduziert Vendor-Lock-in.**

Im Diagramm siehst du eine cyan-gepunktete Linie von Foundry Agent Service zu MCP — das ist der Pfad, der Microsofts Stack auch in Multi-Vendor-Umgebungen brauchbar macht.

Daneben **Azure OpenAI Responses API** — die neuere API, die Gespräche-mit-Erinnerung auf Server-Seite verwaltet, sodass der Bot-Code das nicht selber tracken muss.

Jetzt hast du alle sieben Schichten gesehen. Was kommt als nächstes — drei **Cross-Layer-Geschichten**. Wie diese Schichten in der Praxis zusammenspielen.

---

## Folie 12 — Cross 1: MAF als Hub (90 Sek.)

> [MAF + alle 19 Verbindungen farbig — Rest grau]

Cross-Layer-Geschichte Eins: **Microsoft Agent Framework als zentraler Knoten**.

Schau dir das Diagramm an. Was du jetzt siehst, ist MAF im Mittelpunkt mit allen seinen Verbindungen — der Rest ist grau.

Zähl die Linien: **dreizehn ausgehende Verbindungen, sechs eingehende**. Das sind **neunzehn von achtundvierzig Edges** in der ganzen Karte — vierzig Prozent aller Verbindungen berühren MAF. Kein anderer Knoten kommt da auch nur in die Nähe.

Was bedeutet das strategisch? MAF ist nicht nur ein Werkzeug unter vielen — MAF ist der **Hub** des modernen Microsoft-Agent-Stacks. Wenn ein Kunde MAF lernt, kann er damit auf drei Hosting-Optionen deployen, vier verschiedene Knowledge-Quellen anbinden, vier Compliance-Bausteine integrieren — **ohne weitere Frameworks zu lernen**.

Lass mich den Pfad in einem Sekunden-Tour durchgehen:
- **Nach unten zu Foundry Models und der Responses API:** Modell-Aufruf-Pfad
- **Nach unten zu Search, IQ, Cosmos:** Knowledge-Anbindungen
- **Quer zu Document Intelligence und Content Understanding:** Vor-Verarbeitung
- **Nach oben zu Hosting:** drei Optionen je nach Anforderung
- **Quer zu Governance:** Identity, Daten-Schutz, Bedrohungs-Erkennung, Output-Filter
- **Cyan-gepunktet zu Dataverse MCP:** Pfad zu strukturierten Daten

Das ist **die gesamte Architektur einer modernen Bot-Lösung** — von Modell über Knowledge bis Compliance — und sie sitzt in einem einzigen Framework.

Beratungs-Punkt: wenn wir einen Kunden auf die Microsoft-AI-Reise schicken, ist die einzige Investition mit hohem Hebel: **das Team lernt MAF zuerst**. Alles andere baut darauf auf.

---

## Folie 13 — Cross 2: Compliance-Stack (75 Sek.)

> [Alle secured-by Edges farbig + Governance + Frameworks]

Cross-Layer-Geschichte Zwei: **das rote Geflecht**.

Was du im Diagramm siehst — alle gestrichelten roten Linien sind `secured-by`-Edges. Das ist die Compliance-Schicht, die quer durch die Architektur geht.

Schau dir die Frameworks oben an: MAF, Copilot Studio, M365 Agents SDK. Sie sind alle drei mit der Governance-Schicht unten verbunden. Die roten Linien führen zu vier wichtigen Zielen:

- **Erstens: Entra Agent ID. Identity.** Jeder Bot hat seine eigene Identität, gegen die wir Zugangs-Regeln fahren können.
- **Zweitens: Microsoft Purview. Daten-Schutz.** Wenn ein Bot versucht, eine sensible Datei an einen externen Endpoint zu senden, schlägt Purview Alarm.
- **Drittens: Defender for AI. Bedrohungs-Erkennung.** Prompt-Injection-Versuche, Jailbreak-Versuche, Anomalien.
- **Viertens: Azure AI Content Safety. Output und Input Filter.** Erkennt schädliche Inhalte in beiden Richtungen.

Ein wichtiger Beratungs-Punkt — für Schweizer Production-Workloads sind **alle vier Bausteine de-facto Pflicht**. Nicht weil das Gesetz es buchstäblich verlangt, sondern weil ohne diese vier Bausteine kein vernünftiges Sicherheits-Audit besteht. **DSGVO, FINMA-Anforderungen, ISO-Audits** — die fragen alle nach genau diesem Stack.

Wenn ein Kunde sagt _'lass uns die Compliance-Bausteine später bauen'_ — das ist eine klassische Falle. Diese Bausteine sind nicht später, sie sind Teil von Phase eins. **Die Karte macht das visuell offensichtlich.**

---

## Folie 14 — Cross 3: Build-Pfad 1 (Code-First MAF) (80 Sek.)

> [5 Knoten + 4 Edges grün hervorgehoben — der Standard-Pfad]

Cross-Layer-Geschichte Drei: **drei konkrete Pfade** — wie Lösungen tatsächlich quer durch die Schichten laufen. Ich zeige dir die drei häufigsten Konstellationen aus unserer Beratung.

**Pfad 1: Code-First mit MAF.** Der Standard-Pfad für anspruchsvolle Schweizer Kunden mit Dev-Team. Use-Case: Mittelständischer Kunde, Mitarbeiter fragt im Copilot Fragen zu internen Verträgen.

- **Schritt 1**, ganz oben: User chattet im **M365 Copilot**. Schicht Surface.
- **Schritt 2:** Copilot ruft den Custom-Engine-Agent auf, der mit **MAF** gebaut wurde. Eine `uses`-Verbindung von Surface zu Agent Building.
- **Schritt 3:** MAF läuft auf **Azure Functions**. Eine `hosted-on`-Verbindung. **EU-konform in Switzerland North**, scale-to-zero.
- **Schritt 4:** Wenn der Bot eine Wissens-Frage kriegt, holt er die Antwort aus **Azure AI Search**. Eine `grounds-on`-Verbindung zu Knowledge.
- **Schritt 5:** Search selbst braucht die Bedeutungs-Fingerabdrücke — die kommen von **Foundry Models**. Eine `calls`-Verbindung von Knowledge nach Foundation.

Fünf Schritte, vier Schichten überquert, ein durchgehender Pfad. Was hier nicht hervorgehoben ist, aber implizit dabei: jeder dieser Knoten ist abgesichert über die Compliance-Schicht.

**Setup-Aufwand:** typisch zwei bis vier Wochen für POC, weitere zwei bis vier Wochen für Production-Hardening.

Das ist nur eine von drei sinnvollen Konstellationen. Lass mich dir zwei weitere zeigen.

---

## Folie 15 — Cross 3: Build-Pfad 2 (Low-Code) (95 Sek.)

> [5 andere Knoten + 4 Edges grün hervorgehoben — Low-Code-Pfad]

**Pfad 2: Low-Code mit Copilot Studio.** Das ist der Pfad für Kunden ohne Dev-Team — denk an typische Mittelstands-Sales-Teams oder HR-Abteilungen, die Power-Apps-Erfahrung haben aber keinen Code schreiben können.

**Use-Case-Beispiel:** Sales-Team will einen Bot, der Fragen wie _'wer ist mein nächster Termin?'_ oder _'was war der letzte Kontakt mit Kunde X?'_ beantwortet.

- **Schritt 1:** User fragt im **M365 Copilot**. Gleiche Surface wie bei Pfad 1.
- **Schritt 2:** Copilot ruft den Studio-Agent auf. `uses`-Verbindung. Aber jetzt nicht zu MAF — sondern zu **Copilot Studio**.
- **Schritt 3:** Studio ruft einen **Power Automate**-Flow auf, um zum Beispiel CRM-Daten aus Salesforce oder Dynamics zu holen. `calls`-Verbindung. Das ist der Trick — Studio kann tausende fertige Connectoren über Power Automate nutzen.
- **Schritt 4:** Studio greift auf **Microsoft Graph** zu, um Mitarbeiter-Daten und Outlook-Termine zu holen. `grounds-on`-Verbindung.
- **Schritt 5:** Studio ruft **Foundry Models** für die Antwort-Generierung. `calls`.

Schau auf das Diagramm: **kein einziger Knoten in der Hosting-Schicht** ist hervorgehoben. Das ist der grosse Unterschied — Studio ist managed, Microsoft kümmert sich um die Infrastruktur. Kein Functions-Setup, keine Container Apps, kein APIM. Wir empfehlen das nur für Kunden, die nicht in regulierten Branchen sind, weil Studio-Hosting standardmässig Microsoft-managed ist.

**Setup-Aufwand:** ein bis drei Tage POC. Production-tauglich nach einer Woche, wenn der Use-Case klar ist.

**Limits:** keine Multi-Agent-Orchestrierung, kein Custom-Tool ausserhalb Power-Automate-Ökosystem. Wenn der Kunde später wachsen will, muss er auf MAF migrieren — wie schon erwähnt, Studio kann unter der Haube zu MAF wandern, ohne Re-Write.

**Beratungs-Punkt:** für mittelständische Schweizer Kunden ohne Dev-Team ist das oft der Einstiegs-Pfad. Wir zeigen ihnen schnellen Wert, dann gehen wir später in komplexere MAF-Architektur.

---

## Folie 16 — Cross 3: Build-Pfad 3 (Document Processing) (95 Sek.)

> [5 Knoten inkl. Document Intelligence + 4 Edges grün hervorgehoben]

**Pfad 3: Dokumenten-Verarbeitung.** Das ist der Pfad für Kunden, deren Daten primär in PDFs stecken — Anwaltskanzleien, Versicherungen, Treuhänder, Banken-Backoffice. Sehr typisch für die Schweiz.

**Use-Case-Beispiel:** Anwaltskanzlei mit zehntausend Verträgen in PDF. Mitarbeiter sollen Klauseln durchsuchen — _'finde alle Verträge mit nicht-Standard-Konkurrenz-Klausel'_. Sollten Vergleiche zwischen Verträgen ziehen können.

Hier sieht man, **warum Content Processing eine eigene Schicht ist**. Schau auf die Karte — die fünfte Schicht von oben, türkis, ist hervorgehoben.

- **Schritt 1 und 2:** gleich wie Pfad 1. User in Copilot, MAF-Agent.
- **Schritt 3 (entscheidend):** MAF ruft **Document Intelligence** auf. Document Intelligence ist nicht ein Sprach-Modell — es ist ein Spezial-Werkzeug, das aus PDFs strukturierte Daten extrahiert. Tabellen, Felder, Klauseln. Und das ist wichtig: **man kann eigene Modelle trainieren**. Für unsere Anwaltskanzlei können wir ein Custom-Model für deren spezifisches Vertrags-Layout trainieren.
- **Schritt 4:** das extrahierte Material — also die strukturierten Klauseln, nicht der Roh-PDF — wird in **Azure AI Search** indexiert. MAF groundet auf Search.
- **Schritt 5:** Search nutzt **Foundry Models** für die Bedeutungs-Fingerabdrücke. Wie in Pfad 1.

**Wichtigste Erkenntnis hier:** das ist ein Drei-Schritt-Pattern. **Extract** — mit Document Intelligence. **Index** — in AI Search. **Generate** — durch das Sprach-Modell. Viele Kunden glauben, dass ein LLM allein PDFs lesen kann. Die Antwort ist: technisch ja, qualitativ nein. Mit dieser Drei-Schritt-Architektur kommt man auf qualitativ deutlich bessere Resultate.

**Setup-Aufwand:** drei Tage POC mit Standard-Document-Intelligence-Modell. Custom-Model-Training für Schweizer Vertrags-Layouts: weitere zwei Wochen plus Sample-Annotationen vom Kunden.

**Beratungs-Punkt:** das ist auch unser Pitch an Kunden mit komplexen Schweizer Dokumenten — Lohnausweise, QR-Rechnungen, Versicherungs-Policen. Wir zeigen ihnen, dass Microsoft hier ein Werkzeug hat, das sie spezifisch für ihre Dokumenten-Welt anpassen können.

Das waren die drei Pfade. Jetzt zur Zusammenfassung.

---

## Folie 17 — Zusammenfassung (40 Sek.)

> [Diagramm versteckt, zentrierter Schluss]

Zusammengefasst: was du heute gesehen hast, ist Microsofts AI-Stack neu geordnet — **nicht nach Marken-Familien, sondern nach unserer Beratungs-Logik.**

- **7 Schichten** — Surface, Building, Hosting, Knowledge, Content, Governance, Foundation
- **39 Tools** — kuratiert nach Beratungs-Logik
- **48 Verbindungen** — sechs typisierte Beziehungen, jede mit Bedeutung
- **1 zentraler Hub** — MAF, mit 40% aller Verbindungen
- **4 Compliance-Bausteine** — Identity, Daten, Threats, Outputs

Diese Karte ist kein abstraktes Übersichts-Diagramm. Es ist ein **Beratungs-Werkzeug** — gemacht, um in Kunden-Erstgesprächen die Architektur-Entscheidungen sichtbar zu machen, die wir in zehn Minuten erklären können müssen.

**Fragen?**

---

## Time-Budget Übersicht

| Folie | Inhalt | Sek. |
|-------|--------|------|
| 1 | Title | 15 |
| 2 | Layer-Klassifikation | 90 |
| 3 | Big Picture | 50 |
| 4 | Surface | 50 |
| 5 | Agent Building Aktiv | 95 |
| 6 | Migration | 75 |
| 7 | Hosting | 90 |
| 8 | Knowledge | 95 |
| 9 | Content Processing | 60 |
| 10 | Governance | 110 |
| 11 | Foundation | 90 |
| 12 | MAF Hub | 90 |
| 13 | Compliance Stack | 75 |
| 14 | **Build-Pfad 1 — Code-First** | 80 |
| 15 | **Build-Pfad 2 — Low-Code (NEU)** | 95 |
| 16 | **Build-Pfad 3 — Doc Processing (NEU)** | 95 |
| 17 | Zusammenfassung | 40 |
| **Σ** | | **1295s ≈ 21,6 Min.** |

Plus Q&A → ca. 30-32 Min. Gesamt-Termin.

**Drei-Pfade-Logik für Christoph:** die Build-Pfad-Trilogie zeigt unsere Beratungs-Bandbreite. Pfad 1 = High-End-Kunden mit Dev-Team. Pfad 2 = Mittelstand ohne Dev-Ressourcen. Pfad 3 = Dokumenten-zentrische Branchen (Recht, Versicherung, Treuhand). Drei Pfade decken ~80% unserer realistischen Kunden-Konstellationen ab.

---

## Sprach-Vereinfachungen — Glossar

Wenn ich technische Begriffe verwende, kommt sofort eine einfache Übersetzung. Übersicht der Konzepte und ihrer Erklärungen:

| Technik-Begriff | Einfache Erklärung / Analogie |
|-----------------|-------------------------------|
| Vector-Suche | "Bedeutungs-Fingerabdruck-Suche" — findet ähnliche Texte, auch wenn andere Wörter |
| Embeddings | Zahlen-Reihe, die Text-Bedeutung codiert |
| Stateful Conversation | "Gespräch mit Erinnerung" — Bot vergisst nicht, was gesagt wurde |
| Entra Agent ID | "Digitaler Personalausweis" für jeden Bot |
| Agent 365 | "HR-System für Bots" |
| Conditional Access | "Zugangs-Regeln" — z.B. nur aus CH-Netzwerk, nur mit MFA |
| DLP | "Daten-Schleuse" — verhindert Daten-Exfiltration |
| Audit-Logs | "Protokoll" — wer wann was angefragt |
| Purview | "Daten-Wächter" |
| Defender for AI | "Antivirus für AI" |
| Content Safety | "Filter für problematische Antworten" |
| MCP | "USB-C für AI" — einheitlicher Stecker für Tools |
| Multi-Agent Orchestrierung | "Mehrere Bots als Team" |
| Hybrid Search | Suche kombiniert Stichwort + Bedeutung |
| Scale-to-zero | "Wenn Bot nicht läuft, kostet nichts" |

---

## Demo-Vorbereitung am Tag selbst

- [ ] HTML-Datei in Browser öffnen, Vollbild aktivieren (`F` in Reveal.js)
- [ ] Zweiten Bildschirm bereitstellen, Speaker-View aktivieren (`S`)
- [ ] Bildschirm-Auflösung 1400px+ Breite (sonst Diagramm zu eng)
- [ ] Dieses Skript-PDF als Backup ausgedruckt zur Hand
- [ ] Q&A-Bank durchgelesen (`../team-updates/2026-05-08-christoph-qa-bank.md`)
- [ ] Notifications stumm
- [ ] Wasserglas neben Laptop
- [ ] Backup: PDF-Export der HTML-Folien

**Übungs-Routine am Donnerstag-Abend:**
- 30 Min: alle 15 Folien einmal vollständig durchsprechen mit Stoppuhr
- 30 Min: Q&A-Bank ⭐-Fragen laut beantworten
- 15 Min: 🔴-Fragen verkürzen, weniger Worte
- 10 Min: 5 zufällige Fragen als Reaktions-Probe

Total: 1h 25min. Vor dem Schlafen-Gehen, nicht direkt vor der Demo.
