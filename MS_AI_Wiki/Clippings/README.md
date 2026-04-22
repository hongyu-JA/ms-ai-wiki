---
type: clippings-readme
---

# Clippings — Rohmaterial aus dem Web

Ziel-Ordner für den **Obsidian Web Clipper** und für manuell abgelegte Artikel / Blogposts.

## Wie konfigurieren

In Obsidian Web Clipper:

```
Vault: MS_AI_Wiki
Folder: MS_AI_Wiki/Clippings
```

Oder im Clipper-Template direkt den Pfad `Clippings/` setzen.

## Was macht die Automation damit

Beim manuellen Sync (`./sync.ps1` / `./sync.sh`) oder beim Daily-Sync:

1. **Stage 0 · Classify** — `classify-clippings.ts` scannt diesen Ordner rekursiv.
2. Für jede `.md`-Datei: **Heuristik** auf Microsoft-AI-Bezug (Keywords: microsoft + agent/copilot/foundry/azure ai/entra/purview/dataverse/m365 usw.).
3. **Match** → Datei wird nach `MS_AI_Wiki/_Inbox/` verschoben und läuft dort durch die normale Pipeline (Keyword-Match → Claude-Patch → Note-Update → PR).
4. **Kein Match** → Datei bleibt hier liegen als deine private Clippings-Sammlung (Obsidian-tauglich, kein Pipeline-Eingriff).

## Unterschied zu `_Inbox/`

| Ordner | Zweck | Pipeline-Verhalten |
|--------|-------|--------------------|
| `Clippings/` | Alles was du aus dem Web clippst (auch nicht-Microsoft) | Wird **vorgefiltert**: nur MS-AI-Relevantes wandert weiter |
| `_Inbox/` | Kuratierte Eingangs-Schleuse für die Pipeline | Jede Datei hier wird zwingend verarbeitet (Update oder Reject) |

Du kannst direkt in `_Inbox/` ablegen, wenn du sicher bist dass es MS-AI-relevant ist. Der Classifier ist der "Puffer" für alles andere.

## Was nicht hierhin

- Persönliche Notizen (landen sonst in Git-History)
- Große Binärdateien
- Screenshots ohne begleitenden Text
