import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

export default function Register() {
  const supabase = useSupabaseClient()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function signUpWithEmail(e) {
    e.preventDefault()

    if (!username || !email || !password) {
      setError("Please, Fill all of the fields")
      return
    }

    setLoading(true)
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })
    setLoading(false)
    if (response.error) {
      setError("Invalid credentials")
    } else {
      if (response.data?.user?.identities?.length === 0) {
        setError("User already exists!!!")
        return
      }
      alert("Check your email to verify!!!")
      setUsername("")
      setError("")
      setEmail("")
      setPassword("")
    }
  }

  async function signInWithGoogle(e) {
    e.preventDefault()
    const response = await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  return (
    <>
      <Head>
        <title>Chat App - Register</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen min-h-screen bg-white">
        <form className="p-3 bg-gray-100 border-2 border-gray-200 border-solid shadow-lg rounded-xl w-96">
          <h2 className="mb-2 text-2xl font-semibold text-center text-blue-600">
            Register
          </h2>

          {error && (
            <p className="mb-2 text-sm font-medium text-center text-red-700">
              {error}
            </p>
          )}

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="username"
            required
            className="w-full p-2 mb-2 text-lg border-2 border-gray-400 border-solid"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email"
            required
            className="w-full p-2 mb-2 text-lg border-2 border-gray-400 border-solid"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
            required
            className="w-full p-2 mb-2 text-lg border-2 border-gray-400 border-solid"
          />

          <input
            onClick={signUpWithEmail}
            type="submit"
            value={loading ? "Loading" : "Register"}
            className="w-full p-2 text-xl font-semibold text-white bg-blue-600 cursor-pointer"
          />

          <p className="my-2 text-xl font-medium text-center text-gray-700">
            or
          </p>

          <button
            onClick={signInWithGoogle}
            className="block w-full p-2 text-xl font-semibold text-white bg-red-600"
          >
            Google
          </button>

          <p className="mt-3 text-sm font-medium text-center text-gray-700">
            Already have an account?
            <Link href="/login" className="text-blue-500 underline">
              {" "}
              Login here
            </Link>
          </p>
        </form>
      </main>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  return {
    props: {},
  }
}