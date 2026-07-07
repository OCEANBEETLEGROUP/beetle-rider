import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * RIDE JOURNAL — SEO記事コレクション（リポジトリ内Markdown管理）
 * ファイル名: {slug}.{lang}.md  （例: kamakura-chopper-one-day.en.md）
 * 週次でAIが記事を追加 → TAKEレビュー → merge で公開。
 */
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['ja', 'en']),
    cover: z.string(),
    category: z.string(),
    product: z.enum(['chopper', 'ebike', 'both']).default('both'),
  }),
});

export const collections = { journal };
