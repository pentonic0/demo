# Institutional School Website — Next.js 16

This project has been converted from a Vite + React app to a **Next.js 16 App Router** project while preserving the original design, pages, and feature flow as closely as possible.

## Stack

- Next.js 16.2.2
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (Postgres Database, Storage, Auth)

## Security improvements included

- Built-in Custom User Auth with JWT and Supabase Postgres
- Secure Supabase Storage via Next.js route handlers
- Upload file type allowlist
- Upload file size limit (10MB)
- Basic upload rate limiting
- Security headers (CSP, nosniff, frame protection, permissions policy)
- API no-store middleware

## Run locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy environment variables
   ```bash
   cp .env.example .env.local
   ```
3. Fill in Supabase keys and JWT Secret in `.env.local`
4. Start development server
   ```bash
   npm run dev
   ```

## Notes

- The application has been fully migrated from Firebase and Cloudinary to a complete Supabase architecture (Postgres + Storage).
- A custom Authentication Provider was written to replace Firebase Auth, using Secure HTTP Only cookies.
- Real-time Firestore subscriptions have been replaced with Next.js App Router compatible async Supabase queries.
