---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [VS Code AI Toolkit, Foundry Toolkit for VS Code, GitHub Copilot, Copilot Cloud Agent, azd AI, Visual Studio 2026 AI]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Microsoft AI Developer Tooling

*Bündel-Note für die vier **Developer-facing AI-Tools** im Microsoft-Stack, die Journai **intern** zum Bauen von MAF-Agents und Foundry-Projekten einsetzt (bzw. evaluiert): **Visual Studio 2026** (AI-native, GA 11/2025), **Foundry Toolkit for VS Code** (ehem. AI Toolkit, GA 03/2026), **GitHub Copilot Cloud Agent** (ehem. Coding Agent, GA 09/2025) und **azd AI Agent Extension** (GA 12/2025). Primär **internes Produktivitäts-Tooling** — nicht Kunden-Thema, aber Team-Enablement- und Angebots-relevant.*

> **Analogie:** Wie früher „Office für Entwickler" — Microsoft verwebt den AI-Build-Zyklus (Prompt-Tuning → Code → Deploy → autonome Tasks) in IDE und CLI, so dass der Portal-Kontext-Switch ins `ai.azure.com` nur noch für Admin-Tasks nötig ist.

---

## Einsatz

### Job-to-be-done

When I als Journai-Entwicklerin einen Foundry-Agent oder eine MAF-Multi-Agent-App baue, I want to Prompt-Experimente, Code, Deploy und Review in einem Toolchain-Stack ohne Portal-Klicks erledigen, so I can ein reproduzierbares Delivery-Setup für SMB-Projekte etablieren, das pro Kunde aus einem Template-Repo hochgezogen wird.

### Trigger-Signale (intern)

- „Welches Tooling setzen wir als Journai-Standard für neue Foundry-Projekte an?"
- „Lohnt sich GitHub Copilot Enterprise ($39/Seat) für unser 5-Personen-Team oder reicht Business ($19)?"
- „Wer übernimmt eigentlich das Scaffolding — der Senior per Hand oder `azd ai agent init`?"
- „Können wir den VS 2026 Debugger Agent nutzen, um MAF-Workflow-Bugs schneller zu reproduzieren?"

### Einsatz-Szenarien

1. **Prompt-/Agent-Prototyp vor dem Code** — Foundry Toolkit for VS Code: Agent Builder (low-code), Model Playground gegen 100+ Modelle (Foundry, OpenAI, Anthropic, Google, Ollama), „Export to Code" → Python/.NET-Gerüst mit MAF-Scaffolding. Journai-Einsatz: jeder neue Kunden-Use-Case startet hier vor der `AIProjectClient`-Implementierung.
2. **Pro-Code MAF in Visual Studio 2026** — .NET-Entwicklung mit Debugger Agent (reproduziert Bugs gegen Live-Runtime), Profiler Agent, Agent Skills aus Repo. Journai-Einsatz: nur wenn Kunde .NET-Stack vorgibt — Python-Default bleibt VS Code.
3. **Infrastruktur + Deploy in einem Schritt** — `azd init -t Azure-Samples/azd-ai-starter-basic` + `azd ai agent init -m <yaml>` + `azd up`: Bicep-IaC, Foundry-Project, Model-Deployment, Container-Registry und Agent-Application in 5–10 Minuten. Journai-Einsatz: Standard-Starter für jedes neue Kunden-Repo.
4. **Autonome Issue-Automation intern** — GitHub Copilot Cloud Agent auf Journai-internen Repos: Label-gesteuertes Issue-Triage, Doku-PRs, Dependency-Bumps. **Nicht** für Kunden-Production (Compliance-Frage nicht geklärt).

### Voraussetzungen beim Kunden

