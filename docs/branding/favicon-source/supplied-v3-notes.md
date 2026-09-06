# Dubai activities — favicon set

Mark: a neon four-centred window (red tube) on its own dark ground, two sand dunes, a solid neon-blue crescent and star. Board reference: 14a-4 (v3 — the window interior is filled with the site ground and the fill extends 6 units past the tube as a dark rim; the whole mark is scaled to 89 % so the rim fits the icon box).
Drawn on a 64-unit grid; every file here is rendered from the same geometry.

## Install (copy every file to the site root, then add to <head>)

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
| favicon.svg | primary favicon (transparent, includes the neon glow as an SVG filter) |
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
- ground (inside the window, and home-screen tiles): #16110e

## Regenerating

Edit favicon.svg (the geometry is six <path>s — the first is the dark backing, drawn as the arch path filled and stroked 17 wide in #16110e — 6 units of rim past the 5-wide tube) and re-rasterise. Rasters at 16/32 were made from the flat version;
tiles wrap the mark in <g transform="translate(32 32) scale(S) translate(-32 -32)"> over a #16110e rect, S = 0.80 (0.64 for maskable). The mark itself is wrapped in a scale(0.89) group — keep that; it is what makes room for the rim.
