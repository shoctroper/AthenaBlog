import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
const source = join(root, 'src', 'content', 'posts');
const destination = join(root, 'public', 'social');
const work = join(tmpdir(), `athena-social-${process.pid}`);

const colors = ['#9A432D', '#315F57', '#80613E', '#465A7A'];
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const value = (frontmatter, key) => frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'mu'))?.[1]?.replace(/^['"]|['"]$/gu, '').trim();
const words = (title) => {
  const chunks = []; let line = '';
  for (const word of title.split(/\s+/u)) {
    if (`${line} ${word}`.trim().length > 23 && line) { chunks.push(line); line = word; } else line = `${line} ${word}`.trim();
  }
  if (line) chunks.push(line);
  return chunks.slice(0, 4);
};
function svg(title, category, color) {
  const lines = words(title);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${color}"/><circle cx="1035" cy="125" r="285" fill="#ffffff" opacity=".08"/><path d="M0 560 C260 450 420 720 740 555 S1080 425 1200 510 V630 H0Z" fill="#000000" opacity=".12"/><text x="78" y="86" fill="#FAF6F0" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="5">${escapeXml(category.toUpperCase())}</text>${lines.map((line, index) => `<text x="78" y="${240 + index * 88}" fill="#FAF6F0" font-family="Georgia,serif" font-size="70">${escapeXml(line)}</text>`).join('')}<text x="78" y="570" fill="#FAF6F0" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4">MARIO COLLI</text></svg>`;
}

async function png(name, markup) {
  const svgFile = join(work, `${name}.svg`);
  await writeFile(svgFile, markup);
  await exec('qlmanage', ['-t', '-s', '1200', '-o', work, svgFile]);
  await exec('sips', ['-c', '630', '1200', join(work, `${name}.svg.png`)]);
  await rename(join(work, `${name}.svg.png`), join(destination, `${name}.png`));
}

await mkdir(destination, { recursive: true });
await mkdir(work, { recursive: true });
try {
  const files = (await readdir(source)).filter((file) => file.endsWith('.md')).sort();
  await png('default', svg('Ideas, tecnología y vida', 'Mario Colli', colors[0]));
  for (const [index, file] of files.entries()) {
    const markdown = await readFile(join(source, file), 'utf8');
    const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
    const title = value(frontmatter, 'title');
    const category = value(frontmatter, 'topic') ?? 'Ideas';
    if (!title) throw new Error(`Missing title in ${file}`);
    await png(file.replace(/\.md$/u, ''), svg(title, category, colors[index % colors.length]));
  }
  console.log(`Generated ${files.length + 1} deterministic 1200×630 social cards.`);
} finally { await rm(work, { recursive: true, force: true }); }
