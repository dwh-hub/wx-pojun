<template>
  <div class="class-times-list">
    <div class="class-times-item flex-wrapper" v-for="(item, index) in classRecord" :key="index">
      <div class="cover flex-left">
        <img>
      </div>
      <div class="item-info flex-middle">
        <div class="title flex-middle-item">{{item.secondCardClassName}}</div>
        <div class="date flex-middle-item">{{item.startTime}}</div>
      </div>
      <div class="tiems flex-right">{{item.consumeAuthority}}次</div>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
export default {
  data() {
    return {
      customerId: "",
      classRecord: [],
      page: 1
    };
  },
  onLoad() {
    setNavTab();
  },
  mounted() {
    this.customerId = wx.getStorageSync("userInfo").id;
    this.getClassRecord();
  },
  methods: {
    // 获取上课记录
    getClassRecord() {
      let that = this;
      HttpRequest({
        url: window.api + "/consumption/log/pages/customer",
        data: {
          pageON: 1,
          customerId: that.customerId,
          signInType: 2
        },
        success(res) {
          that.classRecord = res.data.data.result;
          console.log(that.classRecord);
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";
</style>


