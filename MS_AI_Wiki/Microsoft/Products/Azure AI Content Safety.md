---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Content Safety, Prompt Shields, Azure AI Content Safety]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Azure AI Content Safety

*Azures **präventiver Policy-Enforcement-Service** für AI-Inputs und -Outputs — ein Bündel von Classifier-APIs ([[Foundry Tools]]-Familie), das vor und/oder nach jedem Modell-Call sitzt: **Prompt Shields** (User-Prompt-Injection + indirekte Document-Injection), **Text/Image/Multimodal Analyzer** (Hate, Sexual, Violence, Self-Harm auf 0–7-Severity-Skala), **Groundedness Detection** (RAG-Halluzinations-Check mit Correction-Mode), **Protected Material Detection** (Text, Code, Lyrics) und **Custom Categories**. In [[Foundry Models]] + Azure OpenAI ist eine Basis-Variante by default aktiv; als Standalone-REST-Service vor Custom-LLMs / externen Modellen einsetzbar.*

> **Analogie:** Content Safety ist der **Türsteher vor und hinter dem Modell** — prüft jeden rein- und rausgehenden Prompt/Response gegen Policy-Klassen. [[Defender for AI]] ist die **CCTV-Kamera dahinter**, die beobachtet, was durchrutscht, und den Vorfall an den SOC meldet. Prävention vs. Detection+Response — **beide Schichten** gehören in einen produktiven AI-Stack.

---

## Einsatz

### Job-to-be-done

When I einen produktiven LLM-/Agent-Workload mit **externem User-Input** oder **grounding via fremde Dokumente** betreibe, I want to **vor dem Modell** schadhafte/toxische Inhalte + Prompt-Injection-Versuche filtern und **nach dem Modell** ungrounded Antworten, Copyright-Material und Toxicity abfangen — konfigurierbar pro Kategorie und Severity, auditierbar pro Call, so I can **nachweislich** Compliance erfüllen (DSGVO, EU AI Act, branchenspezifische Moderations-Pflichten) und weder ein hijackter Agent noch eine halluzinierte Response beim Endkunden landet.

### Trigger-Signale

- „Unsere externen Kunden können Prompts an den Agent schicken — wie filtern wir Toxicity + Prompt-Injection?"
- „Compliance verlangt Content-Moderation-Proof für AI-Outputs (Gaming, Education, Healthcare, Media)."
- „Wir haben indirekte Prompt-Injection aus einem SharePoint-File erlebt — wie blocken wir das künftig *vor* dem Modell?"
- „Unser RAG-Agent halluziniert Preise/Produktnamen — wie prüfen wir Groundedness automatisch?"
- „Legal warnt vor Copyright-Leaks in LLM-Outputs (Lyrics, Code, Artikel-Text)."
- „Wir brauchen branchenspezifische Custom-Policy-Kategorien (z.B. 'Off-Label-Drug-Advice' für Pharma)."
- „Wir nutzen ein non-Azure-LLM (OpenAI direkt / Anthropic) — wie bekommen wir Microsoft-Filter-Niveau davor?"

### Einsatz-Szenarien

