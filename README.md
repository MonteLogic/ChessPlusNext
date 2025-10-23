# MoMegaTemplate PWA

A comprehensive Next.js 14+ PWA starter template designed to kickstart your modern web applications with a powerful GitHub markdown-based blog system and enterprise-grade features.

> **Note**: This template now includes a placeholder blog content structure that works out of the box. You can replace it with your own GitHub submodule or continue using the placeholder structure for development.

## 🚀 Features

### 📝 **Headless Blog System**
- **GitHub Markdown Integration**: Write your blog posts in markdown files stored in the `your-gh-submodule-gh-repo/posts/` directory
- **Placeholder Structure**: Includes working placeholder content that works out of the box
- **Automatic Path Generation**: Scripts automatically discover and index all markdown files
- **Frontmatter Support**: Rich metadata support including title, date, description, tags, author, and status
- **Category System**: Organized blog categories with automatic navigation
- **Role-Based Access**: Public/private post visibility with user role management
- **SEO Optimized**: Built-in Open Graph and Twitter card support

### 🎨 **Modern UI/UX**
- **Tailwind CSS**: Fully configured with custom design system
- **Dark Mode**: Built-in dark theme with smooth transitions
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Component Library**: 50+ pre-built UI components
- **Typography**: Beautiful typography with Tailwind Typography plugin

### 🔐 **Authentication & Authorization**
- **Clerk Integration**: Complete authentication system with user management
- **Placeholder Keys**: Works with placeholder keys for development
- **Role-Based Access Control**: Admin, Contributor, and User roles
- **Organization Support**: Multi-tenant organization management
- **Protected Routes**: Secure page access based on user roles
- **Graceful Fallback**: App works without authentication when keys are missing

### 💳 **Payment Integration**
- **Stripe Integration**: Complete payment processing setup
- **Placeholder Keys**: Works with placeholder keys for development
- **Subscription Management**: Recurring billing and subscription handling
- **Webhook Support**: Secure webhook handling for payment events
- **Price Management**: Dynamic pricing and product management
- **Graceful Fallback**: API routes handle missing keys gracefully

### 🗄️ **Database & Data Management**
- **Drizzle ORM**: Type-safe database operations with SQLite
- **Database Migrations**: Version-controlled schema changes
- **User Management**: Complete user profile and organization data
- **Route Management**: Complex scheduling and route management system
- **Time Tracking**: Work time and shift management

### 🛠️ **Developer Experience**
- **TypeScript**: Full type safety throughout the application
- **ESLint & Prettier**: Code quality and formatting tools
- **Testing Setup**: Vitest and Playwright testing configuration
- **Hot Reload**: Fast development with Next.js dev server
- **Path Aliases**: Clean imports with `#/` alias

### 📁 **File Structure**
```
MoMegaTemplate-pwa/
├── app/                           # Next.js 14+ App Router
│   ├── blog/                     # Blog system pages
│   ├── api/                      # API routes
│   ├── ui/                       # UI components
│   └── [slug]/                   # Dynamic routes
├── your-gh-submodule-gh-repo/    # Blog content directory (placeholder)
│   ├── posts/                    # Markdown blog posts
│   ├── package.json              # Placeholder package config
│   ├── pipeline.ts               # Content pipeline script
│   └── README.md                 # Documentation
├── ui/                           # Reusable UI components
├── utils/                        # Utility functions
├── db/                           # Database schema and migrations
├── public/                       # Static assets
├── .env.local                    # Environment variables (with placeholders)
└── scripts/                      # Build and utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.x or later
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MoMegaTemplate-pwa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment variables are pre-configured!**
   The template comes with placeholder environment variables in `.env.local` that allow the app to run immediately:
   - ✅ Clerk placeholder keys (authentication disabled)
   - ✅ Stripe placeholder keys (graceful error handling)
   - ✅ Database configuration
   - ✅ All other required variables

4. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see your application!

> **🎉 That's it!** The app works out of the box with placeholder content and keys. No additional setup required for development.

## 📝 Blog System Usage

### Creating Blog Posts

1. **Add markdown files** to `your-gh-submodule-gh-repo/posts/`
2. **Use frontmatter** for metadata:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2024-01-15"
   description: "Post description"
   tags: ["tag1", "tag2"]
   author: "Author Name"
   status: "public" # or "private"
   ---
   
   Your blog post content here...
   ```

