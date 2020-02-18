import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const createAuthResource = () => {
  let authenticatedUser: firebase.User | null | undefined = undefined
  const config = {
    apiKey: "AIzaSyCdcwfxWwwISxmHKEN3bmipmZ9J_HahWkA",
    authDomain: "rainfeeds2.firebaseapp.com",
    databaseURL: "https://rainfeeds2.firebaseio.com",
    projectId: "rainfeeds2",
    storageBucket: "rainfeeds2.appspot.com",
    messagingSenderId: "295429656586"
  }
  firebase.initializeApp(config)
  return {
    getUser: () => {
      if (authenticatedUser === undefined) {
        console.log("No user found -> checking the auth")
        throw new Promise((resolve, reject) => {
          firebase.auth().onAuthStateChanged(
            user => {
              console.log("onAuthStateChanged", user)
              authenticatedUser = user
              resolve(user)
            },
            error => {
              reject(error)
            }
          )
        })
      }
      return authenticatedUser
    }
  }
}

export const login = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  return !!(await firebase.auth().signInWithPopup(provider))
}

export const logout = () => firebase.auth().signOut()
