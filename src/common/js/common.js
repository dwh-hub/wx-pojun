const window = {}
window.api = 'https://www.pojun-tech.cn'
window.DEBUGGING = true
window.color= "#2a82e4"
let Cookie = ""

// 获取sessionKey 需调用wx.login获取sessionKey
function initsessionKey() {
  let sessionKey = wx.getStorageSync("sessionKey");

  if (sessionKey) {
    console.log("获取sessionKey1:" + sessionKey);
    this.sessionKey = sessionKey;
    return Promise.resolve(sessionKey);
  }
  return Promise.resolve();
}

// 获取Set-Cookie
function initCookie() {
  // if (SetCookie) {
  let _Cookie = wx.getStorageSync("Cookie");
  Cookie = _Cookie
  return Promise.resolve(_Cookie);
  // }
  // return Promise.resolve();
}

export {
  window
}

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
  wx.setNavigationBarColor({
    frontColor: "#ffffff",
    backgroundColor: "#2a82e4",
    animation: {
      duration: 200,
      timingFunc: "easeIn"
    }
  });
}

/**
 * 封装wx.request,在请求头包个SetCookie
 * @param {Object} obj 像wx.request一样调用
 */
export function HttpRequest(obj) {
  return initCookie().then((res) => {
    // obj['url'] = 'https://192.168.1.8' + obj.url;
    obj.header = obj.header || {};
    obj.header['Cookie'] = res;
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
 * 获取cookie
 * @param {String} c_name cookie的名称
 */
export function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return "";
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


/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，单位是毫秒（ms）
 *
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

export default {
  window,
  setNavTab,
  HttpRequest,
  checkPhoneFormat,
  getCookie,
  formatDate,
  debounce,
  getRange
}
