<template>
  <div class="appointment-result">
    <div class="header">
      <div class="result-text success">{{detail.statusChar}}</div>
      <p class="result-p">
        感谢您对本课程的支持
        <span v-if="detail.status == 1">，请耐心等待开课</span>
      </p>
    </div>
    <div class="class-info">
      <title-cell title="课程信息" moreText :moreSize="14" :titleSize="16"></title-cell>
      <div class="class-date">预约时间：{{appointTime}}</div>
      <div class="class-date">上课时间：{{attendTime}}</div>
      <div class="class-name">课程名称：{{detail.anotherName || detail.projectName || ''}}</div>
      <div class="class-coach">上课教练：{{coachStr}}</div>
    </div>
    <div class="store" v-if="storeInfo.storeName">
      <div class="title">门店信息</div>
      <store-item :info="storeInfo"></store-item>
    </div>
    <div class="btn-group">
      <span class="cancel" @click="cancel" v-if="detail.status == 1 && type == 'staff'">取消预约</span>
      <span
        class="assess"
        :style="{'background-color': themeColor}"
        @click="assess"
        v-if="(!detail.evaluateId && !detail.teamClassEvaluteId) && detail.status == 3 && type !== 'staff'"
      >评价</span>
      <span class="again" :style="{'background-color': themeColor}" @click="again">再约一节</span>
      <span
        class="write"
        v-if="!detail.handwrittenImgPath && isOpenHandwrittenBoard && coachAppointId && type == 'staff'&& detail.status == 2"
        :style="{'background-color': themeColor}"
        @click="handwrite"
      >手写确认</span>
      <span
        class="see-board"
        v-if="detail.handwrittenImgPath"
        :style="{'background-color': themeColor}"
        @click="showImg = true"
      >查看签名</span>
    </div>

    <van-popup
      :show="showImg"
      @close="showImg = false"
      :duration="200"
      custom-style="border-radius: 4px; max-widht: 80vw;"
    >
      <div class="img-popup-wrapper">
        <!-- <img :src="detail.handwrittenImgPath"> -->
        <image :src="detail.handwrittenImgPath" mode="aspectFit"></image>
      </div>
    </van-popup>

    <page-footer></page-footer>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  getRange,
  WechatMenuisLogin
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell";
import storeItem from "COMPS/storeItem";
import store from "../../utils/store";
import pageFooter from "COMPS/pageFooter.vue";

