---
watch: passive
status: deprecated
last_verified: 2026-04-21
aliases: [Bot Framework v4, BF, Microsoft Bot Framework]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Bot Framework  🔴 DEPRECATED — EOS 2025-12-31

*Über ein Jahrzehnt das Microsoft-SDK für Chatbots in Teams, Web, Slack, Skype. **End of Support: 2025-12-31** — bereits überschritten. Nachfolger: [[M365 Agents SDK]]. Hier dokumentiert für Bestandskunden-Beratung und Migrationspfade.*

> **Analogie:** Wie damals Bot Framework v3 → v4 — ein Generationswechsel, aber dieses Mal wird das Activity-Protocol bewusst erhalten, sodass Channel-Integrationen (Teams, WebChat, Direct Line) weiterleben.

> [!danger] Akuter Migrationsdruck
> **End of Support ist bereits eingetreten (2025-12-31).** Bestandskunden **müssen** auf [[M365 Agents SDK]] migriert haben. Microsoft lehnt alle neuen Support-Tickets zu BF-basierten Bots ab. Azure Bot Service läuft für Bestandskunden übergangsweise weiter, keine Neu-Registrierungen mehr möglich.

---

## Einsatz

### Job-to-be-done

*(Historisch — nicht mehr für Neu-Projekte anwenden.)* When I einen Chatbot in Teams / Web / Slack einheitlich deployen wollte, I want to ein Framework-SDK mit Channel-Adapter und Dialog-System, so I can einen Bot einmal bauen und über Azure Bot Service auf beliebigen Channels ausrollen.

**Heutiger Job:** Bestandskunden-Migration auf **M365 Agents SDK** planen und durchführen.

### Trigger-Signale

- „Wir haben noch einen Teams-Bot auf Bot Framework laufen, brauchen wir eigentlich nichts zu tun, oder?" → **Ja**, muss migriert werden.
- „Unser QnA-Maker-Bot läuft noch, Microsoft hat sich doch nicht gemeldet." → QnA Maker ist ebenfalls retired, parallele Migrationsbaustelle.
- „Der TeamsFx-Bot fängt an, Warnungen zu werfen." → Agents Toolkit / M365 Agents SDK ist der Nachfolger.

### Einsatz-Szenarien

*(Nur Migrations-Szenarien, keine Neubau-Szenarien.)*

1. **BF-Bot → M365 Agents SDK mit MAF-Logik** — Standardpfad. Kanal-Adapter bleibt konzeptionell erhalten, Dialog-System wird durch MAF-Agent ersetzt.
2. **BF-Bot mit LUIS → Azure AI Language + MAF-Tool** — LUIS wandert auf Azure AI Language CLU; Intent-Erkennung wird zum MAF-Tool.
3. **BF-Bot mit QnA Maker → Azure AI Search + RAG-Pattern** — QnA-Pairs in AI Search indexieren, Frage-Antwort über RAG mit MAF-Agent.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Für M365-Kanal-Targets: Entsprechende M365-Lizenzen (Teams = E1 aufwärts); Azure Subscription für Bot-Hosting |
| **Tenant / Infrastruktur** | Azure Subscription mit bestehender Bot-Service-Resource; Entra-App-Registration wandert mit |
| **Skills / Rollen** | .NET- oder Node-Entwickler mit BF-Erfahrung für Kontinuität; MAF-Kenntnisse für den neuen Logik-Layer |
| **Compliance-Rahmen** | DPA-Scope identisch, Migration ändert die Compliance-Story nicht wesentlich |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 3–10 Beratertage pro Bot je nach Komplexität (Waterfall-Dialoge machen 60% der Migrationsarbeit aus) |
| **Laufende Lizenzkosten** | Identisch wie vorher + evtl. zusätzliche MAF-/Azure-OpenAI-Kosten wenn LLM-Logik neu reinkommt |
| **Laufender Betrieb** | Nach Migration besser (saubere Trennung Agent-Logik / Hosting) |

### Empfehlung

**Status:** 🔴 **Meiden für Neu-Projekte** · 🟡 **Migrationspfad für Bestandskunden**

**Nächster Schritt für Journai:** 
1. Bestandskunden-Audit: welche Kunden haben BF-Bots? (intern prüfen, mind. quartalsweise). 
2. Pro identifizierter Bot: Migrationsplan mit Kunde abstimmen, Ziel-Deadline Q2 2026. 
3. Standardisiertes Migrations-Runbook pflegen (Waterfall→Agent-Pattern, LUIS→CLU, QnA→AI Search).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | deprecated — End of Support 2025-12-31 (bereits erreicht) |
| **GA-Datum (historisch)** | 2016 (BF v3) / 2018 (BF v4) |
| **Standalone-Preis** | Framework historisch kostenlos, Kosten nur bei Azure Bot Service + Channel-Fees |
| **Lizenz-Bundle** | keiner |
| **Voraussetzung** | Azure Bot Service-Resource (für Bestandskunden bleibt aktiv, keine neuen Registrierungen mehr) |
| **Region-Verfügbarkeit** | global (historisch); für neue Bots irrelevant |
| **Hidden Costs** | keine neuen — aber: **Support-Gebühren für out-of-support-Code** bei kritischen Bugs sind nicht mehr möglich |
| **Upgrade-Pfad** | → **[[M365 Agents SDK]]** für Hosting/Channel; → **[[Microsoft Agent Framework]]** für Dialog-Logik; → **[[Teams SDK]]** wenn Teams-spezifische UI nötig |

---

## Kernkonzept

### Was es im Kern ist

