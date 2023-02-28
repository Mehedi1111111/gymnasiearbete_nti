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

export default function Post({ post }) {
  return (
    <article className="max-w-full border-2 border-solid border-gray-200 bg-white shadow-md rounded-lg mt-8 p-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar imgSrc={post.profiles.avatar} />
            <div>
              <h3 className="text-base font-bold capitalize text-black">
                {post.profiles.name}
              </h3>
              <time
                dateTime={post.created_at}
                className="text-xs font-medium text-gray-400"
              >
                {formatDate(post.created_at)}
              </time>
            </div>
          </div>
        </div>

        <p className="text-base font-medium text-gray-600 mt-2 mb-4">
          {post.content}
        </p>

        {post.imageURL && (
          <img
            src={post.imageURL}
            alt="post cover"
            className="object-contain h-60 w-full sm:h-80"
          />
        )}

        <div className="flex items-center justify-end space-x-4 border-0 border-b-2 border-solid border-gray-100 pb-1 text-xs font-medium text-gray-400 pt-4">
          <span>0 Comments</span>
        </div>
      </div>

      <CreateComment />
      <Comment />
    </article>
  )
}
