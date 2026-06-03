# Demo-Skript: AI Wiki & Architecture Map

**Termin:** Freitag, 2026-05-08
**Publikum:** Christoph (Founder, Journai)
**Vortragende:** Hongyu Zhou
**Dauer:** 30 Minuten + Q&A
**Format:** Live-Demo am Bildschirm, dieses Skript als Verbatim-Stütze

---

## Time-Boxing

| Zeit | Block | Inhalt |
|------|-------|--------|
| 00:00 – 03:00 | 1. Begrüssung & Kontext | Warum dieses Projekt, was ist der Stand |
| 03:00 – 08:00 | 2. Web-Katalog | 39 Tools im Browser, Filter, Search, Detail |
| 08:00 – 11:00 | 3. Architecture Map – Layer | 7-Schichten-Modell, warum diese Struktur |
| 11:00 – 13:00 | 4. Edge-Typen | 6 Beziehungstypen, Farben, Linien-Logik |
| 13:00 – 17:00 | 5. Hover-Demo MAF | Microsoft Agent Framework als Hub |
| 17:00 – 20:00 | 6. Filter & Deprecation | Migrations-Storyline live |
| 20:00 – 22:00 | 7. Klick → Produkt-Detail | Navigation in Catalog |
| 22:00 – 25:00 | 8. Pflege-Pipeline | Wie das System sich selbst aktualisiert |
| 25:00 – 29:00 | 9. Roadmap & Asks | Voice Agent Emma, MS Build, Sub-Projekt D |
| 29:00 – 30:00 | 10. Schluss / Übergang Q&A | |

---

## Block 1 — Begrüssung & Kontext (00:00 – 03:00)

> [Bildschirm: Browser geschlossen oder Startseite Localhost / Cloudflare]

Hoi Christoph, danke dass du dir die halbe Stunde nimmst.

Was du gleich siehst, ist mehr als ein Wiki — es ist ein Versuch, das Microsoft AI Ökosystem, das sich gerade alle drei Monate neu sortiert, für uns als Beratungsteam **navigierbar** zu machen.

Kurzer Kontext, warum das Sinn macht: Wenn ein Kunde uns fragt _"Wie baue ich einen AI-Agent auf unserer SharePoint-Wissensbasis?"_, dann gibt es nicht **eine** Antwort — es gibt heute mindestens vier valide Pfade in Microsofts Stack. Copilot Studio Low-Code, M365 Agents SDK, Microsoft Agent Framework Code-First, oder Foundry Agent Service Managed. Jeder dieser Pfade hat unterschiedliche Hosting-Optionen, unterschiedliche Knowledge-Sources, unterschiedliche Governance-Modelle. Und Microsoft launcht jeden Monat etwas Neues, wo eigentlich was Bestehendes deprecated wird.

Was ich gebaut habe, ist ein **Zwei-Schichten-Werkzeug**:

- **Schicht 1: Der Katalog.** Eine durchsuchbare Liste aller relevanten Microsoft-AI-Produkte mit Tags, Reife-Stufe und Verwendungs-Empfehlung.
- **Schicht 2: Die Architecture Map.** Eine interaktive Visualisierung, die zeigt _wie diese Tools miteinander reden_ — der Kern-Mehrwert, weil das ist, was in Microsofts eigener Doku am schwersten zu finden ist.

Die Pipeline dahinter: ich pflege Notizen lokal in Obsidian, daraus generiere ich täglich automatisch Markdown-Files, die in SharePoint und auf die Website gehen. Werde ich am Schluss zeigen.

Ich starte mit dem Katalog, weil er die einfachere Schicht ist, und gehe dann zur Map, die der eigentliche Hingucker ist.

> [Wechsel zum Browser, öffne Localhost oder Production-URL]

---

## Block 2 — Web-Katalog-Tour (03:00 – 08:00)

> [Auf Startseite — Grid-Ansicht mit Karten]

Was du hier siehst, ist die Grid-Ansicht. **39 Microsoft-AI-Produkte** — von der Modell-Schicht ganz unten bis zu Microsoft 365 Copilot als User-Touchpoint ganz oben.

Jede Karte zeigt das Wesentliche auf einen Blick: Name, eine Tagline, die offizielle Microsoft Reife-Stufe — also GA, Public Preview, Private Preview oder Deprecated — und ein paar Tags zur Kategorisierung. Die Schicht-Bezeichnung in Farbe oben rechts.

