/**
 * Minimal Shopify Storefront API client for headless commerce.
 *
 * The Storefront access token is public by design: it can read products and
 * create / update carts, but cannot touch the admin. We call it straight from
 * the browser, so this SSG site needs no backend.
 */

const STORE_DOMAIN = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim();
const STOREFRONT_TOKEN = (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim();

const API_VERSION = '2026-10';

/**
 * Storefront market context (`@inContext`). Product availability and cart
 * prices are resolved per market, so without a context Shopify falls back to
 * the shop's default market — where a variant can read as in stock but be
 * refused at add-to-cart time. Override with VITE_SHOPIFY_COUNTRY.
 */
const SHOPIFY_COUNTRY = (import.meta.env.VITE_SHOPIFY_COUNTRY || 'NZ').trim().toUpperCase();

const ENDPOINT = STORE_DOMAIN
  ? `https://${STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/${API_VERSION}/graphql.json`
  : null;

/** True once a store domain + storefront token are configured. */
export function isShopifyConfigured() {
  return Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);
}

async function storefrontFetch(query, variables = {}) {
  if (!isShopifyConfigured()) {
    throw new Error(
      'Shopify is not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in .env.',
    );
  }

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables: withCountry(variables) }),
    });
  } catch (err) {
    throw new Error('Could not reach Shopify. Check your store domain and network.');
  }

  if (!response.ok) {
    throw new Error(`Shopify request failed (${response.status} ${response.statusText}).`);
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((err) => err.message).join('; '));
  }

  return json.data;
}

/** `@inContext` needs the country passed as a variable on every operation. */
function withCountry(variables) {
  return { country: SHOPIFY_COUNTRY, ...variables };
}

/** Format a price amount + ISO currency code, e.g. 129.5 + "NZD" → "NZ$129.50". */
export function formatMoney(amount, currencyCode) {
  if (amount == null || amount === '') {
    return '';
  }
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) {
    return `${currencyCode || ''} ${amount}`.trim();
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(numeric);
  } catch {
    return `${currencyCode || ''} ${numeric}`.trim();
  }
}

// ─────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!, $country: CountryCode) @inContext(country: $country) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage { url altText }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText }
        }
      }
    }
  }
`;

/** Fetch a product (and its variants) by Shopify handle. Returns null if absent. */
export async function fetchProductByHandle(handle) {
  const data = await storefrontFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.product ?? null;
}

// ─────────────────────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { title handle }
          }
        }
      }
    }
  }
`;

const CART_CREATE_QUERY = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!], $country: CountryCode) @inContext(country: $country) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFragment }
    }
  }
`;

const CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!, $country: CountryCode) @inContext(country: $country) {
    cart(id: $cartId) { ...CartFragment }
  }
`;

const CART_LINES_ADD_QUERY = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode) @inContext(country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
    }
  }
`;

const CART_LINES_UPDATE_QUERY = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode) @inContext(country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
    }
  }
`;

const CART_LINES_REMOVE_QUERY = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode) @inContext(country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
    }
  }
`;

function toLineInputs(lines) {
  return lines.map((line) => ({ merchandiseId: line.merchandiseId, quantity: line.quantity }));
}

export async function createCart(lines = []) {
  const data = await storefrontFetch(CART_CREATE_QUERY, {
    lines: toLineInputs(lines),
  });
  return data.cartCreate.cart;
}

export async function getCart(cartId) {
  const data = await storefrontFetch(CART_QUERY, { cartId });
  return data.cart;
}

export async function addCartLines(cartId, lines) {
  const data = await storefrontFetch(CART_LINES_ADD_QUERY, {
    cartId,
    lines: toLineInputs(lines),
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId, lines) {
  const data = await storefrontFetch(CART_LINES_UPDATE_QUERY, {
    cartId,
    lines: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
  });
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId, lineIds) {
  const data = await storefrontFetch(CART_LINES_REMOVE_QUERY, { cartId, lineIds });
  return data.cartLinesRemove.cart;
}
