# Crochet E-Commerce Platform — Complete Master Plan

A full from-scratch plan covering business modules, admin control structure, product/catalog management, customer experience, mobile + desktop architecture, performance strategy, data model (conceptual), security, and phased rollout. No code — pure planning document.

---

## 1. Platform Vision

A premium, Etsy-style marketplace experience but single-brand (your own crochet products), covering: bouquets, flowers, keychains, plushies, home decor, gift boxes, and made-to-order customized items. Two faces:

- **Customer Website** — browsing, buying, tracking, returning.
- **Admin Panel** — running the business: products, orders, inventory, marketing, content, people.

Core principle for the whole plan: **handmade products need different operational rules than mass-manufactured ones** — processing time, made-to-order stock, customization, limited quantities. The plan below is built around that, not a generic e-commerce template.

---

## 2. Tech Stack (Decided, Not Just Listed)

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend framework | Next.js (App Router) + TypeScript | SSR/SSG/ISR flexibility, SEO-critical for product discovery |
| Styling | Tailwind CSS | Fast to build responsive UI, small bundle with purge |
| State management | Zustand (cart/UI state) + React Query (server state/caching) | Lighter than Redux Toolkit for this scale |
| Forms | React Hook Form + Zod validation | Type-safe validation across checkout/admin forms |
| Animation | Framer Motion (selectively — see performance plan) | |
| Backend | Node.js + Express (or NestJS if team prefers structure) | REST API, modular |
| Database | PostgreSQL | Relational integrity matters here (orders, inventory, payments) — more reliable than MongoDB for transactional commerce |
| Cache/session | Redis | Cart, session, hot query caching |
| Search | Meilisearch (self-hosted) or Algolia (managed) | Product search/filtering at scale |
| File storage | Cloudinary | Image transforms built-in, saves building your own pipeline |
| Payments | Razorpay (primary, India) + Stripe (international) | |
| Shipping | Shiprocket (primary) + Delhivery (fallback/direct) | |
| Email | Resend (transactional) | Modern, reliable deliverability |
| SMS/WhatsApp | MSG91 or Gupshup (India-focused) | |
| Hosting | Vercel (frontend) + Railway or AWS (backend/DB) | |
| Monitoring | Sentry (errors) + Vercel Analytics (Web Vitals) | |
| CI/CD | GitHub Actions → auto-deploy on merge to main | |

---

## 3. Admin Control Structure (Roles & Permissions)

This is the part most plans skip — and it's where real operational pain shows up later. Define roles **before** building the dashboard.

### 3.1 Role Hierarchy

| Role | Who | Access Level |
|---|---|---|
| **Super Admin** | Founder/owner | Full access to everything, including admin user management, financial reports, system settings, role assignment |
| **Admin (Operations)** | Day-to-day manager | Products, orders, inventory, customers, coupons, returns — no access to financial settings, no ability to create other admins |
| **Catalog Manager** | Product/content person | Add/edit products, categories, images, descriptions, SEO fields — no order or payment access |
| **Order Fulfillment Staff** | Packing/shipping team | View orders, update order status, print labels, schedule pickup — cannot edit products or pricing |
| **Customer Support** | Support agent | View orders (read-only), manage return/refund requests, respond to reviews — cannot edit products, cannot issue refunds above a threshold without escalation |
| **Marketing** | Campaigns/content | Coupons, banners, blog/CMS, email campaigns, Instagram feed config — no order/inventory access |
| **Finance/Accountant** | Bookkeeping | Read-only access to orders, payments, refunds, reports/exports — no edit access anywhere |

### 3.2 Permission Design Principles

- **Granular, not binary** — permissions should be assignable per-module (view/create/edit/delete) rather than just "admin vs not admin."
- **Refund approval threshold** — support staff can auto-approve refunds under a configured amount (e.g., ₹500); anything above requires Admin/Super Admin approval. Prevents fraud and accidental large refunds.
- **Audit log on every admin action** — who changed a price, who approved a refund, who edited a product, with timestamp. Non-negotiable for a business handling money and inventory.
- **Two-person rule for sensitive actions** (optional but recommended): bulk inventory deletion, coupon stacking changes, payout settings — require a second admin's confirmation.

### 3.3 Admin Account Lifecycle

- Super Admin invites new admin staff by email → staff sets password → assigned a role.
- Admin accounts can be **suspended** (not deleted) when staff leaves — preserves audit trail of past actions.
- Forced password reset + 2FA requirement for all admin/staff accounts (separate from customer-facing OTP login).
- Session timeout for admin panel shorter than customer site (e.g., 30 min idle logout) — sensitive data exposure risk.

