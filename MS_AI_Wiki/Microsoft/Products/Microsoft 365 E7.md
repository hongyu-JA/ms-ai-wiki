---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [M365 E7]
moc:
  - "[[Microsoft MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Microsoft 365 E7

*Das **kommerzielle Dach** über das Copilot-Portfolio — `E5 + Copilot + Entra Suite + Agent 365` zu **$99/user/month**. Angekündigt als „Frontier Tier" im M365-SKU-Stack. **EUR-Pricing ab 01.05.2026 erwartet** (Stand 2026-04).*

> **Analogie:** Was O365 E5 2017 war — das ultimative SKU-Bundle, das alles enthält, aber nur für Kunden sinnvoll, die auch alles nutzen.

---

## Einsatz

**JTBD:** When I M365 + AI + Identity + Agent-Governance zusammen kaufen will, I want to ein einheitliches Per-User-SKU, so I can nicht 5 Einzel-SKUs verhandeln + administrieren muss.

**Trigger-Signale:**
- „Wir planen Copilot + Agent 365 + Entra — einzeln oder E7?"
- „Unser E5 läuft aus — Upgrade-Pfad zu E7?"
- „EUR-Pricing für E7 — wann?"

**Szenarien:** (1) Full-Stack-M365-Kunde mit AI + Governance-Ambitionen, (2) Upgrade von E5 mit Copilot-Add-on, (3) Frontier-Programm-Teilnehmer.

**Empfehlung:** 🟢 wenn Kunde ≥ 80% der enthaltenen Komponenten realistisch nutzt. Sonst Einzel-SKUs günstiger.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | GA (Roll-Out 2026-Q1/Q2) |
| **Preis (USD)** | $99/user/month |
| **Preis (EUR)** | **Noch nicht publiziert** — erwartet ab 01.05.2026 |
| **Bundle-Inhalt** | [[Microsoft 365 E5]] + Copilot + [[Microsoft Entra Suite]] + [[Agent 365]] |
| **CSP-Promo** | 10% / 15% / 15% (Jahr 1 / 2 / 3) CSP-Rabatt-Staffel |
| **Upgrade-Pfad** | E5 + Copilot + Entra Suite Add-on → E7 mit Co-Term (Agent 365 kommt beim Switch hinzu) |
| **Hidden Costs** | Wave-3-Premium-Features (Cowork, Work IQ): *{TODO: separate Abrechnung oder inkludiert?}* |

### Claude-EU-Besonderheit (DSGVO-Implikation)

**Kritischer Hinweis (Arbeitsauftrag):** Claude-Default **deaktiviert** in EU/EFTA/UK — muss im Admin Center aktiv eingeschaltet werden. MS hat keinen Public Statement zum DSGVO-Hintergrund — Vorsichtshaltung nach aktueller Interpretation. Für regulierte Kunden Implikationen vor Aktivierung klären.

---

## Kernkonzept

### Bundle-Komposition

```
┌─────────────────────────────────────────────────────────┐
│ Microsoft 365 E7  —  $99/user/month                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Microsoft 365 E5                                       │
│    (Apps + Exchange + SharePoint + Teams + Power BI)    │
│                                                         │
│  + Microsoft 365 Copilot                                │
│    (inkl. Wave 3: Cowork, Edit, Multi-Model, Work IQ)   │
│                                                         │
│  + Microsoft Entra Suite                                │
│    (Entra ID P2 + Governance + Internet/Private Access  │
│     + Permissions Mgmt + Verified ID)                   │
│                                                         │
│  + Agent 365                                            │
│    (Agent-Governance, Entra Agent ID, Audit)            │
└─────────────────────────────────────────────────────────┘
```

### Wave 3 Features (Teil von E7)

- **Copilot Cowork** — Long-Running-Agent-Sessions, Claude-powered. EU-Availability prüfen.
- **Copilot Edit** — Agent-gestützte Dokumenten-Editierung
- **Multi-Model** — GPT- und Claude-Familie wählbar
- **Work IQ** — Personal Knowledge Layer

### Frontier Program

Early-Adopter-Programm: Kunden bekommen Preview-Zugang zu nicht-GA-Features + bezahlen Premium für Führungsanspruch. Unabhängig von E7 buchbar, aber E7-Kunden mit erhöhter Prio bei Einladung.

---

## Limitierungen & Fallstricke

- **E7 kaufen, aber Agent 365 nicht einsetzen** — $99 pro User, ohne Governance-Layer-Nutzung = Verschwendung
- **EUR-Pricing-Unsicherheit** — Kunden, die vor 2026-05 kaufen, haben USD-Wechselkurs-Risiko
- **Wave-3-Abhängigkeiten** — manche Wave-3-Features sind geografisch oder branchen-restricted
- **Claude-EU-Flag** — nicht kommuniziert aber wichtig für regulierte Branchen

### Fallstricke

- **„E7 ist teurer als E5 + Add-ons"** ist manchmal falsch — rechne gegen. *Gegenmittel: Pricing-Vergleichs-Rechnung pro Kunde.*
- **Agent 365 ist noch Preview bei E7-Launch** (GA 2026-05-01) — Kunden verstehen das nicht automatisch.

---

## Abgrenzung

| Frage | E7 | Alternative |
|-------|----|-------------|
| Nur Copilot, kein Agent 365 nötig | ❌ Overspend | ✅ E5 + Copilot |
| Nur Entra Suite für Zero Trust, kein Copilot | ❌ Overspend | ✅ E5 + Entra Suite |
| Alles + Governance + Wave 3 | ✅ | — |

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | M365 E7 Announcement | https://www.microsoft.com/en-us/microsoft-365/enterprise *{TODO: E7-URL verifizieren}* | 2026-04-22 |
| Docs | Licensing Docs E7 | https://learn.microsoft.com/en-us/microsoft-365/commerce/licenses/ | 2026-04-22 |
| Analyst | Directions on Microsoft — E7 Analyse | *{TODO: Link holen}* | 2026-04-22 |
| Analyst | SAMexpert | https://samexpert.com/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub mit Bundle-Komposition + CSP-Promos + Claude-EU-Flag |
