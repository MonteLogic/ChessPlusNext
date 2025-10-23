# MoMegaTemplate

A comprehensive Next.js 13+ starter template designed to kickstart your modern web applications with a powerful GitHub markdown-based blog system and enterprise-grade features.

## 🚀 Features

### 📝 **Headless Blog System**
- **GitHub Markdown Integration**: Write your blog posts in markdown files stored in the `MoL-blog-content/posts/` directory
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
- **Role-Based Access Control**: Admin, Contributor, and User roles
- **Organization Support**: Multi-tenant organization management
- **Protected Routes**: Secure page access based on user roles

### 💳 **Payment Integration**
- **Stripe Integration**: Complete payment processing setup
- **Subscription Management**: Recurring billing and subscription handling
- **Webhook Support**: Secure webhook handling for payment events
- **Price Management**: Dynamic pricing and product management

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
MoMegaTemplate/
├── app/                    # Next.js 13+ App Router
│   ├── blog/              # Blog system pages
│   ├── api/               # API routes
│   ├── ui/                # UI components
│   └── [slug]/            # Dynamic routes
├── MoL-blog-content/      # Blog content directory
│   └── posts/             # Markdown blog posts
├── ui/                    # Reusable UI components
├── utils/                 # Utility functions
├── db/                    # Database schema and migrations
└── public/                # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.x or later
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MoMegaTemplate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - And other required variables

4. **Initialize the blog content**
   ```bash
   pnpm run setup
   ```

5. **Generate markdown paths**
   ```bash
   pnpm run generate-markdown-paths
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see your application!

## 📝 Blog System Usage

### Creating Blog Posts

1. **Add markdown files** to `MoL-blog-content/posts/`
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

## 📦 Available Scripts

- `pnpm dev` - Start development server
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

---

**MoMegaTemplate** - Your all-in-one Next.js starter template with a powerful markdown blog system! 🚀