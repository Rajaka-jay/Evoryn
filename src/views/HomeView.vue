<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';

import logoImg from '@/assets/logo.png';
import videoOne from '@/assets/video1.mp4';
import videoTwo from '@/assets/video2.mp4';
import manufactureImg from '@/assets/images.jpeg';
import gemGallery1 from '@/assets/gem1.png';
import gemGallery2 from '@/assets/gem2.png';
import gemGallery3 from '@/assets/gem3.png';

import CollectionSectionApi from '@/components/CollectionSectionApi.vue';
import SiteFooter from '@/components/SiteFooter.vue';

interface SearchProduct {
  id: number;
  title: string;
  category: string;
  brand?: string;
  price: number;
  thumbnail: string;
}

const isMenuOpen = ref(false);
const activeImageIndex = ref(0);
const gallery = [gemGallery1, gemGallery2, gemGallery3];

const showHeader = ref(true);
const currentSection = ref(0);
const isHeaderBlack = computed(() => currentSection.value >= 2);

const menuItems = [
  { name: 'Home' },
  { name: 'Collection' },
  { name: 'Museum' },
  { name: 'Services' },
  { name: 'Contact' }
];

const isSearchOpen = ref(false);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const selectedProductId = ref<number | null>(null);
const collectionSectionRef = ref<HTMLElement | null>(null);
const searchPool = ref<SearchProduct[]>([]);

const theme = ref<'light' | 'dark'>('light');
const isDark = computed(() => theme.value === 'dark');

const slides = [
  {
    id: 1,
    title: 'TALE OF THE GEMS',
    description:
      'We are the world finest gem workers, with over 100 years of expertise in the beauty and rarity of precious stones.',
    videoUrl: videoOne,
    buttonText: 'DISCOVER THE TALE'
  },
  {
    id: 2,
    title: 'THE CALATRAVA',
    description:
      'Purity of line and understated elegance. The very essence of the round wristwatch.',
    videoUrl: videoTwo,
    buttonText: 'EXPLORE COLLECTION'
  }
];

const customGemItems: SearchProduct[] = [
  {
    id: 10001,
    title: 'Blue Sapphire (Ceylon) - 2.10ct',
    category: 'gemstone',
    brand: 'Evoryn Gems',
    price: 1250,
    thumbnail: gemGallery1
  },
  {
    id: 10002,
    title: 'Royal Blue Sapphire Ring - 18K',
    category: 'jewellery',
    brand: 'Evoryn Fine',
    price: 2200,
    thumbnail: gemGallery2
  },
  {
    id: 10003,
    title: 'Pigeon Blood Ruby - 1.45ct',
    category: 'gemstone',
    brand: 'Evoryn Gems',
    price: 1980,
    thumbnail: gemGallery3
  },
  {
    id: 10004,
    title: 'Colombian Emerald Pendant',
    category: 'jewellery',
    brand: 'Evoryn Fine',
    price: 1475,
    thumbnail: gemGallery2
  }
];

let galleryTimer: ReturnType<typeof setInterval> | null = null;
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let clearHighlightTimer: ReturnType<typeof setTimeout> | null = null;

function applyTheme(next: 'light' | 'dark') {
  theme.value = next;
  const root = document.documentElement;
  if (next === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem('theme', next);
}

function toggleTheme() {
  applyTheme(isDark.value ? 'light' : 'dark');
}

function handleScroll() {
  const y = window.scrollY;
  const h = window.innerHeight;
  currentSection.value = Math.round(y / h);
  showHeader.value = currentSection.value < 2;
}

function onTopHoverEnter() {
  if (currentSection.value >= 2) showHeader.value = true;
}

function onTopHoverLeave() {
  if (currentSection.value >= 5 && !isMenuOpen.value) showHeader.value = false;
}

function toggleSearch(): void {
  isSearchOpen.value = !isSearchOpen.value;
}

function closeSearch(): void {
  isSearchOpen.value = false;
  searchQuery.value = '';
  debouncedSearchQuery.value = '';
}

function submitSearch(): void {
  debouncedSearchQuery.value = searchQuery.value.trim();
}

async function loadSearchPool(): Promise<void> {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=20&skip=0');
    const data = await res.json();
    const apiItems: SearchProduct[] = (data.products ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      brand: p.brand,
      price: p.price,
      thumbnail: p.thumbnail
    }));
    searchPool.value = [...customGemItems, ...apiItems];
  } catch {
    searchPool.value = [...customGemItems];
  }
}

