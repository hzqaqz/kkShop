<script setup>
/**
 * The "who are we, where do we ship from, what happens if it goes wrong" card.
 *
 * This block exists for one reason: Google Merchant Center's Misrepresentation
 * review looks for a real, verifiable business behind the storefront. Company
 * name, a full postal address, the shipping origin, delivery windows, the return
 * rule and the payment method all have to be readable on the site itself — not
 * only in the Merchant Center settings, and not only in a policy page nobody
 * scrolls to.
 *
 * It is used in three places, from one source (`src/data/siteInfo.js`):
 *   - `Business` page (#about) and `Support` page (#contact) → `variant="full"`
 *   - the Shipping and Refund policy pages → `variant="compact"`
 *
 * Anything a reviewer could check elsewhere (feed, Shopify policy, GMC business
 * information) must match the values rendered here.
 */
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Building2,
  Clock,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  RotateCcw,
  Truck,
  Warehouse,
} from 'lucide-vue-next';
import {
  CONTACT_EMAIL,
  address,
  company,
  contactEmailHref,
  fulfilment,
} from '../data/siteInfo';

const props = defineProps({
  /** `full` adds the direct contact rows and the closing links. */
  variant: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'compact'].includes(value),
  },
  heading: {
    type: String,
    default: 'Company information',
  },
});

const headingId = computed(
  () => `company-${props.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
);

const showContact = computed(() => props.variant === 'full');

/**
 * One flat list of facts, so the two variants cannot drift apart: `compact`
 * simply drops the rows that the page above it already states.
 */
const rows = computed(() => {
  const all = [
    {
      id: 'entity',
      icon: Building2,
      label: 'Legal entity',
      value: company.legalName,
      note: company.legalNameZh,
      noteLang: 'zh',
    },
    company.registrationNumber
      ? {
          id: 'registration',
          icon: FileText,
          label: 'Company registration no.',
          value: company.registrationNumber,
        }
      : null,
    {
      id: 'address',
      icon: MapPin,
      label: 'Registered address & warehouse',
      lines: address.lines,
      note: address.zh,
      noteLang: 'zh',
    },
    {
      id: 'ships-from',
      icon: Warehouse,
      label: 'Ships from',
      value: fulfilment.shipsFrom,
      note: fulfilment.warehouseNote,
    },
    {
      id: 'dispatch',
      icon: Clock,
      label: 'Dispatch time',
      value: `Within ${fulfilment.dispatchWindow}`,
      note: `${fulfilment.dispatchNote} ${fulfilment.trackingNote}`,
    },
    {
      id: 'delivery',
      icon: Truck,
      label: 'Delivery times',
      zones: fulfilment.deliveryZones,
      note: `${fulfilment.deliveryNote} ${fulfilment.otherDestinationsNote}`,
    },
    {
      id: 'returns',
      icon: RotateCcw,
      label: 'Returns',
      value: `${fulfilment.returnWindow} from delivery`,
      note: `${fulfilment.returnWindowNote} ${fulfilment.returnShippingNote}`,
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'Payment',
      value: 'PayPal, via Shopify secure checkout',
      note: fulfilment.paymentNote,
    },
    showContact.value
      ? {
          id: 'email',
          icon: Mail,
          label: 'Email',
          value: CONTACT_EMAIL,
          href: contactEmailHref,
          note: company.responseTime,
        }
      : null,
    showContact.value
      ? {
          id: 'phone',
          icon: PhoneCall,
          label: 'Phone',
          value: company.phone,
          href: `tel:${company.phone.replace(/[^+\d]/g, '')}`,
        }
      : null,
    showContact.value
      ? {
          id: 'whatsapp',
          icon: MessageCircle,
          label: 'WhatsApp',
          value: company.whatsapp,
          href: `https://wa.me/${company.whatsapp.replace(/[^\d]/g, '')}`,
        }
      : null,
  ];

  return all.filter(Boolean);
});
</script>

