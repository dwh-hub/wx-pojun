import Vue from 'vue'
import App from './App'
import {
  window,
  HttpRequest
} from "COMMON/js/common.js";
import store from "./utils/store"

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData

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
      if (res.data.code == 200) {
        store.commit('changeLogin', true)
        if (res.data.data.recCount > 99) {
          return wx.setTabBarBadge({
            index: 3,
            text: '99+'
          })
        }
        if (0 < res.data.data.recCount <= 99) {
          return wx.setTabBarBadge({
            index: 3,
            text: res.data.data.recCount
          })
        }
      } else {
        store.commit('changeLogin', false)
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
