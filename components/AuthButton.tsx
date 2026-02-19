'use client'
import { createClient } from "@/lib/authHelpers"

export default function AuthButton() {
  const supabase = createClient()

  const handleLogin = async () => {
     (await supabase).auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This is where Google sends the user back after they click "Allow"
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleLogout = async () => {
    (await supabase).auth.signOut()
    window.location.reload() // Refresh to clear local state
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={handleLogin}
        className="px-4 py-2 rounded-md shadow-md transition-transform transform hover:-translate-y-0.5"
        style={{
          background: 'radial-gradient(ellipse at 50% 75%, #ffffff 0%, #fff4e6 36%, #ff8a00 100%)',
          color: '#081123',
          boxShadow: '0 8px 24px rgba(255,138,0,0.18)',
        }}
      >
        Sign in with Google
      </button>

      <button onClick={handleLogout} className="text-orange-600 hover:underline">
        Logout
      </button>
    </div>
  )
}