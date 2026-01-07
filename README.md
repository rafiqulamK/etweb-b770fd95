# engineersTech - Enterprise Tech Solutions

A modern, full-stack web application built with React, TypeScript, and Lovable Cloud. This project features a complete CMS with admin dashboard, blog management, portfolio showcase, live demos, visitor analytics, consultation system, and AI-powered chatbot.

## 🚀 Features

### Core Features
- **Dynamic Branding**: Update logo, colors, and company info from admin panel
- **Blog Management**: Full CRUD with featured images, SEO, and related posts
- **Portfolio/Case Studies**: Showcase projects with image galleries and live previews
- **Demo Projects**: Interactive live preview system with iframe embedding
- **Testimonials**: Manage client reviews with ratings
- **AI Chatbot**: Intelligent customer support with configurable responses
- **SEO Management**: Per-page SEO settings with AI generation
- **Contact Form**: Submissions stored in database

### New Features
- **Live Preview System**: Interactive iframe-based website previews with device switching (Desktop/Tablet/Mobile)
- **Consultation Popup**: Smart popup system triggered by user behavior (time on page, scroll depth, exit intent)
- **WhatsApp Integration**: Floating WhatsApp button with pre-filled messages
- **Visitor Analytics**: Track page views, clicks, scroll depth, and time on page
- **Interaction Heatmaps**: Visual analytics of user interactions
- **GDPR Cookie Consent**: Customizable consent banner with category management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Supabase-powered)
- **Deployment**: GitHub Actions → cPanel

---

## 📋 Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- Git
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

The `.env` file is automatically configured by Lovable Cloud:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

> **Note**: These are automatically managed - do not edit manually.

---

## 🚀 Deployment to cPanel

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |

### Step 2: Deploy

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
4. ✅ Create `deploy-package.zip` artifact

### Step 3: Manual Upload to cPanel

1. Download `deploy-package` artifact from GitHub Actions
2. Login to cPanel File Manager
3. Navigate to `public_html` folder
4. Upload and extract `deploy-package.zip`
5. Delete the ZIP file after extraction

---

## 🗄️ Database Schema

The application uses the following tables:

| Table | Purpose |
|-------|---------|
| `branding_settings` | Logo, colors, contact info, social links, WhatsApp number |
| `blog_posts` | Blog articles with SEO metadata |
| `case_studies` | Portfolio projects with galleries |
| `demo_projects` | Live demo projects with preview settings |
| `testimonials` | Client reviews and ratings |
| `chatbot_config` | AI chatbot Q&A patterns |
| `seo_settings` | Per-page SEO configuration |
| `contact_submissions` | Contact form entries |
| `consultation_requests` | Consultation popup submissions |
| `visitor_analytics` | Page view and engagement metrics |
| `interaction_events` | Click tracking and heatmap data |
| `profiles` | User profiles |
| `user_roles` | Role-based access control |

---

## 👤 Admin Access

Default admin emails (configured in database trigger):
- `ceo@engineerstechbd.com`
- `admin@engineerstechbd.com`
- `info@engineerstechbd.com`

### Admin Panel Features

Navigate to `/admin` after logging in:

- **Dashboard**: Overview of content and analytics
- **Blog Management**: Create, edit, publish blog posts
- **Portfolio Management**: Manage case studies
- **Demo Management**: Configure live demo projects
- **Testimonials**: Manage client reviews
- **Messages**: View contact form submissions
- **Consultations**: Manage consultation requests
- **Analytics**: Visitor analytics dashboard
- **SEO Settings**: Per-page SEO configuration
- **Chatbot Config**: AI chatbot responses
- **Branding**: Logo, colors, contact info
- **Settings**: Account settings

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── admin/          # Admin panel components
│   │   ├── analytics/      # Interaction tracking
│   │   ├── chatbot/        # AI chatbot widget
│   │   ├── consultation/   # Consultation popup & WhatsApp
│   │   ├── gdpr/           # Cookie consent
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, Footer, Layout
│   │   ├── portfolio/      # Live preview components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/
│   │   ├── useAnalytics.tsx  # Analytics tracking
│   │   ├── useAuth.tsx       # Authentication
│   │   ├── useBranding.tsx   # Dynamic branding
│   │   └── useConsent.tsx    # GDPR consent management
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
4. Configure WhatsApp number for floating button
5. Changes reflect across the entire site

### SEO

1. Go to **SEO Settings** in admin
2. Configure meta titles, descriptions, keywords per page
3. Upload OG images for social sharing
4. Use "Generate with AI" for automated suggestions

### Analytics

1. Go to **Analytics** in admin
2. View page views, unique sessions, device breakdown
3. Monitor popular pages and user engagement
4. Track consultation conversion rates

### Live Demos

1. Go to **Demo Management** in admin
2. Add demo projects with:
   - Demo URL for iframe preview
   - Thumbnail fallback image
   - Preview mode (iframe/screenshot/external)
   - Allow interaction toggle
3. View counts are tracked automatically

### Consultation Popup

The popup triggers automatically based on:
- Time on page (45 seconds)
- Scroll depth (60%)
- Exit intent (mouse leaves viewport)

Users can also trigger via:
- "Get Quote" buttons on projects
- WhatsApp floating button

---

## 🔒 GDPR Compliance

The application includes a GDPR-compliant cookie consent system:

- **Cookie Banner**: Appears on first visit
- **Consent Categories**: Necessary, Analytics, Marketing
- **Preference Storage**: Saved to localStorage
- **Analytics Gating**: Tracking only enabled after consent

### Privacy Policy

Update the privacy policy at `/privacy` with:
- Cookie usage explanation
- Data collection purposes
- User rights (access, deletion, portability)
- Contact information for data requests

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 Errors on Routes

- Verify `.htaccess` is deployed to `public_html`
- Check if `mod_rewrite` is enabled in cPanel

### Analytics Not Tracking

- Ensure user has accepted analytics cookies
- Check browser console for errors
- Verify RLS policies allow anonymous inserts

### Live Preview Not Loading

- Some sites block iframe embedding (X-Frame-Options)
- The component falls back to thumbnail automatically
- External sites may require "external" preview mode

---

## 📚 Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)

---

## 📄 License

This project is proprietary. All rights reserved by engineersTech.

---

Built with ❤️ using [Lovable](https://lovable.dev)
