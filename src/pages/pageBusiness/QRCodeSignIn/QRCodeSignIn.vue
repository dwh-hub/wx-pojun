<template>
  <div class="qrcode-sign">
    <div class="class-info">教练{{params.coachName}}正在准备为学员{{params.studentName}}上课</div>
    <div class="class-time">上课时间：{{nowTime}}</div>
    <div class="qrcode-wrapper" v-if="params.way == 2 || params.way == 3">
      <van-icon
        @click="replayQrCode()"
        name="replay"
        color="#666666"
        size="25px"
        custom-class="replay"
      />
      <div class="qrcode">
        <img :src="qrcodeURL" alt>
      </div>
      <div class="tip">{{tip}}</div>
    </div>
    <div class="sure-group">
      <div class="sure-item" v-if="params.way == 2 || params.way == 3">
        <img src="http://pojun-tech.cn/assets/img/morenTo.png" alt>
        <div class="sure-text">{{studentText}}</div>
      </div>
      <div class="sure-item" v-if="params.way == 3 || params.way == 4">
        <img src="http://pojun-tech.cn/assets/img/morenTo.png" alt>
        <div class="sure-text">{{receptionText}}</div>
      </div>
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
import QR from "@/libs/weapp-qrcode.js";
import GoEasy from "@/libs/goeasy-wx.0.0.1.min";
export default {
  data() {
    return {
      params: {
        // way: '',(1,"教练自签"),_(2,"教练+会员"),(3,"教练+会员+前台"),(4,"教练+前台");
        // coachName: '',
        // coachId: '',
        // studentName: '',
        // studentId: '',
        // appointId: ''
      },
      nowTime: formatDate(new Date(), "hh:mm"),
      qrcodeURL: "",
      studentText: "正在等待学员确认...",
      receptionText: "正在等待前台确认...",
      timer: null,
      normalCoachCourse: null,
      checkQRStatus: null
    };
  },
  onLoad(options) {
    if (options.params) {
      this.params = JSON.parse(options.params);
      this.getQrCode();
    }
    wx.setNavigationBarColor({
      backgroundColor: "#43424d",
      frontColor: "#ffffff"
    });
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getNowTime();
    }, 60000);
    this.timer;
    this.checkQRStatus = setInterval(() => {
      this.getQRCodeResult();
    }, 1000);
    this.checkQRStatus;
    if (this.params.way == 3 || this.params.way == 4) {
      this.pushMsg();
    }
    this.normalCoachCourse = new GoEasy({
      appkey: wx.getStorageSync("instMsgSubKey")
    });
    this.addHit();
  },
  onUnload() {
    this.cancelHit()
    clearInterval(this.timer);
    clearInterval(this.checkQRStatus);
  },
  onHide() {
    this.cancelHit()
    clearInterval(this.timer);
    clearInterval(this.checkQRStatus);
  },
  computed: {
    tip() {
      switch (this.params.way) {
        case 2:
          return "请出示二维码给学员通过微信扫一扫即可";
        case 3:
          return "请出示二维码给学员通过微信扫一扫和前台确认即可";
        case 4:
          return "前台确认即可";
      }
    }
  },
  methods: {
    getNowTime() {
      this.nowTime = formatDate(new Date(), "hh:mm");
    },
    drawImg(url) {
      var imgData = QR.drawImg(url, {
        typeNumber: 4,
        errorCorrectLevel: "M",
        size: 500
      });
      this.qrcodeURL = imgData;
    },
    getQrCode() {
      let that = this;
      HttpRequest({
        url: window.api + "/qrcode/attendclass/qr",
        data: {
          coachAppointId: that.params.appointId,
          coachId: that.params.coachId
        },
        success(res) {
          that.drawImg(res.data.data);
        }
      });
    },
    replayQrCode() {
      this.qrcodeURL = "";
      this.getQrCode();
    },
    getQRCodeResult() {
      let that = this;
      HttpRequest({
        url: window.api + "/qrcode/attendclass/getPrivateScanResult",
        data: {
          coachAppointId: that.params.appointId
        },
        success(res) {
          if (res.data.code == 200) {
            that.studentText = "学员已确认";
            console.log(that.studentText);
            clearInterval(that.checkQRStatus);
          }
        }
      });
    },
    pushMsg() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/attendclass/verify/coachAndFront",
        data: {
          coachId: that.params.coachId,
          coachAppointId: that.params.appointId
        }
      });
    },
    addHit() {
      let that = this;
      this.normalCoachCourse.subscribe({
        channel:
          "channel_" +
          wx.getStorageSync("companyId") +
          "_" +
          that.params.storeId,
        onMessage: function(message) {
          var valueType = JSON.parse(
            message.content.substring(0, message.content.length)
          );
          if (valueType.channelType == "normal_coach_course") {
            that.addHits(valueType);
          } else if (valueType.channelType == "coach_front") {
            that.coachFronts(valueType);
          }
        }
      });
    },
    cancelHit() {
      let that = this;
      this.normalCoachCourse.unsubscribe({
        channel:
          "channel_" +
          wx.getStorageSync("companyId") +
          "_" +
          that.params.storeId
      });
    },
    addHits(valueType) {
      var frontSures = valueType.data;
      if (!frontSures) {
        if (valueType.message) {
          wx.showModal({
            title: "提示",
            content: valueType.message,
            showCancel: false
          });
          return;
        }
        return;
      } else {
      }
      if (
        frontSures.coachSubscribe == 1 &&
        frontSures.coachSubscribeId == this.params.appointId &&
        valueType.status &&
        valueType.status == 200
      ) {
        this.receptionText = "前台已确认";
        wx.showModal({
          title: "提示",
          content: "上课成功",
          showCancel: false
        });
        setTimeout(() => {
          this.cancelHit();
          wx.redirectTo({
            url: `../appoint_result/main?coachAppointId=${
              this.params.appointId
            }&type=attend`
          });
        }, 500);
      } else if (
        valueType.message &&
        valueType.message != "已确认上课，请等待系统核对"
      ) {
        wx.showModal({
          title: "提示",
          content: valueType.message,
          showCancel: false
        });
      } else if (valueType.message == "扫描二维码已被使用，请勿重复扫描") {
        wx.showModal({
          title: "提示",
          content: valueType.message,
          showCancel: false
        });
      } else if (valueType.status) {
        if (valueType.status == 402) {
          wx.showModal({
            title: "提示",
            content: "前台已取消预约",
            showCancel: false
          });
        } else if (valueType.status == 401) {
          wx.showModal({
            title: "提示",
            content: "无法执行此操作,预约状态异常",
            showCancel: false
          });
        } else if (valueType.status == 403) {
          wx.showModal({
            title: "提示",
            content: "前台已取消失败",
            showCancel: false
          });
        }
      } else {
        if (this.params.way == 2) {
          if (
            frontSures.coachAppointOut.coachAppointId == this.params.appointId
          ) {
            // TODO: 上课
            // addclassport(frontSures.coachAppointOut.coachAppointId);
            // messageOnClass = false;
          }
        } else if (this.params.way == 3) {
          if (
            frontSures.coachAppointOut.coachAppointId == this.params.appointId
          ) {
            this.studentText = "学员已确认";
          }
        }
        // qrCodes = false;
      }
    },
    coachFronts(valueType) {
      var frontSures = valueType.data;
      if (
        frontSures.coachSubscribe == 1 &&
        frontSures.coachSubscribeId == this.params.appointId &&
        valueType.status &&
        valueType.status == 200
      ) {
        if (privateSignWay == 4) {
          if (frontSures.coachSubscribeId == this.params.appointId) {
            this.receptionText = "前台已确认";
          }
        }
      } else if (valueType.status) {
        if (
          valueType.status == 402 &&
          frontSures.coachSubscribeId == this.params.appointId
        ) {
        } else if (
          valueType.status == 401 &&
          frontSures.coachSubscribeId == this.params.appointId
        ) {
          wx.showModal({
            title: "提示",
            content: "无法执行此操作,预约状态异常",
            showCancel: false
          });
        } else if (
          valueType.status == 403 &&
          frontSures.coachSubscribeId == this.params.appointId
        ) {
          wx.showModal({
            title: "提示",
            content: "前台已取消失败",
            showCancel: false
          });
        }
      }
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #43424d;
}
.qrcode-sign {
  text-align: center;
  padding: 0 20px;
  .class-info,
  .class-time {
    margin-top: 30px;
    color: #e8e8e8;
    font-size: 15px;
  }
  .class-time {
    margin-bottom: 30px;
  }
  .qrcode-wrapper {
    position: relative;
    width: 100%;
    padding-top: 50px;
    padding-bottom: 20px;
    border-radius: 3px;
    background-color: #fff;
    .replay {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .qrcode {
      width: 200px;
      height: 200px;
      margin: 0 auto;
      background-color: #43424d;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .tip {
      line-height: 22px;
      margin: 20px 30px 0 30px;
      color: #9f9d9d;
    }
  }
  .sure-group {
    .sure-item {
      margin-top: 10px;
      height: 45px;
      display: flex;
      background-color: #b4b3b8;
      > img {
        height: 45px;
        width: 45px;
      }
      .sure-text {
        flex: 1;
        line-height: 45px;
        text-align: center;
        color: #201f22;
        font-size: 15px;
      }
    }
  }
}
</style>
