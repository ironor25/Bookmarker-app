'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router, supabase.auth])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL }/auth/callback`,
        },
      })
      if (error) {
        console.error('Error signing in:', error)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            BookMarker
          </h1>
          <p className="text-gray-400 text-lg">
            Private. Realtime. Simple.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <p className="text-gray-300 text-center mb-6 text-sm">
            Sign in with Google to get started
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30"
          >
            <Chrome size={20} />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-gray-500 text-xs text-center mt-6">
            We only use your email and profile picture from Google to create your account.
            Your bookmarks are private and encrypted.
          </p>
        </div>

        <p className="text-gray-600 text-center text-xs mt-8">
          By signing in, you agree to our privacy policy and terms of service
        </p>
      </div>
    </div>
  )
}
