/**
 * Central product data.
 *
 * Kept in one place so the product detail page, related-product cards,
 * breadcrumbs and blog cross-links all stay in sync.
 */
export const products = {
  mw100: {
    id: 'mw100',
    label: 'MW100',
    cardLabel: 'Meower 100',
    category: 'Air Purifier',
    title: 'MW100 Pet-Friendly Air Purifier',
    cardSubtitle: 'Smart Air Purifier for Pet Homes',
    description:
      'The Meower MW100 pet-friendly air purifier reduces airborne fur, dander, dust and odors with HEPA filtration for calmer, cleaner cat-friendly homes.',
    image: '/images/products/list/mw100.webp',
    // Link-preview image. `image` above is a tall product cut-out, which a
    // 1.91:1 social card would crop through the middle of the product.
    ogImage: '/images/products/mw100/hero-scene.webp',
  },
  mw200: {
    id: 'mw200',
    label: 'MW200',
    cardLabel: 'Meower 200',
    category: 'Air Purifier',
    title: 'MW200 Air Purifier with H13 HEPA',
    cardSubtitle: '360° Air Intake with H13 HEPA',
    description:
      'The Meower MW200 air purifier combines 360° air intake, three-stage composite filtration and H13 HEPA media with a 400 m³/h CADR for rooms of 20–40 m².',
    image: '/images/products/list/mw200.webp',
    ogImage: '/images/products/mw200/hero-scene.webp',
  },
  md001: {
    id: 'md001',
    label: 'MD001 Dehumidifier',
    cardLabel: 'MD001',
    category: 'Home Dehumidifier',
    page: 'md001',
    title: 'MD001 Home Dehumidifier',
    cardSubtitle: 'Comfortable Living, Healthier Home',
    description:
      'The Meower MD001 home dehumidifier keeps bedrooms, living rooms, bathrooms and closets comfortably dry for everyday indoor living.',
    image: '/images/products/md001/product-white.webp',
    ogImage: '/images/products/md001/hero-living-room.webp',
  },
  'commercial-dehumidifier': {
    id: 'commercial-dehumidifier',
    label: 'Commercial Dehumidifier',
    cardLabel: 'Commercial',
    category: 'Commercial Dehumidifier',
    page: 'commercial',
    title: 'Commercial Dehumidifier',
    cardSubtitle: 'Reliable Moisture Management',
    description:
      'Meower commercial dehumidifiers provide reliable moisture management for warehouses, basements, garages and larger professional spaces.',
    image: '/images/products/list/commercial-dehumidifier.webp',
    ogImage: '/images/products/md0001/warehouse-hero.webp',
  },
  'ceiling-mounted-dehumidifier': {
    id: 'ceiling-mounted-dehumidifier',
    label: 'Ceiling-Mounted Dehumidifier',
    cardLabel: 'Ceiling-Mounted',
    category: 'Commercial Dehumidifier',
    page: 'ceiling-mounted',
    title: 'Ceiling-Mounted Dehumidifier',
    cardSubtitle: 'Space-Saving Ceiling Installation',
    description:
      'Meower ceiling-mounted dehumidifiers save floor space while keeping factories, facilities and commercial spaces dry and comfortable.',
    image: '/images/products/md0002/ceiling-mounted-dehumidifier-white.webp',
    ogImage: '/images/products/md0002/ceiling-mounted-factory-scene.webp',
  },
};

/** Display order used by related-product lists. */
export const productOrder = [
  'mw100',
  'mw200',
  'md001',
  'commercial-dehumidifier',
  'ceiling-mounted-dehumidifier',
];

export function getProduct(id) {
  return products[id] ?? null;
}

/** Related products = the other products, prioritising shared category. */
export function getRelatedProducts(id, limit = 3) {
  const current = products[id];
  if (!current) {
    return productOrder.slice(0, limit).map((key) => products[key]);
  }

  return productOrder
    .filter((key) => key !== id)
    .map((key) => products[key])
    .sort((a, b) => {
      const aSame = a.category === current.category ? 0 : 1;
      const bSame = b.category === current.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);
}
