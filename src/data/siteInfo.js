/**
 * Shared contact details.
 *
 * Previously the email / phone / WhatsApp / address block was copy-pasted into
 * the homepage and the About page. Business and Support now reuse this file so
 * there is a single place to update a phone number.
 */
import { House, Mail, MessageCircle, PhoneCall } from 'lucide-vue-next';

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

export const contacts = [
  { label: 'Email', value: CONTACT_EMAIL, icon: Mail },
  { label: 'Mobile', value: '+86 1337 049 7731', icon: PhoneCall },
  { label: 'Whatsapp', value: '18902169202', icon: MessageCircle },
  { label: 'Address', value: 'Beijing, China', icon: House },
];

/**
 * Payment marks shown in the footer.
 *
 * Only PayPal is switched on in the Shopify store, so it is the only mark we
 * publish — add a line here when another method is enabled in Shopify.
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
    href: 'https://vt.tiktok.com/ZSp6wbb8M/',
  },
];

/** `mailto:` link for a quote request about a specific product (or the range in general). */
export function quoteHref(label, prefix = 'Quote request') {
  const subject = label ? `${prefix}: ${label}` : prefix;
  return `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
