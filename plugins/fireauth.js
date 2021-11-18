import { auth } from '@/services/fireinit.js'

export default (context) => {
  const { store } = context

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("登陸狀態")
        return resolve(store.dispatch('saveUser', user))
      }
      console.log("沒有登錄")
      return resolve()
    })
  })
}

