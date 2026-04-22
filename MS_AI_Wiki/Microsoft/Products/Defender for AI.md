---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Microsoft Defender for AI, Defender XDR for AI, Defender for AI Services, Threat Protection for AI Workloads]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Defender for AI

*Microsofts **Runtime-Schutz für AI-Workloads** — kein Einzelprodukt, sondern ein **Dach aus zwei Quellen** im Defender-Stack: **(1) Defender for Cloud — Threat Protection for AI Services** (schützt Azure-OpenAI- und Foundry-Modell-Deployments) und **(2) Defender XDR — Security for AI Agents** (schützt [[Agent 365]]-verwaltete Agents inkl. [[Copilot Studio]], [[Microsoft 365 Copilot]] und custom Agents via [[Microsoft Agent Framework]]-SDK). Zusammen erkennen, blocken und untersuchen sie Prompt Injection, Jailbreak, Data Exfiltration, Credential Leakage, Wallet-Attacks und anomales Agent-Verhalten — in Echtzeit (Tool-Gateway-Block) oder near-real-time (Alert + Incident-Korrelation). Ergänzt präventive Filter ([[Azure AI Content Safety]]) um **Detection + Incident-Response im SOC-Workflow**.*

> **Analogie:** Was [[Azure AI Content Safety]] als **Türsteher vor dem Modell** macht (blockt schlechte Prompts/Antworten), macht Defender for AI als **CCTV + Alarm im Gebäude** — es schaut zu, was durchkommt, korreliert mit User-/Endpoint-Signalen und löst Incidents im Defender-XDR-Portal aus. Prävention vs. Detection+Response — **beides brauchst du**.

---

## Einsatz

### Job-to-be-done

When I Produktiv-Agents oder ein Azure-OpenAI-/Foundry-Deployment betreibe und mir Angriffsvektoren (Prompt Injection, Jailbreak, Credential-Leak, exfil-ähnliches Output-Verhalten, Wallet-Attacks) real Sorgen machen, I want to **Runtime-Detection + Block + Incident-Korrelation mit User-Risk- und Endpoint-Signalen** statt nur präventiver Content-Filter, so I can einen Fall wie „Agent hat PII in Antwort zurückgegeben" **im Moment des Geschehens** erkennen und im SOC mit Standard-XDR-Workflows (Triage, Disable-User, KQL-Hunting) abarbeiten — nicht erst im Post-Mortem aus Logs rekonstruieren.

### Trigger-Signale

- „Unser Agent hat einem Kunden die Systemprompt-Instruktionen zurückgegeben — wie erkennen wir das nochmal?"
- „Wir hatten einen indirekten Prompt-Injection-Test aus einem SharePoint-File — der ging durch Content Safety, was fehlt uns?"
- „Azure-OpenAI-Rechnung über 40% hoch ohne Release — DoS oder Wallet-Attack?"
- „SOC verlangt Incident-Sichtbarkeit für AI-Angriffe im selben XDR-Portal wie Endpoint/Identity."
- „NIS2-Prüfer fragt, wie wir AI-Incidents binnen 24 h detektieren, klassifizieren und melden."
- „Der Kunde will Copilot-Studio-Agent live schalten — wir brauchen Runtime-Schutz, nicht nur Labels."

### Einsatz-Szenarien

