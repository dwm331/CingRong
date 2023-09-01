import { auth } from '@/services/fireinit.js'
import { onAuthStateChanged } from "firebase/auth";

export default (context) => {
  const { store } = context

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("登陸狀態")
        return resolve(store.dispatch('saveUser', user))
      }
      console.log("沒有登錄")
      return resolve()
    })
  })
}

