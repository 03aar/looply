# 🚀 Deployment Guide for Looply

This guide covers multiple deployment options for Looply.

## Table of Contents

1. [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
2. [Deploy to Railway](#deploy-to-railway)
3. [Deploy with Docker](#deploy-with-docker)
4. [Deploy to Any Node.js Host](#deploy-to-any-nodejs-host)

## Deploy to Vercel (Recommended)

Vercel is the easiest and recommended way to deploy Looply.

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (Supabase, Neon, or Vercel Postgres)

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   Add these environment variables in Vercel dashboard:

   ```
   DATABASE_URL=postgresql://user:pass@host:5432/looply
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

   To generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live!

5. **Set up Database**

   After first deployment, run Prisma migrations:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Run Prisma commands
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

### Vercel Postgres (Optional)

If you want to use Vercel's built-in Postgres:

1. In your Vercel project, go to Storage
2. Create a Postgres database
3. Vercel will automatically add `DATABASE_URL` to your env

## Deploy to Railway

Railway offers easy deployment with built-in PostgreSQL.

### Steps

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add PostgreSQL**
   ```bash
   railway add
   # Select PostgreSQL
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
   railway variables set NEXTAUTH_URL=https://your-app.railway.app
   ```

6. **Deploy**
   ```bash
   railway up
   ```

7. **Run Database Setup**
   ```bash
   railway run npx prisma generate
   railway run npx prisma db push
   ```

## Deploy with Docker

For containerized deployment to any platform (AWS, Google Cloud, Azure, DigitalOcean, etc.)

### Prerequisites

- Docker installed
- Docker registry access (Docker Hub, AWS ECR, etc.)

### Steps

1. **Build Docker Image**
   ```bash
   docker build -t looply:latest .
   ```

2. **Run Locally (Test)**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://..." \
     -e NEXTAUTH_SECRET="your-secret" \
     -e NEXTAUTH_URL="http://localhost:3000" \
     looply:latest
   ```

3. **Push to Registry**
   ```bash
   docker tag looply:latest your-registry/looply:latest
   docker push your-registry/looply:latest
   ```

4. **Deploy to Your Platform**

   **AWS ECS:**
   - Create task definition with image
   - Set environment variables
   - Create service

   **Google Cloud Run:**
   ```bash
   gcloud run deploy looply \
     --image your-registry/looply:latest \
     --platform managed \
     --set-env-vars DATABASE_URL=...,NEXTAUTH_SECRET=...,NEXTAUTH_URL=...
   ```

   **DigitalOcean App Platform:**
   - Create new app
   - Use Docker Hub integration
   - Set environment variables

## Deploy to Any Node.js Host

For VPS hosting (DigitalOcean Droplet, Linode, AWS EC2, etc.)

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Process manager (PM2)

### Steps

1. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd looply
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   nano .env
   ```

4. **Set up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Install PM2**
   ```bash
   npm install -g pm2
   ```

7. **Start with PM2**
   ```bash
   pm2 start npm --name "looply" -- start
   pm2 save
   pm2 startup
   ```

8. **Set up Nginx (Optional)**

   `/etc/nginx/sites-available/looply`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/looply /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

9. **Set up SSL with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Database Options

### Supabase (Recommended - Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Use as `DATABASE_URL`

### Neon (Serverless Postgres)

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Use as `DATABASE_URL`

### Railway Postgres

- Automatically provided when you `railway add`
- Zero configuration needed

### Vercel Postgres

- Available in Vercel dashboard
- Integrated with your deployment

## Post-Deployment Checklist

- [ ] Database is running and accessible
- [ ] Environment variables are set correctly
- [ ] Prisma schema is pushed to database
- [ ] Application builds successfully
- [ ] Forms can be created
- [ ] Forms can be filled and submitted
- [ ] Responses are saved to database
- [ ] SSL/HTTPS is configured
- [ ] Custom domain is set up (if applicable)
- [ ] Monitoring is set up (optional)

## Monitoring & Maintenance

### Vercel

- Built-in analytics available
- Check deployment logs in dashboard
- Set up error tracking with Sentry

### PM2

```bash
# View logs
pm2 logs looply

# Monitor
pm2 monit

# Restart
pm2 restart looply

# Check status
pm2 status
```

### Database Maintenance

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# View database
npx prisma studio
```

## Troubleshooting

### Build Errors

**Error: Prisma Client not generated**
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

**Error: Database connection failed**
- Check DATABASE_URL format
- Ensure database is running
- Check firewall rules

### Runtime Errors

**Error: Module not found**
```bash
npm install
npm run build
```

**Error: Port already in use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill
# Or use different port
PORT=3001 npm start
```

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Use connection pooling for database

### Database Scaling

- Enable connection pooling
- Use read replicas
- Implement caching (Redis)

### Performance Optimization

- Enable CDN for static assets
- Implement caching headers
- Use database indexes
- Monitor with New Relic or Datadog

## Security Best Practices

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Keep dependencies updated
- [ ] Enable database SSL
- [ ] Use environment variables for secrets
- [ ] Implement CSP headers

## Support

For deployment issues:
- Check [README.md](README.md) for general info
- Check [SETUP.md](SETUP.md) for local setup
- Open an issue on GitHub
- Check Next.js deployment docs

---

**Happy Deploying! 🚀**
