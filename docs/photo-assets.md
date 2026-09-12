# Photo asset workflow

## Source of truth

- `docs/image-manifest.csv` is the canonical editorial and provenance record.
- `docs/brand-marks.csv` separately records the two SVG brand marks.
- `docs/photo-attributions.csv` is the canonical human-reviewed credit ledger for every selected asset.
- `public/photos/` contains selected assets named `<activity-id>-<slot>.jpg` plus the local brand SVGs.
- `public/photo-attributions.json` and `public/photo-attributions.jsonld` are generated public credit catalogs; never edit them directly.
- `.image-work/*.csv` contains chapter-scoped sourcing fragments used for parallel research.

Vite copies `public/photos/` unchanged into `dist/photos/`. Application data stores only an activity's contiguous photo count; `src/domain/activity.ts` derives the public URL.

Every successful manifest row records the exact downloaded asset URL in `actual_url`, the page that establishes context in `source_page`, and the file's verified width, height, and byte count. A `not_found` row intentionally has no local file or `actual_url` and retains an explanatory note.

Provenance is not the same as reuse permission. This private personal guide intentionally treats permission review as non-blocking, but public credit is a project standard: name the creator and exact license when available, otherwise credit the recorded source without implying permission or endorsement. The footer's Photo credits sheet is the human-readable surface; the generated JSON and JSON-LD provide the same information to software.

## Attribution ledger

`scripts/photo-attributions.py` joins the selected manifest rows to `docs/photo-attributions.csv`. The ledger is keyed one-to-one by `filename` and records title, creator, creator type/link, source label, exact license/link, credit basis, disclosed modifications, verification date, and internal notes. Use these controlled `credit_basis` values:

- `creative_commons` — exact Commons creator and license metadata.
- `stock_license` — a named stock-platform license.
- `public_domain` — copyright-released media such as CC0.
- `creator_credit` — a creator or supplier is identified but no reusable license is claimed.
- `source_credit` — only the venue, publisher, or originating page can be identified.
- `trademark` — copyright provenance is recorded for a brand mark while trademark rules still apply.

Run `sync` after selected manifest rows change. It preserves existing reviewed rows and creates honest source-level fallbacks for new files, so missing creator research does not block deployment. Use the network refresh when open-license metadata needs to be added or rechecked:

```sh
npm run sync:attributions
npm run sync:attributions -- --refresh-open
npm run generate:attributions
npm run audit:attributions
```

The CSV reader rejects rows whose cell count differs from the header, including unquoted commas inside notes. Sync serializes all rows before opening the ledger so invalid input cannot truncate reviewed credits. `npm run test:photos` covers malformed input and preservation of the original ledger; it also runs in `npm run check`.

The default audit enforces exact one-to-one coverage, schema validity, safe links, current generated output, and all known Creative Commons/stock fields. `python3 scripts/photo-attributions.py audit --strict` additionally fails on enrichment warnings. Neither audit is a reuse-permission gate; adding a visible source credit does not assert that the site has a republication license.

## Editorial state

`status` records what happened during sourcing:

- `downloaded` — an original request was fulfilled.
- `added` — an unrequested but worthwhile image was selected.
- `not_found` — no acceptable image was selected.

`disposition` records what to do with that result without rewriting history:

- `selected` — use the local asset.
- `waived` — the unfilled request is ancillary and the activity already has adequate coverage.
- `defer_until_event` — source an exact event candid only after the future event occurs.
- `defer_until_reopen` — reconsider after a temporarily closed venue reopens.
- `active_gap` — a meaningful gap still needs work; the completed manifest should normally contain none.

The manifest is an editorial guide, not a quota. Prefer differentiated story beats over multiple near-identical views, and add a row when an unrequested photo materially improves an activity.

## Quality requirements

- Use attributable HTTP(S) source and asset URLs; do not substitute a search-result URL.
- Reject watermarks, collages, posters, low-resolution thumbnails, and misleading generic imagery.
- JPEGs must decode cleanly and have a long edge of at least 800 px.
- Verify the centered crop because cards use cover-style framing.
- Keep successful activity slots contiguous from `01` so carousel counts remain deterministic.
- Do not place generated build output in `public/photos/`; every file there must remain represented by the manifest.

## Merge and verification

Run the merge only after all parallel fragment edits are complete. A completed canonical manifest can be reused as the request baseline; existing `added` rows are supplied by their fragments.

```sh
python3 scripts/merge-photo-results.py \
  .image-work/nightlife_strange_dinners.csv \
  .image-work/creative_skills_adrenaline.csv \
  .image-work/rides_wandering_quiet_trips.csv \
  .image-work/whole_days.csv \
  .image-work/long_dinners_root.csv \
  .image-work/quiet_root.csv \
  .image-work/night_venues_root.csv \
  --original docs/image-manifest.csv \
  --brands docs/brand-marks.csv \
  --output docs/image-manifest.csv
python3 scripts/audit-photo-manifest.py
python3 scripts/sync-photo-counts.py
npm run sync:attributions
npm run generate:attributions
npm run audit:attributions
npm run audit:photos
npm run audit:content
npm run check
```

Finish with rendered desktop and mobile checks of changed galleries and confirm that every final DOM image loads.

For a future activity set whose canonical-schema fragments already contain `disposition`, append the galleries without replaying every historical sourcing fragment:

```sh
python3 scripts/merge-photo-results.py \
  .image-work/new_chapter_part_a.csv \
  .image-work/new_chapter_part_b.csv \
  --append-new \
  --original docs/image-manifest.csv \
  --brands docs/brand-marks.csv \
  --output docs/image-manifest.csv
```

`--append-new` rejects duplicate filenames, existing activities, empty fragments, and unresolved rows before replacing the canonical file atomically. Run the normal photo and content audits immediately afterwards.

Do not rerun already-consumed append fragments, including the Addendum 3 fragments retained under `.image-work/`; their activity rows now exist in the canonical manifest and duplicate rejection is intentional.
