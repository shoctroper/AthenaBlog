import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).filter((x) => x.startsWith('--')).map((x) => x.slice(2).split('=')));
if (!args.case || !args.caseId || !args.slug || !args.title || !args.topic || !args.tags) throw new Error('Usage: --case --caseId --slug --title --topic --tags');
const source = JSON.parse(await readFile(resolve(args.case), 'utf8'));
if (source.lifecycle?.$type !== 'Published') throw new Error('Only Published cases can be exported.');
const facts = source.contextPackage?.claims ?? [];
const tags = args.tags.split('|');
const data = { metadata: { title: args.title, description: source.draft.rawText.slice(0, 175).replace(/\s+\S*$/, '.') , topic: args.topic, tags, pubDate: '2026-07-21', readingTime: '4 min', caseId: args.caseId, sources: [{ id: facts[0]?.id?.replace(/^claim:/, '').split('::')[0] ?? 'corpus', label: 'Corpus editorial de referencia' }], trustSummary: 'Hechos provisionales conservados desde el ContextPackage aprobado.', scriptStatus: 'planned' }, markdown: source.draft.rawText };
await writeFile(`scripts/exporter/${args.slug}.json`, JSON.stringify(data, null, 2));
console.log(`Prepared ${args.slug}.json`);
