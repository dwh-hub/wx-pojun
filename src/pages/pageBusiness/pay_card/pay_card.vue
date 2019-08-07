<template>
  <div class="pay-card">
    <div class="subtitle">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg" />
      <span class="subtitle-text">开单</span>
    </div>
    <div class="common-services icon-wrapper">
      <div class="services-item icon-item" @click="toNav(item.navUrl)" v-for="(item,index) in typeList" :key="index">
        <image mode="aspectFit" :src="item.iconUrl"></image>
        <div class="services-icon icon-text">{{item.text}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
export default {
  data() {
    return {
      typeList: [{
        iconUrl: "/static/images/staff/card_1.svg",
        text: "购买会籍卡",
        navUrl: "../billing/main?isTeachingContract=0&billingType=1"
      },{
        iconUrl: "/static/images/staff/card_2.svg",
        text: "购买私教卡",
        navUrl: "../billing/main?teachCardType=2&isTeachingContract=1&billingType=2"
      },{
        iconUrl: "/static/images/staff/card_3.svg",
        text: "购买团课卡",
        navUrl: "../billing/main?teachCardType=1&isTeachingContract=1&billingType=3"
      },{
        iconUrl: "/static/images/staff/workbench_icon/operation_report_icon_1.svg",
        text: "预交订金",
        navUrl: "../billing/main?billingType=4"
      }]
    }
  },
  mounted() {
    setNavTab()
  },
  methods: {
    toNav(url) {
      wx.navigateTo({
        url: url
      });
    },
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";
.pay-card {
  .subtitle {
    border-bottom: 1rpx solid #eee;
  }
  .icon-item {
    padding: 0;
    margin-top: 5px;
    >image {
      width: 50px;
      height: 50px;
    }
    .icon-text {
      margin-top: -12px; 
      font-size: 12px;
    }
  }
}
</style>
