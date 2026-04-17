<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import logoImg from '@/assets/logo.png';

import videoOne from '@/assets/video1.mp4';
import videoTwo from '@/assets/video2.mp4';

import manufactureImg from '@/assets/images.jpeg';
import gemGallery1 from '@/assets/gem1.png';
import gemGallery2 from '@/assets/gem2.png';
import gemGallery3 from '@/assets/gem3.png';

import CollectionSectionApi from '@/components/CollectionSection.vue';
import SiteFooter from '@/components/SiteFooter.vue';

const router = useRouter();

// STATE
const isMenuOpen = ref(false);
const activeIndex = ref(0);
const activeImageIndex = ref(0);
const gallery = [gemGallery1, gemGallery2, gemGallery3];

const menuItems = [
  { name: 'Home' },
  { name: 'Collection' },
  { name: 'Museum' },
  { name: 'Services' },
  { name: 'Contact' }
];

const slides = [
  {
    id: 1,
    title: 'TALE OF THE GEMS',
    description:
      'We are the world finest gem workers, with over 100 years of expertise in the beauty and rarity of <br/> precious stones.',
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

// Total snap sections:
// - hero slides (slides.length)
// - craftsmanship section (1)
// - collection section (1)
// - footer section (1)
const totalSlides = slides.length + 3;

// LOGIC
const scrollToSlide = (index: number) => {
  activeIndex.value = index;
  const el = document.getElementById(`slide-${index}`);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const scrollPos = target.scrollTop;
  const pageHeight = target.clientHeight;
  activeIndex.value = Math.round(scrollPos / pageHeight);
};

let galleryTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  galleryTimer = setInterval(() => {
    activeImageIndex.value = (activeImageIndex.value + 1) % gallery.length;
  }, 4000);
});

onUnmounted(() => {
  if (galleryTimer) clearInterval(galleryTimer);
});

function goToProduct(id: number): void {
  router.push(`/product/${id}`);
}

function goToProductsPage(): void {
  router.push('/products');
}
</script>

<template>
  <div
    @scroll="handleScroll"
    class="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white selection:bg-amber-500/30"
  >
    <!-- Side Menu -->
    <aside
      :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl z-[100] transition-transform duration-700 ease-in-out border-r border-white/10 p-12"
    >
      <button
        @click="isMenuOpen = false"
        class="text-xs tracking-[0.3em] text-white/50 hover:text-white mb-20 uppercase"
      >
        Close ✕
      </button>
      <nav class="flex flex-col gap-8">
        <a
          v-for="item in menuItems"
          :key="item.name"
          href="#"
          class="text-3xl font-light hover:text-amber-500 transition-colors"
        >
          {{ item.name }}
        </a>
      </nav>
    </aside>

    <!-- Header -->
    <header
      class="fixed top-0 left-0 w-full z-50 grid grid-cols-3 items-center px-6 md:px-12 py-6 md:py-8 transition-all duration-700"
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

      <div class="flex justify-end gap-8 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </header>

    <!-- Hero video slides -->
    <section
      v-for="(slide, index) in slides"
      :key="slide.id"
      :id="`slide-${index}`"
      class="h-screen w-full relative snap-start flex items-center px-6 md:px-24"
    >
      <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
        <source :src="slide.videoUrl" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-black/30"></div>

      <div class="relative z-10 max-w-2xl">
        <h2 class="text-4xl md:text-7xl font-light tracking-tight mb-6 md:mb-8">{{ slide.title }}</h2>
        <p class="text-white/90 text-base md:text-lg leading-relaxed mb-8 md:mb-10 font-light italic" v-html="slide.description"></p>
        <button class="px-8 md:px-10 py-3 md:py-4 border border-white/50 rounded-full hover:bg-white hover:text-black transition-all duration-700 text-[10px] tracking-[0.2em] font-bold uppercase">
          {{ slide.buttonText }}
        </button>
      </div>
    </section>

    <!-- Craftsmanship -->
    <section id="slide-2" class="snap-start min-h-screen w-full bg-[#fafaf9] text-slate-900">
      <div class="min-h-screen w-full flex flex-col md:flex-row items-center">
        <div class="w-full md:w-1/2 h-[60vh] md:h-screen relative overflow-hidden">
          <img :src="manufactureImg" class="w-full h-full object-cover" />
        </div>
        <div class="w-full md:w-1/2 min-h-[40vh] md:h-screen flex flex-col justify-center px-6 md:px-24 py-12 md:py-0">
          <div class="max-w-lg">
            <span class="text-[10px] tracking-[0.4em] text-amber-600 font-bold uppercase mb-4 block">The Power of Craftsmanship</span>
            <h2 class="text-3xl md:text-5xl font-normal leading-tight tracking-tight mb-8">
              THE LAST FAMILY-OWNED <br />
              <span class="italic font-normal text-slate-500">GEM VAULT</span>
            </h2>
            <p class="text-slate-600 leading-relaxed text-base md:text-lg mb-10 md:mb-12 font-light italic">
              Owned by the same family since its inception, our vault benefits from full creative freedom.
            </p>
            <button class="px-10 md:px-12 py-3 md:py-4 border border-slate-900 text-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-500 text-[10px] tracking-[0.2em] font-bold uppercase">
              Our Values
            </button>
          </div>
        </div>
      </div>

      <div class="min-h-screen w-full flex flex-col md:flex-row items-center">
        <div class="w-full md:w-1/2 min-h-[40vh] md:h-screen flex flex-col justify-center px-6 md:px-24 py-12 md:py-0 order-2 md:order-1">
          <div class="max-w-lg">
            <span class="text-[10px] tracking-[0.4em] text-[#8b735b] font-bold uppercase mb-4 block">A Long-Term Vision</span>
            <h2 class="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-8 uppercase">
              Innovation and <br />
              <span class="italic font-normal text-[#8b735b]">Tradition</span>
            </h2>
            <p class="text-slate-600 leading-relaxed text-base md:text-lg mb-10 md:mb-12 font-light">
              We nurture a tradition of innovation, pushing the boundaries of gemstone artistry through advanced research and rare handcrafts.
            </p>
            <button class="px-10 py-3 md:py-4 border border-slate-900 text-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-500 text-[10px] tracking-[0.2em] font-bold uppercase">
              Advanced Research
            </button>
          </div>
        </div>

        <div class="w-full md:w-1/2 h-[60vh] md:h-screen relative order-1 md:order-2 bg-slate-100">
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
              :class="activeImageIndex === idx ? 'w-10 bg-white' : 'w-2 bg-white/40'"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- DummyJSON Collection -->
    <section id="slide-3" class="snap-start min-h-screen bg-[#d9d9d9] text-black">
      <CollectionSection @view-item="goToProduct" @see-more="goToProductsPage" />
    </section>

    <!-- Footer -->
    <section id="slide-4" class="snap-start min-h-screen bg-[#d9d9d9] text-black">
      <SiteFooter />
    </section>

    <!-- Right-side dot navigation -->
    <div class="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[60]">
      <button
        v-for="i in totalSlides"
        :key="i"
        @click="scrollToSlide(i - 1)"
        class="w-2 h-2 rounded-full transition-all duration-500"
        :class="activeIndex === i - 1 ? 'bg-white scale-150 ring-4 ring-white/20' : 'bg-white/40'"
      />
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>