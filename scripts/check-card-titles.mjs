import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

const htmlFiles = (await files(fileURLToPath(new URL('../dist', import.meta.url)))).filter((file) => file.endsWith('.html'));
const pages = await Promise.all(htmlFiles.map(async (file) => ({ file, html: await readFile(file, 'utf8') })));
const cards = pages.flatMap(({ file, html }) => [...html.matchAll(/<article class="post-card"[\s\S]*?<\/article>/gu)].map(([html]) => ({ file, html })));

for (const { file, html } of cards) {
  const hasTypographyCover = html.includes('data-visual-title=');
  const title = html.match(/<h2 class="([^"]*)"[^>]*>([^<]+)<\/h2>/u);
  if (!title) throw new Error(`Card without semantic h2: ${file}`);
  const isHidden = title[1].split(/\s+/u).includes('sr-only');
  if (hasTypographyCover !== isHidden) throw new Error(`Card title visibility rule failed: ${file}`);
  if (hasTypographyCover && !html.includes(`data-visual-title="${title[2]}"`)) throw new Error(`Typography cover title mismatch: ${file}`);
}

console.log(`Verified: ${cards.length} cards render their title exactly once visually.`);
