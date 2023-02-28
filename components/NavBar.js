import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import Avatar from "./Avatar"

export default function NavBar({ user }) {
  const supabase = useSupabaseClient()
  const queryClient = useQueryClient()

  async function signOut() {
    const response = await supabase.auth.signOut()
    // window.location.href = "/"
    queryClient.removeQueries()
    console.log(response)
  }

  return (
    <nav className="w-full mb-4 bg-white shadow-lg">
      <div className="px-3 py-4 wrapper w-[82rem] mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Flames</h1>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Avatar imgSrc={user.avatar} />
              <button
                onClick={signOut}
                className="py-1.5 px-3 text-lg font-semibold text-white bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="py-1.5 px-3 text-lg font-semibold text-white bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