---

## 4. Admin Dashboard Modules (Detailed)

### 4.1 Dashboard Home (Analytics Overview)
- Today/week/month toggle for: revenue, orders placed, orders pending action, low-stock alerts, new customer signups.
- Quick-action shortcuts: "Orders needing packing," "Returns awaiting approval," "Reviews awaiting moderation."
- Visual charts: daily sales trend, top 5 products this week, category performance split.

### 4.2 Product Management
- **Add Product** form sections:
  - Basic info: name, slug (auto-generated, editable), short + full description, category/subcategory, tags, brand (if applicable).
  - Variants: color, size — each variant can have its own price, stock, and image set.
  - Pricing: base price, sale price, discount %, tax class.
  - Media: image gallery (drag-to-reorder), optional video, alt-text per image (SEO + accessibility).
  - Handmade-specific fields: processing days, "made to order" toggle (no stock cap if true), customization options (e.g., "add name," "choose color combo" — free text or dropdown fields customer fills at checkout).
  - Flags: featured, trending, new arrival, bestseller, limited edition (with optional countdown).
  - Shipping: weight, dimensions (for shipping rate calculation), COD eligibility.
  - SEO: meta title, meta description, canonical URL override if needed.
  - Status: Draft / Published / Archived (draft lets catalog team prep listings before going live).
- **Bulk operations**: CSV import/export, bulk price update, bulk category reassignment, bulk publish/unpublish.
- **Product list view**: filter/sort by stock level, status, category; quick-edit price/stock inline without opening full form.

### 4.3 Category Management
- Hierarchical categories (Category → Subcategory), drag-to-reorder for homepage display priority.
- Category-level banner image and description (for SEO landing pages, e.g., "Crochet Flower Bouquets").
- Toggle category visibility (hide seasonal categories off-season instead of deleting).

### 4.4 Order Management
- Order list with filters: status, date range, payment method, COD vs prepaid, customization-required flag.
- Order detail view: customer info, items, customization notes (important — handmade customization instructions need to be clearly visible to fulfillment staff), payment status, shipping status, internal notes field (staff-only, not visible to customer).
- Bulk actions: bulk status update, bulk label generation, bulk export for daily packing list.
- Manual order creation (for phone/Instagram DM orders — common for handmade sellers).
- Order timeline view showing full status history with timestamps and which staff member made each update.

### 4.5 Inventory Management
- Stock level view per product/variant, with low-stock threshold configuration (alert when stock < X).
- Separate handling for **made-to-order** items (no fixed stock, but a "max orders per day" cap to avoid overcommitting handmade capacity — important for a crochet business where one maker can only produce so much).
- Inventory history log: every stock change with reason (order placed, order cancelled, manual adjustment, return restocked).
- Manual stock adjustment with mandatory reason field (prevents silent inventory errors).

### 4.6 Customer Management
- Customer list with order count, total spend, last order date — basic CRM view.
- View individual customer's order history, saved addresses, support tickets.
- Manual customer tagging (e.g., "VIP," "wholesale inquiry") for marketing segmentation.
- Ability to manually adjust a customer's wallet balance (for goodwill credits/refund-to-wallet).

### 4.7 Returns & Refunds Management
- Queue of pending return requests with customer-submitted reason + photos.
- Approve/reject with reason; partial or full refund selection.
- Refund method selection: original payment method vs store wallet.
- Auto-restock toggle (if returned item is resellable, add back to inventory; if damaged, mark as written off).

### 4.8 Coupon & Discount Engine
- Create coupon: type (percentage/flat/free shipping/BOGO), value, usage limit (total + per-customer), minimum order value, applicable categories/products, date validity window.
- Auto-apply campaigns (e.g., "Free shipping over ₹999" with no code needed) vs code-based coupons.
- Coupon performance report: usage count, revenue generated, redemption rate.

### 4.9 Reviews & Ratings Moderation
- Queue of pending reviews (especially photo reviews) for approval before going live — prevents spam/inappropriate content.
- Ability to respond publicly to a review as "Store" (builds trust).
- Flag/report system for suspicious reviews.

### 4.10 Shipping Management
- View shipment status synced from Shiprocket/Delhivery.
- Manual courier override per order (in case of serviceability issues with default courier).
- Shipping rate configuration by weight/zone (for calculated shipping vs flat-rate decision).
- Pickup scheduling dashboard.

