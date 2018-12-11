import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolState: null
  },
  mutations: {
    SET_TOOLSTATE: (state, tool) => {
      state.toolState = tool
    }
  },
  actions: {
    SetToolState({ commit }, tool) {
      commit('SET_TOOLSTATE', tool)
    }
  }
})
