import React, { useState } from "react"
import { CardData } from "../utils/firebase"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import Divider from "@material-ui/core/Divider"
import ConfirmationDialog from "./ConfirmationDialog"
import SettingsDialog from "./SettingsDialog"

function CardMenu({
  card,
  updateCard,
  removeCard
}: {
  card: CardData
  updateCard: (updated: CardData) => Promise<void>
  removeCard: (removed: CardData) => Promise<void>
}) {
  const [anchor, setAnchor] = useState<Element | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleClick = (event: React.SyntheticEvent) => {
    setAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setAnchor(null)
  }

  const handleDeleteCard = async (confirmed: boolean) => {
    setDeleteOpen(false)
    if (confirmed) {
      try {
        await removeCard(card)
      } catch (error) {
        console.error(error)
        // TODO: Add <Alert> to show the error to user
      }
    }
  }

  const handleSettings = async () => {
    setSettingsOpen(false)
  }

  return (
    <div>
      <IconButton aria-label="menu" aria-haspopup="true" onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu id="avatar-menu" anchorEl={anchor} keepMounted open={!!anchor} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose()
            setSettingsOpen(true)
          }}
        >
          Settings...
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose()
            setDeleteOpen(true)
          }}
        >
          Delete Card
        </MenuItem>
      </Menu>
      <ConfirmationDialog title={`Delete '${card.title}'?`} open={deleteOpen} onClose={handleDeleteCard}>
        Do you really want to delete this card? The content will be permanently gone.
      </ConfirmationDialog>
      <SettingsDialog open={settingsOpen} card={card} onClose={handleSettings} updateCard={updateCard} />
    </div>
  )
}

export default CardMenu
