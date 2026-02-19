'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { AddBookmarkForm } from '@/components/AddBookmarkForm'
import { BookmarkCard } from '@/components/BookmarkCard'
import { EmptyState } from '@/components/EmptyState'
import { BookmarkGridSkeleton } from '@/components/BookmarkSkeleton'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initPage = async () => {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUserId(session.user.id)
      // Fetch bookmarks
      await fetchBookmarks()
    }

    initPage()
  }, [router, supabase.auth, supabase])

  const fetchBookmarks = async () => {
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setBookmarks(data || [])
    } catch (err) {
      console.error('Error fetching bookmarks:', err)
      setError('Failed to load bookmarks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) return
    // Subscribe to realtime changes
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks',filter: `user_id=eq.${userId}` },
        async (payload: any) => {
          switch (payload.eventType) {
            case 'INSERT':
              setBookmarks((prev) => [payload.new as Bookmark, ...prev])
              break
            case 'DELETE':
              const deletedId = payload.old?.id;
              if (deletedId) {
                setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
              }
              break;
            case 'UPDATE':
              setBookmarks((prev) =>
                prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
              )
              break
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase,userId])

  const handleAddBookmark = async (title: string, url: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('bookmarks').insert({
        title,
        url,
        user_id: session.user.id,
      })

      if (error) throw error
    } catch (err) {
      console.error('Error adding bookmark:', err)
      setError('Failed to add bookmark')
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Error deleting bookmark:', err)
      setError('Failed to delete bookmark')
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-orange-radial" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/12 rounded-full blur-3xl opacity-28" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl opacity-22" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            BookMarker
          </h1>
          <p className="text-gray-400 text-lg">
            Private. Realtime. Simple.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Add Bookmark Form */}
        <AddBookmarkForm onAdd={handleAddBookmark} />

        {/* Bookmarks Grid */}
        {isLoading ? (
          <BookmarkGridSkeleton />
        ) : bookmarks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                id={bookmark.id}
                title={bookmark.title}
                url={bookmark.url}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