*Diese Note ist primär **intern** — „Kunde" = Journai-Team. Wenn wir Tooling zum Kunden bringen, gilt:*

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline (Journai intern)** | VS-Subscription (MSDN Professional oder Enterprise für VS 2026), GitHub Copilot Business (~$19/Seat/mo für Cloud Agent + Business-Features) |
| **Lizenz-Baseline (Kundenübergabe)** | Kunde braucht **nichts** von dieser Liste — die Tools laufen auf unserer Seite, das Deployment-Artefakt ist Azure/Foundry beim Kunden |
| **Tenant / Infrastruktur** | Für `azd up`: Azure-Subscription mit Foundry-fähigen Regionen. **Hosted Agents aktuell nur North Central US** — EU-Region-Lock für Foundry Agent Service bleibt die Hauptbremse (siehe [[Foundry Agent Service]]) |
| **Skills / Rollen** | Python oder C#, Bicep-Grundverständnis, Entra-Auth (`DefaultAzureCredential`-Pattern aus [[Foundry SDKs]]) |
| **Compliance-Rahmen** | GitHub Copilot Business/Enterprise: EU-Data-Residency für Copilot-Prompts verfügbar (Enterprise Cloud); Cloud Agent im Ent.-Cloud ab 08/2025 mit Data Residency |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung (intern)** | 0,5 Tag pro Dev für Tool-Kette inkl. Auth-Flows |
| **Laufende Lizenzkosten (intern)** | VS-Subscription ~1'500–3'000 EUR/User/Jahr (Prof./Ent., Schätzung via CSP) · Copilot Business ~$228/User/Jahr · Copilot Enterprise $468/User/Jahr · Foundry Toolkit + azd = kostenfrei |
| **Laufender Betrieb** | Monatliches Update-Fenster: Foundry Toolkit released monatlich (Jan/Feb/Mär 2026), `azd` ebenfalls monatlich, VS 2026 18.5 Kadenz |

### Empfehlung

- 🟢 **Foundry Toolkit for VS Code** — für alle Journai-Devs als Standard; kostenfrei, ersetzt Portal-Playground.
- 🟢 **azd AI Agent Extension** — als Pflicht-Bestandteil jedes neuen Kunden-Repos; liefert reproduzierbares IaC-Starter.
- 🟢 **GitHub Copilot Business** ($19/Seat) — für das gesamte Team; Business-Stufe reicht (Audit-Log, IP-Indemnity, 300 Premium-Requests). Enterprise ($39) nur wenn Org-Codebase-Indexing + 1'000 Requests nötig.
- 🟡 **GitHub Copilot Cloud Agent auf Kunden-Repos** — beobachten; für interne Journai-Repos grünes Licht, für Kunden erst nach Compliance-Klärung (MCP-Remote-OAuth fehlt noch).
- 🟡 **Visual Studio 2026** — nur für .NET-Projekte; Python-Team bleibt bei VS Code. Copilot **nicht** in VS-Subscription enthalten — muss separat lizenziert werden.

**Nächster Schritt für Journai:** (1) Foundry Toolkit + `azd ai` in Onboarding-Guide aufnehmen, (2) Template-Repo `journai-foundry-starter` mit `azd-ai-starter-basic` + MAF + Evaluation-Suite als Journai-Fork, (3) Cloud-Agent-Pilot auf `journai-wiki`-Repo (diesem hier) bis Q3/2026 — Label `copilot-candidate` für Auto-PRs.

---

## Status & Pricing (Übersicht)

| Tool | Status | GA-Datum | Preis (USD) | Lizenz-Bundle |
|------|--------|----------|-------------|---------------|
| **Visual Studio 2026** (v18) | GA | 11.11.2025, 18.5 am 14.04.2026 | im VS-Subscription enthalten (MSDN Pro/Ent.); Community kostenfrei für OSS/SMB | VS Subscriptions |
| **Foundry Toolkit for VS Code** (ehem. AI Toolkit) | GA | 03/2026 (Marketplace: `ms-windows-ai-studio.windows-ai-studio`) | kostenfrei | VS Code Extension |
| **GitHub Copilot Cloud Agent** (ehem. Coding Agent) | GA | 09/2025; Q2/2026-Updates: 50 % schnellerer Start (19.03.2026), Custom-Properties (15.04.2026), MCP-Support | Pro $10, Pro+ $39, Business $19, Enterprise $39 pro User/Monat · Overage $0.04/Premium-Request | Copilot-Subscription (nicht VS!) |
| **azd AI Agent Extension** (`azure.ai.agents`) | GA | 12/2025 (Dec 2025 Rebranding), März-2026-Release mit Local-Run + Debug | kostenfrei | Azure Developer CLI (openssl-MIT) |

