<template>
  <div class="all-services">
    <div class="always-service" v-if="editing">
      <div class="title">
        <span class="always">我常用的</span>
        <span class="sure" @click="edit">完成</span>
      </div>
      <div class="service-box">
        <div class="common-services icon-wrapper">
          <div
            class="services-item icon-item"
            v-for="(item2,index2) in alwaysService"
            @click="deleteService(index2)"
            :key="index2"
          >
            <image mode="aspectFit" :src="item2.iconUrl" v-if="item2.isOpen"></image>
            <i class="icon" :class="item2.class" v-else></i>
            <div class="services-icon icon-text">{{item2.text}}</div>
            <img src="/static/images/staff/close.svg" class="select-icon">
          </div>
        </div>
      </div>
    </div>
    <div
      class="icon-group"
      v-for="(item,index) in iconList"
      :key="index"
      :class="{hidden: !item.hasAuth}"
    >
      <div class="icon-title" v-if="item.list.length">{{item.title}}</div>
      <div class="common-services icon-wrapper">
        <div
          class="services-item icon-item"
          :class="{hidden: !item2.hasAuth || !item2.isOpen}"
          @click="toNav(item2, index, index2)"
          v-for="(item2,index2) in item.list"
          :key="index2"
        >
          <image mode="aspectFit" :src="item2.iconUrl" v-if="item2.isOpen"></image>
          <i class="icon" :class="item2.class" v-else></i>
          <div class="services-icon icon-text">{{item2.text}}</div>
          <img src="/static/images/staff/select-icon.png" class="select-icon" v-if="item2.isSelect && editing">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import { service, filterAuth } from "../common/js/service_config.js";
import { getUseServiceList } from "../common/js/http.js";
export default {
  data() {
    return {
      iconList: [],
      serviceList: [],
      editing: false,
      alwaysService: [],
      type: ""
    };
  },
  onLoad(options) {
    // this.iconList = service
    this.iconList = filterAuth()
    this.serviceList = wx.getStorageSync("serviceList") || [];
    if (options.type == "edit") {
      setNavTab("设置常用服务");
      this.type = options.type;
      this.editing = true;
      getUseServiceList().then((data) => {
        this.alwaysService = data
        this.filter()
      })
    } else {
      setNavTab();
      this.editing = false;
    }
  },
  methods: {
    toNav(item, groupIndex, itemIndex) {
      if (this.editing) {
        if (!item.isOpen) {
          return wx.showToast({
            title: "暂未开放",
            icon: "none",
            duration: 1000
          });
        }
        if(this.alwaysService.length == 7 && !item.isSelect) {
          return wx.showToast({
            title: "常用设置不能超过7个",
            icon: "none",
            duration: 1000
          });
        }

        let iconObj = this.iconList[groupIndex].list[itemIndex];
        iconObj["isSelect"] = !item.isSelect;
        this.$set(this.iconList[groupIndex].list, itemIndex, iconObj);

        let index
        let has = this.alwaysService.filter((e, key)=>{
          if(item.authorityId == e.authorityId){
            index = key
            return true
          }
          return false
        }).length

        has ? this.alwaysService.splice(index, 1) : this.alwaysService.push(item)

        return;
      }
      if (!item.navUrl) {
        return;
      }
      if (!this.serviceList.includes(item.text)) {
        this.serviceList.unshift(item.text);
        wx.setStorageSync("serviceList", this.serviceList);
      }
      wx.navigateTo({
        url: item.navUrl
      });
    },
    // 过滤选择状态
    filter() {
      this.iconList.forEach(group => {
        group.list.forEach(e => {
          if(this.alwaysService.filter(item => item.authorityId == e.authorityId).length) {
            e["isSelect"] = true;
          } else {
            e["isSelect"] = false;
          }
        });
      });
    },
    edit() {
      let that = this
      let _orderJson = []
      this.alwaysService.forEach((e, index)=> {
        _orderJson.push({
          authorityId: e.authorityId,
          orderId: index+1
        })
      })
      HttpRequest({
        url: '/mini/commonSet/save',
        data: {
          orderJson: JSON.stringify(_orderJson)
        },
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1000
          })
          if(res.data.code == 200) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1000)
          }
        }
      })
    },
    deleteService(index) {
      this.alwaysService.splice(index, 1)
      this.filter()
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";
.all-services {
  padding-bottom: 30px;
  .always-service {
    .title {
      padding-left: 15px;
      background-color: #f4f4f4;
      .always {
        font-size: 16px;
        line-height: 34px;
        font-weight: bold;
      }
      .sure {
        float: right;
        margin-right: 15px;
        margin-top: 3px;
        padding: 0px 10px;
        line-height: 26px;
        border-radius:3px;
        color:#fff;
        background-color:#01c8d1;
      }
    }
  }
  .icon-group {
    .icon {
      font-size: 48px;
      color: #999;
    }
    &:first-of-type {
      .icon-title {
        margin-top: 0;
      }
    }
    .icon-title {
      line-height: 24px;
      padding-left: 15px;
      margin-top: 10px;
      font-size: 12px;
      color: #222;
      background-color: #f4f4f4;
    }
  }
  .icon-item {
    position: relative;
    padding: 0;
    margin-top: 5px;
    > image {
      width: 50px;
      height: 50px;
    }
    .icon-text {
      margin-top: -12px;
      font-size: 12px;
    }
    .select-icon {
      position: absolute;
      top: 5px;
      right: 20px;
      width: 16px;
      height: 16px;
    }
  }
  .hidden {
    display: none;
  }
}
</style>
