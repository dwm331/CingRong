import { auth } from '@/services/fireinit.js'
import { signInWithEmailAndPassword } from "firebase/auth";

export const state = () => ({
  user: null
})
export const mutations = {
  setUser (state, payload) { state.user = payload }
}
export const actions = {
  signInWithEmail ({ commit }, payload) {
    return signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then(user => ({ ...user, status: 'success' }))
      .catch(e => ({ ...e, status: 'error' }))
  }
}
