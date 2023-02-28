export default function News() {
  return (
    <div className="bg-white border-2 border-gray-200 border-solid rounded-xl space-y-3 py-2.5">
      <h4 className="pb-1 mx-2 text-base font-semibold text-black border-0 border-b-2 border-gray-200 border-solid">
        News for you
      </h4>

      <div className="flex gap-2 px-4">
        <article>
          <a
            href={"/"}
            target="_blank"
            rel="noreferrer"
            className="block text-sm font-semibold leading-5 text-black hover:underline"
          >
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque,
            mollitia?...
          </a>
          <p className="mt-0.5 text-xs font-medium text-gray-400">CNN</p>
        </article>
        <img
          src={"https://flowbite.com/docs/images/blog/image-1.jpg"}
          alt="news"
          className="h-14 w-16 min-w-[4rem] object-cover"
        />
      </div>

      <div className="flex gap-2 px-4">
        <article>
          <a
            href={"/"}
            target="_blank"
            rel="noreferrer"
            className="block text-sm font-semibold leading-5 text-black hover:underline"
          >
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque,
            mollitia?...
          </a>
          <p className="mt-0.5 text-xs font-medium text-gray-400">CNN</p>
        </article>
        <img
          src={"https://flowbite.com/docs/images/blog/image-1.jpg"}
          alt="news"
          className="h-14 w-16 min-w-[4rem] object-cover"
        />
      </div>
    </div>
  )
}
