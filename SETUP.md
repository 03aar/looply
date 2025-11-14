# 🚀 Looply Setup Guide

Complete guide to get Looply running on your local machine and in production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Verify Installation

```bash
node --version  # Should be v18.x or higher
npm --version   # Should be 9.x or higher
psql --version  # Should be 14.x or higher
```

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd looply
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- TypeScript
- Prisma
- Framer Motion
- Tailwind CSS
- And more...

### Step 3: Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/looply?schema=public"

# NextAuth (generate a secure secret)
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: File Upload (for production)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET=""
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Database Setup

### Option 1: Local PostgreSQL

#### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE looply;

# Create user (optional)
CREATE USER looply_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE looply TO looply_user;

# Exit
\q
```

#### Update DATABASE_URL

```env
DATABASE_URL="postgresql://looply_user:your_password@localhost:5432/looply?schema=public"
```

### Option 2: Cloud Database (Recommended for Production)

You can use any of these services:
- [Supabase](https://supabase.com/) - Free tier available
- [Railway](https://railway.app/) - Easy PostgreSQL hosting
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Vercel Postgres](https://vercel.com/storage/postgres) - If using Vercel

### Push Schema to Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

### Verify Database Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This will open a browser window at `http://localhost:5555` where you can see your database tables.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

### Test the Application

1. Visit http://localhost:3000
2. Click "Get Started" to go to the dashboard
3. Create a new form
4. Add some fields
5. Save and share your form!

### Build for Production

```bash
npm run build
npm start
```

## Production Deployment

### Deploy to Vercel (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel dashboard, add:
   ```
   DATABASE_URL=your-production-database-url
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your live site!

### Deploy to Other Platforms

#### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

#### Docker

```dockerfile
# Dockerfile is ready - just build and run
docker build -t looply .
docker run -p 3000:3000 looply
```

## Troubleshooting

### Common Issues

#### Database Connection Error

```
Error: Can't reach database server
```

**Solution**:
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall settings

#### Prisma Client Error

```
Error: @prisma/client did not initialize yet
```

**Solution**:
```bash
npm run db:generate
```

#### Module Not Found

```
Error: Cannot find module 'X'
```

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Port Already in Use

```
Error: Port 3000 is already in use
```

**Solution**:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

### Database Issues

#### Reset Database

```bash
# WARNING: This will delete all data
npm run db:push -- --force-reset
```

#### View Database Logs

```bash
# For local PostgreSQL
tail -f /usr/local/var/log/postgres.log
```

### Getting Help

If you encounter issues:

1. Check the [README.md](README.md)
2. Search existing GitHub issues
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Next Steps

Once you have Looply running:

1. ✅ Create your first form
2. ✅ Customize the theme in `tailwind.config.ts`
3. ✅ Set up authentication (see README)
4. ✅ Configure file uploads
5. ✅ Add your custom domain
6. ✅ Invite your team!

## Performance Optimization

### Production Checklist

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure database connection pooling
- [ ] Enable caching headers
- [ ] Monitor with Vercel Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Configure rate limiting

### Database Optimization

```bash
# Create indexes for better performance
# These are already included in the schema
```

## Security Best Practices

1. **Never commit `.env` file**
2. **Use strong database passwords**
3. **Enable SSL for database in production**
4. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```
5. **Set up CORS properly**
6. **Enable rate limiting**

## Monitoring

### Set up monitoring (optional):

- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay

---

**You're all set! 🎉**

Need help? Open an issue on GitHub or check the [README](README.md) for more information.
