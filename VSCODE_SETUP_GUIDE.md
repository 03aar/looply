# 🚀 Complete VS Code Setup Guide - Looply

**Get Looply running on your local machine in VS Code from scratch!**

This guide assumes you're starting fresh and will walk you through every step.

---

## 📋 Prerequisites

Before you start, make sure you have these installed:

### 1. **Node.js** (v18 or higher)
- Download from: https://nodejs.org/
- Download the **LTS version** (recommended)
- To check if installed, open Terminal/Command Prompt:
  ```bash
  node --version
  # Should show v18.x.x or higher
  ```

### 2. **Git**
- Download from: https://git-scm.com/
- To check if installed:
  ```bash
  git --version
  # Should show git version 2.x.x
  ```

### 3. **Visual Studio Code**
- Download from: https://code.visualstudio.com/
- Install the latest version

### 4. **Recommended VS Code Extensions**
Open VS Code and install these extensions (optional but helpful):
- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Prisma** - Syntax highlighting for Prisma schema
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🎯 Step-by-Step Setup

### Step 1: Clone the Repository

**Option A: Using Command Line**

1. Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows)
2. Navigate to where you want the project:
   ```bash
   cd Desktop
   # Or any folder you prefer
   ```

3. Clone the repository:
   ```bash
   git clone <your-repo-url-here>
   # Replace <your-repo-url-here> with your actual GitHub repo URL
   ```

4. Navigate into the project:
   ```bash
   cd looply
   ```

**Option B: Using VS Code**

1. Open VS Code
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Git: Clone" and press Enter
4. Paste your repository URL
5. Choose where to save the project
6. Click "Open" when prompted

---

### Step 2: Open Project in VS Code

1. Open VS Code
2. Click **File → Open Folder**
3. Navigate to the `looply` folder
4. Click **Open**

You should now see the project files in the left sidebar!

---

### Step 3: Open Integrated Terminal

In VS Code:
- Press `` Ctrl+` `` (backtick key, usually below Escape)
- Or go to **Terminal → New Terminal**

You'll see a terminal at the bottom of VS Code. All commands below will be run here.

---

### Step 4: Install Dependencies

In the VS Code terminal, run:

```bash
npm install
```

**What this does:** Downloads all required packages (React, Next.js, Prisma, etc.)

**Wait time:** 1-2 minutes

**Expected output:**
```
added 485 packages in 45s
```

✅ Once you see "added X packages", you're good!

---

### Step 5: Set Up Environment Variables

1. In VS Code, find the file `.env.example` in the sidebar
2. Right-click on it and select **Copy**
3. Right-click in the file explorer area and select **Paste**
4. Rename the copied file from `.env.example copy` to `.env`

**OR** use the terminal:

```bash
cp .env.example .env
```

5. Open the `.env` file (double-click it)

6. You'll see this:

```bash
# Database - Using SQLite for local development (no setup needed!)
# For production, switch to PostgreSQL or Supabase
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# File Upload (Optional - for production)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_S3_BUCKET=""
```

7. **Generate a secure secret key:**

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
# Option 1: If you have OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

8. **Copy the output** (it will look like: `gEsW77RCfBae+NyJE8EsyZ+TtHte2wPReqGEBlu6IX0=`)

9. **Replace** `your-secret-key-here-generate-with-openssl-rand-base64-32` with your generated secret

10. **Save the file** (`Cmd+S` on Mac, `Ctrl+S` on Windows)

Your `.env` should now look like:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="gEsW77RCfBae+NyJE8EsyZ+TtHte2wPReqGEBlu6IX0="
NEXTAUTH_URL="http://localhost:3000"
```

✅ Environment variables are set up!

---

### Step 6: Set Up Database with Prisma

Looply uses SQLite for local development - **no database setup needed!**

Run these commands one by one:

**1. Generate Prisma Client:**

```bash
npx prisma generate
```

**What this does:** Creates the database client code

**Expected output:**
```
✔ Generated Prisma Client
```

**2. Create Database Tables:**

