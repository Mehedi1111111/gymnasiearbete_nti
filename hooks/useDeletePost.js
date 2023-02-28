import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

async function deletePost(post, supabase) {
  if (post.imageName) {
    const { data, error } = await supabase.storage
      .from("posts-covers")
      .remove([post.imageName])

    if (error) {
      throw error
    }
    console.log("fileData", data)
    console.log("fileError", error)
  }

  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .eq("id", post.id)

  if (deleteError) {
    throw deleteError
  }

  return post.id
}

export default function useDeletePost() {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: (postID) => deletePost(postID, supabase),
    onError: (err) => {
      toast.error("Server error. Please try again later!!!")
      console.log(err)
    },
    onSuccess: (postId) => {
      toast.success("Deleted successfully😊")
      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData === undefined) {
          return oldData
        }
        return [...oldData.filter((d) => d.id !== postId)]
      })
    },
  })
  return { mutate, isLoading }
}
