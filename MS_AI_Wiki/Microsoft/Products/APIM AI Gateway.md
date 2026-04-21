---
watch: close
status: ga
last_verified: 2026-04-21
aliases: [API Management AI Gateway, GenAI Gateway]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# APIM AI Gateway

*Azure API Management **mit AI-Gateway-Features**: Model-Routing zwischen mehreren OpenAI-/Foundry-Deployments, Token-Limit-Policies, Caching, MCP-Proxy, Prompt-Logging und Cost-Controls. Sitzt zwischen Agent und Modell-Endpunkt als Enterprise-Proxy.*

> **Analogie:** Was ein klassisches API-Gateway für REST-APIs ist, nur dass die AI-Variante speziell Token/Prompt/MCP versteht.

---

## Einsatz

**JTBD:** When I mehrere Agents gegen mehrere Modell-Backends laufen lasse, I want to zentral Rate-Limits pro Kunde/Team durchsetzen, Fallback zwischen Deployments einbauen, MCP-Calls loggen und Kosten-Caps setzen, so I can nicht jeden Agent einzeln instrumentieren müssen.

**Trigger-Signale:**
- „Unser Azure-OpenAI-Bill explodiert, wir haben keine Pro-Team-Caps."
- „Wir brauchen Fallback — wenn GPT-4o down, auf GPT-4o-mini routen."
- „Multi-Tenant-SaaS: jeder Kunde hat eigene Token-Quota."

**Szenarien:** (1) Multi-Tenant-SaaS mit pro-Kunde-Rate-Limits, (2) Enterprise mit Cost-Cap pro Team, (3) MCP-Proxy zwischen Agent-Hosts und Tool-Servern.

**Empfehlung:** 🟢 für Enterprise + Multi-Tenant-SaaS. Für einzelnen SMB-Agent Overkill.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | GA · AI-Gateway-Features kontinuierlich erweitert |
| **Pricing** | APIM-Tier-basiert (Basic/Standard/Premium) + AI-Gateway-Features teils in höheren Tiers |
| **Region** | Global |

---

## Kernkonzept

APIM-AI-Gateway fügt Standard-APIM-Features spezifische AI-Policies hinzu: `azure-openai-token-limit` (pro Tenant/User Token-Budget), `llm-emit-token-metric` (Observability), `llm-semantic-cache-lookup` (Cache für identische/ähnliche Prompts), MCP-Proxy (Outbound-Calls an MCP-Tool-Server mit Logging/Retry). Damit wird APIM zur zentralen **Policy-Enforcement-Point** für alles AI-related.

### Kern-Fähigkeiten

1. **Token-Rate-Limiting** pro Subscription/Kunde
2. **Model-Routing + Fallback** (Retry-Policy auf zweites Deployment)
3. **Semantic Cache** für wiederkehrende Prompts
4. **MCP-Proxy** zwischen Agents und MCP-Servern
5. **Prompt-Logging** (optional, DSGVO beachten)

---

## Limitierungen

- **APIM-Lernkurve** — wer APIM nicht kennt, hat Einarbeitung
- **Policy-Management komplex** — für kleines Setup Overkill

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | GenAI Gateway Capabilities | https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities | 2026-04-21 |
| Docs | Token Limit Policy | https://learn.microsoft.com/en-us/azure/api-management/azure-openai-token-limit-policy | 2026-04-21 |
| Samples | APIM-AI-Gateway-Samples (GitHub) | https://github.com/Azure-Samples/AI-Gateway | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub |
