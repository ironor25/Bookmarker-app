# Smart Bookmark

A production-ready, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

✨ **Core Features**

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google
- 🔗 **Bookmark Management** - Add, view, and delete bookmarks with ease
- ⚡ **Real-time Sync** - Changes sync instantly across all tabs using Supabase Realtime
- 🎨 **Premium Design** - SaaS-inspired UI inspired by Vercel and Linear
- 📱 **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- 🛡️ **Secure** - Row Level Security ensures users only see their own bookmarks
- ⚙️ **Production Ready** - Built with TypeScript, proper error handling, and best practices

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org) with App Router
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **Real-time**: Supabase Realtime (WebSocket subscriptions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Deployment**: [Vercel](https://vercel.com)
- **Language**: [TypeScript](https://www.typescriptlang.org)

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account
- A Google OAuth application
- A Vercel account (for production)

### Local Development

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.local.example .env.local
```

3. **Fill in your Supabase credentials** (follow [SETUP_GUIDE.md](SETUP_GUIDE.md))

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
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

## Setup & Deployment

For detailed setup and deployment instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Quick overview:**

1. Create a Supabase project and configure the bookmarks table
2. Enable Row Level Security with user-specific policies
3. Enable Realtime on the bookmarks table
4. Set up Google OAuth credentials
5. Add environment variables
6. Deploy to Vercel and complete OAuth configuration

## API & Database

### Bookmarks Table Schema

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### Row Level Security Policies

- ✅ Users can SELECT their own bookmarks
- ✅ Users can INSERT their own bookmarks
- ✅ Users can DELETE their own bookmarks
- ❌ No cross-user access

## Screen Tour

### Login Page

- Google OAuth sign-in button
- Responsive design with glass-morphism card
- Teal accent color with smooth animations

### Dashboard

- **Navigation Bar**: Logo, user avatar, logout button
- **Page Header**: "Smart Bookmarks" title with description
- **Add Bookmark Form**: Input fields for title and URL with validation
- **Bookmarks Grid**: Responsive grid (1 col mobile, 2 tablet, 3 desktop)
- **Bookmark Cards**: Click to open, hover for delete option
- **Empty State**: Helpful message when no bookmarks exist
- **Loading State**: Skeleton loading while fetching data

## Features in Action

### Real-time Sync

Open the app in two browser tabs:

1. Add a bookmark in tab 1
2. Watch it appear instantly in tab 2 without refreshing
3. Delete from tab 2, watch it disappear from tab 1
4. All magic happens via Supabase Realtime subscriptions

### Security

- Only Google OAuth sign-in (no email/password)
- Automatic session validation with middleware
- Row Level Security ensures data isolation
- Users can only see/edit their own bookmarks

### Validation

- URL format verification
- Prevents empty titles or URLs
- User-friendly error messages
- Smooth loading and error states

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

### Code Quality

- ✅ Full TypeScript support
- ✅ No deprecated patterns
- ✅ Server Components where possible
- ✅ Proper async/await handling
- ✅ Clean, modular components
- ✅ Comprehensive error handling

## Environment Variables

Required for both local development and production:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_APP_URL=<http://localhost:3000 or production URL>
```

## Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Bookmarks table with RLS policies created
- [ ] Google OAuth credentials obtained
- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables added to Vercel
- [ ] OAuth redirect URLs updated in Google Cloud and Supabase
- [ ] Production URL tested (login, add, delete bookmarks, realtime sync)

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Authentication Issues

- Verify Google OAuth credentials are correct
- Check redirect URLs in both Google Cloud and Supabase
- Clear browser cookies and try again

### Real-time Not Working

- Ensure Realtime is enabled on bookmarks table
- Check browser console for WebSocket errors
- Verify you're authenticated

### Build Failures

- Run `npm run build` locally to identify issues
- Check that all environment variables are set
- Review Vercel deployment logs

For detailed troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

## Performance Optimizations

- ⚡ Next.js automatic code splitting
- 🖼️ Optimized images and fonts
- 📦 Minimal bundle size
- 🔄 Efficient real-time subscriptions
- 🎯 Server-side session handling
- 📊 Indexed database queries

## Security Best Practices

- 🔐 Google OAuth for authentication
- 🛡️ Row Level Security on database
- 🔒 Secure session management
- ✅ Environment variable protection
- 🚫 No sensitive data in client code
- 🔑 Proper API key scoping

## Future Enhancements

- Search and filtering
- Bookmark folders/categories
- Tags and labels
- Bookmark sharing
- Browser extensions
- Mobile app
- Export/import features
- Bulk operations
- Analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or suggestions:

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed documentation
2. Review the troubleshooting section
3. Check existing GitHub issues
4. Create a new issue with detailed information

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

Built with ❤️ by the Smart Bookmark team
