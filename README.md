# 🛒 GrocerX — Production-Grade Grocery Delivery Platform

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</div>

---

## Overview

GrocerX is an **online-only, production-grade grocery delivery platform** built with a modern full-stack architecture. It features real-time rider tracking via Socket.io, JWT-based authentication with HttpOnly cookies, image processing with `sharp`, and a four-role system: Customer, Admin, Rider, and Guest.

---

## 📸 Screenshots

| Home Page | Login Page |
|-----------|------------|
| Orange hero, category icons, product grid | Split-panel with quick test credentials |

| Admin Dashboard | Rider Interface |
|-----------------|-----------------|
| Sidebar + product table with 1:1 thumbnails | Live GPS tracking + delivery toggle |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GrocerX Monorepo                         │
│                                                                   │
│  ┌──────────────────────┐     ┌───────────────────────────────┐  │
│  │   Frontend (React)    │────▶│   Backend (NestJS) :3001      │  │
│  │   Vite + Tailwind     │     │   REST API + WebSocket        │  │
│  │   Leaflet.js Maps     │     │   JWT (HttpOnly Cookies)      │  │
│  │   Socket.io Client    │◀────│   Socket.io Gateway           │  │
│  │   Zustand State       │     │   Sharp Image Processing      │  │
│  └──────────────────────┘     └───────────┬───────────────────┘  │
│           :5173                            │                       │
│                                            ▼                       │
│                              ┌─────────────────────────┐          │
│                              │  PostgreSQL :5432         │          │
│                              │  TypeORM (auto-sync)      │          │
│                              │  pgAdmin :5050            │          │
│                              └─────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Real-Time Flow (Socket.io)
```
Rider App                    NestJS /tracking              Customer App
   │                               │                            │
   │──emit('locationUpdate')──────▶│                            │
   │   { orderId, lat, lng }       │                            │
   │                               │──emit('riderLocationUpdated')─▶│
   │                               │   (to order_room_{id} only)    │
   │                               │                            │
   │──emit('orderDelivered')──────▶│                            │
   │                               │──emit('orderStatusChanged')──▶│
```

---

## 🛠️ Technical Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS 11** | Modular, scalable Node.js framework |
| **TypeORM 0.3** | PostgreSQL ORM with decorators |
| **PostgreSQL 16** | Primary relational database |
| **JWT + Passport** | Authentication & authorization |
| **HttpOnly Cookies** | Secure token storage |
| **sharp 0.34** | Server-side image processing |
| **Socket.io 4** | Real-time bidirectional communication |
| **Multer** | Multipart file handling |
| **bcryptjs** | Password hashing (12 rounds) |
| **Helmet** | Security HTTP headers |
| **class-validator** | DTO validation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + Vite 8** | UI framework & build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Zustand** | Global state management (persisted) |
| **React Router v6** | Client-side routing |
| **Leaflet.js + react-leaflet** | Free OpenStreetMap mapping |
| **Socket.io Client** | Real-time updates |
| **Axios** | HTTP client with interceptors |
| **react-hot-toast** | Toast notifications |
| **lucide-react** | Icon library |

---

## 📁 Project Structure