> [Scroll runter, dann zurück nach oben]

Insgesamt sind das im Moment **39 aktive Produkte**, plus 3 deprecated Frameworks — Bot Framework, Semantic Kernel und AutoGen — die wir bewusst drinhalten, weil viele unserer potenziellen Kunden noch existierenden Code in diesen Frameworks haben und wir die Migrations-Beratung anbieten wollen.

> [Klick auf den Search-Bar oben]

Suche funktioniert über alle Felder — Name, Beschreibung, Tags. Ich tippe mal _"vector"_ —

> [Tippe "vector"]

Da kommen die zwei relevanten Knowledge-Stores: Azure AI Search und Cosmos DB for AI. Beides Vector Stores, aber eben mit unterschiedlichen Stärken — Search ist hybrid, Cosmos ist transaktional.

> [Lösche Suche, klick auf Filter — Layer]

Die Filter daneben sind das, was wir typischerweise im Beratungs-Gespräch brauchen. Filter nach **Schicht** — also "zeig mir alle Knowledge-Tools" — oder nach **Reife-Stufe** — "zeig mir nur was GA ist, ich will keine Preview-Risiken im Kunden-Projekt".

> [Klick "Knowledge"-Filter, dann "GA"-Filter]

Das ist genau die Frage, die wir in jedem Architektur-Review beantworten. _"Welche Bausteine sind production-safe?"_

> [Filter zurücksetzen, Klick auf Tab "Tabelle"]

Dieselbe Information als Tabelle, falls man Spalten vergleichen will. Sortierbar nach allen Feldern. Vor allem für Excel-affine Stakeholder.

> [Klick auf eine Karte — z.B. Microsoft Agent Framework]

Wenn man auf ein Produkt klickt, kommt die Detail-Seite. Hier ist die ausführliche Beschreibung, die Use-Cases, Verlinkungen zur offiziellen Microsoft-Doku, und unsere internen Notizen — wann setzen wir das ein, wann nicht.

Das ist die ruhigere Hälfte. Jetzt kommt der eigentliche Hingucker, weil hier wird sichtbar, was sonst implizit bleibt.

> [Klick auf Tab "Architecture" oben]

---

## Block 3 — Architecture Map: Layer-Konzept (08:00 – 11:00)

> [Architecture-Seite ist nun offen. Pause, lass das Bild wirken]

OK. Was du hier siehst, ist die Architecture Map. **39 Knoten**, **48 typisierte Verbindungen**, organisiert in **7 horizontalen Schichten**. Von oben nach unten:

> [Zeig mit Maus auf jede Schicht während du sie nennst]

- **SURFACE** — der User-Touchpoint. Hier oben sitzt nur Microsoft 365 Copilot, weil das **die** Stelle ist, wo der Endnutzer mit AI in Berührung kommt.
- **AGENT BUILDING** — die Logik-Schicht. Hier baust du die Agents. Microsoft Agent Framework, Copilot Studio, M365 Agents SDK, plus die deprecated Frameworks Bot Framework, Semantic Kernel und AutoGen.
- **HOSTING** — wo deine Agents laufen. Foundry Agent Service Managed, Azure Functions Self-Hosted, Container Apps, plus APIM als Gateway.
- **KNOWLEDGE** — Grounding-Datenquellen. Azure AI Search, Microsoft Graph, Copilot Connectors, Dataverse, Fabric Data Agents, Cosmos DB for AI.
- **CONTENT PROCESSING** — spezialisierte AI-Services. Document Intelligence für strukturierte Extraktion, Content Understanding für Audio und Video.
- **GOVERNANCE & IDENTITY** — die Trust-Schicht. Entra Agent ID, Agent 365, die Purview Suite, Defender for AI, Content Safety. Hier ist alles Sicherheits- und Compliance-relevante.
- **FOUNDATION** — die Modell- und Plattform-Infrastruktur. Microsoft Foundry als Container, Foundry Models, das Model Context Protocol als offener Standard.

Warum genau diese Schichten? Weil das **die fundamentalen Entscheidungen** sind, die wir mit jedem Kunden durchgehen. _Wo soll das laufen?_ ist eine andere Frage als _Womit baue ich es?_ ist eine andere Frage als _Was groundet es?_. Wenn man die nicht trennt, wird das Architektur-Gespräch ein Knäuel.

