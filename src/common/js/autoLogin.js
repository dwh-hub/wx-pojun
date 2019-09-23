import {
  staff_login,
  getUserInfo,
  enterMember,
  enterStaff
} from "./merge_login.js";
import {window} from "./common.js";
console.log("autoLogin.js")

export default function autoLogin() {
  wx.request({
    url: window.api + '/mini/login/check',
    data: {
      miniOpenId: wx.getStorageSync("openId"),
      unionId: wx.getStorageSync("unionId"),
      companyId: wx.getStorageSync("companyId")
    },
    success(res) {
      let curPage = getCurrentPages()[getCurrentPages().length - 1]
      let isHome = curPage.route.includes('homepage')
      let isUser = (curPage.options.type && curPage.options.type == 'staff') || curPage.route.includes('pageBussiness')
      if (res.data.code == 200) {
        if (res.data.message = 'user登录') {
          // TODO: 走商户登录之后流程
          if (isUser) return loginTips('当前登录状态为会员!', '前往切换')
        }
        if (res.data.message = 'customer登录') {
          // TODO: 走会员登录之后流程
          if (isHome) return wx.reLaunch({ url: "/pages/pageBusiness/workbench/main" })
          if (!isUser) return loginTips('当前登录状态为员工!', '前往切换')
        }
      }
      if (res.data.code == 500) {
        if (wx.getStorageSync('isLogin')) {
          // TODO: 走会员登录流程
          getUserInfo().then((member_res) => {
            enterMember(member_res)
          })
          return
        }
        if (wx.getStorageSync('staffIsLogin')) {
          // TODO: 走商户登录流程
          staff_login().then((staff_res) => {
            if (!staff_res) {
              return
            }
            enterStaff(staff_res, isUser)
          })
          return
        }
        // TODO: 提示登录
        if (!isHome) return loginTips('当前状态为未登录，请先登录!', '前往登录')
      }
    }
  })
}

function loginTips(message, confirmText) {
  return wx.showModal({
    title: "提示",
    content: message,
    confirmText: confirmText,
    showCancel: false,
    success(res) {
      if (res.confirm) {
        wx.switchTab({
          url: "/pages/mine/main"
        });
      }
    }
  });
}