import {
  window,
  HttpRequest,
  getThemeColor
} from "COMMON/js/common.js";
import store from "../../utils/store.js"

/**
 * 
 * @param {*} e 微信返回的加密数据
 * @param {*} url 登录成功后要跳转的地址
 */
export function getPhoneNumber(e, url,isTab) {
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
          success: function () {
            login(url,isTab);
          }
        });
      } else {
        wx.hideLoading();
        wx.showModal({
          title: "提示",
          content: res.data.message,
          showCancel: false
        });
      }
    }
  });
}
// 登录
function login(url,isTab) {
  getUserInfo().then(() => {
    bindMethod(url,isTab);
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
            if(wx.getStorageSync("storeId")) {
              return register()
            }
            return wx.showModal({
              title: "提示",
              content: "您目前不是该店会员，是否前往注册会员？",
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
function bindMethod(url,isTab) {
  wx.showLoading({
    title: "登录中..."
  });
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
        wx.hideLoading();
        wx.showToast({
          title: "登录成功",
          icon: "success",
          duration: 1000
        });
        wx.removeStorageSync("storeId");
        getMessage()
        store.commit("changeLogin", true);
        getThemeColor();
        let _url = url ? url : './main'
        if (isTab) {
          setTimeout(() => {
            wx.reLaunch({
              url: _url
            });
          }, 1000);
        } else {
          setTimeout(() => {
            wx.redirectTo({
              url: _url
            });
          }, 1000);
        }
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

// 注册
function register() {
  HttpRequest({
    url: window.api + "/wxcustomer/addCustomer",
    data: {
      companyId: wx.getStorageSync("companyId"),
      phone: wx.getStorageSync("phone"),
      name: wx.getStorageSync("phone"),
      storeId: wx.getStorageSync("storeId"),
      sex: 0
    },
    success(res) {
      if (res.data.code === 200) {
        bindMethod()
      } else {
        wx.showModal({
          title: "提示",
          content: res.data.message,
          showCancel: false
        });
      }
    }
  });
}

export function getMessage() {
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
        if (res.data.data.recCount <= 99 && res.data.data.recCount > 0) {
          return wx.setTabBarBadge({
            index: 3,
            text: String(res.data.data.recCount)
          })
        }
      } else {
      }
    }
  })
}
export default {
  getPhoneNumber,
  getMessage
}
