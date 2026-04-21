---
watch: passive
status: ga
last_verified: 2026-04-22
aliases: [Azure ML, AML]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure Machine Learning

*Microsoft's **klassische ML-Plattform** — Training, Pipelines, AutoML. In [[Microsoft Foundry]] integriert, aber eigenständiger Service. Für unser Agent-Zielbild meist **nicht direkt relevant** — nur bei Custom-ML-Szenarien (eigene Modelle trainieren, MLOps-Pipelines).*

> **Analogie:** Wie Databricks / SageMaker — eine klassische MLOps-Plattform, separat von der reinen LLM-Welt.

## Einsatz

**JTBD:** When I eigene ML-Modelle trainieren/fine-tunen/deployen will (nicht nur LLMs konsumieren), I want to eine Plattform für Experiment-Tracking, Pipeline-Orchestrierung, Model Registry, Endpoints, so I can ML-Lifecycle produktiv betreibe.

**Empfehlung:** 🟡 nur bei Custom-ML-Kunden relevant. Für SMB-Agent-Szenarien meist **kein Bedarf** — ja für (z. B.) Kunden-spezifisches Fine-Tuning oder Forecasting-Projekte.

## Status & Pricing

- **Status:** GA. **Azure ML v1 ist Deprecation-Kandidat**, v2 (CLI 2.0, SDK v2) ist aktuelle Linie
- **Pricing:** Compute-basiert (VMs / Cluster)

## Kernkonzept

Azure ML v2 umfasst: **Workspaces** (Projekt-Container), **Compute Clusters** (Training-Ressourcen), **Pipelines** (DAG-basierte Workflows), **Model Registry** (Versionierung), **Endpoints** (Online + Batch für Inferenz), **AutoML** (automatisches Feature-Engineering + Modell-Selection), **MLflow-Integration** (Experiment-Tracking).

Im Agent-Kontext relevant als: (a) Lieferant eigener Modelle für Foundry Model Catalog (custom fine-tunes), (b) Evaluation-Pipeline-Plattform wenn Eval-Flows komplex werden.

## Limitierungen

- **v1 auslaufend** — Kunden auf v1-Code müssen migrieren
- **Steile Lernkurve** für reine LLM-Teams

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure ML | https://learn.microsoft.com/en-us/azure/machine-learning/ | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
