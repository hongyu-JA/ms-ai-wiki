---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [M365 E7, Frontier Suite]
moc:
  - "[[Microsoft MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Microsoft 365 E7

*Das **kommerzielle Dach** über das Copilot-Portfolio — `E5 + Copilot + Entra Suite + Agent 365` zu **$99/user/month** (mit Teams) / **$90,45** (ohne Teams). Offiziell **„Frontier Suite"**. GA **2026-05-01**. EUR-Pricing im Mai 2026 erwartet.*

> **Analogie:** Was O365 E5 2017 war — das ultimative SKU-Bundle, das alles enthält, aber nur für Kunden sinnvoll, die auch ≥ 3 von 4 Komponenten nutzen.

---

## Einsatz

**JTBD:** When I M365 + AI + Identity + Agent-Governance zusammen kaufen will, I want to ein einheitliches Per-User-SKU, so I can nicht 4 Einzel-SKUs verhandeln + administrieren muss.

**Trigger-Signale:**
- „Wir planen Copilot + Agent 365 + Entra — einzeln oder E7?"
- „Unser E5 läuft aus — Upgrade-Pfad zu E7?"
- „EUR-Pricing für E7 — wann?"

**Szenarien:** (1) Full-Stack-M365-Kunde mit AI + Governance-Ambitionen, (2) Upgrade von E5 mit Copilot-Add-on, (3) Frontier-Programm-Teilnehmer mit Wave-3-Preview-Features.

**Empfehlung:** 🟢 wenn Kunde **≥ 3 von 4 Komponenten** (E5, Copilot, Entra Suite, Agent 365) realistisch nutzt. Sonst Einzel-SKUs + CSP-Promos prüfen.

---

## Status & Pricing

### Das Bundle

```
┌──────────────────────────────────────────────────────────────────┐
│                 Microsoft 365 E7                                 │
│                 (GA 2026-05-01, „Frontier Suite")                │
│                                                                  │
│                 $99/user/month mit Teams                         │
│                 $90,45/user/month ohne Teams                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│    E5 Apps + Core              $60   ←  Office + Teams + E-Mail │
│    + Microsoft 365 Copilot     $30   ←  Wave 3 (Cowork, Edit,   │
│                                          Multi-Model, Work IQ)   │
│    + Entra Suite               $12   ←  Identity Bundle         │
│    + Agent 365                 $15   ←  Agent Governance        │
│    ─────────────────          ────                               │
│      Einzelsumme:             $117                               │
│                                                                  │
│      → E7-Preis:              $99    (≈ 15 % Bundle-Rabatt)     │
└──────────────────────────────────────────────────────────────────┘
```

### Aktuelle Pricing-Matrix (Q1/Q2 2026)

