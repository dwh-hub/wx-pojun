const window = {}
window.api = 'http://192.168.1.8'
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

export {window}

/**
 * 设置页面导航条的标题和颜色
 * @param {String} title 
 * @param {String} color 
 */
export function setNavTab(title, color) {
  if (title) {
    wx.setNavigationBarTitle({
      title: title
    });
  }
  wx.setNavigationBarColor({
    frontColor: "#ffffff",
    backgroundColor: color,
    animation: {
      duration: 200,
      timingFunc: "easeIn"
    }
  });
}

/**
 * 封装wx.request,在请求头包个sessionKey
 * @param {Object} obj 像wx.request一样调用
 */
export function HttpRequest(obj) {
  return initsessionKey().then((res) => {
    obj['url'] = 'https://www.yjtechs.com' + obj.url;
    obj.header = obj.header || {};
    obj.header['unique-str'] = res;
    wx.request(obj)
  });
}


export default {
  window,
  setNavTab,
  HttpRequest
}