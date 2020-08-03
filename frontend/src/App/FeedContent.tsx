import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Alert from "@material-ui/lab/Alert"
import Button from "@material-ui/core/Button"
import { CardData } from "../utils/firebase"
import { createRSSResource } from "../utils/rssFeed"
import { createHNResource } from "../utils/hnFeed"
import { createGraphResource } from "../utils/graphFeed"
import FeedList from "./FeedList"
import { FeedResource, FeedContainer } from "../utils/feed"
import FeedGraph from "./FeedGraph"

const useStyles = makeStyles((theme) => ({
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  feed: {},
  alert: {
    margin: "1rem",
  },
}))

const rss = createRSSResource()
const hackernews = createHNResource()
const graph = createGraphResource()

function FeedContent({
  card,
  setDate,
  setUrl,
}: {
  card: CardData
  setDate: (date: string) => void
  setUrl: (url: string) => void
}) {
  const { type, updateRate, urls } = card
  const classes = useStyles()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showAlert, setShowAlert] = useState(false)
  const resource = type === "rss" ? rss : type === "hackernews" ? hackernews : graph

  useEffect(() => {
    const interval = setInterval(async () => {
      resource.update(urls || [])
      setLastUpdate(new Date())
    }, (updateRate || 60) * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [updateRate, urls, resource])

  useEffect(() => {
    const handleFocusChange = () => {
      const nextUpdate = new Date(lastUpdate.getTime() + (updateRate || 60) * 60000)
      if (new Date().getTime() > nextUpdate.getTime()) {
        resource.invalidate(urls || [])
        setLastUpdate(new Date())
      }
    }

    window.addEventListener("focus", handleFocusChange)
    return () => {
      window.removeEventListener("focus", handleFocusChange)
    }
  }, [updateRate, lastUpdate, urls, resource])

  const handleRetry = () => {
    resource.invalidate(urls || [])
    setLastUpdate(new Date())
  }

  return (
    <div className={classes.feed}>
      {showAlert && (
        <Alert
          className={classes.alert}
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              RETRY
            </Button>
          }
        >
          Failed to read some of the feeds
        </Alert>
      )}
      {type !== "graph" ? (
        <FeedList
          resource={resource as FeedResource<FeedContainer>}
          card={card}
          setUrl={setUrl}
          setDate={setDate}
          setShowAlert={setShowAlert}
        />
      ) : (
        <FeedGraph resource={resource as FeedResource<any>} card={card} setShowAlert={setShowAlert} />
      )}
    </div>
  )
}

export default FeedContent
