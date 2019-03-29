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
    <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading"/>
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
      page: 1,
      isLoading: false
    };
  },
  onLoad() {
    setNavTab();
  },
  onReachBottom() {
    this.isLoading = true;
    this.getClassRecord();
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
          pageON: that.page,
          customerId: that.customerId,
          signInType: 2
        },
        success(res) {
          that.isLoading = false;
          if (res.data.code === 200) {
            if(!res.data.data.result.length) {
              return
            }
            that.page++
            that.classRecord = that.classRecord.concat(res.data.data.result);
          }
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


