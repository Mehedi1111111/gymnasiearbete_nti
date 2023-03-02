import useUpdatePost from "../hooks/useUpdatePost"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useRef, useState } from "react"
import { BiImageAlt } from "react-icons/bi"

export default function EditPost({ post }) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState(post.content || "")
  const [photo, setPhoto] = useState(
    post.imageURL
      ? {
          name: null,
          url: post.imageURL,
          imageFile: null,
        }
      : null
  )
  const photoFileRef = useRef(null)

  const { mutate: updatePost, isLoading } = useUpdatePost()

  // ! get temporary image url
  function handleImageChange(file) {
    if (file === undefined) return
    const reader = (readFile) =>
      new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.readAsDataURL(readFile)
      })

    reader(file).then((result) =>
      setPhoto({ name: file.name, url: result, imageFile: file })
    )
  }

  function postUpdate(e) {
    e.preventDefault()
    if (!content && !photo) return
    updatePost({ oldPost: post, newPost: { content, photo } })
  }

  function goBack(e) {
    e.preventDefault()
    queryClient.setQueryData(["currentPost"], null)
  }

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-gray-400/60">
      <form className="p-3 bg-gray-100 border-2 border-gray-200 border-solid shadow-lg rounded-xl w-[50rem]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          required={true}
          className="w-full h-20 p-2 text-base border-2 border-gray-300 border-solid rounded-lg"
        />
        {photo?.url && (
          <div className="relative w-full h-72">
            <button
              onClick={() => setPhoto(null)}
              className="py-1.5 px-3 text-lg font-semibold text-white bg-red-600 absolute top-0 left-1/2 -translate-x-1/2 z-10"
            >
              Remove Image
            </button>
            <Image
              src={photo.url}
              alt="tweet cover"
              fill
              className="object-contain"
            />
          </div>
        )}
        <fieldset className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4">
            <BiImageAlt
              onClick={() => photoFileRef.current?.click()}
              className="text-2xl text-blue-500 cursor-pointer"
            />
            <input
              type="file"
              ref={photoFileRef}
              className="hidden"
              onChange={(e) =>
                handleImageChange(
                  e.target.files ? e.target.files[0] : undefined
                )
              }
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={goBack}
              className="py-1.5 px-3 text-lg font-semibold text-white bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={postUpdate}
              className={`${
                isLoading ? "pointer-events-none" : "pointer-events-auto"
              } py-1.5 px-3 text-lg font-semibold text-white bg-blue-600`}
            >
              {isLoading ? "Loading" : "Update"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
