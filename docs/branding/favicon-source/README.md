# Dubai activities — favicon set

Mark: a neon four-centred window (red tube), two sand dunes, a solid neon-blue crescent and star, with a dark interior and protective dark rim. Board reference: 14a-4 (v3).
Drawn on a 64-unit grid; every file here is rendered from the same geometry.

The v3 artwork replaces the original transparent-interior set. Its dark backing
extends six units beyond the neon tube, and the mark is scaled to 89% so that
rim fits inside the icon box. Original supplier notes are preserved in
[`supplied-v3-notes.md`](supplied-v3-notes.md); use the integration paths below
instead of the supplier's root-absolute installation example.

## Integration

The deployed files live in `public/`: `favicon.svg`, `favicon.ico`,
`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`,
`icon-maskable-512.png`, and `site.webmanifest`. Root `index.html` links
them using relative URLs, and the manifest uses relative icon paths so
prefix deployments remain portable. The existing theme color is retained.

This directory preserves the unused standalone 16/32/48 px PNGs and
`source/` artwork for future design work; Vite does not publish them.
The ICO already embeds those three favicon sizes. The manifest supplies
home-screen icon metadata without adding offline support or a service worker.

## Original installation reference

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#16110e">
```

Keep the two `rel="icon"` lines in that order: modern browsers pick the SVG, Safari and old browsers fall back to the .ico.
If the site is served from a sub-path, make the hrefs relative (or fix the `src` paths inside site.webmanifest to match).

## Files

| file | role |
|---|---|
| favicon.svg | primary favicon (transparent outside the dark backing/rim, includes the neon glow as an SVG filter) |
| favicon.ico | 16 + 32 + 48 px, PNG-compressed; Safari / legacy / Windows shortcuts |
| favicon-16x16.png, favicon-32x32.png | rendered from source/favicon-flat.svg (no glow — crisper at these sizes) |
| favicon-48x48.png | rendered with glow |
| apple-touch-icon.png | 180 px, on the site ground #16110e (iOS does not allow transparency), mark at 80 % |
| icon-192.png, icon-512.png | Android / PWA install icons, same treatment as apple-touch-icon |
| icon-maskable-512.png | Android maskable variant, mark at 64 % so it survives circle/squircle masks |
| site.webmanifest | references the three Android icons; theme_color/background_color = #16110e |
| source/favicon-flat.svg | same geometry without glow |
| source/mark-256-transparent.png | large transparent render for docs, OG images, etc. |

## Colours

- tube / neon red: #ff4fa3
- moon + star / neon blue: #35e0ff
- front dune / sand: #d9a23a  ·  back dune / shaded sand: #b07f2f
- ground (window backing/rim and tiles): #16110e

## Regenerating

Edit `public/favicon.svg` and re-rasterise. The geometry has six paths: the first
is the dark arch backing, filled and stroked 17 units wide in #16110e, giving
six units of rim beyond the five-unit neon tube. Preserve the mark's inner
`scale(0.89)` group. Rasters at 16/32 use the flat version; tiles wrap the mark
in `<g transform="translate(32 32) scale(S) translate(-32 -32)">` over a #16110e
rect, with S = 0.80 (0.64 for maskable).
