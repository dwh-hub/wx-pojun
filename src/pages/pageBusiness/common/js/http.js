// 公共请求方法， 虽然有点晚，但还是提一下吧

import { HttpRequest, window, formatDate } from "COMMON/js/common.js";
import {
  serviceList
} from "./service_config.js";
import regeneratorRuntime from "./regenerator-runtime/runtime.js";
import qiniuUploader from "./qiniuUploader.js"

// 获取常用服务列表，并根据配置文件过滤添加
function getUseServiceList() {
  return new Promise((resolve) => {
    // resolve([])
    HttpRequest({
      url: '/mini/commonSet/get',
      success(res) {
        let data = JSON.parse(res.data.data)
        let list = []
        if(!data || !data.length) {
          list = serviceList.slice(0,7)
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
  return new Promise(function(resolve, reject) {
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

// 获取教练/销售
function getUserofrole(storeId, positionType) {
  return new Promise((resolve) => {
    HttpRequest({
      url: "/customer/register/userofrole",
      data: {
        storeId: storeId,
        positionType: positionType // 1 教练  2 销售
      },
      success(res) {
        resolve(res.data.data)
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
        qiniuUploader.upload(tempFilePath,(uploadres) => {
          // console.log(uploadres)
          resolve(uploadres)
        }, (error) => {
          console.log('error:'+error)
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


// 手机端私教上课接口
function attendclass(coachAppointId) {
  return new Promise((resolve, reject) => {
    HttpRequest({
      url: "/mobile/coach/appoint/attendclass",
      data: {
        coachAppointId: coachAppointId,
        realTimeStart: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
      },
      success(res) {
        if (res.data.code == 200) {
          resolve()
          let msgData = res.data.data;
          for (let k in msgData) {
            msgData[k] = msgData[k] ? msgData[k] : "";
            if(k == "cardCustomerInfoArray") {
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

export {
  getUseServiceList,
  transformJspImg,
  getStoreSet,
  getUserofrole,
  qiniuUpload,
  attendclass,
  getVenueList
}