**Wichtig:** GitHub Copilot ist **nicht** im VS-Subscription-Preis enthalten — das ist der häufigste Pricing-Missverständnis. Wer VS 2026 Enterprise hat, muss Copilot separat kaufen.

---

## Kernkonzept — vier Tools, ein Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  Foundry Toolkit (VS Code) — PROMPT/AGENT-PROTOTYP              │
│  Agent Builder (low-code) · Model Playground · Evaluation       │
│  → „Export to Code" generiert MAF-Scaffold                      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  VS Code + GitHub Copilot (Python-Team)                         │
│  ── oder ──                                                     │
│  Visual Studio 2026 + Copilot (.NET-Team)                       │
│  Ghost/Inline-Completions · Agent Skills · Debugger Agent       │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  azd AI Agent Extension — IaC + DEPLOY                          │
│  azd init -t azd-ai-starter-basic                               │
│  azd ai agent init -m <yaml>                                    │
│  azd up  (Bicep + Foundry-Project + Model + Container + Agent)  │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Copilot Cloud Agent — AUTONOME FOLGE-TASKS              │
│  Issue-assign → GitHub-Actions-Sandbox → PR → Tests → Review    │
│  MCP-Tools · Agent Skills · Custom Agents via YAML              │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Studio 2026 AI-native

- **GA-Release 11.11.2025** als „erstes Intelligent Developer Environment"; 18.5 am 14.04.2026 mit AI-Debugging-Tiefenintegration.
- **Debugger Agent**: Agentic Bug Resolution — validiert Bugs gegen Live-Runtime, instrumentiert App, isoliert Root-Cause, validiert Fix. Für MAF-Multi-Agent-Bugs (Orchestration-Races) nützlich.
- **Profiler Agent**: hebt Performance-Bottlenecks hervor, schlägt Fixes vor.
- **Agent Skills**: Copilot-Agents in VS entdecken und nutzen Skills aus Repo/User-Profil automatisch — dasselbe Skill-Format wie Copilot CLI + Coding Agent.
- **Cloud Agent Preview** auch in VS 2026 integriert (November-Update).
- **„Ghost Completions"** als Begriff kommt in Microsoft-Docs nicht explizit vor — was gemeint ist: Copilot Next Edit / multi-line Inline-Completions. *(eigene Einschätzung: Marketing-Begriff aus Insider-Announcements, kein offizielles Feature-Label)*

### Foundry Toolkit for VS Code (ehem. AI Toolkit)

- **Rebrand von „AI Toolkit" zu „Microsoft Foundry Toolkit"** im März 2026 — reflektiert einheitliche Developer-Experience für Foundry. Marketplace-ID bleibt `ms-windows-ai-studio.windows-ai-studio`.
- **Agent Builder** (low-code): Instructions definieren, Tools attachen, Conversation starten — ohne Code. Prototyping-Geschwindigkeit ~Minuten.
- **Model Catalog 100+ Modelle**: Cloud-hosted (GitHub Models, Microsoft Foundry, OpenAI direct, Anthropic, Google Gemini) plus lokal via ONNX, Foundry Local, Ollama. „Bring your own model"-Philosophie.
- **Evaluation Runner**: „Evaluation as Tests" — versioniert, CI-freundlich, Evaluation-Agent-Runner-Tool läuft gegen Datasets. Output in Metrics-Form für Regression-Prüfung pro PR.
- **„Export to Code"**: Prototyp aus Agent Builder → Python- oder .NET-Projekt mit Instructions, Tool-Configs, Scaffolding. Ein-Klick.
- **Sidebar-Konsolidierung bis 01.06.2026**: separate Foundry-Sidebar wird zurückgezogen, alle Features in AI-Toolkit-Sidebar (UX-Vereinfachung).

### GitHub Copilot Cloud Agent

