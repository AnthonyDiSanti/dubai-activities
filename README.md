# Dubai activities

A photography-forward guide to things to do in Dubai and nearby emirates. React and strict TypeScript provide the interactive client, Vite produces a static `dist/`, and the deployed site needs no backend.

## Develop locally

Use Node 22.13 or newer. Install dependencies once, then start Vite:

```sh
npm install
npm run dev
```

Open the URL printed by Vite. For a production-equivalent local build:

```sh
npm run build
npm run preview
```

## Project map

- `index.html` — Vite document shell and React mount point.
- `src/main.tsx` and `src/App.tsx` — client entry point and application composition.
- `src/components/` — semantic activity, navigation, gallery, favorites, and dialog UI.
- `src/hooks/` — browser-backed state and lifecycle behavior.
- `src/domain/` — typed ordering, treatment, sharing, and URL rules.
- `src/data/activities.ts` — canonical active content, chapter order, hero selection, and gallery counts.
- `src/data/archive.ts` — firsthand liked, merely tried, and rejected outcomes plus inactive sheet records that must survive editorial refreshes.
- `src/styles/` — design tokens, card treatments, dialogs, layout, and responsive rules.
- `public/photos/` — local JPEG galleries and brand icons, copied to `dist/photos/` unchanged.
- `docs/image-manifest.csv` — canonical photo selection and provenance manifest.
- `docs/photo-attributions.csv` — canonical human-reviewed credits, published through the footer and generated machine-readable catalogs.
- `docs/` — architecture, behavior, editorial, and asset workflow documentation.

See [docs/architecture.md](docs/architecture.md) for application boundaries and S3 deployment constraints.

## Verify

Run the application gate, content/asset audits, and the post-build static-output audit:

```sh
npm run check
npm run audit:photos
npm run audit:attributions
git diff --check
```

For interaction changes, finish with the four responsive browser checks in [docs/site-interactions.md](docs/site-interactions.md).
