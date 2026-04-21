---
watch: close
status: ga
last_verified: 2026-04-21
aliases: [Power Virtual Agents, PVA]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Copilot Studio

*Microsoft's Low-Code-Agent-Builder im M365-Ökosystem — Declarative Agents, Agent Builder, Generative Actions, Agent Flows. Unser wahrscheinlichster Einstieg bei SMB-Kunden, die ohne Pro-Code-Entwickler einen Assistenten bauen wollen. Wave 3 bringt **Cowork** (Long-Running-Premium-Layer, Claude-powered) und **Agent 365-Integration**.*

> **Analogie:** Was Power Apps für Forms war, ist Copilot Studio für Chatbots — nur dass der „Bot" jetzt LLM-fähig ist und Tools aufrufen kann.

---

## Einsatz

### Job-to-be-done

When I einen Agent bauen will, ohne Entwickler einstellen zu müssen, I want to per Low-Code-UI einen Assistenten mit Prompts, Tools und Datenquellen zusammenklicken, so I can Business-Prozesse automatisieren ohne auf Dev-Kapazität zu warten.

### Trigger-Signale

- „Unser Citizen Developer hat schon mit Power Apps gearbeitet, kann der auch Agents bauen?"
- „Wir wollen einen FAQ-Bot für Kundenservice, aber nicht 6 Monate Entwicklung."
- „Unsere Teams-Chat-Leute fragen immer dieselben Dinge — automatisierbar?"

### Einsatz-Szenarien

1. **HR-FAQ-Agent** in Teams mit Grounding auf SharePoint-HR-Portal
2. **Sales-Qualifier** Agent in Dynamics 365 mit Dataverse-Lead-Daten
3. **Long-Running-Research-Assistent** via Copilot Cowork (Wave 3) für Multi-Step-Aufgaben

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Copilot Studio Standalone-Lizenz oder Teil von Power Platform Premium; für Agent Builder in M365 Copilot ist M365-Copilot-Lizenz nötig |
| **Tenant** | Power Platform aktiviert, Entra, Dataverse-Environment |
| **Skills** | Low-Code-Erfahrung (Power Apps / Power Automate) hilfreich |
| **Compliance** | DSGVO über Power Platform DPA; Dataverse-Region wählen |

### Aufwand & Kosten

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup** | 2–5 Tage für ersten produktiven Agent |
| **Laufend** | Conversation-basiert (Standard ~$0.01/Conversation, Cowork Premium *{TODO: recherchieren}*) |
| **Betrieb** | 0,5 Tag/Monat |

### Empfehlung

**Status:** 🟢 **Empfehlen** als Low-Code-Agent-Standard-Einstieg. **🟡 Beobachten** für Copilot Cowork bis EU-Availability geklärt ist.

**Nächster Schritt für Journai:** Workshop-Angebot „Copilot Studio in 2 Tagen" + Cowork-Pilot sobald EU verfügbar.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA · Cowork GA für Wave 3 (EU-Status prüfen) |
| **GA-Datum** | Copilot Studio ursprünglich 2023, Cowork Wave 3 2026 |
| **Pricing (USD)** | *{TODO: aktuelle Pricing-Staffel aus microsoft.com/copilot-studio auslesen}* — Conversation-Packs + Cowork-Premium-Layer |
| **Pricing (EUR)** | *{TODO}* |
| **Lizenz-Bundle** | Power Platform Premium · M365 E7 (für Agent Builder / Declarative Agents teilweise inkludiert) |
| **Region-Verfügbarkeit** | Globale GA · **Cowork EU-Status: offen** (Arbeitsauftrag Flag) |
| **Hidden Costs** | Conversations zählen pro message-exchange; Agent Flows als Power Automate laufen, Power Automate-Lizenz relevant |

---

## Kernkonzept

### Was es im Kern ist

Copilot Studio ist ein **Low-Code-Builder, der Declarative Agents als first-class-Bürger behandelt** und Skills als YAML-Primitive exposes. Die Design-Wette: Business-User beschreiben Prompts besser als Entwickler sie programmieren — deshalb ist das primäre Artefakt ein Prompt-zentriertes Manifest, nicht Code.

Es gibt vier Builder-Modi, die sich vom Skill-Level unterscheiden:
1. **Agent Builder** in M365 Copilot — einfachste Stufe, rein Prompt
2. **Declarative Agents** in Copilot Studio — YAML-Manifest + Adaptive Cards
3. **Generative Actions** — Agent ruft Tools auf (Logic Apps, Functions, MCP-Server)
4. **Custom Engine Agents** — wenn Code-Kontrolle nötig, wechselt man auf [[Microsoft Agent Framework]] + [[M365 Agents SDK]]

Wave 3 bringt **Cowork**: ein Long-Running-Premium-Layer für Multi-Step-Tasks (Claude-powered), der Aufgaben über Stunden/Tage verfolgt.

### Kern-Fähigkeiten

#### Declarative Agent (YAML-Manifest)
*{TODO: Manifest-Struktur, Adaptive-Cards-Integration vertiefen}*

#### Generative Actions (Tool-Use)
Agent ruft Logic Apps, Power Automate, MCP-Server auf. *{TODO: MCP-Integration-Reife prüfen}*

#### Cowork (Wave 3, Claude-powered)
Long-Running-Agent-Sessions mit Persistenz + Checkpointing. *{TODO: EU-Availability + Pricing klären}*

#### Agent Flows
Integration mit Power Automate als Workflow-Backbone.

### Typischer Workflow

1. **Setup** — Power Platform Environment, Copilot Studio aktivieren
2. **Build** — YAML-Manifest + Trigger + Tools klicken
3. **Deploy** — Channel wählen (Teams, Web, M365-Copilot-Erweiterung)
4. **Operate** — Analytics-Dashboard im Power Platform Admin Center

### Skills

| Rolle | Kann muss |
|-------|-----------|
| Builder (Journai) | Power Platform Know-how + Prompt-Design |
| Admin (Kunde) | Dataverse-Admin, Entra |
| End-User | Keine |

---

## Limitierungen & Fallstricke

| Limitierung | Alternative |
|-------------|-------------|
| **Komplexe Multi-Agent-Logik nicht darstellbar** | [[Microsoft Agent Framework]] |
| **Conversation-basiertes Pricing kann bei Massen-Einsatz teuer werden** | Custom Engine Agent mit eigenem Azure-OpenAI-PTU |
| **Dataverse-Limits (15 Tables/Source, 500 Knowledge Objects)** | *{TODO: Multi-Source-Workarounds recherchieren}* |

- **Fallstrick:** Kunden wollen alles per Copilot Studio bauen — erreichen dann Complexity-Grenze. *Gegenmittel: Entscheidungsbaum vor Projekt klären.*
- **Fallstrick:** Cowork als Premium-Feature vor EU-Availability kommuniziert — setzt Kunden-Erwartung, die MS (noch) nicht einlöst.

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | Copilot Studio | https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio | 2026-04-21 |
| Docs | Copilot Studio Docs | https://learn.microsoft.com/en-us/microsoft-copilot-studio/ | 2026-04-21 |
| Release Notes | Release Planner | https://releaseplans.microsoft.com/ | 2026-04-21 |
| Tech Blog | Power Platform / Copilot Studio Blog | https://www.microsoft.com/power-platform/blog/ | 2026-04-21 |
| Roadmap | M365 Roadmap | https://www.microsoft.com/microsoft-365/roadmap?filters=Copilot%20Studio | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung (Stub), watch: close, Status: GA |
