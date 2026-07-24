# Anuki Crochet E-Commerce Platform 🧶

A full-stack, production-ready e-commerce platform built for a crochet business. It features a beautiful, dynamic storefront and a comprehensive Admin Dashboard for managing products, orders, and real-time analytics.

## Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, Zustand (State Management), Lucide Icons, Recharts (Analytics)
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (with Prisma ORM)
* **Authentication:** Firebase Auth (JWT verified on backend)
* **Caching:** Redis (Product catalog optimization)

## Features
* **Storefront:** Dynamic product gallery, real-time inventory checks, and multi-step checkout.
* **Shopping Cart:** Persistent client-side cart powered by Zustand, supporting custom variants and made-to-order notes.
* **Admin Dashboard:** 
  * Live KPI analytics (Revenue, Orders, Low Stock Alerts)
  * Complete product management (Create, Edit, Quick Pricing Updates, Draft/Publish)
  * Order fulfillment workflows (Update order status, view timelines, process shipments)

## Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL
* Redis (Optional, but recommended for caching)
* Firebase Project (for Authentication)

### 1. Database Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed # Seeds the database with sample crochet products
```

### 2. Run the Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Environment Variables
See `.env.example` (or set up `.env`) in the respective `frontend/` and `backend/` directories. Required variables include `DATABASE_URL`, `FIREBASE_PROJECT_ID`, and `NEXT_PUBLIC_API_URL`.

## License
MIT License
