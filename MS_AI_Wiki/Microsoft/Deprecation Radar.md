---
type: meta
tags: [deprecation, radar]
created: 2026-04-21
updated: 2026-04-21
---

# Deprecation Radar

Zentrale Übersicht aller Microsoft-AI-Deprecations mit **Migrationsdruck**, **Ersatz-Produkt** und **Cut-off-Datum**. Bestandskunden-Beratung: hier nachschlagen, bevor man ein Produkt empfiehlt.

## Legende

- 🔴 **akut** — EOS binnen 3 Monaten oder bereits überschritten
- 🟡 **mittel** — EOS in 3–12 Monaten, Migration planen
- 🟢 **entspannt** — EOS > 12 Monate, Awareness reicht

## Aktive Migrationen

| Produkt | Status | Ersetzt durch | EOS | Migrationspfad | Owner |
| ------- | ------ | ------------- | --- | -------------- | ----- |
| [[deprecated/Bot Framework]] | 🔴 | [[M365 Agents SDK]] | 2025-12-31 | Channel-Mapping + TeamsFx-Ersatz, Activity-Protocol bleibt kompatibel | Hongyu |
| [[deprecated/Semantic Kernel]] *(geplant)* | 🟡 | [[Microsoft Agent Framework]] | TBD | API weitgehend kompatibel, Kernel→AgentThread | — |
| [[deprecated/AutoGen]] *(geplant)* | 🟡 | [[Microsoft Agent Framework]] | TBD | Research-Features bleiben in MAF experimental | — |

## Legacy-Beobachtung (kein Handlungsdruck)

| Produkt | Status | Hinweis |
| ------- | ------ | ------- |
| Prompt Flow | 🟡 | Legacy, Migration bis 01/2027 |
| Azure ML v1 | 🟡 | Migrations-Kandidat, kein festes EOS |

## Changelog

| Datum | Änderung | Quelle |
| ----- | -------- | ------ |
| 2026-04-21 | Radar angelegt | — |
