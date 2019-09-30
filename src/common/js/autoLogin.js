import {
  staff_login,
  getUserInfo,
  enterMember,
  enterStaff
} from "./merge_login.js";
import {window, HttpRequest } from "./common.js";
console.log("autoLogin.js")

const openPages = ['pages/homepage/main', 'pages/active/main', 'pages/allStore/main', 'pages/storeDetail/main', 'pages/teamClassList/main', 'pages/teamClassDetail/main', 'pages/mine/main', 'pages/appointmentClass/main', 'pages/coachDetail/main', 'pages/coachList/main', 'activeDetail', 'pages/message/main']

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

export default function autoLogin() {
  wx.request({
    url: window.api + '/mini/login/check',
    data: {
      miniOpenId: wx.getStorageSync("openId") || '',
      unionId: wx.getStorageSync("unionId") || '',
      companyId: wx.getStorageSync("companyId") || ''
    },
    success(res) {
      let curPage = getCurrentPages()[getCurrentPages().length - 1]
      // let curPage = {
      //   route: 'pages/pageBusiness/workbench/main',
      //   options: {}
      // }
      let isHome = curPage.route.includes('homepage')
      let isUser = (curPage.options.type && curPage.options.type == 'staff') || curPage.route.includes('pageBusiness')
      let isOpenPage = openPages.includes(curPage.route)
      console.log('isHome:'+isHome)
      console.log('isUser:'+isUser)
      console.log('isOpenPage:'+isOpenPage)
      console.log('curPage.route:'+curPage.route)
      console.log('message:'+res.data.message)
      if (res.data.code == 200) {
        wx.setStorageSync("Cookie", res.header["Set-Cookie"]);
        if (res.data.message == 'user') {
          // 走商户登录之后流程
          if (!wx.getStorageSync('authInto') && isUser)  {
            console.log("no-authInto")
            wx.showLoading({
              title: '登录中...'
            })
            let _data = res.data.data
            _data.authList = {}
            wx.setStorageSync("staff_info", _data);
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
              wx.setStorageSync("staffIsLogin", true);
              wx.hideLoading()
              wx.reLaunch({
                url: "/pages/pageBusiness/workbench/main"
              })
            })
          }
          if (isHome && wx.getStorageSync('staffIsLogin') && wx.getStorageSync('authInto')) return wx.reLaunch({ url: "/pages/pageBusiness/workbench/main" })
          if (!isUser && !isOpenPage) return loginTips('当前登录状态为员工!', '前往切换')
        }
        if (res.data.message == 'customer') {
          // 走会员登录之后流程
          if (isUser) return loginTips('当前登录状态为会员!', '前往切换')
        }
      }
      if (res.data.code == 500) {
        if (wx.getStorageSync('isLogin')) {
          // 走会员登录流程
          getUserInfo().then((member_res) => {
            enterMember(member_res)
          })
          return
        }
        if (wx.getStorageSync('staffIsLogin')) {
          // 走商户登录流程
          staff_login().then((staff_res) => {
            if (!staff_res) {
              return
            }
            enterStaff(staff_res, isUser)
          })
          return
        }
        // TODO: 提示登录
        if (!isOpenPage) return loginTips('当前状态为未登录，请先登录!', '前往登录')
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