### 4.11 CMS / Content Management
- Homepage banner/slider management (upload, reorder, schedule start/end dates for seasonal banners).
- Blog management (for SEO content — crochet care guides, gift ideas, etc.).
- FAQ management.
- Footer links and static pages (About, Privacy Policy, Terms, Shipping Policy, Return Policy) — all editable without code deployment.
- Instagram feed configuration (which account/hashtag to pull from).

### 4.12 Reports & Exports
- Sales report (date range, category, product-level breakdown) exportable to CSV.
- Inventory valuation report.
- Customer acquisition report (which channel/coupon drove signups, if UTM tracking is implemented).
- Tax/GST report for accounting (India-specific — important to plan for from the start).

### 4.13 Settings
- Store details (name, logo, contact info, business address, GST number).
- Payment gateway keys (Razorpay/Stripe credentials) — restricted to Super Admin only.
- Shipping zone/rate configuration.
- Notification template editor (email/SMS/WhatsApp message templates per event).
- Admin user management (Super Admin only) — invite, assign role, suspend.
- Tax configuration.

---

## 5. Customer-Facing Site Plan

### 5.1 Homepage
Hero banner → Featured collections → New arrivals → Bestsellers → Shop by category → Personalized gifts section → Limited edition (with urgency element if applicable) → Testimonials → Instagram feed → Newsletter signup → FAQ → Footer.

### 5.2 Product Discovery
- Category/subcategory browsing with filters: price range, color, material, size, customizable-only, in-stock-only.
- Search with autocomplete/typo-tolerance (via Meilisearch/Algolia).
- Sort: relevance, price, newest, bestselling.

### 5.3 Product Detail Page
- Gallery with zoom, variant selector, quantity, Add to Cart / Buy Now, wishlist, share.
- Pincode-based delivery estimate (processing days + transit days clearly separated — critical for handmade trust-building, e.g., "2 days to make + 4 days to ship").
- Customization input fields (if product is customizable) — text input, color picker, or dropdown depending on product config.
- Gift wrap toggle + gift message field.
- Reviews with photos, frequently-bought-together, related products.

### 5.4 Cart & Checkout
- Guest cart (local storage) merges into account cart on login.
- Checkout steps: Address → Shipping method → Coupon → Payment → Review → Place order.
- Address validation against pincode serviceability before allowing checkout to proceed.

### 5.5 Customer Account
- Profile, address book, order history with tracking, wishlist, reviews given, saved cards (tokenized, not stored raw), wallet balance, available coupons, return requests.

### 5.6 Authentication
- Email OTP (primary, low-friction for India), Google login, Facebook login.
- Forgot/reset password, email verification, session management with refresh tokens.

---

## 6. Mobile + Desktop Structure (Summary — see prior plan for full detail)

- Single responsive codebase, mobile-first Tailwind breakpoints, CSS-driven layout switching (not separate JS-rendered components per device).
- Mobile: bottom nav, sticky add-to-cart, swipeable gallery, bottom-sheet filters.
- Desktop: top nav with mega-menu, persistent sidebar filters, hover interactions.
- Admin dashboard is desktop-first (staff work on desktop/laptop) but should remain usable on tablet for warehouse/packing staff checking orders on the floor.

---

## 7. Performance Plan (Summary — see prior plan for full detail)

- Rendering: SSG/ISR for home, category, product pages (SEO + speed); CSR for cart, checkout, account, admin.
- Image pipeline: Cloudinary auto-format/quality, responsive srcset, lazy-load below fold.
- Caching: CDN edge cache → Redis → DB, with invalidation on product/order updates.
- Core Web Vitals targets: LCP < 2.0s, INP < 200ms, CLS < 0.1.
- Code-split admin dashboard entirely separate from customer bundle.

---

## 8. Data Model — Conceptual (Entities & Relationships, No Schema Code)

Core entities and how they relate:

