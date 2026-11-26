<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import StorefrontNav from '@/components/StorefrontNav.vue';
import { sampleGemProducts } from '@/data/catalog';
import { isBackendConfigured } from '@/lib/supabase';
import { listProducts, type StoreProduct } from '@/services/products';

const records = ref<StoreProduct[]>([]);
const loading = ref(true);
const error = ref('');
const query = ref('');
const category = ref('all');
const currency = ref<'LKR' | 'USD'>('LKR');
const categories = [
  { id: 'all', label: 'All pieces' },
  { id: 'gemstone', label: 'Gemstones' },
  { id: 'jewellery', label: 'Jewellery' }
] as const;
const fallback = sampleGemProducts.map((item, index) => ({
  id: String(item.id), slug: `evoryn-selection-${index + 1}`, name: item.title,
  description: 'A considered selection from Evoryn’s Ceylon collection.', category: item.category,
  price_lkr: 0, price_usd: item.price, stock_quantity: item.stock,
  image_url: item.thumbnail, is_published: true
})) as StoreProduct[];
const visible = computed(() => records.value.filter((item) =>
  (category.value === 'all' || item.category === category.value) &&
  `${item.name} ${item.description}`.toLowerCase().includes(query.value.toLowerCase().trim())
));
function format(price: number) {
  return new Intl.NumberFormat(currency.value === 'LKR' ? 'en-LK' : 'en-US', {
    style: 'currency', currency: currency.value, maximumFractionDigits: currency.value === 'LKR' ? 0 : 2
  }).format(price);
}
onMounted(async () => {
  try {
    if (!isBackendConfigured) { records.value = fallback; return; }
    records.value = await listProducts();
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'The collection could not be loaded.';
  } finally { loading.value = false; }
});
</script>

<template>
  <main class="shop-page">
    <StorefrontNav />
    <section class="shop-intro">
      <p class="eyebrow">THE EVORYN COLLECTION</p>
      <h1>Rare by nature.<br><em>Chosen with care.</em></h1>
      <p class="intro-copy">Ceylon’s storied stones, selected for their character and crafted to be kept.</p>
      <p v-if="!isBackendConfigured" class="catalog-note">A sample edit of the collection is shown. Final prices and availability are confirmed directly by Evoryn.</p>
      <div class="shop-controls">
        <label class="search"><span>⌕</span><input v-model="query" aria-label="Search collection" placeholder="Search the collection" /></label>
        <div class="filters" aria-label="Filter by category">
          <button v-for="item in categories" :key="item.id" :class="{active:category===item.id}" @click="category=item.id">{{ item.label }}</button>
        </div>
        <label class="currency">Price in <select v-model="currency"><option>LKR</option><option>USD</option></select></label>
      </div>
    </section>
    <section class="product-grid" aria-live="polite">
      <div v-if="loading" class="state">Opening the collection…</div>
      <div v-else-if="error" class="state">{{ error }} <button @click="$router.go(0)">Try again</button></div>
      <div v-else-if="!visible.length" class="state">No pieces match this search. Try another term or category.</div>
      <article v-for="(item,index) in visible" :key="item.id" class="product-card">
        <RouterLink :to="`/products/${item.slug}`" class="product-image">
          <img :src="item.image_url" :alt="item.name" loading="lazy" />
          <span class="piece-index">0{{ index+1 }}</span>
        </RouterLink>
        <div class="product-meta"><span>{{ item.category === 'gemstone' ? 'LOOSE GEMSTONE' : 'FINE JEWELLERY' }}</span><span>{{ item.stock_quantity > 0 ? 'AVAILABLE' : 'ENQUIRE' }}</span></div>
        <h2><RouterLink :to="`/products/${item.slug}`">{{ item.name }}</RouterLink></h2>
        <p class="price">{{ !isBackendConfigured && currency === 'LKR' ? 'Price by enquiry' : format(currency === 'LKR' ? item.price_lkr : item.price_usd) }}</p>
      </article>
    </section>
    <section class="assurance"><span>01 / Ceylon provenance</span><span>02 / Considered craftsmanship</span><span>03 / Personal guidance</span></section>
    <footer class="shop-footer">EVORYN · GEMS WITH A SENSE OF PLACE <RouterLink to="/">Return to the story ↗</RouterLink></footer>
  </main>
