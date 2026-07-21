import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const posts = (await readdir(join(root, 'src', 'content', 'posts'))).filter((file) => file.endsWith('.md')).map((file) => file.replace(/\.md$/u, ''));
await access(join(root, 'public', 'social', 'default.png'));
for (const slug of posts) await access(join(root, 'public', 'social', `${slug}.png`));
const png = await readFile(join(root, 'public', 'social', 'default.png'));
if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) throw new Error('Social cards must be 1200×630 PNG files.');

const html = await readFile(join(root, 'dist', 'posts', posts[0], 'index.html'), 'utf8');
if (!/property="og:image" content="https?:\/\/[^" ]+\/social\/.+\.png"/u.test(html)) throw new Error('Article og:image must point to its PNG social card.');
if (html.includes('og-default.svg')) throw new Error('SVG fallback must not be used for social previews.');
console.log(`Verified ${posts.length} article social PNG cards and OpenGraph metadata.`);
