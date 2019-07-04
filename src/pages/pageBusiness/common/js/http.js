// 公共请求方法， 虽然有点晚，但还是提一下吧

import { HttpRequest } from "COMMON/js/common.js";
import {
  serviceList
} from "./service_config.js";

// 获取常用服务列表，并根据配置文件过滤添加
function getUseServiceList() {
  return new Promise((resolve) => {
    // resolve([])
    HttpRequest({
      url: '/mini/commonSet/get',
      success(res) {
        let data = JSON.parse(res.data.data)
        let list = []
        serviceList.forEach((item, index) => {
          if (data.filter(e => e.authorityId == item.authorityId).length) {
            list.push(item)
          }
        })
        resolve(list)
      }
    })
  })
}

export {
  getUseServiceList
}
