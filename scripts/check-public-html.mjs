import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const forbidden = /\b(athena|guion|caso|aprobado|ia|generad\w*|automatiz\w*)\b/iu;

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

const htmlFiles = (await files(fileURLToPath(new URL('../dist', import.meta.url)))).filter((file) => file.endsWith('.html'));
const violations = [];
for (const file of htmlFiles) {
  const match = (await readFile(file, 'utf8')).match(forbidden);
  if (match) violations.push(`${file}: ${match[0]}`);
}
if (violations.length) throw new Error(`Cadenas públicas prohibidas:\n${violations.join('\n')}`);
console.log(`Verified: ${htmlFiles.length} HTML files contain no prohibited public strings.`);
