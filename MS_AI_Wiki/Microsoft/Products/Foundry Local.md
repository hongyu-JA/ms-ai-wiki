---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Windows AI Foundry]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Local

*Microsoft's **Cross-Platform-Edge-Runtime** für lokale Modell-Inference — **GA am 2026-04-09**. ~20 MB Library, Windows/macOS/Linux, OpenAI-kompatible REST-API, NPU/GPU/CPU-Fallback. **Windows AI Foundry** ist der **übergeordnete Windows-Stack** (Windows AI APIs + Phi Silica + Foundry Local + Windows ML) — nicht dasselbe wie Foundry Local. Hochgradig SMB-relevant für DSGVO/FADP-Compliance (Arzt/Anwalt/Steuer), Offline-Szenarien, Kostenoptimierung.*

> **Analogie:** Wie Ollama für lokale Modelle auf Linux/Mac — nur mit MS-Support, NPU-Nutzung auf Copilot+-PCs und OpenAI-API-Kompatibilität für Drop-in.

---

## Scope-Klärung — Foundry Local ≠ Windows AI Foundry

```
┌─────────────────────────────────────────────────────────────────┐
│  Windows AI Foundry  (Platform-Stack, nur Windows)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────┐                      │
│   │ Windows AI APIs                      │                      │
│   │  (OS-level, Microsoft-verwaltet,     │                      │
│   │   Summarize/Rewrite/OCR/Image Desc)  │                      │
│   └─────────────────────────────────────┘                      │
│                      ▲                                          │
│                      │                                          │
│   ┌─────────────────────────────────────┐                      │
│   │ Phi Silica (3.3B SLM)                │                      │
│   │  NPU-optimiert, OS-preloaded         │                      │
│   │  auf Copilot+ PCs                    │                      │
│   └─────────────────────────────────────┘                      │
│                      ▲                                          │
│                      │                                          │
│   ┌─────────────────────────────────────┐                      │
│   │ Foundry Local  (Cross-Platform)      │ ← auch Mac/Linux    │
│   │  20MB Runtime, OpenAI-kompatibel     │                      │
│   │  NPU/GPU/CPU-Fallback                │                      │
│   └─────────────────────────────────────┘                      │
│                      ▲                                          │
│                      │                                          │
│   ┌─────────────────────────────────────┐                      │
│   │ Windows ML  (lower-level ONNX-       │                      │
│   │  Runtime für Entwickler-Custom-      │                      │
│   │  Modelle)                            │                      │
│   └─────────────────────────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Kurzformel:
  Foundry Local        = Runtime (cross-platform, für Apps)
  Windows AI Foundry   = Platform-Stack (Windows-only, OS-Integration + Phi Silica)
```

---

## Modell-Katalog (April 2026)

| # | Modell-Familie | Varianten | Use-Case |
|---|----------------|-----------|----------|
| 1 | **Phi-4-mini-reasoning** | NPU / GPU / CPU | Reasoning, Agent-Loops |
| 2 | **Phi-4-mini-instruct** | NPU / GPU / CPU | Allgemeine Chat-Aufgaben |
| 3 | **Phi-3.5-mini** | GPU / CPU | Schnelle Standardaufgaben, JSON-Output |
| 4 | **Phi Silica** (nur WAIF) | NPU-only, OS-preloaded | Summarize/Rewrite, Inbox-KI |
| 5 | **Qwen2.5-Coder** (0.5B/1.5B/7B) | NPU / GPU / CPU | Code-Completion |
| 6 | **Qwen3** (Familie) | GPU / CPU | Multilingual, Chat |
| 7 | **GPT-OSS-20B** | GPU (schwer für NPU) | Open-Source Frontier-Tier |
| 8 | **DeepSeek-R1-Distill** | GPU / CPU | Reasoning |
| 9 | **Mistral-7B** Varianten | GPU / CPU | Allgemeine Textverarbeitung |
| 10 | **Whisper** (large-v3, etc.) | GPU / CPU | Audio-Transkription (Arzt-Diktat) |

### Installation

```bash
# Windows:  winget install Microsoft.FoundryLocal --scope machine
# macOS:    brew tap microsoft/foundrylocal && brew install foundrylocal
# SDK:      pip install foundry-local-sdk   (auch C#, Rust, JS)

# Model-Download mit Auto-Hardware-Detection:
foundry model run phi-4-mini
```

