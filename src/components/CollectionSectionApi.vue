<template>
  <section class="bg-white py-16 text-black dark:bg-[#0f0f11] dark:text-white">
    <div class="mx-auto w-[92%] max-w-7xl">
      <!-- same heading system -->
      <h2 class="typo-heading uppercase">Explore Our Collection</h2>
      <p class="typo-body mt-3">
        Gems and jewellery curated for your collection.
      </p>

      <div v-if="loading" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="rounded-2xl bg-[#efefef] dark:bg-[#1a1a1d] p-4 animate-pulse">
          <div class="h-52 w-full rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
          <div class="mt-3 h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div class="mt-2 h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div class="mt-2 h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div
        v-else-if="visibleItems.length === 0"
        class="mt-8 rounded-xl border border-black/15 dark:border-white/20 bg-[#f8f8f8] dark:bg-[#17171a] p-8 text-center"
      >
        <p class="typo-heading !text-2xl">No matching products</p>
        <p class="typo-body mt-1">Try another keyword (title, category, brand).</p>
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="item in visibleItems"
          :id="`product-${item.id}`"
          :key="item.id"
          class="rounded-2xl bg-[#efefef] dark:bg-[#1a1a1d] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          :class="item.id === highlightId ? 'ring-4 ring-amber-400 shadow-2xl animate-pulse' : ''"
        >
          <div class="overflow-hidden rounded-2xl bg-[#dcdcdc] dark:bg-[#222228]">
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="h-52 w-full object-cover transition duration-500 hover:scale-105"
              loading="lazy"
              @error="onImgError"
            />
          </div>

          <ul class="mt-3 list-disc pl-4 text-sm leading-5 min-h-[95px]">
            <li class="font-medium">{{ item.title }}</li>
            <li>Category: {{ item.category }}</li>
            <li>Brand: {{ item.brand || 'N/A' }}</li>
            <li>Stock: {{ item.stock }}</li>
          </ul>

          <p class="mt-3 typo-label !tracking-[0.2em] !text-[11px] !text-slate-700 dark:!text-slate-300">Price</p>
          <p class="typo-special !not-italic !font-medium">USD ${{ item.price }}</p>

          <p class="text-base mt-1">
            <span
              v-for="n in 5"
              :key="n"
              :class="n <= toStars(item.rating) ? 'text-black dark:text-white' : 'text-black/30 dark:text-white/30'"
            >
              ★
            </span>
          </p>
        </article>
      </div>

      <div v-if="filteredItems.length > 4" class="mt-12 flex justify-center">
        <button
          @click="showAll = !showAll"
          class="group inline-flex items-center gap-3 rounded-full border border-black/30 dark:border-white/35 bg-white dark:bg-transparent px-8 py-3 transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black typo-btn"
        >
          {{ showAll ? 'Show Less' : 'Explore More' }}
          <span v-if="!showAll" class="transition-transform duration-300 group-hover:translate-x-1">→</span>
          <span v-else class="leading-none">↑</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import gem1 from '@/assets/gem1.png';
import gem2 from '@/assets/gem2.png';
import gem3 from '@/assets/gem3.png';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const props = defineProps<{
  searchQuery?: string;
  highlightId?: number | null;
}>();

const loading = ref(false);
const items = ref<Product[]>([]);
const showAll = ref(false);

const customGemItems: Product[] = [
  {
    id: 10001,
    title: 'Blue Sapphire (Ceylon) - 2.10ct',
    category: 'gemstone',
    price: 1250,
    rating: 5,
    stock: 4,
    brand: 'Evoryn Gems',
    thumbnail: gem1
  },
  {
    id: 10002,
    title: 'Royal Blue Sapphire Ring - 18K',
    category: 'jewellery',
    price: 2200,
    rating: 5,
    stock: 2,
    brand: 'Evoryn Fine',
    thumbnail: gem2
  },
  {
    id: 10003,
    title: 'Pigeon Blood Ruby - 1.45ct',
    category: 'gemstone',
    price: 1980,
    rating: 4.8,
    stock: 3,
    brand: 'Evoryn Gems',
    thumbnail: gem3
  },
  {
    id: 10004,
    title: 'Colombian Emerald Pendant',
    category: 'jewellery',
    price: 1475,
    rating: 4.7,
    stock: 5,
    brand: 'Evoryn Fine',
    thumbnail: gem2
  }
];

function toStars(rating: number): number {
  return Math.max(1, Math.min(5, Math.round(rating)));
}

async function loadProducts(): Promise<void> {
  loading.value = true;
  try {
    const res = await fetch('https://dummyjson.com/products?limit=8&skip=0');
    const data = (await res.json()) as ProductsResponse;
    items.value = [...customGemItems, ...(data.products ?? [])];
  } catch {
    items.value = [...customGemItems];
  } finally {
    loading.value = false;
  }
}

const filteredItems = computed(() => {
  const q = (props.searchQuery ?? '').trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((p) =>
    `${p.title} ${p.category} ${p.brand ?? ''}`.toLowerCase().includes(q)
  );
});

const visibleItems = computed(() => {
  return showAll.value ? filteredItems.value : filteredItems.value.slice(0, 4);
});

const highlightId = computed(() => props.highlightId ?? null);

function onImgError(e: Event): void {
  const target = e.target as HTMLImageElement;
  target.src = gem1;
}

watch(
  () => props.searchQuery,
  () => {
    showAll.value = false;
  }
);

watch(
  () => props.highlightId,
  async (id) => {
    if (!id) return;
    showAll.value = true;
    await nextTick();
    const el = document.getElementById(`product-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
);

onMounted(() => {
  void loadProducts();
});
</script>