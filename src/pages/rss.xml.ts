import rss from '@astrojs/rss';
import { getPosts, notionConfigured } from '../lib/notion';

export async function GET(context: { site?: URL }) {
  const posts = notionConfigured() ? await getPosts() : [];
  const site = context.site ?? new URL('https://argota.pages.dev');
  return rss({
    title: 'Argota',
    description: 'Argota — feed of recent posts.',
    site,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: p.lastEdited ? new Date(p.lastEdited) : new Date(),
      description: p.excerpt,
      // RSS readers require absolute URLs.
      link: new URL(`/blog/${p.slug}/`, site).toString(),
    })),
  });
}
