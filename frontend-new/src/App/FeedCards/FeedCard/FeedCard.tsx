import React, { Suspense } from "react"
import { CardData } from "../../../utils/firebase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import RssFeed from "./RssFeed/RssFeed"
import ErrorBoundary from "../../../utils/ErrorBoundary"

const useStyles = makeStyles(theme => ({
  card: {
    flex: "1 0 25rem",
    boxSizing: "border-box",
    margin: "1rem",
    maxWidth: "calc(33.33333% - 2em)"
  }
}))

function Loading() {
  console.log("Loading")
  return <div>Loading...</div>
}

// TODO: Retry button
function FeedCard({ card }: { card: CardData }) {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{card.title}</Typography>
        <ErrorBoundary fallback={"Failed to load the feed."}>
          <Suspense fallback={<Loading />}>
            <RssFeed urls={card.urls || []} />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

export default FeedCard
