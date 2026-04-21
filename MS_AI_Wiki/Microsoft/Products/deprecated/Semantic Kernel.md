---
watch: passive
status: deprecated
last_verified: 2026-04-22
aliases: [SK]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Semantic Kernel  🟡 DEPRECATED — konsolidiert in [[Microsoft Agent Framework]]

*Semantic Kernel war Microsofts **Enterprise-orientiertes Agent-/Orchestrierungs-Framework** (.NET-first, Planner + Plugins). Mit MAF 1.0 (GA 2026-04-07) wurde es **konsolidiert** — die Kernabstraktionen wanderten in MAF, einige SK-APIs blieben nah, andere wurden neu gedacht. Kein hartes EOS-Datum (TBD), aber keine neuen Projekte auf SK.*

> **Analogie:** Wie LangChain v0.0.x → LangChain v1.0 — derselbe Konzept-Raum, andere API-Oberfläche. Wer darauf gebaut hat, muss migrieren, kann aber inkrementell.

---

## Einsatz

**Historischer JTBD:** When I mit .NET-Enterprise-Teams Agents + Plugins + Planner bauen wollte, I want to SK als opinionated Framework nutzen, so I can strukturiert Prompt-Flows zusammensetze.

**Heutiger Handlungsauftrag:** Bestandskunden-Migration zu [[Microsoft Agent Framework]].

**Empfehlung:** 🟡 **Migration planen, keine neuen Projekte**. Kein akuter EOS-Druck, aber Feature-Fluss endet — MAF bekommt alle Innovation.

---

## Status & Pricing

- **Status:** Deprecated (konsolidiert, nicht abgeschaltet)
- **EOS:** TBD — Microsoft hat kein hartes Datum kommuniziert (Stand 2026-04)
- **Pricing:** OSS, kostenlos — unverändert
- **Pfad:** → [[Microsoft Agent Framework]]

---

## Migrationspfad zu MAF

### Was bleibt nah

- **Kernel-Konzept** ähnelt MAF-`Agent`, aber Semantik und Lifecycle sind neu
- **Plugin-Konzept** → MAF-`Tool` (annotierte Funktionen), API-nah
- **KernelFunction-Annotation** (`[KernelFunction]`) wurde in MAF übernommen

### Was sich geändert hat

| Aspekt | Semantic Kernel | Microsoft Agent Framework |
|--------|------------------|----------------------------|
| Namespace | `Microsoft.SemanticKernel` | `Microsoft.AgentFramework` |
| Planner | Function Calling Planner, Handlebars Planner, Stepwise Planner | Orchestrator-Pattern (Sequential / Handoff / GroupChat) — Planner-Konzept zurückgestuft |
| Plugins | Dynamic aus Kernel | Tool-Collection auf Agent-Ebene |
| Threads | Kernel-Session | Thread als First-Class-Primitive |
| Memory | SK Memory Stores | externer State-Store (Cosmos, Redis) |

### Migrations-Schritte

1. `Microsoft.SemanticKernel` → `Microsoft.AgentFramework` Package-Swap
2. `Kernel` → `Agent` + `Thread`
3. Plugins 1:1 übertragen, KernelFunction-Annotations anpassen
4. Planner durch Orchestrator-Pattern ersetzen (Sequential am nächsten)
5. Memory-Store-Abstraktion durch externen State-Store ersetzen

### Runbook

*{TODO: Detail-Runbook mit Code-Beispielen in eigener Note oder MAF-Note — verlinken sobald erstellt.}*

---

## Limitierungen & Fallstricke

- **Kein Drop-in-Ersatz** — APIs sind nah, aber Plugin-System/Thread-Semantik sind neu
- **Planner-Konzept wird nicht mehr gepflegt** — Orchestrator-Pattern ist der Weg
- **Python-SK nicht gleich weit** — Python-Migration oft weniger schmerzhaft, weil weniger SK-Historie

### Fallstricke

- **Big-Bang-Migration** — Teams unterschätzen die Unterschiede. *Gegenmittel: Single-Plugin-Pilot → Inkrement.*
- **SK-Memory-Stores 1:1 übernehmen wollen** — MAF hat das Konzept bewusst ausgelagert.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| GitHub Archiv | microsoft/semantic-kernel | https://github.com/microsoft/semantic-kernel | 2026-04-22 |
| Migration Guide | SK → Agent Framework | https://learn.microsoft.com/en-us/agent-framework/migrate-from-semantic-kernel | 2026-04-22 |
| devblogs | Semantic Kernel Blog | https://devblogs.microsoft.com/semantic-kernel/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub — Migration-Pfad zu MAF |
