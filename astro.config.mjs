import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Change this when a custom domain is added; canonicals, sitemap, robots.txt, llms.txt and JSON-LD all derive from it.
  site: 'https://alwyn-tablatin.vercel.app',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  fonts: [
    {
      name: 'Space Grotesk',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'Press Start 2P',
      cssVariable: '--font-pixel',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
});
