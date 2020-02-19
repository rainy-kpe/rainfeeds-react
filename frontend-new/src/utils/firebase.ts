import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface CardData {
  type: "rss" | "hackernews"
  order: number
  title: string
  urls?: string[]
  updateRate: number
}

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
        console.log("User is not set -> Checking it from firebase")
        throw new Promise((resolve, reject) => {
          firebase.auth().onAuthStateChanged(
            user => {
              console.log("onAuthStateChanged", user)
              authenticatedUser = user
              resolve(user)
            },
            error => {
              console.error(error)
              reject(error)
            }
          )
        })
      }
      return authenticatedUser
    }
  }
}

export const createDataResource = () => {
  let cards: CardData[] | undefined = undefined
  return {
    getCards: () => {
      const user = firebase.auth()!.currentUser
      if (cards === undefined && user) {
        throw firebase
          .database()
          .ref(`cards/${user!.uid}`)
          .once("value")
          .then(data => {
            cards = Object.values(data.val() as { [title: string]: CardData })
          })
      }
      return cards || []
    }
  }
}

export const login = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  return !!(await firebase.auth().signInWithPopup(provider))
}

export const logout = () => firebase.auth().signOut()
