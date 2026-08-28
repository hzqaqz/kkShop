<script setup>
import { House, Mail, MessageCircle, PhoneCall } from 'lucide-vue-next';
import SiteHeader from '../components/SiteHeader.vue';

const cooperationOptions = [
  'Wholesale and bulk orders',
  'OEM and ODM services',
  'Residential and commercial product solutions',
  'Long-term distribution partnerships',
  'Project-based product support',
];

const contacts = [
  { label: 'Email', value: 'info@meowerair.com', icon: Mail },
  { label: 'Mobile', value: '+86 1337 049 7731', icon: PhoneCall },
  { label: 'Whatsapp', value: '18902169202', icon: MessageCircle },
  { label: 'Address', value: 'Beijing, China', icon: House },
];
</script>

<template>
  <main class="site-shell about-page">
    <SiteHeader />

    <section class="about-intro" aria-labelledby="about-title">
      <div class="about-copy">
        <p class="about-eyebrow">Meower</p>
        <h1 id="about-title">About us</h1>
        <p class="about-tagline">Cleaner Air for Pets and the People Who Love Them.</p>

        <div class="about-story">
          <p>
            Pets spend most of their lives indoors — close to carpets, sofas, beds, litter areas,
            and the quiet corners of home. These are also the places where fur, dander, dust, and
            odors can easily build up.
          </p>
          <p>At Meower, we believe a better home environment should care for both pets and people.</p>
          <p>
            That’s why we create air purifiers designed for cat-loving families: helping reduce
            airborne fur, dander, particles, and everyday odors, while keeping the home fresh,
            calm, and comfortable.
          </p>
          <p>
            Because cleaner air is not just about breathing better. It is about more peaceful naps,
            warmer cuddles, happier playtime, and more everyday moments shared together.
          </p>
        </div>
        <p class="about-signoff">Meower — Cleaner Air. Happier Pet Homes.</p>
      </div>
    </section>

    <section class="partner-section" aria-labelledby="partner-title">
      <div class="partner-heading">
        <p>Grow with us</p>
        <h2 id="partner-title">Partner with Meower</h2>
      </div>

      <div class="partner-grid">
        <div class="partner-copy">
          <p class="partner-lead">Looking for reliable air purifiers and dehumidifiers for your market?</p>
          <p>
            We provide residential and commercial air purification and humidity control solutions
            for distributors, retailers, contractors, and project buyers worldwide.
          </p>
          <p class="partner-options-label">Our cooperation options include:</p>
          <ul>
            <li v-for="option in cooperationOptions" :key="option">{{ option }}</li>
          </ul>
        </div>

        <aside class="about-contact-panel" aria-label="Business inquiry contact information">
          <h3>Contact us to start your business inquiry today.</h3>
          <ul>
            <li v-for="contact in contacts" :key="contact.label">
              <component :is="contact.icon" aria-hidden="true" />
              <span><strong>{{ contact.label }}:</strong> {{ contact.value }}</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page { --ink: #345258; --mint: #d9eee8; color: #171918; background: #fff; }
.about-intro { position: relative; overflow: hidden; padding: clamp(150px, 13vw, 210px) max(7vw, calc((100vw - 1240px) / 2)) clamp(76px, 8vw, 128px); background: #fff; }
.about-copy { position: relative; z-index: 1; max-width: 1220px; }
.about-eyebrow, .partner-heading p { margin: 0 0 12px; color: var(--ink); font-size: 14px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.about-intro h1, .partner-heading h2 { margin: 0; color: var(--ink); font-size: clamp(56px, 7vw, 108px); font-weight: 850; letter-spacing: -.055em; line-height: .95; }
.about-tagline { max-width: 850px; margin: 34px 0 44px; font-size: clamp(22px, 2.25vw, 35px); font-weight: 520; line-height: 1.3; }
.about-story { display: grid; gap: clamp(22px, 3vw, 38px); max-width: 1180px; font-size: clamp(19px, 1.7vw, 27px); line-height: 1.48; }
.about-story p, .about-signoff { margin: 0; }
.about-signoff { margin-top: clamp(38px, 5vw, 68px); color: var(--ink); font-size: clamp(23px, 2vw, 32px); font-weight: 680; }
.partner-section { padding: clamp(70px, 9vw, 130px) max(7vw, calc((100vw - 1240px) / 2)); background: #fff; }
.partner-heading { margin-bottom: clamp(46px, 6vw, 78px); }
.partner-heading h2 { font-size: clamp(50px, 6.3vw, 98px); }
.partner-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(370px, .95fr); gap: clamp(48px, 8vw, 135px); align-items: start; }
.partner-copy { max-width: 600px; font-size: clamp(19px, 1.55vw, 25px); line-height: 1.48; }
.partner-copy p { margin: 0 0 30px; }
.partner-copy .partner-lead { font-size: clamp(23px, 2vw, 32px); font-weight: 600; }
.partner-options-label { margin-bottom: 0 !important; }
.partner-copy ul { margin: 8px 0 0; padding-left: 1.25em; }
.about-contact-panel { padding: 0 0 0 clamp(28px, 4vw, 58px); border-left: 3px solid var(--mint); }
.about-contact-panel h3 { max-width: 540px; margin: 0 0 34px; color: #090b0b; font-size: clamp(28px, 2.6vw, 43px); line-height: 1.2; }
.about-contact-panel ul { display: grid; gap: 22px; margin: 0; padding: 0; list-style: none; }
.about-contact-panel li { display: flex; gap: 18px; align-items: center; font-size: clamp(18px, 1.55vw, 24px); }
.about-contact-panel svg { flex: 0 0 auto; width: 32px; height: 32px; color: var(--ink); stroke-width: 1.8; }
.about-contact-panel strong { font-weight: 750; }
@media (max-width: 900px) { .about-intro { padding: 166px 28px 70px; } .about-tagline { max-width: 620px; } .partner-section { padding: 72px 28px; } .partner-grid { grid-template-columns: 1fr; gap: 55px; } .about-contact-panel { max-width: 620px; } }
@media (max-width: 560px) { .about-intro h1 { font-size: 58px; } .about-tagline { margin: 26px 0 36px; } .about-story { font-size: 19px; } .partner-heading h2 { font-size: 52px; } .about-contact-panel { padding-left: 22px; } .about-contact-panel li { gap: 13px; align-items: flex-start; } .about-contact-panel svg { width: 27px; height: 27px; } }
</style>
