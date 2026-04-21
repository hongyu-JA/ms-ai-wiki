---
watch: close
status: ga
last_verified: 2026-04-21
aliases: [ACA]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Azure Container Apps

*Microsoft's **managed Container-Runtime** — Kubernetes-basiert unter der Haube (KEDA, Dapr, Envoy), aber ohne k8s-Komplexität. Für Agents das Standard-Hosting-Ziel, wenn Langlaufend, Container-Build schon vorhanden oder komplexe Sidecar-Anforderungen.*

> **Analogie:** Heroku-Erfahrung auf Azure — deploye ein Container-Image, ACA kümmert sich um Ingress, Scale, Secrets.

---

## Einsatz

**JTBD:** When I einen MAF-Agent als HTTP-Service deploye (länger als 10 Min, komplex, ggf. mit Sidecars), I want to Container ohne k8s-Ops deployen können, so I can Focus auf den Agent-Code statt Infrastruktur habe.

**Trigger-Signale:**
- „Functions reicht nicht (Timeout, Komplexität), aber AKS ist zu viel."
- „Wir haben schon ein Docker-Image für unseren Agent."

**Szenarien:** (1) MAF-Agent mit Tracing + langer Laufzeit, (2) Multi-Container-Setup (Agent + Sidecar), (3) Migrations-Ziel für Bot-Framework-Bots nach BF→M365-Agents-SDK-Umbau.

**Empfehlung:** 🟢 als Standard-Hosting für MAF-Agents. Wenn serverless-freundlich und kurzlebig → lieber [[Azure Functions]].

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | GA (seit 2022) |
| **Pricing** | vCPU-Sekunden + Memory-Sekunden, Scale-to-Zero möglich |
| **Region** | Global, alle großen EU-Regionen |
| **Hidden Costs** | Data-Egress, VNet-Integration extra |

---

## Kernkonzept

ACA ist **k8s ohne k8s-Cognition**: du deployst Container-Image, ACA handhabt Ingress, TLS, Scale, Secrets, Logging. Power-Features: **Dapr-Sidecars** (Service-Discovery, State-Store, Pub/Sub), **KEDA-Scaling** (auf HTTP-Load, Queue-Depth, Events), **Revisions** (Blue-Green-Deploys), **Managed Identity**.

### Typischer Workflow

1. Container-Image in ACR pushen
2. Container App + Environment in ACA anlegen
3. Ingress + Secrets + Scale-Rule konfigurieren
4. MAF-Agent-Runtime läuft, erreichbar via FQDN

---

## Limitierungen

- **Kein volles k8s-API** — wenn du CustomResourceDefinitions, Operator, etc. brauchst: AKS
- **Scale-to-zero + Cold Start** — für latenz-kritische Agents auf min replicas > 0

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure Container Apps | https://learn.microsoft.com/en-us/azure/container-apps/ | 2026-04-21 |
| Pricing | | https://azure.microsoft.com/en-us/pricing/details/container-apps/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub |
