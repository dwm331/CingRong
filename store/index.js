import firebase, {auth} from '@/services/fireinit.js'

export const state = () => ({
  user: null
})

export const getters = {
  activeUser (state) {
    return state.user
  }
}

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },

  ON_AUTH_STATE_CHANGED_MUTATION: (state, authUser) => {
    const { uid, email, emailVerified } = authUser
    state.user = { uid, email, emailVerified }
  },
}

export const actions = {
  saveUser ({commit}, payload) {
    commit('ON_AUTH_STATE_CHANGED_MUTATION', payload)
  },

  autoSignIn ({commit}, payload) {
    commit('setUser', payload)
  },

  signOut ({commit}) {
    auth.signOut().then(() => {
      commit('setUser', null)
    }).catch(err => console.log(error))
  }
}