Diese Trennung ist meine — Microsoft selbst macht sie nicht so. Microsoft präsentiert die Tools nach Marken-Familien (Azure-X, Foundry-X, Copilot-X), nicht nach **Funktion**. Was wir hier sehen, ist eine **funktionale Re-Organisation**, die für unser Beratungs-Gespräch gebaut ist.

> [Pause, lass das einsinken]

---

## Block 4 — Edge-Typen (11:00 – 13:00)

> [Maus zur Legende oben rechts, falls vorhanden — sonst zeig auf eine Edge]

Die Linien zwischen den Knoten sind nicht einfach _"hängt zusammen"_, sondern **typisiert**. Es gibt **sechs** Beziehungstypen, jeder mit eigener Farbe und Linien-Charakter:

> [Zeig nacheinander auf entsprechende Linien im Graph]

- **`uses`** — dunkelblau, durchgezogen. Logische Abhängigkeit. Beispiel: Copilot Studio _uses_ Microsoft Agent Framework, wenn man den Custom-Engine-Pfad wählt.
- **`hosted-on`** — violett, durchgezogen. Wo läuft was. Beispiel: MAF _hosted-on_ Azure Functions oder Foundry Agent Service.
- **`grounds-on`** — grün, durchgezogen. Knowledge-Anbindung. Beispiel: MAF _grounds-on_ Azure AI Search oder Foundry IQ.
- **`secured-by`** — rot, gestrichelt. Sicherheits-Beziehung. Hier sieht man auf einen Blick, was gegenüber Identity, Compliance, Threat-Detection abgesichert ist.
- **`calls`** — orange, durchgezogen. API-Call. Beispiel: Copilot Studio _calls_ Power Automate, oder MAF _calls_ Foundry Models.
- **`integrated-via`** — cyan, gepunktet. Über einen Standard-Vermittler. Im Moment hauptsächlich MCP — Model Context Protocol.

Pfeile zeigen Richtung. Wenn man auf eine Linie hovert, kommt rechts im Panel die ausführliche Beschreibung, was diese Verbindung in der Praxis bedeutet — also nicht nur _"existiert"_, sondern _"so wird sie genutzt, das musst du beachten"_.

Das ist der Punkt, an dem die Map sich von einem Org-Chart unterscheidet. Hier steht **operatives Wissen**, nicht nur Topologie.

---

## Block 5 — Hover-Demo: Microsoft Agent Framework (13:00 – 17:00)

> [Maus zum Microsoft Agent Framework Knoten in der Mitte]

Lass mich eine Geschichte erzählen, indem ich auf den wichtigsten Knoten hovere.

> [Hover auf "Microsoft Agent Framework"]

**Microsoft Agent Framework — MAF**, GA seit 2026-04-07. Das ist Microsofts neue Konsolidierung. Vorher gab es drei separate Frameworks — Bot Framework, Semantic Kernel, AutoGen — alle mit überlappenden Konzepten und unterschiedlichen APIs. Jetzt eines, MAF.

Was die Map zeigt: MAF hat **mehr eingehende und ausgehende Verbindungen als jeder andere Knoten**. Das ist kein Zufall, das ist die strategische Bedeutung — MAF ist der **Hub** des modernen Microsoft-Agent-Stacks.

> [Zeig auf die orangen Linien nach unten zu Foundation]

Vom MAF gehen Calls runter zu **Foundry Models** — also den eigentlichen LLMs — und zur **Azure OpenAI Responses API**. Das ist der Inferenz-Pfad.

> [Zeig auf die grünen Linien zu Knowledge]

Grün, also Grounding: MAF groundet auf **Azure AI Search** für Vector-Retrieval, auf **Foundry IQ** als verwaltetem Knowledge-Wrapper, auf **Cosmos DB for AI** als transaktionalem Vector-Store.

> [Zeig auf die violetten Linien zu Hosting]

Violett, Hosting: MAF kann auf **drei Arten** deployed werden — managed via Foundry Agent Service, oder self-hosted auf Azure Functions oder Container Apps. **Das ist eine wichtige Architektur-Entscheidung**, weil Foundry Agent Service nur in North Central US verfügbar ist — DSGVO-Implikation für unsere Schweizer Kunden. Self-Hosting auf Azure Functions ist der EU-konforme Pfad.

> [Klick auf den Knoten — falls Klick → Detail-Seite öffnet, kurz zurück]

Wenn ich klicke, gehe ich auf die Produkt-Detail-Seite mit den ausführlichen Notizen. Aber bleiben wir kurz auf der Map.

