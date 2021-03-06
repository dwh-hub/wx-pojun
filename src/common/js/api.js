import {
  window,
  HttpRequest,
  getThemeColor
} from "COMMON/js/common.js";
import store from "../../utils/store.js"

let storeId

/**
 * 
 * @param {*} e 微信返回的加密数据
 * @param {*} url 登录成功后要跳转的地址
 */
export function getPhoneNumber(e, url, isTab) {
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
            login(url, isTab);
          }
        });
        // wx.setStorage({
        //   key: "phone",
        //   data: "18888888882",
        //   success: function () {
        //     login(url, isTab);
        //   }
        // });
      } else {
        // wx.setStorage({
        //   key: "phone",
        //   data: "18888888882",
        //   success: function () {
        //     login(url, isTab);
        //   }
        // });
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

// 商户端登录
function staff_login() {
  return new Promise(function (resolve, reject) {
    HttpRequest({
      url: window.api + '/user/login/mini',
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId"),
        miniOpenId: wx.getStorageSync("openId")
      },
      success(res) {
        if (res.data.code == 200 || res.data.code == 201) {
          wx.setStorageSync("Cookie", res.header["Set-Cookie"]);
          if (res.data.code == 200) {
            wx.setStorageSync("instMsgSubKey", res.data.data.instMsgSubKey);
            wx.setStorageSync("staff_info", res.data.data);
          }
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

// 登录
function login(url, isTab) {
  getUserInfo().then(() => {
    bindMethod(url, isTab);
  });
}

// 随机4位数
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 获取用户信息
function getUserInfo() {
  return new Promise(function (resolve) {
    wx.request({
      url: window.api + "/wxcustomer/findCustomerStore",
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId")
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          let _data = res.data.data
          if (!_data.length) {
            return register()
          }

          if (_data.length) {
            if (
              wx.getStorageSync("storeId") &&
              !_data.filter(e => {
                return e.storeId == wx.getStorageSync("storeId");
              }).length
            ) {
              return register();
            }

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
        } else {
          register()
        }
      }
    });
  });
}

// 绑定方法
function bindMethod(url, isTab) {
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
        wx.setStorageSync("isLogin", true)
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
  let _userInfo = wx.getStorageSync("userInfo")
  HttpRequest({
    url: window.api + "/wxcustomer/addCustomer",
    data: {
      id: _userInfo ? _userInfo.id : 0,
      companyId: wx.getStorageSync("companyId"),
      phone: wx.getStorageSync("phone"),
      name: _userInfo ? _userInfo.name : ("微信用户" + rand(1000, 9999)),
      storeId: wx.getStorageSync("storeId") ? wx.getStorageSync("storeId") : storeId,
      serviceUserId: wx.getStorageSync("serviceUserId") ? wx.getStorageSync("serviceUserId") : '',
      sex: 0
    },
    success(res) {
      if (res.data.code === 200) {
        wx.removeStorageSync("storeId")
        bindMethod()
        if (wx.getStorageSync("serviceUserId")) {
          wxPush()
        }
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

export function getAllStore() {
  console.log("api.js==>getAllStore")
  return new Promise(function (resolve, reject) {
    wx.request({
      url: window.api + "/store/all-store-name-list-nolimit",
      data: {
        companyId: wx.getStorageSync("companyId")
      },
      success(res) {
        resolve(res)
      }
    });
  })
}
getAllStore().then((res) => {
  if (res.data.code === 200) {
    store.commit("saveAllStore", res.data.data);
    storeId = res.data.data[0].storeId
  }
})

export function getMessage() {
  HttpRequest({
    url: window.api + '/home/wechat/message/customer/pages',
    data: {
      status: 0,
      pageNo: 1
    },
    success(res) {
      if (res.data.code == 200) {
        wx.setStorageSync("isLogin", true)
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
      } else {}
    }
  })
}

// 消息推送
export function wxPush() {
  HttpRequest({
    url: window.api + '/sendmsg/user/customerself/registerMsg',
    data: {
      companyId: wx.getStorageSync("companyId"),
      serviceUserId: wx.getStorageSync("serviceUserId"),
      customerName: wx.getStorageSync("userInfo").name,
      phone: wx.getStorageSync("phone")
    }
  })
}

export default {
  getPhoneNumber,
  getMessage,
  wxPush
}
