import Avatar from "./Avatar"
import { AiFillDelete } from "react-icons/ai"
import useDeleteComment from "../hooks/useDeleteComment"

function formatDate(myDate) {
  const date = new Date(myDate)
  const options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

export default function Comment({ comment, user, post }) {
  const { mutate, isLoading } = useDeleteComment({ postID: post.id })

  function deleteComment() {
    mutate(comment.id)
  }

  return (
    <div className="mt-6 flex items-start gap-4">
      <Avatar imgSrc={comment.profiles.avatar} className="hidden sm:block" />
      <div className="flex-1">
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="flex justify-between">
            <h3 className="flex items-center gap-3 text-base font-bold capitalize text-black">
              <span>{comment.profiles.name}</span>
              <time
                dateTime={comment.created_at}
                className="hidden text-xs font-medium text-gray-400 sm:block"
              >
                {formatDate(comment.created_at)}
              </time>
            </h3>
          </div>
          <p className="text-base font-medium text-gray-700">
            {comment.comment}
          </p>
        </div>
        {(comment.user_id === user.id || user.id === post.user_id) && (
          <div className="mt-2 flex items-center space-x-4 border-gray-100 text-xs font-medium text-gray-400">
            <span
              className={`flex cursor-pointer items-center text-sm font-medium hover:text-red-500 ${
                isLoading ? "pointer-events-none" : "pointer-events-auto"
              }`}
              onClick={deleteComment}
            >
              <AiFillDelete className="mr-1.5 text-base" /> Delete
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
