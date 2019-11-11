import store from '@/utils/store.js'

const window = {}
window.isPublic = false // 是否是公用的小程序
window.DEBUGGING = false
// 榴莲: https://club.lirenos.com test: https://test.lirenos.com cn: https://www.pojun-tech.cn com: https://www.pojun-tech.com
window.domain = "https://test.lirenos.com" // 服务器域名
window.api = window.DEBUGGING ? "http://192.168.1.19" : window.domain
window.defaultColor = "#0c9cf0"
window.color = "" // "#0c9cf0"
// 获取 ext.json 配置信息
const extConfig = wx.getExtConfigSync() ? wx.getExtConfigSync() : {}
const spareCompany = "55"

if (window.isPublic && wx.getStorageSync('companyId')) {

} else {
  if (extConfig.companyId) {
    wx.setStorageSync('companyId', extConfig.companyId)
  } else {
    if (window.DEBUGGING) {
      wx.setStorageSync('companyId', '55')
    } else {
      wx.setStorageSync('companyId', spareCompany)
    }
  }
}
console.log("common.js")

// 获取Set-Cookie
function initCookie() {
  // if (SetCookie) {
  let _Cookie = wx.getStorageSync("Cookie");
  return Promise.resolve(_Cookie);
  // }
  // return Promise.resolve();
}

export {
  window
}

// 获取公司主题色
export function getThemeColor() {
  return new Promise(function (resolve) {
    if (store.state.companyInfo.companyId && store.state.companyInfo.companyId == wx.getStorageSync('companyId')) {
      return resolve(JSON.parse(store.state.companyInfo.baseInfo).themeColor)
    }
    HttpRequest({
      url: window.api + '/system/set/wxcompanyinfo',
      data: {
        companyId: wx.getStorageSync("companyId") || ''
      },
      success(res) {
        if (res.data.code == 200) {
          store.commit('changeCompanyInfo', res.data.data)
          window.color = JSON.parse(res.data.data.baseInfo).themeColor || window.defaultColor
        } else {
          window.color = window.defaultColor
        }
        resolve(window.color)
      }
    })
  })
}

// 获取公司id之后获取主题色 = 多余代码 = 待整理
export function getCompanyColor() {
  if (!wx.getStorageSync("companyId")) {
    if (window.DEBUGGING) {
      wx.setStorageSync('companyId', '55')
      return getThemeColor()
    } else {
      if (extConfig.companyId) {
        wx.setStorageSync('companyId', extConfig.companyId)
      } else {
        wx.setStorageSync('companyId', spareCompany)
      }
      return getThemeColor()
    }
  } else {
    return getThemeColor()
  }

}

// 微信登录
export function wxLogin() {
  return new Promise(function (resolve) {
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: window.api + '/mini/getsessionByAuth', // ByAuth
            data: {
              code: res.code,
              companyId: wx.getStorageSync("companyId")
            },
            success(data) {
              wx.setStorageSync("sessionKey", data.data.data.sessionKey);
              wx.setStorageSync("openId", data.data.data.openId);
              wx.setStorageSync("unionId", data.data.data.unionId);
              resolve()
            }
          })
        }
      }
    })
  })
}
wxLogin()

/**
 * 设置页面导航条的标题和颜色
 * @param {String} title 
 * @param {String} color 
 */
export function setNavTab(title) {
  if (title) {
    wx.setNavigationBarTitle({
      title: title
    });
  }
  if (!window.color || window.color == window.defaultColor) {
    getCompanyColor().then(() => {
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: window.color || window.defaultColor,
        animation: {
          duration: 0,
          timingFunc: "easeIn"
        }
      });
      wx.setTabBarStyle({
        backgroundColor: window.color || window.defaultColor
      })
    })
  } else {
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: window.color,
      animation: {
        duration: 0,
        timingFunc: "easeIn"
      }
    });
    wx.setTabBarStyle({
      backgroundColor: window.color
    })
  }
}

/**
 * 获取公众号的公司信息
 * @param {String} appid 微信公众号的appid
 */
export function getWXCompany(appid) {
  return new Promise(function (resolve) {
    wx.request({
      url: window.api + '/wxopen/getCompanyByAuthAppId',
      data: {
        authAppId: appid
      },
      success(res) {
        if (res.data.data) {
          wx.setStorageSync("companyId", res.data.data.companyId);
          wx.setStorageSync("companyName", res.data.data.companyName)
          getThemeColor().then(() => {
            resolve()
          })
        }
      }
    })
  })
}


let isShowModal = false
/**
 * 封装wx.request,在请求头包个SetCookie
 * @param {Object} obj 像wx.request一样调用
 */
export function HttpRequest(obj) {
  return initCookie().then((res) => {
    obj.url = obj.url.indexOf(window.api) == -1 ? (window.api + obj.url) : obj.url;
    obj.header = obj.header || {};
    obj.header['Cookie'] = res;

    let success = obj.success || ''

    for (let k in obj.data) {
      if (undefined == obj.data[k] || null == obj.data[k]) {
        obj.data[k] = ""
      }
    }

    // obj.success = function (res) {
    //   let curPageRoute = getCurrentPages()[getCurrentPages().length - 1].route
    //   let type = curPageRoute.indexOf('pageBusiness') > -1 ? "staff" : "member"
    //   if (JSON.stringify(res.data).indexOf('DOCTYPE html') > -1) {
    //     if (type == "member") {
    //       wx.setStorageSync("isLogin", false)
    //     } else {
    //       wx.setStorageSync("staffIsLogin", false)
    //     }
    //     if (curPageRoute.indexOf('mine') == -1 && curPageRoute.indexOf('homepage') == -1 && !isShowModal) {
    //       isShowModal = true
    //       return wx.showModal({
    //         title: "提示",
    //         content: "当前状态为未登录，请先登录!",
    //         confirmText: '前往登录',
    //         showCancel: false,
    //         success(res) {
    //           if (res.confirm) {
    //             wx.switchTab({
    //               url: "/pages/mine/main"
    //             });
    //           }
    //         },
    //         complete() {
    //           isShowModal = false
    //         }
    //       });
    //     }
    //   }
    //   if (type == "staff") {
    //     WechatMenuisLogin("staff")
    //   }
    //   if (success) {
    //     success(res)
    //   }
    // }

    wx.request(obj)
  });
}

