/**
 * Support page copy.
 *
 * Answers only restate facts already published on the site (contact details,
 * room sizes and filter care from the product pages and blog). Anything that
 * would commit the business to a shipping window, returns policy or warranty
 * period is deliberately left as "contact us" until those terms are confirmed.
 */
import { CONTACT_EMAIL } from './siteInfo';

export const supportFaqs = [
  {
    question: 'Where can I buy Meower products?',
    answer: `The MW200 air purifier can be ordered directly on this site and checked out in our store. Dehumidifiers and larger project orders are quoted individually — email ${CONTACT_EMAIL} and we will confirm pricing, configuration and lead time.`,
  },
  {
    question: 'Do you ship internationally?',
    answer: `We supply distributors, retailers, contractors and project buyers worldwide. Send us your destination country together with the products and quantities you are interested in, and we will confirm the shipping options available for that order.`,
  },
  {
    question: 'How do I request a quote or wholesale pricing?',
    answer: `Email ${CONTACT_EMAIL} with the product you need, the quantity, your destination and any certification or packaging requirements. Wholesale and bulk orders, sample requests and project pricing are all handled through the same inbox.`,
  },
  {
    question: 'Do you offer OEM and ODM services?',
    answer:
      'Yes. Alongside our standard range we support OEM and ODM projects — custom specification, branding and packaging — as well as residential and commercial product solutions, long-term distribution partnerships and project-based product support.',
  },
  {
    question: 'Which air purifier suits my room size?',
    answer:
      'The MW200 uses 360° air intake and three-stage composite filtration with H13 HEPA media, with a 400 m³/h CADR that suits rooms of roughly 20–40 m². For larger rooms or multiple rooms, contact us and we will recommend a configuration.',
  },
  {
    question: 'How should I look after the filter?',
    answer:
      'Filter life depends on how often the unit runs and how much dust and pet hair is in the air. Our filter care guide covers the checks worth doing week to week and the signs that the filter needs replacing.',
    // Rendered as a "Read the guide" link under the answer.
    blogSlug: 'filter-care-everyday-performance',
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
