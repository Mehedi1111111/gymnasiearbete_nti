import useCreatePost from "../hooks/useCreatePost"
import { BiImageAlt } from "react-icons/bi"
import Avatar from "./Avatar"
import { useRef, useState } from "react"
import Image from "next/image"

export default function CreatePost({ user, supabase }) {
  const [content, setContent] = useState("")
  const [photo, setPhoto] = useState(null)
  const photoFileRef = useRef(null)

  const { mutate: createPost, isLoading } = useCreatePost({
    setContent,
    setPhoto,
  })

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

  async function postCreate(e) {
    e.preventDefault()
    if (!content && !photo) return
    createPost({ user_id: user.id, photo, content })
  }

  return (
    <div className="bg-white border-2 border-gray-200 border-solid rounded-xl py-2.5 px-6">
      <h5 className="pb-1 mb-3 text-lg font-bold tracking-tight text-gray-900 border-0 border-b-2 border-gray-200 border-solid dark:text-white">
        Post something
      </h5>

      <div className="flex items-start gap-3">
        <Avatar
          imgSrc={
            "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          }
        />

        <form className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            required={true}
            className="w-full h-20 p-2 text-base border-2 border-gray-300 border-solid rounded-lg"
          />
          {photo?.url && (
            <div className="relative w-full h-72">
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
            <button
              onClick={postCreate}
              className={`${
                isLoading ? "pointer-events-none" : "pointer-events-auto"
              } py-1.5 px-3 text-lg font-semibold text-white bg-blue-600`}
            >
              {isLoading ? "Loading" : "Post"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
