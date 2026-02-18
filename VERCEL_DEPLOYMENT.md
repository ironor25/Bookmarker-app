# Vercel Deployment Guide

This guide walks through deploying Smart Bookmark to Vercel step-by-step.

## Prerequisites

Before deploying, ensure you have completed:

1. ✅ Supabase project created with bookmarks table
2. ✅ RLS policies configured
3. ✅ Google OAuth credentials obtained
4. ✅ Code pushed to GitHub
5. ✅ Vercel account created

## Step 1: Create Vercel Project

### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. Find your `smart-bookmark` repository and click **"Import"**
4. Configure the project:
   - **Framework Preset**: Select **Next.js**
   - **Build and Output Settings**: Keep defaults
5. Click **"Deploy"** (it will fail without env vars, that's okay)

### Option B: Using Vercel CLI

```bash
npm install -g vercel
vercel
# Follow the prompts to create a new project
```

## Step 2: Set Environment Variables

### Via Vercel Dashboard

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = [your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key]
NEXT_PUBLIC_APP_URL = https://[your-vercel-url].vercel.app
```

**Important:** Replace `[your-vercel-url]` with your actual Vercel URL (visible in project settings)

4. Click **"Save"** after each variable
5. Redeploy: Click **Deployments** → **Redeploy** latest deployment

### Via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your anon key when prompted

vercel env add NEXT_PUBLIC_APP_URL
# Paste your Vercel URL (e.g., https://smart-bookmark-xyz.vercel.app)

vercel redeploy
```

## Step 3: Update OAuth Redirect URLs

### In Supabase:

1. Go to your Supabase project
2. Go to **Authentication** → **Providers** → **Google**
3. Under **Authorized redirect URLs**, add:
   ```
   https://[your-vercel-url].vercel.app/auth/callback
   ```
4. Click **Save**

### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to **Credentials** → Click your OAuth client
3. Under **Authorized redirect URIs**, add:
   ```
   https://[your-vercel-url].vercel.app/auth/callback
   ```
4. Click **Save**

## Step 4: Configure Vercel Domains (Optional)

If you want a custom domain:

1. In Vercel, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update OAuth redirect URLs in both Supabase and Google Cloud with your custom domain

## Step 5: Test Deployment

1. Visit your deployment URL
2. Click "Sign in with Google"
3. You should be redirected to your dashboard after login
4. Test adding and deleting bookmarks
5. Open in another tab to verify real-time sync works
6. Test logout functionality

## Common Deployment Issues

### "Redirect URI mismatch" Error

**Cause**: OAuth redirect URLs don't match exactly

**Solution**:

1. Get your exact Vercel URL from Vercel dashboard
2. Update in Supabase: `https://[exact-url]/auth/callback`
3. Update in Google Cloud: `https://[exact-url]/auth/callback`
4. Clear browser cookies and try again
5. Redeploy if environment variables were added

### "Environment variables not set" Error

**Cause**: Environment variables not properly configured in Vercel

**Solution**:

1. Go to Vercel project settings
2. Verify all variables are set (check for typos, extra spaces)
3. Redeploy after adding variables
4. Check deployment logs for any errors
5. Use `npm run build` locally to verify build works

### "Bookmarks not loading" on Production

**Cause**: SUPABASE_ANON_KEY may be incorrect or Supabase URL wrong

**Solution**:

1. Double-check Supabase credentials in Vercel env vars
2. Ensure key is the **Anon** key, not the service role key
3. Test with a fresh browser session (clear cookies)
4. Check browser console for actual error messages
5. Verify RLS policies allow the authenticated user

### "Real-time not working" on Production

**Cause**: Realtime not enabled on bookmarks table or WebSocket issues

**Solution**:

1. Go to Supabase → Database → Tables → bookmarks
2. Check "Realtime" is enabled on the right panel
3. Ensure INSERT, UPDATE, DELETE are all selected
4. Wait a few seconds after enabling
5. Test in browser's Network tab (look for WebSocket connection)

## Continuous Deployment

Your Vercel project is now configured for automatic deployments:

- Every push to main branch → automatic deployment
- Pull requests generate preview deployments
- Rollback to previous deployments in Deployments tab

## Monitoring & Logs

Check deployment health:

1. **Build Logs**: Settings → Deployments → Click deployment → Build Logs
2. **Runtime Logs**: Settings → Deployments → Click deployment → Logs
3. **Function Logs**: Functions tab (if using serverless functions)

## Performance Tips

- Monitor Core Web Vitals in Vercel Analytics
- Check Real Experience Score dashboard
- Optimize images with Next.js Image component (already done)
- Use Vercel Edge Functions for API routes (optional)

## Rollback a Deployment

If something breaks:

1. Go to **Deployments** tab
2. Find the working deployment
3. Click the **...** menu
4. Select **Promote to Production**

## Auto-Scaling & Limits

- Vercel automatically scales your app
- Free tier has generous limits
- Check Vercel docs for pro/enterprise features
- Monitor usage in project analytics

## Environment Variable Safety

**Important Security Notes:**

- Published environment variables (NEXT*PUBLIC*\*) are visible in client code
- The ANON key is intentionally public (Supabase design)
- RLS policies provide data security, not key secrecy
- Never commit .env.local to git
- Rotate keys if compromised

## Monitoring Supabase Realtime

To ensure Realtime is working in production:

1. Open two browser tabs with your app
2. Add a bookmark in one tab
3. Verify it appears in the other tab instantly (without refresh)
4. Check browser DevTools → Network → WS for WebSocket connections

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Common Issues**: [Troubleshooting section in SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

## Deployment Success Checklist

- [ ] All environment variables added to Vercel
- [ ] OAuth redirect URLs updated in both Supabase and Google Cloud
- [ ] Production deployment succeeds without errors
- [ ] Can sign in with Google on production
- [ ] Can add and delete bookmarks
- [ ] Real-time sync works (tested in 2 tabs)
- [ ] Logout functionality works
- [ ] Empty state shows when no bookmarks
- [ ] Responsive design works on mobile/tablet

Congratulations! Your Smart Bookmark app is now live on Vercel! 🚀
