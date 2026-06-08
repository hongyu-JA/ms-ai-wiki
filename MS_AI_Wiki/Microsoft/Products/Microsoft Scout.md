---
watch: open
status: stub_build_2026
last_verified: 2026-06-08
azure_verified: 2026-06-08
source: build-2026-keynote
aliases:
  - MS Scout
  - Personal Microsoft Agent
moc:
  - '[[Microsoft MOC]]'
  - '[[Copilot MOC]]'
zuletzt_gesichtet: 2026-06-08
updated: 2026-06-08
---

# Microsoft Scout

*"Always-on personal agent" — vorgestellt auf Build 2026. Eine immer-aktive AI-Schicht, die Teams, Outlook, OneDrive, SharePoint und Geräte-Aktionen autonom orchestrieren kann.*

> **Analogie:** Wenn M365 Copilot der Assistent ist, der antwortet wenn man fragt, ist Microsoft Scout der proaktive Mitarbeiter, der von sich aus Aufgaben anstösst — Meetings zusammenfasst, Folgemails entwirft, Termine vereinbart, ohne dass man ihn beauftragt.

---

## ⚠ POC-Verifikation gegen echtes Azure (2026-06-08)

**Nicht über Azure verifizierbar** — Microsoft Scout ist ein **M365-/Windows-Feature** (always-on Personal-Agent), keine Azure-Ressource. Verifikation braucht **M365 Copilot Frontier-Tier** + idealerweise Windows 12 (beides Status unklar).

**⚠ Namens-Verwechslungsgefahr:** Im Azure-Model-Catalog existiert `Llama-4-Scout-17B-16E-Instruct` — das ist **Metas Llama-4-Scout-Modell, NICHT Microsoft Scout**. Nicht verwechseln im Kundengespräch.

**Beratungs-Konsequenz:** Als M365-Frontier-Feature kommunizieren. Der wichtigste Beratungs-Wert bleibt der **Scout-Governance-Workshop** (Tenant-Policies vor Rollout) — unabhängig davon testbar/verkaufbar.

> **Status bleibt `stub_build_2026`** — braucht Frontier-Lizenz + Windows 12.

---

## Was leistet es?

- **Proaktive Aktionen:** ohne explizite User-Anweisung — basierend auf Kontext (Meeting endet → Zusammenfassung erstellen)
- **Cross-Service-Orchestration:** ein Workflow spannt Outlook + Teams + OneDrive + SharePoint
- **Geräte-Aktionen:** kann auf Windows-Aktionen zugreifen (Datei öffnen, Notiz speichern)
- **Persönlicher Kontext:** lernt User-Gewohnheiten, passt sich an

## Status

- GA für Frontier-User (höchste M365 Copilot Stufe)
- Step-by-step Rollout für Business / Enterprise

## Wo passt es in die Architektur?

- **Layer:** SURFACE (zusammen mit M365 Copilot — Scout ist eine spezialisierte Erweiterung)
- **Verbindungen:**
  - `grounds-on` → Work IQ (für M365-Kontext), Microsoft Graph
  - `uses` → MAF (interne Logik), Microsoft IQ
  - `secured-by` → Entra Agent ID, Microsoft Execution Containers

## Beratungs-Relevanz für Journai

**Mittel — interessanter Demo-Hook, aber nicht für jeden Kunden.**

Use-Cases:
- Executive-Assistance: CEO-Office-Workflows (Meetings, Emails, Terminkoordination)
- Sales-Acceleration: automatische CRM-Updates nach Kunden-Meetings
- Knowledge-Worker-Automation: Mit-Erstellung von Berichten

Limit: setzt **Frontier-Tier-Lizenz** voraus — das ist teuer und nicht für jeden mittelständischen Schweizer Kunden geeignet. Beratungs-Empfehlung erst, wenn Lizenz-Voraussetzungen geklärt sind.

## Konkrete proaktive Aktionen (Build-Demo)

