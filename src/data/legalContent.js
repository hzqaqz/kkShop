/**
 * Legal pages: privacy, refunds and terms.
 *
 * These are deliberately conservative summaries — they describe only what the
 * site and its Shopify checkout actually do (contact emails, cart in
 * localStorage, Shopify-hosted payment) and avoid promises about retention
 * periods, refund windows or governing law that have not been agreed.
 *
 * REVIEW BEFORE RELYING ON THEM: the refund window, warranty period and
 * governing-law jurisdiction are placeholders that need a human decision.
 */
const LAST_UPDATED = '28 October 2026';

export const legalDocuments = {
  privacy: {
    slug: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'What Meower collects when you browse this site, place an order or email us, how it is used, and how to ask us to delete it.',
    lastUpdated: LAST_UPDATED,
    intro:
      'This policy explains what information Meower collects when you use this website, why we collect it, and what you can ask us to do with it.',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'Browsing this site does not require an account. We do not ask for your name, address or payment details to read product pages or the blog.',
          'If you email us or use a quote link, we receive whatever you include in that message — typically your name, email address, company, country and the products you are interested in.',
        ],
        bullets: [
          'Cart contents are stored in your own browser (localStorage) so the cart survives a page refresh. They are not sent to us until you check out.',
          'Orders and payments are handled by Shopify on its own checkout domain; Meower does not see or store your card details.',
          'Our hosting provider records standard server logs (IP address, user agent, requested URL) for security and abuse prevention.',
        ],
      },
      {
        heading: 'How we use it',
        bullets: [
          'To answer enquiries, prepare quotations and fulfil orders.',
          'To provide warranty and after-sales support for products you have bought.',
          'To keep the site secure and to understand which pages are used, in aggregate.',
        ],
        paragraphs: [
          'We do not sell your personal information, and we do not send marketing email to people who have not asked for it.',
        ],
      },
      {
        heading: 'Who we share it with',
        paragraphs: [
          'We share information only with the services needed to run the shop: Shopify (checkout, payment and order management) and our hosting and email providers. Those providers process the data on our behalf.',
          'We may also disclose information where we are legally required to do so.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'Enquiry emails are kept for as long as needed to answer them and to support any resulting order or warranty claim. Order records are kept by Shopify for the period required by tax and accounting rules.',
        ],
      },
      {
        heading: 'Your choices',
        bullets: [
          'Ask us for a copy of the personal information we hold about you.',
          'Ask us to correct or delete it, where we are not required to keep it.',
          'Withdraw consent to being contacted at any time.',
        ],
        paragraphs: [
          'To do any of these, email info@meowerair.com. You can also clear the cart stored by this site at any time by emptying your browser storage.',
        ],
      },
      {
        heading: 'Cookies and local storage',
        paragraphs: [
          'This site does not use advertising cookies. It uses browser storage for the shopping cart and to remember that a promotional panel has already been shown in the current session.',
        ],
      },
      {
        heading: 'Changes and contact',
        paragraphs: [
          'If this policy changes, the updated date at the top of this page changes with it. Questions about privacy can go to info@meowerair.com.',
        ],
      },
    ],
  },
  refunds: {
    slug: 'refunds',
    path: '/refunds',
    title: 'Refund & Exchanges',
    description:
      'How to raise a return, exchange or warranty claim with Meower, what we need from you, and how refunds are paid.',
    lastUpdated: LAST_UPDATED,
    intro:
      'If something is wrong with an order, contact us before sending anything back — we will confirm what is possible for your case and, where a return is agreed, give you the return address.',
    sections: [
      {
        heading: 'Before you return anything',
        paragraphs: [
          'Email info@meowerair.com with your order number, the product and a short description (photos help). We will reply with the options for your order.',
          'Please do not ship a product back without that confirmation: unauthorised returns can be refused at the door, and we cannot refund shipping we did not agree to.',
        ],
      },
      {
        heading: 'Damaged or faulty on arrival',
        paragraphs: [
          'Report transit damage or a fault as soon as you can after delivery, and keep the packaging until the case is closed. Once we have confirmed the problem we will arrange a replacement, a repair or a refund.',
        ],
      },
      {
        heading: 'Warranty claims',
        paragraphs: [
          'Products carry a manufacturer warranty against defects in materials and workmanship. Warranty cover does not include normal wear, consumable filters, or damage from misuse, unauthorised repair or incorrect voltage.',
          'Warranty length differs between products — the period that applies to your order is confirmed on your quotation or invoice.',
        ],
      },
      {
        heading: 'Change of mind',
        paragraphs: [
          'Change-of-mind returns are handled case by case, and only for unused products in their original packaging. Return shipping for change of mind is the buyer’s responsibility.',
        ],
      },
      {
        heading: 'How refunds are paid',
        paragraphs: [
          'Approved refunds go back to the original payment method through Shopify. Bank and card processing times are outside our control, so the credit may take a few business days to appear.',
        ],
      },
      {
        heading: 'Wholesale and project orders',
        paragraphs: [
          'Bulk, OEM/ODM and project orders are covered by the terms agreed in the quotation or contract for that order, which take precedence over this page.',
        ],
      },
    ],
  },
  terms: {
    slug: 'terms',
    path: '/terms',
    title: 'Terms of Service',
    description:
      'The terms that apply when you browse the Meower website, place an order or request a quotation.',
    lastUpdated: LAST_UPDATED,
    intro:
      'These terms apply to this website and to orders placed through it. By using the site you accept them.',
    sections: [
      {
        heading: 'Using this site',
        paragraphs: [
          'You may browse, print and share pages for your own reference. You may not copy the site’s content for commercial use, attempt to disrupt the site, or use it in a way that breaks applicable law.',
        ],
      },
      {
        heading: 'Product information',
        paragraphs: [
          'We describe our products as accurately as we can, including specifications such as CADR, tank capacity, power draw and noise level. Images are illustrative: finishes, packaging and accessories can change without notice.',
          'Where a specification matters to your project, confirm it with us in writing before ordering.',
        ],
      },
      {
        heading: 'Prices, orders and payment',
        bullets: [
          'Prices shown at checkout are in the currency displayed there and exclude duties or import taxes unless stated otherwise.',
          'Payment is taken through Shopify’s checkout. An order is accepted when payment is confirmed and we send an order confirmation.',
          'We may decline or cancel an order where a product is unavailable, a listing contained a clear error, or we suspect fraud.',
        ],
      },
      {
        heading: 'Quotations and wholesale terms',
        paragraphs: [
          'Quotations are valid for the period stated on them. Bulk, OEM/ODM and project orders are governed by the quotation or contract for that order, including lead times, Incoterms and payment schedule.',
        ],
      },
      {
        heading: 'Intellectual property',
        paragraphs: [
          'The Meower name, logo, product photography and site copy belong to us or our licensors. Nothing on this site grants you a licence to use them without written permission.',
        ],
      },
      {
        heading: 'Liability',
        paragraphs: [
          'We do not exclude liability that cannot lawfully be excluded. Beyond that, our liability for any order is limited to the amount you paid for that order, and we are not liable for indirect or consequential loss.',
          'Nothing on this site is medical advice. Air purifiers and dehumidifiers improve indoor conditions; they do not treat or prevent illness.',
        ],
      },
      {
        heading: 'Governing law and contact',
        paragraphs: [
          'These terms are governed by the laws that apply at our place of business, and disputes are subject to the courts there. Questions about these terms: info@meowerair.com.',
        ],
      },
    ],
  },
};

export function getLegalDocument(slug) {
  return legalDocuments[slug] ?? null;
}
