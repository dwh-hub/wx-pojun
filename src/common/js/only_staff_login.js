// 公共小程序登录逻辑
import store from "../../utils/store.js"
import regeneratorRuntime from "@/libs/regenerator-runtime/runtime.js";
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
            success: async function () {
              // const staff_res = await staffLogin(true)
              // resolve(staff_res.data.data)
              const result = await publicLogin()
              if (result && result.companyList.length > 1) {
                resolve(result)
              }
            }
          });
        } else {
          if (window.DEBUGGING) {
            return wx.setStorage({
              key: "phone",
              data: "18000241486", // "13285923990",
              success: async function () {
                // const staff_res = await staffLogin(true)
                // resolve(staff_res.data.data)
                const result = await publicLogin()
                if (result && result.companyList.length > 1) {
                  resolve(result)
                }
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

// 判断用户账号信息
function checkAccount() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: window.api + '/mini/checkAccount',
      data: {
        phone: wx.getStorageSync("phone"),
        // companyId: wx.getStorageSync("companyId")
      },
      success(res) {
        // 查询成功：0都不存在，1都存在，2只有customer，3只有user
        resolve(res.data.data)
      }
    })
  })
}

async function publicLogin() {
  const account = await checkAccount()
  let loginData = {
    role: '',
    companyList: []
  }

  // 会员 商户 xx
  if (account == 0) {
    return wx.showModal({
      title: "提示",
      content: "无用户信息",
      showCancel: false
    });
  }
  // 会员 x 
  if (account == 3) {
    // 商户单公司
    let staff = await staffLogin(true)
    loginData.role = 'staff'
    if (staff.data.code == 200) enterStaff(staff)
    // 商户多公司 返回公司列表
    if (staff.data.code == 201) loginData.companyList = staff.data.data
    return loginData
  }

  // 商户 x
  if (account == 2) {
    let member = await checkMember()
    loginData.role = 'member'
    // 会员单公司
    if (member.data.data.length == 1) enterMember(member.data.data[0])
    // 会员多公司
    if (member.data.data.length > 1) loginData.companyList = member.data.data
    return loginData
  }

  // 会员、商户 ok
  if (account == 1) {
    return new Promise((resolve) => {
      wx.showModal({
        title: "提示",
        content: "检测到您是工作人员，请选择当次浏览的信息",
        cancelText: "留在会员",
        confirmText: "前往商户",
        success: async function (res) {
          if (res.confirm) {
            // 进商户
            let staff = await staffLogin(true)
            loginData.role = 'staff'
            if (staff.data.code == 200) enterStaff(staff)
            if (staff.data.code == 201) loginData.companyList = staff.data.data
          } else if (res.cancel) {
            // 进会员
            let member = await checkMember()
            loginData.role = 'member'
            if (member.data.data.length == 1) enterMember(member.data.data[0])
            if (member.data.data.length > 1) loginData.companyList = member.data.data
          }
          resolve(loginData)
        }
      });
    })
  }

}


// 查询该手机号是否有会员
export function checkMember() {
  return new Promise(function (resolve) {
    wx.request({
      url: window.api + "/wxcustomer/findCustomerStore",
      data: {
        phone: wx.getStorageSync("phone")
      },
      success(res) {
        if (res.data.code == 200) {
          resolve(res)
        } else {
          resolve(false)
        }
      }
    });
  });
}

// 会员登录成功后
function enterMember(data) {
  // 清除商户登录信息
  // HttpRequest({
  //   url: window.api + '/user/exit'
  // })
  wx.setStorageSync("staffIsLogin", false);
  wx.hideLoading();

  store.commit("saveUserInfo", data);
  wx.setStorage({
    key: "userInfo",
    data: data
  });
  wx.setStorage({
    key: "companyId",
    data: data.companyId
  });
  wx.setStorage({
    key: "companyName",
    data: data.companyName
  });
  bindMember()
}

// 会员绑定
function bindMember() {
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
        wx.setStorageSync("isLogin", true)
        setTimeout(() => {
          wx.reLaunch({
            url: './main'
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

// 商户登录
function staffLogin(hasAppid) {
  wx.showLoading({
    title: "登录中..."
  });
  return new Promise((resolve) => {
    wx.request({
      url: window.api + '/user/login/mini',
      data: {
        phone: wx.getStorageSync("phone"),
        companyId: hasAppid ?  '5' : wx.getStorageSync("companyId"),
        authAppId: hasAppid ? 'wxb3aa4f2e2276ecb6' : ''
      },
      success(res) {
        // if (res.data.code == 200) {
        //   enterStaff(res)
        // } else if (res.data.code == 201) {
        //   // 多公司
        //   wx.hideLoading()
        //   resolve(res)
        // } else {
        //   wx.hideLoading()
        //   wx.showModal({
        //     title: "提示",
        //     content: res.data.message,
        //     showCancel: false
        //   });
        // }
         wx.hideLoading()
        if (res.data.code == 200 || res.data.code == 201) {
          resolve(res)
        } else {
          resolve(false)
        }
      }
    })
  })
}

// 商户登录成功后
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

// 获取权限列表
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
  staffLogin,
  enterStaff,
  enterMember
}