import {
  window,
  HttpRequest,
  getThemeColor
} from "COMMON/js/common.js";
import store from "../../utils/store.js"

export function getPhoneNumber(e,url) {
  if (!e.mp.detail.encryptedData) {
    return
  }
  wx.showLoading({
    title: "登录中..."
  });
  HttpRequest({
    url: window.api + "/mini/getphone",
    data: {
      sessionKey: wx.getStorageSync("sessionKey"),
      encryptedData: e.mp.detail.encryptedData,
      iv: e.mp.detail.iv
    },
    success(res) {
      if (res.data.code == 200) {
        wx.setStorage({
          key: "phone",
          data: res.data.data,
          success: function() {
            login(url);
          }
        });
      } else {
        wx.hideLoading();
      }
    }
  });
}
// 登录
function login(url) {
  getUserInfo().then(() => {
    bindMethod(url);
  });
}
// 获取用户信息
function getUserInfo() {
  return new Promise(function (resolve) {
    wx.request({
      url: window.api + "/wxcustomer/findAllCustomer",
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId")
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          let _data = res.data.data
          if (!_data.length) {
            return wx.showModal({
              title: "提示",
              content: "没有找到您的登记信息，请先登记信息",
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "../register/main"
                  });
                }
              }
            });
          }

          if (_data.length == 1) {
            // that.userInfo = _data[0];
            store.commit("saveUserInfo", _data[0]);
            wx.setStorage({
              key: "userInfo",
              data: _data[0]
            });
            wx.setStorage({
              key: "companyId",
              data: _data[0].companyId
            });
            wx.setStorage({
              key: "companyName",
              data: _data[0].companyName
            });
            return resolve();
          }
          // that.showBindBox = true;
          // that.companyList = _data;
          // that.curCompany = _data[0];
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  });
}

// 绑定方法
function bindMethod(url) {
    wx.request({
      url: window.api + "/wxcustomer/bindCard",
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId"),
        miniOpenId: wx.getStorageSync("openId")
      },
      success(res) {
        wx.setStorage({
          key: "Cookie",
          data: res.header["Set-Cookie"]
        });
        if (res.data.code === 200) {
          wx.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1000
          });
          store.commit("changeLogin", true);
          getThemeColor();
          setTimeout(() => {
            wx.reLaunch({
              url: url?url:'./main'
            });
          }, 1000);
        } else {
          return wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  }
  export default {
    getPhoneNumber
  }
