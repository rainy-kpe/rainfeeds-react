import React, { useState } from "react"
import firebase from "firebase/app"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Avatar from "@material-ui/core/Avatar"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  avatar: {
    cursor: "pointer",
    border: "solid white"
  }
}))

function UserMenu({ user, onLogout }: { user: firebase.User; onLogout: () => Promise<void> }) {
  const classes = useStyles()
  const [anchor, setAnchor] = useState<Element | null>(null)

  const handleClick = (event: React.SyntheticEvent) => {
    setAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setAnchor(null)
  }

  const handleLogout = () => {
    onLogout()
    handleClose()
  }

  return (
    <div>
      <Avatar
        className={classes.avatar}
        aria-controls="avatar-menu"
        aria-haspopup="true"
        onClick={handleClick}
        src={user.photoURL!}
      />
      <Menu id="avatar-menu" anchorEl={anchor} keepMounted open={!!anchor} onClose={handleClose}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default UserMenu