const searchPreviewItems = computed(() => {
  const q = debouncedSearchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return searchPool.value
    .filter((p) => `${p.title} ${p.category} ${p.brand ?? ''}`.toLowerCase().includes(q))
    .slice(0, 6);
});

async function onPreviewItemClick(item: SearchProduct): Promise<void> {
  searchQuery.value = item.title;
  debouncedSearchQuery.value = item.title;
  selectedProductId.value = item.id;
  isSearchOpen.value = false;

  await nextTick();
  collectionSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (clearHighlightTimer) clearTimeout(clearHighlightTimer);
  clearHighlightTimer = setTimeout(() => {
    selectedProductId.value = null;
  }, 2200);
}

watch(searchQuery, (value) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = value.trim();
  }, 300);
});

onMounted(() => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  galleryTimer = setInterval(() => {
    activeImageIndex.value = (activeImageIndex.value + 1) % gallery.length;
  }, 4000);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  void loadSearchPool();
});

onUnmounted(() => {
  if (galleryTimer) clearInterval(galleryTimer);
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  if (clearHighlightTimer) clearTimeout(clearHighlightTimer);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main class="bg-white text-black min-h-screen dark:bg-[#0b0b0c] dark:text-white transition-colors duration-300">
    <div class="fixed top-0 left-0 w-full h-16 z-[60]" @mouseenter="onTopHoverEnter" @mouseleave="onTopHoverLeave"></div>

    <aside
      :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl z-[100] transition-transform duration-700 ease-in-out border-r border-white/10 p-12 text-white"
    >
      <button @click="isMenuOpen = false" class="text-xs tracking-[0.3em] text-white/70 hover:text-white mb-20 uppercase">
        Close ✕
      </button>

      <nav class="flex flex-col gap-8">
        <a v-for="item in menuItems" :key="item.name" href="#" class="text-3xl font-light hover:text-amber-400 transition-colors">
          {{ item.name }}
        </a>
      </nav>
    </aside>

    <header
      :class="[
        showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none',
        isHeaderBlack ? 'text-black dark:text-white' : 'text-white'
      ]"
      class="fixed top-0 left-0 w-full z-50 grid grid-cols-3 items-center px-6 md:px-12 py-6 md:py-8 transition-all duration-500"
    >
      <div class="flex items-center">
        <button @click="isMenuOpen = true" class="flex items-center gap-3 group cursor-pointer">
          <div class="flex flex-col gap-1.5">
            <div class="w-6 h-0.5 bg-current"></div>
            <div class="w-6 h-0.5 bg-current"></div>
          </div>
          <span class="text-[10px] font-bold tracking-[0.3em] uppercase">Menu</span>
        </button>
      </div>

      <div class="flex justify-center">
        <div class="rounded-full bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-black/10 px-3 py-2">
          <img :src="logoImg" alt="Logo" class="h-10 w-10 md:h-12 md:w-12 object-contain" />
        </div>
      </div>

      <div class="flex justify-end items-center gap-2">
        <button
          type="button"
          @click="toggleTheme"
          class="inline-flex items-center justify-center rounded-full p-2 border border-black/20 dark:border-white/30 hover:bg-black/10 dark:hover:bg-white/10 transition"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDark ? 'Light mode' : 'Dark mode'"
        >
          <span v-if="!isDark">🌙</span>
          <span v-else>☀️</span>
        </button>

        <button
          type="button"
          @click="toggleSearch"
          class="inline-flex items-center justify-center rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10 transition"
          :aria-label="isSearchOpen ? 'Close search' : 'Open search'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="isHeaderBlack ? 'text-black dark:text-white' : 'text-white'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </header>

    <transition name="fade">
      <div
        v-if="isSearchOpen"
        class="fixed top-20 right-6 md:right-12 z-[70] w-[90vw] max-w-md rounded-2xl border border-black/20 dark:border-white/20 bg-white dark:bg-[#121214] p-3 shadow-xl"
      >
        <form @submit.prevent="submitSearch" class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search gems, jewellery, brand..."
            class="w-full rounded-xl border border-black/20 dark:border-white/20 px-4 py-2 text-black dark:text-white bg-white dark:bg-[#0f0f11] outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
          <button type="submit" class="rounded-xl bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:opacity-85">Search</button>
          <button type="button" @click="closeSearch" class="rounded-xl border border-black/20 dark:border-white/20 px-3 py-2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">✕</button>
        </form>

        <div v-if="debouncedSearchQuery && searchPreviewItems.length" class="mt-3 max-h-80 overflow-auto rounded-xl border border-black/10 dark:border-white/20">
          <button
            v-for="item in searchPreviewItems"
            :key="item.id"
            type="button"
            @click="onPreviewItemClick(item)"
            class="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10 transition border-b last:border-b-0 border-black/5 dark:border-white/10"
          >
            <img :src="item.thumbnail" :alt="item.title" class="h-12 w-12 rounded-md object-cover" />
            <div class="min-w-0">
              <p class="text-sm font-semibold truncate">{{ item.title }}</p>
              <p class="text-xs text-black/60 dark:text-white/70 truncate">{{ item.category }} • {{ item.brand || 'N/A' }}</p>
            </div>
            <span class="ml-auto text-xs font-medium">USD ${{ item.price }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- First section (left as your hero style) -->
    <section v-for="slide in slides" :key="slide.id" class="relative min-h-screen flex items-center px-6 md:px-24 text-white">
      <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
        <source :src="slide.videoUrl" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-black/35"></div>

      <div class="relative z-10 max-w-2xl">
        <h2 class="text-4xl md:text-7xl font-light tracking-tight mb-6">{{ slide.title }}</h2>
        <p class="text-white/90 text-base md:text-lg leading-relaxed mb-8 font-light italic">{{ slide.description }}</p>
        <button class="px-8 py-3 border border-white/60 rounded-full hover:bg-white hover:text-black transition-all duration-500 text-[10px] tracking-[0.2em] font-bold uppercase">
          {{ slide.buttonText }}
        </button>
      </div>
    </section>

    <!-- After first section: consistent typography classes -->
    <section class="bg-white dark:bg-[#0f0f11] text-slate-900 dark:text-slate-100">
      <div class="min-h-screen w-full flex flex-col md:flex-row items-center">
        <div class="w-full md:w-1/2 h-[60vh] md:h-screen relative overflow-hidden">
          <img :src="manufactureImg" class="w-full h-full object-cover" />
        </div>

        <div class="w-full md:w-1/2 h-auto md:h-screen flex flex-col justify-center px-6 md:px-24 py-12 md:py-0">
          <div class="max-w-lg">
            <span class="typo-label mb-4 block">The Power of Craftsmanship</span>

            <h2 class="typo-heading mb-8">
              THE LAST FAMILY-OWNED <br />
              <span class="typo-special">GEM VAULT</span>
            </h2>

            <p class="typo-body mb-10 md:mb-12">
              Owned by the same family since its inception, our vault benefits from full creative freedom.
            </p>

            <button class="px-10 md:px-12 py-3 md:py-4 border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 rounded-full hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black transition-all duration-500 typo-btn">
              Our Values
            </button>
          </div>
        </div>
      </div>

      <div class="min-h-screen w-full flex flex-col md:flex-row items-center">
        <div class="w-full md:w-1/2 h-auto md:h-screen flex flex-col justify-center px-6 md:px-24 py-12 md:py-0 order-2 md:order-1">
          <div class="max-w-lg">
            <span class="typo-label mb-4 block">A Long-Term Vision</span>

            <h2 class="typo-heading mb-8 uppercase">
              Innovation and <br />
              <span class="typo-special">Tradition</span>
            </h2>

            <p class="typo-body mb-10 md:mb-12">
              We nurture a tradition of innovation, pushing the boundaries of gemstone artistry through advanced research and rare handcrafts.
            </p>

            <button class="px-10 py-3 md:py-4 border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 rounded-full hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black transition-all duration-500 typo-btn">
              Advanced Research
            </button>
          </div>
        </div>

        <div class="w-full md:w-1/2 h-[60vh] md:h-screen relative order-1 md:order-2 bg-slate-200 dark:bg-slate-800">
          <div
            v-for="(img, idx) in gallery"
            :key="idx"
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            :style="{ opacity: activeImageIndex === idx ? 1 : 0 }"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>

          <div class="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            <div
              v-for="(_, idx) in gallery"
              :key="idx"
              class="h-1 transition-all duration-500 rounded-full"
              :class="activeImageIndex === idx ? 'w-10 bg-white' : 'w-2 bg-white/50'"
            />
          </div>
        </div>
      </div>
    </section>

    <section ref="collectionSectionRef" class="bg-white dark:bg-[#0f0f11] text-black dark:text-white">
      <CollectionSectionApi :search-query="debouncedSearchQuery" :highlight-id="selectedProductId" />
    </section>

    <section class="bg-white dark:bg-[#0f0f11] text-black dark:text-white border-t border-black/20 dark:border-white/15">
      <div>
        <SiteFooter />
      </div>
    </section>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
::-webkit-scrollbar {
  display: none;
}
</style>