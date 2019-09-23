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
      <image v-if="params.canFace" class="to-face" src="/static/images/staff/camera.svg" @click="toFace"></image>
       <!--  -->
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
import Vue from 'vue'
import QR from "@/libs/weapp-qrcode.js";
import GoEasy from "../common/js/goeasy-wx.0.0.1.min";
import { EventBus } from "../common/js/eventBus.js";

Vue.prototype.globalData.normalCoachCourse = new GoEasy({
  appkey: wx.getStorageSync("instMsgSubKey"),
  onConnected: function() {
    console.log("on connected...");
  },
  onDisconnected: function() {
    console.log("on disconnected...");
  },
  onConnectFailed: function (error) {
    console.log("与GoEasy连接失败，错误编码："+error.code+"错误信息："+error.content);
  }
});

export default {
  data() {
    return {
      params: {
        // way: '',(1,"教练自签"),_(2,"教练+会员"),(3,"教练+会员+前台"),(4,"教练+前台"),(5,"人脸识别");
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
      // normalCoachCourse: null,
      checkQRStatus: null
    };
  },
  onLoad(options) {
    wx.setNavigationBarColor({
      backgroundColor: "#43424d",
      frontColor: "#ffffff"
    });
    if (options.params) {
      this.params = JSON.parse(options.params);
      console.log(this.params);
    }
    // this.timer = setInterval(() => {
    //   this.getNowTime();
    // }, 60000);
    this.timer;
    if (this.params.way == 2 || this.params.way == 3) {
      this.getQrCode();
      this.checkQRStatus = setInterval(() => {
        this.getQRCodeResult();
      }, 1000);
      this.checkQRStatus;
    }
    if (this.params.way == 4) {
      this.pushMsg();
    }
  },
  onShow() {
    this.addHit();
  },
  mounted() {
    EventBus.$on("confirmed", () => {
      this.studentText = "学员已确认"
    });
    this._nav = this.nav;
  },
  onUnload() {
    this.clear()
  },
  onHide() {
    this.clear()
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
    clear() {
      this.cancelHit();
      this.studentText = "正在等待学员确认...";
      this.receptionText = "正在等待前台确认...";
      this.nowTime = ""
      clearInterval(this.timer);
      clearInterval(this.checkQRStatus);
    },
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
    toFace() {
      wx.showLoading({
        title: '加载中..'
      })
      wx.navigateTo({
        url: '../face/main?params=' + JSON.stringify(this.params),
        success() {
          wx.hideLoading()
        }
      })
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
            clearInterval(that.checkQRStatus);
            if (that.params.way == 2) {
              that.attendclassMethod();
            }
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
      this.globalData.normalCoachCourse.subscribe({
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
      this.globalData.normalCoachCourse.unsubscribe({
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
        this.attendSuccess();
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
            this.attendSuccess()
            // addclassport(frontSures.coachAppointOut.coachAppointId);
            // messageOnClass = false;
          }
        } else if (this.params.way == 3) {
          if (
            frontSures.coachAppointOut.coachAppointId == this.params.appointId
          ) {
            this.studentText = "学员已确认";
            // this.pushMsg();
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
        if (this.params.way == 4) {
          if (frontSures.coachSubscribeId == this.params.appointId) {
            this.receptionText = "前台已确认";
            this.attendSuccess();
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
    },
    // 上课
    attendclassMethod() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/attendclass",
        data: {
          coachAppointId: that.params.appointId,
          customerSignWay: 0,
          realTimeStart: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
        },
        success(res) {
          if (res.data.code == 200) {
            let msgData = res.data.data;
            for (let k in msgData) {
              msgData[k] = msgData[k] ? msgData[k] : "";
              if(k == "cardCustomerInfoArray") {
                delete msgData[k]
              }
            }
            HttpRequest({
              url: '/sendmsg/customer/consumemsg',
              data: msgData
            })
            that.attendSuccess();
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
    attendSuccess() {
      // wx.showModal({
      //   title: "提示",
      //   content: "上课成功",
      //   showCancel: false
      // });
      // setTimeout(() => {
      this.cancelHit();
      if(this.params.isOpenHandwrittenBoard) {
        wx.redirectTo({
          url: "/pages/pageBusiness/handwrite_board/main?id=" + this.params.appointId
        });
      } else {
        wx.redirectTo({
          url: `../../appointmentResult/main?coachAppointId=${
            this.params.appointId
          }&type=staff`
        });
      }
      // }, 500);
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
    .to-face {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 30px;
      height: 20px;
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
