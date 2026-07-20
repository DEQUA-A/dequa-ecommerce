# فروشگاه من | MyShop

A professional Persian RTL e-commerce platform built with Next.js 16, Prisma, and TypeScript.

---

## Features

### Customer
- **Homepage** — Hero section, featured products, category cards, brand bar, promotional banners
- **Product Browsing** — Product grid with search, category/brand/price filters, pagination
- **Product Details** — Image gallery, stock status, discount display, related products
- **Shopping Cart** — Zustand + localStorage, persistent cart, qty controls, real-time badge
- **Checkout** — Shipping form, order summary, order creation with stock deduction
- **User Account** — Profile editing, password change, order history with status tracking
- **Authentication** — Login/register with NextAuth v5, bcrypt hashing, role-based access

### Admin
- **Dashboard** — Stats cards (revenue, orders, products, users), recent orders, new users
- **Analytics** — Interactive sales charts (daily/weekly/monthly) with Recharts
- **Product Management** — Full CRUD with search, category/brand filters, image upload
- **Category Management** — Inline CRUD with product count
- **Brand Management** — Inline CRUD with product count
- **Order Management** — Order list with inline status changes (PENDING → CANCELLED)
- **User Management** — Search, role toggles (USER/ADMIN), active status
- **Discount Codes** — Full CRUD with enable/disable toggle, expiration dates

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS v4, CSS Variables |
| **Font** | IranSansX (FaNum) — Persian & Arabic numeral support |
| **Database** | SQLite via Prisma 7 + LibSQL adapter |
| **Auth** | NextAuth v5 (Credentials, JWT) |
| **State** | Zustand 5 (cart persistence with localStorage) |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Middleware** | Next.js 16 Proxy (route protection) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd ecommerce
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and update:

```bash
cp .env.example .env.local
```

Key variables:
- `NEXTAUTH_SECRET` — Secret for JWT encryption (required)
- `NEXTAUTH_URL` — Application URL (default: http://localhost:3000)
- `NEXT_PUBLIC_SITE_URL` — Public site URL for SEO metadata

### Database Setup

```bash
# Run migrations
npm run prisma:migrate

# Seed sample data
npm run prisma:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shop.com | 123456 |
| **User** | user@shop.com | 123456 |

## Seed Data

The seed script creates:
- 2 users (1 admin + 1 regular)
- 4 categories (الکترونیک, مد و پوشاک, خانه و آشپزخانه, ورزش و سفر)
- 4 brands (سامسونگ, اپل, نایکی, سونی)
- 8 products with images and discounts
- 1 discount code (WELCOME10 — 10% off)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login and register
│   ├── (shop)/           # Homepage, products, cart, checkout
│   ├── account/          # Profile, orders, order detail
│   └── admin/            # Dashboard, analytics, management pages
├── components/
│   ├── account/          # Profile form, password change
│   ├── admin/            # Dashboard widgets, charts, CRUD tables
│   ├── auth/             # Login form, register form, user menu
│   ├── cart/             # Cart items, badge, summary, add-to-cart
│   ├── checkout/         # Checkout form
│   ├── layout/           # Header, footer, shop layout
│   └── products/         # Product card, filters
├── lib/
│   ├── actions/          # Server actions (auth, products, orders, admin)
│   ├── store/            # Zustand cart store
│   ├── auth.ts           # NextAuth configuration
│   └── db.ts             # Prisma client singleton
└── generated/prisma/     # Generated Prisma client
```

## API Routes

All mutations use **Next.js Server Actions** (no REST API):

| Action | File | Purpose |
|--------|------|---------|
| `register` | `src/lib/actions/auth.ts` | User registration |
| `createProduct` | `src/lib/actions/products.ts` | Admin create product |
| `updateProduct` | `src/lib/actions/products.ts` | Admin update product |
| `deleteProduct` | `src/lib/actions/products.ts` | Admin delete product |
| `createOrder` | `src/lib/actions/orders.ts` | Create order from cart |
| `updateProfile` | `src/lib/actions/profile.ts` | Edit user profile |
| `changePassword` | `src/lib/actions/profile.ts` | Change password |
| `updateOrderStatus` | `src/lib/actions/admin.ts` | Admin update order status |
| `updateUserRole` | `src/lib/actions/admin.ts` | Admin change user role |
| `createDiscount` | `src/lib/actions/admin.ts` | Admin create discount |
| `updateDiscount` | `src/lib/actions/admin.ts` | Admin edit discount |
| `deleteDiscount` | `src/lib/actions/admin.ts` | Admin delete discount |
| `toggleDiscount` | `src/lib/actions/admin.ts` | Admin toggle discount active |

## Security

- **Authentication**: NextAuth v5 with JWT strategy, bcrypt password hashing
- **Route Protection**: Proxy middleware blocks `/admin/*` (ADMIN role) and `/account/*` (authenticated)
- **Server Actions**: All mutations check session authorization server-side
- **Validation**: Zod schemas on all server action inputs
- **SQL Injection**: Prisma parameterized queries throughout
- **XSS**: React's default escaping, no `dangerouslySetInnerHTML`
- **CSRF**: Next.js Server Actions are inherently CSRF-protected

## Performance

- **Server Components** used where possible (product lists, order history, admin dashboard)
- **Client Components** only where interactivity is needed (cart, forms, charts, filters)
- **Zustand** with localStorage for cart persistence (no server round-trips)
- **Prisma** eager-loading with `include` to avoid N+1 queries
- **Image lazy loading** on product cards
- **Static generation** for most pages with dynamic segments where needed

## Future Improvements

- [ ] Payment gateway integration (Zarinpal, etc.)
- [ ] Email notifications on order status change
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced product search (Elasticsearch/Meilisearch)
- [ ] Multi-vendor marketplace
- [ ] PWA support
- [ ] Unit and E2E testing
- [ ] CI/CD pipeline
- [ ] Docker deployment
