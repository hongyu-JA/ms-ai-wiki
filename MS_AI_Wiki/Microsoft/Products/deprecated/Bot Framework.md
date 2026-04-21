---
type: product-note
slug: bot-framework
aliases: [Bot Framework v4, BF]
tier: 2
watch: passive
status: deprecated
lifecycle: deprecated
vendor: Microsoft
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
tags: [deprecated, legacy, agents]
created: 2026-04-21
updated: 2026-04-21
zuletzt_gesichtet: 2026-04-21
eos_date: 2025-12-31
replaced_by: "[[M365 Agents SDK]]"
---

# Bot Framework  🔴 **DEPRECATED — EOS 2025-12-31**

> [!danger] Akuter Migrationsdruck
> **End of Support: 2025-12-31** (bereits überschritten zum Zeitpunkt dieser Note).
> Bestandskunden **müssen** auf **M365 Agents SDK** migriert haben. Alle Support-Tickets werden von Microsoft abgelehnt.

## 1. Elevator Pitch + Analogie

Bot Framework war über ein Jahrzehnt das Microsoft-SDK für Chatbots in Teams, Web, Skype. **Ab 2025-12-31 nicht mehr unterstützt** — Nachfolger ist [[M365 Agents SDK]]. Analogie: Wie Bot Framework 3 zu Bot Framework 4 damals — nur dass dieses Mal das Activity-Protocol bewusst erhalten bleibt.

## 2. Einsatz

**Job-to-be-done (historisch):** Chatbot in Teams/Web/Slack deployen mit einheitlichem Activity-Protocol.

**Aktueller Handlungsauftrag:**
- Bestandskunden-Audit durchführen: welche Bots laufen noch auf BF?
- Migrationsplan aufsetzen (siehe unten).
- **Keine Neu-Entwicklung auf BF** — einzige legitime Ausnahme: kritischer Hot-Fix in bestehendem BF-Bot, wenn Migration nachweislich > 4 Wochen braucht.

**Empfehlung:** 🔴 — sofortige Migrationsplanung für alle Bestandskunden.

## 3. Status & Pricing

- **Status:** Deprecated
- **EOS:** 2025-12-31 (bereits eingetreten)
- **Nachfolger:** [[M365 Agents SDK]]
- **Hosting-Kompatibilität:** Azure Bot Service unterstützt BF-Bots bis zum Vertragsende laufender Kunden, keine neuen Registrierungen.

## 4. Migrationspfad zu M365 Agents SDK

### Was bleibt

- **Activity-Protocol** bleibt — Nachrichten-Schema identisch, Channels (Teams, WebChat, Direct Line) kompatibel.
- **TurnContext**-Konzept bleibt im Kern, API-Signatur leicht anders.
- **Adapter-Pattern** bleibt konzeptionell.

### Was sich ändert

| Aspekt | Bot Framework (alt) | M365 Agents SDK (neu) |
| ------ | ------------------- | --------------------- |
| Namespace / Package | `Microsoft.Bot.Builder` | `Microsoft.Agents.*` |
| Dialog-System | Waterfall / Prompts | entfällt — MAF übernimmt Logik |
| State-Storage | BotFrameworkAdapter + Storage | Agents SDK Storage Provider |
| Channel-Registrierung | Azure Bot Resource | Agents-Ressource (neuer ARM-Typ) |
| Teams-Spezifika | Teams Extension | Teams SDK (separat) |
| LUIS / QnA | eingebunden | migrieren auf Azure AI Language + MAF-Tools |

### Schritte (pro Bot)

1. Activity-Protocol-Handler isolieren — sollte schon sein, wenn Clean Code.
2. Dialogs auf MAF-Agent + Threads umbauen (größter Teil der Arbeit).
3. Package-Referenzen tauschen, Adapter-Init anpassen.
4. Teams-spezifische Features in Teams SDK auslagern.
5. Deployment-Ziel auswählen: Azure App Service, Container Apps, Foundry Agent Service.
6. Smoke-Test auf Bot-Emulator-Nachfolger.

### TeamsFx-Ersatz

Alt-Projekte aus TeamsFx werden auf **M365 Agents Toolkit** migriert (VS Code Extension). Vorlagen sind teilweise 1:1 übertragbar.

## 5. Limitierungen & Fallstricke bei der Migration

- **Fallstrick:** Waterfall-Dialoge 1:1 nachbauen wollen — **Gegenmittel:** Agent-Modell denken, Dialog-Graph durch Tool-Calls ersetzen.
- **Fallstrick:** Channel-Adapter-Logik in Agent-Code verweben — **Gegenmittel:** Saubere Schicht-Trennung, M365 Agents SDK übernimmt Adapter.
- **Fallstrick:** QnA-Maker-Abhängigkeit ignorieren — **Gegenmittel:** QnA-Maker ist ebenfalls retired, parallel auf Azure AI Search + RAG umstellen.

## 6. Offizielle Referenzen & Monitoring

### Primary

| Quelle | URL | Zuletzt gesichtet |
| ------ | --- | ----------------- |
| EOS-Ankündigung | https://learn.microsoft.com/en-us/azure/bot-service/bot-framework-sunset | 2026-04-21 |
| M365 Agents SDK Docs | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/ | 2026-04-21 |
| Migration Guide | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/migrate-from-bot-framework | 2026-04-21 |
| GitHub (Archiv) | https://github.com/microsoft/botframework-sdk | 2026-04-21 |

## 7. Changelog

| Datum | Autor | Änderung | Quelle |
| ----- | ----- | -------- | ------ |
| 2026-04-21 | Hongyu | Deprecated-Note mit Migrationspfad angelegt | — |
