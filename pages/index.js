import NavBar from "../components/NavBar"
import Head from "next/head"
import News from "../components/News"
import CreatePost from "../components/CreatePost"
import Post from "../components/Post"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import NoPost from "../components/NoPost"
import EditPost from "../components/EditPost"

async function getProfile(supabase, userID) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userID)
    .single()
  return data
}

async function getPosts(supabase) {
  const { data } = await supabase
    .from("posts")
    .select(`*, profiles (*)`)
    .order("created_at", { ascending: false })
  return data
}

export default function Home() {
  const supabaseClient = useSupabaseClient()
  const queryClient = useQueryClient()

  const user = useUser()

  console.log("client", user)

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(supabaseClient, user?.id),
    enabled: !!user,
  })

  const { data: allPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(supabaseClient),
    enabled: !!profile,
  })

  const { data: editPost } = useQuery({
    queryKey: ["currentPost"],
    queryFn: () => queryClient.getQueryData(["currentPost"]),
    initialData: null,
  })

  console.log("query-user:", profile)
  console.log("query-posts:", allPosts)

  return (
    <>
      <Head>
        <title>Chat App - Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {editPost && <EditPost post={editPost} />}

      <main className="w-screen min-h-screen bg-white">
        <NavBar user={profile} />
        <section className="w-full bg-white">
          <div className="px-3 pb-4 wrapper w-[82rem] mx-auto md:grid md:grid-cols-4 gap-6 flex max-w-full flex-col-reverse">
            <article className="md:col-span-3">
              {profile ? (
                <>
                  <CreatePost user={profile} supabase={supabaseClient} />
                  {allPosts && allPosts.length ? (
                    allPosts.map((p) => (
                      <Post key={p.id} post={p} user={profile} />
                    ))
                  ) : (
                    <NoPost />
                  )}
                </>
              ) : (
                <NoPost />
              )}
            </article>
            <aside className="space-y-6 md:col-span-1">
              <News />
            </aside>
          </div>
        </section>
      </main>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const queryClient = new QueryClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await queryClient.prefetchQuery(["profile"], () =>
      getProfile(supabase, user.id)
    )
    await queryClient.prefetchQuery(["posts"], () => getPosts(supabase))
  }

  return {
    props: { user: user || null },
  }
}