1. **Prompt Shields vor MAF-/Custom-Agent mit externem User-Input** — Customer-Facing-Chatbot auf [[Microsoft Agent Framework]]. Vor jedem Modell-Call Prompt-Shields-Call (User Prompt + Documents-Array), bei Detection Abbruch + generische Ablehnung. **Standard-Härtungs-Schritt** für jeden extern erreichbaren Agent, auch wenn das Modell in [[Foundry Models]] schon Default-Filter hat — Prompt Shields decken **Prompt-Injection** ab, nicht die Basis-Filter.
2. **Groundedness Detection post-Call für RAG-Agents** — Kunde hat [[Foundry IQ]]/Azure-AI-Search-basiertes RAG-System. Nach LLM-Response Groundedness-Call mit den retrieveten Grounding-Sources → bei Ungroundedness Correction-Mode, sonst Flag für Human-Review. Reduziert Halluzinations-Risiko gerade in Medical/Legal/Finance-Kontexten, wo Falsch-Aussagen teuer sind.
3. **Standalone-Filter vor non-Azure-LLM via [[APIM AI Gateway]]** — Kunde will Claude via OpenRouter oder OpenAI direkt nutzen, aber Microsoft-Moderation-Proof für Compliance. Content-Safety-Resource als Policy-Call im APIM-Flow vor dem Upstream-LLM → gleiche Kategorien wie bei Azure OpenAI, zentraler Audit-Log, unabhängig vom Backend-Modell.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription mit Content-Safety-Resource (F0 Free Tier ODER S0 Standard Tier) — kein M365-Lizenz-Prereq. Bei Nutzung *innerhalb* Azure OpenAI / [[Foundry Models]] sind Default-Filter **inkludiert**, aber Prompt Shields / Groundedness / Protected Material kosten extra, wenn aktiviert. |
| **Tenant / Infrastruktur** | Content-Safety-Resource in **supported Region** — für EU-Kunden: `Germany West Central`, `France Central`, `Italy North`, `Sweden Central`, `Poland Central`, `Switzerland North/West`, `UK South`, `West Europe`. **Wichtig**: nicht alle Features in allen Regionen (z.B. Groundedness nur in East US/East US 2/France Central/Sweden Central/UK South/West US — **nicht** in DE/CH) |
| **Skills / Rollen** | Developer für SDK-Integration (REST/Python/C#/.NET) · Policy-Owner für Severity-Threshold-Tuning + Blocklist-Pflege · bei Custom Categories: Data Scientist für Training-Sample-Kuration (Standard-Variante) |
| **Compliance-Rahmen** | Standard-MS-DPA; EU-Data-Residency über Regions-Wahl kontrollierbar; Content-Safety-Calls gelten als Azure-AI-Services-Processing |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup Content-Safety-Resource + Integration** | 1–2 Beratertage pro Agent/Workload — Resource provisionieren, REST/SDK in Agent-Flow, Severity-Thresholds wählen, Blocklist-Seed |
| **Prompt-Shields-Integration** | +0.5–1 Tag — Document-Array-Mapping bei RAG-Flows, Error-Handling-Pattern |
| **Groundedness + Correction-Mode** | +1–2 Tage — grounding-source-Format, Reasoning- vs. Non-Reasoning-Mode-Entscheidung, Latenz-Budget |
| **Custom Categories (Standard, Preview)** | 5–10 Tage — Training-Sample-Sammlung (min. Dutzende pro Kategorie), Iteration, Evaluation |
| **Laufende Lizenzkosten (S0 Standard)** | Text-Moderation **$0.38–1.00 pro 1.000 Records** (1 Record = 1.000 Zeichen); Image-Moderation **$0.75–1.50 pro 1.000 Images**; Prompt Shields + Protected Material + Groundedness separat tarifiert (*{UNCLEAR: exakte $/1k-Rate je Feature — Azure-Pricing-Calculator nutzen; Region-abhängig}*). Für SMB mit 10k Kunden-Prompts/Tag ≈ **€50–200/Monat** eigene Einschätzung |
| **Free Tier (F0)** | 5.000 Text-Records + 5.000 Images **pro Monat** kostenlos, 5 RPS Rate-Limit — reicht für PoC/Dev, nicht für Produktion |
| **Laufender Betrieb** | 1–2 h/Monat Threshold-Tuning nach Incident-Review (False-Positives in Medical/Legal); Blocklist-Pflege situativ |

### Empfehlung

**Status:** 🟢 **Empfehlen** — bei **jedem** produktiven AI-Workload mit externem User-Input, grounding via fremde Dokumente, oder Copyright-/Compliance-Anforderung. Begründung: Die Standard-Filter in Azure OpenAI / [[Foundry Models]] decken die 4 Harm-Kategorien auf medium-Threshold ab, **aber Prompt Shields, Protected Material und Groundedness sind opt-in** — und genau diese drei sind die Differenzierer zur Basis-Moderation. Ohne Prompt Shields bleibt indirekte Document-Injection (XPIA) dem Modell-Eigenschutz überlassen; ohne Groundedness halluzinierte RAG-Responses unentdeckt; ohne Protected Material offene Copyright-Flanke. **Kritische Nuance**: **Nicht als Ersatz** für [[Defender for AI]] sehen — Content Safety blockt/flagged *pro Call* und hat **keinen** SOC-Alert-Flow. Beides kombinieren (Content Safety = Prävention + Block, Defender = Detection + Response).

**Nächster Schritt für Journai:** „AI-Safety-Baseline"-Paket bauen (Sidecar zum Defender-for-AI-Paket): 2-Tage-Workshop „Prompt Shields + Groundedness + Custom Categories" mit Use-Case-Mapping (Chatbot vs. RAG vs. Content-Gen) + Region-Entscheidung (EU-Residency vs. Feature-Verfügbarkeit — wichtig: Groundedness nicht in DE/CH verfügbar, nur Sweden Central / France Central als EU-Option). Parallel: Pricing-Cheatsheet pro Use-Case-Volume als Verkaufshilfe.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** für Text Moderation, Image Moderation, Prompt Shields, Protected Material Text, Protected Material Code · **Preview** für Groundedness Detection, Multimodal (Image+Text), Custom Categories (Standard + Rapid), Task Adherence (für Agents) · Stand 2026-04-22 |
| **GA-Datum** | Core-Features (Text/Image/Prompt Shields) GA seit 2023 (Build 2023); Protected Material Text/Code GA 2024; laufende Versionserweiterungen (aktuelle Doc-Version 2025-09 bis 2026-03) |
| **Standalone-Preis (USD)** | **F0 Free Tier**: 5.000 Text-Records + 5.000 Image-Records/Monat, 5 RPS · **S0 Standard Tier**: Text ≈ **$0.38–1.00 pro 1.000 Records** (1 Record = 1.000 Zeichen), Image ≈ **$0.75–1.50 pro 1.000 Images**; Prompt Shields, Protected Material und Groundedness werden separat abgerechnet. *{UNCLEAR: exakte je-Feature-$-Rate — Azure-Pricing-Calculator je Region konsultieren}* |
| **Standalone-Preis (EUR)** | Nicht zentral publiziert; Currency-Umrechnung via Azure-Commercial-Kalkulator für Subscription-Region |
| **Lizenz-Bundle** | Standalone via Azure-Content-Safety-Resource (AI-Services-Consumption); **Default-Filter** inkludiert in Azure OpenAI / [[Foundry Models]] (keine Extra-Rechnung für Basis-Kategorien); erweiterte Filter (Prompt Shields, Protected Material, Groundedness) auch über Foundry aktivierbar, dann nach Content-Safety-Pricing abgerechnet |
| **Voraussetzung** | Azure-Subscription · Content-Safety-Resource in Support-Region · Entra ID / API-Key für Authentication |
| **Region-Verfügbarkeit** | **25+ Regionen inkl. EU**: Germany West Central · France Central · Italy North · Poland Central · Sweden Central · Switzerland North · Switzerland West · UK South · West Europe · USGov (Fairfax Arizona + Virginia). **Feature-Asymmetrie**: Groundedness nur in East US / East US 2 / France Central / Sweden Central / UK South / West US. Custom Categories (Standard) nur in Australia East / East US / Switzerland North. Multimodal (Image+Text) nur in East US / West Europe |
| **CSP-Promo / Discounts** | Keine öffentlich; bei Enterprise-Agreement-Kunden mit MS-AE verhandelbar |
| **Hidden Costs** | **Latenz addiert sich** (100–500 ms pro Call) — bei Multi-Step-Agents summiert sich das · **Record-Definition**: ≥1.000 Zeichen = 1 Record, 7.500 Zeichen = 8 Records (granulärer als vermutet) · **Rate-Limits**: S0 = 1.000 Requests/10s für Moderation/Prompt-Shields/Protected Material, aber nur **50 RPS** für Groundedness, **5 RPS** für Custom Categories Standard — bei hochvolumigen Workloads Rate-Limit-Erhöhung separat beantragen · **Deprecation-Policy**: Preview-Versionen deprecaten 90 Tage nach Nachfolger; Runbook-Versioning nötig |
| **Upgrade-Pfad** | F0 → S0 via Portal-Umstellung in gleicher Resource; Resource-Region-Wechsel = neue Resource + Migration |

---

## Kernkonzept

### Was es im Kern ist

Content Safety ist ein **stateless Classifier-Service** mit klarem Design-Prinzip: Jede Capability ist ein **eigener REST-Endpoint**, der **in isolation** aufgerufen wird — keine Session, kein Zustand, keine Mandanten-Tenancy auf Content-Ebene. Das macht ihn **orchestrierbar** (man baut die Filter-Pipeline selbst im Agent-Code, statt sie von Microsoft auferlegt zu bekommen) und **portierbar** (läuft gegen jedes Modell — Azure OpenAI, Foundry-gehostet, selbst OpenAI direkt hinter einem Gateway).

Die **fundamentale Trennung**: Content-Safety ist **kein** Agent-Framework, kein Runtime, kein Security-Produkt. Es ist ein **Policy-Enforcement-Primitiv** — ein Satz hochspezialisierter ML-Modelle (je ein Modell pro Aufgabe: Harm-Classifier, Prompt-Injection-Detektor, Groundedness-Reasoner, Protected-Material-Matcher), die Microsoft **zentral pflegt und aktualisiert** und die der Kunde als Pipeline-Komponente einschaltet.

**Drei Deployment-Varianten**, die Kunden oft verwechseln:

1. **Eingebaut in Azure OpenAI / [[Foundry Models]]**: Jedes Modell-Deployment hat einen Default-Content-Filter (Harm-Kategorien auf medium-Threshold) — das ist **Content-Safety-Technologie**, aber ohne Zusatz-Billing, konfigurierbar nur über Foundry-Portal-Filter-Profile. Prompt Shields / Protected Material / Groundedness sind **opt-in** innerhalb der Filter-Profile und werden dann **nach Content-Safety-Pricing** abgerechnet.
2. **Standalone REST-Service**: Eigene Content-Safety-Resource mit eigenem Endpoint — für Custom-LLMs, externe Modelle, Image-Moderation in Upload-Flows, Batch-Content-Review.
3. **Content Safety Studio** (contentsafety.cognitive.azure.com): GUI-Frontend zum Testen, Blocklists-Pflegen und Monitoring — nicht die Produktions-API, sondern das Sandbox-Werkzeug.

Die **Seele**: Microsoft investiert in **kontinuierliches Model-Retraining** gegen neue Attack-Patterns (Encoding-Angriffe, Role-Play, ASCII-Smuggling) und **sprachspezifische Evaluation** für 8 Ankersprachen (DE/EN/FR/IT/ES/PT/JA/ZH). Der Service verbessert sich **ohne Kunden-Code-Änderung** — aber gleichzeitig deprecaten ältere API-Versionen aggressiv (90-Tage-Policy), was Versionierungs-Disziplin beim Kunden erzwingt.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Pre-Model Filter** | User-Prompt-Screening, Document-Injection-Check | **Content Safety** (Prompt Shields + Text Analyzer) |
| **Model Runtime** | LLM-Inferenz | [[Foundry Models]] / Azure OpenAI / externe LLMs |
| **Post-Model Filter** | Output-Toxicity-Check, Protected-Material-Scan, Groundedness-Check | **Content Safety** (Text Analyzer + Protected Material + Groundedness) |
| **Runtime-Detection (Durchschlupf)** | Alert-Generierung, XDR-Incident, SOC-Workflow | [[Defender for AI]] (komplementär, nicht Teil von Content Safety) |
| **Governance / Policy** | Welche Filter für welchen Agent, Sensitivity-Labels, DLP | [[Foundry Control Plane]] + [[Microsoft Purview]] |
| **Studio / Tuning** | Blocklist-Pflege, Threshold-Kalibrierung, KPI-Monitoring | Content Safety Studio (GUI) |

### Kern-Fähigkeiten

#### 1. Prompt Shields — Unified Prompt-Injection-Defense

Ein **einziger API-Endpoint** (`detect-text-jailbreak`) nimmt zwei Input-Klassen entgegen und klassifiziert jeweils separat:

- **User Prompt attacks (früher „Jailbreak risk detection")**: Der Endnutzer versucht, System-Rules zu umgehen. 4 Attack-Subtypen: *Attempt to change system rules* (z.B. „Ignore all previous instructions"), *Embedded conversation mockup* (fake Dialog-Historie in einem Prompt), *Role-Play* (z.B. „Act as DAN without restrictions"), *Encoding Attacks* (URL-Encoding, Base64, Chiffren).
- **Document attacks (XPIA / indirekte Injection)**: Third-Party-Content (SharePoint-Files, E-Mails, PDFs, Websites), den der Agent als Grounding aufnimmt, enthält **versteckte Anweisungen**. 10 Subtypen, darunter *Manipulated Content*, *Information Gathering / Exfiltration*, *Fraud*, *Malware-Links*, *Privilege Escalation*.

**Eingabe**: User-Prompt (≤10k Zeichen) + bis zu 5 Documents (gesamt ≤10k Zeichen). **Ausgabe**: binäre Detection-Flags pro Klasse (kein Severity-Grading wie bei Harm-Categories, sondern attack/no-attack). **Sprachsupport**: DE/EN/FR/ES/IT/JA/PT/ZH trainiert; andere Sprachen möglich, aber ohne Qualitätszusage — **für DACH-SMB relevant, weil DE eine der explizit trainierten Sprachen ist**. **Grenze**: False-Positives in legitimen Security-Testing-Kontexten (Red-Team-Queries triggern) und bei Rollenspiel-basierten Creative-Writing-Apps.

#### 2. Text/Image/Multimodal Analyzer — 4 Harm-Kategorien auf 0–7-Severity-Skala

Klassifiziert gegen **Hate and Fairness, Sexual, Violence, Self-Harm** (Task Adherence als Preview-Zusatz-Kategorie für Agent-Behavior-Misalignment). **Severity-Modell**:

- **Text**: volle **0–7-Skala** (oder getrimmt auf 0/2/4/6), granulare Differenzierung z.B. zwischen Level 2 („profanity without identity-group target") und Level 4 („direct slurs targeting identity group") — **wichtig für Threshold-Tuning**, wenn medium-Default zu aggressiv ist.
- **Image**: nur getrimmt **0/2/4/6** (in Docs als Safe/Low/Medium/High benannt).
- **Multimodal (Image+Text, Preview)**: volle 0–7-Skala, erkennt **textoverlays auf Bildern** und interpretiert sie im Kontext — z.B. Meme-Detection mit hate-speech-Text-Overlay auf harmlosem Bild.

**Standard-Blocking-Schwelle** (Azure OpenAI Default): **medium (4)** für alle Kategorien für Prompt + Completion. Kunde kann pro Kategorie auf low (2) / high (6) heben/senken. **Grenze**: Klassifikation ist multi-label (ein Text kann gleichzeitig Hate+Violence sein); Non-Anchor-Languages (Arabisch, Russisch, Hindi) funktionieren oft, aber ohne publizierte Qualitäts-Metriken — im DACH-Kontext nur DE/FR/IT getestet, Schweizer-Deutsch-Dialekte oder legal-medical-Deutsch sind blind spots (eigene Einschätzung).

#### 3. Groundedness Detection (Preview) — RAG-Halluzinations-Schutz

Prüft, ob eine LLM-Response aus einer gegebenen Grounding-Source abgeleitet ist. **Zwei Modi**:

- **Non-Reasoning mode**: binäres grounded/ungrounded, schnell (niedrige Latenz) — für Realtime-Apps.
- **Reasoning mode**: mit Erklärung + optional **Correction-Feature**, das automatisch eine korrigierte Response generiert (z.B. falscher Datum → Grounding-Datum).

**Domain-Tuning**: `MEDICAL` vs. `GENERIC`. **Task-Tuning**: `Summarization` vs. `QnA`. **Limits**: Grounding-Source ≤55.000 Zeichen, Response-Text ≤7.500 Zeichen, Query ≥3 Wörter, **nur Englisch** (Non-EN kann funktionieren, aber ohne Qualitäts-Zusage). **Rate**: S0 = 50 RPS (strenger als andere Endpunkte).

**Wann relevant**: jedes RAG-System, wo Halluzination teuer ist (Medical-QnA, Finance-Advisory, Legal-Summary). **Grenze**: **EN-only** ist für DACH-Kunden eine harte Einschränkung — deutschsprachige RAG-Agents können Groundedness erst nach Translation-Zwischenschritt nutzen (eigene Einschätzung: zusätzliche Latenz + Übersetzungs-Fehler-Propagation).

#### 4. Protected Material Detection — Copyright-Scan auf LLM-Output

Zwei separate APIs:

- **Protected Material Text**: scannt gegen bekannte Songtexte (Lyrics), News/Magazine-Artikel, Rezepte, Selected Web Content (u.a. `webmd.com`). Schwellen: Lyrics ≤11 Wörter als acceptable, News/Web-Content ≤200 Zeichen, Rezepte ≤40 Zeichen für Anekdoten/Narrativ.
- **Protected Material Code**: scannt gegen GitHub-Public-Repos. **Harte Einschränkung**: Trainings-Snapshot nur bis **April 6, 2023** — Code nach diesem Datum wird nicht erkannt. Für Copilot/GitHub-Copilot-ähnliche Assistenten ist das praktisch Feigenblatt-Schutz (eigene Einschätzung).

**Eingabe**: ≥110 Zeichen (Text) zum Scan, max 10k Zeichen. Nur LLM-Completions, nicht User-Prompts. **Sprache**: nur Englisch. **Wann relevant**: Content-Gen-Plattformen (Marketing-Copy, E-Learning), AI-Coding-Assistants, News-Drafting. **Grenze**: statischer Snapshot → veraltet für moderne Code/Lyrics; keine DE-Lyrics oder DE-News im Trainingsset.

#### 5. Custom Categories (Preview) — Trainierbare Policy-Framework

Kunde definiert eigene Harm-Kategorie (z.B. „Off-Label-Drug-Advice", „Competitor-Mention", „Internal-Project-Codename") und trainiert einen Classifier. **Zwei Varianten**:

- **Custom Categories Standard**: trainiertes Modell aus Dutzenden Samples, persistentes Deployment. Latenz wie Standard-Moderation, 5 RPS S0.
- **Custom Categories Rapid**: emergent-threat-Pattern (z.B. neue Jailbreak-Welle), schnell definiert ohne Retraining — reagiert auf kurzfristige Bedrohungen.

**Wann relevant**: Regulated Industries mit branchenspezifischen Tabus; SMB in Healthcare / Legal / Finance mit Fach-Compliance. **Grenze**: Aufwand (Sample-Kuration, Iteration) + Preview-Status (API-Änderungs-Risiko).

#### 6. Task Adherence (Preview) — Agent-Behavior-Misalignment-Detection

Nativ für Agents: erkennt, wenn Tool-Invocations / Tool-Inputs / Responses **nicht zum User-Intent passen** (z.B. Agent ruft Payment-API bei einer Wetterfrage). Komplementär zu [[Defender for AI]]s Agent Tooling Gateway (Runtime-Block) — Task Adherence ist der **Classifier**, Defender liefert das **Response-Framework**. Stand 2026-04 Preview.

### Typischer Workflow

1. **Resource-Provisionierung (Developer, Tag 1)** — Azure-Portal → Content-Safety-Resource in EU-Region (Sweden Central für Feature-Vollständigkeit inkl. Groundedness, France Central als französische Alternative, Germany West Central wenn DE-Residency kritisch und Groundedness nicht gebraucht) → F0 für PoC, später S0.
2. **SDK-Integration (Developer, Tag 1–3)** — Python/C#/REST SDK im Agent-Code. Pipeline: `user_prompt → prompt_shields_call → (if flagged: block) → model_call → text_moderation_call + protected_material_call → (if flagged: block/revise) → groundedness_call (für RAG) → deliver_response`. Error-Handling: Timeouts (100–500 ms pro Call) als Fail-Safe konfigurieren.
3. **Threshold-Kalibrierung (Policy-Owner, Woche 1–2)** — Content Safety Studio nutzen, Sample-Inputs durchlaufen lassen, Severity-Thresholds je Kategorie justieren. Typisch SMB: Hate/Sexual/Self-Harm medium-block, Violence low-block (wenn Gaming/News-Kontext). Blocklists für branchenspezifische Wörter/Keys ergänzen.
4. **Monitoring-Setup (SecOps, Woche 2)** — Content Safety Studio Monitor-Page prüft Usage-Trends, Category-Verteilung, Block-Raten. Für detaillierte Incidents: Alert-Export nach Defender XDR (via [[Defender for AI]]) oder Custom Dashboard in Sentinel/Azure Monitor.
5. **Custom Categories (optional, Woche 3–6)** — Samples sammeln (min. Dutzende positive + negative), Standard-Variante trainieren + evaluieren, in Pipeline einhängen.
6. **Betrieb** — monatliches False-Positive-Review (typisch 1–2 h für SMB), Threshold-Nachjustierung, API-Version-Monitoring (90-Tage-Deprecation-Policy → Release-Notes-Watch erforderlich).

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | Python/C# SDK · REST-API-Integration in Async-Agent-Flows · Severity-Threshold-Ökonomie (wann medium vs. low vs. high) · Prompt-Injection-Pattern-Kenntnisse (Encoding-Angriffe, Role-Play) · Groundedness-Source-Embedding-Format |
| **Admin beim Kunden** | Azure-Owner / Contributor für Resource-Provisionierung · Entra-ID-RBAC für Service-Principal-Access · Kostenkontrolle via Azure-Budget-Alerts (Hidden-Cost-Vermeidung) |
| **Policy-Owner / Compliance** | Blocklist-Pflege (MS Studio, keine Coding-Skills nötig) · Kategorie-Severity-Verständnis auf Basis der Beispiel-Texte in der Doc · Incident-Review-Runbook (was bei Block-Rate-Anstieg tun) |
| **End-User** | Keine — transparent, allenfalls Awareness dass Chatbot bei „policy-violation" ablehnt |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein Runtime-Alerting / SOC-Workflow** — Content Safety blockt/flagged pro Call, aber kein XDR-Incident | [[Defender for AI]] kombinieren — erkennt Durchschlupf + korreliert mit User-/Endpoint-Risk |
| **Groundedness + Protected Material + Custom Categories Standard = nur Englisch** | DACH-RAG: Translation-Sidecar (z.B. Translator + Groundedness + Back-Translation) akzeptieren Latenz-Aufschlag; alternativ Custom-Category trainieren (wenn EN-funktional) |
| **Protected Material Code-Snapshot bis April 2023** | Für aktuelle Code-Schutz-Anforderung: GitHub Advanced Security / Snyk / Black Duck zusätzlich einsetzen |
| **Kein Stateful-Kontext über Calls hinweg** — Jeder Call stateless, keine Session-Historie | Orchestrierung + Historie im Agent-Framework ([[Microsoft Agent Framework]]) halten; Content Safety nur als pro-Call-Policy-Primitiv sehen |
| **Image-Severity nur getrimmt 0/2/4/6** (kein 0–7 wie bei Text) | Für finer-grained Bildmoderation: Azure AI Vision + Custom-Model-Pipeline |
| **Audio/Video-Moderation fehlt** (nur Text/Image/Image+Text) | Speech-to-Text → Text Moderation; für Video: Frame-Sampling + Image-Moderation (Eigenbau-Pipeline) |
| **Groundedness nicht in DE/CH-Azure-Regionen verfügbar** (Stand 2026-04) | Sweden Central oder France Central als EU-Residency-Alternative; oder Warten auf Region-Expansion |
| **Hohe Rate-Limits nur auf Antrag** (Custom Cat Standard 5 RPS, Groundedness 50 RPS) | Frühzeitig Rate-Limit-Erhöhung bei Microsoft beantragen; Caching für wiederkehrende Prompts |
| **Keine Prompt-Evidence-Persistenz** (anders als [[Defender for AI]] Prompt Evidence) | Separate Logging-Layer (Application Insights / Azure Monitor) für Audit-Trail aufbauen |

### Typische Fallstricke

- **„Content Safety reicht, wir brauchen kein Defender"** — falsch. Content Safety blockt pro Call, hat kein SOC-Correlation, keine User-Risk-Verknüpfung, kein Incident-Workflow. Ein erfolgreicher Jailbreak, der durchrutscht, ist ohne Defender **unsichtbar**. *Gegenmittel: Beratungs-Slide „Türsteher + Kamera" (beide nötig) im Erstgespräch.*
- **Latenz-Kumulation bei Multi-Call-Pipeline** — 4 Calls (Prompt Shields + Text Moderation + Model + Groundedness) = +300–1500 ms Latenz on top vom Modell-Call. Bei Voice-Agents / Live-Chat spürbar. *Gegenmittel: parallelisieren, wo fachlich möglich (Prompt Shields + Text Moderation parallel, Groundedness nur bei RAG-Response); Caching für Hot-Queries.*
- **Default-Filter-Verwechslung** — Kunde denkt, „Foundry-Default-Filter = Prompt Shields aktiv". Ist falsch: Default = Hate/Sexual/Violence/Self-Harm auf medium. Prompt Shields + Protected Material + Groundedness sind **opt-in** und **extra-billed**. *Gegenmittel: Filter-Profile im Foundry-Portal mit Kunde durchgehen, zeigen was aktiv ist und was nicht.*
- **Record-Counting-Überraschung** — 1 Record = 1.000 Zeichen. Ein 7.500-Zeichen-Prompt = 8 Records. Bei long-context-RAG (grounding docs im Prompt) explodieren die Costs. *Gegenmittel: Pricing-Modell mit reellen Durchschnitts-Prompt-Längen simulieren, nicht mit „1 Call = 1 Record" rechnen.*
- **False-Positives bei Medical/Legal/Security-Kontexten** — legitime medizinische Anamnese (Selbstmord-Gedanken bei Depression) oder Security-Red-Team-Query (Jailbreak-Pattern zum Testen) wird geblockt. Führt zu Akzeptanz-Problemen beim Fachpersonal. *Gegenmittel: Custom Category mit „professional-context"-Whitelist trainieren oder Severity-Threshold für Self-Harm/Violence in Fach-Apps auf high (6) statt medium (4) heben — bewusst dokumentierte Policy-Entscheidung.*
- **Region-Feature-Asymmetrie übersehen** — Kunde wählt Germany West Central für DE-Residency, will dann Groundedness aktivieren → Feature nicht verfügbar. *Gegenmittel: Feature-Region-Matrix (aus MS-Docs) am Anfang der Architektur-Diskussion klären.*
- **API-Versions-Deprecation (90 Tage)** — Preview-Features (Groundedness, Custom Cat, Multimodal) drehen API-Contracts; Kunden-Code bricht still. *Gegenmittel: API-Version explizit pinnen, Release-Notes-Monitoring als Runbook-Item, Migrations-Fenster quartalsweise einplanen.*
- **Preview-Features in Compliance-kritischer Produktion** — SLA-Zusagen für Preview-Endpunkte sind schwach. *Gegenmittel: Für regulierte Workloads nur GA-Features (Text/Image/Prompt Shields/Protected Material Text+Code) als harte Control; Preview als „defense-in-depth"-Zusatz kennzeichnen.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Foundry Models]] / Azure OpenAI** | Default-Content-Filter (Hate/Sexual/Violence/Self-Harm medium) inline, opt-in Prompt Shields + Protected Material | GA | Basis-Filter kostenlos, erweiterte extra-billed; Profil-Konfiguration im Foundry-Portal separat vom Content-Safety-Resource-Portal |
| **[[Foundry Control Plane]]** | Content-Filter-Policies als Governance-Objekt, Audit über Foundry-Audit-Stream | GA | Policy-Granularität (pro Deployment vs. pro Region vs. pro Subscription) klären |
| **[[Microsoft Agent Framework]]** | SDK-Sample für Prompt-Shields-Integration in Agent-Flow | GA | Keine native Middleware — selbst orchestrieren (Entwickler-Pattern, nicht Konfiguration) |
| **[[Copilot Studio]]** | AI-Moderation-Guardrails verwenden Content-Safety-Tech unter der Haube | GA | Policy-Level für Maker nicht direkt sichtbar — abstrahiert; für Custom-Policies extern Content-Safety-Call aus Plugin heraus |
| **[[Microsoft 365 Copilot]]** | Content-Safety-Mechanismen im Copilot-Runtime-Layer (UPIA/XPIA-Defense) | GA | Endkunde kann die Filter nicht direkt konfigurieren — MS-verwaltet, surfact via [[Defender for AI]] |
| **[[Defender for AI]]** | Content-Safety-Prompt-Shields-Signale fließen als Alert-Quelle in Defender for Cloud | GA | Architektonisch klar: Content Safety = Prävention, Defender = Detection |
| **[[Microsoft Purview]]** | DSPM-for-AI nutzt Content-Safety-Ergebnisse als Risk-Signal; Sensitivity-Labels beeinflussen Policy | GA | Cross-Portal-Korrelation nicht nahtlos |
| **Azure OpenAI Assistants / Batch API** | Default-Filter inline | GA | Async-Batch = verzögerte Filter-Ergebnisse |
| **Azure Monitor / Application Insights** | Custom-Logging der Content-Safety-Calls als Events | GA | Kein First-Party-Connector; Eigenbau via SDK |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **OpenAI direkt / Anthropic / Gemini (via [[APIM AI Gateway]])** | Content Safety als Policy-Call vor dem Upstream-LLM | GA | Eigenbau im APIM-Policy-File (kein Plug-&-Play-Template); kein Protected-Material für non-MS-Modelle zertifiziert |
| **LangChain / LlamaIndex** | Content-Safety-Wrapper verfügbar (Community) | Community | Kein First-Party-Package; Versions-Drift-Risiko |
| **n8n / Zapier / Power Automate** | HTTP-Request-Node mit Content-Safety-REST | GA (low-code) | Latenz + Quota-Überwachung manuell |
| **Frontend-JS (Browser-Direct-Call)** | **Nicht empfohlen** — API-Key-Exposure | — | Immer via Backend proxiieren |

### APIs / Protokolle

- **REST-API** (OpenAPI-spec'd) — primäre Schnittstelle, alle Features
- **SDKs**: Python, C# (.NET), JavaScript/TypeScript, Java
- **Azure-Auth**: Entra ID (Managed Identity empfohlen) oder API-Key
- **Keine** MCP-Integration nativ — aber über Foundry-Tools-Registry mittelbar (Content Safety als Tool-Contract verfügbar, eigene Einschätzung)
- **Content Safety Studio** (GUI) für Exploration, nicht Produktion

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Resource-Region bestimmt Processing + Storage-Location. EU-Residency via Sweden Central / France Central / Germany West Central / Italy North / Poland Central / West Europe erreichbar. Switzerland North verfügbar für CH-Kunden mit FINMA-/nDSG-Anforderungen. **Feature-Asymmetrie beachten** (Groundedness nicht in DE/CH) |
| **Prompts & Outputs** | Content-Safety-Calls werden **nicht für Modell-Training** verwendet (Azure-AI-Services-Standard-Commitment). Request-Daten verlassen die gewählte Region nicht. Keine persistente Speicherung der Prompts im Service selbst (stateless) — Kunde ist verantwortlich für Logging/Audit auf eigener Seite |
| **Data Processing Addendum (DPA)** | Standard-MS-DPA deckt Azure AI Services ab; Content Safety fällt darunter |
| **EU-AI-Act-Klassifizierung** | Content Safety selbst ist **tooling/supporting infrastructure** (kein High-Risk-System per se); wird häufig als **Art.-15-Accuracy-and-Cybersecurity-Control** oder Art.-9-Risk-Management-Measure für high-risk AI-Systeme eingesetzt — Klassifikation des übergeordneten Systems (Chatbot, Agent, RAG-App) bleibt Kunden-Pflicht |

### Microsoft-Compliance-Stack

Content Safety ist die **Prävention-Schicht** im Defense-in-Depth-Stack:
- **Prävention + Policy-Enforcement**: **Content Safety** (das hier)
- **Runtime-Detection + Response**: [[Defender for AI]] (Defender for Cloud AI-services + XDR Security for AI Agents)
- **Data Governance + Labels + DLP**: [[Microsoft Purview]]
- **Identity + Conditional Access**: [[Entra Agent ID]] + Conditional Access
- **Governance-Layer**: [[Foundry Control Plane]] (Policy-Definition), [[Microsoft 365 Copilot]] Control System

### Bekannte Compliance-Lücken

- **Groundedness EN-only** — für DSGVO-Art.-22-Automated-Decision-Anforderungen (Explainability, Genauigkeit) in DE-Sprache-Workloads Lücke; Translation-Sidecar als Work-around einführt neue Datenverarbeitungs-Hops, die DPA-rechtlich geprüft werden müssen.
- **Content Safety Studio** kann Test-Prompts speichern (für Monitoring-Trends) — für PII-haltige Test-Daten Consent/Retention prüfen.
- **Protected Material Code-Snapshot** veraltet (bis April 2023) — **kein** ausreichender Copyright-Schutz für moderne Coding-Assistants.
- **Custom Categories Standard Training-Daten** bleiben im Service-Training-Workspace — nicht für Modell-Training verwendet, aber Customer-Managed-Keys (CMK/BYOK) für Encryption-at-Rest explizit aktivieren.
- **Audio-/Video-Blindspot** — bei multimedialen Compliance-Anforderungen (Call-Center-AI, Video-Moderation) explizit als Risk-Register-Eintrag dokumentieren.
- **Region-Transfer bei Feature-Opt-In** — wenn Kunde Groundedness braucht und deshalb nach Sweden Central wechselt, ändert sich Data-Residency; DPA-Anlage prüfen.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs | What is Azure AI Content Safety? (Overview) | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview | 2026-04-22 | Feature-Matrix, Region-Verfügbarkeit, Input-Limits |
| Docs | Prompt Shields Concepts | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection | 2026-04-22 | Attack-Subtypen, Sprach-Support |
| Docs | Harm Categories + Severity Levels | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories | 2026-04-22 | 0–7-Skala, Beispiel-Texte pro Level |
| Docs | Groundedness Detection | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness | 2026-04-22 | Reasoning-Mode, Correction, Domain/Task-Tuning |
| Docs | Protected Material Detection | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/protected-material | 2026-04-22 | Text/Code-Scope, 200-Char/11-Word-Schwellen |
| Docs | Custom Categories | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/custom-categories | 2026-04-22 | Standard + Rapid Variante |
| Docs | Task Adherence | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/task-adherence | 2026-04-22 | Agent-Behavior-Misalignment (Preview) |
| Docs | Content Filtering for Foundry Models (Default Filters) | https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/content-filtering | 2026-04-22 | Default-Thresholds, Filter-Profile |
| Docs | Default Safety Policies for Azure OpenAI | https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/default-safety-policies | 2026-04-22 | Was inline, was opt-in |
| Docs | Configure Content Filters (How-to) | https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/content-filters | 2026-04-22 | Praktische Konfiguration in Foundry |
| Pricing | Azure AI Content Safety Pricing | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/content-safety/ | 2026-04-22 | Per-1k-Records-Raten, F0/S0-Tier |
| Studio | Content Safety Studio | https://contentsafety.cognitive.azure.com | 2026-04-22 | Interaktives Testing, Blocklists, Monitoring |
| FAQ | Content Safety FAQ | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/faq | 2026-04-22 | Record-Counting, Edge-Cases |

### Secondary (Analysten & Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| TrustRadius Pricing Overview | https://www.trustradius.com/products/azure-ai-content-safety/pricing | 2026-04-22 | Marktvergleich Moderation-APIs |
| WaveSpeedAI Comparison | https://wavespeed.ai/blog/posts/best-ai-content-moderation-apis-tools-2026/ | 2026-04-22 | vs. OpenAI Moderation, AWS Rekognition, Google Perspective |
| Oreate AI Pricing Demystification | https://www.oreateai.com/blog/demystifying-azure-ai-content-safety-pricing-keeping-your-digital-spaces-clean/84e401553234165a4b26dca410a2e1cd | 2026-04-22 | Record-Counting-Details praxisnah |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Custom Categories GA? Groundedness DACH-Region-Expansion? Multimodal GA? |
| AI Tour Zürich | 2026-04-29 | CH-Regions-Updates für Switzerland North Content-Safety-Features |
| Microsoft Ignite 2026 | Nov 2026 | Audio/Video-Moderation? Task Adherence GA? Multi-Language-Groundedness? |

---

## UNCLEAR / TODO

1. Exakte $/1k-Record-Raten je Feature (Text vs. Image vs. Prompt Shields vs. Protected Material vs. Groundedness) in EU-Regionen — Azure-Pricing-Calculator je Subscription konsultieren; Quellen zeigen Spannen $0.38–$1.00 für Text, Aggregation je Sub-Feature unklar
2. Roadmap für Groundedness in Germany West Central / Switzerland North (Stand 2026-04 nicht verfügbar)
3. GA-Datum für Custom Categories Standard + Rapid
4. GA-Datum für Multimodal (Image+Text) Analyzer
5. GA-Datum für Task Adherence
6. DE-Qualitäts-Metriken für Prompt Shields (Microsoft veröffentlicht keine sprachspezifische Precision/Recall-Zahlen)
7. Ob Protected Material Code-Snapshot (April 2023) aktualisiert wird

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Content Safety: Prompt Shields (User+Document Attacks), Content-Filter-Categories (0–7-Severity), Groundedness Detection (Reasoning+Correction), Protected Material (Text/Code-Snapshot April 2023), Custom Categories + Task Adherence (Preview), Region-Matrix mit EU-Feature-Asymmetrie, Pricing-Struktur, Kombination mit [[Defender for AI]] | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
