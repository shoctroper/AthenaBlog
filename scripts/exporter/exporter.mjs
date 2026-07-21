import { readFile } from 'node:fs/promises';
const required = ['title', 'description', 'topic', 'tags', 'pubDate', 'caseId', 'sources', 'trustSummary', 'scriptStatus'];
const quote = (value) => JSON.stringify(value);
export function toPost({ metadata, markdown }) {
  for (const key of required) if (metadata[key] == null) throw new Error(`Missing required metadata: ${key}`);
  if (!Array.isArray(metadata.tags) || !metadata.tags.length) throw new Error('tags must contain at least one value');
  if (!Array.isArray(metadata.sources) || !metadata.sources.length) throw new Error('sources must contain at least one value');
  const frontmatter = [`title: ${quote(metadata.title)}`, `description: ${quote(metadata.description)}`, `topic: ${quote(metadata.topic)}`, `tags: [${metadata.tags.map(quote).join(', ')}]`, `pubDate: ${metadata.pubDate}`, `heroImage: ${quote(metadata.heroImage ?? '')}`, `readingTime: ${quote(metadata.readingTime ?? '5 min')}`, 'draft: false', `caseId: ${quote(metadata.caseId)}`, 'sources:', ...metadata.sources.flatMap((source) => [`  - id: ${quote(source.id)}`, `    label: ${quote(source.label)}`]), `trustSummary: ${quote(metadata.trustSummary)}`, `scriptStatus: ${quote(metadata.scriptStatus)}`];
  return `---\n${frontmatter.join('\n')}\n---\n\n${markdown.trim()}\n`;
}
export async function transformJson(inputFile) { return toPost(JSON.parse(await readFile(inputFile, 'utf8'))); }
