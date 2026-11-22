<script setup>
import { computed } from 'vue';
import { Cookie, Croissant, Donut, Droplets, PawPrint, Ruler, ShieldCheck, Sparkles } from 'lucide-vue-next';
import ProductPriceTag from './ProductPriceTag.vue';
import { contactEmailHref } from '../data/siteInfo';
import { getProduct } from '../data/products';

/**
 * Loofah + silvervine "bakery" cat toy set.
 *
 * Facts come from the seller: three pieces (bread loaf, donut, star cookie)
 * made from loofah sponge with silvervine, packed in a printed bakery bag;
 * washable, thickened for chewing, 210 g and US$25 a set. Sizes are the ones
 * printed on the supplied measurement artwork.
 *
 * The set is on Shopify, so the price is read live from the Storefront API the
 * way the other pet pages do it; checkout lives in the buy bar under the page.
 */
const product = getProduct('loofah-cat-toy');
const shopifyHandle = product?.shopifyHandle ?? '';

const pieces = [
  {
    name: 'Bread loaf',
    size: '11.5 × 5.5 cm',
    text: 'The biggest piece: a crusted loaf with three ridged silvervine pads set into the top, cut wide enough for a cat to hold between its front paws and chew.',
    icon: Croissant,
  },
  {
    name: 'Donut',
    size: '7.5 × 7.5 cm',
    text: 'A flower-shaped ring with a hole in the middle — the shape cats bat along the floor and hook a claw into, and the easiest one to carry around the house.',
    icon: Donut,
  },
  {
    name: 'Star cookie',
    size: '10.5 × 9 cm',
    text: 'A five-point cookie with three vent holes, so it grips a kitten’s teeth at any angle and stays light enough to toss and chase.',
    icon: Cookie,
  },
];

const features = [
  {
    title: 'Loofah, not foam',
    text: 'The body is compressed loofah sponge. Its ridged, slightly scrubby surface is what a cat chews and rubs against — soft enough for gums, textured enough to be worth chewing.',
    icon: Sparkles,
  },
  {
    title: 'Silvervine inside and on top',
    text: 'Silvervine (matatabi) is the cat attractant many cats respond to more strongly than catnip. It sits in the ridges and the stuffing, which is why the pieces get rolled on before they get chewed.',
    icon: PawPrint,
  },
  {
    title: 'Thickened for chewers',
    text: 'The loofah is layered and stitched rather than glued, with no plastic squeaker to dig out. Built for kitten teeth, adult molars, bunny kicks and daily play.',
    icon: ShieldCheck,
  },
  {
    title: 'Washable',
    text: 'Rinse or hand-wash in warm water, squeeze it out and let it air-dry. Washing rinses away some of the silvervine scent, so rub a pinch back into the ridges to bring it up again.',
    icon: Droplets,
  },
];

const care = [
  'Rinse or hand-wash in warm water, then air-dry',
  'Do not tumble dry or leave it in direct sun',
  'Replace a piece once it is chewed through',
  'Play and chewing are best supervised, especially with kittens',
];
</script>

