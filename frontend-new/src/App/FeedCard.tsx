import React, { Suspense, useState } from "react"
import { CardData } from "../utils/firebase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import RssFeed from "./RssFeed"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import TimeAgo from "react-timeago"

const useStyles = makeStyles(theme => ({
  card: {
    flex: "1 0 25rem",
    boxSizing: "border-box",
    margin: "1rem",
    maxWidth: "calc(33.33333% - 2em)"
  },
  grid: {
    display: "flex",
    minHeight: "400px",
    maxHeight: "400px"
  },
  content: {
    padding: "0 !important"
  },
  title: {
    padding: "16px",
    background: "#eeeeee",
    display: "flex",
    alignItems: "baseline"
  },
  date: {
    color: "#888888",
    marginLeft: "8px"
  }
}))

function FeedCard({ card }: { card: CardData }) {
  const classes = useStyles()
  const [date, setDate] = useState("hello")
  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <div className={classes.title}>
          <Typography variant="h6">{card.title}</Typography>
          <span className={classes.date}>
            <TimeAgo date={date} />
          </span>
        </div>
        <Suspense
          fallback={
            <Grid container className={classes.grid} justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
          }
        >
          <RssFeed urls={card.urls || []} setDate={setDate} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

export default FeedCard
