/**
 * Storefront catalog structure.
 *
 * Single source of truth for the Shop navigation / mega menu, the Shop landing
 * page (`/products`) and the Business page product list. Membership is declared
 * on each product in `products.js` (`shopCategoryId` / `businessGroup`), so
 * adding a product there is enough for it to appear in all of those places.
 *
 * Category order below is the order shown on the site — reorder the arrays to
 * change it.
 */
import { Baby, Backpack, BedDouble, Bone, Cat } from 'lucide-vue-next';
import { products, productOrder } from './products';

/**
 * Shop categories (the `/products` page and the Shop mega menu).
 * `image` is optional: without it the card falls back to the `icon` tile.
 */
export const shopCategories = [
  {
    id: 'air-purifiers',
    label: 'Air Purifiers',
    title: 'Air Purifiers',
    description:
      'Pet-friendly HEPA H13 air purifiers that capture fur, dander, dust and everyday odours.',
    image: '/images/categories/home-use-air-purifier.webp',
  },
  {
    id: 'pet-strollers',
    label: 'Pet Strollers',
    title: 'Pet Strollers',
    description:
      'Strollers that let small pets, senior cats and dogs travel with you comfortably.',
    icon: Baby,
  },
  {
    id: 'pet-carriers',
    label: 'Pet Carriers & Bags',
    title: 'Pet Carriers & Bags',
    description:
      'Carriers and bags for vet visits, travel and everyday trips out of the house.',
    icon: Backpack,
  },
  {
    id: 'pet-beds',
    label: 'Pet Beds',
    title: 'Pet Beds',
    description:
      'Beds and cosy spots that give cats and dogs somewhere of their own to rest.',
    // White-background product shot framed with margin, so the wide bed sits
    // at a similar weight to the tall air-purifier cut-out beside it.
    image: '/images/products/christmas-pet-bed/white-tile.webp',
    icon: BedDouble,
  },
  {
    id: 'cat-scratchers',
    label: 'Cat Scratching Posts',
    title: 'Cat Scratching Posts',
    description:
      'Scratching posts and boards that redirect claws away from sofas and carpets.',
    icon: Cat,
  },
  {
    id: 'pet-toys',
    label: 'Pet Toys',
    title: 'Pet Toys',
    description:
      'Toys for playtime, enrichment and keeping indoor pets active.',
    // White-background product shot, framed like the other photo tiles.
    image: '/images/products/cat-toy/white-tile.webp',
    icon: Bone,
  },
];

/**
 * Business ranges (the `/business` page product list and the Business mega menu).
 * `placeholders` are announced-but-not-listed products: they render as a
 * non-clickable card with a "Coming soon" badge and never get a route.
 */
export const businessGroups = [
  {
    id: 'air-purifiers',
    label: 'Air Purifiers',
    title: 'Air Purifiers',
    description:
      'Residential and commercial HEPA H13 air purification for pet-friendly homes and businesses.',
    placeholders: [],
  },
  {
    id: 'dehumidifiers',
    label: 'Dehumidifiers',
    title: 'Dehumidifiers',
    description:
      'Home, commercial and ceiling-mounted dehumidifiers for humidity control at any scale.',
    placeholders: [],
  },
];

export function getShopCategory(id) {
  return shopCategories.find((category) => category.id === id) ?? null;
}

export function getBusinessGroup(id) {
  return businessGroups.find((group) => group.id === id) ?? null;
}

/** Every product in display order (hidden products already excluded). */
function orderedProducts() {
  return productOrder.map((id) => products[id]).filter(Boolean);
}

/** Products that belong to a Shop category, in display order. */
export function getShopProducts(categoryId) {
  return orderedProducts().filter((product) => product.shopCategoryId === categoryId);
}

/** Products that belong to a Business range, in display order. */
export function getBusinessProducts(groupId) {
  return orderedProducts().filter((product) => product.businessGroup === groupId);
}

/** A Shop category plus the products it currently holds. */
export function shopCategoryWithProducts(categoryId) {
  const category = getShopCategory(categoryId);
  return category ? { ...category, products: getShopProducts(categoryId) } : null;
}

/** A Business range plus its listed products and placeholder cards. */
export function businessGroupWithProducts(groupId) {
  const group = getBusinessGroup(groupId);
  return group ? { ...group, products: getBusinessProducts(groupId) } : null;
}
