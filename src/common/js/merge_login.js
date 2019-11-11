import {
  window,
  HttpRequest,
  getThemeColor,
  formatDate,
  wxLogin
} from "COMMON/js/common.js";
import store from "../../utils/store.js"
console.log("merge_login.js")
let storeId
let url = ""
let isTab = true
/* 点击登录按钮逻辑-开始 */
/**
 * 获取手机号
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
        //   data: "15180006767", //"18759888263",
        //   success: function () {
        //     login(url, isTab);
        //   }
        // });
      } else {
        wx.hideLoading();
        // TODO:
        if(window.DEBUGGING) {
          return wx.setStorage({
            key: "phone",
            data: "18888888882", // "13285923990",
            success: function () {
              login(url, isTab);
            }
          });
        }
        wx.showModal({
          title: "提示",
          content: res.data.message,
          showCancel: false
        });
        wxLogin()
      }
    }
  });
}

// 商户端登录 - 判断商户
export function staff_login() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: window.api + '/user/login/mini',
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId"),
        miniOpenId: wx.getStorageSync("openId"),
        unionId: wx.getStorageSync("unionId")
      },
      success(res) {
        if (res.data.code == 200 || res.data.code == 201) {
          resolve(res)
        } else {
          resolve(false)
        }
      }
    })
  })
}

// 判断会员
export function getUserInfo() {
  return new Promise(function (resolve) {
    wx.request({
      url: window.api + "/wxcustomer/findCustomerStore",
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId")
      },
      success(res) {
        wx.hideLoading();
        resolve(res)
      }
    });
  });
}

// 判断用户账号信息
function checkAccount() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: window.api + '/mini/checkAccount',
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId")
      },
      success(res) {
        // 查询成功：0都不存在，1都存在，2只有customer，3只有user
        resolve(res.data.data)
      }
    })
  })
}

// 登录
export function login(url, isTab) {
  url = url || ''
  isTab = isTab || true
  wx.showLoading({
    title: "登录中..."
  });
  checkAccount().then((account) => {
    console.log('account:'+account)
    if (account == 2 || account == 0) {
      getUserInfo().then((member_res) => {
        enterMember(member_res)
      })
    }
    if (account == 3) {
      staff_login().then((staff_res) => {
        enterStaff(staff_res)
      })
    }
    if (account == 1) {
      wx.hideLoading();
      wx.showModal({
        title: "提示",
        content: "检测到您是工作人员，请选择当次浏览的信息",
        cancelText: "留在会员",
        confirmText: "前往商户",
        success(res) {
          wx.showLoading({
            title: "登录中..."
          });
          if (res.confirm) {
            staff_login().then((staff_res) => {
              enterStaff(staff_res)
            })
          } else if (res.cancel) {
            getUserInfo().then((member_res) => {
              enterMember(member_res)
            })
          }
        }
      });
    }
  })
  // url = url || ''
  // isTab = isTab || true
  // staff_login().then((staff_res) => {
  //   getUserInfo().then((member_res) => {
  //     if (!staff_res && !member_res) {
  //       // 商户false、会员false => 进入会员
  //       enterMember(member_res)
  //     } else if (!staff_res && member_res) {
  //       // 商户false、会员true => 进入会员
  //       enterMember(member_res)
  //     } else if (staff_res && !member_res) {
  //       // 商户true、会员false => 进入商户
  //       enterStaff(staff_res)
  //     } else if (staff_res && member_res) {
  //       // 商户true、会员false
  //       wx.showModal({
  //         title: "提示",
  //         content: "检测到您是工作人员，请选择当次浏览的信息",
  //         cancelText: "留在会员",
  //         confirmText: "前往商户",
  //         success(res) {
  //           if (res.confirm) {
  //             enterStaff(staff_res)
  //           } else if (res.cancel) {
  //             enterMember(member_res)
  //           }
  //         }
  //       });
  //     }
  //   })
  // })
}

// 进入会员的逻辑
export function enterMember(res) {
  // 清除商户登录信息
  // HttpRequest({
  //   url: window.api + '/user/exit'
  // })
  wx.setStorageSync("staffIsLogin", false);
  // 微信授权
  // HttpRequest({
  //   url: '/mini/login/after/customer',
  //   data: {
  //     miniOpenId: wx.getStorageSync("openId")
  //   },
  //   success(res) {
  //     if (res.data.code == 201) {
  //       wx.request({
  //         url: res.data.data
  //       })
  //     }
  //   }
  // })
  wx.hideLoading();
  let _data = res.data.data
  if (!_data || !_data.length) {
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
    bindMethod()
  }
}

// 进入商户端的处理
export function enterStaff(res, isRefresh) {
  // 调一次登录接口没法获取登录状态
  // staff_login().then((res) => {
  wx.showLoading({
    title: '正在进入..'
  });
  // 清除会员登录信息
  // HttpRequest({
  //   url: window.api + '/wxcustomer/exit'
  // })
  // 微信授权
  // HttpRequest({
  //   url: '/mini/login/after/user',
  //   data: {
  //     miniOpenId: wx.getStorageSync("openId")
  //   },
  //   success(res) {
  //     if (res.data.code == 201) {
  //       wx.request({
  //         url: res.data.data
  //       })
  //     }
  //   }
  // })
  let staff_info = res.data.data
  staff_info.authList = {}
  wx.setStorageSync("Cookie", res.header["Set-Cookie"]);
  wx.setStorageSync("instMsgSubKey", staff_info.instMsgSubKey);
  wx.setStorageSync("staff_info", staff_info);
  wx.setStorageSync("companyId", staff_info.companyId);
  wx.setStorageSync("companyName", staff_info.companyName);
  wx.setStorageSync("isLogin", false)
  wx.setStorageSync("staffIsLogin", true);
  
  // 登录日志
  HttpRequest({
    url: '/system/log/addWorkLog',
    data: {
      workType: 24,
      result: res.data.message,
      descInfo: `登录-商户-小程序：账号:${wx.getStorageSync("phone")}，登录设备:${wx.getSystemInfoSync().model},${wx.getSystemInfoSync().system}，登录时间:${formatDate(new Date(), 'yyyy-MM-dd')}`
    }
  })
  
  // 进入商户端时，门店权限过滤
  console.log("getStorageSync:"+wx.getStorageSync("companyId"))
  HttpRequest({
    url: window.api + "/store/all-store-name-list",
    data: {
      companyId: wx.getStorageSync("companyId")
    },
    success(res) {
      if (res.data.code === 200) {
        let data = res.data.data
        if(data.length > 1 ) {
          data.unshift({
            storeName: "所有门店",
            storeId: ""
          })
        }
        data[0].isDefault = true
        store.commit("saveAllStore", data);
      }
    }
  });

  getAuthList().then((data) => {
    let authList = []
    data.forEach((store) => {
      let authArr = []
      store.authList.forEach((e) => {
        if(e) {
          authArr.push(e.authorityId)
        }
      })
      authList.push({
        departmentIdArray: store.departmentIdArray,
        customerFilterLevel: store.customerFilterLevel,
        positionType: store.positionType,
        authArr: authArr
      })
    })
    wx.setStorageSync("authInto", authList);
    wx.hideLoading()
    if(isRefresh) return refreshPage()
    wx.reLaunch({
      url: "../pageBusiness/workbench/main"
    })
  })
}

function refreshPage() {
  let options = getCurrentPages()[getCurrentPages().length - 1].options
  let params = Object.keys(options).map(item=>{
    return (item) + "=" + (options[item]);
  }).join("&");

  return wx.redirectTo({
    url: './main?' + params
  })
}

// 随机4位数
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAuthList() {
  return new Promise(function (resolve) {
    HttpRequest({
      url: '/user/authInto',
      success(res) {
        if (res.data.code == 200) {
          // store.state.authInto = res.data.data
          resolve(res.data.data)
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      }
    })
  })
}

// 绑定方法
function bindMethod() {
  wx.showLoading({
    title: "登录中..."
  });
  wx.request({
    url: window.api + "/wxcustomer/bindCard",
    data: {
      phone: wx.getStorageSync("phone"),
      companyId: wx.getStorageSync("companyId"),
      miniOpenId: wx.getStorageSync("openId"),
      unionId: wx.getStorageSync("unionId")
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
        console.log('url:'+url)
        console.log('isTab:'+isTab)
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
/* 点击登录按钮逻辑-结束 */

function getAllStore() {
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
if (window) {
  getAllStore().then((res) => {
    if (res.data.code === 200) {
      let data = res.data.data
      data[0].isDefault = true
      store.commit("saveAllStore", data);
      storeId = data[0].storeId
    }
  })
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
function wxPush() {
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
  login,
  staff_login,
  getUserInfo,
  enterMember,
  enterStaff
}