Bot Framework war das erste einheitliche Abstraktionssystem von Microsoft für Chatbots über heterogene Kanäle hinweg. Der zentrale Architektur-Beitrag war das **Activity Protocol**: ein gemeinsames Nachrichten-Schema, das Teams, WebChat, Slack, Skype, Facebook Messenger einheitlich aus Sicht des Bots aussehen ließ — die Kanal-Unterschiede wurden vom Channel Adapter abstrahiert. Der Bot schreibt gegen `TurnContext` + `Activity`, deployt sich einmal, Azure Bot Service verteilt auf alle verbundenen Kanäle.

Das Dialog-System (Waterfall, Prompts) war der Logik-Layer — imperativ, zustandsbehaftet, auf einfache Multi-Turn-Flows ausgelegt. Das hat im LLM-Zeitalter nicht gut skaliert: Waterfall-Dialoge sind rigide, während Nutzer mit LLM-Erwartungen beliebige Turns machen wollen. Deshalb die Konsolidierung: **Channel-Abstraktion (Activity Protocol) bleibt**, **Dialog-Engine wird aufgegeben** zugunsten von Agent-/LLM-basierter Logik.

### Migrationspfad zu [[M365 Agents SDK]]

**Was bleibt**
- Activity-Protocol 1:1 — Nachrichten-Schema identisch, Channels (Teams, WebChat, Direct Line) kompatibel.
- `TurnContext`-Konzept konzeptionell erhalten, leicht andere API-Signatur.
- Adapter-Pattern (Channel-Adapter) bleibt konzeptionell.
- Azure Bot Service-Registrierung für bestehende Bots bleibt während der Migration gültig.

**Was sich ändert**

| Aspekt | Bot Framework (alt) | M365 Agents SDK (neu) |
|--------|---------------------|------------------------|
| Namespace / Package | `Microsoft.Bot.Builder` | `Microsoft.Agents.*` |
| Dialog-System | Waterfall / Prompts (imperativ) | Entfällt — **[[Microsoft Agent Framework]]** übernimmt Logik (deklarativ, LLM-first) |
| State-Storage | `BotFrameworkAdapter` + Storage | Agents SDK Storage Provider |
| Channel-Registrierung | Azure Bot Resource | Agents-Ressource (neuer ARM-Typ) |
| Teams-Spezifika | Teams Extension | **[[Teams SDK]]** (separates Paket) |
| LUIS / QnA Maker | eingebunden | Migration auf Azure AI Language (CLU) + MAF-Tool für Intent, Azure AI Search für QnA-Content |
| Dev-Tooling | TeamsFx | **M365 Agents Toolkit** (VS Code Extension) |

**Migrationsschritte pro Bot**
1. Activity-Protocol-Handler isolieren (sollte bei sauberem Code schon sein).
2. Waterfall-Dialoge identifizieren, in MAF-Agent + Tools umdenken (dies ist der zeitintensivste Teil — 50–70 % des Aufwands).
3. Package-Referenzen tauschen (`Microsoft.Bot.*` → `Microsoft.Agents.*`), Adapter-Init anpassen.
4. Teams-spezifische Features (Adaptive Cards, Task Modules) in [[Teams SDK]] auslagern.
5. Deployment-Ziel neu wählen: Azure App Service / Container Apps / Foundry Agent Service (je nach Betrieb).
6. QA: Bot Framework Emulator-Nachfolger (Teams Dev Center) für End-to-End-Tests.
7. Kunden-Kommunikation: Switch-Fenster planen, Activity-Protocol-Kompatibilität zeigt sich als nahtlos.

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT (mehr) kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein Support mehr ab 2025-12-31** | Migration auf M365 Agents SDK alternativlos |
| **Waterfall-Dialoge rigid, schlechte LLM-Integration** | MAF-Agent mit Tool-Use statt Waterfall |
| **QnA Maker / LUIS sind gemeinsam retired** | Azure AI Language CLU + Azure AI Search + MAF |

### Typische Fallstricke bei der Migration

- **Waterfall-Dialoge 1:1 in MAF nachbauen wollen** — funktioniert, aber verschenkt die LLM-Vorteile. *Gegenmittel: Pro Waterfall überlegen „welches Tool deckt das eigentlich ab?" und Agent statt Dialog bauen.*
- **Channel-Adapter-Logik mit Bot-Logik vermischen** — war in BF-Code oft Usus. M365 Agents SDK erzwingt saubere Trennung. *Gegenmittel: Vor Migration Code-Refactor auf klare Schicht-Trennung.*
- **QnA-Maker-Abhängigkeit ignorieren** — QnA-Maker-Endpunkte werden abgeschaltet, Bots die sie nutzen versagen still. *Gegenmittel: Parallel-Migration auf Azure AI Search + RAG-Pattern.*
- **TeamsFx-Projekt-Format 1:1 übernehmen wollen** — M365 Agents Toolkit hat anderes Projekt-Layout. *Gegenmittel: Neues Projekt-Scaffolding als Basis, Code einzeln migrieren.*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Deprecation-Ankündigung | Bot Framework Sunset | https://learn.microsoft.com/en-us/azure/bot-service/bot-framework-sunset | 2026-04-21 | weitere EOS-Updates |
| Nachfolger-Docs | M365 Agents SDK | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/ | 2026-04-21 | Migrationspfad-Details |
| Migration-Guide | BF → M365 Agents SDK | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/migrate-from-bot-framework | 2026-04-21 | Schritt-für-Schritt |
| GitHub (Archiv) | botframework-sdk | https://github.com/microsoft/botframework-sdk | 2026-04-21 | letzte Issues, Community-Migrations-Erfahrung |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-21 | Hongyu | Migration auf neues Product Note Template (v2); Migrationspfad präzisiert (LUIS → CLU, QnA → AI Search) | — |
| 2026-04-21 | Hongyu | Initial-Erstellung der Deprecated-Note, watch: passive, Status: deprecated (EOS 2025-12-31) | MS Sunset-Ankündigung |
