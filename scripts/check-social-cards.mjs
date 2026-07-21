import { access, readdir, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const exec = promisify(execFile);
const posts = (await readdir(join(root, 'src', 'content', 'posts'))).filter((file) => file.endsWith('.md')).map((file) => file.replace(/\.md$/u, ''));
await access(join(root, 'public', 'social', 'default.png'));
for (const slug of posts) await access(join(root, 'public', 'social', `${slug}.png`));
const { stdout } = await exec('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', join(root, 'public', 'social', 'default.png')]);
if (!/pixelWidth: 1200[\s\S]*pixelHeight: 630/u.test(stdout)) throw new Error('Social cards must be 1200×630 PNG files.');

const html = await readFile(join(root, 'dist', 'posts', posts[0], 'index.html'), 'utf8');
if (!/property="og:image" content="https?:\/\/[^" ]+\/social\/.+\.png"/u.test(html)) throw new Error('Article og:image must point to its PNG social card.');
if (html.includes('og-default.svg')) throw new Error('SVG fallback must not be used for social previews.');
console.log(`Verified ${posts.length} article social PNG cards and OpenGraph metadata.`);
