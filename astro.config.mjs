import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://alwyn-tablatin.vercel.app',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  fonts: [
    {
      name: 'Archivo',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'League Gothic',
      cssVariable: '--font-display',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
});