/**
 * 
 * @param {Number} phone 手机号
 * @param {String} rejectPrompt 错误提示
 */
export function checkPhoneFormat(phone, rejectPrompt = "手机号格式不正确") {
  if (!phone || "" == phone) {
    return Promise.reject("请输入手机号");
  }

  return new Promise(function (resolve, reject) {
    var isLegal = /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/.test(phone)
    if (isLegal) {
      resolve()
    } else {
      return reject(rejectPrompt)
    }
  })
}

/**	
 * 获取 cookie JSESSIONID
 * @param {String} c_name cookie的名称
 */
export function getCookie() {
  return new Promise(function (resolve) {
    wx.request({
      url: window.api + '/loginPage',
      success(res) {
        if (res.header["Set-Cookie"] != wx.getStorageSync("Cookie")) {
          wx.setStorage({
            key: "Cookie",
            data: res.header["Set-Cookie"],
            success() {
              resolve()
            }
          });
        } else {
          resolve()
        }
      }
    })
  })
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 调用： 
// formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'); ==> 2006-07-02 08:09:04
export function formatDate(date, fmt) {
  // Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


/** 节流
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，单位是毫秒（ms）
 * @return {Function}     返回一个“防反跳”了的函数
 */
export function debounce(fn, delay) {

  // 定时器，用来 setTimeout
  var timer

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

var EARTH_RADIUS = 6378137.0; //单位M
var PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}
/**
 * 计算两个坐标点的距离 返回单位 M
 * @param {Number} lat1 纬度1
 * @param {Number} lng1 经度1
 * @param {Number} lat2 纬度2
 * @param {Number} lng2 经度2
 */
export function getRange(lat1, lng1, lat2, lng2) {

  var f = getRad((Number(lat1) + Number(lat2)) / 2);
  var g = getRad((Number(lat1) - Number(lat2)) / 2);
  var l = getRad((Number(lng1) - Number(lng2)) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  let range = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))

  if (parseInt(range) < 1000) {
    return range.toFixed(2) + ' m'
  } else {
    return (range / 1000).toFixed(2) + ' km'
  }
}

// 公共号进来判断是否登录
export function WechatMenuisLogin(type) { // 1035 1043
  // if (isShowModal) {
  //   return
  // }
  // if (wx.getStorageSync("isLogin") && type != "staff") {
  //   return
  // }
  // if (wx.getStorageSync("staffIsLogin") && type == "staff") {
  //   return
  // }
  // isShowModal = true
  // return wx.showModal({
  //   title: "提示",
  //   content: "当前状态为未登录，请前往登录",
  //   showCancel: false,
  //   success(res) {
  //     if (res.confirm) {
  //       wx.switchTab({
  //         url: "/pages/mine/main"
  //       });
  //     }
  //   },
  //   complete() {
  //     isShowModal = false
  //   }
  // });
}

/**
 * 筛选日期段
 * @param {String | Number} timer 筛选时间段
 */
export function filterDateMethod(timer) {
  let obj = {
    startTime: "",
    endTime: ""
  };
  if (!timer) {
    return obj;
  }
  let date = new Date();
  let today = date.getDate() - 1;
  let weekday = date.getDay() == 0 ? 6 : date.getDay() - 1;
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let monthDay = 0
  if (timer == 'day') obj = computeTimer(0, 1)
  if (timer == 'week') obj = computeTimer(weekday, 7 - weekday)
  if (timer == 'lastWeek') obj = computeTimer(weekday + 7, weekday, false)
  if (timer == 'yesterday') obj = computeTimer(1, 0)
  if (timer == 'month') {
    monthDay = getMonthDay(year, month)
    obj = computeTimer(today, monthDay - today)
  }
  if (timer == 'lastMonth') {
    monthDay = getMonthDay(year, month - 1)
    obj = computeTimer(monthDay + today, today, false)
  }
  if (typeof timer == 'number') {
    obj = computeTimer(timer, 1)
  }
  return obj;
}

function computeTimer(startDay, endDay, isAdd = true, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let date = new Date();
  const DAY = 24 * 60 * 60 * 1000;
  const HOUR8 = 8 * 60 * 60 * 1000;
  let nowStamp = date.getTime();
  let todayStamp = parseInt(nowStamp / DAY) * DAY - HOUR8 // 东八区今天0点的时间戳

  let timer = {}
  timer.startTime = formatDate(new Date(todayStamp - startDay * DAY), fmt);
  timer.endTime = formatDate(new Date(todayStamp + (isAdd ? endDay : -endDay) * DAY - 1), fmt);
  return timer
}

// 获取月的天数
function getMonthDay(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

export default {
  window,
  getThemeColor,
  setNavTab,
  HttpRequest,
  checkPhoneFormat,
  getCookie,
  formatDate,
  debounce,
  getRange,
  wxLogin,
  WechatMenuisLogin,
  filterDateMethod
}
