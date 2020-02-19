import Parser from "rss-parser"

interface Feed {
  title?: string
  date: string
  entries?: FeedEntry[]
}

interface FeedEntry {
  title: string
  summary: string
  time: string
  link?: string
  image?: string
  imageLink?: string
}

const parseUrl = async (url: string): Promise<Feed> => {
  const parser = new Parser()
  const feed = await parser.parseURL(`/feed?url=${encodeURIComponent(url)}`)

  return {
    title: feed.title,
    date: feed.lastBuildDate,
    entries: feed.items?.map((entry: any) => {
      let image
      let imageLink
      let content = entry["content:encoded"] || entry["content"]

      if (content) {
        let re = content.match(/img src="(.*?)"/i)
        image = re && re.length > 1 ? re[1] : undefined

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
        time: entry.updated,
        image,
        imageLink,
        link: Array.isArray(entry.link) ? entry.link[0].href : entry.link.href || entry.link
      }
    })
  }
}

export const createRSSResource = () => {
  const feeds = new Map<string, Feed>()
  return {
    getFeed: (url: string) => {
      if (!feeds.has(url)) {
        console.log("Throwing The promise")
        throw parseUrl(url).then(feed => {
          console.log("Throwing error for", url)
          throw new Error("Foobar")
          feeds.set(url, feed)
        })
      }
      return feeds.get(url)
    }
  }
}