```
grocerx/
├── docker-compose.yml          # PostgreSQL + pgAdmin
│
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── app.module.ts       # Root module
│   │   ├── main.ts             # Bootstrap (CORS, cookies, Helmet)
│   │   ├── auth/               # JWT auth, strategies, guards
│   │   ├── users/              # User entity & CRUD
│   │   ├── products/           # Product CRUD + image upload
│   │   ├── categories/         # Category management
│   │   ├── orders/             # Order lifecycle
│   │   ├── upload/             # sharp image processing service
│   │   └── tracking/           # Socket.io WebSocket gateway
│   ├── scripts/
│   │   └── seed.ts             # Database seeder
│   └── .env                    # Environment variables
│
└── frontend/                   # React + Vite
    ├── src/
    │   ├── App.tsx             # Router & protected routes
    │   ├── pages/
    │   │   ├── HomePage.tsx         # Customer home
    │   │   ├── LoginPage.tsx        # Auth
    │   │   ├── RegisterPage.tsx     # Registration
    │   │   ├── CartPage.tsx         # Cart + order placement
    │   │   ├── OrderTrackingPage.tsx # Leaflet map + real-time stepper
    │   │   ├── RiderInterface.tsx    # GPS tracking + delivery
    │   │   └── admin/
    │   │       ├── AdminDashboard.tsx # Sidebar layout
    │   │       ├── AdminProducts.tsx  # CRUD + 1:1 image upload modal
    │   │       └── AdminOrders.tsx    # Order management
    │   ├── store/
    │   │   ├── auth.store.ts    # Zustand auth (persisted)
    │   │   └── cart.store.ts    # Zustand cart (persisted)
    │   └── lib/
    │       └── api.ts           # Axios instance + interceptors
    ├── tailwind.config.js       # Grocer Orange design system
    └── .env                     # VITE_API_URL
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js ≥ 18 (tested on v24.15.0)
- Docker Desktop
- Git

### 2. Start the Database

```bash
# From the grocerx/ root directory
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (admin@grocerx.com / admin123)

### 3. Start the Backend

```bash
cd backend
npm install
npm run start:dev
```

API available at: **http://localhost:3001/api**

### 4. Seed the Database

```bash
# In a new terminal, from backend/
npm run seed
```

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: **http://localhost:5173**

---

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@grocerx.com | password123 |
| **Rider** | rider@grocerx.com | password123 |
| **Customer** | customer@grocerx.com | password123 |

> 💡 The Login page has a **Quick Test Logins** panel — click any account to auto-fill credentials.

---

## 🎨 Design System — "Grocer Orange"

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#FF7A01` | CTAs, highlights, accents |
| `gold` | `#FFA500` | Secondary elements |
| `cream` | `#FAF6F1` | Page backgrounds |
| `charcoal` | `#2B2B2B` | Body text |
| Font (UI) | **Inter** | All body text |
| Font (Headings) | **Playfair Display** | Serif "Old Money" headings |
| Border Radius | `1.5rem` (bento), `1.25rem` (card), `9999px` (pill) | Rounded bento style |
| Shadow | `0 4px 24px rgba(255,122,1,0.08)` | Subtle orange glow |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new customer |
| POST | `/api/auth/login` | None | Login → sets HttpOnly cookie |
| POST | `/api/auth/logout` | Cookie | Clear cookie |
| GET | `/api/auth/me` | JWT | Get current user profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | None | List available products (with search) |
| GET | `/api/products/trending` | None | Get 8 trending products |
| GET | `/api/products/admin` | Admin | List all products including hidden |
| POST | `/api/products` | Admin | Create + upload image (multipart) |
| PATCH | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Customer | Place new order |
| GET | `/api/orders` | Any | Get orders (filtered by role) |
| GET | `/api/orders/:id` | Owner | Get single order |
| PATCH | `/api/orders/:id/status` | Admin/Rider | Update order status |
| PATCH | `/api/orders/:id/assign-rider` | Admin | Assign rider |
| PATCH | `/api/orders/:id/location` | Rider | Update GPS coordinates |

### WebSocket Events (`/tracking` namespace)
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `joinOrderRoom` | Client→Server | `{ orderId }` | Customer joins room |
| `locationUpdate` | Rider→Server | `{ orderId, lat, lng, riderId }` | Rider GPS update |
| `riderLocationUpdated` | Server→Customer | `{ orderId, lat, lng, timestamp }` | Broadcast to order room |
| `orderDelivered` | Rider→Server | `{ orderId, riderId }` | Mark delivered |
| `orderStatusChanged` | Server→Customer | `{ orderId, status }` | Status broadcast |

---

## 🖼️ Image Processing Constraints

The `ImageProcessingService` (powered by `sharp`) enforces two hard constraints:

1. **Constraint 1 — 1:1 Aspect Ratio**: Every uploaded image is center-cropped to a square using `extract()` with calculated offsets. Non-square images are automatically corrected.

