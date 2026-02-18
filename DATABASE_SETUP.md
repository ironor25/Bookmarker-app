# Database Setup for Smart Bookmark

This file contains all the SQL needed to set up your Supabase database for Smart Bookmark.

## Quick Setup

Copy and paste all SQL below into Supabase SQL Editor and run.

## Full SQL Setup

```sql
-- 1. Enable necessary extensions (UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id
  ON public.bookmarks(user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at
  ON public.bookmarks(created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Policy 1: Users can SELECT their own bookmarks
CREATE POLICY "Users can select their own bookmarks"
  ON public.bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Users can INSERT their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can DELETE their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 4: Users can UPDATE their own bookmarks (for future use)
CREATE POLICY "Users can update their own bookmarks"
  ON public.bookmarks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.bookmarks TO authenticated;
GRANT SELECT ON public.bookmarks TO anon;
```

## Step-by-Step Instructions

### 1. Copy the SQL

Copy everything in the "Full SQL Setup" section above.

### 2. Open Supabase SQL Editor

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **"New Query"**

### 3. Paste and Run

1. Paste the SQL into the editor
2. Click **"Run"** button (or Cmd+Enter)
3. Wait for execution to complete
4. You should see no errors

### 4. Verify Setup

Check that everything was created:

```sql
-- View table structure
\d public.bookmarks

-- View all policies
SELECT * FROM pg_policies WHERE tablename = 'bookmarks';

-- View all indexes
SELECT * FROM pg_indexes WHERE tablename = 'bookmarks';
```

## What Each Part Does

### Extensions

- `uuid-ossp`: Enables UUID data type for unique IDs

### Table Structure

- `id`: Unique identifier (UUID), auto-generated
- `user_id`: Reference to the authenticated user
- `title`: Bookmark title (text)
- `url`: Bookmark URL (text)
- `created_at`: Timestamp when bookmark was created

### Foreign Key Constraint

- `ON DELETE CASCADE`: If user is deleted, all their bookmarks are deleted

### Indexes

- Speeds up queries that filter by `user_id`
- Speeds up sorting by `created_at`

### Row Level Security (RLS)

- SELECT: Users can only see their own bookmarks
- INSERT: Users can only create bookmarks with their own user_id
- DELETE: Users can only delete their own bookmarks
- UPDATE: Users can only update their own bookmarks (for future use)

## Enable Realtime

After creating the table:

1. Go to **Database** → **Tables** in the left sidebar
2. Click on the **bookmarks** table
3. Click the **Realtime** menu on the right side panel
4. Toggle **ON**
5. Select which events to broadcast:
   - ✅ INSERT
   - ✅ UPDATE
   - ✅ DELETE
6. Click **Save**

## Verify Everything Works

### Test RLS Policies

```sql
-- Switch to authenticated context (replace with your user_id)
SET request.jwt.claims = '{"sub": "your-user-id-here"}';

-- This should work (selecting own bookmarks)
SELECT * FROM public.bookmarks;

-- Switch to different user
SET request.jwt.claims = '{"sub": "different-user-id"}';

-- This should return empty (not seeing other user's bookmarks)
SELECT * FROM public.bookmarks;
```

## Backup Your Data

To backup your bookmarks:

```bash
# Using psql (if you have PostgreSQL client)
PGPASSWORD=your-password pg_dump -h db.supabase.co -U postgres \
  -d postgres -t public.bookmarks > bookmarks_backup.sql
```

Or use Supabase dashboard:

1. Go to **Database** → **Backups**
2. Click **"New Backup"**

## Restore from Backup

If needed, you can restore from a backup:

1. Go to **Database** → **Backups**
2. Click the backup you want
3. Click **"Restore"** button
4. Confirm the action

## Troubleshooting

### "Permission denied" when creating table

**Cause**: Not authenticated as the right role

**Solution**:

- Make sure you're authenticated with your Supabase admin account
- Try running from a fresh SQL editor session

### "Relation already exists" error

**Cause**: Table already created

**Solution**:

- The `IF NOT EXISTS` clauses prevent errors
- You can safely run again, or use this to drop and recreate:

```sql
DROP TABLE IF EXISTS public.bookmarks CASCADE;
-- Then run the full setup again
```

### RLS policies not working

**Cause**: RLS not enabled or policies misconfigured

**Solution**:

1. Verify RLS is enabled: `ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;`
2. Check all policies are created: `SELECT * FROM pg_policies WHERE tablename = 'bookmarks';`
3. Verify auth context is set correctly in your app

### Realtime not updating

**Cause**: Realtime not enabled or WebSocket connection issue

**Solution**:

1. In Supabase dashboard, verify Realtime is toggled ON
2. Check all three events (INSERT, UPDATE, DELETE) are selected
3. Check browser console for WebSocket errors
4. Try a hard refresh in browser

## Next Steps

Once database is ready:

1. Configure Google OAuth (see SETUP_GUIDE.md)
2. Set environment variables
3. Run the app locally
4. Test CRUD operations and real-time sync

## Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/sql-editor)
