---
type: inbox-readme
---

# Inbox — manuelle Einspeisung in die Auto-Sync-Pipeline

Hier kannst du Markdown-Dateien ablegen, die beim nächsten Daily-Sync automatisch geprüft und in die Wissensbasis eingearbeitet werden.

## Wie reinkommt

- **Obsidian Web Clipper:** Als Ziel-Ordner `MS_AI_Wiki/_Inbox` wählen.
- **Manuelle Datei:** Einfach `.md`-Datei direkt in diesen Ordner legen (oder in einen beliebigen Unterordner, außer `_processed/` und `_rejected/`).

## Welches Format funktioniert

Minimal: nur Text. Alles andere ist optional.

Empfohlenes Format mit Frontmatter:

```markdown
---
source_url: https://learn.microsoft.com/en-us/azure/...
source_title: "Offizieller Titel des Artikels"
---

# Titel (wird als Item-Title verwendet wenn Frontmatter fehlt)

Haupttext / Zusammenfassung / Notizen.
```

Ohne Frontmatter wird der Dateiname als Titel und der erste HTTPS-Link im Body als `source_url` genutzt.

## Was passiert im Daily-Sync

1. **Fetch:** Inbox-Reader liest alle `.md`-Dateien (rekursiv, außer `_processed/` und `_rejected/`).
2. **Filter:** Inbox-Items werden gegen `products.yaml` keyword-gematcht.
   - **Match:** wird wie ein normaler RSS-Treffer behandelt → Update des existierenden Product Notes.
   - **Kein Match, aber Microsoft-AI-verdächtig:** als `new_product_candidate` markiert → im PR wird ein Hinweis eingefügt, damit du entscheidest, ob ein neues Product anzulegen ist.
   - **Kein Microsoft-AI-Bezug:** das File wird in `_rejected/` verschoben mit Datum-Unterordner.
3. **Patch:** Claude baut ein `section_patches`- / `moc_updates`-Envelope.
4. **Apply:** Patches werden angewendet, der PR erstellt → du reviewst und merge-st.
5. **Archive:** Die verarbeitete Inbox-Datei wird nach `_processed/YYYY-MM-DD/` verschoben, mit ergänztem `processed_at` + `classification`-Frontmatter.

## Einwilligungs-Regel

Änderungen laufen **immer** über einen Pull Request — nichts wird ungefragt in `main` gemerged. Du entscheidest per PR-Review.

## Nicht hier ablegen

- Dateien ohne Microsoft-AI-Bezug (werden automatisch aussortiert, verbrauchen aber Pipeline-Zeit).
- Große PDFs oder Binärdateien — nur Markdown/Text-Formate werden gelesen.
- Persönliche Notizen oder Geheimnisse (ein PR wird öffentlich in der Git-History sichtbar).