```bash
npx prisma db push
```

**What this does:** Creates a `dev.db` file (your SQLite database) with all tables

**Expected output:**
```
🚀  Your database is now in sync with your Prisma schema.
```

You'll now see a `prisma/dev.db` file in your project - that's your database!

✅ Database is ready!

---

### Step 7: Run the Development Server

```bash
npm run dev
```

**What this does:** Starts the Next.js development server

**Expected output:**
```
   ▲ Next.js 14.2.15
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.3s
```

🎉 **The app is now running!**

---

### Step 8: Open in Browser

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: **http://localhost:3000**

You should see the **Looply landing page**! 🎉

---

## 🎨 Using Looply

### Create Your First Form

1. Click **"Get Started"** or **"Create New Form"**
2. You'll see the dashboard (empty at first)
3. Click **"Create New Form"** button
4. Add a form title (e.g., "Contact Form")
5. Add description (optional)
6. Click on field types to add them (Short Text, Email, etc.)
7. Customize each field:
   - Change label
   - Add description
   - Mark as required
   - Add placeholder text
8. Click **"Save Draft"** or **"Publish Form"**

### Use Pre-built Templates

1. From the dashboard, click **"Browse Templates"**
2. Choose from 7 templates:
   - Contact Form
   - Event Registration
   - Customer Feedback
   - Survey
   - RSVP
   - Job Application
   - Newsletter Signup
3. Click **"Use This Template"**
4. Customize and publish!

### Share Your Form

1. From the dashboard, find your form
2. Look for the **Share Link**
3. Copy and share with anyone!
4. Forms work without login - anyone can fill them

### View Responses

1. Click **"View Responses"** on any form
2. See all submissions
3. Click **"Export CSV"** to download data

---

## 🛠️ Common Commands

All commands are run in the VS Code terminal:

### Development

```bash
# Start development server
npm run dev

# Stop the server
# Press Ctrl+C in terminal
```

### Database Management

```bash
# View database in browser UI
npx prisma studio
# Opens http://localhost:5555 with visual database editor

# Reset database (deletes all data!)
npx prisma db push --force-reset

# Create a new migration (for production)
npx prisma migrate dev --name description_here
```

### Code Quality

```bash
# Check for errors
npm run lint

# Build for production (test if it builds)
npm run build

# Run production build locally
npm run build
npm start
```

### Package Management

