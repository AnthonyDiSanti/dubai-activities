#!/usr/bin/env -S npm exec tsx --

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ONLY = process.argv.includes('--source-only');
const errors: string[] = [];
const fail = (message: string) => errors.push(message);

function absolute(relativePath: string): string {
  return path.join(ROOT, relativePath);
}

function read(relativePath: string): string {
  const target = absolute(relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    fail(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
}

function isDirectory(directory: string): boolean {
  return fs.existsSync(directory) && fs.statSync(directory).isDirectory();
}

function listFiles(directory: string): Map<string, number> {
  if (!isDirectory(directory)) return new Map();
  return new Map(
    fs.readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
      .map((entry) => [entry.name, fs.statSync(path.join(directory, entry.name)).size]),
  );
}

const requiredPaths = [
  'index.html',
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'src/main.tsx',
  'src/App.tsx',
  'src/data/activities.ts',
  'src/domain/activity.ts',
  'src/domain/favorites.ts',
  'src/styles/index.css',
  'docs/photo-attributions.csv',
  'public/photo-attributions.json',
  'public/photo-attributions.jsonld',
  'public/photos',
];
for (const relativePath of requiredPaths) {
  if (!fs.existsSync(absolute(relativePath))) fail(`Missing required path: ${relativePath}`);
}

const sourceIndex = read('index.html');
if ((sourceIndex.match(/<div\s+id=["']root["']/gi) ?? []).length !== 1) {
  fail('index.html must contain exactly one #root mount element.');
}
if (!/<script\b[^>]*type=["']module["'][^>]*src=["']\/src\/main\.tsx["'][^>]*><\/script>/i.test(sourceIndex)) {
  fail('index.html must load /src/main.tsx as its module entry.');
}
if (/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?\S[\s\S]*?<\/script>/i.test(sourceIndex)) {
  fail('index.html must not contain executable inline scripts.');
}
if (/<style\b/i.test(sourceIndex) || /\sstyle\s*=/i.test(sourceIndex)) {
  fail('index.html must not contain inline styles.');
}
if (/<(?:x-dc|sc-if|sc-for)\b|data-dc-script|dc-runtime/i.test(sourceIndex)) {
  fail('index.html still contains custom-runtime markup.');
}
if (!/<link\b[^>]*href=["']\.\/photo-attributions\.jsonld["'][^>]*type=["']application\/ld\+json["']/i.test(sourceIndex)) {
  fail('index.html must expose the generated JSON-LD photo attribution catalog.');
}
if (!/<title>Dubai activities<\/title>/i.test(sourceIndex)) {
  fail('index.html must use the neutral Dubai activities title.');
}
if (/\bnaima\b/i.test(sourceIndex)) {
  fail('index.html contains the retired personalized name.');
}

for (const legacyPath of ['src/index.html', 'src/js', 'src/css']) {
  if (fs.existsSync(absolute(legacyPath))) fail(`Legacy source path still exists: ${legacyPath}`);
}
for (const retiredPath of [
  'src/components/ArrivalBar.tsx',
  'src/domain/countdown.ts',
  'src/hooks/useCountdown.ts',
]) {
  if (fs.existsSync(absolute(retiredPath))) fail(`Retired countdown path still exists: ${retiredPath}`);
}

const packageJsonText = read('package.json');
if (packageJsonText) {
  const packageJson = JSON.parse(packageJsonText) as {
    type?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  if (packageJson.type !== 'module') fail('package.json must declare type=module.');
  for (const script of [
    'dev',
    'build',
    'preview',
    'lint',
    'test',
    'typecheck',
    'audit:attributions',
    'generate:attributions',
    'check',
  ]) {
    if (!packageJson.scripts?.[script]) fail(`package.json is missing the ${script} script.`);
  }
  for (const dependency of ['react', 'react-dom']) {
    if (!packageJson.dependencies?.[dependency]) fail(`package.json is missing ${dependency}.`);
  }
  for (const dependency of [
    '@fontsource/cormorant-garamond',
    '@fontsource/karla',
    '@fontsource/space-mono',
  ]) {
    if (!packageJson.dependencies?.[dependency]) fail(`package.json is missing ${dependency}.`);
  }
  for (const dependency of ['typescript', 'vite', 'vitest', 'eslint', 'tsx']) {
    if (!packageJson.devDependencies?.[dependency]) fail(`package.json is missing ${dependency}.`);
  }
}

const viteConfig = read('vite.config.ts');
if (!/\bbase\s*:\s*["']\.\/["']/.test(viteConfig)) {
  fail('vite.config.ts must use base: "./" for prefix-portable S3 output.');
}
if (!/\boutDir\s*:\s*["']dist["']/.test(viteConfig)) {
  fail('vite.config.ts must emit the production site to dist/.');
}

const mainSource = read('src/main.tsx');
if (!/createRoot\s*\(/.test(mainSource)) fail('src/main.tsx must mount React with createRoot.');
if (!/styles\/index\.css/.test(mainSource)) fail('src/main.tsx must import src/styles/index.css.');
if (!/AppErrorBoundary/.test(mainSource)) fail('src/main.tsx must retain the root error boundary.');

const styleEntry = read('src/styles/index.css');
if (!/@import\s+["']\.\/fonts\.css["']/.test(styleEntry)) {
  fail('src/styles/index.css must include the bundled font entry.');
}
if (/fonts\.(?:googleapis|gstatic)\.com|unpkg\.com\/react@/i.test(sourceIndex)) {
  fail('index.html must not depend on runtime framework or font CDNs.');
}

if (!SOURCE_ONLY) {
  const distIndexPath = absolute('dist/index.html');
  if (!fs.existsSync(distIndexPath) || !fs.statSync(distIndexPath).isFile()) {
    fail('dist/index.html is missing; run npm run build before the full site audit.');
  } else {
    const distIndex = fs.readFileSync(distIndexPath, 'utf8');
    if (!/<script\b[^>]*type=["']module["'][^>]*src=["']\.\/assets\/[^"']+\.js["']/i.test(distIndex)) {
      fail('Built index must load a relative, fingerprinted module from ./assets/.');
    }
    if (/\/src\/|\.tsx?\b|data-dc-script|dc-runtime|<x-dc\b/i.test(distIndex)) {
      fail('Built index contains a source-only or legacy-runtime reference.');
    }
    if (/\bnaima\b/i.test(distIndex)) {
      fail('Built index contains the retired personalized name.');
    }
    for (const attributionFile of ['photo-attributions.json', 'photo-attributions.jsonld']) {
      if (!fs.existsSync(absolute(`dist/${attributionFile}`))) {
        fail(`Built site is missing generated attribution data: ${attributionFile}`);
      }
    }

    // Every local HTML reference must resolve inside dist; external fonts are intentionally ignored.
    for (const match of distIndex.matchAll(/\b(?:src|href)=["']([^"'#]+)["']/gi)) {
      const reference = match[1];
      if (/^(?:https?:)?\/\//i.test(reference) || reference.startsWith('data:')) continue;
      if (reference.startsWith('/')) {
        fail(`Built index contains a root-absolute asset URL: ${reference}`);
        continue;
      }
      const cleanReference = reference.split(/[?#]/, 1)[0];
      if (!fs.existsSync(path.resolve(absolute('dist'), cleanReference))) {
        fail(`Built index references a missing asset: ${reference}`);
      }
    }

    const publicPhotos = listFiles(absolute('public/photos'));
    const builtPhotos = listFiles(absolute('dist/photos'));
    for (const [filename, bytes] of publicPhotos) {
      if (!builtPhotos.has(filename)) fail(`Built site is missing public asset: photos/${filename}`);
      else if (builtPhotos.get(filename) !== bytes) fail(`Built photo byte count changed: photos/${filename}`);
    }
    for (const filename of builtPhotos.keys()) {
      if (!publicPhotos.has(filename)) fail(`Built site has an unexpected photo asset: photos/${filename}`);
    }

    const assetDir = absolute('dist/assets');
    if (!isDirectory(assetDir)) {
      fail('Built site is missing dist/assets/.');
    } else {
      const bundledText = fs.readdirSync(assetDir)
        .filter((filename) => /\.(?:js|css)$/.test(filename))
        .map((filename) => fs.readFileSync(path.join(assetDir, filename), 'utf8'))
        .join('\n');
      if (/data-dc-script|dc-runtime|unpkg\.com\/react@/i.test(bundledText)) {
        fail('Production bundles still contain the custom runtime or CDN React loader.');
      }
      if (/\bnaima\b|arrival-bar|formatArrivalCountdown/i.test(bundledText)) {
        fail('Production bundles still contain retired personalization or countdown code.');
      }
    }
  }
}

if (errors.length) {
  console.error(`Site structure audit failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  SOURCE_ONLY
    ? 'Site source audit passed: Vite, React, TypeScript, relative build base, and no legacy runtime.'
    : 'Site build audit passed: static relative assets, mirrored public photos, and no legacy runtime.',
);
