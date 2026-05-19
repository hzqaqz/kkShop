<script setup>
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  Headphones,
  HeartHandshake,
  Menu,
  PackageCheck,
  Sparkles,
} from 'lucide-vue-next';

const collections = [
  {
    title: '日常质感',
    label: 'Daily Edit',
    text: '以温润材质和耐看轮廓，重塑通勤、居家与短途出行的秩序感。',
    image: '/images/collection-daily.png',
  },
  {
    title: '礼赠甄选',
    label: 'Gift Atelier',
    text: '围绕节庆、纪念日与商务场景，提供更有分寸的心意表达。',
    image: '/images/collection-gift.png',
  },
  {
    title: '限定企划',
    label: 'Limited Notes',
    text: '用小批量主题组合，记录季节色彩、城市灵感与生活仪式。',
    image: '/images/collection-limited.png',
  },
];

const promises = [
  { icon: BadgeCheck, title: '正品甄选', text: '严选稳定供应链，保留清晰来源与品质标准。' },
  { icon: Gift, title: '精致包装', text: '礼盒、卡片与防护细节兼顾体面和实用。' },
  { icon: HeartHandshake, title: '会员礼遇', text: '围绕复购、生日和专属活动提供长期价值。' },
  { icon: Headphones, title: '快速响应', text: '从咨询到售后，提供轻量、及时的 H5 服务入口。' },
];
</script>

<template>
  <main class="site-shell">
    <header class="topbar" aria-label="kkShop 导航">
      <a class="brand" href="#hero" aria-label="kkShop 首页">
        <span class="brand-mark">k</span>
        <span>kkShop</span>
      </a>
      <nav class="nav-links" aria-label="页面导航">
        <a href="#philosophy">品牌理念</a>
        <a href="#collections">精选系列</a>
        <a href="#service">服务承诺</a>
      </nav>
      <button class="icon-button" type="button" aria-label="打开菜单">
        <Menu :size="20" aria-hidden="true" />
      </button>
    </header>

    <section id="hero" class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">Curated Lifestyle Boutique</p>
        <h1>kkShop</h1>
        <p class="hero-lead">
          为日常挑选更少、更好、更值得被长期使用的物件。
        </p>
        <div class="hero-actions" aria-label="主要操作">
          <a class="primary-action" href="#contact">
            预约品牌体验
            <ArrowRight :size="18" aria-hidden="true" />
          </a>
          <a class="secondary-action" href="#collections">浏览精选</a>
        </div>
      </div>
      <figure class="hero-visual">
        <img src="/images/hero-lifestyle.png" alt="kkShop 高端生活方式视觉陈列" />
        <figcaption>
          <span>2026 Spring Edit</span>
          <strong>72</strong>
          <span>精选新品</span>
        </figcaption>
      </figure>
    </section>

    <section id="philosophy" class="section philosophy-section">
      <div class="section-heading">
        <p class="eyebrow">Brand Philosophy</p>
        <h2>把选择变轻，把质感留久。</h2>
      </div>
      <div class="philosophy-grid">
        <p>
          kkShop 关注生活中真正被频繁触碰的物件：材质、比例、包装、服务，都需要经得起反复使用和细看。
        </p>
        <p>
          我们不追逐无限上新，而是用更稳定的甄选节奏，让每一次购买都像一次清醒、从容的决定。
        </p>
      </div>
    </section>

    <section id="collections" class="section collections-section">
      <div class="section-heading">
        <p class="eyebrow">Selected Series</p>
        <h2>精选系列</h2>
      </div>
      <div class="collection-grid">
        <article v-for="item in collections" :key="item.title" class="collection-card">
          <img :src="item.image" :alt="`${item.title}系列视觉`" />
          <div>
            <span>{{ item.label }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </article>
      </div>
    </section>

    <section id="service" class="section promise-section">
      <div class="section-heading">
        <p class="eyebrow">Service Promise</p>
        <h2>每个细节，都服务于体面抵达。</h2>
      </div>
      <div class="promise-grid">
        <article v-for="item in promises" :key="item.title" class="promise-item">
          <component :is="item.icon" :size="22" aria-hidden="true" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section id="contact" class="contact-section" aria-label="联系 kkShop">
      <div>
        <p class="eyebrow">Visit kkShop</p>
        <h2>开启你的专属精选清单</h2>
        <p>添加顾问、关注上新，或预约一次轻量的品牌体验。</p>
      </div>
      <div class="contact-actions">
        <a class="primary-action" href="tel:4000002026">
          <PackageCheck :size="18" aria-hidden="true" />
          立即咨询
        </a>
        <a class="secondary-action" href="mailto:hello@kkshop.demo">
          <Sparkles :size="18" aria-hidden="true" />
          获取企划
        </a>
      </div>
    </section>
  </main>
</template>
