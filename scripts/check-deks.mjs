import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const files = await readdir('src/content/posts');
for (const file of files.filter((name) => name.endsWith('.md'))) {
  const text = await readFile(join('src/content/posts', file), 'utf8');
  const value = text.match(/^description: "(.+)"$/mu)?.[1];
  if (!value || !/[.!?]$/.test(value) || /[,;(]\.$/u.test(value)) throw new Error(`Dek must end at a sentence boundary: ${file}`);
}
console.log('Verified: all deks end at sentence boundaries.');
