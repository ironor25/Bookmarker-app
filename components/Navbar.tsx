'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

type User = {
  email?: string
  user_metadata?: {
    avatar_url?: string
    full_name?: string
  }
} | null

export function Navbar() {
  const [user, setUser] = useState<User>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user as User)
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-teal-400 tracking-tight hover:text-teal-300 transition-colors">
          Smart Bookmark
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    className="w-8 h-8 rounded-full ring-2 ring-teal-400/30"
                  />
                )}
                <span className="text-sm text-gray-300 truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-teal-400"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
