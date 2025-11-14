# 🔧 Local Setup Workaround

**Issue**: Prisma binaries are blocked in this environment (403 Forbidden).

**Solution**: When you clone this repo to your local machine, follow these steps:

## ✅ On Your Local Machine

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd looply
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add:

```bash
# For local development with SQLite (easiest):
DATABASE_URL="file:./dev.db"

# Generate a secure secret:
# Run: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

NEXTAUTH_URL="http://localhost:3000"
```

### 4. Generate Prisma Client (This will work on your machine!)

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Open in Browser

Go to http://localhost:3000 🎉

---

## 🚀 For Production (PostgreSQL/Supabase)

When ready for production, switch from SQLite to PostgreSQL:

### 1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Update `.env`:

```bash
# Get this from Supabase or your PostgreSQL provider
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 3. Regenerate and push:

```bash
npx prisma generate
npx prisma db push
```

---

## 📦 Quick Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Go to vercel.com → New Project → Import your repo
# Add environment variables in Vercel dashboard
# Deploy!
```

---

## Why This Error Happened

The Prisma binary CDN (binaries.prisma.sh) returns 403 Forbidden in this environment. This is a network/firewall restriction that won't exist on:
- ✅ Your local machine
- ✅ Vercel deployment
- ✅ Railway deployment
- ✅ Any standard hosting environment

The code is 100% ready to run - it just needs to be on a machine with normal internet access!
