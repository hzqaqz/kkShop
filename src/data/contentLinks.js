import { blogArticles } from './blogArticles';
import { getProduct } from './products';

/**
 * Editorial topic map — drives internal linking between articles and products.
 *
 * `tags` power "related reading"; `products` powers the "recommended product"
 * cards shown at the end of an article. Keep tags small and consistent so the
 * matching stays meaningful.
 */
export const articleTopics = {
  'pollen-season-new-zealand-indoor-air': {
    tags: ['allergies', 'air-purifier', 'family'],
    products: ['mw200', 'mw100'],
  },
  'beyond-comfort-humidity-control-indoor-air-quality': {
    tags: ['humidity', 'dehumidifier', 'air-quality'],
    products: ['md001', 'commercial-dehumidifier'],
  },
  'focus-on-asset-protection-technical-equipment-selection': {
    tags: ['commercial', 'humidity', 'dehumidifier'],
    products: ['commercial-dehumidifier', 'ceiling-mounted-dehumidifier'],
  },
  'filter-care-everyday-performance': {
    tags: ['air-purifier', 'maintenance'],
    products: ['mw100', 'mw200'],
  },
  'fresher-family-living-room': {
    tags: ['air-purifier', 'family', 'air-quality'],
    products: ['mw200', 'mw100'],
  },
  'overcoming-the-ac-misconception': {
    tags: ['humidity', 'dehumidifier'],
    products: ['md001'],
  },
  'property-management-asset-protection': {
    tags: ['commercial', 'humidity', 'mold'],
    products: ['commercial-dehumidifier', 'ceiling-mounted-dehumidifier'],
  },
  'humidity-science-mold-control': {
    tags: ['humidity', 'mold', 'dehumidifier'],
    products: ['md001', 'commercial-dehumidifier'],
  },
  'how-humid-air-affects-pets': {
    tags: ['pets', 'humidity'],
    products: ['md001', 'mw100'],
  },
  'how-indoor-air-quality-affects-your-pets': {
    tags: ['pets', 'air-purifier'],
    products: ['mw100', 'mw200'],
  },
  'the-air-our-children-breathe': {
    tags: ['family', 'air-purifier', 'air-quality'],
    products: ['mw200', 'mw100'],
  },
};

function sortDate(article) {
  return article.sortDate ?? article.date ?? '';
}

export function getArticleTopics(slug) {
  return articleTopics[slug] ?? { tags: [], products: [] };
}

/** Newest-first list of every article except `slug`. */
export function getRecentArticles(slug, limit = 3) {
  return [...blogArticles]
    .filter((article) => article.slug !== slug)
    .sort((a, b) => sortDate(b).localeCompare(sortDate(a)))
    .slice(0, limit);
}

/**
 * Related reading: articles sharing the most topic tags with `slug`,
 * falling back to the most recent articles when nothing overlaps.
 */
export function getRelatedArticles(slug, limit = 3) {
  const current = articleTopics[slug];

  if (!current || current.tags.length === 0) {
    return getRecentArticles(slug, limit);
  }

  const scored = blogArticles
    .filter((article) => article.slug !== slug)
    .map((article) => {
      const topics = articleTopics[article.slug];
      const shared = topics ? topics.tags.filter((tag) => current.tags.includes(tag)).length : 0;
      return { article, shared };
    })
    .sort(
      (a, b) => b.shared - a.shared || sortDate(b.article).localeCompare(sortDate(a.article)),
    );

  return scored.slice(0, limit).map((entry) => entry.article);
}

/** Product objects recommended at the end of an article. */
export function getArticleProducts(slug, limit = 2) {
  const topics = getArticleTopics(slug);
  return topics.products
    .map((id) => getProduct(id))
    .filter(Boolean)
    .slice(0, limit);
}

/** Articles that reference a given product id, newest first. */
export function getArticlesForProduct(productId, limit = 3) {
  return [...blogArticles]
    .filter((article) => getArticleTopics(article.slug).products.includes(productId))
    .sort((a, b) => sortDate(b).localeCompare(sortDate(a)))
    .slice(0, limit);
}
