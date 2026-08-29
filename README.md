# SubhanPlays — Premium YouTube Creator Website + Admin Control Center

A complete, production-ready platform for managing a YouTube creator brand with videos, projects, roadmap, AI-powered flowchart planning, file management, and a secure admin control center.

## Features

### Public Website
- **Premium Dark Design** — Near-black background, charcoal surfaces, YouTube red accents
- **Hero Section** — Cinematic landing with branding and CTAs
- **Video Gallery** — Categorized, filterable YouTube video display with featured video
- **Project Portfolio** — Public projects with status, tech stack, links, changelog, roadmap
- **Roadmap** — Transparent project planning with status phases
- **About & Contact** — Personal bio, tech stack, social links, contact form
- **SEO Optimized** — OpenGraph, Twitter cards, sitemap, structured data

### Admin Control Center (`/panel-x7Kp92mQ4vL8/`)
- **Dashboard** — Stats, recent activity, quick actions, system health
- **Video Management** — Add/edit/delete/feature/hide/reorder videos, auto-fetch from YouTube API
- **Project Management** — Full CRUD with workspaces per project
- **Kanban Task Board** — Drag-and-drop, priorities, dependencies, deadlines
- **React Flow Flowcharts** — Visual architecture planning with pan/zoom/connect, custom node types
- **AI Flowchart Assistant** — Generate architectures from natural language prompts
- **File Manager** — IDE-like with Monaco Editor, versioning, bulk operations
- **Media Library** — Optimized image management
- **Roadmap & Changelog** — Per-project and global
- **Website Editor** — Hero, About, Stats, Social, SEO, Section manager
- **Analytics** — Privacy-conscious tracking with charts
- **Discord Integration** — Webhook notifications for security, content, system events
- **Rotating Secret Authentication** — 24hr keys sent via Discord, one-time use, rate limited
- **Security** — Audit logs, sessions, emergency lockdown, rate limiting
- **Backups** — Automated daily, manual create/download/restore
- **System Health** — CPU, RAM, disk, uptime, API/DB latency

## Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Next.js 14 (App Router, Server Components, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Flowcharts**: React Flow / XYFlow
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **Authentication**: Custom rotating-secret + HttpOnly cookies
- **Deployment**: Docker + Nginx + Certbot

## Getting Started

### Prerequisites
- Node.js 22+
- PostgreSQL 16+
- Docker (for production)

### Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` for the public site.
Admin panel at `http://localhost:3000/panel-x7Kp92mQ4vL8/` (check Discord for auth key).

### Production Deployment

```bash
# Build and start with Docker Compose
docker-compose up -d --build

# Or build standalone
npm run build
npm start
```

### Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — 32+ character random string
- `PUBLIC_URL` — Your domain (e.g., https://subhanplays.qzz.io)
- `DISCORD_ADMIN_WEBHOOK_URL` — Discord webhook for auth keys & notifications
- `YOUTUBE_API_KEY` — Optional, for auto-fetching video data
- `ADMIN_KEY_ROTATION_HOURS` — Key rotation interval (default 24)
- `ADMIN_AUTH_MAX_ATTEMPTS` / `ADMIN_AUTH_LOCKOUT_MINUTES` — Rate limiting

## Architecture

```
Internet → Cloudflare/Nginx → Next.js → PostgreSQL
                    ↓
              Discord Webhook
                    ↓
              YouTube API
```

### Project Structure
```
subhanplays/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public pages
│   ├── panel-*/            # Admin panel (random route)
│   └── api/                # API routes
├── components/             # React components
│   ├── public/             # Public site components
│   ├── admin/              # Admin panel components
│   ├── flowchart/          # React Flow components
│   ├── file-manager/       # File manager components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Core libraries
│   ├── auth/               # Authentication
│   ├── discord/            # Discord integration
│   ├── database/           # Prisma client
│   ├── storage/            # File storage
│   ├── youtube/            # YouTube API
│   ├── analytics/          # Analytics tracking
│   └── security/           # Security utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── storage/                # File storage (gitignored)
├── backups/                # Backup storage (gitignored)
└── scripts/                # Utility scripts
```

## Security Features

- **Rotating Admin Keys** — New cryptographically secure key every 24 hours, sent via Discord
- **One-Time Use** — Keys consumed on login, cannot be reused
- **HttpOnly Cookies** — Secure session management
- **Rate Limiting** — Configurable attempts with lockout and Discord alerts
- **Emergency Lockdown** — Revokes all sessions, disables auth
- **Audit Logging** — All admin actions tracked with IP, user agent, result
- **Path Traversal Protection** — Server-side validation for all file operations
- **CSP Headers** — Strict content security policy

## License

MIT License — feel free to use for your own creator platform.