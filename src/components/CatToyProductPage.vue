<script setup>
import { Bell, PawPrint, RefreshCcw, Sparkles } from 'lucide-vue-next';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Push-button pom-pom launcher for cats.
 *
 * Facts come from the seller: a button launches the pom-pom on a tether and
 * another press reels it back, so nobody has to bend down and pick it up; two
 * pom-poms are included and they are replaceable.
 */
const steps = [
  {
    step: '01',
    title: 'One button launches',
    text: 'Press the launch button and the pom-pom shoots out on its cord, across the floor or up into the air.',
    image: '/images/products/cat-toy/lifestyle-floor.webp',
    alt: 'A tabby kitten lunging at the pom-pom after it was launched across the floor',
  },
  {
    step: '02',
    title: 'The other retracts',
    text: 'Press the second button and the cord winds back into the handle — the ball returns to you instead of the other way round.',
    image: '/images/products/cat-toy/lifestyle-lying.webp',
    alt: 'A kitten on its back batting the pom-pom as the cord is reeled back in',
  },
  {
    step: '03',
    title: 'Swap the ball',
    text: 'Two pom-poms come with every toy. Clip a fresh one on and the game carries on.',
    image: '/images/products/cat-toy/closeup.webp',
    alt: 'Close-up of the handle, the cord and a pink pom-pom with a small bell',
  },
];

const features = [
  {
    title: 'Two buttons: launch and retract',
    text: 'One button fires the pom-pom out, the other winds the cord back in — so play does not end with you on your knees under the sofa.',
    icon: RefreshCcw,
  },
  {
    title: 'Two pom-poms included',
    text: 'A spare ball in every box, so a game can continue while one is being washed or has gone missing.',
    icon: Sparkles,
  },
  {
    title: 'Replaceable balls',
    text: 'The pom-pom clips on and off the cord, so the toy can be refreshed without replacing the whole handle.',
    icon: PawPrint,
  },
  {
    title: 'Bell on the ball',
    text: 'A small bell sits on top of the pom-pom, next to the cord clip, adding a sound cue as the ball moves.',
    icon: Bell,
  },
];
</script>

<template>
  <div class="cattoy-page">
    <section class="cattoy-hero" aria-labelledby="cattoy-title">
      <div class="cattoy-hero-copy">
        <p class="cattoy-eyebrow">Playtime</p>
        <h1 id="cattoy-title">Push-Button Pom-Pom Cat Toy</h1>
        <p class="cattoy-lead">
          A battery-powered play wand with a reeling cord: one button shoots the pom-pom across the
          room, the other winds it back. Two pom-poms are included, and they clip on and off — so
          you can keep the game going without bending down to pick the ball up.
        </p>

        <ul class="cattoy-highlights">
          <li>One button to launch, one to retract</li>
          <li>2 replaceable pom-poms included</li>
          <li>Bell on top of the ball</li>
        </ul>

        <div class="cattoy-hero-actions">
          <a class="cattoy-cta cattoy-cta--primary" href="#cattoy-how">See how it plays</a>
          <a class="cattoy-cta cattoy-cta--ghost" :href="contactEmailHref">Ask about this toy</a>
        </div>
      </div>

      <img
        class="cattoy-hero-media"
        src="/images/products/cat-toy/hero.webp"
        alt="A ragdoll kitten reaching for the pink pom-pom of the push-button cat toy"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="cattoy-how" class="cattoy-section" aria-labelledby="cattoy-how-title">
      <div class="cattoy-heading">
        <p class="cattoy-eyebrow">How it plays</p>
        <h2 id="cattoy-how-title">The ball comes back to you</h2>
        <p>
          Cats lose interest when the chase stops. The cord lets the pom-pom keep moving — out,
          back, and out again — without anyone having to fetch it.
        </p>
      </div>

      <div class="cattoy-steps">
        <article v-for="item in steps" :key="item.step" class="cattoy-step">
          <img :src="item.image" :alt="item.alt" loading="lazy" decoding="async" />
          <div class="cattoy-step-copy">
            <p class="cattoy-step-number">{{ item.step }}</p>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="cattoy-section" aria-labelledby="cattoy-features-title">
      <div class="cattoy-heading">
        <p class="cattoy-eyebrow">Details</p>
        <h2 id="cattoy-features-title">What is in the handle</h2>
      </div>

      <div class="cattoy-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="cattoy-feature-card">
          <span class="cattoy-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="cattoy-section cattoy-gift" aria-labelledby="cattoy-gift-title">
      <div class="cattoy-gift-copy">
        <p class="cattoy-eyebrow">Gift ready</p>
        <h2 id="cattoy-gift-title">Comes as a complete gift box</h2>
        <p>
          The toy arrives in a printed gift box rather than a plain bag: the handle, two pom-poms,
          two spare pom-poms, the batteries and the little screwdriver you need to fit them are all
          inside, with a colour illustrated user manual on top.
        </p>
        <p>
          That makes it an easy present for a cat-owning friend — there is nothing else to buy, and
          the box is sturdy enough to keep the toy in afterwards.
        </p>

        <ul class="cattoy-gift-list">
          <li>Printed gift box</li>
          <li>Illustrated user manual</li>
          <li>Toy handle + 2 pom-poms</li>
          <li>2 spare pom-poms</li>
          <li>2 AAA batteries</li>
          <li>Screwdriver for the battery cover</li>
        </ul>
      </div>

      <img
        class="cattoy-gift-media"
        src="/images/products/cat-toy/gift-box.webp"
        alt="The cat toy gift box with its user manual, spare pom-poms, batteries, screwdriver and handle"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section class="cattoy-section cattoy-scene" aria-labelledby="cattoy-scene-title">
      <img
        class="cattoy-scene-media"
        src="/images/products/cat-toy/lifestyle-wide.webp"
        alt="A kitten on its back reaching for the pom-pom while the handle is held above"
        loading="lazy"
        decoding="async"
      />

      <div class="cattoy-scene-copy">
        <p class="cattoy-eyebrow">Playtime at home</p>
        <h2 id="cattoy-scene-title">Play wherever the cat already is</h2>
        <p>
          Hold the handle, press the launch button and the game starts from the sofa, the hallway or
          the floor beside you. The retract button brings the pom-pom back into the handle, so a
          short session ends with the toy in your hand rather than under the furniture.
        </p>
        <p>
          Two AAA batteries power the cord, and a pair is included. Each toy also comes with a spare
          pom-pom, so a worn ball can be swapped in seconds.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cattoy-page {
  --cattoy-ink: #314e53;
  --cattoy-pink: #d98aa6;
  --cattoy-blue: #6fa9c4;
  --cattoy-warm: #fdf6f2;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.cattoy-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(26px, 4vw, 58px);
  align-items: center;
  padding: clamp(130px, 11vw, 176px) max(7vw, calc((100vw - 1180px) / 2)) clamp(46px, 6vw, 74px);
  background: linear-gradient(180deg, #fffafc, var(--cattoy-warm));
}

.cattoy-eyebrow {
  margin: 0 0 12px;
  color: var(--cattoy-pink);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cattoy-hero h1 {
  margin: 0;
  color: var(--cattoy-ink);
  font-size: clamp(31px, 4.2vw, 58px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.cattoy-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.22vw, 18.5px);
  line-height: 1.62;
}

.cattoy-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.cattoy-highlights li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 999px;
  background: #fff;
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 700;
}

.cattoy-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.cattoy-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.cattoy-cta--primary {
  background: var(--cattoy-ink);
  color: #fef5ed;
}

.cattoy-cta--primary:hover,
.cattoy-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.cattoy-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.28);
  color: var(--cattoy-ink);
}