2. **Constraint 2 — WebP < 1MB**: Images are converted to WebP at quality 80. If the file exceeds 1MB, quality is progressively reduced in 10-point steps until under the limit.

```typescript
// Center-crop calculation
const size = Math.min(width, height);
.extract({
  left: Math.floor((width - size) / 2),
  top: Math.floor((height - size) / 2),
  width: size,
  height: size,
})
.resize(800, 800)
.webp({ quality: 80 })
```

The Admin "Add Product" modal visually warns users when an uploaded image isn't square and explains the auto-crop behavior.

---

## 🔒 Security Architecture

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcryptjs with 12 salt rounds |
| **Token Storage** | HttpOnly, SameSite=Lax, Secure (prod) cookies |
| **Authorization** | JWT + `@UseGuards(JwtAuthGuard, RolesGuard)` |
| **RBAC** | `@Roles(UserRole.ADMIN)` decorator on each endpoint |
| **HTTP Security** | Helmet.js on all responses |
| **Validation** | `class-validator` DTOs with `whitelist: true` |
| **CORS** | Restricted to `FRONTEND_URL` env variable |

---

## 📋 Software Requirements Specification (SRS) Summary

### 1. System Purpose
GrocerX is an online-only grocery delivery platform enabling customers to browse products, place orders, and track deliveries in real time via a mobile-friendly web interface.

### 2. User Roles
| Role | Capabilities |
|------|-------------|
| **Guest** | Browse products, view categories |
| **Customer** | Register, login, add to cart, place orders, track orders via live map |
| **Admin** | Full product/category CRUD, order management, rider assignment |
| **Rider** | View assigned orders, share GPS location, mark deliveries complete |

### 3. Functional Requirements
- **FR-01**: Users must register and log in to place orders
- **FR-02**: Product images must be center-cropped to 1:1 and stored as WebP < 1MB
- **FR-03**: Admin can create, edit, and delete products with category assignment
- **FR-04**: Prices are stored as integers (cents/paisa) to avoid floating-point errors
- **FR-05**: Riders broadcast GPS coordinates to order-specific WebSocket rooms
- **FR-06**: Customers receive live rider location without seeing other orders' data
- **FR-07**: Order status progresses: Pending → Confirmed → Preparing → Out for Delivery → Delivered
- **FR-08**: Orders include a JSONB snapshot of items at time of purchase

### 4. Non-Functional Requirements
- **NFR-01 (Security)**: JWT stored in HttpOnly cookies; no localStorage token exposure
- **NFR-02 (Performance)**: Product images ≤ 800×800px WebP for fast load
- **NFR-03 (Scalability)**: NestJS modular architecture supports horizontal scaling
- **NFR-04 (Reliability)**: TypeORM `synchronize: false` in production for schema stability
- **NFR-05 (Availability)**: Docker Compose for self-hosted PostgreSQL + pgAdmin

---

## 🐳 Docker Reference

```yaml
# Start all services
docker compose up -d

# View logs
docker compose logs -f postgres

# Stop and clean volumes
docker compose down -v

# pgAdmin: http://localhost:5050
# Email: admin@grocerx.com | Password: admin123
# Add server: Host=postgres, Port=5432, DB=grocerx_db, User=grocerx, Pass=grocerx_secret
```

---

## 📦 Environment Variables

### Backend (`backend/.env`)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=grocerx
DB_PASS=grocerx_secret
DB_NAME=grocerx_db
JWT_SECRET=grocerx_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

## 🗺️ Roadmap

- [ ] Push notifications (web-push API)
- [ ] Stripe/PayFast payment integration
- [ ] Multi-language support (Urdu)
- [ ] Admin analytics dashboard with charts
- [ ] Mobile PWA manifest
- [ ] Redis caching for product catalog
- [ ] Rate limiting per user

---

## 📄 License

MIT License — GrocerX is open source and free to use.

---

<div align="center">
  Built with ❤️ and 🧡 by the GrocerX Team
</div>
