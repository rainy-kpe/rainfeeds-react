import React, { useState } from "react"
import FeedCard from "./FeedCard"
import AddCardDialog from "./AddCardDialog"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import Fab from "@material-ui/core/Fab"
import { createCardResource, CardData, deleteCard, upsertCard } from "../utils/firebase"

const cardsResource = createCardResource()

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))

function FeedCards() {
  const classes = useStyles()
  const [cards, setCards] = useState<CardData[] | null | undefined>()
  const [addCardOpen, setAddCardOpen] = useState(false)

  if (cards === undefined) {
    setCards(cardsResource.getCards())
  }

  const removeCard = async (removed: CardData) => {
    if (Array.isArray(cards)) {
      await deleteCard(removed)
      setCards(cards.filter((card) => card.title !== removed.title))
    }
  }
  const addCard = async (added: CardData) => {
    if (Array.isArray(cards)) {
      await upsertCard(added)
      setCards([...cards, added])
    }
  }
  const updateCard = async (updated: CardData) => {
    if (Array.isArray(cards)) {
      await upsertCard(updated)
      setCards([...cards!.filter((card) => card.title !== updated.title), updated].sort((a, b) => a.order - b.order))
    }
  }

  const moveCard = async (fromTitle: string, toTitle: string) => {
    if (!!cards) {
      const fromIndex = cards.findIndex((card) => card.title === fromTitle)
      const [fromCard] = cards.splice(fromIndex!, 1) || []
      const toIndex = cards.findIndex((card) => card.title === toTitle)
      cards.splice(toIndex + (fromIndex <= toIndex ? 1 : 0), 0, fromCard!)
      const updatedCards = cards.map((card, index) => ({ ...card, order: index + 1 }))
      setCards(updatedCards)

      // TODO: Error handling
      const promises = updatedCards.map(upsertCard)
      await Promise.all(promises)
    }
  }

  const handleAddCardClose = () => {
    setAddCardOpen(false)
  }

  return (
    <div className={classes.container}>
      {cards === undefined
        ? null
        : cards == null
        ? "Reading cards failed"
        : cards.map((card, index) => (
            <FeedCard key={index} card={card} updateCard={updateCard} removeCard={removeCard} moveCard={moveCard} />
          ))}
      <Fab className={classes.fab} color="primary" aria-label="add" onClick={() => setAddCardOpen(true)}>
        <AddIcon />
      </Fab>
      <AddCardDialog
        open={addCardOpen}
        onClose={handleAddCardClose}
        addCard={addCard}
        allCardTitles={cards?.map((card) => card.title.toLowerCase()) || []}
      />
    </div>
  )
}

export default FeedCards
