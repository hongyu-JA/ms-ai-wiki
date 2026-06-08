---
watch: open
status: stub_build_2026
last_verified: 2026-06-08
azure_verified: 2026-06-08
source: build-2026-keynote
aliases:
  - MXC
  - Microsoft Execution Containers
  - Agent Containers
moc:
  - '[[Microsoft MOC]]'
  - '[[Security & Identity MOC]]'
zuletzt_gesichtet: 2026-06-08
updated: 2026-06-08
---

# Microsoft Execution Containers (MXC)

*OS-Level Sicherheits-Container für AI-Agenten — vorgestellt auf Build 2026. Vier Isolations-Stufen vom Prozess bis zur dedizierten Cloud-PC, damit Agenten kontrolliert ausgeführt werden ohne dass sie das System gefährden.*

> **Analogie:** Was Docker für Code-Container war, ist MXC für Agent-Container — mit dem Unterschied, dass MXC OS-Level-Isolation auf Windows-Native-Basis bietet, nicht auf Hypervisor-Ebene.

---

## ⚠ POC-Verifikation gegen echtes Azure (2026-06-08)

**Read-only geprüft auf Journai-Core (Reader-Rolle).** Kein eigener ARM-Resource-Type für „Execution Containers" gefunden — MXC ist ein **Windows-12-/Azure-Foundry-Feature** (OS-Level-Isolation), das auf bestehender Compute-Infra aufsetzt (`Microsoft.App` für Container Apps ist registriert ✓). Eine echte Capability-Sandbox-Verifikation braucht Deploy-Rechte + einen laufenden Agent (aktuell nur Reader).

**Beratungs-Konsequenz:** Das Konzept (capability-basierte Agent-Sandbox) ist solide und für FINMA/regulierte Kunden wertvoll. Aber als „verfügbar testbar" erst kommunizieren, wenn wir mit Contributor-Rechten einen Agent in Machine-Isolation laufen lassen können.

> **Status bleibt `stub_build_2026`** — braucht Deploy-Rechte + Windows 12 / Cloud-PC zum Testen.

---

## Was leistet es?

Vier Isolations-Modi je nach Risiko-Profil:

| Modus | Isolation-Tiefe | Use-Case |
|---|---|---|
| **Process** | Prozess-Ebene (lightweight) | Agent läuft als getrennter Prozess, geteilte Resources |
| **Session** | User-Session (mittel) | Agent in eigener Windows-Session, eigene Berechtigungen |
| **Machine** | Maschine-Ebene (schwer) | Agent in dedizierter VM oder Sandbox-Container |
| **Cloud PC** | Voll isoliert (max.) | Agent in dedizierter [[Windows 365 for Agents]]-Cloud-PC |

## Status

- GA seit Build 2026
- Bestandteil von Windows 12 / Windows Server 2026

## Wo passt es in die Architektur?

- **Layer:** GOVERNANCE
- **Verbindungen:**
  - `secured-by` ← MAF, M365 Agents SDK (wenn Agent auf Windows läuft)
  - `uses` → Windows 365 for Agents (für Cloud-PC-Modus)
  - benachbart zu Defender for AI (Defender überwacht, MXC isoliert)

## Beratungs-Relevanz für Journai

**Hoch für regulierte Schweizer Kunden.**

Banken, Versicherer, öffentlicher Sektor haben oft strikte Anforderungen an Sandbox-Isolation von autonom-handelnden Software-Komponenten. MXC erfüllt das auf Native-Windows-Level:

- **FINMA-konform:** dedizierte Cloud-PC-Isolation entspricht den Anforderungen an "operationelle Risiken bei autonomen Systemen"
- **DSGVO Art. 32:** "technisch-organisatorische Massnahmen" — MXC ist eine konkrete Massnahme
- **ISO 27001:** Privileged-Access-Management auf Agenten-Ebene

Empfehlung für Sicherheits-sensitive Kunden:
> "Production-Agents in MXC ausführen, mindestens Session-Isolation, bei kritischen Workflows Machine- oder Cloud-PC-Isolation."

## Performance-Overhead (laut Build-Keynote)

| Modus | Startup-Zeit | Memory-Overhead | Empfohlen für Agent-Volumen |
|---|---|---|---|
| Process | <100ms | ~50 MB | Hochvolumen (>1000 Agents/h) |
| Session | 200-500ms | ~200 MB | Mittel (100-1000/h) |
| Machine | 2-10 Sek | ~1-2 GB | Sensible Workloads (<100/h) |
| Cloud PC | 10-60 Sek | dedizierte VM | Kritische / regulierte Workloads (<10/h) |

