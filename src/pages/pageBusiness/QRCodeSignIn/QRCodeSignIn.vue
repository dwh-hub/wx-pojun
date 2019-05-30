<template>
  <div class="qrcode-sign">
    <div class="class-info">教练正在准备为学员上课</div>
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
// import goEasy from "@/libs/goeasy.js";
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
      nowTime: "",
      qrcodeURL: "",
      studentText: "正在等待学员确认...",
      receptionText: "正在等待前台确认...",
      timer: null
    };
  },
  onLoad(options) {
    if (options.params) {
      this.params = JSON.parse(options.params);
      console.log(this.params);
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
    }, 1000);
  },
  onUnload() {
    clearInterval(this.timer);
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
      this.nowTime = formatDate(new Date(), "hh:mm:ss");
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
          }
        }
      });
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
