import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

async function createComment(comment, supabase) {
  const { data, error } = await supabase
    .from("comments")
    .insert(comment)
    .select(`*, profiles (*)`)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default function useCreateComment({ setComment, postID }) {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: (comment) => createComment(comment, supabase),
    onError: (err) => {
      toast.error("Server error. Please try again later!!!")
      console.log(err)
    },
    onSuccess: (data) => {
      setComment("")
      toast.success("Commented successfully😊")

      queryClient.setQueryData(["comments", postID], (oldData) => {
        if (oldData === undefined) {
          return [data]
        }
        return [data, ...oldData]
      })
    },
  })

  return { mutate, isLoading }
}
