<template>
  <div class="check-in-record">
    <div class="flex-wrapper" v-for="(item, index) in list" :key="index">
      <div class="cover flex-left">
        <img>
      </div>
      <div class="flex-middle">
        <div class="flex-middle-item">{{item.secondCardClassName}}</div>
        <div class="flex-middle-item">{{item.addTime}}</div>
      </div>
      <div class="flex-right">{{item.passModeValue}}</div>
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
      page: 1,
      list: [],
      isLoading: false
    };
  },
  onLoad() {
    setNavTab();
    this.customerId = this.userInfo = wx.getStorageSync("userInfo").id;
    this.getConsumption();
  },
  onReachBottom() {
    this.isLoading = false
    this.getConsumption();
  },
  methods: {
    getConsumption() {
      let that = this;
      HttpRequest({
        url: window.api + "/consumption/log/pages/customer",
        data: {
          customerId: that.customerId,
          pageNo: that.page
        },
        success(res) {
          that.isLoading = false
          if (res.data.code === 200) {
            if (!res.data.data.result.length) {
              return;
            }
            that.list = that.list.concat(res.data.data.result);
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


