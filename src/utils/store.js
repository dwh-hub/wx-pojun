import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    isLogin: false,
    userInfo: {},
    isIphoneX: false,
    longitude: '', // 经度
    latitude: '' // 纬度
  },
  mutations: {
    changeCount(state, value) {
      state.count = value
    },
    changeLogin(state, value) {
      state.isLogin = value
    },
    saveUserInfo(state, value) {
      state.userInfo = value
    },
    savePhoneType(state, value) {
      state.isIphoneX = value
    },
    saveLongitude(state, value) {
      state.longitude = value
    },
    saveLatitude(state, value) {
      state.latitude = value
    }
  }
})

export default store
