# Architecture and deployment

## System boundary

This repository is a client-only React application written in strict TypeScript. Vite performs the build and emits `dist/`; the production site consists only of static HTML, CSS, JavaScript, bundled fonts, and local images. There is no server process, API, database, authentication layer, or server-side secret.

The root `index.html` contains metadata, `#root` with its inline first-paint loader, and the Vite module entry. `src/main.tsx` replaces that placeholder with `src/App.tsx` inside `AppErrorBoundary`. The loader's narrowly allowed critical styles and current-photo readiness contract are documented in [Site iconography](iconography.md). React, React DOM, and the `@fontsource` font files are bundled dependencies: production must not load a framework runtime or critical font from a CDN, evaluate generated application code, or retain the former custom-component markup.

## Source layers

- `src/data/activities.ts` owns active editorial content: chapters, activities, hero IDs, dates, links, and gallery counts.
- `src/data/archive.ts` owns tried-and-decided outcomes plus sheet-ready detail for inactive records. Merely tried and rejected IDs must not appear in active content; verified IDs must remain active so badges and filtering cannot point at stale records. Rejections may come from a visit or an explicit pre-visit decision, which the archive note must distinguish.
- `src/domain/` owns pure, browser-independent rules such as dated-card ordering, treatment selection, photo/map URLs, favorite validation, and share-message formatting.
- `src/hooks/` owns lifecycle behavior such as local favorites, current-chapter tracking, and media preferences.
- `src/browser/` contains small capability adapters whose failures must be represented honestly in UI state.
- `src/components/` owns semantic React markup and interaction composition. Activity IDs and chapter keys are the stable React keys.
- `src/styles/` owns bundled font declarations, global tokens, the deliberately varied visual treatments, and responsive rules. The 1000 px boundary remains CSS-driven.
- `public/photos/` owns 492 active-and-archive activity JPEGs and two brand SVGs. Vite copies this directory verbatim to `dist/photos/`.
- `docs/photo-attributions.csv` owns reviewed photo credits. Build-time generation emits `public/photo-attributions.json` for the UI and `public/photo-attributions.jsonld` for machine readers.

Do not reintroduce a global application namespace, runtime template compiler, `new Function`, inline executable script, or a parallel entry point under `src/`. Add behavior through typed modules and cover pure rules with Vitest.

## Client data flows

Activity data is compiled into the JavaScript bundle. No production fetch is needed to render the guide. Gallery URLs resolve to `photos/<activity-id>-<slot>.jpg`, so activity IDs and contiguous slot numbers are durable content identifiers. Photo credits load lazily only when the footer sheet opens; a failed credit request produces an honest retry state without affecting the guide itself.

URL fragments are the client-only navigation boundary:

- `#<chapter-key>` targets a chapter, for example `#animals`.
- `#activity-<activity-id>` opens one detail sheet, for example `#activity-rasalkhor`.
- `#archive` opens the `Tried & decided` decision ledger.
- `#credits` opens the complete photo-credit sheet.
- `#list=<comma-separated-activity-ids>` retains the existing shared-favorites contract.

`src/domain/deepLinks.ts` validates and builds chapter/activity/global-sheet fragments plus the explicit `#everything` route; `src/hooks/useDeepLink.ts` owns session-history synchronization. The hash is the source of truth for chapter expansion and open sheets, so Back/Forward restores a selected chapter, the all-open state, or an in-page sheet. App-created sheet entries carry a namespaced history-state marker. A directly loaded active activity closes to its owning chapter; an inactive archive activity closes to `#archive`; direct `#archive` or `#credits` dismissal strips only the fragment. Unknown, retired-without-a-record, malformed, and favorites fragments do not open a sheet.

Favorites use the neutral `dubai-activities.favs.v1` local-storage key. A validated `#list=<comma-separated-activity-ids>` hash can initialize a shared list; invalid, unknown, and duplicate IDs must not enter state. Chapter and activity fragments leave stored favorites authoritative. Hash navigation is intentionally client-side and is not sent to S3 or CloudFront as part of the HTTP request.

Clipboard and Web Share are progressive enhancements. The native Share control appears only when the browser accepts the exact payload, and copy/share failures must not be reported as successes.

## Build contract

### Favicons and home-screen icons

