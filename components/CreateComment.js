import useCreateComment from "@/hooks/useCreateComment"
import { useState } from "react"
import Avatar from "./Avatar"

export default function CreateComment({ user, post }) {
  const [comment, setComment] = useState("")

  const { mutate: createComment, isLoading } = useCreateComment({
    setComment,
    postID: post.id,
  })

  function submitComment(e) {
    e.preventDefault()
    if (!comment) return
    createComment({ user_id: user.id, post_id: post.id, comment })
  }

  return (
    <form className="flex items-center gap-4 w-full" onSubmit={submitComment}>
      <Avatar imgSrc={user.avatar} />
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isLoading}
        type="text"
        placeholder="comment"
        required={true}
        className="rounded-lg flex-1 p-2.5 border border-solid border-gray-200"
      />
    </form>
  )
}
