# 🚀 Looply Quick Start Guide

Get Looply up and running in 5 minutes!

## What You've Got

A production-ready Google Forms alternative with:
- ✨ Beautiful animated forms
- 📝 14+ field types
- 📊 Response collection
- 📥 CSV export
- 🔗 Public sharing
- 📱 Fully responsive
- 🛡️ Production-grade error handling

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

**Option A: Use Supabase (Free, Recommended)**

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the connection string

**Option B: Local PostgreSQL**

```bash
# Install PostgreSQL, then:
createdb looply
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
DATABASE_URL="postgresql://user:password@host:5432/looply"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

Generate secret:
```bash
openssl rand -base64 32
```

### 4. Set Up Database Tables

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Using Looply

### Create Your First Form

1. Click "Get Started" or go to `/dashboard`
2. Click "Create New Form"
3. Add form title and description
4. Add fields by clicking field types
5. Customize each field (labels, options, required, etc.)
6. Click "Save Form"
7. Form is now in your dashboard!

### Share Your Form

1. Go to dashboard
2. Find your form
3. Click the share icon
4. Copy the link
5. Share with anyone!

### View Responses

1. Go to dashboard
2. Click "View" on any form
3. See all responses
4. Click "Export CSV" to download

## Deploy to Production

### Vercel (Easiest - 2 minutes)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repo
   - Add environment variables:
     ```
     DATABASE_URL=your-db-url
     NEXTAUTH_SECRET=your-secret
     NEXTAUTH_URL=https://your-app.vercel.app
     ```
   - Click Deploy!

3. **Set up database**
   ```bash
   # After deployment
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

**Done! Your app is live! 🚀**

## Features Overview

### Form Builder

- **14 Field Types**: Text, email, number, date, multiple choice, checkboxes, dropdown, linear scale, file upload, and more
- **Drag & Drop**: Easy field management
- **Customization**: Labels, descriptions, placeholders, validation
- **Required Fields**: Mark fields as mandatory
- **Field Options**: For multiple choice, checkboxes, dropdowns

### Form Rendering

- **Animated**: Smooth Framer Motion animations
- **One Question at a Time**: Focused user experience
- **Progress Bar**: Keep users engaged
- **Validation**: Real-time field validation
- **Mobile Responsive**: Works perfectly on all devices

### Response Management

- **Dashboard**: View all responses
- **CSV Export**: Download data instantly
- **Response Details**: See individual submissions
- **Email Collection**: Optional email capture

### Sharing

- **Unique URLs**: Every form gets a shareable link
- **Public Forms**: No login required to fill
- **Publish/Unpublish**: Control form availability
- **Draft Mode**: Work on forms before publishing

## Project Structure

```
looply/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── f/[shareId]/      # Public form pages
│   └── page.tsx          # Landing page
├── components/
│   ├── form-builder/     # Form creation UI
│   ├── form-renderer/    # Form display UI
│   └── ui/               # Reusable components
├── lib/                  # Utilities
├── prisma/              # Database schema
└── types/               # TypeScript types
```

## Common Tasks

### View Database

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma db push --force-reset
```

### Check Logs (Production)

```bash
# Vercel
vercel logs

# PM2
pm2 logs looply
```

### Update Dependencies

```bash
npm update
```

## Troubleshooting

### "Prisma Client not generated"

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### "Database connection failed"

- Check DATABASE_URL in `.env`
- Ensure database is running
- Check firewall/network settings

### "Port 3000 already in use"

```bash
# Kill process
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### Build errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. **Customize Design**: Edit `tailwind.config.ts` for colors
2. **Add Authentication**: Set up NextAuth providers
3. **Add Analytics**: Integrate Vercel Analytics or Google Analytics
4. **Custom Domain**: Add your domain in Vercel
5. **Email Notifications**: Set up email service for form submissions
6. **Conditional Logic**: Implement smart form branching
7. **File Uploads**: Configure cloud storage for files

## Documentation

- **[README.md](README.md)** - Complete feature overview
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - All deployment options

## Support

- Check the documentation
- Open an issue on GitHub
- Review Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Review Prisma docs: [prisma.io/docs](https://prisma.io/docs)

## Tips

- **Start Simple**: Create a basic form first
- **Test Locally**: Always test before deploying
- **Use Supabase**: Free tier is perfect for getting started
- **Monitor Performance**: Use Vercel Analytics
- **Keep Updated**: Run `npm update` regularly

---

**Happy Form Building! 🎉**

Built with ❤️ using Next.js, Prisma, and Framer Motion
