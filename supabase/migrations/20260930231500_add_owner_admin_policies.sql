-- Nellai Vishnu Snacks Admin V1 owner policies.
-- Apply after the catalogue migration. The owner Auth user is the only account
-- permitted to manage products and product images in this first admin pass.

alter table public.products enable row level security;

-- RLS policies filter rows, but PostgreSQL table privileges are also required.
-- These grants allow authenticated sessions to reach the policy checks; the
-- owner-only policy below still restricts which authenticated user may write.
grant select, insert, update, delete on table public.products to authenticated;

drop policy if exists "Owner can manage products" on public.products;
create policy "Owner can manage products"
  on public.products for all
  to authenticated
  using ((select auth.uid()) = '7d9bbfcb-1f60-4415-9a04-221ce008aae7'::uuid)
  with check ((select auth.uid()) = '7d9bbfcb-1f60-4415-9a04-221ce008aae7'::uuid);

drop policy if exists "Owner can manage product images" on storage.objects;
create policy "Owner can manage product images"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'product-images'
    and (select auth.uid()) = '7d9bbfcb-1f60-4415-9a04-221ce008aae7'::uuid
  )
  with check (
    bucket_id = 'product-images'
    and (select auth.uid()) = '7d9bbfcb-1f60-4415-9a04-221ce008aae7'::uuid
  );

-- The existing public SELECT policies remain unchanged. There are no public
-- INSERT, UPDATE, or DELETE policies for products or storage objects.
