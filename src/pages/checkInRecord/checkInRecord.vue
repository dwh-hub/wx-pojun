<template>
  <div class="check-in-record">
    <div class="flex-wrapper" v-for="(item, index) in list" :key="index">
      <div class="cover flex-left">
        <img src="http://pojun-tech.cn/assets/img/morenTo.png">
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
      page: 1,
      list: [],
      isLoading: false,
      isNoneResult: false
    };
  },
  onLoad() {
    setNavTab();
    this.customerId = this.userInfo = wx.getStorageSync("userInfo").id;
    this.getConsumption();
  },
  onReachBottom() {
    this.getConsumption();
  },  
  components: {
    noneResult
  },
  computed: {
    window() {
      return window
    }
  },
  methods: {
    getConsumption() {
      this.isLoading = false
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
              if(that.page == 1) {
                return that.isNoneResult = true;
              }
              return;
            }
            that.page++
            that.list = that.list.concat(res.data.data.result);
          } else {
            that.isNoneResult = true;
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


