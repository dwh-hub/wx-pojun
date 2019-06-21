<template>
  <div class="all-services">
    <div class="icon-group" v-for="(item,index) in iconList" :key="index">
      <div class="icon-title">{{item.title}}</div>
      <div class="common-services icon-wrapper">
        <div
          class="services-item icon-item hidden"
          @click="toNav(item2)"
          @longpress="edit"
          v-for="(item2,index2) in item.list"
          :key="index2"
        >
          <image mode="aspectFit" :src="item2.iconUrl" v-if="item2.isOpen"></image>
          <i class="icon" :class="item2.class" v-else></i>
          <div class="services-icon icon-text">{{item2.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setNavTab, window } from "COMMON/js/common.js";
import {service} from "../common/js/service_config.js";
export default {
  data() {
    return {
      iconList: service,
      serviceList: []
    };
  },
  mounted() {
    setNavTab();
    this.serviceList = wx.getStorageSync('serviceList') || []
  },
  methods: {
    toNav(item) {
      if (!item.navUrl) {
        return;
      }
      if(!this.serviceList.includes(item.text)) {
        this.serviceList.unshift(item.text)
        wx.setStorageSync('serviceList', this.serviceList)
      }
      wx.navigateTo({
        url: item.navUrl
      });
    },
    edit() {
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";
.all-services {
  padding-bottom: 30px;
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
    .icon-item {
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
    }
  }
  .hidden {
    display: none;
  }
}
</style>
