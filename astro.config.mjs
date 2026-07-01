// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://beetlerider.com',
  // microCMS画像をビルド時に取り込み・最適化してCloudflareから配信（microCMS転送量の超過対策・2026-06-29）
  image: {
    domains: ['images.microcms-assets.io'],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja-JP',
          en: 'en-US',
        },
      },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: false,  // ja → /, en → /en/
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
