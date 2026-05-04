# Web Catalog

Static-Site catalog der MS_AI_Wiki Notes. Astro 5 + React Islands + Tailwind.
Liest die `.md`-Inhalte read-only aus `../MS_AI_Wiki/Microsoft/{Products,MOCs}/*.md`.

## Local Development

```bash
cd web
bun install
bun run dev
# → http://localhost:4321
```

Hot-reload bei Änderungen am Code. Bei Änderungen an Vault-Inhalten
(`MS_AI_Wiki/...`): Astro re-builds Content-Collection automatisch.

## Build

```bash
cd web
bun run build
# → web/dist/
```

Output: 47 static pages (1 index + 1 table + 45 product details).

## Preview Built Output

```bash
cd web
bun run preview
# → http://localhost:4321
```

## Deployment (Cloudflare Pages)

1. **Cloudflare-Konto** — wenn noch nicht vorhanden, anlegen unter <https://dash.cloudflare.com/sign-up> (Free Tier ausreichend)

2. **Pages-Projekt erstellen:**
   - Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
   - GitHub authorisieren, Repo `hongyu-JA/ms-ai-wiki` auswählen
   - Project name: `journai-msai-wiki` (Subdomain wird `journai-msai-wiki.pages.dev`)
   - Production branch: `main`
   - **Build settings:**
     - Framework preset: None
     - Build command: `cd web && bun install --frozen-lockfile && bun run build`
     - Build output directory: `web/dist`
     - Root directory: leer
   - **Environment variables:**
     - `NODE_VERSION`: `22`
   - "Save and Deploy" — erstes Deployment ~2-3 Min

3. **Falls bun nicht im Cloudflare-Image:** Build command ändern auf:
   ```
   npm install -g bun && cd web && bun install --frozen-lockfile && bun run build
   ```
   Oder npm-only:
   ```
   cd web && npm install && npx astro build
   ```

4. **Default-URL testen:** `https://journai-msai-wiki.pages.dev` lädt — ABER OHNE AUTH (Cloudflare Pages ist by default öffentlich). Schritt 5 macht es dicht.

> ⚠️ Bis Schritt 5 fertig: URL niemandem schicken (öffentlich zugänglich).

## Access Control (Cloudflare Access)

Geschützt durch Cloudflare Access — ohne Login (oder Token) kommt niemand rein.

### Setup einmalig

1. Cloudflare Dashboard → Sidebar **Zero Trust** → Setup-Wizard durchklicken (Free Tier, max 50 Users)
2. Zero Trust → Access → Applications → "Add an application"
3. Type: **Self-hosted**
4. Application name: `MS AI Wiki`
5. Session duration: 24 hours
6. Application domain: `journai-msai-wiki.pages.dev`
7. Application path: leer (alle Pfade gated)
8. **Policy auswählen — eine der zwei Optionen:**

**Option A: Email-Allow** (einfacher, empfohlen für Start)
- Action: Allow
- Rule: Include → Emails → `hongyu.zhou@journai.ch`, `christoph.<...>@journai.ch`, `philipp.<...>@journai.ch`
- Bei Erst-Besuch sendet Cloudflare einen Magic Link per Email

**Option B: Service Token** (mehr Privacy, ein gemeinsamer Token im Team-PWM)
- Action: Service Auth
- Rule: Include → Service Token → "Create new service token" → kopieren

### Später: Migration zu M365 SSO via Entra OIDC

Die saubere Endlösung — braucht **einmalige IT-Hilfe** für Entra App-Registration:

1. IT (Christoph) → Microsoft Entra Admin Center → App registrations → New registration
2. Cloudflare → Zero Trust → Settings → Authentication → Add OIDC IdP → Microsoft Entra
3. Eigenes Application replace Email-Allow durch "Allow only Entra OIDC users"

→ Dann gleiche M365-Anmeldedaten für Wiki + Outlook + Teams. Kein Code-Change im `web/` nötig.

## Pages

- `/` — Grid view (45 product cards, sortable, filterable)
- `/table` — Table view (sortable columns, same filter as Grid)
- `/architecture` — Interactive Architecture Map (D3.js force-simulation, 7 layers, ~30 typed collaboration edges, hover for upstream/downstream highlight + edge tooltips)
- `/products/<slug>` — Detail view per product (rendered Markdown content + Sidebar metadata)

The `/architecture` page reads from `web/data/architecture-layers.yaml` and
`web/data/collaborations.yaml` plus `loadProducts()`. To add new tools to the map:
1. Add slug under the appropriate layer's `members` in `architecture-layers.yaml`
2. Optionally add edges in `collaborations.yaml` referencing the new slug
3. The slug must match a `slug:` value in `.automation/products.yaml`

## Source of Truth

Der Inhalt kommt aus `../MS_AI_Wiki/Microsoft/{Products,MOCs}/*.md`.
Editieren weiterhin in Obsidian. `web/` liest read-only beim Build.

## Spec + Plan

- Design: [docs/superpowers/specs/2026-05-03-web-catalog-design.md](../docs/superpowers/specs/2026-05-03-web-catalog-design.md)
- Implementation: [docs/superpowers/plans/2026-05-03-web-catalog.md](../docs/superpowers/plans/2026-05-03-web-catalog.md)
