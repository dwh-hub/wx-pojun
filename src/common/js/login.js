// cookie失效后根据公司id 自动登录
import store from "../../utils/store.js"
import {
  window
} from "COMMON/js/common.js";

function login() {
  if (!wx.getStorageSync("phone") || !wx.getStorageSync("openId")) {
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
      } else {
        store.commit("changeLogin", false);
        wx.removeStorageSync("userInfo");
        wx.removeStorageSync("phone");
      }
    }
  });
}

export default login
