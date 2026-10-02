-- Nellai Vishnu Snacks public catalogue schema and seed.
-- `available = true` means the owner has published the row to the public catalogue;
-- it is not a stock quantity. No stock counts are stored in this stage.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_english text not null,
  slug text not null unique,
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on update cascade on delete restrict,
  name text not null,
  slug text not null unique,
  price numeric(10, 2) not null check (price >= 0),
  pack_size text not null,
  image_path text,
  description text,
  available boolean not null default true,
  show_on_home boolean not null default false,
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_show_on_home_idx on public.products(show_on_home);
create index if not exists products_available_idx on public.products(available);
create index if not exists products_sort_order_idx on public.products(sort_order);
create index if not exists categories_sort_order_idx on public.categories(sort_order);

alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read available products" on public.products;
create policy "Public can read available products"
  on public.products for select
  to anon, authenticated
  using (available = true);

-- There are intentionally no public insert, update, or delete policies.
-- Future owner/admin access belongs to the next stage.

insert into public.categories (id, name, name_english, slug, sort_order)
values
  ('10000000-0000-0000-0000-000000000001', 'சுவையான காரவகைகள் & நொறுக்குத்தீனிகள்', 'Savouries', 'savouries', 1),
  ('10000000-0000-0000-0000-000000000002', 'பாரம்பரிய இனிப்புகள் & கடலை மிட்டாய்', 'Traditional Sweets', 'traditional-sweets', 2),
  ('10000000-0000-0000-0000-000000000003', 'தூத்துக்குடி ஸ்பெஷல்', 'Special Delicacies', 'special-delicacies', 3)
on conflict (slug) do update set
  name = excluded.name,
  name_english = excluded.name_english,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.products (id, category_id, name, slug, price, pack_size, image_path, description, available, show_on_home, sort_order)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'மிக்சர்', 'mixer', 80, '250g', null, null, true, true, 1),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'முறுக்கு', 'murukku', 80, '250g', null, null, true, false, 2),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'காரச்சேவு', 'karasevu', 80, '250g', null, null, true, true, 3),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'உருளைக்கிழங்கு சிப்ஸ்', 'potato-chips', 80, '250g', null, null, true, false, 4),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'திருநெல்வேலி அல்வா', 'tirunelveli-halwa', 160, '250g', null, null, true, false, 5),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'ஸ்ரீவில்லிபுத்தூர் பால்கோவா', 'srivilliputhur-palkova', 100, '250g', null, null, true, false, 6),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'கடலை மிட்டாய்', 'kadalai-mittai', 80, '250g', null, null, true, false, 7),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'கடலை உருண்டை', 'kadalai-urundai', 80, '250g', null, null, true, false, 8),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 'தூத்துக்குடி ஸ்பெஷல் மேக்கரூன்', 'thoothukudi-special-macaroon', 100, '100g', null, null, true, false, 9),
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', 'தூத்துக்குடி ஸ்பெஷல் நெய் குச்சி மிட்டாய்', 'thoothukudi-special-ghee-kuchi-mittai', 100, '100g', null, null, true, false, 10)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  price = excluded.price,
  pack_size = excluded.pack_size,
  image_path = excluded.image_path,
  description = excluded.description,
  available = excluded.available,
  show_on_home = excluded.show_on_home,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Future product images may be publicly read, but anonymous uploads/updates/deletes
-- are intentionally not allowed. The bucket remains empty until authentic photos arrive.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

-- The public bucket allows object retrieval by URL without a broad storage.objects
-- SELECT/list policy. No storage insert, update, or delete policies are created
-- for public users.
