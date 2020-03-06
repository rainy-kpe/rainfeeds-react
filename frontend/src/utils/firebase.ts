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
        throw new Promise((resolve, reject) => {
          firebase.auth().onAuthStateChanged(
            user => {
              authenticatedUser = user
              resolve(user)
            },
            error => {
              console.error("Authentication failed", error)
              authenticatedUser = null
              reject(error)
            }
          )
        })
      }
      return authenticatedUser
    }
  }
}

export const createCardResource = () => {
  let cards: CardData[] | null | undefined = undefined
  return {
    getCards: () => {
      const user = firebase.auth()!.currentUser
      if (cards === undefined && user) {
        throw firebase
          .database()
          .ref(`cards/${user!.uid}`)
          .once("value")
          .then(
            data => {
              cards = Object.values(data.val() as { [title: string]: CardData }).sort((a, b) => a.order - b.order)
            },
            (error: any) => {
              console.error("Reading data from user failed", error)
              cards = null
            }
          )
      }
      return cards
    },
    invalidate: () => {
      cards = undefined
    },
    remove: (title: string) => {
      cards = cards?.filter(card => card.title !== title)
    },
    add: (title: string) => {
      cards?.push({ title: title, type: "rss", order: cards.length + 1, updateRate: 60 })
    },
    get: (title: string) => {
      return cards?.find(card => card.title === title)
    },
    update: (updated: CardData) => {
      cards = [...cards!.filter(card => card.title !== updated.title), updated]
    }
  }
}

export const login = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  return !!(await firebase.auth().signInWithPopup(provider))
}

export const logout = () => firebase.auth().signOut()

export const deleteCard = async (title: string) => {
  try {
    const userId = firebase.auth().currentUser!.uid
    await firebase
      .database()
      .ref(`cards/${userId}/${title}`)
      .remove()
  } catch (error) {
    console.log(error)
  }
}

export const upsertCard = async (card: CardData) => {
  const userId = firebase.auth().currentUser!.uid
  await firebase
    .database()
    .ref(`cards/${userId}/${card.title}`)
    .set(card)
}
