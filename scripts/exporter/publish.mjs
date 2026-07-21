import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { transformJson } from './exporter.mjs';
const args = Object.fromEntries(process.argv.slice(2).filter((arg) => arg.startsWith('--')).map((arg) => arg.slice(2).split('=')));
if (!args.case || !args.input || !args.output) throw new Error('Usage: publish.mjs --case=case.json --input=post.json --output=src/content/posts');
const caseData = JSON.parse(await readFile(args.case, 'utf8'));
if (caseData.lifecycle?.$type !== 'Published') throw new Error(`P1 rejection: case lifecycle is ${caseData.lifecycle?.$type ?? 'unknown'}, not Published.`);
const target = join(args.output, `${basename(args.input, '.json')}.md`);
await mkdir(dirname(target), { recursive: true });
try { await readFile(target, 'utf8'); throw new Error(`P5 rejection: ${target} already exists; corrections require a new slug.`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(target, await transformJson(args.input), { flag: 'wx' });
console.log(`Published local entry: ${target}`);
