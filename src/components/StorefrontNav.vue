<template>
  <header class="store-nav">
    <RouterLink class="brand" to="/" aria-label="Evoryn home">
      <span class="brand-mark">E</span><span>EVORYN<small>CEYLON · SINCE 1998</small></span>
    </RouterLink>
    <nav aria-label="Store navigation">
      <RouterLink to="/shop">The collection</RouterLink>
      <a href="/#craftsmanship">Our story</a>
    </nav>
    <div class="nav-actions">
      <RouterLink to="/shop" class="nav-shop">Explore pieces <span>↗</span></RouterLink>
      <RouterLink to="/admin/login" class="admin-link">Admin</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.store-nav{height:82px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(20px,6vw,88px);border-bottom:1px solid rgba(214,181,111,.19);background:#10100f;color:#f5f0e5;position:relative;z-index:2}.brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none;font:500 16px/1 Georgia,serif;letter-spacing:.18em}.brand-mark{width:38px;height:38px;border:1px solid #c7a35f;color:#d6b56f;border-radius:50%;display:grid;place-items:center;font-size:24px;letter-spacing:0}.brand small{display:block;font:8px/1.4 Arial,sans-serif;letter-spacing:.21em;color:#a9a192;margin-top:7px}.store-nav nav,.nav-actions{display:flex;align-items:center;gap:30px}.store-nav nav a,.admin-link{color:#c7c0b2;text-decoration:none;text-transform:uppercase;letter-spacing:.14em;font:10px Arial,sans-serif}.store-nav nav a:hover,.admin-link:hover{color:#e4c782}.nav-shop{color:#10100f;background:#d6b56f;text-decoration:none;padding:12px 18px;font:10px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}.nav-shop span{margin-left:10px}@media(max-width:740px){.store-nav{height:72px;padding:0 17px}.store-nav nav{display:none}.nav-actions{gap:14px}.nav-shop{padding:11px 12px;font-size:9px}.admin-link{font-size:9px}.brand{font-size:14px}}
</style>
