# engineersTech - Enterprise Tech Solutions

A modern, full-stack web application built with React, TypeScript, and Supabase. This project features a complete CMS with admin dashboard, blog management, portfolio showcase, testimonials, and AI-powered chatbot.

## 🚀 Features

- **Dynamic Branding**: Update logo, colors, and company info from admin panel
- **Blog Management**: Full CRUD with featured images, SEO, and related posts
- **Portfolio/Case Studies**: Showcase projects with image galleries
- **Testimonials**: Manage client reviews with ratings
- **AI Chatbot**: Intelligent customer support with configurable responses
- **SEO Management**: Per-page SEO settings with AI generation
- **Contact Form**: Submissions stored in database
- **Responsive Design**: Mobile-first dark theme with glassmorphism

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Deployment**: GitHub Actions → cPanel (FTP)

---

## 📋 Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- Git
- A Supabase project (via Lovable Cloud or external)
- cPanel hosting with FTP access (for deployment)

### Local Development

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory (for local development):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

> **Note**: For Lovable Cloud projects, these are automatically configured.

---

## 🚀 Deployment to cPanel

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_SERVER` | Your cPanel FTP hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP username | `user@yourdomain.com` |
| `FTP_PASSWORD` | FTP password | `your_secure_password` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | `eyJhbGci...` |

### Step 2: FTP Configuration in cPanel

1. Log in to your cPanel dashboard
2. Go to **FTP Accounts**
3. Create a new FTP account or use existing
4. Note down:
   - **FTP Server**: Usually `ftp.yourdomain.com` or your server IP
   - **Username**: The full FTP username (e.g., `user@yourdomain.com`)
   - **Password**: Your FTP password

### Step 3: Deploy

Deployment is automatic on push to `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Action will:
1. ✅ Build the React application
2. ✅ Generate optimized production files
3. ✅ Create `.htaccess` for SPA routing
4. ✅ Deploy to `public_html/` via FTP

### Deployment Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│   Actions   │────▶│   cPanel    │
│    Push     │     │   Build     │     │   FTP       │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │   Verify    │
                    │   Build     │
                    └─────────────┘
```

---

## 🗄️ Database Schema

The application uses the following Supabase tables:

| Table | Purpose |
|-------|---------|
| `branding_settings` | Logo, colors, contact info, social links |
| `blog_posts` | Blog articles with SEO metadata |
| `case_studies` | Portfolio projects with galleries |
| `testimonials` | Client reviews and ratings |
| `chatbot_config` | AI chatbot Q&A patterns |
| `seo_settings` | Per-page SEO configuration |
| `contact_submissions` | Contact form entries |
| `profiles` | User profiles |
| `user_roles` | Role-based access control |

---

## 👤 Admin Access

Default admin emails (configured in database trigger):
- `ceo@engineerstechbd.com`
- `admin@engineerstechbd.com`
- `info@engineerstechbd.com`

To add new admin users, update the `handle_new_user()` function in Supabase.

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── admin/          # Admin panel components
│   │   ├── chatbot/        # AI chatbot widget
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, Footer, Layout
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/
│   │   ├── useBranding.tsx # Dynamic branding hook
│   │   └── useAuth.tsx     # Authentication hook
│   ├── pages/
│   │   ├── admin/          # Admin dashboard pages
│   │   └── *.tsx           # Public pages
│   ├── integrations/
│   │   └── supabase/       # Supabase client & types
│   └── index.css           # Global styles & design tokens
├── supabase/
│   ├── functions/          # Edge functions
│   └── config.toml         # Supabase configuration
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
└── public/                 # Static assets
```

---

## 🔧 Customization

### Branding

1. Log in to admin panel (`/auth`)
2. Go to **Branding Settings**
3. Upload logo, update colors, contact info, social links
4. Changes reflect across the entire site

### SEO

1. Go to **SEO Settings** in admin
2. Configure meta titles, descriptions, keywords per page
3. Upload OG images for social sharing
4. Use "Generate with AI" for automated suggestions

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### FTP Connection Issues

- Verify FTP credentials in cPanel
- Check if passive mode is required
- Ensure `public_html` directory exists

### 404 Errors on Routes

- Verify `.htaccess` is deployed to `public_html`
- Check if `mod_rewrite` is enabled in cPanel

---

## 📚 Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 📄 License

This project is proprietary. All rights reserved by engineersTech.

---

Built with ❤️ using [Lovable](https://lovable.dev)