Jedes Modell kommt in mehreren Optimierungs-IDs (typisch 3× GPU, 1× CPU, 1× NPU).

---

## Hardware-Matrix

```
Minimum:      8 GB RAM, 3 GB Storage
Empfohlen:    16 GB RAM, 15 GB Storage
OS:           Win10 x64, Win11 x64/ARM, Win Server 2025, macOS
```

| Modell | CPU-only | GPU (NVIDIA/AMD) | NPU (Copilot+ PC) |
|--------|----------|-------------------|-------------------|
| Phi Silica 3.3B | — | — | Snapdragon X / Intel Core Ultra mit 40+ TOPS |
| Phi-4-mini (3.8B) | OK, ~3–8 tok/s | 30–80 tok/s | Qualcomm/Intel NPU + Driver |
| Phi-3.5-mini (3.8B) | OK | RTX 3060+ | NPU-Variante verfügbar |
| Qwen2.5-Coder-0.5/1.5B | sehr gut | sehr gut | NPU-Variante |
| Mistral-7B | grenzwertig (16 GB) | RTX 4060+ | *{UNCLEAR NPU}* |
| **GPT-OSS-20B** | ❌ | **RTX 4090 / A6000 / RTX 6000** | ❌ |
| Whisper large-v3 | langsam | OK | *{UNCLEAR}* |

**Standard-Laptop reicht für**: Phi-4-mini, Phi-3.5-mini, Qwen2.5-Coder, Whisper-small.

**Copilot+ PCs** mit ≥40 TOPS NPU laufen Phi Silica nativ vom OS.

---

## API-Kompatibilität

### Funktioniert (OpenAI-kompatibel)

- `POST /v1/chat/completions`
- `POST /v1/completions`
- `POST /v1/embeddings`
- `POST /v1/audio/transcriptions` (Whisper: MP3/WAV/FLAC/OGG/WebM)
- Streaming (SSE)
- Endpoint: `http://localhost:PORT/v1` (z.B. 8080); dynamisch via `foundry service status` oder `GET /openai/status`

### Eingeschränkt / fehlt

- 🔴 **Function Calling / Tool Use** — nicht OpenAI-standardkonform. Qwen-Modelle geben Tool-Calls als JSON-String im **Content-Feld** zurück, nicht im standardmässigen `tool_calls`-Feld. OpenAI-Python-Client funktioniert **nicht out-of-the-box** für Tool-Calling
- 🔴 **Structured Output (JSON-Schema)** — modellabhängig, nicht universell
- 🟡 **Vision / Multimodal** — *{UNCLEAR — April-2026-Katalog primär Text + Audio}*
- 🔴 **Concurrent Requests** — sequenzielle Verarbeitung, **kein** Continuous Batching
- 🔴 **Assistants-API** — nicht unterstützt (Cloud-Foundry-Agent-Service only)

---

## MCP-Support lokal

**Kurz**: Foundry Local hat **keinen nativen MCP-Plug-in-Mechanismus** wie der Cloud-Foundry-Agent-Service. Man muss eine dünne Agent-Schicht bauen.

**Praktisches Pattern**:
- Foundry Local auf `http://localhost:8080/v1`
- MCP-Server separat (z.B. Docker-Container)
- Python-Agent orchestriert: Chat-Completion zu Foundry Local, Tool-Calls zu MCP-HTTP-Endpunkten
- Demo-Repo: `github.com/tikikevin/foundry-local-mcp-integration`

