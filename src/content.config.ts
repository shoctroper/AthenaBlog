import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(24).max(180),
    tags: z.array(z.string().min(2)).min(1),
    pubDate: z.coerce.date(),
    topic: z.string().min(2),
    heroImage: z.string().optional(),
    readingTime: z.string().min(3),
    videoUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
    caseId: z.string().uuid().describe('internal: true'),
    sources: z.array(z.object({ id: z.string(), label: z.string(), url: z.string().url().optional() })).min(1),
    trustSummary: z.string().min(12).describe('internal: true'),
    scriptStatus: z.enum(['unavailable', 'planned', 'available']).describe('internal: true'),
  }),
});

const videos = defineCollection({
  loader: glob({ base: './src/content/videos', pattern: '**/*.md' }),
  schema: z.object({ title: z.string().min(4), description: z.string().min(12), platform: z.enum(['YouTube', 'Instagram', 'TikTok']), url: z.string().url(), pubDate: z.coerce.date() }),
});

export const collections = { posts, videos };
