---
type: moc
tags:
  - moc
  - microsoft
  - copilot
last_verified: 2026-05-03
---

# Copilot MOC

*Primary-Home für Microsoft's Copilot-Familie — die zentrale Kunden-Erfahrung mit Microsoft-AI. Bündelt Microsoft 365 Copilot (Dach), die Wave-3-Features (Cowork, Edit, Multi-Model, Work IQ), Copilot Connectors und die Copilot-Hierarchie von Agents (Agent Builder → Declarative → Custom Engine).*

---

## Zweck

Einstieg für alle Kundengespräche, bei denen es um **Copilot-basierte Produktivität** geht (nicht Pro-Code-Agents — die leben in [[Agents MOC]]). Hier entscheidet sich: Was bekommt der Kunde out-of-the-box vs. was muss er selbst ausbauen? Welche Wave-3-Features sind EU-tauglich? Wie grounden wir Copilot auf eigene Datenquellen?

---

## Landkarte

```
┌─────────────────────────────────────────────────────────────────┐
│                    [[Microsoft 365 Copilot]]                    │
│                    (Dach-Produkt, $30/user/month)               │
├─────────────────────────────────────────────────────────────────┤
│ Wave 3 Features:                                                │
│   • Cowork        (Long-Running-Agent-Layer, Claude-powered)    │
│   • Edit          (Agent-gestützte Doc-Editierung)              │
│   • Multi-Model   (Claude, GPT, O-Series)                       │
│   • Work IQ       (Personal-Knowledge-Layer)                    │
├─────────────────────────────────────────────────────────────────┤
│ Grounding:                                                      │
│   [[Microsoft 365 Copilot Connectors]]                          │
│     └─ Graph Connectors → externe Datenquellen                  │
├─────────────────────────────────────────────────────────────────┤
│ Copilot-Hierarchie (Eskalationsleiter):                         │
│   1. Agent Builder     (No-Code, in Copilot-UI)                 │
│   2. Declarative Agents (Copilot Studio, YAML-Deklaration)      │
│   3. Custom Engine Agents (MAF / M365 Agents SDK, Pro-Code)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Produkte in dieser MOC


<!-- AUTO-INDEX-START: produkte -->

| Produkt | Was es ist (1 Satz) | Tier | Watch |
| ------- | ------------------- | ---- | ----- |
| 🟢 [[Microsoft 365 Copilot]] | Dach-Produkt, Kunden-primäre Erfahrung mit MS-AI | T1 | close |
| 🟢 [[Microsoft 365 Copilot Connectors]] | Graph-Connector-Ökosystem zum Grounden auf Kundendaten | T2 | standard |
| 🟢 [[Dynamics 365 Agents]] | AI-Agents speziell in Dynamics 365 (Sales, Customer Service, Finance) — nur bei D365-Kunden relevant | T3 | passive |

<!-- AUTO-INDEX-END: produkte -->

## Letzte Aktivität

_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-22 | [[Microsoft 365 Copilot]] | Copilot Cowork (Long-Running, Multi-Step-Work) ist jetzt via Frontier-Programm verfügbar. Nutzer können über das Frontier-Programm Early … | auto-sync |
| 2026-04-22 | [[Microsoft 365 Copilot Connectors]] | Deep-Dive Copilot Connectors: OOB-Inventar (>100 Connectors), Custom-Schema-Snippet, Security Trimming via ACLs, 50M-Quota-Details, Abgre… | Hongyu / Deep-Research |
| 2026-04-22 | [[Microsoft 365 Copilot Connectors]] | Initial Stub, watch: standard, status: GA | Hongyu |
| 2026-04-22 | [[Dynamics 365 Agents]] | Deep-Dive D365 Agents: Sales/Customer Service/Finance/Business Central; SMB-Relevanz; Copilot-Studio-Basis; Pricing | Hongyu / Deep-Research |
| 2026-04-22 | [[Dynamics 365 Agents]] | Initial Stub (wartet auf Deep-Research) | Hongyu |
| 2026-04-22 | [[Microsoft 365 Copilot]] | **Vollständige Deep-Research-Integration** via claude-researcher agent: Wave-3-Features mit EU-Details, Flex-Routing-Warnung (DSGVO-kriti… | Hongyu / Deep-Research |
| 2026-04-21 | [[Microsoft 365 Copilot]] | Initial Stub, watch: close, Status: GA Wave 3 | Hongyu |

<!-- AUTO-INDEX-END: activity -->

---

<!-- auto-sync: update_row · {"product":"Microsoft 365 Copilot","columns":{"notes":"Copilot Cowork jetzt via Frontier-Programm verfügbar (April 2026)"}} -->


## Eskalationsleiter / Entscheidungslogik

| Kundensituation | Tool | Begründung |
|-----------------|------|------------|
| „Wir wollen einen Helper, der Teams-Chats zusammenfasst" | **Copilot (ohne Zusatz)** | Out-of-the-box-Feature, keine Anpassung |
| „Copilot soll unsere SharePoint-Knowledge-Base kennen" | **[[Microsoft 365 Copilot Connectors]]** | Grounding ist Standard-Erweiterung |
| „Business-User baut einen FAQ-Agenten für Kundenservice" | **Agent Builder** (wenn rein prompt-basiert) oder **[[Copilot Studio]]** Declarative Agent (wenn Tools nötig) | Low-Code reicht |
| „Wir wollen Claude als Modell statt GPT" | **Copilot Multi-Model / Wave 3** einschalten | EU: Claude-Default deaktiviert → manuell enablen |
| „Lang laufender Multi-Step-Research-Agent innerhalb Copilot-UI" | **Copilot Cowork** (Wave 3) | Spezifischer Long-Running-Layer |
| „Komplexe Logik, externe APIs, Multi-Agent" | **Custom Engine Agent** ([[Microsoft Agent Framework]]) | Low-Code reicht nicht mehr |

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Agents MOC]] — Copilot Studio und Custom Engine Agents liegen formal dort (Agent-Build-Perspektive)
- [[Data & Knowledge MOC]] — Graph Connectors nutzen [[Microsoft Graph]]
- [[Licensing & SKUs MOC]] — Copilot-Lizenz ist Teil von [[Microsoft 365 E7]]
- [[Security & Identity MOC]] — Copilot-DSGVO-Thematik, Prompt Shields

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Microsoft 365 Copilot Overview | https://learn.microsoft.com/en-us/microsoft-365-copilot/ | 2026-04-21 |
| MS Roadmap | M365 Roadmap mit Copilot-Filter | https://www.microsoft.com/microsoft-365/roadmap?filters=Microsoft%20365%20Copilot | 2026-04-21 |
| Tech Blog | Microsoft 365 Blog | https://techcommunity.microsoft.com/category/microsoft365 | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der MOC |
