import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

async function deleteComment(commentID, supabase) {
  const { error: deleteError } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentID)

  if (deleteError) {
    throw deleteError
  }

  return commentID
}

export default function useDeleteComment({ postID }) {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: (commentID) => deleteComment(commentID, supabase),
    onError: (err) => {
      toast.error("Server error. Please try again later!!!")
      console.log(err)
    },
    onSuccess: (commentId) => {
      toast.success("Deleted successfully😊")
      queryClient.setQueryData(["comments", postID], (oldData) => {
        if (oldData === undefined) {
          return oldData
        }
        return [...oldData.filter((d) => d.id !== commentId)]
      })
    },
  })
  return { mutate, isLoading }
}
