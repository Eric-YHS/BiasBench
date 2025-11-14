# BiasBench Demo

BiasBench is a Next.js (App Router) prototype that showcases a bias leaderboard for large language
models. It ships with synthetic datasets to illustrate the product surface: overall leaderboard,
dimension leaderboards, model detail pages, methodology notes and an arena preview.

## Local development (Windows, macOS, Linux)

1. Install Node.js LTS (20.x recommended): https://nodejs.org/
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
    npm run dev
   ```

   The site is available at http://localhost:3000.

## Directory layout

```
app/                # App Router pages
  page.tsx          # Home leaderboard
  methodology/      # Methodology overview
  leaderboards/[category]/page.tsx  # Dimension leaderboards
  models/[slug]/page.tsx            # Model details
components/         # Shared UI components
data/               # Synthetic datasets
lib/                # Utility helpers and configs
public/             # Static assets
```

## Updating data

- Replace the contents of `data/models.json` and `data/scores.json` to update the leaderboard.
- Update `lib/categories.ts` and related components if you introduce new metric categories.

## Production build

- Deploy on Vercel (recommended for Next.js), or
- Self-host with `npm run build && npm run start` (default port 3000).

## Disclaimer

All datasets and rankings in this repository are fabricated and exist solely for interface design
purposes. They must not be interpreted as real bias assessments.