```bash
# Install new package
npm install package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

---

## ❌ Troubleshooting

### Issue 1: "Port 3000 already in use"

**Problem:** Another app is using port 3000

**Solution:**

**Option A - Kill the process:**
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Option B - Use different port:**
```bash
PORT=3001 npm run dev
# Then open http://localhost:3001
```

---

### Issue 2: "Cannot find module..."

**Problem:** Missing dependencies

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 3: "Prisma Client not generated"

**Problem:** Prisma client isn't created

**Solution:**
```bash
npx prisma generate
```

---

### Issue 4: Database errors

**Problem:** Database is corrupted or has issues

**Solution:**
```bash
# Delete the database and recreate it
rm prisma/dev.db
npx prisma db push
```

---

### Issue 5: Changes not showing in browser

**Solutions:**
1. **Hard refresh:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Clear cache:** Open DevTools (F12) → Network tab → Check "Disable cache"
3. **Restart dev server:** Press `Ctrl+C` in terminal, then run `npm run dev` again

---

### Issue 6: "npm command not found"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart VS Code completely
3. Open new terminal and try again

---

## 📁 Project Structure

Here's what's in the project:

```
looply/
├── app/                          # Next.js pages and routes
│   ├── api/                     # API endpoints
│   │   ├── forms/               # Form CRUD operations
│   │   └── responses/           # Response handling
│   ├── dashboard/               # Dashboard pages
│   │   ├── forms/               # Form management
│   │   └── page.tsx             # Dashboard home
│   ├── f/[shareId]/            # Public form viewer
│   ├── templates/               # Template gallery
│   └── page.tsx                 # Landing page
│
├── components/                  # React components
│   ├── form-builder/           # Form creation UI
│   │   ├── FormBuilder.tsx     # Main builder
│   │   ├── FieldSelector.tsx   # Add fields
│   │   └── FieldEditor.tsx     # Edit fields
│   ├── form-renderer/          # Form display
│   │   └── FormRenderer.tsx    # Public form view
│   └── ui/                     # Reusable UI components
│
├── lib/                        # Utility functions
│   ├── db.ts                   # Database client
│   ├── api-response.ts         # API helpers
│   └── utils.ts                # General utilities
│
├── prisma/                     # Database
│   ├── schema.prisma           # Database schema
│   └── dev.db                  # SQLite database (generated)
│
├── types/                      # TypeScript types
│   └── index.ts               # Shared types
│
├── .env                        # Environment variables (YOU create this)
├── .env.example               # Environment template
├── package.json               # Dependencies
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind CSS config
└── tsconfig.json             # TypeScript config
```

---

## 🎯 Next Steps

Once you have the app running locally:

### 1. Customize the Design

Edit `tailwind.config.ts` to change colors:

```typescript
colors: {
  purple: {
    500: '#your-color-here',
    600: '#your-darker-color',
    // etc.
  }
}
```

### 2. Add Features

Some ideas:
- Email notifications when forms are submitted
- File upload to cloud storage (AWS S3, Cloudinary)
- Conditional logic (show/hide fields based on answers)
- Form analytics (view counts, completion rate)
- Custom themes per form

### 3. Deploy to Production

When you're ready to go live:

**Option A: Vercel (Recommended - Easiest)**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

**Option B: Railway**
1. Go to https://railway.app
2. Create new project from GitHub
3. Add PostgreSQL database
4. Add environment variables
5. Deploy!

See `DEPLOYMENT.md` for detailed deployment guides.

---

## 🆘 Getting Help

### Documentation Files

- `README.md` - Feature overview and tech stack
- `QUICKSTART.md` - 5-minute quick start
- `SETUP.md` - Detailed setup instructions
- `DEPLOYMENT.md` - Production deployment guides
- `VSCODE_SETUP_GUIDE.md` - This file!

### Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/

### Common Questions

**Q: Can I use PostgreSQL instead of SQLite locally?**
A: Yes! Install PostgreSQL, change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`, and update your `DATABASE_URL` in `.env`.

**Q: How do I add authentication?**
A: The project has NextAuth.js set up. You need to configure providers (Google, GitHub, etc.) in `app/api/auth/[...nextauth]/route.ts`.

**Q: Where is the data stored?**
A: In `prisma/dev.db` (SQLite file). You can view it with `npx prisma studio`.

**Q: Can I use a different database?**
A: Yes! Prisma supports PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB.

**Q: How do I update dependencies?**
A: Run `npm update` to update all packages to their latest compatible versions.

---

## ✅ Checklist

Use this to make sure you've completed all steps:

- [ ] Node.js installed (v18+)
- [ ] Git installed
- [ ] VS Code installed
- [ ] Repository cloned
- [ ] Project opened in VS Code
- [ ] `npm install` completed successfully
- [ ] `.env` file created from `.env.example`
- [ ] `NEXTAUTH_SECRET` generated and added to `.env`
- [ ] `npx prisma generate` completed
- [ ] `npx prisma db push` completed
- [ ] `npm run dev` running without errors
- [ ] App opens at http://localhost:3000
- [ ] Can create a form successfully
- [ ] Can view the form
- [ ] Can submit a response
- [ ] Can view responses in dashboard

---

## 🎉 You're All Set!

Congratulations! You now have Looply running locally. You can:

✅ Create beautiful forms with animations
✅ Collect responses
✅ Export data to CSV
✅ Share forms with anyone
✅ Use pre-built templates
✅ Customize everything

**Happy form building!** 🚀

---

**Need help?** Check the documentation files or create an issue on GitHub.

**Found a bug?** Please report it on the GitHub issues page.

**Want to contribute?** Pull requests are welcome!
