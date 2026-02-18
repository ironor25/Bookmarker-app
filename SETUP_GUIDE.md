# Smart Bookmark - Setup & Deployment Guide

## Overview

Smart Bookmark is a production-ready, real-time bookmark manager built with:

- **Next.js 14+** with App Router
- **Supabase** for authentication, database, and realtime
- **Tailwind CSS** for styling
- **Deployed on Vercel**

## Prerequisites

Before you start, you'll need:

1. A [Supabase](https://supabase.com) account
2. A [Google OAuth Application](https://console.cloud.google.com)
3. A [Vercel](https://vercel.com) account (for deployment)
4. Node.js 18+ installed locally

---

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: smart-bookmark (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click **Create new project** and wait for initialization

### 1.2 Get Your API Keys

After the project is created:

1. Go to **Settings** → **API** in the left sidebar
2. Copy your:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Save these values - you'll need them later

### 1.3 Create the Bookmarks Table

1. Go to **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Paste this SQL to create the table:

```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
```

4. Click **"Run"** to execute the query

### 1.4 Enable Row Level Security (RLS)

1. Go to **Authentication** → **Policies** in the left sidebar
2. Click on the **bookmarks** table
3. Click **"Enable RLS"** if not already enabled
4. Add the following policies:

**Policy 1: SELECT (Read own bookmarks)**

- Click **"New Policy"** → **"For full customization"**
- **Policy name**: `Users can select their own bookmarks`
- **Target roles**: authenticated
- **Command**: SELECT
- **Expression**:

```sql
auth.uid() = user_id
```

- Click **"Review"** → **"Save policy"**

**Policy 2: INSERT (Create own bookmarks)**

- Click **"New Policy"** → **"For full customization"**
- **Policy name**: `Users can insert their own bookmarks`
- **Target roles**: authenticated
- **Command**: INSERT
- **Expression**:

```sql
auth.uid() = user_id
```

- Click **"Review"** → **"Save policy"**

**Policy 3: DELETE (Delete own bookmarks)**

- Click **"New Policy"** → **"For full customization"**
- **Policy name**: `Users can delete their own bookmarks`
- **Target roles**: authenticated
- **Command**: DELETE
- **Expression**:

```sql
auth.uid() = user_id
```

- Click **"Review"** → **"Save policy"**

### 1.5 Enable Realtime

1. Go to **Database** → **Tables** in the left sidebar
2. Click on the **bookmarks** table
3. In the **Realtime** section on the right, toggle **ON**
4. Select which events to broadcast: **INSERT, UPDATE, DELETE** (all checked)

### 1.6 Set Up Google OAuth

1. Go to **Authentication** → **Providers** in the left sidebar
2. Click **Google**
3. Take note of the **Redirect URL** shown (you'll need this for Google Cloud)
4. Keep this tab open for now

#### Now set up Google Cloud OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (if you don't have one):
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Enter project name: "Smart Bookmark"
   - Click **"Create"**
3. Enable the Google+ API:
   - Search for "Google+ API" in the search bar
   - Click on it and press **"Enable"**
4. Create OAuth 2.0 credentials:
   - Go to **Credentials** in the left sidebar
   - Click **"+ Create Credentials"** → **"OAuth client ID"**
   - If prompted, configure OAuth consent screen first:
     - Select **External** for user type
     - Fill in required fields (App name, Support email, etc.)
     - In scopes, add: `email`, `profile`, `openid`
     - Add yourself as a test user
     - Complete and return to credentials
   - For **Application Type**, select **Web application**
   - Add these **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (for local dev)
     - The Redirect URL from Supabase (from step 1.6.3)
   - Click **"Create"**
5. Copy your **Client ID** and **Client Secret**

Back to Supabase:

1. On the Google provider page, paste your **Client ID** and **Client Secret**
2. Click **"Save"**

---

## Step 2: Local Development Setup

### 2.1 Clone and Install Dependencies

```bash
cd smart-bookmark
npm install
```

### 2.2 Configure Environment Variables

1. Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

2. Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.3 Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 2.4 Test the App

1. Visit `http://localhost:3000`
2. You should be redirected to `/login`
3. Click **"Sign in with Google"**
4. After authentication, you'll be redirected to `/dashboard`
5. Try adding, viewing, and deleting bookmarks
6. Open the app in two tabs/windows - changes should sync in real-time

---

## Step 3: Deployment to Vercel

### 3.1 Push Code to GitHub

1. Initialize git (if not already done):

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark"
```

2. Create a repository on GitHub and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark.git
git branch -M main
git push -u origin main
```

### 3.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - Leave build settings as default
5. Add environment variables:
   - Click **"Environment Variables"**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`: your_supabase_url
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: your_anon_key
     - `NEXT_PUBLIC_APP_URL`: https://your-vercel-url.vercel.app
6. Click **"Deploy"**

Wait for deployment to complete (you'll get a Vercel URL).

### 3.3 Update Supabase Configuration

1. Go back to your Supabase project
2. Go to **Authentication** → **Providers** → **Google**
3. Under **Authorized redirect URLs**, add:
   - Your Vercel URL: `https://your-vercel-url.vercel.app/auth/callback`

### 3.4 Update Google OAuth Redirect URLs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to **Credentials** → Click on your OAuth client
3. Add your Vercel URL to **Authorized redirect URIs**:
   - `https://your-vercel-url.vercel.app/auth/callback`
4. Click **"Save"**

---

## Troubleshooting

### "Login button doesn't work"

- Check that Google OAuth credentials are correctly set in Supabase
- Verify redirect URLs match exactly in both Google Cloud and Supabase
- Check browser console for error messages

### "Bookmarks not loading"

- Verify `.env.local` has correct Supabase URL and anon key
- Ensure RLS policies are properly enabled on the bookmarks table
- Check that you're logged in (check user session in browser devtools)

### "Changes not syncing in real-time"

- Verify Realtime is enabled on the bookmarks table in Supabase
- Check that you're connected to the same Supabase project
- Open browser console and look for socket connection errors

### "Build fails on Vercel"

- Ensure all environment variables are set in Vercel project settings
- Check that TypeScript builds correctly locally: `npm run build`
- Review Vercel deployment logs for specific error messages

---

## Project Structure

```
smart-bookmark/
├── app/
│   ├── auth/
│   │   └── callback/route.ts       # OAuth callback handler
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Root page (redirects)
│   └── globals.css                 # Global styles
├── components/
│   ├── Navbar.tsx                  # Header navigation
│   ├── AddBookmarkForm.tsx         # Add bookmark form
│   ├── BookmarkCard.tsx            # Individual bookmark card
│   ├── BookmarkSkeleton.tsx        # Loading skeleton
│   └── EmptyState.tsx              # Empty state UI
├── lib/
│   ├── supabaseClient.ts           # Client-side Supabase config
│   └── authHelpers.ts              # Server-side Supabase config
├── middleware.ts                   # Next.js middleware
├── .env.local.example              # Environment template
└── package.json
```

---

## Key Features Implemented

✅ **Authentication**

- Google OAuth only
- Session persistence
- Automatic redirects for unauthorized users
- Logout functionality in navbar

✅ **Real-time Sync**

- Supabase Realtime subscriptions
- Instant bookmark updates across tabs
- No manual refresh needed

✅ **Security**

- Row Level Security (RLS) policies
- Users can only see/edit their own bookmarks
- Secure server-side session handling

✅ **UI/UX**

- Premium SaaS design (inspired by Vercel/Linear)
- Dark mode with teal accent color
- Glass-morphism cards
- Smooth animations and transitions
- Responsive grid layout
- Loading skeletons
- Empty states

✅ **Production Ready**

- TypeScript throughout
- Proper error handling
- Environment variable configuration
- Vercel deployment ready
- Optimized performance
- Clean, modular code

---

## Next Steps / Future Enhancements

- [ ] Add bookmark search and filtering
- [ ] Implement bookmark folders/tags
- [ ] Add bookmark preview on hover
- [ ] Implement bookmark bulk operations
- [ ] Add browser extension for quick saves
- [ ] Email notifications for shared bookmarks
- [ ] Dark/light mode toggle
- [ ] Export bookmarks to JSON/CSV

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Review Next.js documentation: https://nextjs.org/docs
4. Check Vercel deployment docs: https://vercel.com/docs

---

## License

MIT
