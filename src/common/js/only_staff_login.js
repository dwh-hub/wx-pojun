// 值负责商户端登录
import store from "../../utils/store.js"
import {
  window, HttpRequest, formatDate, wxLogin
} from "COMMON/js/common.js";

function getPhoneNumber_staff(e) {
  return new Promise((resolve) => {
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
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.setStorage({
            key: "phone",
            data: res.data.data,
            success: function () {
              wx.request({
                url: window.api + '/user/login/mini',
                data: {
                  phone: wx.getStorageSync("phone"),
                  companyId: wx.getStorageSync("companyId"),
                  authAppId: 'wxb3aa4f2e2276ecb6',
                  miniOpenId: wx.getStorageSync("openId")
                },
                success(res) {
                  if (res.data.code == 200) {
                    enterStaff(res)
                  } else if (res.data.code == 201) {
                    // 多公司
                    wx.hideLoading()
                    resolve(res)
                  } else {
                    wx.showModal({
                      title: "提示",
                      content: res.data.message,
                      showCancel: false
                    });
                  }
                }
              })
            }
          });
          // wx.setStorage({
          //   key: "phone",
          //   data: "13073618012", //"18759888263",
          //   success: function () {
          //     login(url, isTab);
          //   }
          // });
        } else {
          // TODO:
          if (window.DEBUGGING) {
            return wx.setStorage({
              key: "phone",
              data: "18000241486", // "13285923990",
              success: function () {
                wx.request({
                  url: window.api + '/user/login/mini',
                  data: {
                    phone: wx.getStorageSync("phone"),
                    companyId: wx.getStorageSync("companyId"),
                    authAppId: 'wxb3aa4f2e2276ecb6',
                    miniOpenId: wx.getStorageSync("openId")
                  },
                  success(res) {
                    if (res.data.code == 200) {
                      enterStaff(res)
                    } else if (res.data.code == 201) {
                      // 多公司
                      wx.hideLoading()
                      resolve(res)
                    } else {
                      wx.showModal({
                        title: "提示",
                        content: res.data.message,
                        showCancel: false
                      });
                    }
                  }
                })
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
  })
}

// function getCustomerCompanyList() {
//   return new Promise((resolve) => {
//     wx.request({
//       url: window.api + '/user/login/mini',
//       data: {
//         phone: wx.getStorageSync("phone"),
//         companyId: wx.getStorageSync("companyId"),
//         authAppid: 'wxb3aa4f2e2276ecb6'
//       },
//       success(res) {
//         resolve()
//       }
//     })
//   })
// }

function staffLogin(hasAppid) {
  wx.showLoading({
    title: "登录中..."
  });
  return new Promise((resolve) => {
    wx.request({
      url: window.api + '/user/login/mini',
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: wx.getStorageSync("companyId"),
        authAppId: hasAppid ? 'wxb3aa4f2e2276ecb6' : ''
      },
      success(res) {
        if (res.data.code == 200) {
          enterStaff(res)
        } else if (res.data.code == 201) {
          // 多公司
          wx.hideLoading()
          resolve(res)
        } else {
          wx.hideLoading()
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

function enterStaff(res) {
  let staff_info = res.data.data
  staff_info.authList = {}
  wx.setStorageSync("Cookie", res.header["Set-Cookie"]);
  wx.setStorageSync("instMsgSubKey", staff_info.instMsgSubKey);
  wx.setStorageSync("staff_info", staff_info);
  wx.setStorageSync("companyId", staff_info.companyId);
  wx.setStorageSync("companyName", staff_info.companyName);
  wx.setStorageSync("isLogin", false)
  wx.setStorageSync("staffIsLogin", true);

  HttpRequest({
    url: '/system/log/addWorkLog',
    data: {
      workType: 24,
      result: res.data.message,
      descInfo: `登录-商户-小程序：账号:${wx.getStorageSync("phone")}，登录设备:${wx.getSystemInfoSync().model},${wx.getSystemInfoSync().system}，登录时间:${formatDate(new Date(), 'yyyy-MM-dd')}`
    }
  })

  HttpRequest({
    url: window.api + "/store/all-store-name-list",
    data: {
      companyId: wx.getStorageSync("companyId")
    },
    success(res) {
      if (res.data.code === 200) {
        let data = res.data.data
        if (data.length > 1) {
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
        if (e) {
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
    wx.reLaunch({
      url: "../pageBusiness/workbench/main"
    })
  })
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

export {
  getPhoneNumber_staff,
  staffLogin
}