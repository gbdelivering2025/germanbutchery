# Deployment Guide

This guide covers deploying the German Butchery e-commerce platform to production.

## Architecture Overview

- **Frontend**: Next.js (static export) → Netlify/Vercel
- **Backend**: Strapi CMS → DigitalOcean/AWS EC2/Render
- **Database**: PostgreSQL (production) / SQLite (development)
- **Media Storage**: Local/Cloudinary/AWS S3

## Prerequisites

- Node.js 20+
- PostgreSQL database (for production)
- Domain name (optional)
- Git repository access

## Part 1: Backend Deployment (Strapi)

### Option A: Deploy to Render (Recommended for Quick Start)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up or log in

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `germanbutchery-db`
   - Plan: Free or Starter
   - Note the Internal Database URL

3. **Deploy Strapi**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Root Directory: `backend-strapi`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_CLIENT=postgres
   DATABASE_URL=<your-postgres-internal-url>
   HOST=0.0.0.0
   PORT=10000
   APP_KEYS=<generate-random-keys>
   API_TOKEN_SALT=<generate-random-salt>
   ADMIN_JWT_SECRET=<generate-random-secret>
   TRANSFER_TOKEN_SALT=<generate-random-salt>
   JWT_SECRET=<generate-random-secret>
   ENCRYPTION_KEY=<generate-random-key>
   ```

   Generate secrets with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://germanbutchery-api.onrender.com`)

### Option B: Deploy to DigitalOcean

1. **Create Droplet**
   - Ubuntu 22.04 LTS
   - At least 2GB RAM
   - SSH access enabled

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install PM2
   sudo npm install -g pm2
   ```

3. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE germanbutchery;
   CREATE USER strapi WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE germanbutchery TO strapi;
   \q
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/germanbutchery.git
   cd germanbutchery/backend-strapi
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   nano .env
   # Add production environment variables
   
   # Build
   npm run build
   
   # Start with PM2
   pm2 start npm --name "strapi" -- start
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx**
   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/germanbutchery
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.germanbutchery.rw;

       location / {
           proxy_pass http://localhost:1337;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/germanbutchery /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.germanbutchery.rw
   ```

## Part 2: Frontend Deployment (Next.js)

### Configure API URL

Create `.env.local` in frontend directory:
```
NEXT_PUBLIC_STRAPI_URL=https://your-backend-url.com
```

### Option A: Deploy to Netlify (Recommended)

1. **Build Static Export**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Configure build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `out` (if using static export) or `.next` (if not)
   - Add environment variable:
     - `NEXT_PUBLIC_STRAPI_URL`: Your Strapi backend URL

3. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site.netlify.app`

4. **Custom Domain** (Optional)
   - Go to "Domain settings"
   - Add custom domain
   - Update DNS settings as instructed

### Option B: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_STRAPI_URL production
   ```

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

## Part 3: Configure Strapi

### Setup Admin User

1. Go to `https://your-backend-url.com/admin`
2. Create your first admin user
3. Complete the setup wizard

### Configure API Permissions

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Enable the following permissions:
   - **Product**: `find`, `findOne`
   - **Category**: `find`, `findOne`
   - **Theme**: `find`, `findOne`
   - **Site-setting**: `find`
3. Click **Save**

### Add Sample Data

1. **Categories**:
   - Create categories: Beef, Chicken, Pork, Goat, Lamb, etc.
   - Upload icon images
   - Mark 3-4 as "featured"

