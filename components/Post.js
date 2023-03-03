import useGetComments from "../hooks/useGetComments"
import { useQueryClient } from "@tanstack/react-query"
import useDeletePost from "../hooks/useDeletePost"
import Avatar from "./Avatar"
import Comment from "./Comment"
import CreateComment from "./CreateComment"

function formatDate(myDate) {
  const date = new Date(myDate)
  const options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

export default function Post({ post, user }) {
  const { mutate: deletePost, isLoading: deleteLoading } = useDeletePost()
  const { data: comments } = useGetComments({ postID: post.id })
  const queryClient = useQueryClient()

  async function postDelete() {
    deletePost(post)
  }

  return (
    <article className="max-w-full p-4 mt-8 bg-white border-2 border-gray-200 border-solid rounded-lg shadow-md">
      <div>
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar imgSrc={post.profiles?.avatar} />
            <div>
              <h3 className="text-base font-bold text-black capitalize">
                {post.profiles?.name}
              </h3>
              <time
                dateTime={post.created_at}
                className="text-xs font-medium text-gray-400"
              >
                {formatDate(post.created_at)}
              </time>
            </div>
          </div>
          {post.user_id === user.id && (
            <div
              className={`${
                deleteLoading ? "pointer-events-none" : "pointer-events-auto"
              } flex items-center gap-3 sm:mt-0 mt-3`}
            >
              <button
                onClick={postDelete}
                className="py-1.5 px-3 text-lg font-semibold text-white bg-red-600"
              >
                {deleteLoading ? "Loading" : "Delete"}
              </button>

              <button
                onClick={() => queryClient.setQueryData(["currentPost"], post)}
                className="py-1.5 px-3 text-lg font-semibold text-white bg-blue-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <p className="mt-2 mb-4 text-base font-medium text-gray-600">
          {post.content}
        </p>

        {post.imageURL && (
          <img
            src={post.imageURL}
            alt="post cover"
            className="object-contain w-full h-60 sm:h-80"
          />
        )}

        <div className="flex items-center justify-end pt-4 pb-1 space-x-4 text-xs font-medium text-gray-400 border-0 border-b-2 border-gray-100 border-solid">
          <span>{comments ? comments.length : 0} Comments</span>
        </div>
      </div>

      <CreateComment user={user} post={post} />
      {comments && comments.length
        ? comments.map((c) => (
            <Comment key={c.id} comment={c} user={user} post={post} />
          ))
        : null}
    </article>
  )
}
