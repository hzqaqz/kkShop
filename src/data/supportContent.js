/**
 * Support page copy.
 *
 * The FAQ leads with consumer questions about using an air purifier (why, when,
 * how often to replace the filter), then covers buying, care and after-sales.
 * Wholesale / OEM / project questions live on the Business page instead.
 *
 * Answers only restate facts already published on the site (contact details,
 * room sizes and filter care from the product pages and blog), plus the
 * fulfilment facts that now live in `siteInfo.js`: ships from Beijing, 9–16 days
 * to the United States, 30-day returns with the return-shipping split spelled
 * out. Those three are the answers Google Merchant Center reads for shipping
 * and returns, so they must stay identical to `src/data/siteInfo.js` and to the
 * Shopify policy pages.
 */
import { CONTACT_EMAIL } from './siteInfo';

export const supportFaqs = [
  {
    question: 'Why do I need an air purifier?',
    answer:
      'Air that looks clean still carries particles too small to see — dust mite debris, mould spores, pollen, smoke and traffic pollution, and in a pet home, dander and fine fur. A purifier draws that air through a filter and captures those particles instead of leaving them to settle on floors, bedding and soft furniture, where they get lifted back up again every time somebody moves. Long-term exposure to polluted air has also been linked to cardiovascular and respiratory problems, which is why indoor air is worth managing rather than assumed.',
  },
  {
    question: 'When should I use an air purifier?',
    answer:
      'Run it whenever people or pets are in the room — that is when the air is being used and particles are being stirred up. Keep doors and windows closed while it runs: a purifier cleans the air in the room it stands in, and an open window simply lets unfiltered air back in. Many households leave it on a low speed overnight in the bedroom and on a higher speed while everyone is out for the day.',
  },
  {
    question: 'How often do I need to replace the filter?',
    answer:
      'It depends on how you use the purifier and what the air around it is like. In a polluted or very dusty environment the filter traps more, so it reaches the end of its life sooner. The simplest check is the filter itself: once it has turned from white to grey — and especially if it looks black — replace it straight away so the purifier keeps working at full efficiency.',
  },
  {
    question: 'How should I look after the filter?',
    answer:
      'Filter life depends on how often the unit runs and how much dust and pet hair is in the air. Our filter care guide covers the checks worth doing week to week and the signs that the filter needs replacing.',
    // Rendered as a "Read the guide" link under the answer.
    blogSlug: 'filter-care-everyday-performance',
  },
  {
    question: 'Which air purifier suits my room size?',
    answer:
      'The MW200 uses 360° air intake and three-stage composite filtration with H13 HEPA media, with a 400 m³/h CADR that suits rooms of roughly 20–40 m². For larger rooms or multiple rooms, contact us and we will recommend a configuration.',
  },
  {
    question: 'Where can I buy Meower products?',
    answer: `The MW200 air purifier can be ordered directly on this site and checked out in our store. Dehumidifiers and larger project orders are quoted individually — email ${CONTACT_EMAIL} and we will confirm pricing, configuration and lead time.`,
  },
  {
    question: 'Do you ship to my country?',
    answer: `We ship from our own warehouse in Beijing, China to roughly 50 destinations — the United States, Canada, the United Kingdom, the EU and other European countries, Australia, New Zealand, the Middle East and parts of Asia. The exact country list is in our Shipping Policy. Every consumer order is dispatched within 1 business day, and typical delivery from dispatch is 9–16 days to the United States, 11–20 days to Europe and Canada, 10–15 days to Asia, and 11–15 days to New Zealand and Australia. If your country is not on the list, email ${CONTACT_EMAIL} and we will confirm whether we can ship there.`,
  },
  {
    question: 'What about returns, warranty and spare parts?',
    answer: `Unused items in their original packaging can be returned within 30 days of delivery. You pay return shipping if you changed your mind; we pay it if the item arrived faulty, damaged or wrong. Start by emailing ${CONTACT_EMAIL} with your order number and a short description of the issue — returns, warranty claims and spare-part requests are all handled from that one address.`,
  },
];

export const supportTopics = [
  {
    title: 'Product support',
    text: 'Specifications, manuals, filter care and anything else about a unit you already own.',
    to: { name: 'products' },
    linkLabel: 'Browse products',
  },
  {
    title: 'Wholesale and projects',
    text: 'Distributor pricing, OEM and ODM projects, certification and packaging requirements.',
    to: { name: 'business' },
    linkLabel: 'Go to Business',
  },
];
