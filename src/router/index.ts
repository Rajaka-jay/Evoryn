import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ShopView from '@/views/ShopView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import AdminLoginView from '@/views/AdminLoginView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';
import { getAdminUser, isAdmin } from '@/services/admin-auth';
import { supabase } from '@/lib/supabase';

const router = createRouter({
  // Hash routing lets GitHub Pages serve deep links without a custom 404 rewrite.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/shop', name: 'shop', component: ShopView },
    { path: '/products/:slug', name: 'product', component: ProductDetailView },
    { path: '/admin/login', name: 'admin-login', component: AdminLoginView, meta: { guestOnly: true } },
    { path: '/admin', name: 'admin', component: AdminDashboardView, meta: { requiresAdmin: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0, behavior: 'smooth' }; }
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAdmin) {
    const user = await getAdminUser();
    if (!user) return { name: 'admin-login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && supabase) {
    const { data } = await supabase.auth.getUser();
    if (isAdmin(data.user)) return { name: 'admin' };
  }
  return true;
});

export default router;
