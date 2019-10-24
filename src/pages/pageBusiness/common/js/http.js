// 公共请求方法， 虽然有点晚，但还是提一下吧

import { HttpRequest, window, formatDate } from "COMMON/js/common.js";
import {
  serviceList
} from "./service_config.js";
import regeneratorRuntime from "./regenerator-runtime/runtime.js";
import qiniuUploader from "./qiniuUploader.js"
import F2 from '@antv/wx-f2';

// 获取常用服务列表，并根据配置文件过滤添加
function getUseServiceList() {
  return new Promise((resolve, reject) => {
    // resolve([])
    HttpRequest({
      url: '/mini/commonSet/get',
      success(res) {
        if (JSON.stringify(res.data).includes('DOCTYPE html') && wx.getStorageSync('instMsgSubKey')) {
          return resolve([])
        }
        let data = JSON.parse(res.data.data)
        let list = []
        if (!data || !data.length) {
          list = serviceList.slice(0, 7)
          return resolve(list)
        }
        // serviceList.forEach((item, index) => {
        //   if (data.filter(e => e.authorityId == item.authorityId).length) {
        //     list.push(item)
        //   }
        // })
        data.forEach((e) => {
          serviceList.forEach((item) => {
            if (e.authorityId == item.authorityId) {
              list.push(item)
            }
          })
        })
        resolve(list)
      }
    })
  })
}

// 请求.jsp地址的图片
function loadJspUrl(url) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: window.api + url,
      success(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          resolve(window.api + "/assets/img/morenTo.png");
        }
      }
    });
  });
}

// 转换.jsp后缀的图片路径为正常图片格式
async function transformJspImg(param) {
  let imgUrl = ""
  if (param || param != null) {
    if (param.indexOf(".jsp") != -1) {
      await loadJspUrl(param).then(res => {
        imgUrl = res; // res => base64格式
      });
    } else {
      imgUrl = window.api + param;
    }
  } else {
    imgUrl = window.api + '/assets/img/morenTo.png'
  }
  return imgUrl
}

// 获取门店通用设置
function getStoreSet(storeId) {
  return new Promise((resolve) => {
    HttpRequest({
      url: "/system/setup/store/query",
      data: {
        storeId: storeId
      },
      success(res) {
        resolve(res.data.data)
      }
    });
  })
}

// 获取门店场馆列表
function getVenueList(storeId) {
  return new Promise((resolve) => {
    HttpRequest({
      url: "/venue/name/list",
      data: {
        storeId: storeId
      },
      success(res) {
        resolve(res.data.data)
      }
    });
  })
}

// 获取教练/销售  positionType 1 教练  0 销售
function getUserofrole(storeId, positionType) {
  return new Promise((resolve) => {
    HttpRequest({
      url: "/customer/register/userofrole",
      data: {
        storeId: storeId,
        positionType: positionType
      },
      success(res) {
        let data = res.data.data
        data.forEach((e1, index1) => {
          data.forEach((e2, index2) => {
            if (e1.userId == e2.userId && index1 != index2) {
              delete data[index]
            }
          })
        })
        resolve(data)
      }
    });
  })
}

/**
 * 上传图片至七牛
 * @param {Array} tempFilePath chooseImage返回的文件列表
 * @param {String} fileName 文件名
 */
function qiniuUpload(tempFilePath, fileName) {
  // 获取 七牛 token值
  return new Promise((resolve) => {
    HttpRequest({
      url: '/qiniu/getToken',
      success(res) {
        let token = res.data.data
        qiniuUploader.upload(tempFilePath, (uploadres) => {
          // console.log(uploadres)
          resolve(uploadres)
        }, (error) => {
          console.log('error:' + error)
        }, { // 参数设置  地区代码 token domain 和直传的链接 注意七牛四个不同地域的链接不一样，我使用的是华南地区
            region: 'SCN',
            uptoken: token,
            fileName: fileName,
            uploadURL: 'http://upload-z2.qiniup.com',
            domain: 'http://api.qiniu.com/v2/query',
          })
      }
    })
  })
}


/**
 * 手机端私教上课接口
 * @param {Number|String} coachAppointId 预约id
 * @param {Number} customerSignWay 私教会员签到方式，0二维码，1人脸
 */
function attendclass(coachAppointId, customerSignWay) {
  return new Promise((resolve, reject) => {
    HttpRequest({
      url: "/mobile/coach/appoint/attendclass",
      data: {
        coachAppointId: coachAppointId,
        customerSignWay: customerSignWay || '',
        realTimeStart: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
      },
      success(res) {
        if (res.data.code == 200) {
          resolve()
          let msgData = res.data.data;
          for (let k in msgData) {
            msgData[k] = msgData[k] ? msgData[k] : "";
            if (k == "cardCustomerInfoArray") {
              delete msgData[k]
            }
          }
          HttpRequest({
            url: '/sendmsg/customer/consumemsg',
            data: msgData
          })
        } else {
          reject()
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  })
}

// 折线图
function initLine(canvas, width, height, initData) {
  let data = []
  if (!initData.length) {
    data = [
      {
        time: formatDate(new Date(), "yyyy-MM-dd"),
        tem: ""
      }
    ];
  } else {
    data = initData;
  }
  let chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  let defs = {
    time: {
      type: "timeCat",
      mask: "MM-DD",
      range: [0, 1]
    },
    tem: {
      tickCount: 5,
      min: 0,
      alias: "元"
    }
  };
  chart.source(data, defs);
  chart.tooltip({
    custom: true,
    showXTip: true,
    showYTip: true,
    showCrosshairs: true,
    snap: true,
    crosshairsType: 'xy',
    crosshairsStyle: {
      lineDash: [2]
    }
  });

  chart
    .line()
    .position("time*tem")
    .shape("smooth");
  chart
    .point()
    .position("time*tem")
    .shape("smooth")
    .style({
      stroke: "#fff",
      lineWidth: 1
    });
  chart.render();
}

// 校验教练上课状态 - 上课中弹结束课程弹窗
function checkAttendStatus(coachId) {
  wx.showLoading()
  return new Promise((resolve) => {
    HttpRequest({
      url: window.api + "/coach/private/appoint/verifycoachId",
      data: {
        coachId: coachId
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          resolve()
        }
        if (res.data.code == 300) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            success(modal_res) {
              if (modal_res.confirm) {
                wx.showLoading()
                HttpRequest({
                  url: window.api + "/mobile/coach/appoint/finishclass",
                  data: {
                    coachAppointId: res.data.data[0].coachAppointId,
                    realTimeEnd: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                  },
                  success(finish_res) {
                    wx.hideLoading()
                    if (finish_res.data.code == 200) {
                      resolve()
                    } else {
                      wx.showModal({
                        title: "提示",
                        content: finish_res.data.message || finish_res.data,
                        showCancel: false
                      });
                    }
                  }
                });
              }
            }
          });
        }
        if (res.data.code == 405) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  })
}

// 消费/撤消/反撤消后的出勤记录更新
function recordUpdate(customerId,storeId,venueId,startTime) {
  HttpRequest({
    url: '/attendance/record/cost/after',
    data: {
      companyId: wx.getStorageSync('companyId'),
      customerId,
      storeId,
      venueId,
      startTime
    }
  })
}

export {
  getUseServiceList,
  transformJspImg,
  getStoreSet,
  getUserofrole,
  qiniuUpload,
  attendclass,
  getVenueList,
  initLine,
  checkAttendStatus,
  recordUpdate
}
