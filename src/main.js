import Vue from 'vue'
import App from './App'
import { window, HttpRequest } from "COMMON/js/common.js";

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData

function getMessage() {
  HttpRequest({
    url: window.api + '/home/wechat/message/customer/pages',
    data: {
      status: 0,
      pageNo: 1
    },
    success(res) {
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
    }
  })
}
getMessage()

// wx.request({
//   url: '/wxcustomer/isexistbind'
// })
