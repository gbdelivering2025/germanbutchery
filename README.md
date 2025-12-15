# German Butchery - E-Commerce Platform

WhatsApp-first e-commerce platform for selling meat products with Rwandan Franc (RWF) currency support.

## Features

### Customer-Facing
- 🛍️ Product catalog with category filtering
- 🔍 Search functionality
- 🛒 Shopping cart with flexible quantity units (kg, g, pc, pkt)
- 💬 WhatsApp checkout integration
- 📱 Mobile-responsive design
- 🖼️ Product image galleries

### Admin Panel
- 📊 Dashboard with sales analytics
- 🥩 Products management (CRUD + bulk editing)
- 📦 Orders management with status updates
- 🎨 Theme customization (colors, fonts, logo)
- ⚙️ Store settings (delivery zones, contact info)
- 💬 WhatsApp notification integration

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: NestJS 10, TypeScript
- **Database**: PostgreSQL
- **State Management**: Zustand
- **Styling**: CSS-in-JS

## Structure

```
├── frontend/              # Next.js frontend application
│   ├── components/
│   │   ├── admin/        # Admin panel components
│   │   ├── store/        # Customer-facing components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utilities (API client, store)
│   ├── pages/            # Next.js pages
│   └── styles/           # Global styles
├── backend/              # NestJS backend API
│   └── src/
│       ├── categories/   # Categories module
│       ├── products/     # Products module
│       ├── orders/       # Orders module
│       ├── settings/     # Settings module
│       └── entities/     # TypeORM entities
└── db/                   # Database schema and seeds
    ├── schema.sql        # PostgreSQL schema
    └── seed.sql          # Sample data
```

## Quick Start (Development)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### 1. Database Setup

```bash
# Create database
createdb germanbutchery

# Run schema
psql germanbutchery < db/schema.sql

# Load sample data (optional)
psql germanbutchery < db/seed.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on http://localhost:4000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=germanbutchery
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## API Endpoints

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk-update` - Bulk update products

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get specific setting
- `PUT /api/settings/:key` - Update setting

## Pages

### Customer Pages
- `/` - Homepage with featured products
- `/products` - Product catalog
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart
- `/orders` - Order history

### Admin Pages
- `/admin` - Dashboard
- `/admin/products` - Products management
- `/admin/orders` - Orders management
- `/admin/design` - Theme customization
- `/admin/settings` - Store settings

## WhatsApp Integration

The platform integrates with WhatsApp for:
- Order placement (checkout flow)
- Order status notifications
- Customer communication

WhatsApp numbers are configured in admin settings.

## Currency

All prices are in Rwandan Franc (RWF) with proper formatting.

## License

Private - All rights reserved

---

Built with ❤️ for German Butchery, Kigali, Rwanda
