/**
 * Shared contact details, company identity and fulfilment facts.
 *
 * 为什么这些值集中在一个文件里：Google Merchant Center 的
 * "Misrepresentation"（误导性陈述）审核，查的就是下面这几件事能不能在站上
 * 一眼找到 —— 法人实体、真实地址、发货地、送达时效、退货规则、支付方式。
 * 它还会把这些信息跟商品 feed、跟 GMC 后台 "Business information" 交叉比对，
 * **前后对不上是常见的被判原因**。所以页脚、Business(About) 页、Support 页、
 * 政策页、商品页全部从这里取值：改一处，全站一致。
 *
 * ⚠️ 改这里之前先确认三处一致：
 *    1. GMC 后台 → Business information（商家名称/地址/电话）
 *    2. 营业执照（公司名、注册地址）
 *    3. Shopify 后台 → Settings → Policies（退换货、配送条款）
 * 三者和本文件不一致，比信息缺失更容易被判 Misrepresentation。
 */
import { Mail, MessageCircle, PhoneCall } from 'lucide-vue-next';

export const CONTACT_EMAIL = 'info@meowerair.com';

/**
 * Address for quote / wholesale enquiries.
 *
 * There is no separate sales@ mailbox yet, so quote requests go to the main
 * inbox. Create the sales mailbox first, then point this single line at it.
 */
export const QUOTE_EMAIL = CONTACT_EMAIL;

