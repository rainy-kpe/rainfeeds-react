import React from "react"
import { createDataResource } from "../../utils/firebase"
import FeedCard from "./FeedCard/FeedCard"
import { makeStyles } from "@material-ui/core/styles"

const dataResource = createDataResource()

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    margin: "0 2rem"
  }
}))

function FeedCards() {
  const classes = useStyles()
  const cards = dataResource.getCards()
  console.log(cards)
  return <div className={classes.container}>{cards.length > 0 && <FeedCard card={cards[0]}></FeedCard>}</div>
  // return (
  //   <div className={classes.container}>
  //     {cards.map(card => (
  //       <FeedCard card={card} />
  //     ))}
  //   </div>
  // )
}

export default FeedCards