1. **Azure-OpenAI-/Foundry-Absicherung bei Custom-Agents** — Kunde deployt einen MAF-basierten Support-Agent gegen Azure OpenAI. **Defender for Cloud Plan „AI services" aktivieren** (subscription-level) + Prompt-Evidence aktivieren → Jailbreak-/Credential-Theft-/Wallet-/ASCII-Smuggling-Alerts landen in Defender XDR, korreliert mit User-Risk aus [[Entra Agent ID]]. Das ist der **Standard-Härtungs-Schritt** bei jedem produktiven Azure-AI-Deployment.
2. **Agent-365-Runtime-Block (ATG-Integration)** — Sobald [[Agent 365]] am 2026-05-01 GA geht: Security-for-AI-Toggle im Defender-Portal aktivieren → **Agent Tooling Gateway (ATG)** evaluiert jede Tool-Invocation *bevor* sie läuft und blockt bei High-Confidence-Risiken (Exfil, internal-only-Tool-Missbrauch, Credential-Leak via externe API). Das ist der einzige Microsoft-Mechanismus, der Agent-Aktionen **in-flight** stoppt.
3. **M365-Copilot-UPIA/XPIA-Monitoring** — Kunde hat Copilot produktiv, SOC will Sichtbarkeit. Defender XDR surfaced UPIA/XPIA-Detections aus CloudAppEvents (`JailbreakDetected`, `XPIADetected`) mit Referenz auf das malicious SharePoint-File — SOC kann User disablen oder File quarantieren. Kein Extra-Deployment nötig, nur Copilot + Defender for Cloud Apps Office-Connector.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline (Azure-Seite)** | Azure-Subscription mit Defender-for-Cloud-Plan **„AI services"** aktiviert (subscription- oder resource-level); Owner-Rolle zum Enable-n |
| **Lizenz-Baseline (Agent-365-Seite)** | [[Agent 365]]-Lizenz pro Agent (GA 2026-05-01) + Defender XDR (in M365 E5 / E5 Security enthalten) — „Security for AI agents" ist Preview-Feature innerhalb Defender XDR, kein separater Kauf |
| **Tenant** | Defender-Portal-Zugang (`security.microsoft.com`); Defender for Cloud Apps Office-Connector aktiviert (für M365-Copilot-UPIA/XPIA-Tabellen); Microsoft-365-App-Connector für Agent-Audit-Logs |
| **Skills / Rollen** | SOC-Analyst mit KQL-Grundlagen (Advanced-Hunting-Tables: `AIAgentsInfo`, `CloudAppEvents`, `AlertInfo`) · Security Administrator für Defender-for-Cloud-Plan-Aktivierung · Agent-Owner für Build-time-Integration (MAF-SDK für Audit-Log-Emission) |
| **Compliance-Rahmen** | DPA via Azure + M365; EU-Daten-Residenz für Azure-AI-Workloads konfigurieren (separate Prüfung — Defender-for-Cloud-Alerts werden in Azure gespeichert) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Enable Azure-Defender-for-AI-services-Plan** | 0.5 Beratertag — toggle per Subscription, Prompt-Evidence aktivieren, RBAC setzen |
| **Enable Agent-365-Real-Time-Protection + Copilot-Studio-Extended-RTP** | 1–2 Beratertage |
| **MAF-Custom-Agent-Onboarding (Agent-365-SDK für Audit-Logs)** | 2–5 Entwicklertage pro Agent — Code-Integration, nicht nur Konfig |
| **Playbook-Entwicklung (SOC)** | 3–5 Tage — KQL-Queries, Incident-Response-Runbooks, Sentinel-Integration |
| **Laufende Lizenzkosten (Defender for AI Services)** | **Token-basiert** — nach 30-Tage-Trial / 75 Mrd. Token (je erstes) kommerziell; *{UNCLEAR: öffentliche $-pro-Million-Token-Rate — erwarten €/Monat proportional zu Prompt-Volume, für SMB mit moderatem Copilot-Einsatz ≈ Hunderte EUR/Monat eigene Einschätzung}* |
| **Laufende Lizenzkosten (Security for AI Agents in XDR)** | In Defender XDR / E5 Security inkludiert (kein separater Seat) |
| **Laufender Betrieb** | 1–3 h/Woche Alert-Triage + False-Positive-Tuning für SMB < 500 User; dominiert durch Jailbreak-FPs bei internen Security-Tests |

### Empfehlung

**Status:** 🟢 **Empfehlen** — für **jeden** Kunden mit produktivem AI-Workload in der EU, der **(a)** Agent-365-Agents laufen hat ODER **(b)** Azure-OpenAI/Foundry direkt konsumiert. Begründung: Defender for AI ist die **einzige** Microsoft-Komponente, die Runtime-Angriffe auf LLMs/Agents in den bestehenden SOC-Stack bringt — ohne sie bleiben Jailbreaks, Credential-Leaks und Wallet-Attacks **im Audit-Log unsichtbar**, bis ein Incident sie offenbart. **Wichtig**: **Nicht als Ersatz** für [[Azure AI Content Safety]] sehen — Prompt Shields blockt *vor* Modell-Call, Defender detektiert Durchschlupf + erweitert um Agent-Verhalten. 🟡-Nuance: **Security for AI Agents** (XDR-Teil) ist Stand 2026-04 in **Preview** — für Compliance-kritische Auditierung Pricing + SLA beim Kunden verifizieren.