- **User** — has one Role (Customer/Admin variants); has many Addresses, Orders, Reviews, Wishlist items, Wallet transactions.
- **Product** — belongs to Category; has many Variants, Images, Reviews; has many OrderItems (through orders).
- **Variant** — belongs to Product; has its own price/stock/SKU.
- **Category** — has many Products; can have a parent Category (self-referencing for subcategories).
- **Order** — belongs to User; has many OrderItems; has one Payment record; has one Shipment record; has a status history log.
- **OrderItem** — belongs to Order and Variant; stores customization data (free text/selected options) as a flexible field since customization varies per product.
- **Payment** — belongs to Order; tracks gateway, transaction ID, status, amount, refund records.
- **Shipment** — belongs to Order; tracks AWB number, courier, status history (synced from courier webhook).
- **Coupon** — many-to-many with Users (usage tracking) and optionally restricted to specific Categories/Products.
- **Review** — belongs to User and Product; has moderation status.
- **ReturnRequest** — belongs to Order/OrderItem; has reason, images, approval status, refund link.
- **InventoryLog** — belongs to Variant; records every stock change with reason and reference (order/return/manual).
- **AdminAuditLog** — belongs to Admin User; records action type, target entity, before/after values, timestamp.

This structure keeps customization (the trickiest part of a handmade-goods schema) as flexible data on the OrderItem rather than forcing every product into rigid fixed-variant rows.

---

## 9. Security Plan

- JWT access tokens (short-lived) + refresh tokens (httpOnly secure cookies) — separate token scope/secret for customer vs admin sessions.
- Role-based authorization checked at the API layer, not just hidden in UI (critical — UI hiding a button is not security).
- Password hashing (bcrypt/argon2), rate limiting on login/OTP endpoints, CAPTCHA after repeated failures.
- Input validation (Zod schemas) on every API endpoint, parameterized queries (ORM-level) to prevent SQL injection.
- CSRF protection on state-changing requests, XSS sanitization on any user-generated content (reviews, customization text).
- PCI compliance approach: never store raw card numbers — rely on Razorpay/Stripe tokenization entirely.
- Admin panel: 2FA required, audit logging on all writes, shorter session timeout, IP-based alerting for unusual login locations (optional, phase 2).

---

## 10. SEO, GEO, AEO, Search Console & Sitemap Strategy

This was missing from the original scope — worth its own section since organic discovery is likely your cheapest customer acquisition channel for a handmade-goods store.

### 10.1 Traditional SEO (Google/Bing ranking)

- **On-page**: unique meta title/description per product and category (already in the Add Product form, Section 4.2), keyword-rich slugs (`/products/crochet-rose-bouquet-red`, not `/products/12345`), descriptive image alt-text.
- **Technical SEO**: clean URL structure, canonical tags (avoid duplicate URLs from filter/sort query params), 301 redirects when products are renamed/discontinued, proper heading hierarchy (one H1 per page).
- **Structured data (Schema.org markup)** — critical for e-commerce, feeds both Google rich results and AI answer engines:
  - `Product` schema (price, availability, rating) on every product page.
  - `BreadcrumbList` schema for category navigation.
  - `Organization`/`LocalBusiness` schema on homepage/about.
  - `FAQPage` schema on FAQ section and product FAQs.
  - `Review`/`AggregateRating` schema tied to your review system.
- **Content/SEO pages**: category description blocks (e.g., "Crochet Flower Bouquets" landing page with real descriptive content, not just a product grid), blog (already in CMS module) targeting gift-occasion and care-guide keywords ("crochet bouquet vs real flowers," "how to care for crochet plushies").
- **Core Web Vitals** — already covered in Section 7; speed is a direct ranking factor, not just a UX nicety.

### 10.2 AEO — Answer Engine Optimization

