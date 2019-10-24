<template>
  <div class="check-in-record">
    <div class="flex-wrapper" v-for="(item, index) in list" :key="index">
      <div class="cover flex-left">
        <!-- <img src="http://pojun-tech.cn/assets/img/morenTo.png"> -->
        <div class="day">{{item.day}}</div>
        <div class="month">{{item.month}}月</div>
      </div>
      <div class="flex-middle">
        <div class="flex-middle-item">{{item.secondCardClassName}}</div>
        <!-- <div class="flex-middle-item">{{item.addTime}}</div> -->
        <div class="flex-middle-item">{{item.passModeValue}}</div>
      </div>
      <!-- <div class="flex-right">{{item.passModeValue}}</div> -->
    </div>
    <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading"/>
    </div>
    <none-result v-if="isNoneResult" text="暂无记录"></none-result>
    <page-footer v-if="!isNoneResult"></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest,WechatMenuisLogin } from "COMMON/js/common.js";
import noneResult from "COMPS/noneResult.vue";
import pageFooter from "COMPS/pageFooter.vue"

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
  onShow() {
    WechatMenuisLogin()
  },
  onLoad() {
    setNavTab();
    this.customerId = wx.getStorageSync("userInfo").id;
    this.getConsumption();
  },
  onReachBottom() {
    this.getConsumption();
  },  
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  components: {
    noneResult,
    pageFooter
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
            let _list = res.data.data.result;
            _list = _list.map(e => {
              return {
                month: e.startTime.slice(5, 7),
                day: e.startTime.slice(8, 10),
                passModeValue: e.passModeValue,
                secondCardClassName: e.secondCardClassName,
                consumeAuthority: e.consumeAuthority
              };
            });
            that.list = that.list.concat(_list);
            that.page++
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

.check-in-record {
  .flex-wrapper {
    padding: 0;
    padding-right: 15px;
    align-items: center;
    border: none;
    border-bottom: 1rpx solid #eee;
    .flex-left {
      flex: 0 0 50px;
      padding: 10px 15px;
      margin-right: 15px;
      border-right: 1rpx solid #eee;
      >div {
        text-align: center;
        font-weight: bold;
      }
      .month {
        font-size: 15px;
        color: gray;
      }
      .day {
        font-size: 30px;
        color: #333;
      }
    }
    .flex-middle {
      padding: 10px 0;
    }
  }
}
</style>