| Detail | Wert | Quelle |
|--------|------|--------|
| **Status** | GA Rollout 2026-05-01, Wave-3-Features verfügbar | [CNBC 2026-03-09](https://www.cnbc.com/2026/03/09/microsoft-office-365-e7-copilot-ai.html) |
| **Preis (USD)** | $99/user/month (mit Teams) · $90,45 (ohne Teams) | [SAMexpert E7 Guide](https://samexpert.com/microsoft-365-e7-licensing-guide/) |
| **Preis (EUR)** | *{UNCLEAR: noch nicht publiziert — erwartet im Lauf Mai 2026}* | — |
| **Upgrade-Pfad** | E5 + Copilot + Entra Suite-Add-on → E7 mit Co-Term (Agent 365 kommt beim Switch hinzu) | SAMexpert |
| **EUR-Ausblick Juli 2026** | EUR ~7 % günstiger erwartet (Wechselkurs-Anpassung) | [blog.easi.net](https://blog.easi.net/en/microsoft-365-in-2026-new-capabilities-copilot-skus-and-pricing) |

### CSP-Promos (aktuell bis 2026-06-30)

> **Korrektur zur v1-Note**: die frühere „10% / 15% / 15%"-Staffel ist in aktuellen MS-CSP-Announcements **nicht 1:1 bestätigt** — aktuelle Realität ist volumenbasiert:

| Promo | Rabatt | Zielgruppe |
|-------|--------|------------|
| **„Copilot for All"** | **30%** < 1000 Lizenzen · **40%** ≥ 1000 Lizenzen *(Schwelle 2026-04-13 von 1500 auf 1000 gesenkt)* | Copilot-Rollouts (auch relevant für E7) |
| **M365 E5** new-to-offer | **15%** auf 1-Jahres-Term · **10%** auf 3-Jahres-Term | E5-Upgrader (Stepstone zu E7) |

Quelle: [techcommunity: Key promotional offers in CSP extended through 2026-06-30](https://techcommunity.microsoft.com/blog/partnernews/key-promotional-offers-in-csp-extended-through-june-30-2026/4478937) · [Partner Center April 2026](https://learn.microsoft.com/en-us/partner-center/announcements/2026-april).

---

## Kernkonzept

### Bundle-Komponenten im Detail

| Komponente | Rolle im Bundle | Standalone-Preis | Eigene Note |
|------------|-----------------|-------------------|-------------|
| **M365 E5** | Office-Apps + Exchange + SharePoint + Teams + Power BI + Security-Features | $60/user | *{TODO: eigene Note bei Bedarf}* |
| **Microsoft 365 Copilot** | AI-Produktivitäts-Layer mit Wave 3 (Cowork, Edit, Multi-Model, Work IQ) | $30/user | [[Microsoft 365 Copilot]] |
| **Microsoft Entra Suite** | Identity-Bundle: Entra ID P2 + Governance + Internet/Private Access + Permissions Mgmt + Verified ID | $12/user | [[Microsoft Entra Suite]] |
| **Agent 365** | Agent-Governance, [[Entra Agent ID]], Audit (GA 2026-05-01) | $15/user | [[Agent 365]] |

### Wave 3 Features (Teil von E7 via Copilot-Komponente)

Alle Wave-3-Features sind Teil der Copilot-Lizenz — keine Extra-Kosten innerhalb E7. Siehe [[Microsoft 365 Copilot]] für Details zu:

- **Copilot Cowork** (Long-Running, Claude-powered)
- **Copilot Edit** (agentisch in Word/PowerPoint/Excel)
- **Multi-Model** (GPT/Claude/Grok-[US])
- **Work IQ** (Data + Memory + Inference)

### Frontier Program

Early-Adopter-Programm: Preview-Zugang zu nicht-GA-Features + Premium-Pricing für Führungsanspruch. **Unabhängig von E7 buchbar**, aber E7-Kunden mit erhöhter Prio bei Einladungen. Cowork lief zuerst im Frontier-Programm.

---

## Kunden-Entscheidungs-Baum

```
                  Kunde fragt nach „E7 oder nicht?"
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │ Wie viele der 4 Komponenten gewünscht?  │
        │ (E5 · Copilot · Entra Suite · Agent365) │
        └─────────────────────────────────────────┘
              │              │              │
           1–2 ▼           3 ▼           4 ▼
    ┌──────────────┐  ┌─────────┐  ┌───────────────┐
    │ Einzelkauf + │  │ Rechnen │  │ 🟢 E7 nehmen  │
    │ CSP-Promos   │  │ → oft   │  │ (Bundle-Math  │
    │ günstiger    │  │ E7      │  │ klar positiv) │
    └──────────────┘  └─────────┘  └───────────────┘
                           │
                           ▼
                  ┌──────────────────────┐
                  │ Ja: Agent 365 will   │
                  │ der Kunde WIRKLICH   │
                  │ deployen in <6 Mon.? │
                  └──────────────────────┘
                      Ja ▲         ▼ Nein
                         │         │
                      E7 ◀─┘    E5+Copilot+Entra (warten)
```

---

## Kritischer Hinweis — Claude-EU-Flag (DSGVO)

Auch wenn E7 die Copilot-Lizenz enthält und damit **Multi-Model (inkl. Claude)** verfügbar ist:

**Claude-Default in EU/EFTA/UK: deaktiviert.** Muss im M365 Admin Center aktiv freigeschaltet werden. MS-Begründung: *„Anthropic models are out of scope for the EU Data Boundary at this time."*

**Konsequenzen für Kunden-Briefing:**
- Vor Aktivierung: **aktualisierte DPIA** (Anthropic läuft jetzt unter MS-DPA statt separaten Anthropic-Terms)
- Für regulierte Branchen: Vorsichtshaltung empfehlen, vorerst Default-OFF lassen
- **Flex Routing by-default ON** (siehe [[Microsoft 365 Copilot]]) — separate Entscheidung

---

## Limitierungen & Fallstricke

- **E7 kaufen ohne Agent 365 einzusetzen** — $99 pro User ohne den Governance-Layer zu nutzen = Verschwendung
- **EUR-Pricing-Unsicherheit** — Kunden, die vor Mai 2026 kaufen, haben USD-Wechselkurs-Risiko
- **Wave-3-Abhängigkeiten** — manche Wave-3-Features sind geografisch oder branchen-restricted
- **Claude-EU-Flag** — nicht kommuniziert, aber wichtig für regulierte Branchen

### Fallstricke

- **„E7 ist immer teurer"** ist manchmal falsch — rechne gegen. *Gegenmittel: Pricing-Vergleichs-Rechnung pro Kunde (s. Entscheidungs-Baum).*
- **Agent 365 noch Preview bei E7-Launch** (GA 2026-05-01) — Kunden verstehen das nicht automatisch.
- **CSP-Promo-Missverständnisse** — neue volumenbasierte Struktur (30/40%) wird oft mit alten 10/15/15%-Annahmen verwechselt.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft 365 Copilot]] | Kern-Bestandteil des Bundles (Copilot-Lizenz inkludiert) | GA | Wave-3-Features (Cowork, Edit) teils Preview, EU-Opt-in für Claude |
| [[Microsoft Entra Suite]] | 5-Komponenten-Bundle (ID Governance, ID Protection, Internet Access, Private Access, Verified ID) | GA | Permissions Management EOL Nov 2025 — nicht mehr Teil |
| [[Agent 365]] | GA 2026-05-01 — Governance-Layer im E7-Bundle inkludiert | GA ab 01.05.2026 | Entra Agent ID als Unter-Plane konfigurieren |
| [[Microsoft Purview]] | Purview Suite ($12 einzeln) ist **nicht** in E7 — separater Add-On nötig | GA | Häufiges Missverständnis — klar kommunizieren |
| [[Defender for AI]] | Teil Defender XDR-Stacks — hier **nicht** in E7 inkludiert | GA | separat über Defender-XDR-Add-on / E5 Security |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| CSP-Reseller (z. B. Bechtle, SoftwareONE) | Promo-Staffeln 10%/15%/15% Jahr 1/2/3 | GA | EUR-Pricing ab 01.05.2026 — vor-Kauf-Wechselkurs-Risiko |
| Directions on Microsoft / SAMexpert | unabhängige Lizenz-Beratung | GA | nur für große Deals kosten-wert; SMB eher Eigen-Analyse |
| SaaS-License-Manager (z. B. Torii, Bettercloud) | E7-Adoption messen | GA | Integration mit M365 Admin Graph; User-Activity-Signale |

### APIs / Protokolle

- **M365 Admin Graph** (`/users`, `/subscribedSkus`) für Lizenz-Zuweisung
- **Azure Billing API** für Usage-Reports (CSP) — Daily granularity
- **Copilot Usage API** (Beta) — Adoption-Metrics pro Nutzer

---

## Abgrenzung & Wettbewerb

### Microsoft-intern: Wann E7 vs. E5 + Einzel-Add-ons?

| Frage-Situation | E7 | E5 + Einzel-Add-ons |
|-----------------|----|--------------------|
| „Brauchen alle User Agent 365 + Entra Suite + Copilot?" | ✅ E7 — Bundle-Rabatt + ein SKU | ⚠️ E5 + einzeln = administrativer Overhead + oft teurer |
| „Nur ausgewählte User brauchen Copilot (z. B. 50 von 500)" | ⚠️ E7 unwirtschaftlich | ✅ E5 + Copilot nur für die 50 |
| „Regulierte Branche, alle User brauchen Governance" | ✅ E7 — Agent 365 tenant-weit ausrollen | ⚠️ wäre sehr teuer als Einzelbuchung |
| „Noch keine Agents in Produktion" | ⚠️ E7 zahlt man für ungenutzte Features | ✅ E5 mit Copilot als Einstieg, E7 später |

### Externe Alternativen

| Dimension | **Microsoft 365 E7** | Google Workspace Enterprise Plus + Gemini | Best-of-Breed (Okta + Google + Slack + Notion + separately) |
|-----------|----------------------|------------------------------------------|-------------------------------------------------------------|
| **Fokus** | Bundled M365 + AI + Identity + Agent-Governance | Google-native Produktivität + Gemini | Flexible Auswahl, keine All-in-One-Logik |
| **Pricing** | $99/user/month | ~$30 + Gemini Add-on | variabel, oft höher im Bundle |
| **EU-Data-Residency** | EU Data Boundary aktiv (differenziert) | Google Workspace EU Region | vendor-abhängig |
| **Integrationstiefe in MS** | maximal | keine (konkurrierendes Ökosystem) | variabel, oft manuell |
| **Agent-Governance** | ✅ Agent 365 + Entra Agent ID | teilweise (Gemini Governance-Features) | muss selbst gebaut werden |
| **Stärke** | Single-Vendor-Bundle, Enterprise-Rabatt, Agent-Ready | nahtlos für Google-Kunden | maximale Flexibilität |
| **Schwäche** | Lock-in; zahlt für ungenutzte Features | kein MS-Ökosystem-Zugriff | Integrations-Komplexität, höhere Gesamtkosten |

### Empfehlungs-Regel

**Wir nehmen E7** wenn Kunde (a) M365-native ist, (b) mehr als ~100 User hat, und (c) Agent-Governance oder Entra Suite bereits plant. **Sonst** bleibt E5 + Copilot-Einzel-Lizenz der wirtschaftlichere Einstieg, mit späterem Upgrade-Pfad zu E7 via Co-Terming.

---

## Offizielle Referenzen & Monitoring

### Primary

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | M365 Enterprise | https://www.microsoft.com/en-us/microsoft-365/enterprise | 2026-04-22 |
| Licensing Docs | M365 Commerce Licenses | https://learn.microsoft.com/en-us/microsoft-365/commerce/licenses/ | 2026-04-22 |
| CSP Promos | Extended Promos Blog | https://techcommunity.microsoft.com/blog/partnernews/key-promotional-offers-in-csp-extended-through-june-30-2026/4478937 | 2026-04-22 |
| Partner Center | April 2026 Announcements | https://learn.microsoft.com/en-us/partner-center/announcements/2026-april | 2026-04-22 |

### Secondary

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| SAMexpert — M365 E7 Licensing Guide | https://samexpert.com/microsoft-365-e7-licensing-guide/ | Detaillierte Bundle-Math |
| SAMexpert — Agent 365 Licensing | https://samexpert.com/agent-365/ | Agent-365-Standalone-Pricing |
| CNBC — E7-Ankündigung 2026-03-09 | https://www.cnbc.com/2026/03/09/microsoft-office-365-e7-copilot-ai.html | Pressemeldung |
| blog.easi.net — EUR-Pricing-Outlook | https://blog.easi.net/en/microsoft-365-in-2026-new-capabilities-copilot-skus-and-pricing | EUR-Erwartungen |
| Directions on Microsoft | https://www.directionsonmicrosoft.com/reports/m365-copilot-adds-choice-and-risk-with-anthropics-claude/ | Analyst-Bewertung E7 + Claude |

### Events

| Event | Datum | Was dort zu erwarten |
|-------|-------|----------------------|
| Microsoft Build 2026 | Mai 2026 | E7 EUR-Pricing-Ankündigung, Agent 365 GA-Deep-Dive |
| AI Tour Zürich 2026 | 29.04.2026 | Regionale DACH-Pricing-Details |

---

## UNCLEAR — offene Fragen

1. **EUR-Listpreis für E7** — erwartet Mai 2026
2. **EUR-Preis für Agent 365 standalone** ($15 USD bekannt)
3. **CSP-10/15/15%-Staffel** aus v1 — nicht mehr die aktuelle Realität, nur noch volumenbasierte Copilot-for-All-Promos bestätigt
4. **Consumption-Billing für Cowork** jenseits Frontier-Preview — existiert ein Hard-Cap?

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Bundle-Math mit korrekten $60/$30/$12/$15 Einzelpreisen + $99/$90,45 E7-Preis; CSP-Promo-Realität korrigiert (30/40% Copilot-for-All statt 10/15/15%); EUR-Ausblick Juli 2026; Kunden-Entscheidungs-Baum | siehe Primary/Secondary |
| 2026-04-21 | Hongyu | Initial Stub mit Bundle-Komposition + Claude-EU-Flag | Arbeitsauftrag |