1. **Meeting endet** → Scout schreibt Zusammenfassung, schickt Email-Entwurf an Manager
2. **Email mit Termin-Anfrage** → Scout prüft Kalender, schlägt 3 Termine vor
3. **Datei wird in OneDrive gespeichert** → Scout klassifiziert, schlägt SharePoint-Ablage-Ort vor
4. **PR wird zugewiesen** → Scout prüft Diff, fasst Änderungen zusammen, schreibt Review-Notiz
5. **Reisekosten-Beleg in Mail** → Scout erkennt Beleg, erstellt Expensy-Eintrag mit OCR

## Pricing (Build-Keynote-Stand)

| Tier | Zugang zu Scout |
|---|---|
| **M365 Copilot Frontier** | Voll (alle Features) |
| **M365 Copilot Enterprise** | Schrittweiser Rollout Q3-Q4/2026 |
| **M365 Copilot Business** | Q1/2027 |
| **M365 Copilot Standard** | nicht im Plan |

Frontier-Tier-Preis: tba (vermutlich +$10-20 über bestehendem Copilot-Preis). Schätzung Schweizer Kunde mit 100 Frontier-Usern: zusätzlich **CHF 1'200-2'400/Monat**.

## Use-Cases (typische Schweizer Profile)

1. **C-Level / Executive-Office:** maximaler Nutzen, akzeptable Kosten
2. **Senior Sales** (Account Manager Banking-Vertriebs-Direktor): hoher Wert pro User
3. **Knowledge-Workers in M365-heavy Branchen:** Anwälte, Berater, Wissenschaft

**Nicht empfohlen für:** Front-Line-Mitarbeiter (Bank-Counter, Verkauf, Service) — Tools überdimensioniert für deren Workflows.

## Häufige Stolpersteine

1. **Proaktive Aktionen können nervig sein.** User-Feedback aus Preview: Scout schlägt zu oft "Möchtest du X tun?" vor. Vorsicht bei C-Level-Pitch — "noch ein AI-Notification-Stream" ist negativ.
2. **Cross-Service-Workflows brauchen alle Lizenzen.** Wenn Scout Outlook + Teams + OneDrive verbindet, müssen alle drei Microsoft-Tools im Tenant aktiv sein.
3. **Lernkurve:** Erst nach 2-3 Wochen anpasst Scout sich gut an User. Vor Demo den Kunden über diese Anpassungsphase aufklären.
4. **Custom-Workflows limitiert in Preview.** Personalisierung über Microsoft-Defaults hinaus erst später möglich.

## Compliance-Sprengstoff für Schweizer Kunden

⚠ **Das ist der wichtigste Beratungs-Punkt zu Scout.**

Scout läuft **always-on** — er beobachtet User-Aktivität kontinuierlich. Das hat Implikationen:

### Datenschutz (FADP / DSGVO)
- Personalisierung-Modell wird tenant-weit trainiert → User-Profile entstehen
- **Mitarbeiter-Tracking:** Scout kennt Arbeitszeiten, Produktivitäts-Muster, Kommunikations-Frequenz → indirektes Tracking
- **Betriebsvereinbarung empfohlen** vor Rollout — sonst Arbeitnehmer-Klagen-Risiko

### FINMA (Banken)
- Scout-Datenfluss über User-Aktivität ist Outsourcing-relevant
- Pre-Production: Conditional-Access-Policies in Entra setzen (z.B. "Scout nicht aktiv für Mitarbeiter im Trading-Floor")

### Microsoft Tenant-Admin-Steuerung
- Tenant-Admin **muss** vor Rollout: Scope der Scout-Aktivitäten definieren, sensitive Datenarten ausschliessen, Audit-Logging aktivieren
- Default-Konfiguration = "alles erlaubt" → das ist für regulierte Branchen zu offen

**Konkretes Beratungs-Angebot:** _"Scout-Governance-Setup-Workshop"_ — 1-2 Tage pro Tenant, ca. CHF 4-8k Beratungs-Honorar. Wird zur Pflicht ab Q3/2026, weil Scout für Enterprise-Kunden default-on kommt.

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Hands-on im Frontier-Tier (sobald Zugang verfügbar)
- [ ] Tenant-Admin-Governance-Optionen vollständig dokumentieren
- [ ] Schweizer Arbeitsrechts-Anwalt zu Mitarbeiter-Tracking-Implikationen konsultieren
- [ ] Scout-Governance-Setup-Workshop als Beratungs-Produkt formalisieren

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
