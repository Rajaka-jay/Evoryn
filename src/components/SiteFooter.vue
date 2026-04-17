<template>
  <footer class="bg-[#d9d9d9] border-t border-black/10 mt-0">
    <div class="mx-auto w-[92%] max-w-7xl py-12">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div>
          <h3 class="text-5xl font-semibold tracking-wide">EVORYN.LK</h3>
          <ul class="mt-5 space-y-2 text-sm">
            <li>📍 No. 314, Hapugala, Galle</li>
            <li>📞 +94 702154334</li>
            <li>📧 care@evoryn.lk</li>
          </ul>

          <p class="mt-5 text-sm">WHAT’SAPP Us..</p>
          <div class="mt-2 flex gap-3 text-xl">
            <span>📘</span><span>▶️</span><span>📷</span>
          </div>
        </div>

        <!-- Shop -->
        <div>
          <h4 class="text-xl font-semibold">SHOP</h4>
          <ul class="mt-4 space-y-2 text-sm">
            <li>• HOME</li>
            <li>• F.A.Q</li>
            <li>• ABOUT US</li>
            <li>• CORPORATE SALES</li>
            <li>• CAREERS</li>
            <li>• MY ACCOUNT</li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-xl font-semibold">SUPPORT</h4>
          <ul class="mt-4 space-y-2 text-sm">
            <li>• CONTACT US</li>
            <li>• AFTER SALES SERVICE</li>
            <li>• TERMS OF SERVICE</li>
            <li>• PRIVACY POLICY</li>
            <li>• RETURN POLICY</li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-xl font-semibold">SUBSCRIBE TO OUR NEWSLETTER</h4>
          <p class="mt-2 text-sm">STAY IN THE LOOP!</p>
          <p class="mt-3 text-sm">JOIN OUR NEWSLETTER FOR EXCLUSIVE UPDATES AND OFFERS.</p>

          <form class="mt-4 flex overflow-hidden border border-black" @submit.prevent>
            <div class="flex items-center px-3">✉️</div>
            <input
              type="email"
              placeholder="Email"
              class="w-full bg-transparent px-2 py-2 text-sm outline-none"
              required
            />
            <button type="submit" class="border-l border-black px-4 hover:bg-black hover:text-white transition">
              →
            </button>
          </form>
        </div>
      </div>

      <p class="mt-12 text-center text-xs">© 2026 EVORYN.LK, All Rights Reserved.</p>
    </div>
  </footer>
</template>