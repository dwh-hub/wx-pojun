<template>
  <div class="class-times-list">
    <div class="class-times-item flex-wrapper" v-for="(item, index) in classRecord" :key="index">
      <div class="cover flex-left">
        <!-- <img> -->
        <div class="day">{{item.day}}</div>
        <div class="month">{{item.month}}月</div>
      </div>
      <div class="item-info flex-middle">
        <div class="title flex-middle-item">{{item.secondCardClassName}}</div>
        <div class="title flex-middle-item">{{item.passModeValue}}</div>
        <!-- <div class="date flex-middle-item">{{item.startTime}}</div> -->
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
          pageNo: that.page,
          customerId: that.customerId,
          signInType: 2
        },
        success(res) {
          that.isLoading = false;
          if (res.data.code === 200) {
            if (!res.data.data.result.length) {
              if (that.page == 1) {
                return (that.isNoneResult = true);
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
            that.classRecord = that.classRecord.concat(_list);
            that.page++;
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

.class-times-list {
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


