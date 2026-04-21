---
type: moc
tags: [moc, microsoft]
last_verified:   # YYYY-MM-DD
---

<!--
=====================================================================================
MOC TEMPLATE-ANLEITUNG (beim Instanziieren diesen Kommentar-Block entfernen)
=====================================================================================

ZWECK EINER MOC
  Eine MOC (Map of Content) ist ein thematischer Einstiegspunkt im Obsidian-Vault.
  Sie ist KEIN Produkt und KEINE Zusammenfassung einzelner Produkte. Stattdessen:

    1. Sie bündelt Produkte, die zusammen ein Geschäftsfeld beschreiben
    2. Sie erklärt ZUSAMMENHÄNGE zwischen Produkten (Stack-Diagramme, Decision-Trees,
       Eskalationsleitern) - das kann keine Single-Product-Note leisten
    3. Sie dient als Navigations-Hub: von einem Thema aus schnell in die
       passenden Produkte springen
    4. Sie bietet Querverweise zu verwandten MOCs, damit das Gesamt-Ökosystem
       verknüpft bleibt

UNTERSCHIED ZU PRODUCT-NOTE
  - Product-Note = beschreibt EIN Produkt vollständig (Einsatz, Pricing, Kernkonzept)
  - MOC         = beschreibt eine THEMATISCHE GRUPPE und deren Binnenlogik

VERWENDUNG
  Produkte verlinken per `moc:`-Frontmatter auf die MOCs, zu denen sie thematisch
  gehören. Die MOC wiederum listet ihre Produkte unter „Produkte in dieser MOC"
  (manuell kuratiert oder per Dataview-Query).

PFLICHT-SEKTIONEN:
  - Zweck
  - Landkarte
  - Produkte in dieser MOC
  - Quellen & Monitoring

OPTIONAL:
  - Eskalationsleiter / Entscheidungslogik
  - Querverweise zu anderen MOCs
  - Glossar

=====================================================================================
-->

# {Thema} MOC

*{1–3 Sätze: Was ist das Thema dieser MOC? Welches Geschäftsfeld/welche Produktgruppe bündelt sie? Warum gibt es diese Gruppierung - was verbindet die enthaltenen Produkte?}*

---

## Zweck

*{Ausführlicher: Für welche Beratungssituation ist diese MOC der richtige Einstieg? Welche Fragen beantwortet sie? Wann lohnt es sich, hier zu starten, statt direkt in ein Produkt zu springen?}*

---

## Landkarte

*{Das semantische Modell der Gruppe. Eine Visualisierung (ASCII-Diagramm, Tabelle, Hierarchie) die zeigt, wie die Produkte zueinander stehen. Je nach Thema unterschiedlich - wähle die Darstellung, die das Feld am klarsten macht:*

*- **Stack-Diagramm** (z.B. SDKs: MAF über M365 Agents SDK über Teams SDK)*
*- **Eskalationsleiter** (z.B. Copilot: Agent Builder → Declarative Agents → Custom Engine Agents)*
*- **Kategorien-Matrix** (z.B. Security: Prevention / Detection / Response × M365 / Azure)*
*- **Decision-Tree** (z.B. Licensing: Kunde braucht X → welche SKU?)}*

```
{ASCII-Diagramm oder Mermaid-Block}
```

---

## Produkte in dieser MOC

*{Kurator-Liste aller Produkte, die zu diesem Thema gehören. Pro Produkt 1 Zeile: Name + 1-Satz-Positionierung + Watch-Level. Sortiert nach Wichtigkeit.}*

| Produkt | Was es ist (1 Satz) | Watch |
|---------|---------------------|-------|
| [[Produkt X]] | *kurze Positionierung* | close |
| [[Produkt Y]] | *...* | standard |
| [[Produkt Z]] | *...* | passive |

*{Alternative: Dataview-Query, die automatisch alle Produkte zeigt, deren Frontmatter auf diese MOC verweist:}*

```dataview
TABLE watch, status, last_verified
FROM "Microsoft/Products"
WHERE contains(moc, this.file.link)
SORT watch ASC
```

---

## Eskalationsleiter / Entscheidungslogik

*{Wenn das Thema eine klare „Wann-welches"-Logik hat, hier ausformulieren. Beispiele:*

*- Copilot: Wann Agent Builder, wann Declarative Agent, wann Custom Engine Agent?*
*- SDKs: Wann MAF, wann M365 Agents SDK, wann Foundry SDK?*
*- Security: Wann Purview, wann Defender, wann beide?}*

| Kundensituation | Produkt der Wahl | Begründung |
|-----------------|------------------|------------|
|                 |                  |            |

---

## Querverweise zu anderen MOCs

*{Welche anderen MOCs sind thematisch benachbart? Welche Überschneidungen gibt es? 1 Zeile pro Verweis.}*

- [[Andere MOC 1]] - *Beziehung*
- [[Andere MOC 2]] - *Beziehung*

---

## Offizielle Sammelquellen

*{Microsoft-Seiten, die dieses ganze Feld beschreiben - nicht Einzelprodukt-Seiten, sondern Overview-/Hub-Pages, die mehrere Produkte zusammen behandeln.}*

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | *{z.B. learn.microsoft.com/azure/foundry für „Azure AI MOC"}* | | YYYY-MM-DD |
| MS Blog-Serie | | | YYYY-MM-DD |
| Analyst-Übersicht | | | YYYY-MM-DD |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| *YYYY-MM-DD* | *{Kürzel}* | *Initial-Erstellung der MOC* |
