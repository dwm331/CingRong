import { auth } from '@/services/fireinit.js'

export const state = () => ({
  user: null
})
export const mutations = {
  setUser (state, payload) { state.user = payload }
}
export const actions = {
  signInWithEmail ({ commit }, payload) {
    return auth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => ({ ...user, status: 'success' }))
      .catch(e => ({ ...e, status: 'error' }))
  }
}
