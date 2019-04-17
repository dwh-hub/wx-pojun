import Vue from 'vue'
import App from './App'
import {
  window,
  wxLogin,
  HttpRequest,
  getCompanyColor
} from "COMMON/js/common.js";
import store from "./utils/store"
import login from "COMMON/js/login.js"

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData

getCompanyColor()

if (!wx.getStorageSync("Cookie")) {
  wx.request({
    url: window.api + '/loginPage',
    success(res) {
      wx.setStorage({
        key: "Cookie",
        data: res.header["Set-Cookie"]
      });
      getMessage()
    }
  })
} else {
  getMessage()
}

function getMessage() {
  HttpRequest({
    url: window.api + '/home/wechat/message/customer/pages',
    data: {
      status: 0,
      pageNo: 1
    },
    success(res) {
      console.log(res)
      if (res.data.code == 200) {
        store.commit('changeLogin', true)
        if (res.data.data.recCount > 99) {
          return wx.setTabBarBadge({
            index: 3,
            text: '99+'
          })
        }
        if (res.data.data.recCount <= 99 && res.data.data.recCount > 0) {
          return wx.setTabBarBadge({
            index: 3,
            text: String(res.data.data.recCount)
          })
        }
      } else {
        // store.commit('changeLogin', false)
        login()
      }
    }
  })
}

isIphoneX()

function isIphoneX() {
  wx.getSystemInfo({
    success: function (res) {
      if (res.model.search("iPhone X") != -1) {
        store.commit('savePhoneType', true)
      } else {
        store.commit('savePhoneType', false)
      }
    }
  });
}


if (wx.getStorageSync("sessionKey")) {
  wx.checkSession({
    success() {
      console.log('未过期')
      console.log(wx.getStorageSync("sessionKey"))
      // session_key 未过期，并且在本生命周期一直有效
    },
    fail() {
      console.log("过期");
      wxLogin()
    }
  })
} else {
  console.log("不存在，重新获取");
  wxLogin()
}

