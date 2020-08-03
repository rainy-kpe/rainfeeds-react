import React, { useEffect } from "react"
import { FeedResource } from "../utils/feed"
import { CardData } from "../utils/firebase"
import { Chart as ReactChart } from "react-charts"
import { makeStyles, Grid, CircularProgress } from "@material-ui/core"
import * as queryString from "query-string"

const useStyles = makeStyles((theme) => ({
  chart: {
    height: "350px",
    margin: "16px",
  },
}))

function FeedGraph({
  resource,
  card,
  setShowAlert,
}: {
  resource: FeedResource<any>
  card: CardData
  setShowAlert: (showAlert: boolean) => void
}) {
  const classes = useStyles()

  const { urls } = card
  const feeds = resource.getFeeds(urls || [])
  const fails = feeds.filter((feed) => !feed)
  const succeeded = feeds.filter((feed) => !!feed)

  useEffect(() => {
    if (fails.length > 0) {
      setShowAlert(true)
    }
  }, [setShowAlert, fails])

  const axes = React.useMemo(
    () => [
      { primary: true, type: "time", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  )

  const processedData: any = React.useMemo(() => {
    return card.urls
      ?.flatMap((url) => {
        const params = queryString.parse(url.split("?").pop() as string)
        if (succeeded.length > 0 && params && params.type) {
          const parts = (params.type as string).split(",")
          const result = parts.map((part) => ({
            label: part,
            data: succeeded[0].map((value: any) => ({ x: new Date(value.timestamp).setSeconds(0, 0), y: value[part] })),
          }))
          return result
        }
        return null
      })
      .filter((data) => !!data)
  }, [succeeded, card])

  return (
    <div className={classes.chart}>
      {processedData ? (
        <ReactChart data={processedData} axes={axes} tooltip />
      ) : (
        <Grid container className={classes.chart} justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      )}
    </div>
  )
}

export default FeedGraph
