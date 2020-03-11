import { FeedContainer, FeedEntry } from "../utils/feed"

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fetchFeed = async (currentEntries: FeedEntry[]) => {
  console.log(`${new Date().toISOString()} Downloading https://hacker-news.firebaseio.com/v0/topstories.json`)
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
  const json = await response.json()

  // Only download items which are new
  const oldItems = currentEntries ? currentEntries.map(entry => entry.id) : []

  const promises = json.splice(0, 30).map(async (id: string) => {
    if (!oldItems.includes(id)) {
      const item = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      return item.json()
    }
    return null
  })

  const result = await Promise.all(promises)
  const entries = result
    .filter(entry => !!entry)
    .filter((entry: any) => entry.score > 50)
    .map((entry: any) => {
      return {
        title: entry.title,
        summary: `Score: ${entry.score} by ${entry.by} | Comments: ${entry.descendants}`,
        time: new Date(entry.time * 1000).toISOString(),
        link: `https://news.ycombinator.com/item?id=${entry.id}`,
        summaryLink: `https://news.ycombinator.com/item?id=${entry.id}`,
        id: entry.id
      } as FeedEntry
    })
    .concat(currentEntries)

  return {
    title: "HackerNews",
    link: "https://hckrnews.com/",
    date: new Date().toISOString(),
    entries: entries.slice(0, 30)
  }
}

export const createHNResource = () => {
  let feed: FeedContainer | null | undefined = undefined
  return {
    getFeeds: () => {
      if (feed === undefined) {
        throw fetchFeed([]).then(
          result => {
            feed = result
          },
          (error: any) => {
            console.error(`Failed to parse HackerNews feed`, error)
            feed = null
          }
        )
      }
      return [feed]
    },
    invalidate: () => (feed = undefined),
    update: async () =>
      fetchFeed(feed?.entries || []).then(
        result => {
          feed = result
        },
        (error: any) => {
          console.error(`Failed to parse HackerNews feed`, error)
        }
      )
  }
}