<template>
  <div class="loofah-page">
    <section class="loofah-hero" aria-labelledby="loofah-title">
      <div class="loofah-hero-copy">
        <p class="loofah-eyebrow">New · Playtime and teeth</p>
        <h1 id="loofah-title">{{ product?.title ?? 'Loofah & Silvervine Cat Chew Toy Set' }}</h1>
        <p class="loofah-lead">
          Three chew toys shaped like breakfast — a bread loaf, a donut and a star cookie — made from
          loofah sponge and silvervine, and packed in a printed bakery bag. Cats roll on them, carry
          them around and chew the ridged surface, which is what gives a kitten's teeth something to
          work against between meals.
        </p>

        <ul class="loofah-highlights">
          <li>Bread, donut and star cookie</li>
          <li>Loofah sponge + silvervine</li>
          <li>210 g for the set</li>
          <li>Washable and air-dryable</li>
          <li>Bakery-style gift bag</li>
        </ul>

        <ProductPriceTag
          :handle="shopifyHandle"
          note="per set of three, 210 g, bag included"
        />

        <div class="loofah-hero-actions">
          <a class="loofah-cta loofah-cta--primary" href="#loofah-bag">See what is in the bag</a>
          <a class="loofah-cta loofah-cta--ghost" :href="contactEmailHref">Ask about this toy</a>
        </div>
      </div>

      <img
        class="loofah-hero-media"
        src="/images/products/loofah-cat-toy/hero.webp"
        width="948"
        height="950"
        alt="The loofah cat toy set: a printed Daily fresh Baking bag with a bread loaf, donut and star cookie chew toy in front of it"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="loofah-bag" class="loofah-section" aria-labelledby="loofah-bag-title">
      <div class="loofah-heading">
        <p class="loofah-eyebrow">In the bag</p>
        <h2 id="loofah-bag-title">One bag, three pieces</h2>
        <p>
          The set arrives looking like an order from a bakery: a printed paper bag with a clear
          window, and the three pieces inside. Same idea as a catnip toy, different texture — loofah
          is springy and ridged, so it holds up to chewing far longer than fabric or foam.
        </p>
      </div>

      <div class="loofah-piece-grid">
        <article v-for="piece in pieces" :key="piece.name" class="loofah-piece-card">
          <span class="loofah-piece-icon" aria-hidden="true">
            <component :is="piece.icon" :size="22" />
          </span>
          <h3>{{ piece.name }}</h3>
          <p class="loofah-piece-size">
            <Ruler aria-hidden="true" :size="13" />
            {{ piece.size }}
          </p>
          <p class="loofah-piece-text">{{ piece.text }}</p>
        </article>
      </div>
    </section>

    <section class="loofah-section" aria-labelledby="loofah-features-title">
      <div class="loofah-heading">
        <p class="loofah-eyebrow">Why it works</p>
        <h2 id="loofah-features-title">Loofah, silvervine and a little patience</h2>
      </div>

      <div class="loofah-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="loofah-feature-card">
          <span class="loofah-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="loofah-section loofah-two-col" aria-labelledby="loofah-chew-title">
      <div class="loofah-two-col-copy">
        <p class="loofah-eyebrow">Chewing and wearing out</p>
        <h2 id="loofah-chew-title">Something to chew that is not the sofa</h2>
        <p>
          Kittens chew while they teeth, and adult cats keep chewing — on cables, cardboard and the
          corner of the sofa. A textured toy gives that urge somewhere to go: the ridged loofah
          surface works against the teeth while the cat chews, and the silvervine keeps bringing them
          back to it.
        </p>
        <p>
          The same three pieces double as an energy burner. Cats that live indoors do not get to
          hunt, so a light toy to bat across the floor, carry around and bunny-kick covers the chase,
          the catch and the kill in one short session — which is usually all it takes to leave a
          cat flat out on the rug afterwards.
        </p>
      </div>

      <div class="loofah-two-col-side">
        <h3 class="loofah-side-title">Care and safety</h3>
        <ul class="loofah-care-list">
          <li v-for="item in care" :key="item">{{ item }}</li>
        </ul>
        <p class="loofah-side-note">
          Natural loofah and silvervine, with no added perfume and no plastic parts. Like any chew
          toy, it is not indestructible: check the stitching now and then and swap a piece out once it
          starts to come apart.
        </p>
      </div>
    </section>

    <section class="loofah-section loofah-bag" aria-labelledby="loofah-gift-title">
      <div class="loofah-bag-copy">
        <p class="loofah-eyebrow">Gift ready</p>
        <h2 id="loofah-gift-title">It looks like you bought breakfast</h2>
        <p>
          The packaging is part of the joke: a bakery bag printed like a fresh-baking label, with the
          pieces arranged inside as if they came out of the oven that morning. That makes it a
          ready-to-give present for a new kitten or a friend's cat — and a bag worth keeping for the
          toys afterwards.
        </p>

        <ul class="loofah-bag-list">
          <li>1 bread loaf — 11.5 × 5.5 cm</li>
          <li>1 donut — 7.5 × 7.5 cm</li>
          <li>1 star cookie — 10.5 × 9 cm</li>
          <li>Loofah sponge with silvervine</li>
          <li>210 g for the set of three</li>
          <li>Printed bakery bag</li>
        </ul>
      </div>

      <figure class="loofah-bag-figure">
        <img
          src="/images/products/loofah-cat-toy/sizes.webp"
          width="1278"
          height="1082"
          alt="Measured loofah cat toys: the bread loaf is 11.5 by 5.5 centimetres, the donut 7.5 by 7.5 centimetres and the star cookie 10.5 by 9 centimetres"
          loading="lazy"
          decoding="async"
        />
        <figcaption>The three pieces, measured.</figcaption>
      </figure>
    </section>
  </div>
</template>

<style scoped>
/* Same four tokens as the other pet product pages (PetBedProductPage,
   TriangleCatBedPage, PetStrollerPage, SisalCatScratcherPage) — this page
   introduces no colours of its own. */
