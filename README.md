# Tenon10 Bakery App

A production-grade online bakery application built with Next.js 15, 
TypeScript, Tailwind CSS, and Supabase.

**Live Demo:** https://bakery-app-steel-chi.vercel.app/
**Admin Login:** available on request

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL, Auth, RLS, Storage)
- Zustand (cart state)
- React Hook Form + Zod (form validation)

## Features

- Product catalog fetched server-side from Supabase
- Shopping cart with persistent state across page reloads
- Checkout with atomic order creation via PostgreSQL RPC function
- Price snapshotting - order items store price at time of purchase
- Role-based admin panel (admin role verified server-side)
- Full product CRUD for admin users
- Order management dashboard
- Row Level Security enforced at database level

## Architecture Decisions

**Atomic Checkout via RPC** - Instead of two sequential client-side 
inserts, checkout calls a single PostgreSQL function `create_order` 
that wraps both the orders and order_items inserts in one transaction. 
If either insert fails, the entire operation rolls back.

**Price Snapshotting** - order_items stores price_at_time at checkout. 
Product prices can change without corrupting historical order data.

**Server-side RBAC** - The /admin route group is protected by a 
Server Component layout that calls supabase.auth.getUser() and 
queries the profiles table for role = 'admin' before rendering 
anything. Unauthorized users are redirected at the server level.

**Zustand over Context** - Cart state uses Zustand with localStorage 
persistence. useMounted hook prevents React hydration mismatch when 
reading persisted state.

**RLS over API-level auth** - All security policies are enforced at 
the Supabase database level, not just in the application layer.

## Local Setup

1. Clone the repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and add your Supabase keys
4. Run the SQL schema from `/supabase/schema.sql` in your Supabase project
5. Run `npm run dev`