`index.html` links `public/favicon.ico` (16/32/48 px fallback),
`public/favicon.svg` (scalable primary icon), `public/apple-touch-icon.png`
(180 px), and `public/site.webmanifest`. The manifest references the 192 px,
512 px, and maskable 512 px PNGs beside it. All links are relative to preserve
prefix portability. Vite copies these supplied assets unchanged into `dist/`.
The manifest only provides site identity and icon metadata; it does not add
offline support. Unused small PNG variants and source artwork are retained in
`docs/branding/favicon-source/`, outside the deployed output. Preserve the
supplied artwork and embedded provenance when updating the set.
The current source set is v3 (board 14a-4): dark window backing/rim, 89% inner
mark scale, and updated 80%/64% standard/maskable tile placement. Retain these
geometry choices when regenerating; supplier notes live beside the source art.

### Building

The development toolchain requires Node 22.13 or newer; `package.json` records this boundary. `vite.config.ts` uses `base: './'` so the output remains portable when mounted at an S3 or CloudFront prefix. A prefixed public URL must retain its trailing slash (for example `/guide/`), because relative asset URLs at `/guide` would resolve from the parent path. Build with:

```sh
npm run build
npm run audit:site
```

The audit requires a completed `dist/` and verifies:

- The source uses the React/Vite entry point and contains no legacy runtime entry point.
- `dist/index.html` refers only to relative, fingerprinted application assets.
- Every local HTML asset reference resolves inside `dist/`.
- `dist/photos/` mirrors `public/photos/` by filename and byte count.
- The compact attribution catalog and JSON-LD graph exist in both `public/` and `dist/`, and the document advertises the JSON-LD file.
- Production bundles contain neither the former custom runtime nor its CDN React loader.

`dist/` is generated output and must not become a source of truth. Rebuild it rather than editing it.

## S3 and CloudFront deployment

Deploy the contents of `dist/`, not the repository or `src/`. Configure `index.html` as the S3 website index or the CloudFront default root object. The site has one document route and uses URL fragments for chapters, activity sheets, and shared favorites, so it does not need an SPA fallback or server-side rewrite.

### Production target

Production is `https://dubai.anthonydisanti.com/`. The existing Minisite stack owns the private S3 origin and CloudFront distribution:

- AWS profile: `personal`
- CloudFormation stack: `minisite-dubai-anthonydisanti-com-36364597`
- S3 bucket: `minisite-dubai-anthonydisanti-com-36364-sitebucket-uydjwsn8kgq4`
- CloudFront distribution: `EU943ZSJ1FOAO`

Run the release from the repository root after the complete application and photo gates:

```sh
npm run check
npm run audit:photos
npm run audit:attributions
minisite deploy --dry-run --profile personal dubai.anthonydisanti.com ./dist
minisite deploy --profile personal dubai.anthonydisanti.com ./dist
```

The bucket is not versioned and Minisite releases are not atomic, but this is an intentionally low-stakes vacation site. Do not create pre-release bucket snapshots. Keep `dist/` unchanged while the deployment runs, record the returned invalidation ID, wait for it with `aws cloudfront wait invalidation-completed`, then compare the live root document with `dist/index.html` and smoke-test representative chapter and activity fragments. If verification exposes a regression, fix it locally and deploy again.

Preserve the generated MIME types when uploading: HTML as `text/html`, CSS as `text/css`, JavaScript as `text/javascript`, SVG as `image/svg+xml`, and JPEGs as `image/jpeg`.

Use HTTPS through CloudFront or equivalent. Clipboard and Web Share are secure-context capabilities and can be unavailable on a plain S3 website endpoint.

Recommended cache policy:

- `assets/*`: `public, max-age=31536000, immutable` because Vite fingerprints these files.
- `index.html`: `no-cache` or a short lifetime so new bundle references propagate promptly.
- `photos/*`: a moderate lifetime unless deployment invalidates changed stable filenames. Photo filenames are editorially stable rather than content-hashed.

The current Minisite client applies `public, max-age=0, must-revalidate, s-maxage=86400` to every object and requests a `/*` invalidation after a successful upload/delete pass. That is operationally safe for the current small personal site, but it does not implement the per-path policy above or preserve old fingerprinted bundles through propagation. Treat the per-path policy and atomic release ordering as the desired deployment improvement, not as behavior the present client already supplies.

Upload new fingerprinted assets before replacing `index.html`. Do not delete the previous fingerprinted assets until the new document has propagated through caches. When a photo is replaced under the same filename, invalidate that path or wait for its configured lifetime.

Fonts are emitted as fingerprinted build assets and retain system fallbacks. The application has no required production CDN, which permits a strict same-origin Content Security Policy without introducing a backend.