.cattoy-cta--ghost:hover,
.cattoy-cta--ghost:focus-visible {
  border-color: var(--cattoy-ink);
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-2px);
}

.cattoy-hero-media {
  width: 100%;
  max-height: 620px;
  border-radius: 16px;
  /* Crop from the bottom: the pom-pom at the top of the frame must stay in. */
  object-fit: cover;
  object-position: center top;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.14);
}

/* ── Shared section shell ────────────────────────────────────────────────── */
.cattoy-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(50px, 6vw, 82px) 0 0;
}

.cattoy-heading {
  max-width: 720px;
}

.cattoy-heading h2,
.cattoy-scene-copy h2 {
  margin: 0;
  color: var(--cattoy-ink);
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.cattoy-heading p:not(.cattoy-eyebrow),
.cattoy-scene-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Steps ───────────────────────────────────────────────────────────────── */
.cattoy-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.cattoy-step {
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.13);
  border-radius: 12px;
  background: #fff;
}

.cattoy-step img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.cattoy-step-copy {
  padding: 16px 18px 20px;
}

.cattoy-step-number {
  margin: 0;
  color: var(--cattoy-blue);
  font-size: 11.5px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.cattoy-step-copy h3 {
  margin: 6px 0 0;
  color: var(--cattoy-ink);
  font-size: 18px;
  font-weight: 900;
}

.cattoy-step-copy p:not(.cattoy-step-number) {
  margin: 8px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.58;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.cattoy-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.cattoy-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--cattoy-warm);
}

.cattoy-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--cattoy-pink);
}

.cattoy-feature-card h3 {
  margin: 12px 0 0;
  color: var(--cattoy-ink);
  font-size: 16px;
  font-weight: 900;
  line-height: 1.25;
}

.cattoy-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Gift box ────────────────────────────────────────────────────────────── */
.cattoy-gift {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.cattoy-gift-copy h2 {
  margin: 0;
  color: var(--cattoy-ink);
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.cattoy-gift-copy p:not(.cattoy-eyebrow) {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

.cattoy-gift-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 18px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.cattoy-gift-list li {
  position: relative;
  padding-left: 20px;
  color: #3f5c62;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

.cattoy-gift-list li::before {
  position: absolute;
  top: 7px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cattoy-pink);
  content: '';
}

.cattoy-gift-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

/* ── Scene + specs ───────────────────────────────────────────────────────── */
.cattoy-scene {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.cattoy-scene-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

@media (max-width: 900px) {
  .cattoy-hero,
  .cattoy-gift,
  .cattoy-scene {
    grid-template-columns: minmax(0, 1fr);
  }

  .cattoy-hero {
    padding-top: 152px;
  }

  .cattoy-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .cattoy-hero {
    padding: 148px 24px 44px;
  }

  .cattoy-section {
    width: calc(100% - 32px);
  }

  .cattoy-steps,
  .cattoy-feature-grid,
  .cattoy-gift-list {
    grid-template-columns: minmax(0, 1fr);
  }

}
</style>
