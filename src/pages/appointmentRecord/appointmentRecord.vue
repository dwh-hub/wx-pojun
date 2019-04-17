<template>
  <div class="appointment-record">
    <div class="appointment-item" v-for="(item, index) in recordList" :key="index">
      <div class="record-left">
        <div class="time">{{item.endTime}}</div>
        <div class="type success" :class="{fail: (item.status == 5 || item.status == 7|| item.status == 9)}">{{item.statusChar}}</div>
        <span class="dot"></span>
      </div>
      <div class="record-right">
        <div class="title">{{item.name}}</div>
        <div class="date">{{item.date}}</div>
        <div class="time">{{item.startTime}}~{{item.endTime}}</div>
      </div>
    </div>
    <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading"/>
    </div>
    <none-result v-if="isNoneResult" text="暂无记录"></none-result>
    <page-footer v-if="!isNoneResult"></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import pageFooter from "COMPS/pageFooter.vue"
import noneResult from "COMPS/noneResult.vue";

export default {
  data() {
    return {
      recordList: [],
      page: 1,
      isLoading: false,
      isNoneResult: false
    };
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
    setNavTab();
  },
  mounted() {
    this.getAppointRecordList();
  },
  onReachBottom() {
    this.getAppointRecordList();
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
  methods: {
    getAppointRecordList() {
      this.isLoading = true;
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/pages/own",
        data: {
          pageNo: that.page,
          customerId: wx.getStorageSync("userInfo").id
        },
        success(res) {
          that.isLoading = false;
          if (!res.data.data.result.length) {
            if(that.page == 1) {
              that.isNoneResult = true
            }
            return;
          }
          let _data = res.data.data.result.map(e => {
            return {
              name: e.cardClassName || "",
              statusChar: e.statusChar,
              status: e.status,
              date: e.timeEnd.split(" ")[0],
              startTime: e.timeStart.split(" ")[1].slice(0, 5),
              endTime: e.timeEnd.split(" ")[1].slice(0, 5)
            };
          });
          that.recordList = that.recordList.concat(_data);
          that.page++;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";

.appointment-record {
  .appointment-item {
    display: flex;
    border-bottom: 1rpx solid #eee;
    .record-left {
      position: relative;
      flex: 0 0 90px;
      text-align: center;
      padding: 20px 0;
      border-right: 1rpx solid #eee;
      .dot {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(50%, -50%);
        border-radius: 50%;
        width: 7px;
        height: 7px;
        background: #70b624;
      }
      .time {
        font-size: 18px;
        font-weight: bold;
      }
      .type {
        display: inline-block;
        color: #fff;
        padding: 0 5px;
        margin: 0 auto;
        text-align: center;
        line-height: 20px;
        border-radius: 4px;
        font-size: 12px;
        margin-top: 5px;
        &.success {
          background-color: #1e90ff;
        }
        &.fail {
          background-color: #ef4f4f;
        }
      }
    }
    .record-right {
      flex: 1;
      padding: 10px 0;
      padding-left: 20px;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .date {
        margin: 5px 0;
      }
      .date,
      .time {
        color: #999;
      }
    }
  }
}
</style>


