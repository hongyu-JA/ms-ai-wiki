---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Microsoft IQ Suite
  - MS IQ
  - IQ Familie
moc:
  - '[[Microsoft MOC]]'
  - '[[Data & Knowledge MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Microsoft IQ

*Auf Build 2026 zur Marken-Familie ausgebaut — IQ-Services bieten kuratiertes, regelkonformes Kontextwissen für Agenten. Vier Hauptbestandteile: Foundry IQ, Work IQ, Fabric IQ, Web IQ.*

> **Analogie:** Wenn Foundry Models das "Gehirn" und Foundry Agent Service der "Körper" eines Agenten sind, dann ist Microsoft IQ die "Bibliothek mit Sicherheits-Aufseher" — der Zugriff auf richtige, autorisierte, aktuelle Daten.

---

## Die vier IQ-Bausteine

| IQ-Service | Datenbereich | Status |
|---|---|---|
| **[[Foundry IQ]]** | Enterprise-Knowledge in Azure AI Search (Wrapper) | GA (bestand schon, Build-Update: jetzt vollständig GA) |
| **[[Work IQ]]** | M365 Kontext: Personen, Meetings, Files, Chats, Workflows | GA (neu auf Build 2026) |
| **[[Fabric IQ]]** | Business-Daten und Ontologie-Reasoning aus Microsoft Fabric | GA (neu auf Build 2026) |
| **[[Web IQ]]** | Internet-Grounding, MCP-nativ | GA (neu auf Build 2026) |

## Was unterscheidet "IQ" von rohem Datenzugriff?

Microsoft IQ-Services sind **kuratierte** Grounding-Schichten — sie bringen drei Mehrwerte über reinen API-Zugriff hinaus:

1. **Berechtigungs-Respekt:** ACL-Trimming auf Item-Ebene (User sieht nur, was er darf)
2. **Aktualitäts-Garantie:** automatische Re-Indexierung, Frische-Tracking
3. **Compliance-Hooks:** Audit-Logging, Sensitivity-Labels, Purview-Integration

## Wo passen sie in die Architektur?

- **Layer:** KNOWLEDGE
- **Verbindungen:**
  - `grounds-on` ← MAF, Copilot Studio, M365 Copilot
  - `calls` → Foundry Models (für Embeddings, Re-Ranking)
  - `secured-by` → Microsoft Purview (Sensitivity-Labels, DLP)

## Beratungs-Relevanz für Journai

**Hoch — vereinheitlicht unsere "wie groundet der Agent?"-Erklärung.**

Bisher mussten wir Kunden erklären, dass es viele Knowledge-Quellen gibt (Search, Graph, Connectors, Dataverse) und der Architekt die richtige wählen muss. Mit IQ-Familie wird die Beratung einfacher:

- **Work IQ** → wenn der Use-Case M365-zentrisch ist
- **Fabric IQ** → wenn Business-Daten in Lakehouse liegen
- **Web IQ** → wenn externe Web-Recherche nötig ist
- **Foundry IQ** → wenn enterprise-eigene Dokumente nicht in M365 stehen

Das ist ein klares Entscheidungs-Baum-Muster, das Kunden sofort verstehen.

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Sub-Produkt-Files für Work IQ, Fabric IQ, Web IQ ergänzen
- [ ] Pricing-Modell der einzelnen IQs verstehen (sind sie in Foundry-Lizenz inkludiert?)
- [ ] Konkrete API-Surface dokumentieren
- [ ] Vergleich mit direktem AI-Search-Zugriff (wann lohnt IQ-Wrapper, wann direkt?)

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
- [theneuron.ai — Everything announced](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
