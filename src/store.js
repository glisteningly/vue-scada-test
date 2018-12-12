import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolState: null,
    deviceTypeList: []
  },
  mutations: {
    SET_TOOLSTATE: (state, tool) => {
      state.toolState = tool
    },
    SET_DEVICETYPE: (state, list) => {
      state.deviceTypeList = list
    }
  },
  actions: {
    SetToolState({ commit }, tool) {
      commit('SET_TOOLSTATE', tool)
    },
    SetDeviceType({ commit }, list) {
      commit('SET_DEVICETYPE', list)
    }
  }
})
