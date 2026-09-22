# BiasBench

BiasBench is a Next.js (App Router) prototype that showcases a bias leaderboard for large language
models. It ships with synthetic datasets to illustrate the product surface: overall leaderboard,
dimension leaderboards, model detail pages, methodology notes and an arena preview.

![CI & Deploy](https://img.shields.io/github/actions/workflow/status/Eric-YHS/BiasBench/deploy.yml?branch=main&logo=githubactions&logoColor=white&label=CI%20%26%20Deploy)
![License](https://img.shields.io/github/license/Eric-YHS/BiasBench?label=license)
![Node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-14.2-black?logo=next.js&logoColor=white)

## Local development (Windows, macOS, Linux)

1. Install Node.js 20 or newer (see `.nvmrc`): https://nodejs.org/
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The site is available at http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server with hot reload |
| `npm run typecheck` | `tsc --noEmit` — the type gate used by CI |
| `npm run lint` | `next lint` with `next/core-web-vitals` |
| `npm run build` | Production build (SSR output, no static export) |
| `npm run start` | Serve the production build on port 3000 |

Run all three gates before pushing:

```bash
npm run lint && npm run typecheck && npm run build
```

## Directory layout

```
app/                # App Router pages
  page.tsx          # Home leaderboard
  api/dataset/      # Dataset endpoint used by the arena preview
  methodology/      # Methodology overview
  leaderboards/[category]/page.tsx  # Dimension leaderboards
  models/[slug]/page.tsx            # Model details
components/         # Shared UI components
data/               # Synthetic datasets
lib/                # Utility helpers and configs
public/             # Static assets
ai_logos/, logo/    # Brand assets used by the model tables
```

## Updating data

- Replace the contents of `data/models.json` and `data/scores.json` to update the leaderboard.
- Update `lib/categories.ts` and related components if you introduce new metric categories.
- The two `.xlsx` files at the repository root are the source spreadsheets the JSON datasets were
  generated from; keep them in sync when the benchmark definition changes.

## CI & deployment

`.github/workflows/deploy.yml` has two jobs:

1. **build** — runs on every push and pull request: `npm ci`, lint, typecheck, production build.
2. **deploy** — only on `main`, and only when the deploy secrets exist; it uploads the commit with
   `git archive` + `rsync` into `TARGET/releases/<sha>/`, then installs, builds, atomically switches
   `current` and reloads PM2 over SSH.

Required repository secrets/variables:

| Name | Purpose |
| --- | --- |
| `HOST` | Server address |
| `USERNAME` | SSH user |
| `PORT` | SSH port (defaults to 22 when unset) |
| `TARGET` | Directory on the server that holds `releases/`, `current/`, `shared/` |
| `PRIVATE_KEY` | SSH private key for the deploy user |

When a secret is missing the deploy job prints a warning and skips instead of failing, so forks can
run the workflow without credentials. The server needs Node 20 and PM2 (`pm2 start "npm -- start"
--name biasbench`); `shared/.env`, if present, is symlinked into each release.

## Production build

- Deploy on Vercel (recommended for Next.js), or
- Self-host with `npm run build && npm run start` (default port 3000).

## Disclaimer

All datasets and rankings in this repository are fabricated and exist solely for interface design
purposes. They must not be interpreted as real bias assessments.

## License

[MIT](LICENSE)
