/**
 * 设置页面导航条的标题和颜色
 * @param {String} title 
 * @param {String} color 
 */
export default function setNavTab(title, color) {
  wx.setNavigationBarTitle({
    title: title
  });
  wx.setNavigationBarColor({
    frontColor: "#ffffff",
    backgroundColor: color,
    animation: {
      duration: 200,
      timingFunc: "easeIn"
    }
  });
}
