# BookMark App

A production-ready, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

**Core Features**

-  **Google OAuth Authentication** - Secure sign-in with Google
-  **Bookmark Management** - Add, view, and delete bookmarks with ease
-  **Real-time Sync** - Changes sync instantly across all tabs using Supabase Realtime
- **Premium Design** - SaaS-inspired UI inspired by Vercel and Linear
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Secure** - Row Level Security ensures users only see their own bookmarks
- **Production Ready** - Built with TypeScript, proper error handling, and best practices

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org) with App Router
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **Real-time**: Supabase Realtime (WebSocket subscriptions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Deployment**: [Vercel](https://vercel.com)
- **Language**: [TypeScript](https://www.typescriptlang.org)

## Project Structure

```text
smart-bookmark/
├── app/                            # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx         # Google OAuth login
│   │   └── auth/callback/route.ts # OAuth callback
│   ├── dashboard/page.tsx          # Main app
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Auto-redirect page
│   └── globals.css                 # Global styles
├── components/                     # Reusable React components
│   ├── Navbar.tsx                  # Navigation header
│   ├── AddBookmarkForm.tsx         # Bookmark input form
│   ├── BookmarkCard.tsx            # Bookmark display card
│   ├── BookmarkSkeleton.tsx        # Loading skeleton
│   └── EmptyState.tsx              # Empty state message
├── lib/                            # Utility functions
│   ├── supabaseClient.ts           # Client-side Supabase setup
│   └── authHelpers.ts              # Server-side Supabase setup
├── middleware.ts                   # Next.js middleware for auth
├── .env.local.example              # Example environment variables
└── SETUP_GUIDE.md                  # Detailed setup instructions

```

## Screen Tour

### Login Page

* Google OAuth sign-in button
* Responsive design with glass-morphism card
* Teal accent color with smooth animations

### Dashboard

* **Navigation Bar**: Logo, user avatar, logout button
* **Page Header**: "Smart Bookmarks" title with description
* **Add Bookmark Form**: Input fields for title and URL with validation
* **Bookmarks Grid**: Responsive grid (1 col mobile, 2 tablet, 3 desktop)
* **Bookmark Cards**: Click to open, hover for delete option
* **Empty State**: Helpful message when no bookmarks exist
* **Loading State**: Skeleton loading while fetching data

## Challenges & Solutions

Building this application introduced a few technical hurdles, particularly regarding authentication, deployment environments, and real-time database synchronization. Here is how I approached and solved them:

### 1. Integrating Google OAuth with Supabase

**The Problem:** Setting up the initial Google Sign-in flow with Supabase Auth was challenging to wire up correctly, as I had to ensure the Next.js frontend securely communicated with the Google Cloud Console and Supabase.
**The Solution:** I read developer blogs, the official Google Cloud API documentation, and utilized AI (Gemini) to break down the steps. This helped me properly configure the OAuth consent screen, obtain the correct Client ID/Secret, and implement the `signInWithOAuth` function in my app.

### 2. The Production Redirect Bug (Localhost loop)

**The Problem:** After successfully deploying the app to Vercel, clicking the Google Login button would unexpectedly redirect the browser back to `localhost:3000`, causing the production app to break.
**The Solution:** After juggling between the codebase and dashboards to find where things went wrong, I realized the issue was an environment configuration mismatch. The "Site URL" and "Redirect URIs" in my Supabase Authentication dashboard were still attached to the local development server. I updated these settings in both Supabase and the Google Cloud Console to point to the live Vercel production URL, which instantly resolved the routing issue.

### 3. Implementing Real-time UI Updates

**The Problem:** The assignment required the UI to update live without refreshing the page. Since Supabase was a new technology to me, I wasn't initially sure how to make the Next.js state listen to database changes.
**The Solution:** I dove into the Supabase documentation and did some AI-assisted research. I discovered Supabase's Realtime Channels. I went into the Supabase Dashboard and explicitly enabled the "Database -> Publications -> supabase_realtime" service for the `bookmarks` table. I then wrote a React `useEffect` hook to subscribe to `postgres_changes`. Initially, I only had it working for adding bookmarks (`INSERT`), but I expanded the logic to also listen for `DELETE` events, ensuring the UI seamlessly removes items in real-time across all tabs.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint

```

## Environment Variables

Required for both local development and production:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_APP_URL=<http://localhost:3000 or production URL>

```

## Deployment Checklist

* [x] Supabase project created and configured
* [x] Bookmarks table with RLS policies created
* [x] Google OAuth credentials obtained
* [x] Code pushed to GitHub
* [x] Vercel project created and linked
* [x] Environment variables added to Vercel
* [x] OAuth redirect URLs updated in Google Cloud and Supabase
* [x] Production URL tested (login, add, delete bookmarks, realtime sync)

## Resources

* [Next.js Documentation](https://nextjs.org/docs)
* [Supabase Documentation](https://supabase.com/docs)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* [Vercel Deployment Guide](https://vercel.com/docs)

---

Built with ❤️ by Deepak Yadav

```

Would you like me to help you draft the final email or submission text to send to your supervisor with the Vercel link and repository attached?

```