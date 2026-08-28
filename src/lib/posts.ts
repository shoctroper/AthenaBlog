import { getCollection } from 'astro:content';

/**
 * CONTENT_CONTRACT.md: `draft` indica muestra temporal y **no se muestra al lector**.
 * El contrato existía desde el principio y ningún consumidor lo cumplía: `primera-nota`
 * (draft: true) se publicó en portada, RSS, tags y con ruta propia (BLOG-DRAFT-001).
 * Toda superficie pública lee de aquí, nunca de getCollection('posts') directamente.
 */
export async function getPublishedPosts() {
  return (await getCollection('posts')).filter((post) => !post.data.draft);
}

export async function getPublishedPostsByDate() {
  return (await getPublishedPosts()).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}
