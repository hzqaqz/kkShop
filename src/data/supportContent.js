/**
 * Support page copy.
 *
 * The FAQ leads with consumer questions about using an air purifier (why, when,
 * how often to replace the filter), then covers buying, care and after-sales.
 * Wholesale / OEM / project questions live on the Business page instead.
 *
 * Answers only restate facts already published on the site (contact details,
 * room sizes and filter care from the product pages and blog). Anything that
 * would commit the business to a shipping window, returns policy or warranty
 * period is deliberately left as "contact us" until those terms are confirmed.
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
    answer: `We ship worldwide. Send us the destination country together with the product you are interested in and we will confirm the shipping options and cost for your order before you commit. Email ${CONTACT_EMAIL}.`,
  },
  {
    question: 'What about returns, warranty and spare parts?',
    answer: `Returns, warranty claims and spare-part requests are handled case by case. Email ${CONTACT_EMAIL} with your order details and a short description of the issue and we will take it from there.`,
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