**Nächster Schritt für Journai:** Standard-„AI-Security-Baseline"-Paket bauen: 2-Tage-Workshop „Defender for Cloud AI-services enable + XDR-Security-for-AI-agents toggle + KQL-Runbook für 3 Top-Alerts (Jailbreak, Credential-Theft, Anomalous-Tool-Invocation)". Parallel: Token-Cost-Schätzer für Kundenangebote entwickeln — Pricing-Struktur ist pro-Token und muss im Angebot transparent sein.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **Gemischt**: Defender for Cloud „Threat Protection for AI Services" = **GA** (Azure OpenAI + Azure AI Model Inference supported models, text-Tokens only) · Agent-Alerts für Foundry Agent Service = **Preview** · Defender XDR „Security for AI Agents" (Agent-365-RTP + Copilot-Studio-extended-RTP) = **Preview** (Stand 2026-04-22) |
| **GA-Datum** | Defender for Cloud AI Threat Protection: GA angekündigt 2024-05 auf MS Build, breiter Rollout durch 2025; Agent-XDR-Teil GA-Timeline an [[Agent 365]] GA gekoppelt (**2026-05-01**) |
| **Standalone-Preis (USD)** | **Defender for AI Services**: Token-basiert (Billing per Million scanned Tokens) — **30-Tage-Trial ODER 75 Mrd. Token frei** (was zuerst kommt), danach commercial. *{UNCLEAR: exakte $/M-Token-Rate auf Pricing-Page — Pricing-Calculator in Azure nutzen}* · **Security for AI Agents (XDR)**: in Defender XDR / E5 Security inkludiert |
| **Standalone-Preis (EUR)** | *{UNCLEAR: nicht zentral publiziert — Azure-Commercial-Kalkulator für Subscription-Region}* |
| **Lizenz-Bundle** | Defender-for-Cloud-Plan „AI services" (Azure-Consumption) · Defender XDR in M365 E5 / M365 E5 Security / Defender XDR Standalone-SKU · Copilot-Studio-extended-RTP braucht Defender for Cloud Apps-Connector |
| **Voraussetzung** | Azure-Subscription (für Azure-Seite) · M365-Tenant + Defender XDR (für Agent-Seite) · [[Agent 365]]-Lizenz pro geschütztem Agent (für Agent-365-RTP) · Owner-Rolle (Azure-Plan-Enable) / Security Administrator (XDR-Toggles) |
| **Region-Verfügbarkeit** | **Nur Commercial Clouds** — **nicht** in Azure Government, Azure 21Vianet (China), AWS-Connected-Accounts. EU-Kunden: verfügbar, aber Data-Residency für Alert-Speicherung in Defender for Cloud explizit prüfen |
| **CSP-Promo / Discounts** | Keine öffentlich bekannten Early-Adopter-Rabatte; Defender-XDR-Bundles über CSP erhältlich |
| **Hidden Costs** | **Token-Billing kann überraschen** — 75 Mrd. Token sind viel, aber bei Copilot-Flotten schnell verbraucht; Wallet-Attack-Simulation im Test kann versehentlich Trial verbrauchen · **Image-/Audio-Tokens werden NICHT gescannt** (text-only in dieser Phase) — multimodale Agents sind unterbelichtet · **Azure Government + China-Cloud + AWS-Connected** nicht unterstützt |
| **Upgrade-Pfad** | Kunde ohne Defender-XDR: E3 → E5 Security (Purview + Defender + Entra-Basis) oder Defender-XDR-Standalone; Azure-Seite separat per Subscription-Plan-Toggle |

---

## Kernkonzept

### Was es im Kern ist

**„Defender for AI" ist kein einheitlich gebrandetes Produkt** — es ist eine **funktionale Klammer um zwei technisch getrennte Offerings**, die Microsoft gemeinsam vermarktet:

1. **Defender for Cloud — Threat Protection for AI Services** (Azure-Seite, GA). Ein **Subscription-Level-Plan** im Defender-for-Cloud-Portfolio, der Azure-OpenAI- und Foundry-Model-Deployments instrumentiert. Mechanik: Prompts + Responses werden durchsucht (integriert mit **[[Azure AI Content Safety]] Prompt Shields** + Microsoft Threat Intelligence) und bei Detection werden Alerts in Defender for Cloud erzeugt, die **in den Defender-XDR-Portal-Unified-Alert-Stream** fließen.

2. **Defender XDR — Security for AI Agents** (Agent-Seite, Preview Stand 2026-04). Ein **XDR-Feature-Set**, das an [[Agent 365]] angedockt ist: Real-Time Protection via **Agent Tooling Gateway (ATG)** evaluiert Tool-Invocations *bevor* sie laufen und blockt bei hoher Confidence (Exfil-Attempts, internal-only-Tool-Missbrauch, Credential-Leak via externe API/E-Mail, ASCII-Smuggling). Parallel läuft **Near-Real-Time Detection** auf Agent-Audit-Logs (persistent-Jailbreak-Attempts, suspicious Execution, Recon-Verhalten). Incidents werden im XDR-Portal neben Endpoint/Identity/Office-Alerts korreliert.

Die **Seele**: Detection wird da gemacht, wo die Telemetrie anfällt — Azure-OpenAI-API-Layer (Defender for Cloud) + Agent-Tooling-Gateway / Agent-Audit-Logs (Defender XDR) — und wird **an einer Stelle** (Defender XDR Portal) konsolidiert. Das ist architektonisch sauber, aber für Kunden verwirrend, weil **zwei Aktivierungen** nötig sind: subscription-level + tenant-level.

Die **fundamentale Wette**: Prävention alleine reicht nicht — **Runtime-Evaluation von Tool-Calls** und **statistische Anomalie-Erkennung über Agent-Verhalten** fangen Angriffe, die Prompt Shields durchrutschen lässt (z.B. indirekte Prompt-Injection aus geschäftlichem SharePoint-Content, wo der String selbst harmlos aussieht).

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Prevention Layer** | Blockt schlechte Prompts *vor* Modell-Call (Prompt Shields, Content-Filter) | [[Azure AI Content Safety]] — **komplementär**, nicht Teil von Defender |
| **Runtime Block (Agent)** | Evaluiert Tool-Invocations, blockt Aktionen *bevor* sie laufen | Defender XDR + [[Agent 365]] **Agent Tooling Gateway** |
| **Runtime Detection (Modell)** | Scannt Prompts + Responses gegen Azure OpenAI / Foundry Models | Defender for Cloud — AI services Plan |
| **Near-Real-Time Detection (Agent)** | Analysiert Agent-Audit-Logs auf Muster (persistent Jailbreaks, Recon) | Defender XDR — Security for AI Agents |
| **Alert Correlation / Incident** | Konsolidiert + korreliert mit User-Risk, Endpoint, Identity, Office | Defender XDR (unified portal) |
| **Investigation / Hunting** | KQL-Abfragen über `AlertInfo`, `CloudAppEvents`, `AIAgentsInfo`, `AlertEvidence` | Defender Advanced Hunting |
| **Response / Automation** | Disable User, Block File, Quarantine Device, Custom Playbook | Defender XDR + Microsoft Sentinel (für Extended Playbooks) |