<template>
  <section
    class="company-details"
    :class="`company-details--${props.variant}`"
    :aria-labelledby="headingId"
  >
    <h2 v-if="heading" :id="headingId" class="company-details-title">{{ heading }}</h2>

    <dl class="company-facts">
      <div v-for="row in rows" :key="row.id" class="company-fact">
        <dt>
          <component :is="row.icon" aria-hidden="true" />
          <span>{{ row.label }}</span>
        </dt>
        <dd>
          <a v-if="row.href" class="company-link" :href="row.href">{{ row.value }}</a>
          <span v-else-if="row.value" class="company-value">{{ row.value }}</span>
          <span v-for="line in row.lines ?? []" :key="line" class="company-value">{{ line }}</span>
          <span v-if="row.zones" class="company-zones">
            <span v-for="zone in row.zones" :key="zone.id" class="company-zone">
              <span class="company-zone-label">{{ zone.label }}</span>
              <span class="company-zone-window">{{ zone.window }}</span>
            </span>
          </span>
          <span v-if="row.note" class="company-note" :lang="row.noteLang">{{ row.note }}</span>
        </dd>
      </div>
    </dl>

    <p v-if="props.variant === 'full'" class="company-details-footer">
      Buying from us, or checking us out first? Our
      <RouterLink :to="{ name: 'shipping' }">Shipping Policy</RouterLink> and
      <RouterLink :to="{ name: 'refunds' }">Refund &amp; Exchanges</RouterLink> pages spell out the
      windows above, and
      <RouterLink :to="{ name: 'terms' }">Terms of Service</RouterLink> covers the rest. Anything
      unclear, email <a :href="contactEmailHref">{{ CONTACT_EMAIL }}</a>.
    </p>
  </section>
</template>

<style scoped>
.company-details {
  margin-top: clamp(32px, 4vw, 56px);
  padding: clamp(24px, 3vw, 40px);
  border: 1px solid rgba(51, 76, 81, 0.16);
  border-radius: 14px;
  background: #f8fbfa;
  color: #334c51;
}

.company-details-title {
  margin: 0 0 clamp(18px, 2.2vw, 28px);
  color: #274b52;
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.company-facts {
  display: grid;
  gap: clamp(16px, 1.8vw, 22px);
  margin: 0;
}

.company-fact {
  display: grid;
  grid-template-columns: minmax(180px, 0.32fr) minmax(0, 1fr);
  gap: 8px 24px;
  align-items: start;
}

.company-fact dt {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #527177;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.company-fact dt svg {
  flex: 0 0 auto;
  width: 17px;
  height: 17px;
  color: #345258;
  stroke-width: 1.9;
}

.company-fact dd {
  display: grid;
  gap: 4px;
  margin: 0;
  font-size: clamp(15px, 1.35vw, 17px);
  line-height: 1.55;
}

.company-value {
  display: block;
  color: #22383c;
  font-weight: 500;
}

.company-link {
  color: #274b52;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.company-link:hover {
  color: #5a7c85;
}

.company-note {
  display: block;
  max-width: 680px;
  color: #55747a;
  font-size: 14.5px;
  line-height: 1.55;
}

/* Delivery windows: a two-column region → days grid, laid out horizontally so
   the whole table can be read at a glance instead of as a paragraph. */
.company-zones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 6px 24px;
  margin-bottom: 4px;
}

.company-zone {
  display: flex;
  gap: 8px;
  align-items: baseline;
  justify-content: space-between;
  padding: 2px 0;
  border-bottom: 1px dotted rgba(51, 76, 81, 0.18);
}

.company-zone-label {
  color: #33565c;
  font-weight: 500;
}

.company-zone-window {
  color: #22383c;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* The Chinese name and the Chinese address are supporting detail, not the
   primary value, so they sit one step back. */
.company-note:lang(zh) {
  color: #648389;
  letter-spacing: 0.01em;
}

.company-details-footer {
  margin: clamp(22px, 2.4vw, 30px) 0 0;
  padding-top: clamp(16px, 2vw, 22px);
  border-top: 1px solid rgba(51, 76, 81, 0.12);
  color: #4f6b70;
  font-size: 14.5px;
  line-height: 1.6;
}

.company-details-footer a {
  color: #274b52;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* On a policy page the card sits above the legal prose, so it keeps the tighter
   spacing and only carries the facts that the prose does not state. */
.company-details--compact {
  margin-top: clamp(24px, 3vw, 36px);
}

.company-details--compact .company-details-title {
  font-size: clamp(18px, 1.7vw, 22px);
}

@media (max-width: 720px) {
  .company-fact {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }
}
</style>
