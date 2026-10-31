/**
 * Shared contact details.
 *
 * Previously the email / phone / WhatsApp / address block was copy-pasted into
 * the homepage and the About page. Business and Support now reuse this file so
 * there is a single place to update a phone number.
 */
import { Facebook, House, Instagram, Mail, MessageCircle, PhoneCall, Twitter } from 'lucide-vue-next';

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
 * Official profiles, shown in the footer.
 *
 * `href` is intentionally empty until an account exists: the footer renders only
 * the entries that have a URL, so we never publish an icon that goes nowhere.
 * Fill in the three strings below and the "Follow us" column appears.
 */
export const socialLinks = [
  { id: 'x', label: 'X (Twitter)', icon: Twitter, href: '' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, href: '' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, href: '' },
];

/** `mailto:` link for a quote request about a specific product (or the range in general). */
export function quoteHref(label, prefix = 'Quote request') {
  const subject = label ? `${prefix}: ${label}` : prefix;
  return `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
