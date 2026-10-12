// Run after a build (npm run budget). Not part of `npm test`, so a stale dist/ can never fail the normal suite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const astro = join(dist, '_astro');
const gz = (file: string) => gzipSync(readFileSync(file)).length;
const kb = (bytes: number) => Math.round((bytes / 1024) * 10) / 10;
const all = readdirSync(astro, { recursive: true, encoding: 'utf8' });

// The code a first visit pays for: the page's module scripts plus everything they import statically.
function eager() {
  const seen = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name)) return;
    seen.add(name);
    const src = readFileSync(join(astro, name), 'utf8');
    for (const m of src.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) visit(m[1]);
  };
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  for (const m of html.matchAll(/src="\/_astro\/([^"]+\.js)"/g)) visit(m[1]);
  return [...seen];
}

const total = (names: string[]) => names.reduce((n, f) => n + gz(join(astro, f)), 0);
const chunk = (prefix: string) => all.filter((f) => f.startsWith(prefix) && f.endsWith('.js'));

test('first visit JavaScript stays under 55 KB gzipped', () => {
  const size = total(eager());
  console.log(`eager js: ${kb(size)} KB`);
  assert.ok(size <= 55 * 1024, `${kb(size)} KB`);
});

test('lazy chunks stay under budget', () => {
  for (const [prefix, max] of [['world.', 165], ['arcade-ui.', 8]] as const) {
    const names = chunk(prefix);
    assert.ok(names.length > 0, `${prefix} chunk missing`);
    const size = total(names);
    console.log(`${prefix} ${kb(size)} KB`);
    assert.ok(size <= max * 1024, `${prefix} ${kb(size)} KB > ${max} KB`);
  }
});

test('CSS stays under 15 KB and fonts under 90 KB', () => {
  const css = total(all.filter((f) => f.endsWith('.css')));
  const fonts = all.filter((f) => f.endsWith('.woff2')).reduce((n, f) => n + readFileSync(join(astro, f)).length, 0);
  console.log(`css ${kb(css)} KB, fonts ${kb(fonts)} KB`);
  assert.ok(css <= 15 * 1024);
  assert.ok(fonts <= 90 * 1024);
});
