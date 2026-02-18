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
      <button onClick={handleLogin} className="bg-white text-black px-4 py-2 rounded shadow">
        Sign in with Google
      </button>
      <button onClick={handleLogout} className="text-gray-500 hover:underline">
        Logout
      </button>
    </div>
  )
}