.loofah-page {
  --loofah-ink: #314e53;
  --loofah-accent: #75949a;
  --loofah-warm: #f7ece1;
  --loofah-red: #a33a33;
  /* Price lockup colours (see ProductPriceTag.vue). */
  --price-ink: var(--loofah-ink);
  --price-muted: #7a9499;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.loofah-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: center;
  padding: clamp(130px, 11vw, 176px) max(7vw, calc((100vw - 1180px) / 2)) clamp(48px, 6vw, 76px);
  background: linear-gradient(180deg, #fdf8f3, var(--loofah-warm));
}

.loofah-eyebrow {
  margin: 0 0 12px;
  color: var(--loofah-red);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.loofah-hero h1 {
  text-wrap: balance;
  margin: 0;
  color: var(--loofah-ink);
  font-size: clamp(26px, 4vw, 54px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.loofah-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.25vw, 19px);
  line-height: 1.6;
}

.loofah-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.loofah-highlights li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 600;
}

.loofah-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.loofah-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.loofah-cta--primary {
  background: var(--loofah-ink);
  color: #fef5ed;
}

.loofah-cta--primary:hover,
.loofah-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.loofah-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.3);
  color: var(--loofah-ink);
}

.loofah-cta--ghost:hover,
.loofah-cta--ghost:focus-visible {
  border-color: var(--loofah-ink);
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.loofah-hero-media {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.16);
}

/* ── Shared section shell ────────────────────────────────────────────────── */
.loofah-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(50px, 6vw, 82px) 0 0;
}

.loofah-heading {
  max-width: 720px;
}

.loofah-heading h2,
.loofah-two-col-copy h2,
.loofah-bag-copy h2 {
  margin: 0;
  color: var(--loofah-ink);
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.loofah-heading p:not(.loofah-eyebrow),
.loofah-two-col-copy p,
.loofah-bag-copy p:not(.loofah-eyebrow) {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── The three pieces ────────────────────────────────────────────────────── */
.loofah-piece-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}

.loofah-piece-card {
  padding: 22px 20px 24px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.loofah-piece-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--loofah-warm);
  color: var(--loofah-accent);
}

.loofah-piece-card h3 {
  margin: 12px 0 0;
  color: var(--loofah-ink);
  font-size: 18px;
  font-weight: 600;
}

.loofah-piece-size {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin: 6px 0 0;
  color: var(--loofah-accent);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.loofah-piece-text {
  margin: 10px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.58;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.loofah-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.loofah-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--loofah-warm);
}

.loofah-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--loofah-red);
}

.loofah-feature-card h3 {
  margin: 12px 0 0;
  color: var(--loofah-ink);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.loofah-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Chewing + care ──────────────────────────────────────────────────────── */
.loofah-two-col,
.loofah-bag {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: start;
}

.loofah-two-col-side {
  padding: 24px 22px 26px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 14px;
  background: var(--loofah-warm);
}

.loofah-side-title {
  margin: 0;
  color: var(--loofah-ink);
  font-size: 16px;
  font-weight: 600;
}

.loofah-care-list {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.loofah-care-list li {
  position: relative;
  padding-left: 20px;
  color: #4d666b;
  font-size: 14px;
  line-height: 1.5;
}

.loofah-care-list li::before {
  position: absolute;
  top: 7px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--loofah-accent);
  content: '';
}

.loofah-side-note {
  margin: 16px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.6;
}

/* ── Bakery bag ──────────────────────────────────────────────────────────── */
.loofah-bag-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 18px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.loofah-bag-list li {
  position: relative;
  padding-left: 20px;
  color: #3f5c62;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.loofah-bag-list li::before {
  position: absolute;
  top: 7px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--loofah-accent);
  content: '';
}

.loofah-bag-figure {
  margin: 0;
}

.loofah-bag-figure img {
  display: block;
  width: 100%;
  border-radius: 14px;
  background: var(--loofah-warm);
}

.loofah-bag-figure figcaption {
  margin-top: 10px;
  color: #5f7a80;
  font-size: 12.5px;
  text-align: center;
}

@media (max-width: 900px) {
  .loofah-hero,
  .loofah-two-col,
  .loofah-bag {
    grid-template-columns: minmax(0, 1fr);
  }

  .loofah-hero {
    padding-top: 152px;
  }

  .loofah-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .loofah-hero {
    padding: 148px 24px 44px;
  }

  .loofah-section {
    width: calc(100% - 32px);
  }

  .loofah-piece-grid,
  .loofah-feature-grid,
  .loofah-bag-list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
