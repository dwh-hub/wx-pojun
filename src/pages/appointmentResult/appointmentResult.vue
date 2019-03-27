<template>
  <div class="appointment-result">
    <div class="header">
      <div class="result-text success">{{detail.statusChar}}</div>
      <p class="result-p">
        感谢您对本课程的支持
        <span v-if="detail.status == 1">，请耐心等待开课</span>
      </p>
      <div class="btn-group">
        <span class="cancel">取消预约</span>
        <span class="assess" @click="assess" v-if="!detail.evaluateId">评价</span>
        <span class="again">再约一节</span>
      </div>
    </div>
    <div class="class-info">
      <title-cell title="课程信息" moreText :moreSize="14" :titleSize="16"></title-cell>
      <div class="class-date">上课日期：{{timeStart}}</div>
      <div class="class-name">课程名称：{{detail.anotherName || detail.projectName}}</div>
      <div class="class-coach">上课教练：{{coachStr}}</div>
    </div>
    <div class="store" v-if="storeInfo.storeName">
      <div class="title">门店信息</div>
      <store-item :info="storeInfo"></store-item>
    </div>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell";
import storeItem from "COMPS/storeItem";

export default {
  data() {
    return {
      id: "",
      detail: {},
      storeInfo: {}
    };
  },
  components: {
    titleCell,
    storeItem
  },
  computed: {
    timeStart() {
      if (this.detail.timeStart) {
        return formatDate(new Date(this.detail.timeStart), "yyyy-MM-dd");
      } else {
        return "";
      }
    },
    coachStr() {
      if (JSON.stringify(this.detail) == "{}") {
        return "";
      }
      if (this.detail.coachName) {
        return this.detail.coachName;
      }
      if (this.detail.coachNameArrayStr) {
        return this.detail.coachNameArrayStr;
      }
      return this.detail.coachNameArray.toString(" ");
    }
  },
  onLoad(options) {
    if (options.teamAttendId) {
      this.id = options.teamAttendId;
      this.getClassDetail();
    }
    if (options.coachAppointId) {
      this.id = options.coachAppointId;
      this.getCoachDetail();
    }
    setNavTab();
  },
  methods: {
    assess() {
      wx.navigateTo({
        url: "../assess/main"
      });
    },
    // 团课
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/getOne",
        data: {
          teamAttendId: that.id
        },
        success(res) {
          if (res.data.code === 200) {
            that.detail = res.data.data;
            that.getStoreDetail();
          }
        }
      });
    },
    // 私教课
    getCoachDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/detail",
        data: {
          coachAppointId: that.id
        },
        success(res) {
          if (res.data.code === 200) {
            that.detail = res.data.data;
            that.getStoreDetail();
          }
        }
      });
    },
    // 获取门店详情
    getStoreDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/store/detail/" + that.detail.storeId,
        success(res) {
          if (res.data.code === 200) {
            let _data = res.data.data;
            let _address = _data.parentName + _data.cityName + _data.address;
            _address = _address.replace(/null/g, "");
            _address = _address.replace(/[0]/gi, "");
            let _obj = {
              address: _address || "未设置详细地址",
              storeName: _data.storeName,
              phone: _data.phone,
              storeId: that.detail.storeId,
              bannerList: _data.images.split(",")
            };
            that.storeInfo = _obj;
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.appointment-result {
  .header {
    .result-text {
      line-height: 60px;
      padding-left: 20px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1rpx solid #eee;
      &.success {
        color: #43cf7c;
      }
    }
    .result-p {
      padding-left: 20px;
      margin-top: 10px;
      margin-bottom: 12px;
      color: #bababa;
      span {
        color: #bababa;
      }
    }
    .btn-group {
      padding-left: 25px;
      padding-bottom: 10px;
      border-bottom: 1rpx solid #eee;
      > span {
        display: inline-block;
        width: 70px;
        text-align: center;
        line-height: 26px;
        margin-right: 15px;
        border-radius: 2px;
      }
      .cancel {
        color: #333;
        border: 1rpx solid #e2e2e2;
      }
      .assess,
      .again {
        background-color: @theme-color;
        color: #fff;
      }
    }
  }
  .class-info {
    padding: 0 15px;
    .class-date,
    .class-name,
    .class-coach {
      padding-left: 15px;
      line-height: 46px;
      border-top: 1rpx solid #eee;
      color: #333;
    }
  }
  .store {
    padding: 0 15px;
    border-top: 1rpx solid #eee;
    .title {
      line-height: 40px;
      color: #333;
    }
  }
}
</style>
