import * as express from "express"
import * as path from "path"
import axios from "axios"
import { exec } from "child_process"
import { encode, decode } from "iconv-lite"

interface ICachedFeed {
  time: number
  feed: string
}

const app = express()
const port = 9000
const distPath = path.resolve("../frontend/dist")
const cache: { [url: string]: ICachedFeed } = {}

const addToCache = (url: string, data: string) => {
  cache[url] = {
    time: new Date().valueOf(),
    feed: data
  }
}

app.get("/", (req, res) => res.sendFile(path.join(distPath, "index.html")))
app.get("/feed", async (req, res) => {
  const decoded = decodeURIComponent(req.query.url)
  try {
    const cached = cache[decoded]
    if (cached && new Date().valueOf() < cached.time + 15 * 60 * 1000) {
      res.send(cached.feed)
    } else {
      if (decoded.includes("rainlendar")) {
        // Axios fails on downloading rss feed from Rainlendar.net so let's use curl instead
        exec(`curl "${decoded}"`, { maxBuffer: 1024 * 1024 }, (error, stdout) => {
          if (error) {
            console.error(error)
            res.sendStatus(500)
          } else {
            addToCache(decoded, stdout)
            res.send(stdout)
          }
        })
      } else {
        const content = await axios.get(decoded)
        const match = /encoding=\"(\S+)?\"/g.exec(content.data)
        let data = content.data
        if (match && match[1] && match[1].toLowerCase() !== "utf-8") {
          data = encode(decode(Buffer.from(data), match[1]), "UTF-8")
        }
        addToCache(decoded, data)
        res.send(data)
      }
    }
  } catch (error) {
    //    console.error(new Date(), error)
    res.sendStatus(500)
  }
})
app.use(express.static(distPath))
app.listen(port, () => {
  console.log(`Server started on port ${port} (${distPath})`)
})
