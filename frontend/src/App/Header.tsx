import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import UserMenu from "./UserMenu"
import { createAuthResource } from "../utils/firebase"
import Button from "@material-ui/core/Button"

const authResource = createAuthResource()

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: "black"
  },
  title: {
    flexGrow: 1
  },
  button: {
    color: "white"
  }
}))

function Header({
  onLogin,
  onLogout
}: {
  onLogin: (user: firebase.User | null) => Promise<void>
  onLogout: () => Promise<void>
}) {
  const classes = useStyles()
  const user = authResource.getUser()

  useEffect(() => {
    onLogin(user)
  }, [onLogin, user])

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Rainfeeds 3.0
        </Typography>
        {!!user ? (
          <UserMenu user={user!} onLogout={onLogout} />
        ) : (
          <Button className={classes.button} onClick={() => onLogin(null)}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
