# Supabase setup

This directory contains the reproducible public catalogue schema, seed data, Row Level Security policies, and the future product-image bucket configuration.

## Apply the migration

From a Supabase project with the Supabase CLI linked:

```bash
supabase db push
```

The migration creates `categories` and `products`, seeds the 3 categories and 10 products, enables RLS, creates read-only public table policies, and creates the public `product-images` bucket. Public image URLs are retrievable from the public bucket without a broad `storage.objects` SELECT/list policy. It does not create authentication, admin access, or public write policies; apply the owner Admin V1 migration separately.

## Frontend environment

Copy `.env.example` to `.env.local` and fill in values from the Supabase project settings:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only the public anon key belongs in the browser. Never place a service-role key in `.env.local`, source files, migrations, or the deployed frontend.

If the variables are missing, the frontend shows a safe configuration message instead of attempting a request.
