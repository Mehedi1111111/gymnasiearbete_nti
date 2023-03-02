import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

async function updatePost(oldPost, newPost, supabase) {
  let imageURL = oldPost.imageURL
  let imageName = oldPost.imageName
  let response = null

  console.log("oldPost", oldPost)
  console.log("newPost", newPost)

  if (newPost.photo && newPost.photo.name && oldPost.imageName) {
    //* old image exits, however user updated the post with a new image
    const newName = Date.now() + newPost.photo.name
    const { error: deleteError } = await supabase.storage
      .from("posts-covers")
      .remove([oldPost.imageName])

    if (deleteError) {
      throw deleteError
    }

    response = await supabase.storage
      .from("posts-covers")
      .upload(newName, newPost.photo.imageFile)
  } else if (newPost.photo && newPost.photo.name && !oldPost.imageName) {
    //* old image doesn't exits, however user updated the post with a new image
    const newName = Date.now() + newPost.photo.name
    response = await supabase.storage
      .from("posts-covers")
      .upload(newName, newPost.photo.imageFile)
  } else if (!newPost.photo && !newPost.photo?.name && oldPost.imageName) {
    //* old image exists, however user removed the image from the post while updating it.
    const { error: deleteError } = await supabase.storage
      .from("posts-covers")
      .remove([oldPost.imageName])

    if (deleteError) {
      throw deleteError
    }

    imageURL = null
    imageName = null
  }

  if (response) {
    console.log("response", response)
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

  const { data, error } = await supabase
    .from("posts")
    .update({
      imageURL,
      imageName,
      content: newPost.content,
      user_id: oldPost.user_id,
    })
    .eq("id", oldPost.id)
    .select()

  if (error) {
    throw error
  }

  return data
}

export default function useUpdatePost() {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ oldPost, newPost }) =>
      updatePost(oldPost, newPost, supabase),
    onError: (err) => {
      toast.error("Server error. Please try again later!!!")
      console.log(err)
    },
    onSuccess: (data) => {
      toast.success("Updated successfully😊")

      queryClient.setQueryData(["currentPost"], null)

      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData === undefined) {
          return oldData
        }
        return [
          ...oldData.map((p) =>
            p.id === data[0].id ? { profiles: p.profiles, ...data[0] } : p
          ),
        ]
      })
    },
  })
  return { mutate, isLoading }
}