**Microsoft Agent Framework** (.NET/C#) unterstützt `FoundryLocalAgent` als Provider — aber `RunStreamingAsync` ist laut MS-Doku **noch nicht voll funktionsfähig**, `RunAsync` funktioniert.

---

## Hybrid-Pattern-Playbook (4 Pattern für Journai)

### Pattern A — Privacy-First Routing (Arzt/Anwalt)

```
Request kommt rein
     │
     ▼
┌────────────────────────────────────┐
│ Regex-Filter auf DSGVO-Marker      │
│ (AHV-Nr, Geburtsdatum, Diagnose)   │
└────────────────────────────────────┘
     │
     ▼
  PII drin?
     │            │
   JA ▼         NEIN ▼
┌──────────┐   ┌──────────────────────────┐
│ 🔒 LOCAL │   │ User-Freigabe erforderlich│
│ Phi-4-   │   │ für Cloud-Enhance (GPT-5 /│
│ mini     │   │ Claude-Opus-4.x)          │
└──────────┘   └──────────────────────────┘
   ~85–95% Volumen local, 5–15% Cloud bei bewusster Eskalation
```

### Pattern B — Offline-Ready Kanzlei-Laptop (Anwalt Feldbetrieb)

Copilot+ PC mit 40+ TOPS NPU → Phi Silica + Phi-4-mini preloaded → Offline-Diktat via Whisper → Zusammenfassung / Entwurf von Schriftsätzen → Phi-4-mini → Sync zurück zur Kanzlei nur für nicht-sensible Metadaten. Zero Cloud-Abhängigkeit bei Gerichtsterminen / Auslandseinsätzen.

### Pattern C — Cost Caps bei Hochvolumen (Steuerberater)

10'000+ Belege/Monat → OCR + Kategorisierung lokal auf Phi-3.5-mini → nur komplexe Edge-Cases → Cloud-Modell. Schätzung: **~80% Cloud-API-Kostenreduktion** bei 80% Local-Routing.

### Pattern D — Windows AI APIs als Einstiegs-Tier

- Simple Transformationen (Summarize, Rewrite, Spell-Correct) → **Windows AI APIs + Phi Silica** (wenige Zeilen Code, kein Modellmanagement)
- Komplexere Logik / andere Modelle → **Foundry Local**
- Frontier-Qualität → **Azure Foundry Cloud**

---

## Enterprise-Deployment

### Paketierung

- `winget install Microsoft.FoundryLocal --scope machine` (device-weit)
- **Intune Enterprise App Catalog** paketierbar (winget-kompatibel)
- SDK-Bundle: Foundry-Local-Core + ONNX-Runtime-Binaries automatisch als Dependency gebundelt

### Update-Strategie

- Modelle sind versioniert — App kann pinnen oder Auto-Updates akzeptieren
- Windows Autopatch / Update Rings für OS-Updates (Windows AI APIs / Phi Silica sind OS-Bestandteil)
- Foundry-Local-Library: normaler Winget-Update-Zyklus

### Device-Compliance

- Intune prüft NPU-Driver-Versionen (Intel / Qualcomm) — entscheidend für Phi Silica / NPU-Modelle
- Conditional Access: Foundry Local braucht keine Cloud-Auth (aber Modell-Download initial Internet)
- Offline-Betrieb nach initialem Download: ✅ voll möglich

### ⚠️ Server-Deployment-Warnung

Foundry Local läuft auf **Windows Server 2025**, ist aber **nicht als Multi-User-Serverstack designed**. Für Shared-Endpoint: vLLM, Triton Inference Server oder Azure AI Foundry Cloud.

---

## SMB-Branchen-Szenarien (Journai-Fokus)

### Arztpraxis (Schweiz / DSG / FADP)

- **Arzt-Diktat**: Whisper lokal → SOAP-Notiz via Phi-4-mini → niemals Patientenstimme in Cloud
- **Befund-Vorformulierung**: Phi-3.5-mini schlägt Formulierungen vor, Arzt redigiert
- **Rezept-Check**: lokal gegen Praxis-Wissensbasis via RAG
- Hardware: Copilot+ PC am Empfang, Intel/AMD-Workstation im Sprechzimmer

### Anwaltskanzlei (Art. 321 StGB / Anwaltsgeheimnis)

- **Dokumenten-Zusammenfassung**: Schriftsätze, Gutachten, Urteile — Phi-4-mini lokal
- **Diktat-zu-Entwurf**: Whisper + Phi-4-mini Pipeline
- **Mandanten-Dossier-Suche**: lokale Embeddings mit Foundry Local Embedding-Endpoint
- **Compliance-Check** vor jedem Cloud-Call: Prompt-Filter auf sensible Identifier
- Hardware: Copilot+ PC für mobile Anwälte, RTX 4070+ für grössere Dossiers

### Steuerberater

- **Beleg-Kategorisierung**: Phi-3.5-mini verarbeitet Hochvolumen-OCR-Output
- **Steuererklärungs-Vorausfüllen**: strukturiertes JSON aus Belegdaten
- **Mandantenkorrespondenz-Entwürfe**: Phi-4-mini
- **Quartals-Review**: Cloud-Modell für komplexe Cross-Jahr-Analysen

---

## Limitierungen

| Limitierung | Konsequenz |
|-------------|------------|
| **Single-User, keine Concurrent Requests** | Kein Shared-Server-Setup; 1 Runtime = 1 User |
| **Kein Continuous Batching** | Throughput sinkt unter Last |
| **Modell-Qualität < Frontier Cloud** | Phi-4-mini ≠ GPT-5/Claude-Opus — für komplexe Reasoning Cloud-Fallback |
| **Tool Calling nicht standardkonform** | Custom-Parser nötig (Qwen returniert als Content-String) |
| **OpenAI-Python-Client nicht drop-in** für Function Calling | Custom Client oder Agent-Framework-Abstraktion |
| **Modell-Katalog kleiner als Cloud** | Kein GPT-5, kein Claude, kein Gemini lokal |
| **Internet-Abhängigkeit Erst-Download** | Initial-Setup braucht Konnektivität |
| **NPU-Varianten modellabhängig** | Nicht jedes Modell hat NPU-optimierte Version |
| **Streaming MAF Unreif** | `.NET RunStreamingAsync` noch nicht voll funktional |

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs Hub | Foundry Local | https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-local/ | 2026-04-22 |
| Docs | What is Foundry Local | https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local | 2026-04-22 |
| Docs | Get Started | https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-local/get-started | 2026-04-22 |
| Docs | CLI Reference | https://learn.microsoft.com/en-us/azure/foundry-local/reference/reference-cli | 2026-04-22 |
| Docs | REST API Reference | https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-local/reference/reference-rest | 2026-04-22 |
| Docs | Architektur | https://learn.microsoft.com/en-us/azure/foundry-local/concepts/foundry-local-architecture | 2026-04-22 |
| Docs | Tool Calling | https://learn.microsoft.com/en-us/azure/foundry-local/how-to/how-to-use-tool-calling-with-foundry-local | 2026-04-22 |
| Docs | Windows AI Foundry | https://learn.microsoft.com/en-us/windows/ai/ | 2026-04-22 |
| Docs | Phi Silica | https://learn.microsoft.com/en-us/windows/ai/apis/phi-silica | 2026-04-22 |
| Docs | Copilot+ PCs Dev Guide | https://learn.microsoft.com/en-us/windows/ai/npu-devices/ | 2026-04-22 |
| Docs | MAF + Foundry Local | https://learn.microsoft.com/en-us/agent-framework/agents/providers/foundry-local | 2026-04-22 |
| Blog | GA Announcement (09.04.2026) | https://devblogs.microsoft.com/foundry/foundry-local-ga/ | 2026-04-22 |
| Blog | On-Device AI Overview | https://techcommunity.microsoft.com/blog/azuredevcommunityblog/on%E2%80%91device-ai-with-windows-ai-foundry-and-foundry-local/4466236 | 2026-04-22 |
| Blog | Privacy-First Hybrid Pattern | https://techcommunity.microsoft.com/blog/azuredevcommunityblog/building-a-privacy-first-hybrid-ai-briefing-tool-with-foundry-local-and-azure-op/4490535 | 2026-04-22 |
| Blog | Benchmarks Local AI | https://techcommunity.microsoft.com/blog/azuredevcommunityblog/benchmarking-local-ai-models/4490780 | 2026-04-22 |
| GitHub | microsoft/Foundry-Local | https://github.com/microsoft/Foundry-Local | 2026-04-22 |
| GitHub | foundry-local-mcp-integration | https://github.com/tikikevin/foundry-local-mcp-integration | 2026-04-22 |
| Third-Party | Lilting.ch 20MB Analyse | https://lilting.ch/en/articles/microsoft-foundry-local-bundled-ai-runtime | 2026-04-22 |
| Third-Party | RTX 6000 Performance | https://medium.com/microsoft-azure-in-practice/how-fast-is-microsoft-foundry-local-on-an-nvidia-rtx-6000-bc756fdbfd3a | 2026-04-22 |

---

## UNCLEAR

1. Vision / Multimodal-Modell-Support im April-2026-Katalog
2. NPU-Varianten pro Modell (bei einigen unklar)
3. MAF `RunStreamingAsync` .NET Bug-Details

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Scope-Klärung Foundry Local vs. Windows AI Foundry (Runtime vs. Platform-Stack), 10-Modell-Katalog mit Hardware-Matrix, API-Delta OpenAI-Kompatibilität (**Tool Calling nicht standardkonform!**), 4 Hybrid-Patterns für Journai-SMB (Arzt/Anwalt/Steuer), Enterprise-Deployment via Winget + Intune, GA 2026-04-09 | Learn + DevBlogs + TechCommunity + GitHub |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
