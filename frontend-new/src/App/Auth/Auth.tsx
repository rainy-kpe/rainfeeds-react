import React, { useState } from "react"
import { createAuthResource, login } from "../../utils/firebase"
import UserMenu from "./UserMenu/UserMenu"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

const authResource = createAuthResource()

const useStyles = makeStyles(theme => ({
  button: {
    color: "white"
  }
}))

function Auth({ setShowAlert }: { setShowAlert: (show: boolean) => void }) {
  const classes = useStyles()
  const user = authResource.getUser()
  const [isAuth, setAuth] = useState(!!user)

  const handleLoginClick = async () => {
    try {
      setShowAlert(false)
      setAuth(await login())
    } catch (error) {
      console.error(error)
      setShowAlert(true)
    }
  }
  return (
    <div>
      {isAuth ? (
        <UserMenu user={user!} setAuth={setAuth} />
      ) : (
        <Button className={classes.button} onClick={handleLoginClick}>
          Login
        </Button>
      )}
    </div>
  )
}

export default Auth