export default {
  data() {
    return {
      type: "", // 判断是会员端还是商户端
      id: "",
      detail: {},
      storeInfo: {},
      teamAttendId: null,
      coachAppointId: null,
      longitude: "", // 经度
      latitude: "", // 纬度
      isOpenHandwrittenBoard: null,
      showImg: false
    };
  },
  components: {
    titleCell,
    storeItem,
    pageFooter
  },
  computed: {
    appointTime() {
      if (typeof this.detail.timeStart === 'number') {
        return formatDate(new Date(this.detail.timeStart), 'yyyy/MM/dd hh:mm') +' ~ '+ formatDate(new Date(this.detail.timeEnd), 'yyyy/MM/dd hh:mm')
      }
      if (this.detail.timeStart) {
        return this.detail.timeStart.replace(/-/g, '/').slice(0, 16) +' ~ '+this.detail.timeEnd.replace(/-/g, '/').slice(11, 16)
      }
      return "";
    },
    attendTime() {
      let date = ""
      if (typeof this.detail.realTimeStart === 'number') {
        date = formatDate(new Date(this.detail.realTimeStart), 'yyyy/MM/dd hh:mm')
        if (this.detail.realTimeEnd) {
          date += ' ~ '+ formatDate(new Date(this.detail.realTimeEnd), 'yyyy/MM/dd hh:mm')
        }
        return date
      }
      if (this.detail.realTimeStart) {
        date = this.detail.realTimeStart.replace(/-/g, '/').slice(0, 16)
        if (this.detail.realTimeEnd) {
          date += ' ~ '+this.detail.realTimeEnd.replace(/-/g, '/').slice(11, 16)
        }
        return date
      }
      return "暂未开始上课"
    },
    coachStr() {
      if (JSON.stringify(this.detail) == "{}") {
        return "";
      }
      if (this.detail.coachName) {
        return this.detail.coachName.replace(/null/g, "");
      }
      if (this.detail.coachNameArrayStr) {
        return this.detail.coachNameArrayStr.replace(/null/g, "");
      }
      return this.detail.coachNameArray.toString(" ").replace(/null/g, "");
    },
    themeColor() {
      return window.color;
    }
  },
  onShow() {
    WechatMenuisLogin(this.type)
  },
  onLoad(options) {
    // 进页面前先清空数据
    Object.assign(this.$data, this.$options.data());
    this.longitude = store.state.longitude;
    this.latitude = store.state.latitude;
    if (options.teamAttendId) {
      this.teamAttendId = options.teamAttendId;
      this.getClassDetail();
    }
    if (options.coachAppointId) {
      this.coachAppointId = options.coachAppointId;
      this.type = options.type || "";
      this.getCoachDetail();
    }
    setNavTab();
  },
  onUnload() {
    if (getCurrentPages().filter(e => e.route.indexOf('QRCodeSignIn') > -1).length) {
      wx.navigateBack({
        delta: 2
      });
    }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    assess() {
      this.detail["image"] = this.storeInfo.cover;
      let detailStr = JSON.stringify(this.detail);
      if (this.teamAttendId) {
        wx.navigateTo({
          url: `../assess/main?teamAttendId=${
            this.teamAttendId
          }`
        });
      }
      if (this.coachAppointId) {
        wx.navigateTo({
          url: `../assess/main?coachAppointId=${
            this.coachAppointId
          }`
        });
      }
    },
    // 团课
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/getOne",
        data: {
          teamAttendId: that.teamAttendId
        },
        success(res) {
          if (res.data.code === 200) {
            that.detail = res.data.data;
            that.getStoreDetail();
            that.getSetting();
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
          coachAppointId: that.coachAppointId
        },
        success(res) {
          if (res.data.code === 200) {
            let data = res.data.data
            data.handwrittenImgPath = data.handwrittenImgPath ? window.api + data.handwrittenImgPath : data.handwrittenImgPath
            that.detail = data;
            that.getStoreDetail();
            that.getSetting();
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
            let _range;
            let _address = _data.parentName + _data.cityName + _data.address;
            _address = _address.replace(/null/g, "");
            _address = _address.replace(/[0]/gi, "");
            if (_data.mapPoint) {
              let _lat = _data.mapPoint.split(",")[1];
              let _lng = _data.mapPoint.split(",")[0];
              _range = getRange(that.latitude, that.longitude, _lat, _lng);
            }
            let _obj = {
              address: _address || "未设置详细地址",
              storeName: _data.storeName,
              phone: _data.phone,
              range: _range,
              storeId: that.detail.storeId,
              cover: window.api + _data.images.split(",")[0]
            };
            that.storeInfo = _obj;
          }
        }
      });
    },
    cancel() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认取消预约该课程？",
        success(res) {
          if (res.confirm) {
            if (that.teamAttendId) {
              that.cancelClass();
            }
            if (that.coachAppointId) {
              that.cancelCoach();
            }
          }
        }
      });
    },
    // 取消团课预约
    cancelClass() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAppoint/cancel",
        data: {
          teamAttendId: that.teamAttendId
        },
        success(res) {
          if (res.data.code === 200) {
            wx.showToast({
              title: "取消预约成功",
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    // 取消私教
    cancelCoach() {
      let that = this;
      HttpRequest({
        url: window.api + "/coach/private/appoint/cancelClass",
        data: {
          coachAppointId: that.coachAppointId
        },
        success(res) {
          if (res.data.code === 200) {
            wx.showToast({
              title: "取消预约成功",
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
          // wx.showModal({
          //   title: "提示",
          //   content: res.data.data,
          //   showCancel: false
          // });
          // if (res.data.data.indexOf("成功") > -1) {
          //   // 成功
          //   setTimeout(() => {
          //     wx.navigateBack({
          //       delta: 1
          //     });
          //   }, 1000);
          // }
        }
      });
    },
    again() {
      if (this.teamAttendId) {
        wx.redirectTo({
          url: "../teamClassList/main"
        });
      }
      if (this.coachAppointId) {
        if (this.type == "staff") {
          return wx.redirectTo({
            url: `../pageBusiness/appoint_coach/main?id=${this.detail.customerId}&type=预约`
          });
        }
        wx.redirectTo({
          url: "../appointmentCoach/main?coachId=" + this.detail.coachId
        });
      }
    },
    getSetting() {
      let that = this;
      HttpRequest({
        url: "/system/setup/store/query",
        data: {
          storeId: that.detail.storeId
        },
        success(res) {
          that.isOpenHandwrittenBoard = res.data.data.isOpenHandwrittenBoard;
        }
      });
    },
    handwrite() {
      if (this.coachAppointId) {
        wx.redirectTo({
          url: "../pageBusiness/handwrite_board/main?id=" + this.coachAppointId
        });
      }
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
  }
  .btn-group {
    padding-left: 25px;
    padding-top: 10px;
    margin: 15px 0;
    border-top: 1rpx solid #eee;
    text-align: right;
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
    .again,
    .write,
    .see-board {
      color: #fff;
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
