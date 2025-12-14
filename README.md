# German Butchery - Advanced E-Commerce Platform

WhatsApp-first e-commerce platform built with Next.js (static export) and Strapi CMS.

## 🚀 Features

- **Static Frontend**: Next.js with static export for blazing-fast performance
- **WhatsApp Integration**: Order directly via WhatsApp with pre-filled messages
- **Flexible Pricing**: Support for grams, kilograms, pieces, and packets
- **Admin Panel**: Complete control over products, categories, themes, and settings
- **Theme Customization**: Change colors, fonts, button styles without code
- **Mobile-First**: Responsive design optimized for mobile devices
- **RWF Currency**: Rwandan Franc support with proper formatting
- **Multi-Image Products**: Upload multiple images per product
- **Category Management**: Organize products with featured categories
- **Dynamic Sections**: Enable/disable homepage sections from admin

## 📁 Structure

```
.
├── backend-strapi/      # Strapi CMS backend
│   ├── src/
│   │   ├── api/         # Content types (Product, Category, Theme, SiteSettings)
│   │   └── components/  # Reusable components (Pricing, Contact, Layout)
│   └── config/          # Database and server configuration
├── frontend/            # Next.js static frontend
│   ├── pages/           # Page components
│   ├── components/      # Reusable UI components
│   ├── stores/          # Zustand state management
│   ├── utils/           # Helper functions
│   ├── lib/             # API client
│   └── types/           # TypeScript definitions
└── db/                  # Database schemas
```

## 🛠️ Tech Stack

### Backend
- **Strapi CMS** v5.32.0 - Headless CMS with powerful admin panel
- **PostgreSQL** / **SQLite** - Database (configurable)
- **TypeScript** - Type safety

### Frontend
- **Next.js** v14 - React framework with static export
- **TypeScript** - Type safety
- **Zustand** - State management for shopping cart
- **Axios** - API client
- **SWR** - Data fetching (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm 6+
- PostgreSQL (optional, for production)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-strapi
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and configure:
# - Database settings (use SQLite for development, PostgreSQL for production)
# - App keys and secrets (already generated)
```

4. Start the development server:
```bash
npm run develop
```

5. Create your first admin user at `http://localhost:1337/admin`

6. Configure API permissions:
   - Go to Settings → Users & Permissions Plugin → Roles → Public
   - Enable the following permissions:
     - Product: find, findOne
     - Category: find, findOne
     - Theme: find, findOne
     - Site-setting: find

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env.local
echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser

### Building for Production

#### Backend (Strapi)
```bash
cd backend-strapi
npm run build
npm start
```

#### Frontend (Next.js Static Export)
```bash
cd frontend
npm run build
# The static files will be in the 'out' directory
```

## 📊 Content Models

### Product
- Name, Slug, SKU
- Description (rich text)
- Multiple images
- Category relation
- Availability status
- Flexible pricing (multiple unit types)
- Featured flag

### Category
- Name, Slug
- Display order
- Icon/Image
- Description
- Featured flag

### Theme
- Primary, Secondary, Accent colors
- Font family
- Button style (rounded/square/pill)
- Border radius
- Light/Dark mode
- Logo and favicon

### Site Settings (Single Type)
- Business name and description
- WhatsApp numbers (multiple)
- Email and address
- Announcements
- SEO metadata
- Social media links
- Homepage section configuration

## 🎨 Admin Panel Features

### Product Management
- ✅ Add/Edit/Delete products
- ✅ Upload multiple images per product
- ✅ Set flexible pricing for different units
- ✅ Assign categories
- ✅ Enable/Disable products
- ✅ Mark as featured

### Category Management
- ✅ Create/Edit categories
- ✅ Set display order
- ✅ Upload icons and images
- ✅ Mark as featured

### Theme Customization
- ✅ Change primary/secondary/accent colors
- ✅ Select font family
- ✅ Choose button style
- ✅ Set border radius
- ✅ Switch light/dark mode
- ✅ Upload logo and favicon
- ✅ Save multiple themes
- ✅ Activate theme instantly

### Site Settings
- ✅ Configure business information
- ✅ Add WhatsApp numbers
- ✅ Set announcements
- ✅ Configure SEO metadata
- ✅ Add social media links
- ✅ Enable/disable homepage sections

## 🔧 Configuration

### TypeScript Configuration

The project uses TypeScript with some relaxed settings to facilitate rapid development:
- `strict: false` - Allows for more flexible typing during initial development
- `ignoreBuildErrors: true` - Allows builds to complete even with type warnings

**For production use**, it's recommended to:
1. Enable strict mode: Set `"strict": true` in `tsconfig.json`
2. Fix all type errors
3. Remove `ignoreBuildErrors` from `next.config.js`
4. Remove `ignoreDuringBuilds` from eslint configuration

### Database (Production)

To use PostgreSQL in production, update `backend-strapi/.env`:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=germanbutchery
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_SSL=false
```

### Media Storage

By default, media is stored locally. For production, consider using:
- **Cloudinary**: Install `@strapi/provider-upload-cloudinary`
- **AWS S3**: Install `@strapi/provider-upload-aws-s3`

## 📱 WhatsApp Integration

The WhatsApp integration works as follows:

1. Customer adds products to cart
2. Clicks "Order via WhatsApp"
3. WhatsApp opens with pre-filled message containing:
   - Product names and quantities
   - Unit types and prices
   - Total price in RWF
   - Fields for delivery location and customer name
4. Customer sends the message to complete order

Configure WhatsApp numbers in the Site Settings admin panel.

## 🚢 Deployment

### Backend (Strapi)
Deploy to any Node.js hosting service:
- DigitalOcean
- AWS EC2
- Heroku
- Render

### Frontend (Static Site)
Deploy the `out` directory to:
- **Netlify** (recommended)
- **Vercel** (recommended)
- **AWS S3 + CloudFront**
- Any static hosting service

## 📝 Development Workflow

### Week 1-2: Backend Development ✅
- [x] Set up Strapi CMS
- [x] Create content types
- [x] Configure components
- [x] Set up API routes

### Week 3: Frontend Development ✅
- [x] Next.js setup with static export
- [x] Homepage with hero and sections
- [x] Product listing and detail pages
- [x] Shopping cart functionality
- [x] WhatsApp integration
- [x] Theme customization support

### Week 4: Integration & Testing
- [ ] Test static export generation
- [ ] Test WhatsApp ordering flow
- [ ] Test admin panel operations
- [ ] Configure API permissions
- [ ] Add sample data

### Week 5: Deployment & Documentation
- [ ] Deploy backend to VPS
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Configure production database
- [ ] Set up media storage
- [ ] Final testing

## 🤝 Contributing

This is a private project for German Butchery. For support, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for German Butchery**

