<template>
  <section class="bg-[#d9d9d9] py-16 text-black">
    <div class="mx-auto w-[92%] max-w-7xl">
      <h2 class="text-5xl md:text-6xl font-semibold">EXPLORE OUR COLLECTION</h2>
      <p class="mt-3 text-lg md:text-xl text-black/80">
        We think you will love these! Shop your favourites and add them to your collection.
      </p>

      <!-- loading -->
      <div v-if="loading" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-2xl bg-[#cfcfcf] p-4 animate-pulse"
        >
          <div class="h-52 w-full rounded-2xl bg-gray-300"></div>
          <div class="mt-3 h-4 w-3/4 bg-gray-300 rounded"></div>
          <div class="mt-2 h-3 w-full bg-gray-300 rounded"></div>
          <div class="mt-2 h-3 w-2/3 bg-gray-300 rounded"></div>
        </div>
      </div>

      <!-- error -->
      <div v-else-if="error" class="mt-8 rounded-xl bg-red-100 text-red-700 p-4">
        <p class="font-semibold">Failed to load products.</p>
        <p class="text-sm mt-1">{{ error }}</p>
        <button
          class="mt-3 border border-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition"
          @click="loadProducts"
        >
          Retry
        </button>
      </div>

      <!-- products -->
      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="item in items"
          :key="item.id"
          class="rounded-2xl bg-[#cfcfcf] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="overflow-hidden rounded-2xl bg-[#9d9d9d]">
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="h-52 w-full object-cover"
              loading="lazy"
            />
          </div>

          <ul class="mt-3 list-disc pl-4 text-sm min-h-[95px] leading-5">
            <li class="font-medium">{{ item.title }}</li>
            <li>Category: {{ item.category }}</li>
            <li>Brand: {{ item.brand || 'N/A' }}</li>
            <li>Stock: {{ item.stock }}</li>
          </ul>

          <p class="mt-3 font-medium">USD ${{ item.price }}</p>
          <p class="text-base">
            <span
              v-for="n in 5"
              :key="n"
              :class="n <= toStars(item.rating) ? 'text-black' : 'text-black/30'"
            >
              ★
            </span>
          </p>
        </article>
      </div>

      <div class="mt-10 flex justify-center">
        <button
          class="rounded-full border-2 border-black px-12 py-3 text-xl font-semibold hover:bg-black hover:text-white transition"
          @click="$emit('see-more')"
        >
          See More ...
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

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

defineEmits<{
  (e: 'see-more'): void;
}>();

const loading = ref<boolean>(false);
const error = ref<string>('');
const items = ref<Product[]>([]);

function toStars(rating: number): number {
  const rounded = Math.round(rating);
  return Math.max(1, Math.min(5, rounded));
}

async function loadProducts(): Promise<void> {
  loading.value = true;
  error.value = '';

  try {
    const res = await fetch('https://dummyjson.com/products?limit=4&skip=0');
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = (await res.json()) as ProductsResponse;
    items.value = data.products;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Unknown error';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadProducts();
});
</script>