# Cloudflare Pages Deployment Guide for SubhanPlays

## Prerequisites
- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- PostgreSQL database (Cloudflare D1, Neon, Supabase, or external)
- Discord webhook URL for admin auth
- YouTube API key (optional)

## Build Configuration

### In Cloudflare Pages Dashboard:
```
Framework preset: Next.js (Static HTML Export) / Next.js (SSR)
Build command: npm run build
Build output directory: .next/standalone (for SSR) or out (for static)
Root directory: /
Node.js version: 22
```

### For SSR (Recommended - full functionality):
```bash
# Build command
npm run build

# Output directory
.next/standalone
```

### For Static Export (Limited - no API routes, no auth):
```bash
# Add to next.config.ts:
output: 'export',
images: { unoptimized: true },

# Build command
npm run build

# Output directory
out
```

## Environment Variables (Set in Cloudflare Pages > Settings > Environment Variables)

```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
SESSION_SECRET=your-32-char-random-string
PUBLIC_URL=https://your-project.pages.dev
DISCORD_ADMIN_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
ADMIN_KEY_ROTATION_HOURS=24
ADMIN_KEY_LENGTH=32
ADMIN_SESSION_DURATION=12h
ADMIN_AUTH_MAX_ATTEMPTS=5
ADMIN_AUTH_LOCKOUT_MINUTES=15
YOUTUBE_API_KEY=your-youtube-key
STORAGE_PATH=/tmp/storage
BACKUP_PATH=/tmp/backups
```

## Required Cloudflare Services

### 1. Database (Choose one):
- **Neon** (PostgreSQL) - `postgresql://...` 
- **Supabase** (PostgreSQL) - `postgresql://...`
- **PlanetScale** (MySQL) - requires schema changes
- **Cloudflare D1** (SQLite) - requires schema changes (no Prisma native support yet)
- **Railway/Render** PostgreSQL

### 2. File Storage (Cloudflare R2):
```bash
# Add to wrangler.toml or Pages Functions
# Use R2 binding for file uploads
```

### 3. Cron Jobs (for key rotation):
```toml
# wrangler.toml
[triggers]
crons = ["0 * * * *"]  # Every hour to check rotation
```

## Deploy Commands

### Via Dashboard (Auto-deploy on push):
1. Connect GitHub repo in Cloudflare Pages
2. Configure build settings above
3. Add environment variables
4. Push to main → auto-deploys

### Via Wrangler CLI:
```bash
# Install wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy (from project root)
wrangler pages deploy .next/standalone --project-name=subhanplays --branch=main --commit-dirty=true
```

### Via GitHub Actions (CI/CD):
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: subhanplays
          directory: .next/standalone
          branch: main
```

## Important Notes for Cloudflare Pages

### SSR Limitations:
- **Edge Runtime**: Next.js API routes run on Cloudflare Workers (V8 isolates)
- **Node.js APIs**: Some APIs not available (fs, crypto.subtle works)
- **Prisma**: Use `prisma generate --no-engine` and Data Proxy or Accelerate
- **File System**: Use R2 or KV instead of local `storage/`

### Required Code Changes for Cloudflare:

1. **Prisma Adapter** (in `lib/database.ts`):
```typescript
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())
```

2. **Storage** - Replace local fs with R2:
```typescript
// lib/storage.ts - use R2 binding
```

3. **Cron for Key Rotation** - Use Cloudflare Workers Cron Trigger

### Alternative: Use Cloudflare Workers + Assets (New)
```bash
# Deploy as Workers with Assets (better SSR support)
wrangler deploy --config wrangler.toml
```

## Quick Start Checklist

- [ ] Create PostgreSQL database (Neon/Supabase)
- [ ] Run `npm run db:generate && npm run db:push` locally
- [ ] Set all env vars in Cloudflare Pages
- [ ] Configure custom domain (subhanplays.qzz.io)
- [ ] Enable "Functions" for API routes
- [ ] Set up R2 bucket for file storage
- [ ] Configure Discord webhook
- [ ] Test admin auth flow

## Custom Domain Setup
1. Pages > Custom Domains > Add `subhanplays.qzz.io`
2. Add CNAME: `subhanplays.qzz.io` → `your-project.pages.dev`
3. Enable "Always Use HTTPS"