# 🎯 Looply - Beautiful Forms That People Love to Fill

![Looply](https://img.shields.io/badge/version-0.1.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

**Looply** is a modern, production-ready alternative to Google Forms with beautiful animations and an amazing user experience. Built with Next.js 14, TypeScript, Prisma, and Framer Motion.

## ✨ Features

### Form Builder
- 🎨 **Intuitive drag-and-drop form builder**
- 📝 **14+ field types** - All the Google Forms field types and more:
  - Short Text, Long Text
  - Email, Phone, URL
  - Number, Date, Time
  - Multiple Choice, Checkboxes, Dropdown
  - Linear Scale, File Upload
  - Section Headers
- ⚙️ **Field customization** - Labels, descriptions, placeholders, validation
- ✅ **Required fields** and validation rules
- 🎯 **Real-time preview**

### Form Rendering
- ✨ **Smooth animations** - Powered by Framer Motion
- 📱 **Fully responsive** - Beautiful on all devices
- 🎨 **One field at a time** - Focused, distraction-free experience
- 📊 **Progress bar** - Keep users engaged
- 🚀 **Lightning fast** - Optimized performance
- 🎉 **Custom success messages**

### Response Management
- 📊 **Response dashboard** - View all submissions
- 📥 **CSV Export** - Download responses instantly
- 📧 **Email collection** - Optional email capture
- 🔍 **Response filtering** - Find what you need
- 📈 **Analytics** (coming soon)

### Sharing & Publishing
- 🔗 **Shareable links** - Unique URL for each form
- 🌐 **Public forms** - No login required to fill
- 🔒 **Draft mode** - Publish when ready
- 📋 **Easy embedding** (coming soon)

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Animations**: Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (ready to configure)
- **Icons**: Lucide React
- **Form Management**: React Hook Form + Zod
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd looply
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/looply?schema=public"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Creating a Form

1. Go to Dashboard (`/dashboard`)
2. Click "Create New Form"
3. Add form title and description
4. Add fields using the Field Selector
5. Customize each field (labels, options, validation)
6. Save and publish your form
7. Share the unique link with your audience

### Collecting Responses

1. Share your form link (`/f/[shareId]`)
2. Users fill out the form with the beautiful animated interface
3. View responses in the dashboard
4. Export to CSV for analysis

## 📁 Project Structure

```
looply/
├── app/
│   ├── api/              # API routes
│   │   ├── forms/        # Form CRUD operations
│   │   ├── responses/    # Response handling
│   │   └── share/        # Public form access
│   ├── dashboard/        # Dashboard pages
│   ├── f/[shareId]/      # Public form pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── form-builder/     # Form builder components
│   └── form-renderer/    # Form display components
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── types/
│   └── form.ts           # TypeScript types
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses a robust PostgreSQL schema with the following models:

- **User** - User accounts
- **Form** - Form definitions
- **FormField** - Individual form fields
- **FormSettings** - Form configuration
- **FormResponse** - User submissions
- **FormFieldResponse** - Individual field responses

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  primary: "hsl(var(--primary))",
  // ... customize colors
}
```

### Animations

Animations are defined in `tailwind.config.ts` and can be customized:

```typescript
animation: {
  "fade-in": "fadeIn 0.5s ease-in-out",
  // ... add more animations
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```bash
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🔐 Authentication Setup

The application is ready for authentication with NextAuth.js. To enable:

1. Configure NextAuth providers in `app/api/auth/[...nextauth]/route.ts`
2. Update API routes to use sessions
3. Protect dashboard routes

## 🎯 Roadmap

- [x] Form builder with 14+ field types
- [x] Animated form renderer
- [x] Response collection and storage
- [x] CSV export
- [x] Public form sharing
- [ ] User authentication
- [ ] Conditional logic/branching
- [ ] File upload to cloud storage
- [ ] Real-time response updates
- [ ] Advanced analytics
- [ ] Form templates
- [ ] Team collaboration
- [ ] Custom domains
- [ ] Webhooks
- [ ] API access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ by the Looply team**

*Making forms beautiful, one submission at a time.*