2. **Themes**:
   - Create a default theme
   - Set primary color (e.g., #DC2626)
   - Set secondary color (e.g., #1F2937)
   - Mark as "Active"

3. **Site Settings**:
   - Set business name: "German Butchery"
   - Add WhatsApp number (format: +250XXXXXXXXX)
   - Add business description
   - Configure SEO metadata

4. **Products**:
   - Add products with multiple images
   - Set pricing for different units
   - Assign to categories
   - Mark some as "featured"
   - Click "Publish"

## Part 4: Media Storage (Production)

### Option A: Cloudinary

1. **Install Plugin**
   ```bash
   cd backend-strapi
   npm install @strapi/provider-upload-cloudinary
   ```

2. **Configure** (`config/plugins.ts`):
   ```typescript
   export default ({ env }) => ({
     upload: {
       config: {
         provider: 'cloudinary',
         providerOptions: {
           cloud_name: env('CLOUDINARY_NAME'),
           api_key: env('CLOUDINARY_KEY'),
           api_secret: env('CLOUDINARY_SECRET'),
         },
         actionOptions: {
           upload: {},
           delete: {},
         },
       },
     },
   });
   ```

3. **Add Environment Variables**:
   ```
   CLOUDINARY_NAME=your-cloud-name
   CLOUDINARY_KEY=your-api-key
   CLOUDINARY_SECRET=your-api-secret
   ```

### Option B: AWS S3

1. **Install Plugin**
   ```bash
   npm install @strapi/provider-upload-aws-s3
   ```

2. **Configure** (`config/plugins.ts`):
   ```typescript
   export default ({ env }) => ({
     upload: {
       config: {
         provider: 'aws-s3',
         providerOptions: {
           s3Options: {
             accessKeyId: env('AWS_ACCESS_KEY_ID'),
             secretAccessKey: env('AWS_ACCESS_SECRET'),
             region: env('AWS_REGION'),
             params: {
               Bucket: env('AWS_BUCKET'),
             },
           },
         },
       },
     },
   });
   ```

## Part 5: Testing

### Test Strapi API

```bash
# Test categories endpoint
curl https://your-backend-url.com/api/categories

# Test products endpoint
curl https://your-backend-url.com/api/products?populate=*

# Test site settings
curl https://your-backend-url.com/api/site-setting?populate=*
```

### Test Frontend

1. Visit your frontend URL
2. Check that categories load
3. Click on a category → products should load
4. Click on a product → product details should load
5. Add to cart → cart should update
6. Click "Order via WhatsApp" → should open WhatsApp with pre-filled message

## Part 6: Maintenance

### Backup Database

```bash
# PostgreSQL backup
pg_dump -U strapi germanbutchery > backup.sql

# Restore
psql -U strapi germanbutchery < backup.sql
```

### Update Strapi

```bash
cd backend-strapi
npm run upgrade
npm install
npm run build
pm2 restart strapi
```

### Update Frontend

```bash
cd frontend
git pull
npm install
npm run build
# Netlify/Vercel will auto-deploy if connected to Git
```

### Monitor Logs

```bash
# PM2 logs
pm2 logs strapi

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Backend not starting
- Check database connection
- Verify environment variables
- Check logs: `pm2 logs strapi`

### Frontend not fetching data
- Check CORS settings in Strapi
- Verify API URL in frontend .env
- Check browser console for errors

### Images not loading
- Verify media provider configuration
- Check upload permissions in Strapi
- Verify CORS for media URLs

### WhatsApp not opening
- Verify WhatsApp number format (+250XXXXXXXXX)
- Check Site Settings configuration
- Test on mobile device

## Security Checklist

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall (UFW)
- [ ] Set up database backups
- [ ] Limit admin access to specific IPs (optional)
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Monitor error logs regularly

## Performance Optimization

- [ ] Enable CDN for static files
- [ ] Configure image optimization
- [ ] Enable caching headers
- [ ] Compress responses (gzip)
- [ ] Use PM2 cluster mode for Strapi
- [ ] Set up database connection pooling

## Support

For issues or questions:
1. Check logs first
2. Review Strapi documentation: https://docs.strapi.io
3. Review Next.js documentation: https://nextjs.org/docs
4. Contact technical support

---

**Deployment Complete!** 🎉

Your German Butchery e-commerce platform is now live and ready to accept orders via WhatsApp.
