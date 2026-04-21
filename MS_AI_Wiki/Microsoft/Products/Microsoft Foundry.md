---
watch: close
status: ga
last_verified: 2026-04-21
aliases: [Azure AI Studio, AI Foundry, AI Hub, Azure AI Foundry]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Microsoft Foundry

*Microsoft's Dach-Marke für Azure-AI-Entwicklung — das konsolidierte Ergebnis aus Azure AI Studio + AI Foundry + AI Hub + Control Plane. **Kein Monolith**, sondern 8 Sub-Komponenten (siehe Landkarte in [[Azure AI MOC]]). Diese Note behandelt **das Dach** (Portal, Projects & Hubs, Playground). Für Details siehe Sub-Notes.*

> **Analogie:** Was das Azure Portal für Infrastruktur ist, ist Foundry Portal für AI-Projekte — eine zentrale Steuerungsfläche über eine Familie von Services.

---

## Einsatz

**JTBD:** When I eine produktive AI-App bauen will, I want to Modelle, Knowledge, Agents, Tracing und Deployment an einer Stelle verwalten können, so I can den Aufbau nicht aus 10 einzelnen Azure-Services zusammensetzen muss.

**Trigger-Signale:**
- „Wir haben Azure OpenAI, aber alles Drumherum ist Flickwerk."
- „Unser Team kennt Azure AI Studio — ist das nicht umbenannt worden?"

**Szenario:** **Hands-on Minimum** (Arbeitsauftrag §2.6): Foundry-Project anlegen → Modell deployen → Test-Agent via MAF → Tracing im Control Plane. Ohne diesen Durchstich versteht man Foundry nicht.

**Empfehlung:** 🟢 **Empfehlen** als Plattform für Azure-zentrische AI-Projekte. Pro Kundenprojekt auf die 8 Sub-Komponenten einzeln schauen (siehe [[Azure AI MOC]] Abgrenzungs-Matrix).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA (Rebranding der Vorgänger abgeschlossen 2025) |
| **Pricing** | Dach selbst ohne eigenes Pricing — Unterkomponenten werden einzeln berechnet |
| **Bundle** | Keine Bundle-Story — Pay-per-use pro Komponente |
| **Region** | Global, aber einzelne Sub-Komponenten (insb. Foundry Agent Service) mit Region-Einschränkung |

---

## Kernkonzept

### Das Dach (was diese Note abdeckt)

**Foundry Portal** (ai.azure.com) ist der Zugangspunkt. Hier unterscheidet man von Azure Portal: Foundry Portal für AI-zentrische Tasks (Model Deploy, Playground, Tracing, Agent-Management), Azure Portal für Infra (RBAC, VNet, Quotas).

**Foundry Projects** sind die Arbeitseinheit (1 Projekt = 1 Team/Usecase). **Foundry Hubs** sind übergeordnete Organisations-Einheiten (mehrere Projekte, gemeinsame Connections). Faustregel: **Neues Projekt** pro Usecase, **neues Hub** pro Organisations-Einheit oder Compliance-Grenze.

**Playground + Prompt-Tools** (Model Playground, Prompt Catalog, Prompt Variants, Evaluation Playground) — zum Prototyping. *Prompt Flow ist **Legacy** — migrieren bis 2027-01.*

### Die 8 Sub-Komponenten (eigene Notes)

1. [[Foundry Models]] — Model Catalog
2. [[Foundry Agent Service]] — Managed Agent Hosting
3. [[Foundry Control Plane]] — Deployment / RBAC / Tracing / Eval
4. [[Foundry IQ]] — Knowledge Base
5. [[Foundry Tools]] — Azure AI Services
6. [[Azure Machine Learning]] — klassisches ML
7. [[Foundry Local]] — lokale Inference
8. [[Foundry SDKs]] — AIProjectClient 2.0

---

## Limitierungen & Fallstricke

- **Als Monolith denken** — klassischer Fehler. Foundry = 8 Services mit unterschiedlicher Reife + Region-Availability. *Gegenmittel: [[Azure AI MOC]] Abgrenzungs-Matrix konsultieren.*
- **Prompt Flow als produktiv nutzen** — Legacy. *Gegenmittel: auf neues Prompt-Tooling umsteigen bis 2027-01.*

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | Microsoft Foundry | https://learn.microsoft.com/en-us/azure/foundry/ | 2026-04-21 |
| Portal | Foundry Portal | https://ai.azure.com | 2026-04-21 |
| Docs | Foundry Quickstart | https://learn.microsoft.com/en-us/azure/foundry/quickstarts/ | 2026-04-21 |
| Tech Blog | Foundry Devblogs | https://devblogs.microsoft.com/foundry/ | 2026-04-21 |
| Azure Updates | | https://azure.microsoft.com/en-us/updates/?query=foundry | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub, Dach-Note für 8 Sub-Komponenten |
