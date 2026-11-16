/**
 * Shopify 后台政策（Settings → Policies）的只读视图。
 *
 * 数据由 `npm run sync:policies` 生成到 `policies.generated.json`，
 * 这里只负责取用。后台还没填的政策返回 `null`，页面会退回
 * `legalContent.js` 里的手写版本。
 */
import generated from './policies.generated.json';

/** 生成时间与店铺域名，方便在页面/日志里说明「这份条款来自哪里」。 */
export const policiesMeta = {
  generatedAt: generated.generatedAt || '',
  shopDomain: generated.shopDomain || '',
};

/**
 * @param {'privacy'|'refunds'|'terms'|'shipping'} slug
 * @returns {{ title: string, lastUpdated: string, sourceUrl: string, bodyHtml: string } | null}
 */
export function getShopifyPolicy(slug) {
  const policy = generated.policies?.[slug];
  return policy?.bodyHtml ? policy : null;
}

export function hasShopifyPolicy(slug) {
  return Boolean(getShopifyPolicy(slug));
}
