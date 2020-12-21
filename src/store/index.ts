import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
  },
  mutations: {
    setUser (state, playload) {
      state.user = JSON.parse(playload)
      // 数据持久化
      window.localStorage.setItem('user', playload)
    }
  },
  actions: {
  },
  modules: {
  }
})