> [Hover wieder auf MAF]

Rot, gestrichelt: **secured-by**. MAF ist abgesichert über **Entra Agent ID** — das ist Microsofts neues Konzept, dass jeder Agent eine eigene Identity bekommt, gegen die man Conditional Access Policies fahren kann. Nicht mehr nur User haben Identities, sondern Agents auch. Plus **Microsoft Purview** für DLP und Audit, **Defender for AI** für Prompt-Injection-Detection, und **Azure AI Content Safety** für Output-Filtering.

> [Zeig auf die cyan-gepunktete Linie]

Und cyan, gepunktet: **integrated-via**. MAF spricht mit Dataverse über den **Dataverse MCP Server**. Das ist ein Pattern, das wir noch öfter sehen werden — externe Tools werden über MCP gewrapped, dann muss der Agent selbst nur Standard-MCP sprechen.

> [Zoom raus, Hover beenden]

Was du gerade gesehen hast, ist die **gesamte Architektur-Geschichte einer modernen Agent-Lösung**, in einem einzigen Hover. Modell, Knowledge, Hosting, Identity, Compliance — alles in dreissig Sekunden visualisiert. **Das** ist der Mehrwert dieser Map gegenüber Microsofts eigener Dokumentation, wo man diese Information aus zwölf verschiedenen Doc-Pages zusammenpuzzeln muss.

---

## Block 6 — Filter & Deprecation-Pfad (17:00 – 20:00)

> [Maus zur Filter-Leiste oben]

Die Map ist gefiltert. Wenn ich oben auf "Mature" filtere — also nur GA-Produkte —

> [Klick "GA"-Filter]

— dann werden alle Preview- und Deprecated-Knoten ausgegraut. Das ist die Sicht für Kunden, die _heute_ in Produktion gehen wollen. Nichts blinkt einem dabei mit "kommt in 6 Monaten" entgegen.

> [Filter zurücksetzen, dann Filter "Deprecated" oder Tag-Filter]

Umgekehrt — wenn ich gezielt nach **Deprecated** schaue —

> [Filter aktivieren]

— sieht man die Migrations-Geschichte. **Bot Framework** wandert nach M365 Agents SDK. **Semantic Kernel** und **AutoGen** wandern nach Microsoft Agent Framework. Diese drei Pfeile sind **die Migrations-Pfade**, die wir bei jedem bestehenden Microsoft-Kunden im Gespräch haben werden.

> [Hover auf den Pfeil von Bot Framework → M365 Agents SDK]

Wenn ich auf einen dieser Migrations-Pfeile hovere — siehst du im Panel rechts den Migrations-Hinweis. End-of-Support für Bot Framework ist **31. Dezember 2025**. Der Activity-Protocol bleibt kompatibel — also der Code muss nicht von Grund auf neu, aber TeamsFx wird zu Agents Toolkit, und das Manifest-Format ändert sich.

> [Filter zurücksetzen]

Das ist genau die Information, die wir im Erstgespräch mit einem Kunden, der noch auf Bot Framework ist, **innerhalb von zwei Minuten** liefern müssen — und die Map liefert sie.

> [Filter "Schicht: Governance"]

Letzter Filter-Demo: **nur Governance-Schicht.**

> [Klick]

Jetzt sieht man auf einen Blick, **was alles abgesichert werden muss**, wenn man einen Production-Agent baut. Entra Agent ID für Identity, Agent 365 für Audit und RBAC, Purview für DLP, Defender for AI für Threat Detection, Content Safety für Output-Filtering. Sechs Bausteine — und **das** ist heutzutage die ehrliche Antwort auf die Kunden-Frage _"Was muss ich für Compliance bauen?"_. Nicht ein Tool. Sechs.

> [Filter zurücksetzen]

---

## Block 7 — Klick-Navigation (20:00 – 22:00)

> [Klick auf einen interessanten Knoten — z.B. Foundry IQ]

Wenn ich auf einen Knoten klicke, lande ich auf der Produkt-Detail-Seite im Katalog.

> [Detail-Seite ist offen]

Das ist die Brücke zwischen den zwei Schichten — die Map ist für die strategische Übersicht, die Detail-Seiten sind für die operativen Notizen. Hier steht zum Beispiel bei Foundry IQ: _"Wrapper auf Azure AI Search, einfacher zu konfigurieren, automatische Re-Indexierung. Trade-off: weniger Kontrolle als Direct-Search-API. Empfehlung: für Standard-RAG-Cases nehmen."_

