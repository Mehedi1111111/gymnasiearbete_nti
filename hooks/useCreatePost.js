import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

async function createPost(post, supabase) {
  let imageURL = null
  let imageName = null

  if (post.photo) {
    const newName = Date.now() + post.photo.name
    const response = await supabase.storage
      .from("posts-covers")
      .upload(newName, post.photo.imageFile)

    if (response.error) {
      throw response.error
    } else {
      imageName = response.data.path
      imageURL =
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        "/storage/v1/object/public/posts-covers/" +
        imageName
    }
  }

  const newPost = {
    user_id: post.user_id,
    imageName,
    imageURL,
    content: post.content,
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(newPost)
    .select(`*, profiles (*)`)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default function useCreatePost({ setContent, setPhoto }) {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: (newPost) => createPost(newPost, supabase),
    onError: (err) => {
      toast.error("Server error. Please try again later!!!")
      console.log(err)
    },
    onSuccess: (data) => {
      setContent("")
      setPhoto(null)
      toast.success("Created successfully😊")

      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData === undefined) {
          return [data]
        }
        return [data, ...oldData]
      })
    },
  })
  return { mutate, isLoading }
}