Targets voice assistants and "answer box" style results (Google's featured snippets, Siri, Alexa).

- Structure content so a single paragraph directly answers a likely question — e.g., a clear 1–2 sentence answer near the top of an FAQ entry like "How long does a custom crochet bouquet take to make?" before going into detail.
- Use the `FAQPage` schema (above) consistently — this is what most answer engines parse.
- Favor clear, declarative sentences over marketing fluff in the first paragraph of product descriptions and blog posts — answer engines extract literal text, not implied meaning.
- Table/list formatting for comparable data (size charts, material info, care instructions) — easier for both snippets and AI parsers to extract correctly.

### 10.3 GEO — Generative Engine Optimization

Newer discipline: optimizing for AI chat tools (ChatGPT, Perplexity, Google AI Overviews, Claude) that synthesize answers rather than just linking out.

- **Be quotable and specific**: AI tools tend to surface sources with concrete facts (materials used, processing times, price ranges, return policy specifics) rather than vague brand copy.
- **`llms.txt` file** (emerging standard, place at site root) — a plain-language summary of what your site sells and key pages, written for AI crawlers rather than humans. Low effort, increasingly checked by AI crawlers.
- **Consistent factual information across the web** — AI engines cross-reference. Keep your business name, return policy, shipping times, and pricing consistent across your site, Google Business Profile, Instagram bio, and any marketplace listings.
- **Author/expertise signals**: an "About the maker" page with real, specific detail (years crocheting, process description) — generative engines weight perceived expertise/authenticity, especially relevant for a handmade-goods brand competing against mass manufacturers.
- **Allow AI crawlers** in `robots.txt` deliberately (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) unless you have a specific reason to block them — blocking them means you simply don't show up in AI-generated answers at all.

### 10.4 Google Search Console (and Bing Webmaster Tools)

- **Setup**: verify domain ownership (DNS TXT record method, survives site migrations better than HTML file method), connect at both `www` and non-`www` if not auto-redirected.
- **Submit sitemap** (see 10.5) directly in Search Console for faster discovery.
- **Monitor regularly**:
  - Coverage report — catch pages accidentally marked `noindex` or blocked by robots.txt.
  - Core Web Vitals report — field data (real user data), separate from lab data in Lighthouse.
  - Performance report — track which queries bring traffic, click-through rate, average position; use this to refine product titles/descriptions over time.
  - Mobile usability report — flag tap-target or viewport issues.
  - Manual actions/security issues — catch penalties or hacking attempts early.
- **Set up Bing Webmaster Tools too** — low effort, captures Bing/Yahoo/DuckDuckGo traffic and some AI tools pull from Bing's index.

### 10.5 Sitemap Strategy

- **Dynamic XML sitemap generation**, not a static hand-built file — must auto-update as products are added/removed/archived.
- **Sitemap index structure** (split by type, not one giant file):
  - `sitemap-products.xml`
  - `sitemap-categories.xml`
  - `sitemap-blog.xml`
  - `sitemap-pages.xml` (static pages: About, FAQ, Policies)
  - `sitemap-images.xml` (image sitemap — meaningful for a visual product site, helps Google Images traffic which is often underrated for handmade/gift products)
  - A root `sitemap-index.xml` referencing all of the above.
- **Exclusions**: cart, checkout, account pages, admin panel, internal search results pages, filtered/sorted URL variants — these should be `noindex` and excluded from the sitemap entirely to avoid wasting crawl budget.
- **`lastmod` accuracy**: update the `lastmod` timestamp only when content actually changes (price/stock changes shouldn't necessarily bump it for every minor update) — search engines deprioritize sitemaps that claim constant changes inaccurately.
- **`robots.txt`**: reference the sitemap index URL at the bottom, explicitly allow product/category paths, disallow `/cart`, `/checkout`, `/account`, `/admin`, and decide deliberately on AI crawler bots (see GEO section above).

### 10.6 Where This Plugs Into Earlier Sections

- SEO meta fields are already in the Add Product form (4.2) — just make them required, not optional, in the admin form.
- Schema markup generation should be automatic (derived from product/order data), not manually entered per product by catalog staff.
- Add "SEO & Sitemap" as a sub-tab under Settings (4.13) or its own admin module: view indexing status, manually trigger sitemap regeneration, edit `robots.txt` and `llms.txt` content without a code deploy.

---

## 11. Phased Build Roadmap

**Phase 1 — Foundation**
Auth (customer + admin roles), database schema, design system, basic homepage, category/product listing pages.

**Phase 2 — Catalog & Admin Core**
Full product management (with variants, customization fields), category management, image pipeline, admin role/permission system.

**Phase 3 — Commerce Core**
Cart, checkout, payment gateway integration, order creation, order management admin module, inventory deduction logic.

**Phase 4 — Fulfillment & Logistics**
Shipping integration (Shiprocket/Delhivery), label generation, tracking sync, order status automation.

**Phase 5 — Post-Purchase**
Reviews, returns/refunds, wallet, notifications (email/SMS/WhatsApp), coupon engine.

**Phase 6 — Growth & Content**
CMS/blog, analytics dashboard, search integration (Meilisearch/Algolia), Instagram feed, reports/exports.

**Phase 7 — Polish & Launch Prep**
Performance audit (Core Web Vitals pass), accessibility audit, security audit, load testing on checkout/payment flow, staff training on admin panel.

**Phase 8 — Post-Launch (Optional Enhancements)**
PWA/offline cart, abandoned cart recovery automation, loyalty program, multi-language support, wholesale/B2B ordering tier.

---

This is the full planning document — every module, every admin role, and every structural decision spelled out before any code gets written. Let me know which phase or module you want turned into actual implementation next.
