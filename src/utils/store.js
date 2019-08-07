import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    isLogin: false, // 会员登录状态
    staffIsLogin: false, // 商户登录状态
    isCheckLogin: false,
    userInfo: {},
    isIphoneX: false,
    longitude: '', // 经度
    latitude: '', // 纬度
    allStore: [],
    classStartTime: "",
    classEndTime: "",
    schedulingWeekArr: [],
    authInto: {}
  },
  mutations: {
    changeCount(state, value) {
      state.count = value
    },
    changeCheckLogin(state, value) {
      state.isCheckLogin = value
    },
    changeLogin(state, value) {
      state.isLogin = value
    },
    changeStaffLogin(state, value) {
      state.staffIsLogin = value
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
    },
    saveAllStore(state, value) {
      state.allStore = value
    },
    changeClassStartTime(state, value) {
      state.classStartTime = value
    },
    changeClassEndTime(state, value) {
      state.classEndTime = value
    },
    changeSchedulingWeekArr(state, value) {
      state.schedulingWeekArr = value
    },
    saveAuthInto(state, value) {
      state.authInto = value
    }
  }
})

export default store
