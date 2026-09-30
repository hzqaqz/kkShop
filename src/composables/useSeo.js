import { useHead, useSeoMeta } from '@unhead/vue';

const SITE_URL = 'https://meowerair.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-lifestyle.png`;
const SITE_NAME = 'Meower';
const DEFAULT_TITLE = 'Meower | Pet-Friendly Air Purifiers & Dehumidifiers';
const DEFAULT_DESCRIPTION =
  'Meower air purifiers and dehumidifiers for pet-friendly homes and businesses. HEPA H13 air purification and humidity control for distributors, retailers, and OEM/ODM buyers worldwide.';

/**
 * Central SEO helper: sets <title>, meta description, canonical URL,
 * Open Graph and Twitter Card tags for each route.
 *
 * @param {Object} options
 * @param {string} [options.title]        Page title without the "| Meower" suffix.
 * @param {string} [options.description]  Meta description.
 * @param {string} [options.path]         Canonical path, defaults to '/'.
 * @param {string} [options.image]        og:image / twitter:image absolute URL.
 * @param {'website'|'article'} [options.type]
 */
export function useSeo({ title, description, path = '/', image = DEFAULT_IMAGE, type = 'website' }) {
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} | Meower` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  useSeoMeta({
    title: fullTitle,
    description: metaDescription,
    ogTitle: fullTitle,
    ogDescription: metaDescription,
    ogType: type,
    ogUrl: url,
    ogImage: image,
    ogSiteName: SITE_NAME,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: metaDescription,
    twitterImage: image,
  });

  useHead({
    link: [{ rel: 'canonical', href: url }],
  });
}

/** Strip markdown syntax and return a plain-text excerpt. */
export function excerptFromMarkdown(markdown, length = 160) {
  if (!markdown) return '';
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= length) return plain;
  const cut = plain.slice(0, length);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
