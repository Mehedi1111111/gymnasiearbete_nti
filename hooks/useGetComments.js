import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"

async function getComments(postID, supabase) {
  const { data } = await supabase
    .from("comments")
    .select(`*, profiles (*)`)
    .eq("post_id", postID)
    .order("created_at", { ascending: false })
  return data
}

export default function useGetComments({ postID }) {
  const supabase = useSupabaseClient()

  const { data } = useQuery({
    queryKey: ["comments", postID],
    queryFn: () => getComments(postID, supabase),
  })

  return { data }
}
