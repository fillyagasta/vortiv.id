-- Vortiv storefront: products/categories + public image storage.
-- Run in Supabase SQL Editor. Admin access requires app_metadata.role = 'admin'.
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

insert into public.categories(name, slug)
values ('T-Shirts','t-shirts'), ('Hoodies','hoodies')
on conflict (slug) do nothing;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  price numeric(12,2) not null check (price >= 0),
  category text not null,
  colors text[] not null default '{}',
  image text not null default '',
  description text not null default '',
  tag text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_category_idx on public.products(active, category);
create index if not exists products_created_at_idx on public.products(created_at desc);

grant select on public.products, public.categories to anon, authenticated;
grant insert, update, delete on public.products, public.categories to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.categories enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products" on public.products
for select using (active = true or (auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated
using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories" on public.categories
for select using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories
for all to authenticated
using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects
for select using (bucket_id = 'product-images');

drop policy if exists "Admin upload product images" on storage.objects;
create policy "Admin upload product images" on storage.objects
for insert to authenticated
with check (bucket_id = 'product-images' and (auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admin update product images" on storage.objects;
create policy "Admin update product images" on storage.objects
for update to authenticated
using (bucket_id = 'product-images' and (auth.jwt()->'app_metadata'->>'role') = 'admin')
with check (bucket_id = 'product-images' and (auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admin delete product images" on storage.objects;
create policy "Admin delete product images" on storage.objects
for delete to authenticated
using (bucket_id = 'product-images' and (auth.jwt()->'app_metadata'->>'role') = 'admin');
