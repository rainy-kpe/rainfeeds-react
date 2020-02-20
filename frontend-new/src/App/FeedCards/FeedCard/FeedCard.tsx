import React, { Suspense } from "react"
import { CardData } from "../../../utils/firebase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import RssFeed from "./RssFeed/RssFeed"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"

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
    background: "#eeeeee"
  }
}))

// TODO: Retry button
function FeedCard({ card }: { card: CardData }) {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} variant="h6">
          {card.title}
        </Typography>
        <Suspense
          fallback={
            <Grid container className={classes.grid} justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
          }
        >
          <RssFeed urls={card.urls || []} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

export default FeedCard
