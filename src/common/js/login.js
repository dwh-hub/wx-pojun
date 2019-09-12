// cookie失效后根据公司id 自动登录
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
    wx.setStorageSync("isLogin", false)
    return
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
        wx.setStorageSync("isLogin", true)
        wx.hideLoading()
      } else {
        wx.setStorageSync("isLogin", false)
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