- **Umbenennung**: „Copilot Coding Agent" → „Copilot Cloud Agent" (2026), nicht mehr PR-limitiert.
- **Ausführungsmodell**: GitHub-Issue assignen → sandboxed GitHub-Actions-Environment → Draft-PR mit Commits + Test-Runs → Review-Request. Seit 19.03.2026 ~50 % schnellerer Work-Start.
- **Research/Plan-Modus (seit 01.04.2026)**: Nicht mehr nur Code — auch recherche- und plan-orientierte Tasks.
- **MCP-Integration**: MCP-Server als YAML-Frontmatter in Custom Agents. **Einschränkung**: nur Tools, keine Resources/Prompts; **kein OAuth-Flow für remote MCP** (Blocker für viele Enterprise-MCP-Server).
- **Agent Skills** (seit 18.12.2025): Folder mit Instructions + Scripts + Resources, Copilot lädt bei Bedarf. Cross-Tool: Cloud Agent, CLI, VS Code Insiders, VS 2026.
- **Custom Agents**: spezialisierte Copilot-Varianten (Frontend-Experte, Tester, Reviewer) via YAML-Definition.
- **Enterprise-Gate**: Pro Organisation aktivierbar via Custom Properties (15.04.2026); Data Residency US + EU ab 08/2025 (Enterprise Cloud).

### azd AI Agent Extension

- **Extension-Name**: `azure.ai.agents` (install via `azd extension install azure.ai.agents` — oder auto-install bei `azd ai agent`).
- **Kommando-Set** (GA seit März 2026):
  - `azd init -t Azure-Samples/azd-ai-starter-basic` — Starter-Template klonen
  - `azd ai agent init -m <agent-yaml-url>` — Agent-Definition importieren, `azure.yaml` updaten, Env-Vars mappen
  - `azd up` — Bicep-Provision + Model-Deploy + Container-Build + Foundry-Agent-App-Publish
  - `azd ai agent invoke --message "..."` — remote call
  - `azd ai agent run` — lokale Dev-Loop gegen remote Azure-Ressourcen
  - `azd ai agent monitor --follow` — Live-Log-Tail
  - `azd ai agent show` — Health + Endpoint
  - `azd down` — komplette Deprovision
- **`azure.yaml`-Struktur**: deklarativ, Agent-Services mit Container-Config, Model-Deployments mit SKU/Capacity. Bicep unter `infra/`.
- **Security by default**: System-assigned Managed Identity, Role Assignments auto, Entra-ID-Auth an Agent-Endpoint.
- **Region-Limit**: Hosted Agents aktuell **nur North Central US** — siehe [[Foundry Agent Service]] für EU-Roadmap.

### Typischer Workflow (Journai intern)

1. **Prompt-/Agent-Prototyp** (VS Code + Foundry Toolkit): Agent Builder → Evaluation Runner → „Export to Code".
2. **MAF-Code schreiben** (VS Code + Copilot Business, Python): mit [[Foundry SDKs]] `AIProjectClient 2.0` + [[Microsoft Agent Framework]]-Orchestration.
3. **Repo-Gerüst** (`azd`): `azd init -t azd-ai-starter-basic`, `azd ai agent init -m <journai-fork>`, Bicep anpassen.
4. **Deploy** (`azd up`): Provision + Deploy in einem Kommando, typisch 5–10 min.
5. **Autonome Wartungs-Tasks** (Copilot Cloud Agent): Dependabot-PRs, Doku-Updates, Flaky-Test-Fixes via Issue-Label.
6. **Debug/Profile** (VS 2026 für .NET-Kunden): Debugger Agent reproduziert Agent-Bugs, Profiler Agent für Cold-Start-Probleme in Container-Apps.

### Skills-Voraussetzungen (Journai-intern)

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Journai-Senior-Dev** | Python 3.10+ oder .NET 8, MAF-Patterns, `azd`-CLI, Bicep-Basics, Entra-Auth-Flows |
| **Journai-Junior-Dev** | VS Code + Foundry Toolkit Walkthrough (Agent Builder → Playground → Export), Copilot-Etikette (Prompt-Hygiene, kein blind-accept) |
| **Journai-DevOps** | `azd up`/`azd down`-Lebenszyklus, GitHub-Actions für Cloud-Agent-Sandbox-Review, CSP-Lizenz-Count |

---

## Limitierungen & Fallstricke

