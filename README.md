# Nellai Vishnu Snacks

A premium React + Vite + Tailwind website for Nellai Vishnu Snacks. Visitors browse the Supabase-backed public catalogue and send an order directly on WhatsApp. The protected Admin V1 manages catalogue products; there is no payment gateway, customer account system, checkout, or order database.

## Getting started

```bash
npm install
npm run dev
```

Build for production with:

```bash
npm run build
```

## Public routes

- `/` — home, brand-first opening, nostalgia, catalogue, story, and WhatsApp CTA
- `/products` — product catalogue and ordering cards
- `/categories` — printed-catalogue category guide
- `/about` — neutral story placeholder
- `/contact` — neutral contact and WhatsApp guidance
- `/privacy` — neutral privacy draft requiring owner/legal confirmation
- `/terms` — neutral terms draft requiring owner/legal confirmation
- `/refunds` — neutral refund draft requiring owner/legal confirmation
- `/products/category/:slug` — category-filtered catalogue
- unknown paths — branded 404 page

The site uses a lightweight History API router and a shared Supabase data-access layer. The public frontend does not use analytics, advertising scripts, non-essential cookies, customer forms, payments, checkout, or an order database. The supplied phone/WhatsApp number and email are used exactly as provided.

## Pass 5 motion system

The motion pass is intentionally lightweight and uses CSS, IntersectionObserver, and a throttled `requestAnimationFrame` scroll-progress hook:

- centralized fast, medium, slow, and physical easing tokens
- staged hero composition and restrained hero-to-paper transition
- paper movement and controlled scroll-linked storytelling
- editorial section reveals and catalogue assembly
- desktop-only product crop/elevation feedback
- tactile CTA and keyline interactions
- polished mobile navigation and order-tray transitions
- reduced-motion support that keeps all content and interactions usable

No GSAP, Framer Motion, Three.js, WebGL, canvas effects, video backgrounds, particle systems, or continuous animation loops are used.

## Ordering flow

Browse → tap **Add to order** → open the order slip → adjust quantities or remove items → tap **Order on WhatsApp**. Cart state is local to the current page session and is not persisted.

## Structure

```text
src/
├── lib/          Supabase client, catalogue, and Admin V1 data access
├── hooks/        useReveal, useScrollProgress, useRouter
├── pages/        Public pages and protected Admin V1 pages
├── utils/        WhatsApp link builder
└── components/
    ├── layout/   Navbar, Footer
    ├── sections/ Hero, Nostalgia, FeaturedProducts, Categories,
    │             AboutStory, LocationContact
    └── ui/       ProductCard, PhotoSlot, OrderTray, TornEdge

supabase/
├── migrations/   catalogue schema, seed data, RLS, and storage policy
└── README.md     setup and environment instructions
```

## Before launch

Before launch, configure Supabase using `.env.example` and apply the migration. Then replace only with confirmed owner information:

- product photography and availability controls
- address, hours, and map details
- the shop's own story and confirmed brand wording


## Admin V1 setup

Admin V1 uses Supabase Auth email/password login and a single-owner authorization policy. The protected routes are:

- `/admin/login` — owner login; no registration UI
- `/admin` — protected dashboard and product list
- `/admin/products/new` — protected add-product form
- `/admin/products/:id/edit` — protected edit-product form

The owner Auth user is allowlisted by UUID in `supabase/migrations/20260930231500_add_owner_admin_policies.sql`. Apply that migration after the owner Auth account exists. It grants product and `product-images` management only to that UUID; public catalogue reads remain unchanged and public writes remain blocked.

The frontend never uses a service-role key. Product images are validated as JPG, PNG, WebP, or GIF files up to 5 MB and are uploaded only after an explicit owner action. Admin V1 supports explicit permanent deletion of the selected product, with database-first deletion and cleanup of only its own image path.


### Admin image uploads

Admin product images are validated at a maximum original size of 5 MB, decoded in the browser, resized without upscaling to a maximum 1600px longest side, converted to WebP, and iteratively reduced until the output is at most 250 KB. Only the compressed WebP Blob is sent to the existing `product-images` bucket. The product image path is written only after the upload succeeds; if path linking fails, the newly uploaded object is removed. Public and non-owner writes remain blocked by the existing Storage policies.
