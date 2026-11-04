/**
 * Central product data.
 *
 * Kept in one place so the product detail page, related-product cards,
 * breadcrumbs and blog cross-links all stay in sync.
 *
 * Two fields decide where a product is listed:
 *   shopCategoryId — a Shop category id (see `src/data/catalog.js`)
 *   businessGroup  — a Business range id (see `src/data/catalog.js`)
 * Omit either field to keep the product out of that listing.
 */
export const products = {
  mw100: {
    id: 'mw100',
    // MW100 暂时不展示：从商品列表/导航/相关推荐中隐藏，但数据保留以便日后恢复。
    hidden: true,
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
    // MW200 是唯一可在线下单的商品：走 Shopify Storefront 结账。
    purchasable: true,
    shopifyHandle: 'mw200',
    label: 'MW200',
    cardLabel: 'Meower 200',
    category: 'Air Purifier',
    // Shop 分类归属（见 src/data/catalog.js）。
    shopCategoryId: 'air-purifiers',
    // Business 页产品线归属。
    businessGroup: 'air-purifiers',
    title: 'MW200 Air Purifier with H13 HEPA',
    cardSubtitle: '360° Air Intake with H13 HEPA',
    // Own page component, laid out like MD001 (Mw100ProductPage stays for MW100).
    page: 'mw200',
    description:
      'The Meower MW200 air purifier combines 360° air intake, three-stage composite filtration and H13 HEPA media with a 400 m³/h CADR for rooms of 20–40 m².',
    image: '/images/products/list/mw200.webp',
    ogImage: '/images/products/mw200/hero-armchair.webp',
    // Transparent cut-out for the navigation mega menu.
    navImage: '/images/products/navigation/mw200-transparent.webp',
  },
  'cat-scratcher-frame': {
    id: 'cat-scratcher-frame',
    // 通过 Shopify Storefront 在线下单（四种画面为四个变体，US$38.00）。
    purchasable: true,
    shopifyHandle: 'framed-cat-scratching-board',
    // Shopify 里的变体值是中文，前台统一显示英文。
    variantLabels: {
      '星月夜': 'Starry Night',
      '向日葵': 'Sunflowers',
      '带珍珠耳环的少女': 'Meow with a Pearl Earring',
      '森林': 'Cypress Field',
    },
    label: 'Framed Cat Scratcher',
    cardLabel: 'Framed Cat Scratcher',
    category: 'Cat Scratcher',
    // Shop 分类归属：Cat Scratching Posts（见 src/data/catalog.js）。
    shopCategoryId: 'cat-scratchers',
    page: 'cat-scratcher-frame',
    title: 'Framed Cat Scratching Board',
    cardSubtitle: 'Wall Art the Cat Can Scratch',
    description:
      'A framed cat scratching board in sisal over an EPS core — 42 × 33 × 3 cm and 650 g, mounted on walls, sofas or cabinets with four velcro pads that leave no residue.',
    image: '/images/products/cat-scratcher-frame/card-cutout.webp',
    ogImage: '/images/products/cat-scratcher-frame/hero.webp',
    inquiryNote: 'Stock, designs and delivery — ask us and we will confirm.',
  },

  'car-pet-seat': {
    id: 'car-pet-seat',
    // 通过 Shopify Storefront 在线下单（两个颜色变体，US$100.00）。
    purchasable: true,
    shopifyHandle: 'car-seat-pet-bed-travel-carrier',
    // Shopify 里的变体值目前是中文，前台统一显示英文。
    variantLabels: { '卡其色': 'Camel', '灰蓝色': 'Grey-blue' },
    label: 'Car Pet Seat',
    cardLabel: 'Car Seat Travel Bed',
    category: 'Pet Carrier',
    // Shop 分类归属：Pet Carriers & Bags（见 src/data/catalog.js）。
    shopCategoryId: 'pet-carriers',
    page: 'car-pet-seat',
    title: 'Car Seat Pet Bed & Travel Carrier',
    cardSubtitle: 'Seat, Carrier and Flat Bed',
    description:
      'A waterproof faux-leather car seat bed that straps into the car, carries like a bag and unzips into a flat bed — 60 × 50 × 32 cm, for cats and small dogs up to about 10 kg.',
    image: '/images/products/car-pet-seat/card-cutout.webp',
    ogImage: '/images/products/car-pet-seat/car-dog.webp',
    inquiryNote: 'Stock, colours and delivery — ask us and we will confirm.',
  },

  'pom-pom-cat-toy': {
    id: 'pom-pom-cat-toy',
    // 通过 Shopify Storefront 在线下单（单变体，US$59.00）。
    purchasable: true,
    shopifyHandle: 'push-button-pom-pom-cat-toy',
    label: 'Pom-Pom Cat Toy',
    cardLabel: 'Push-Button Pom-Pom Toy',
    category: 'Pet Toy',
    // Shop 分类归属：Pet Toys（见 src/data/catalog.js）。
    shopCategoryId: 'pet-toys',
    page: 'cat-toy',
    title: 'Push-Button Pom-Pom Cat Toy',
    cardSubtitle: 'Launch and Retract the Ball',
    description:
      'A battery-powered cat toy with one button to fire a pom-pom across the room and another to reel it back in, so play carries on without anyone bending down. Two replaceable pom-poms included.',
    // Product cards use the cut-out (transparent background); the social card
    // keeps the lifestyle artwork.
    image: '/images/products/cat-toy/card-cutout.webp',
    ogImage: '/images/products/cat-toy/lifestyle-wide.webp',
  },
  'christmas-pet-bed': {
    id: 'christmas-pet-bed',
    // 通过 Shopify Storefront 在线下单（三个尺码为三个 variant）。
    purchasable: true,
    shopifyHandle: 'christmas-plaid-cat-dog-bed',
    label: 'Christmas Pet Bed',
    cardLabel: 'Festive Plaid Pet Bed',
    category: 'Pet Bed',
    // Shop 分类归属：Pet Beds（见 src/data/catalog.js）。
    shopCategoryId: 'pet-beds',
    page: 'pet-bed',
    title: 'Christmas Plaid Cat & Dog Bed',
    cardSubtitle: 'Festive Plaid, Plush Comfort',
    description:
      'A festive plaid cat and dog bed with a short plush surface and PP cotton fill, raised bolsters and red pom-pom trim — warm all year, in three sizes from 40 × 30 × 20 cm to 60 × 50 × 30 cm.',
    // Product cards use the cut-out (transparent background) so the wide bed
    // reads at a similar weight to the tall purifier cut-outs; the category tile
    // and the social card keep their own framings.
    image: '/images/products/christmas-pet-bed/card-cutout.webp',
    ogImage: '/images/products/christmas-pet-bed/hero-sizes.webp',
  },
  'commercial-air-purifier': {
    id: 'commercial-air-purifier',
    label: 'Commercial Air Purifier',
    cardLabel: 'Commercial Air Purifier',
    category: 'Commercial Air Purifier',
    businessGroup: 'air-purifiers',
    page: 'commercial-air-purifier',
    title: 'Commercial Air Purifier MW1000',
    cardSubtitle: 'H13 Filtration for Large Spaces',
    description:
      'The Meower MW1000 commercial air purifier pairs an H13 filter with an 877 m³/h particle CADR to cover commercial spaces of up to 105 m².',
    image: '/images/products/mw1000/product-white.webp',
    navImage: '/images/products/mw1000/product-transparent.webp',
    ogImage: '/images/products/mw1000/hero-gym.webp',
  },
  md001: {
    id: 'md001',
    label: 'MD001 Dehumidifier',
    cardLabel: 'MD001',
    category: 'Home Dehumidifier',
    businessGroup: 'dehumidifiers',
    page: 'md001',
    title: 'MD001 Home Dehumidifier',
    cardSubtitle: 'Comfortable Living, Healthier Home',
    description:
      'The Meower MD001 home dehumidifier keeps bedrooms, living rooms, bathrooms and closets comfortably dry for everyday indoor living.',
    image: '/images/products/md001/product-white.webp',
    ogImage: '/images/products/md001/hero-living-room.webp',
    navImage: '/images/products/md001/product-transparent.webp',
  },
  // NOTE: asset folder is `md002` (this product). The existing `md0002` folder
  // holds the unrelated MD0002 ceiling-mounted unit — one character apart.
  md002: {
    id: 'md002',
    label: 'MD002 Dehumidifier',
    cardLabel: 'MD002',
    category: 'Home Dehumidifier',
    businessGroup: 'dehumidifiers',
    page: 'md002',
    title: 'MD002 Home Dehumidifier with Clothes Drying',
    cardSubtitle: 'Dry Laundry, Dry Rooms',
    description:
      'The Meower MD002 home dehumidifier removes up to 20 L/day at high temperature and includes a clothes-drying function for bathrooms, laundry rooms and bedrooms.',
    image: '/images/products/md002/product-white.webp',
    ogImage: '/images/products/md002/og-card.jpg',
    navImage: '/images/products/md002/product-transparent.webp',
  },
  'commercial-dehumidifier': {
    id: 'commercial-dehumidifier',
    label: 'Commercial Dehumidifier',
    cardLabel: 'Commercial',
    category: 'Commercial Dehumidifier',
    businessGroup: 'dehumidifiers',
    page: 'commercial',
    title: 'Commercial Dehumidifier',
    cardSubtitle: 'Reliable Moisture Management',
    description:
      'Meower commercial dehumidifiers provide reliable moisture management for warehouses, basements, garages and larger professional spaces.',
    image: '/images/products/list/commercial-dehumidifier.webp',
    ogImage: '/images/products/md0001/warehouse-hero.webp',
    navImage: '/images/products/navigation/md0001-transparent.webp',
  },
  'ceiling-mounted-dehumidifier': {
    id: 'ceiling-mounted-dehumidifier',
    label: 'Ceiling-Mounted Dehumidifier',
    cardLabel: 'Ceiling-Mounted',
    category: 'Commercial Dehumidifier',
    businessGroup: 'dehumidifiers',
    page: 'ceiling-mounted',
    title: 'Ceiling-Mounted Dehumidifier',
    cardSubtitle: 'Space-Saving Ceiling Installation',
    description:
      'Meower ceiling-mounted dehumidifiers save floor space while keeping factories, facilities and commercial spaces dry and comfortable.',
    image: '/images/products/md0002/ceiling-mounted-dehumidifier-white.webp',
    ogImage: '/images/products/md0002/ceiling-mounted-factory-scene.webp',
    navImage: '/images/products/navigation/md0002-transparent.webp',
  },
};

/** Display order used by related-product lists (hidden products excluded). */
export const productOrder = [
  'mw100',
  'mw200',
  'christmas-pet-bed',
  'pom-pom-cat-toy',
  'car-pet-seat',
  'cat-scratcher-frame',
  'commercial-air-purifier',
  'md001',
  'md002',
  'commercial-dehumidifier',
  'ceiling-mounted-dehumidifier',
].filter((id) => !products[id]?.hidden);

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
