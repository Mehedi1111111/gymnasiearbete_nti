import { useQuery } from "@tanstack/react-query"
import axios from "axios"

async function getNews() {
  try {
    const res = await axios.get(
      `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    )
    return res.data.articles.slice(5, 10)
  } catch (err) {
    throw err
  }
}

export default function News() {
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: () => getNews(),
  })

  return (
    <div className="bg-white border-2 border-gray-200 border-solid rounded-xl space-y-3 py-2.5">
      <h4 className="pb-1 mx-2 text-base font-semibold text-black border-0 border-b-2 border-gray-200 border-solid">
        News for you
      </h4>

      {data ? (
        data.map((n, i) => (
          <div key={i} className="flex gap-2 px-4">
            <article className="w-full">
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="block text-sm font-semibold leading-5 text-black hover:underline"
              >
                {n.description?.slice(0, 50)}...
              </a>
              <p className="mt-0.5 text-xs font-medium text-gray-400">
                {n.source.name}
              </p>
            </article>
            <img
              src={n.urlToImage}
              alt="news"
              className="h-14 w-16 min-w-[4rem] object-cover"
            />
          </div>
        ))
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  )
}