> [Scroll, dann Klick auf "Architecture" Tab oder Back-Button zurück]

Diese Notizen sind **unser Wissen**, nicht Microsofts. Das, was wir aus Praxis-Erfahrung wissen — was funktioniert, was nicht, wo die Stolpersteine sind. Das wächst mit jedem Kunden-Projekt.

> [Zurück zur Architecture Map]

---

## Block 8 — Pflege-Pipeline (22:00 – 25:00)

> [Optional: Wechsel zu einem Diagramm oder zu Obsidian]

Kurz dazu, **wie das System sich aktualisiert**, weil das ist nicht-trivial bei einer Tech-Landschaft, die sich monatlich ändert.

Drei Schichten:

**Erstens: Lokale Wissens-Quelle in Obsidian.** Das ist mein Arbeitsumfeld — ich schreibe Notizen, ich verbinde Konzepte, ich pflege das Wissen. Das ist Single-Source-of-Truth.

**Zweitens: GitHub als Backbone.** Über einen automatischen Daily-Sync werden meine Obsidian-Notizen jeden Tag um vier Uhr morgens als Markdown-Files generiert und committed. Quellen sind im Moment sieben — Microsoft offizielle Blogs, Build-Conference-Notes, Community-Updates, Praxis-Erfahrungen aus laufenden Projekten.

**Drittens: Zwei Distribution-Kanäle.**
- Diese Website hier — wird automatisch deployed, wenn der GitHub-Sync committet.
- Der SharePoint-Ordner in der Journai-Tenant — wird via Robocopy alle drei Stunden aus dem lokalen Mirror synchronisiert. Damit das Microsoft 365 Copilot Declarative Agent, den ich schon konfiguriert habe, auf das Wissen zugreifen kann.

> [Optional: kurz das Copilot-Studio Agent Interface zeigen oder erwähnen]

Das heisst: **ich pflege an einer Stelle, drei Kanäle aktualisieren sich automatisch.** Web-Katalog für externe Stakeholder, SharePoint+Copilot für interne Chat-Anfragen, GitHub als History und Backup.

Wenn wir morgen ein neues Produkt von der Build-Conference dazu nehmen, ist es spätestens am Tag danach in allen drei Kanälen sichtbar.

---

## Block 9 — Roadmap & Asks (25:00 – 29:00)

> [Zurück auf eine Übersichts-Folie oder die Architecture Map]

Was kommt als Nächstes — und wo brauche ich von dir Input.

**Punkt 1: Voice Agent "Emma".**
Mein nächstes grösseres Sub-Projekt. Idee: ein Voice-Interface auf dieselbe Wissensbasis. Der Use-Case ist nicht, dass _wir_ damit reden — sondern dass wir bei Pitches einen **Live-Demo-Hook** haben, der zeigt, dass wir Voice-AI im Stack beherrschen. Realistic Scope ist klein — eine begrenzte Frage-Domäne, eine Stimme. Aber als Demo-Asset bei Akquise-Gesprächen ist das **Gold**.

**Punkt 2: Microsoft Build, nächste Woche.**
Ich gehe hin, ich habe meinen Lern-Plan zugespitzt auf die Themen, die in dieser Map weisse Flecken sind — vor allem Foundry-Roadmap, MCP-Standardisierung, Agent 365 Production-Erfahrungen. Was ich von dir bräuchte: **Welche Kunden-Konstellationen** willst du, dass ich speziell für sie Antworten mitbringe? Wenn du mir bis Donnerstag drei Namen nennst, baue ich meinen Build-Tag um diese Konstellationen herum.

**Punkt 3: Sub-Projekt D — Change-Log Digest.**
Geplante nächste Iteration nach Voice Agent. Idee: ein wöchentliches automatisches Briefing, was sich in Microsofts AI-Stack geändert hat, basierend auf den Sync-Quellen. Damit bleiben wir als Team aktuell, ohne dass jeder selbst sieben Blogs scannen muss. Implementations-Aufwand klein, Mehrwert hoch — aber nur sinnvoll, wenn das Team es liest. Frage an dich: **wer im Team soll das Briefing kriegen** und in welcher Frequenz?

**Punkt 4: Cloudflare-Deployment.**
Die Website läuft im Moment nur lokal. Nächster Schritt ist Deployment auf Cloudflare Pages mit Cloudflare Access als Auth-Layer — damit nur Journai-Mitarbeiter Zugriff haben. Das ist ein Halbtages-Job für mich, eingeplant für nächste Woche. Du musst nichts tun ausser am Schluss einen Login-Test machen.

