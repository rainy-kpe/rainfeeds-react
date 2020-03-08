import Parser from "rss-parser"
import { FeedContainer } from "../utils/feed"

const parseUrl = async (url: string): Promise<FeedContainer> => {
  console.log(`${new Date().toISOString()} Downloading ${url}`)
  const parser = new Parser()
  const feed = await parser.parseURL(`/feed?url=${encodeURIComponent(url)}`)

  // console.log(url, feed)

  return {
    title: feed.title,
    date: feed.lastBuildDate,
    entries:
      feed.items?.map((entry: any) => {
        let image
        let imageLink
        let content = entry["content:encoded"] || entry["content"]

        if (content) {
          let re = content.match(/img src="(.*?)"/i)
          image = re && re.length > 1 ? re[1] : undefined
          if (image && image.includes("feeds.feedburner.com")) {
            image = undefined
          }

          re = content.match(/.*href="(.*?)">\[link/i)
          imageLink = re && re.length > 1 ? re[1] : undefined

          const elem = document.createElement("textarea")
          elem.innerHTML = content
          content = elem.value
        }

        let title = entry.title || ""
        let summary = content || ""

        title = title.replace(/<(?:.|\n)*?>/gm, "")
        summary = summary.replace(/<(?:.|\n)*?>/gm, "")

        return {
          title,
          summary,
          time: entry.pubDate,
          image,
          imageLink,
          link: Array.isArray(entry.link) ? entry.link[0].href : entry.link.href || entry.link
        }
      }) || []
  }
}

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const createRSSResource = () => {
  const feeds = new Map<string, FeedContainer | null>()
  return {
    getFeeds: (urls: string[]) => {
      return urls.map(url => {
        if (!feeds.has(url)) {
          throw parseUrl(url).then(
            feed => {
              feeds.set(url, feed)
            },
            (error: any) => {
              console.error(`Failed to parse feed from url ${url}`, error)
              feeds.set(url, null)
            }
          )
        }
        return feeds.get(url)
      })
    },
    invalidate: (urls: string[]) => urls.forEach(url => feeds.delete(url)),
    update: async (urls: string[]) =>
      urls.forEach(url => {
        parseUrl(url).then(
          feed => {
            feeds.set(url, feed)
          },
          (error: any) => {
            console.error(`Failed to parse feed from url ${url}`, error)
          }
        )
      })
  }
}
