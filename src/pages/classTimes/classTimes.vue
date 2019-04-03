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
    <none-result v-if="isNoneResult" text="暂无记录"></none-result>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import noneResult from "COMPS/noneResult.vue";
export default {
  data() {
    return {
      customerId: "",
      classRecord: [],
      page: 1,
      isLoading: false,
      isNoneResult: false
    };
  },
  onLoad() {
    setNavTab();
  },
  components: {
    noneResult
  },
  onReachBottom() {
    this.getClassRecord();
  },
  mounted() {
    this.customerId = wx.getStorageSync("userInfo").id;
    this.getClassRecord();
  },
  methods: {
    // 获取上课记录
    getClassRecord() {
      this.isLoading = true;
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
              if(that.page == 1) {
                return that.isNoneResult = true
              }
              return
            }
            that.page++
            that.classRecord = that.classRecord.concat(res.data.data.result);
          } else {
            that.isNoneResult = true
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