### Was diese Tools NICHT können

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Copilot Cloud Agent: kein OAuth-Flow für remote MCP** | Lokale MCP-Server in GitHub-Actions-Runner + PAT statt OAuth; oder Warten auf GitHub-Roadmap |
| **Hosted Agents: nur North Central US** | Für EU-Data-Residency: klassischer [[Foundry Agent Service]]-Deploy ohne `azd` Hosted-Agents-Mode, oder Self-Host via Container Apps in Swiss North |
| **VS 2026 AI-Features: benötigen Copilot-Subscription zusätzlich** | Community + freier Copilot-Tier ($0, 2'000 Completions/Monat) für Evaluierung; Business für Prod-Einsatz |
| **Foundry Toolkit: RAG-Project-Feature „coming"** | Eigene RAG-Pipeline mit [[Foundry SDKs]] `.indexes` + Azure AI Search bis Feature landet |
| **azd ai Agent Extension: Region + Model-Katalog Hosted-Mode-spezifisch** | Nicht-Hosted: `azure.yaml` ohne `host: azure.ai.agent`, Deploy in beliebiger AOAI-Region |
| **Keine Visual Studio for Mac** | Wurde 2024 eingestellt; Mac-Team nutzt VS Code (volle Foundry-Toolkit-Parität) oder Rider |

### Typische Fallstricke

- **„GitHub Copilot = VS-Subscription-inklusive"** — Falsch. Copilot ist **separate** Subscription. VS-Subscription deckt IDE + MSDN-Benefits, nicht Copilot-Seats. *Gegenmittel: Bei Kunden-Angeboten Copilot explizit als separate Zeile ausweisen.*
- **„Cloud Agent auf Kunden-Repos ohne weiteren Gedanken"** — GitHub-Actions-Sandbox hat Lese-/Schreibrechte auf das Repo. Für Kunden-IP heißt das: Custom Properties pro Org aktivieren (seit 15.04.2026 möglich), Secrets-Scope prüfen, Audit-Logs reviewen. *Gegenmittel: Pilot nur auf journai-internen Repos; Kunden-Rollout erst nach Compliance-Review.*
- **„azd up deployed immer Hosted Agents"** — Nein: Das ist ein spezifischer Mode (Region-Lock!). Für EU-Deploys `host: azure.ai.agent` rausnehmen, klassisch Foundry-Project + Agent-Service nutzen. *Gegenmittel: Zwei Journai-Templates pflegen — `journai-foundry-hosted-US` und `journai-foundry-byos-EU`.*
- **„Foundry Toolkit redundant zu VS 2026 AI-Features"** — Teilweise: VS 2026 hat **keinen** Agent Builder und keinen Model Playground. Wer prompt-tunen will, braucht das Toolkit — unabhängig davon, ob Code in VS 2026 oder VS Code geschrieben wird. *Gegenmittel: Auch .NET-Team das Toolkit in VS Code installieren und für Prompt-Phase wechseln.*
- **„Jr-Dev + Copilot = Sr-Dev-Produktivität"** — Nein. Copilot generiert plausiblen Code, der bei MAF-Orchestration-Patterns oft falsch ist (Stream-Handling, Thread-Mgmt). *Gegenmittel: Copilot-Output immer PR-Review mit Sr; MAF-Grundlagen-Schulung parallel.*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Release Notes | Visual Studio 2026 Release Notes | https://learn.microsoft.com/en-us/visualstudio/releases/2026/release-notes | 2026-04-22 | VS-Minor-Updates (18.x) |
| Blog | VS 2026 November-Update + Cloud Agent Preview | https://devblogs.microsoft.com/visualstudio/visual-studio-november-update-visual-studio-2026-cloud-agent-preview-and-more/ | 2026-04-22 | AI-Feature-Rollouts |
| Marketplace | Foundry Toolkit for VS Code | https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio | 2026-04-22 | Extension-Updates monatlich |
| Docs | Foundry Toolkit Overview | https://code.visualstudio.com/docs/intelligentapps/overview | 2026-04-22 | Feature-Doku |
| Blog | Foundry Toolkit GA (Mär 2026) | https://techcommunity.microsoft.com/blog/azuredevcommunityblog/microsoft-foundry-toolkit-for-vs-code-is-now-generally-available/4511831 | 2026-04-22 | Deep-Dive-Referenz |
| Blog | AI Toolkit März 2026 Update | https://techcommunity.microsoft.com/blog/azuredevcommunityblog/%F0%9F%9A%80-ai-toolkit-for-vs-code-%E2%80%94-march-2026-update/4502517 | 2026-04-22 | monatliche Releases |
| Docs | GitHub Copilot Cloud Agent | https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent | 2026-04-22 | Feature-Doku |
| Docs | Copilot Cloud Agent About | https://docs.github.com/copilot/concepts/agents/coding-agent/about-coding-agent | 2026-04-22 | Architektur |
| Changelog | GitHub Cloud-Agent Custom Properties | https://github.blog/changelog/2026-04-15-enable-copilot-cloud-agent-via-custom-properties/ | 2026-04-22 | Per-Org-Gate |
| Changelog | GitHub Cloud-Agent Research/Plan | https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/ | 2026-04-22 | Feature-Erweiterung |
| Docs | Copilot Pläne & Pricing | https://docs.github.com/en/copilot/get-started/plans | 2026-04-22 | Pricing-Monitor |
| Docs | azd AI Agent Extension (Foundry) | https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/extensions/azure-ai-foundry-extension | 2026-04-22 | CLI-Doku |
| Blog | azd März 2026 Release | https://devblogs.microsoft.com/azure-sdk/azure-developer-cli-azd-march-2026/ | 2026-04-22 | azd-Monthly |
| Blog | azd AI Agent Extension Announce | https://devblogs.microsoft.com/azure-sdk/azure-developer-cli-foundry-agent-extension/ | 2026-04-22 | Launch-Referenz |
| Pricing | Visual Studio Pricing | https://visualstudio.microsoft.com/vs/pricing/ | 2026-04-22 | VS-Subscriptions |
| Pricing | GitHub Copilot Plans | https://github.com/features/copilot/plans | 2026-04-22 | Seat-Preise |
| Sample | `azd-ai-starter-basic` | https://github.com/Azure-Samples/azd-ai-starter-basic | 2026-04-22 | Template-Updates |

### Secondary (Analysten / Reporting)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| SAMexpert | https://samexpert.com/visual-studio-2026-licensing-update/ | 2026-04-22 | VS-Licensing-Detail |
| Visual Studio Magazine | https://visualstudiomagazine.com/articles/2025/11/12/visual-studio-2026-ga-first-intelligent-developer-environment-ide.aspx | 2026-04-22 | GA-Analyse |
| InfoQ | https://www.infoq.com/news/2025/12/vs2026-native-ai-ide/ | 2026-04-22 | Industry-Reporting |
| DevClass | https://www.devclass.com/ai-ml/2026/04/17/visual-studio-185-lands-with-ai-debugging-at-a-price-devs-still-feeling-blue/5218068 | 2026-04-22 | kritische Stimmen zu 18.5 |

### Events zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | VS-Roadmap, Foundry-Toolkit-Update, azd-Major |
| AI Tour Zürich 2026 | 29.04.2026 | EU-Region-Details zu Hosted Agents |
| Microsoft Ignite 2026 | Nov 2026 | Copilot-Tier-Updates, VS 18.x-Roadmap |

---

## UNCLEAR (TODOs)

1. Visual Studio 2026 Subscription-Listenpreise — offizielle Seite nicht im Detail geprüft; Schätzung 1'500–3'000 EUR/User/Jahr ist CSP-Erfahrung (eigene Einschätzung).
2. Copilot Business **EU-Data-Residency** für Prompts — Enterprise Cloud ja; Business-Stufe unklar.
3. Foundry Toolkit **RAG-Project-Feature** — angekündigt („coming"), kein GA-Datum sichtbar.
4. Hosted Agents **EU-Region-Roadmap** — Mention bei Foundry Agent Service Note nötig.
5. „Ghost Completions" — Begriff aus Briefing, im MS-Docs-Kanon nicht gefunden; vermutlich Marketing-Label für Copilot Next Edit.

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive 4 Dev-Tools: VS 2026 AI-native, VS Code AI Toolkit (= Foundry Toolkit Rebrand Mär 2026), GitHub Copilot Cloud Agents (Rename + GA 09/2025, Research/Plan + Custom Properties April 2026), azd AI (GA 12/2025, Mär-2026-Release mit Local-Run) — für Journai-internes Team; Workflow-Diagramm, Pricing-Matrix, Limitierungen inkl. Hosted-Agents-Region-Lock und Copilot-MCP-OAuth-Gap | https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/ |
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness — Dev-Tooling-Bündel) | Arbeitsauftrag |
