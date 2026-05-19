# Setup Guide

## Prerequisites
- Node.js (via nvm4w)
- GitHub CLI (`gh`)
- Vercel account
- PostgreSQL (via Vercel Postgres)

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Admin credentials
ADMIN_USERNAME=
ADMIN_PASSWORD=

# PSN
NPSSO_TOKEN=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=
```

## Getting NPSSO Token
1. Login to PlayStation Network in browser
2. Go to: https://ca.account.sony.com/api/v1/ssocookie
3. Copy the `npsso` value
4. Paste into `.env.local` as `NPSSO_TOKEN`
5. Token expires — repeat when PSN sync stops working

## Deployment (Vercel)
1. Push to GitHub
2. Vercel auto-deploys from master branch
3. Add environment variables in Vercel dashboard
4. Add Vercel Postgres database in Vercel dashboard
