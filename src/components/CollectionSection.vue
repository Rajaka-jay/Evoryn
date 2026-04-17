<template>
  <section class="bg-[#d9d9d9] py-16">
    <div class="mx-auto w-[92%] max-w-7xl">
      <h2 class="text-5xl font-semibold text-black">EXPLORE OUR COLLECTION</h2>
      <p class="mt-2 text-black/80">
        We think you will love these! Shop your favourites and add them to your collection.
      </p>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="item in items"
          :key="item.id"
          class="rounded-2xl bg-[#cfcfcf] p-4"
        >
          <div class="rounded-2xl overflow-hidden bg-[#9a9a9a]">
            <img :src="item.thumbnail" :alt="item.title" class="h-52 w-full object-cover" />
          </div>

          <ul class="mt-3 list-disc pl-4 text-sm text-black min-h-[88px]">
            <li>{{ item.title }}</li>
            <li v-for="(f, i) in item.features" :key="i">{{ f }}</li>
          </ul>

          <p class="mt-3 text-black">{{ item.priceLabel }}</p>
          <div class="text-black">★★★★☆</div>
        </article>
      </div>

      <div class="mt-10 flex justify-center">
        <button class="rounded-full border-2 border-black px-12 py-3 text-lg font-semibold">
          See More ...
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface UiItem {
  id: number;
  title: string;
  thumbnail: string;
  features: string[];
  priceLabel: string;
}

const items: UiItem[] = [
  {
    id: 1,
    title: 'Blue Topaz Cocktail Ring',
    thumbnail: 'https://picsum.photos/seed/ring/500/500',
    features: ['Nickel free 925 Sterling Silver'],
    priceLabel: 'LKR. 40000'
  },
  {
    id: 2,
    title: 'Heart shape blue Sapphire',
    thumbnail: 'https://picsum.photos/seed/sapphire/500/500',
    features: ['Heated', '1.15ct weight', 'Top eye clean'],
    priceLabel: 'LKR. 60000'
  },
  {
    id: 3,
    title: 'Garnet Deer Antler Necklace',
    thumbnail: 'https://picsum.photos/seed/necklace/500/500',
    features: ['1ct Red garnet', 'Nickel free 925 Sterling Silver'],
    priceLabel: 'Price tag'
  },
  {
    id: 4,
    title: 'paragraph',
    thumbnail: 'https://picsum.photos/seed/item4/500/500',
    features: [],
    priceLabel: 'Price tag'
  }
];
</script>