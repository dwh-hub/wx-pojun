import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    isLogin: false,
    userInfo: {}
  },
  mutations: {
    changeCount(state, value) {
      state.count = value
    },
    changeLogin(state,value) {
      state.isLogin = value
    },
    saveUserInfo(state,value) {
      state.userInfo = value
    }
  }
})

export default store