3. **Regenerate paths** after adding posts:
   ```bash
   pnpm run generate-markdown-paths
   ```

### Blog Organization

- **Categories**: Define in `blog-schema/categories-schema.json`
- **File Structure**: Organize posts in subdirectories
- **Slug Generation**: Automatic URL-friendly slug generation
- **Access Control**: Role-based post visibility

### Using Your Own GitHub Submodule (Optional)

If you want to replace the placeholder with your own GitHub submodule:

1. **Remove the placeholder**
   ```bash
   rm -rf your-gh-submodule-gh-repo
   ```

2. **Add your submodule**
   ```bash
   git submodule add <your-repo-url> your-gh-submodule-gh-repo
   ```

3. **Update the path in scripts** (if using a different directory name)
   - Edit `scripts/generate.ts` and update the `markdownSourceDir` path

4. **Install submodule dependencies** (if needed)
   ```bash
   cd your-gh-submodule-gh-repo && pnpm install
   ```

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update `styles/globals.css` for global styles
- Customize components in the `ui/` directory

### Components
- 50+ pre-built components in `ui/` directory
- Reusable blog components in `ui/blog-components/`
- Customizable layouts and templates

### Database
- Modify `db/schema.ts` for data structure changes
- Run migrations with Drizzle Kit
- Add new API routes in `app/api/`

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:playwright

# Run database tests
pnpm test:db
```

## 🔧 Placeholder System

This template includes a complete placeholder system that allows you to:

### ✅ **What Works Out of the Box**
- **Development Server**: Runs immediately with `pnpm dev`
- **Blog System**: Placeholder blog post included and working
- **Markdown Generation**: Automatic path generation works
- **UI Components**: All components render correctly
- **PWA Features**: Service worker and offline capabilities
- **Database**: SQLite database with migrations
- **API Routes**: All routes handle missing keys gracefully

### 🔑 **Placeholder Keys**
The template includes placeholder environment variables for:
- **Clerk**: Authentication disabled, app works without login
- **Stripe**: API routes return helpful error messages
- **Database**: SQLite file-based database
- **Other Services**: All configured with safe defaults

### 🚀 **Production Setup**
When ready for production, simply replace the placeholder keys in `.env.local` with your real API keys:
- Get Clerk keys from [dashboard.clerk.com](https://dashboard.clerk.com)
- Get Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com)
- Update other service configurations as needed

## 📦 Available Scripts

- `pnpm dev` - Start development server (works immediately!)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prettier` - Format code with Prettier
- `pnpm generate-markdown-paths` - Generate blog post paths
- `pnpm stripe:listen` - Listen to Stripe webhooks locally

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- Configure your preferred hosting platform
- Set up environment variables
- Run `pnpm build` and serve the output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Clerk](https://clerk.com/) for authentication
- [Stripe](https://stripe.com/) for payments
- [Drizzle](https://orm.drizzle.team/) for database management

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the example implementations

## 🎯 Key Benefits

- **⚡ Zero Setup**: Works immediately after `pnpm install && pnpm dev`
- **🔧 Placeholder System**: No need to configure API keys for development
- **📝 Blog Ready**: Complete markdown blog system with sample content
- **🔐 Auth Ready**: Clerk integration with graceful fallback
- **💳 Payment Ready**: Stripe integration with error handling
- **📱 PWA Ready**: Progressive Web App features included
- **🎨 UI Ready**: 50+ pre-built components
- **🗄️ Database Ready**: Drizzle ORM with SQLite
- **🧪 Test Ready**: Vitest and Playwright configured

---

**MoMegaTemplate PWA** - Your all-in-one Next.js 14+ PWA starter template that works out of the box! 🚀