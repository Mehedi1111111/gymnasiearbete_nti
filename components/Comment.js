import Avatar from "./Avatar"
import { AiFillDelete } from "react-icons/ai"

export default function Comment() {
  return (
    <div className="mt-6 flex items-start gap-4">
      <Avatar
        imgSrc={"https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
        className="hidden sm:block"
      />
      <div className="flex-1">
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="flex justify-between">
            <h3 className="flex items-center gap-3 text-base font-bold capitalize text-black">
              <span>username</span>
              <time
                dateTime={"1972-02-23"}
                className="hidden text-xs font-medium text-gray-400 sm:block"
              >
                1972-02-23
              </time>
            </h3>
          </div>
          <p className="text-base font-medium text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem, autem?
          </p>
        </div>
        <div className="mt-2 flex items-center space-x-4 border-gray-100 text-xs font-medium text-gray-400">
          <span
            className={`flex cursor-pointer items-center text-sm font-medium hover:text-red-500`}
          >
            <AiFillDelete className="mr-1.5 text-base" /> Delete
          </span>
        </div>
      </div>
    </div>
  )
}