**Trade-off klar:** mehr Isolation = mehr Overhead + Latenz. Für Real-Time-Chat ist nur Process-Modus brauchbar; für Batch-Analyse Machine oder Cloud-PC.

## Konkrete Konfiguration

```yaml
# Agent-Manifest mit MXC-Capabilities
agent:
  name: contract-analyzer
  framework: maf
  execution:
    container: machine  # Isolation-Modus
    capabilities:
      - filesystem: read_only:/data/contracts/
      - network: outbound:foundry.azure.com only
      - subprocess: deny
      - registry: deny
    audit: full
    timeout: 300s
```

Deklarative Capability-Definition → MXC erzwingt zur Laufzeit. Verstösse werden in Defender for AI alarmiert.

## Pricing-Auswirkung

| Modus | Zusatz-Kosten |
|---|---|
| Process | inkludiert in Windows-Lizenz |
| Session | inkludiert |
| Machine | Container-Compute (Container Apps oder VM) — ca. CHF 50-200/Monat pro Agent |
| Cloud PC | Windows 365 for Agents — ca. CHF 30-50/Monat pro Cloud-PC |

Schätzung für mittleren Schweizer Kunden mit 10 Production-Agents in Machine-Isolation: **CHF 1'500-2'500/Monat** zusätzlich für MXC-Hosting.

## Use-Cases (Schweizer Profile)

1. **Bank — Vertrags-Analyse-Agent:** Machine-Isolation, Tool-Capabilities streng beschränkt
2. **Versicherung — Schaden-Recherche-Agent:** Cloud-PC-Isolation für tiefste Risiko-Stufe
3. **Government — Verschlussache-Bearbeitungs-Agent:** Cloud-PC mit Air-Gap-ähnlicher Konfiguration
4. **Anwaltskanzlei — Recherche-Agent:** Session-Isolation reicht (kein Tool-Use, nur Lesen)
5. **Health-Care — KIS-Integration-Agent:** Machine-Isolation + Defender-AI-Monitoring

## Integration mit Defender for AI

MXC + Defender for AI bilden eine **Tiefen-Verteidigungs-Schicht**:

- **MXC** verhindert proaktiv: capability-basierte Sandbox, kein Filesystem-Zugriff ohne Deklaration
- **Defender** erkennt reaktiv: Anomalien im Verhalten, Prompt-Injection-Versuche, ungewöhnliche Tool-Aufrufe

Zusammen sind sie eine vollständige Agent-Sicherheits-Story. Für Audit-relevante Kunden beide aktivieren — eines allein reicht nicht.

## Häufige Stolpersteine

1. **Capability-Definitions sind upfront.** Wer eine Agent-Capability vergisst, kriegt Runtime-Fehler. Best Practice: capability-narrow starten, dann erweitern.
2. **Cloud-PC-Modus ist teuer.** Für viele Agents wird das schnell unwirtschaftlich — Use-Case-Selektion wichtig.
3. **Process-Modus gibt schwächste Garantien.** Nur für nicht-sensitive Workloads — manche Kunden verstehen den Unterschied nicht, Berater muss aufklären.
4. **Cross-OS funktioniert nicht.** MXC ist Windows-only. Linux-Agenten brauchen andere Isolation-Lösung (k8s + gVisor).

## Schweizer Compliance-Implikationen

- **FINMA-Rundschreiben 2023/01:** Cloud-PC-Modus erfüllt höchste Anforderungen an operationelle Risiken
- **FADP Art. 32 / DSGVO Art. 32:** MXC ist konkretes TOM-Beispiel (Technisch-Organisatorische Massnahme)
- **ISO 27001:** A.9 (Access Control) + A.12 (Operations Security) — MXC adressiert beide
- **NIST AI Risk Management Framework:** "Sandbox + Capability" entspricht NIST-Risiko-Manage-Empfehlung

**Beratungs-Pitch:** _"MXC ist die Antwort auf 'Wie kontrolliert man autonome Agents?' — das ist die Frage, die jeder Compliance-Officer im Q3/2026 stellen wird."_

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] POC: MAF-Agent in Machine-Isolation testen, Capabilities-Konfiguration durchspielen
- [ ] Cost-Modell mit Cloud-PC für 1 Banken-Use-Case
- [ ] Defender-AI-Integration im Detail dokumentieren
- [ ] FINMA-Compliance-Argumentation als Beratungs-Dokument aufbereiten

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [theneuron.ai — Build 2026](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