### Kern-Fähigkeiten

#### 1. Runtime-Block via Agent Tooling Gateway (Agent-Seite)

Defender XDR integriert direkt mit [[Agent 365]]s **Agent Tooling Gateway (ATG)**. Bevor ein Agent ein Tool aufruft (API-Call, File-Write, E-Mail-Send), evaluiert Defender die Invocation. Bei **High-Confidence-Risiko** wird die Aktion **in-flight geblockt** und ein Alert generiert. Block-Trigger:

- Versuche, System-Instructions / interne Tool-Details zu extrahieren
- Direkte Sensitive-Data-Leak-Versuche
- Missbrauch von internal-only-Tools
- Routing zu untrusted/malicious-Destinations
- Obfuskierte / hidden Instructions (ASCII Smuggling)
- Credential-Leakage über legitime Kanäle (E-Mail, externe API)

**Wichtige Einschränkung**: ATG-RTP evaluiert **Tool-Invocations**, **nicht rohe Prompts/Responses** außerhalb des Tool-Execution-Paths. Für Prompt-Level-Schutz → [[Azure AI Content Safety]] + Defender-for-Cloud-Alerts. **Extended RTP** gibt es für **Copilot-Studio-Agents** zusätzlich (via Defender-for-Cloud-Apps-Connector).

#### 2. Defender for Cloud Alert-Katalog (Azure-Seite, GA)

Aktuell **14+ GA-Alerts + mehrere Preview** für Azure-OpenAI-/Foundry-Model-Deployments, inkl.:

| Alert-Typ | Severity | MITRE-Taktik | SMB-Relevanz |
|-----------|----------|--------------|--------------|
| Credential Theft in Model Response | Medium | Credential Access, Lateral Movement, Exfiltration | **Hoch** — PII/Secrets-Leak |
| Jailbreak Blocked/Detected (Prompt Shields) | Medium | Privilege Escalation, Defense Evasion | **Hoch** — Red-Flag für Agent-Compromise |
| ASCII Smuggling (Indirect Prompt Injection) | **High** | Impact | **Hoch** — indirekt via Dokumente |
| Phishing URL in Model Response | **High** | Impact (Defacement) | **Hoch** — Agent als Phishing-Vehikel |
| Suspected Wallet Attack (recurring + volume anomaly) | Medium | Impact | **Hoch** — Azure-Cost-Schutz |
| Anomalous Tool Invocation | Low | Execution | Mittel — Custom-Agent-Misuse |
| (Preview) Sensitive Data Mentioned out of Pattern | Medium | Collection | **Hoch für DSGVO** |
| (Preview) LLM Reconnaissance Attempt | Low | Reconnaissance | Frühwarnung vor Injection |
| Access from Tor / Suspicious IP / Suspicious User-Agent | High/Medium | Execution, Initial Access | Infrastruktur-Layer |
| (Preview) Malicious Content in Uploaded AI Model | **High** | — | Bei Model-Upload-Flows |

**Preview Agent-spezifische Alerts** (Foundry Agent Service): Agentic Jailbreak (blocked/detected), Agentic ASCII Smuggling, Agentic Instruction Prompt Leak, Agentic Recon, Agentic Wallet Attack, Agentic Malicious URL (User Prompt / Model Response / Tool Output).

**Kritische Limitierung**: **Text-Tokens only** — image/audio-Tokens werden **nicht** gescannt (Stand 2026-04).

#### 3. M365-Copilot UPIA/XPIA Detection (Defender XDR + Cloud Apps)

Defender XDR surfaced out-of-the-box Detections für:

