// cookie失效后根据公司id 自动登录
import store from "../../utils/store.js"
import {
  window
} from "COMMON/js/common.js";

function login() {
  wx.showLoading({
    title: '加载中',
  })
  if (!wx.getStorageSync("phone") || !wx.getStorageSync("openId")) {
    wx.hideLoading()
    // wx.navigateTo({
    //   url: '../authorizeLogin/main'
    // })
    return store.commit("changeLogin", false);
  }
  wx.request({
    url: window.api + "/wxcustomer/bindCard",
    data: {
      phone: wx.getStorageSync("phone"),
      companyId: wx.getStorageSync("userInfo").companyId,
      miniOpenId: wx.getStorageSync("openId")
    },
    success(res) {
      wx.setStorage({
        key: "Cookie",
        data: res.header["Set-Cookie"]
      });
      if (res.data.code === 200) {
        store.commit("changeLogin", true);
        wx.hideLoading()
      } else {
        store.commit("changeLogin", false);
        wx.hideLoading()
        // wx.navigateTo({
        //   url: '../authorizeLogin/main'
        // })
        wx.removeStorageSync("userInfo");
        wx.removeStorageSync("phone");
      }
    }
  });
}

export default login