export const contactEmailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Product enquiry from meowerair.com',
)}`;

/* -------------------------------------------------------------------------- */
/* Company identity                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The legal entity behind the Meower store.
 *
 * Publishing the registered company name next to the brand is one of the
 * cheapest trust signals there is: it tells a reviewer (and a customer) that
 * "Meower" is a real company rather than a storefront with no owner.
 *
 * `legalName` is the English transliteration of the Chinese name on the
 * business licence — keep the two in the same order as the licence, because
 * Google matches them during business identity verification.
 */
export const company = {
  brand: 'Meower',
  legalName: 'Beijing Zhuoyue Youshi Technology Co., Ltd.',
  legalNameZh: '北京卓越优识科技有限公司',
  /**
   * 统一社会信用代码（18 位）。这是对外公示的公司注册号，也是 GMC 身份验证
   * 时可以核对的一项；填了就会渲染在 Company details 卡片里。
   */
  registrationNumber: '91110119MAKB3X4U0M',
  email: CONTACT_EMAIL,
  phone: '+86 1337 049 7731',
  whatsapp: '18902169202',
  /**
   * Published service promise. Deliberately soft ("within one business day")
   * so it stays true on public holidays and does not read as a contractual
   * delivery guarantee.
   */
  responseTime: 'We answer email within one business day, Monday to Friday.',
  /**
   * One-line company description. Mirrors the `description` in the Organization
   * structured data in `index.html` — keep the two in step.
   *
   * Note it does not claim "worldwide": the Shopify shipping policy lists ~50
   * destinations, so a worldwide claim on the site contradicts it.
   */
  description:
    'Meower is the pet air-care brand of Beijing Zhuoyue Youshi Technology Co., Ltd. We design pet-friendly HEPA air purifiers, dehumidifiers and pet supplies, and ship orders from our own warehouse in Beijing, China.',
};

/**
 * The company's registered address, which is also the warehouse and the place
 * every order ships from.
 *
 * One address for all three roles is deliberate: Google matches the address on
 * the site against the business licence and against the GMC "Business
 * information" setting, so showing a warehouse that differs from the registered
 * office is a mismatch waiting to be flagged. If the company ever moves the
 * stock to a second site, add it as `fulfilmentLines` and label the two roles
 * separately — do not silently overwrite this one.
 */
export const address = {
  /** 注册地址 = 仓库 = 发货地，按行渲染。 */
  lines: [
    'Room 1369, Block D, Building 3, Yard 8, Fenggu 4th Road',
    'Zhongguancun Yanqing Park, Yanqing District',
    'Beijing, China',
  ],
  /** Same address on one line, for structured data and mailto footers. */
  singleLine:
    'Room 1369, Block D, Building 3, Yard 8, Fenggu 4th Road, Zhongguancun Yanqing Park, Yanqing District, Beijing, China',
  /** 中文原文，方便同事核对，也在中文语境里显示。 */
  zh: '北京市延庆区中关村延庆园风谷四路8号院3号楼D座1369室',
  /** Split fields for schema.org PostalAddress. */
  structured: {
    streetAddress:
      'Room 1369, Block D, Building 3, Yard 8, Fenggu 4th Road, Zhongguancun Yanqing Park',
    addressLocality: 'Beijing',
    addressRegion: 'Yanqing District',
    addressCountry: 'CN',
  },
  country: 'China',
  /** Which part of the address packages actually leave from. */
  shipsFrom: 'Beijing, China',
};

/* -------------------------------------------------------------------------- */
/* Fulfilment facts                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Delivery windows by destination, counted from dispatch.
 *
 * These are the numbers Google compares against the shipping policy and against
 * the delivery time it derives from the feed, so they have to match the site,
 * the Shopify shipping policy and the GMC "Shipping and returns" settings.
 * Add a zone here and every surface that lists delivery times picks it up.
 */
const deliveryZones = [
  { id: 'us', label: 'United States', window: '9–16 days' },
  { id: 'eu', label: 'Europe', window: '11–20 days' },
  { id: 'ca', label: 'Canada', window: '11–20 days' },
  { id: 'asia', label: 'Asia', window: '10–15 days' },
  { id: 'nz', label: 'New Zealand', window: '11–15 days' },
  { id: 'au', label: 'Australia', window: '11–15 days' },
];

/**
 * Delivery windows, quoted the way the site states them.
 *
 * `usDelivery` is derived rather than repeated, so the footer, the product-page
 * strip and the zone table below can never disagree about the United States.
 *
 * The wording here is deliberately aligned with the Shopify shipping policy:
 * that policy lists the ~50 destinations we actually serve, so the site never
 * claims "worldwide", the region windows are scoped to that list, and the
 * tracking promise keeps Shopify's "where the carrier provides one" qualifier.
 */
export const fulfilment = {
  shipsFrom: address.shipsFrom,
  warehouseNote:
    'Our own warehouse in Beijing — there is no third-party seller or marketplace between you and us.',
  /**
   * Handling time. Shopify's policy says orders are processed "as soon as
   * possible" *except as otherwise stated on our website* — so stating it here
   * is what makes it binding, and it is the handling half of the delivery time
   * Google wants to see.
   */
  dispatchWindow: '1 business day',
  dispatchNote:
    'Every consumer order is packed and dispatched within 1 business day, Monday to Friday.',
  trackingNote:
    'A tracking number is emailed once the parcel is handed to the carrier, where the carrier provides one.',
  deliveryZones,
  /** Primary market (the storefront is US/USD), used by the footer and product pages. */
  usDelivery: deliveryZones.find((zone) => zone.id === 'us').window,
  deliveryNote:
    'Delivery times are counted from dispatch, not from the moment the order is placed, and they are estimates rather than guarantees: customs clearance, holidays and carrier backlogs can add days. Region windows apply to the destinations listed in our Shipping Policy.',
  /** Destinations that are not in the Shopify shipping policy's country list. */
  otherDestinationsNote:
    'Countries that are not on that list: ask us before ordering and we will confirm whether we can ship there.',
  /** Matches the 30-day window in the Shopify refund policy. */
  returnWindow: '30 days',
  /** Compact form for the footer and the product-page strip. */
  returnsShortLabel: '30-day returns',
  returnWindowNote:
    'Unused items in their original packaging can be returned within 30 days of delivery, for the destinations listed in our Refund Policy.',
  returnShippingNote:
    'For change-of-mind returns the customer pays return shipping. For faulty, damaged or wrongly supplied items we pay it.',
  /**
   * Only PayPal is enabled in the Shopify store right now, so this says PayPal
   * and nothing else — publishing a payment method the checkout cannot actually
   * take is itself a misrepresentation claim.
   */
  paymentNote:
    'Payments are processed by Shopify Checkout. Prices are charged in the currency shown at checkout.',
};

/**
 * The contact list rendered on the Business and Support pages.
 *
 * The postal address is deliberately **not** in this list: it is long, it wraps
 * badly inside the contact rows, and it is rendered properly by
 * `CompanyDetails.vue` a few lines further down. One address, one place.
 */
export const contacts = [
  { label: 'Email', value: CONTACT_EMAIL, icon: Mail },
  { label: 'Mobile', value: company.phone, icon: PhoneCall },
  { label: 'Whatsapp', value: company.whatsapp, icon: MessageCircle },
];

/**
 * Payment marks shown in the footer.
 *
 * Only PayPal is switched on in the Shopify store, so it is the only mark we
 * publish — add a line here when another method is enabled in Shopify.
 * Publishing a card brand the checkout does not actually accept is a
 * misrepresentation issue in itself.
 */
export const paymentMethods = [
  { id: 'paypal', label: 'PayPal', image: '/images/payments/paypal.svg' },
];

/**
 * Official profiles, shown in the footer.
 *
 * `href` is intentionally empty until an account exists: the footer renders only
 * the entries that have a URL, so we never publish an icon that goes nowhere.
 * Instagram, LinkedIn and TikTok are all live.
 */
export const socialLinks = [
  {
    id: 'instagram',
    label: 'Instagram',
    image: '/images/social/instagram.svg',
    href: 'https://www.instagram.com/meowerpet/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    image: '/images/social/linkedin.svg',
    href: 'https://www.linkedin.com/company/meower-air',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    image: '/images/social/tiktok.svg',
    href: 'https://www.tiktok.com/@meowerair',
  },
];

/** `mailto:` link for a quote request about a specific product (or the range in general). */
export function quoteHref(label, prefix = 'Quote request') {
  const subject = label ? `${prefix}: ${label}` : prefix;
  return `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