- **UPIA (User Prompt Injection Attack)**: User versucht direkt Copilot zu manipulieren („Ignore previous instructions…")
- **XPIA (Cross-Prompt Injection Attack)**: malicious Content in externem Dokument (typ. SharePoint-File), das Copilot verarbeitet

Surfacing via **`CloudAppEvents`**-Tabelle mit Flags `JailbreakDetected == true` (UPIA) und `XPIADetected == true` (XPIA mit Referenz auf das malicious File). Alerts ab 2025-10 GA für breite Copilot-Kundschaft. SOC kann via XDR-Incident-Graph den User disablen, File quarantieren und in AlertEvidence die Kette nachverfolgen.

#### 4. Near-Real-Time Agent-Detection + Advanced Hunting

Für Agent-365-managed-Agents analysiert Defender kontinuierlich Telemetrie, Tool-Usage, Execution-Patterns. Typische Detections: *persistent jailbreak attempts*, *suspicious user activity involving jailbreak*, *suspicious agent execution*. Alerts landen mit Incident-Korrelation im Portal. **Hunting-Tabellen**:

| Tabelle | Inhalt | Use Case |
|---------|--------|----------|
| `AIAgentsInfo` | Agent-Inventory + Config (Identity, Platform, Owner, Tools, Knowledge Sources) | Posture-Review, misconfigured Agents finden |
| `CloudAppEvents` | M365-Audit-Logs inkl. Agent-Actions, Tool-Invocations, Data-Access | Root-Cause, UPIA/XPIA-Hunting |
| `AlertInfo` | Alert-Metadaten inkl. AI-Alerts | Alert-Triage, Pivot zu Entitäten |
| `AlertEvidence` | Entities/Artifacts einer Alert (Agent, User, Tool, URL) | Blast-Radius-Analyse |

Für Custom-MAF-Agents: **Agent-365-SDK integrieren**, damit Agent Audit-Logs an M365 emittiert — **nicht automatisch**. Copilot-Studio-Agents tun das by default.

#### 5. AI Agent Inventory + Posture Management

Dedizierte Inventory-UI unter **Assets → AI Agents** im Defender Portal. Discovered Agents aus **Copilot Studio, Microsoft Foundry, AWS Bedrock, GCP Vertex AI** (die **Non-Azure-Cloud-Abdeckung** ist ein starkes Abgrenzungs-Argument gegen reine Azure-Tools). Für Foundry-Agents auch Security-Posture-Recommendations (→ konsumiert AI-Security-Recommendations aus Defender for Cloud). Für Copilot-Studio-Agents **nur Discovery, keine Posture-UI** (Stand 2026-04) — Posture via Advanced Hunting / Prebuilt AI-Agents-Queries.

### Typischer Workflow

1. **Onboarding (Security-Admin, Tag 1–2)** — Azure: Defender-for-Cloud-Plan „AI services" per Subscription aktivieren (Owner-Rolle) · Prompt-Evidence-Feature enable · RBAC setzen · 30-Tage-Trial-Budget klären. M365: Defender-Portal → System → Settings → Security for AI agents Toggle → Agent 365 + Copilot Studio verbinden.
2. **Audit-Log-Pipeline (Tag 3–4)** — M365-App-Connector in Defender for Cloud Apps aktivieren. Für Custom-MAF-Agents: Agent-365-SDK integrieren (Dev-Arbeit, nicht Konfig) — ohne diesen Schritt **keine Near-Real-Time-Detection** für Custom-Agents.
3. **Alert-Tuning + Playbook (Woche 2–3)** — Alerts in Defender-XDR-Portal-Queue sichten, typische False-Positives identifizieren (Security-Testing-Red-Teams lösen Jailbreak-Alerts aus — Suppression-Rules setzen). Standard-Playbooks: (a) Credential Theft → User disablen + Passwort-Reset · (b) XPIA → SharePoint-File quarantieren + User benachrichtigen · (c) Wallet-Attack → Azure-OpenAI-Resource temporär drosseln.
4. **Hunting-Runbook (Woche 3–4)** — 3–5 KQL-Queries vorbereiten (z.B. „alle XPIA-Events letzte 7 Tage je SharePoint-Site", „Agent-Instances ohne Owner", „Anomalous Tool Invocations pro Agent").
5. **Sentinel-Integration (optional, Woche 4+)** — wenn Kunde Sentinel hat: AI-Alerts in Workbook einbinden, Automation-Rules für High-Severity (Auto-Disable-User) anlegen.
6. **Betrieb** — wöchentliches Alert-Review (SOC-Analyst, 2h) · monatliches Agent-Inventory-Review (Owner-Map, Shadow-Agents) · quartalsweises Red-Team-Testing (bewusst Jailbreaks auslösen, Detection validieren).

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | KQL-Fortgeschritten (4 Advanced-Hunting-Tables) · MITRE-ATT&CK-AI-Matrix-Kenntnisse · Defender-for-Cloud-Plan-Konfiguration · Agent-365-SDK-Integration (Python/C#) für Custom-Agent-Onboarding |
| **Admin beim Kunden** | Security Administrator (Defender-XDR-Toggles) · Azure Owner (Defender-for-Cloud-Plan) · Compliance Administrator (für Sentinel-Pipeline) |
| **SOC-Analyst beim Kunden** | Defender-XDR-Portal-Routine · KQL-Basis · AI-spezifisches Threat-Modeling (Prompt Injection vs. Jailbreak vs. XPIA vs. ASCII Smuggling) |
| **End-User** | Keine — läuft transparent, aber Awareness für „Agent-Antwort wurde geblockt" ist nützlich (Helpdesk-Ticket-Handling) |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Image-/Audio-Token-Scanning** — nur Text-Tokens werden inspiziert (Stand 2026-04) | Multimodale Agents: präventiv via [[Azure AI Content Safety]] mit Image-Moderation; Text-Response-Path weiter schützen |
| **Azure Government / 21Vianet / AWS-Connected-Accounts** | Für Azure-Gov: lokale SIEM-Pipeline bauen (Sentinel-Gov); für AWS-gehostete Workloads: AWS Bedrock Guardrails + Import via Defender-XDR-AI-Agents-Inventory (Discovery, kein Block) |
| **Non-Microsoft-LLMs** (OpenAI direkt, Anthropic, Gemini ohne Foundry-Wrapper) | Über [[APIM AI Gateway]] proxiieren, oder [[Microsoft Purview]] DSPM-for-AI für Audit-Visibility (nicht Runtime-Block) |
| **Prompt-/Response-Level-Runtime-Block im Agent-Path** — ATG blockt nur Tool-Invocations | Content Safety Prompt Shields als Vor-Filter |
| **Copilot-Studio-Posture-UI** — aktuell nur Discovery, kein Posture-Score | Advanced-Hunting-KQL über `AIAgentsInfo`-Tabelle + Prebuilt-AI-Agents-Queries |
| **GA-Sicherheit für XDR-Agent-Teil** — Preview-Status 2026-04-22 | Für regulierte Prüfung: GA-Roadmap explizit beim MS-AE erfragen, bis dahin Sentinel-basierte Custom-Detection als Fallback |
| **Custom-MAF-Agent-Auto-Onboarding** — braucht SDK-Integration | Dev-Aufwand einplanen (2–5 Tage/Agent) — nicht mit Copilot-Studio-Auto-Onboarding verwechseln |

### Typische Fallstricke

- **„Wir haben Content Safety, wozu Defender for AI?"** — Content Safety ist Präventions-Filter *vor* dem Modell; Defender ist Runtime-Detection + Response *um* das Modell + Agent. Wer nur Content Safety hat, sieht Jailbreak-Versuche, die durchrutschen, **nicht im SOC**. *Gegenmittel: Kombi-Architektur-Slide im Erstgespräch, „Prompt Shields = Türsteher, Defender = Kamera".*
- **Token-Trial-Verbrauch durch Red-Teaming** — Wallet-Attack-Simulation oder Jailbreak-Testing im PoC kann die 75-Mrd.-Token-Free-Tier schnell aufbrauchen; dann schlägt Billing ohne Warning zu. *Gegenmittel: dediziertes Test-Subscription mit eigenem Defender-Plan, Budget-Alert auf Consumption.*
- **Custom-Agents ohne Agent-365-SDK** — Kunde glaubt, Defender-for-AI-Agents-Toggle aktiviert → alles geschützt. In Wirklichkeit bekommen nur Copilot-Studio-Agents + Agent-365-integrierte-MAF-Agents Near-Real-Time-Alerts; rohe MAF-Agents ohne SDK-Audit-Log-Emission sind blind. *Gegenmittel: Agent-Onboarding-Checkliste mit SDK-Integrations-Check.*
- **Preview-Status unterschätzen** — SOC-Teams bauen Runbooks auf Preview-Alerts (Agentic-Jailbreak etc.), die sich im Schema noch ändern können. *Gegenmittel: für GA-relevante Compliance-Nachweise nur GA-Alerts (Defender-for-Cloud-AI-Services) nutzen; Preview-Alerts als „additional signal", nicht „primary control".*
- **Image-/Audio-Blindspot** — Multimodale Copilot-Nutzung (Bild-Upload, Audio-Transcript) läuft am Defender-Scanning vorbei. *Gegenmittel: explizit im Risk-Register dokumentieren; bei hohen Anforderungen Multimodal-Use-Cases throtteln.*
- **XPIA via SharePoint — Oversharing-Unterschätzung** — XPIA-Alert zeigt das malicious File; wenn der Kunde keinen Oversharing-Governance-Baseline (Sensitivity Labels via [[Microsoft Purview]]) hat, ist Alert ohne Response-Werkzeug. *Gegenmittel: Purview-DLP + Sensitivity-Labels als **Prereq** für effektive XPIA-Response.*
- **Retention-Gap bei Audit-Logs** — Defender-for-Cloud-Alerts werden in Azure Log Analytics gespeichert (Retention je Workspace-Setting); Agent-Audit-Logs via M365-Unified-Audit-Log (180 Tage Standard, Premium bis 10 Jahre in E5). *Gegenmittel: Sentinel-Export für Langzeit-Retention.*
- **Region-/Data-Residency-Überraschung** — Defender for Cloud speichert Alerts in Azure-Region des Defender-Plans; kann von Workload-Region abweichen. *Gegenmittel: EU-Kunden: Plan in EU-Region aktivieren, separat prüfen.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Azure AI Content Safety]]** | Prompt Shields liefern Jailbreak/Injection-Signale als Alert-Quelle für Defender for Cloud | GA | Content Safety = Prävention, Defender = Detection — muss architektonisch klar sein |
| **[[Agent 365]]** | Agent Tooling Gateway (ATG) ist der Runtime-Block-Hook; Agent-Identity = primäres Alert-Subjekt | Preview (Agent-Teil) → GA 2026-05-01 | SDK-Integration für Custom-Agents erforderlich; RTP nur für Agent-365-managed-Agents |
| **[[Microsoft 365 Copilot]]** | UPIA/XPIA-Detection in `CloudAppEvents` + Defender-XDR-Alerts | GA (seit 2025-10) | Braucht Defender-for-Cloud-Apps Office-Connector; Block erfolgt über Copilot-Runtime selbst, Defender surfact nur |
| **[[Copilot Studio]]** | Extended-RTP via Defender-for-Cloud-Apps-Connector; Agent-Inventory | Preview | Extra Toggle, nicht default |
| **Microsoft Foundry Agent Service** | Agent-Alerts (Agentic Jailbreak, Instruction Leak, Recon etc.) | Preview | In `ai-onboarding`-Pfad aktivieren |
| **[[Microsoft Purview]]** | IRM-Signale (Risky AI Usage Policy) + XPIA-Flags in Audit; Purview-DSPM-for-AI als Risk-Kontext | GA | Cross-Portal-Korrelation zwischen Purview-Portal und Defender-Portal nicht nahtlos — beide prüfen |
| **[[Entra Agent ID]]** | Agent-Identity als Alert-Subjekt; User-Risk-Korrelation | GA | — |
| **Microsoft Sentinel** | Alert-Export + Automation-Playbooks (Logic-Apps-basiert) | GA | Separate Azure-Consumption; Incident-Deduplikation konfigurieren |
| **Defender for Cloud Apps** | Office-Connector-Pipeline für Copilot-Events + Copilot-Studio-Agent-Inventory | GA | Separate License-Prüfung |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **AWS Bedrock** | Agent-Inventory-Discovery + Security-Posture-Recommendations | Preview | Discovery, **kein Runtime-Block** — Block via Bedrock Guardrails separat |
| **GCP Vertex AI** | Agent-Inventory-Discovery | Preview | Wie AWS Bedrock — Discovery only |
| **OpenAI direkt / Anthropic / andere externe LLMs** | — | **Nicht supported** | Via APIM-AI-Gateway proxiieren oder Custom-Connector |
| **SIEM non-Sentinel (Splunk, QRadar)** | Alert-Export via Graph-API / CEF | GA | Custom-Integration, kein First-Party-Connector |

### APIs / Protokolle

- **Microsoft Graph Security API** für Alert-Export
- **Defender for Cloud REST API** für Plan-Management + Alert-Retrieval
- **KQL** (Kusto Query Language) als Haupt-Abfrage-Interface in Advanced Hunting
- **Agent-365-SDK** für Custom-Agent-Audit-Log-Emission (C#/Python)
- **Office 365 Management Activity API** für Copilot-Events-Export

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Alerts werden in Azure-Region des Defender-Plans gespeichert; EU Data Boundary für M365-Audit-Logs aktiv; **explizit prüfen** für Azure-Defender-for-Cloud-Plan-Region |
| **Prompts & Outputs** | Bei aktivierter **Prompt Evidence** werden verdächtige Prompt-Snippets in Alerts gespeichert — kann PII enthalten. Consent + Retention-Setting prüfen. Keine Verwendung für Modell-Training |
| **DPA** | Standard-MS-DPA deckt Defender for Cloud + Defender XDR ab |
| **EU-AI-Act** | Defender for AI **selbst** = Governance-/Detection-Tool (limited risk); liefert Bausteine für Art.-9-Risk-Management-System für überwachte AI-Workloads — Classification des überwachten Systems bleibt Kunden-Verantwortung |

### Microsoft-Compliance-Stack

Defender for AI ist die **Runtime-Detection-Schicht** im Stack:
- **Prävention**: [[Azure AI Content Safety]] (Prompt Shields, Content-Filter)
- **Data Governance**: [[Microsoft Purview]] (Labels, DLP, DSPM-for-AI — welche Daten darf der Agent sehen)
- **Identity**: [[Entra Agent ID]] + Conditional Access (wer/was darf den Agent auslösen)
- **Runtime-Detection + Response**: **Defender for AI** (das hier)
- **SOC-Workflows + Automation**: Defender XDR + Microsoft Sentinel

### Bekannte Compliance-Lücken

- **Prompt Evidence kann PII enthalten** — datenschutzrechtliche Prüfung vor Aktivierung empfehlen (Art. 6 + 9 DSGVO); Pseudonymisierung nicht automatisch.
- **Non-Azure-LLMs-Blindspot** — DSGVO-Nachweispflicht „welche Daten wurden verarbeitet" lückenhaft, wenn Shadow-IT-LLM-Nutzung läuft.
- **Token-basiertes Billing erschwert Kosten-Forecasting** für fixe Budget-Kunden.
- **Multimodal-Content-Blindspot** (Image/Audio) — bei Compliance-kritischen Multimodal-Agents expliziter Risk-Eintrag nötig.
- **Preview-SLA-Unsicherheit** für Agent-365-RTP — für regulierte Produktion GA-Zeitpunkt explizit beim MS-AE bestätigen lassen.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs | Defender for Cloud — AI Threat Protection Overview | https://learn.microsoft.com/en-us/azure/defender-for-cloud/ai-threat-protection | 2026-04-22 | GA-Status, Billing-Modell |
| Docs | Alerts for AI Services (full list) | https://learn.microsoft.com/en-us/azure/defender-for-cloud/alerts-ai-workloads | 2026-04-22 | Alert-Katalog, MITRE-Mapping |
| Docs | Enable Threat Protection for AI Services | https://learn.microsoft.com/en-us/azure/defender-for-cloud/ai-onboarding | 2026-04-22 | Onboarding-Schritte |
| Docs | Detect, Block, Investigate AI Agent Threats (Defender XDR) | https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/ai-agent-detection-protection | 2026-04-22 | ATG-RTP + NRT-Detection |
| Docs | AI Agent Inventory (Defender XDR) | https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/ai-agent-inventory | 2026-04-22 | Discovery + Posture |
| Docs | Protect AI Agents | https://learn.microsoft.com/en-us/defender-xdr/ai-agent-inventory | 2026-04-22 | Agent-Cover-Matrix |
| Docs | AI Security Recommendations | https://learn.microsoft.com/en-us/azure/defender-for-cloud/recommendations-reference-ai | 2026-04-22 | Posture-Hardening |
| Tech Blog | How Defender Detects Prompt Injection in M365 Copilot | https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/how-microsoft-defender-helps-security-teams-detect-prompt-injection-attacks-in-m/4457047 | 2026-04-22 | UPIA/XPIA-Konzepte |
| Tech Blog | Protecting Azure AI Workloads with Threat Protection | https://techcommunity.microsoft.com/blog/microsoftdefendercloudblog/protecting-azure-ai-workloads-using-threat-protection-for-ai-in-defender-for-clo/4378474 | 2026-04-22 | Azure-Seite Deep-Dive |
| Tech Blog | Copilot Studio Agent Security — Top 10 Risks | https://www.microsoft.com/en-us/security/blog/2026/02/12/copilot-studio-agent-security-top-10-risks-detect-prevent/ | 2026-04-22 | Misconfig-Patterns |
| Tech Blog | Investigating M365 Copilot Activity with Sentinel & Defender XDR | https://techcommunity.microsoft.com/blog/microsoft-security-blog/investigating-m365-copilot-activity-with-sentinel--defender-xdr/4442641 | 2026-04-22 | SOC-Runbooks |
| Pricing | Defender for Cloud Pricing | https://azure.microsoft.com/en-us/pricing/details/defender-for-cloud/ | 2026-04-22 | Token-Rate |
| MSRC Blog | How Microsoft Defends Against Indirect Prompt Injection | https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks | 2026-04-22 | XPIA-Defense-in-Depth |

### Secondary (Analysten)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Directions on Microsoft — Defender Cloud Apps for Copilot Studio | https://www.directionsonmicrosoft.com/reports/defender-for-cloud-apps-helps-protect-copilot-studio-agents/ | 2026-04-22 | Lizenz-Klarheit für SMB |
| SAMexpert — Defender Experts Suite Licensing | https://samexpert.com/microsoft-defender-experts-suite-licensing-pricing/ | 2026-04-22 | Bundle-Verhältnisse |
| ARMO Blog — Defender for Cloud vs Specialized AI Runtime Tools | https://www.armosec.io/blog/ai-workload-security-azure-defender-vs-specialized-solutions/ | 2026-04-22 | Konkurrenz-Einordnung |
| Jeffrey Appel — AI Workload Threat Protection Deep-Dive | https://jeffreyappel.nl/ai-workload-threat-protection-in-microsoft-defender-for-cloud/ | 2026-04-22 | Praktiker-Sicht |
| Marco Gerber — Defender for Cloud Threat Protection for AI | https://marcogerber.ch/defender-for-cloud-threat-protection-for-ai-workloads/ | 2026-04-22 | CH-Fokus |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Agent-365 GA + Defender-for-AI-Agents GA-Roadmap; neue Alert-Typen |
| RSA Conference 2026 | Apr 2026 | AI-Threat-Detection-Updates, MITRE-Atlas-Erweiterungen |
| Microsoft Ignite 2026 | Nov 2026 | nächste Generation AI-Security, Multimodal-Detection-Roadmap |

---

## UNCLEAR / TODO

1. Exakte $/M-Token-Rate für Defender for AI Services nach Trial (nur via Azure-Pricing-Calculator zu ermitteln)
2. GA-Datum für Defender XDR „Security for AI Agents" (Agent-365-RTP-Teil) — aktuell Preview, GA-Timing an Agent-365-GA 2026-05-01 gekoppelt?
3. Image-/Audio-Token-Scanning-Roadmap (aktuell text-only)
4. EU-Data-Residency für Prompt-Evidence-Storage — in welcher Region genau
5. SLA-Zusagen für Preview-Alerts vs. GA-Alerts (Response-Zeit, Verfügbarkeit)
6. Integrationstiefe mit non-MS-LLMs via APIM AI Gateway — first-party-Detection oder nur Proxy-Log-Mining?

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Defender for AI: Coverage (Defender for Cloud AI Services GA + Defender XDR Security for AI Agents Preview), Detection-Methoden (RTP via ATG, NRT Near-Real-Time, Alert-Katalog), Incident-Workflow, Abgrenzung zu Content Safety + DSPM + Agent 365 | https://learn.microsoft.com/en-us/defender-xdr/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
