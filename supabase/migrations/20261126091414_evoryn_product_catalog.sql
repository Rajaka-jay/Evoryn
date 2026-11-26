create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 160),
  description text not null default '' check (char_length(description) <= 4000),
  category text not null check (category in ('gemstone', 'jewellery')),
  price_lkr numeric(12,2) not null check (price_lkr >= 0),
  price_usd numeric(12,2) not null check (price_usd >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_url text not null check (image_url ~ '^https://'),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_created_idx
  on public.products (is_published, created_at desc);

create or replace function public.set_products_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_products_updated_at();

alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

create policy "Published products are visible to everyone"
  on public.products for select to anon, authenticated
  using (is_published or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can create products"
  on public.products for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update products"
  on public.products for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete products"
  on public.products for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
