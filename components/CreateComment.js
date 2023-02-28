import Avatar from "./Avatar"

export default function CreateComment() {
  return (
    <form className="flex items-center gap-4 w-full">
      <Avatar
        imgSrc={"https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
      />
      <input
        // value={text}
        // onChange={(e) => setText(e.target.value)}
        // disabled={isLoading}
        type="text"
        placeholder="Tweet your reply"
        required={true}
        className="rounded-lg flex-1 p-2.5 border border-solid border-gray-200"
      />
    </form>
  )
}