**Punkt 5: Weitere Sub-Projekte.**
Auf der Backlog-Liste, aber bewusst hinter Voice Agent priorisiert: ein Teams-Bot, der die Knowledge-Base direkt im Teams-Chat liefert; und ein "Dual-Tone-Notes"-System für Kunden-vs-intern Notizen-Differenzierung. Beides _nice-to-have_, aber nicht zeitkritisch.

---

## Block 10 — Schluss (29:00 – 30:00)

> [Pause, Augenkontakt]

Zusammengefasst: Was du gesehen hast, ist ein **Vier-Wochen-Sprint**-Resultat — vom ersten Konzept bis zum funktionsfähigen Werkzeug, das tatsächlich täglich nützt. Nicht nur ein Wiki, sondern ein **Beratungs-Werkzeug**, das uns gegenüber Kunden professioneller, schneller und konsistenter macht.

Mein Vorschlag für nächsten Schritt: lass uns zwei konkrete kommende Kunden-Calls durchgehen und schauen, ob wir die Architecture Map **direkt im Gespräch** verwenden können. Das ist der ehrliche Test, ob das Werkzeug seinen Wert hat.

Fragen?

> [Ende des aktiven Skripts — Übergang in Q&A]

---

## Backup-Notizen für Q&A

**Wenn Christoph fragt: _"Wer pflegt das langfristig?"_**
> Im Moment ich. Mit dem Daily-Sync und der MCP-basierten Architektur ist die Pflege grösstenteils automatisch — manuell muss ich nur eingreifen, wenn neue Produkte dazukommen oder die Layer-Logik sich ändert. Realistisch zwei Stunden pro Woche.

**Wenn Christoph fragt: _"Wie viel von dem ist vendor lock-in?"_**
> Stack-seitig ist es 100% Microsoft, ja. Aber das ist Absicht — wir positionieren uns als Microsoft-AI-Spezialisten. Wer multi-cloud will, ist nicht unser Kunde. Was lock-in-frei ist, ist die Wissens-Basis selbst — alles Markdown in Git, jederzeit exportierbar.

**Wenn Christoph fragt: _"Wo ist das gegenüber Wettbewerbern Differenzierung?"_**
> Andere Boutique-Beratungen haben PowerPoints zu Microsoft AI. Wir haben ein **lebendes, durchsuchbares, gefiltertes** Werkzeug, das unsere Beratungs-Logik visualisiert. Das ist im Erstgespräch ein anderer Eindruck als ein PDF.

**Wenn Christoph fragt: _"Was kostet das?"_**
> Aktuell null Lizenz-Kosten — alles Open-Source-Stack (Astro, D3, Bun) plus Cloudflare Free Tier. Hosting-Kosten in absehbarer Zukunft maximal CHF 20 pro Monat. Mein Zeit-Aufwand pro Woche zwei Stunden.

**Wenn Christoph fragt: _"Warum nicht einfach eine Notion-Page?"_**
> Notion kann Filter, ja. Notion kann **keine** typisierten Architektur-Beziehungen visualisieren. Die Map mit Hover-Detail und Cross-Filter wäre in Notion nicht baubar. Das ist exakt der Punkt, wo ein Custom-Tool seinen Wert hat.

**Wenn Christoph fragt: _"Hast du das alles selber gebaut, oder mit Claude?"_**
> Beides. Architektur und Curation sind meine. Implementation ist Claude-Code-assisted, mit klaren Spec-Dokumenten und Plan-Reviews — denselben Workflow, den wir Kunden für Agent-Entwicklung empfehlen würden. Das Projekt ist gleichzeitig Werkzeug **und** Demo unserer eigenen Arbeitsweise.

---

## Demo-Vorbereitung (am Tag selbst)

- [ ] Browser-Tab vorbereiten: Localhost:4321 ODER Cloudflare-URL
- [ ] Filter zurücksetzen
- [ ] Bildschirm-Auflösung auf 1400px+ Breite checken (sonst Map zu eng)
- [ ] DevTools geschlossen
- [ ] Notifications stumm
- [ ] Wasserglas neben Laptop
- [ ] Backup: PDF-Export von Architecture Map als Notfall-Slide bereit
- [ ] Diese Skript-Datei als zweiter Bildschirm offen, wenn möglich