</template>

<style scoped>
.catalog-note{margin-top:14px;color:#a89d88;font:10px/1.6 Arial,sans-serif;letter-spacing:.04em}
.shop-page{min-height:100vh;background:#10100f;color:#f2eee6}.shop-intro{padding:clamp(60px,9vw,116px) clamp(22px,9vw,140px) 42px}.eyebrow,.product-meta,.assurance,.shop-footer{font:10px Arial,sans-serif;letter-spacing:.18em;color:#c7a35f}.shop-intro h1{font:400 clamp(46px,7vw,90px)/.98 Georgia,serif;letter-spacing:-.04em;margin:22px 0}.shop-intro h1 em{color:#c7a35f;font-weight:400}.intro-copy{color:#aaa397;font:15px/1.7 Georgia,serif;max-width:430px}.shop-controls{display:flex;align-items:center;gap:22px;margin-top:46px;flex-wrap:wrap;border-top:1px solid #ffffff1a;padding-top:19px}.search{display:flex;align-items:center;gap:10px;border-bottom:1px solid #ffffff45;padding:8px 0;min-width:210px;color:#c7a35f}.search input{background:none;border:0;outline:0;color:#f2eee6;font:13px Georgia,serif}.filters{display:flex;gap:5px}.filters button,.currency select{background:transparent;color:#b8b1a4;border:1px solid #ffffff24;padding:10px 13px;font:9px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}.filters button.active{border-color:#c7a35f;color:#e4c782}.currency{margin-left:auto;color:#928b7e;font:10px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}.currency select{margin-left:8px;color:#f5f0e5}.currency option{background:#10100f}.product-grid{padding:20px clamp(22px,9vw,140px) 90px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:45px 22px}.product-image{display:block;position:relative;height:clamp(230px,31vw,420px);overflow:hidden;background:radial-gradient(ellipse,#292720,#171716 70%)}.product-image:after{content:"";position:absolute;inset:0;border:1px solid #ffffff16;pointer-events:none}.product-image img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.2,.6,.3,1);mix-blend-mode:screen}.product-image:hover img{transform:scale(1.055)}.piece-index{position:absolute;right:16px;top:14px;color:#e1d6bd;font:italic 13px Georgia,serif}.product-meta{display:flex;justify-content:space-between;margin-top:19px;font-size:8px;color:#a99b7a}.product-card h2{font:400 22px/1.3 Georgia,serif;margin:10px 0 6px}.product-card h2 a{color:inherit;text-decoration:none}.price{font:12px Arial,sans-serif;color:#d6b56f;letter-spacing:.08em}.state{grid-column:1/-1;text-align:center;padding:90px 10px;color:#bdb5a6;font:18px Georgia,serif}.state button{display:block;margin:20px auto;background:none;border:1px solid #c7a35f;padding:10px 18px;color:#e4c782}.assurance{margin:0 clamp(22px,9vw,140px);border-top:1px solid #ffffff25;border-bottom:1px solid #ffffff25;padding:26px 0;display:flex;justify-content:space-between;gap:20px;color:#a69c87;font-size:9px}.shop-footer{padding:34px clamp(22px,9vw,140px);display:flex;justify-content:space-between;gap:16px;color:#8d8577;font-size:8px}.shop-footer a{color:#d6b56f;text-decoration:none}@media(max-width:760px){.product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 14px}.shop-controls{gap:12px}.search{width:100%}.currency{margin-left:0}.assurance{flex-direction:column}.product-card h2{font-size:17px}}@media(max-width:480px){.product-grid{grid-template-columns:1fr}.product-image{height:360px}.filters{width:100%;overflow:auto}.shop-intro{padding-top:48px}}
</style>
