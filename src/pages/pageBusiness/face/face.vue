<template>
  <div class="face">
    <camera class="camera" :device-position="device?'back':'front'" flash="off">
      <cover-view class="img-wrapper" @click="flipCamera" :style="{'background-color':color}">
        镜头翻转
        <!-- <cover-image
          class="camera-flip"
          src="/static/images/staff/uFace.png"
        ></cover-image>-->
      </cover-view>
      <cover-view class="tip" v-if="showTip">人脸识别中...</cover-view>
      <cover-view class="center-tip tip" v-if="showCenterTip">{{centerTips}}</cover-view>
      <cover-image class="face-outline" src="/static/images/staff/uFace.png"></cover-image>
    </camera>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import { attendclass } from "../common/js/http.js";
import Toast from "../../../../static/vant/toast/toast";
import { EventBus } from "../common/js/eventBus.js";

// const toast = Toast.loading({
//   duration: 0, // 持续展示 toast
//   forbidClick: true, // 禁用背景点击
//   message: "倒计时 3 秒",
//   loadingType: "spinner",
//   selector: "#van-toast"
// });

export default {
  data() {
    return {
      type: "",
      storeId: "",
      venue: "",
      params: {},
      device: false, // 默认前置摄像头
      // camera: true,
      crx: {},
      tempImagePath: "",
      faceTimer: null,
      flag: true,
      showTip: true,
      color: window.color,
      timer: 500,
      showCenterTip: false,
      centerTips: ""
    };
  },
  onShow() {
    wx.getSetting({
      success(res) {
        if (
          !res.authSetting["scope.camera"] &&
          JSON.stringify(res.authSetting).indexOf("camera") > -1
        ) {
          wx.showModal({
            title: "授权",
            content: "是否授权摄像头使用？",
            success(res) {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },
  onLoad(options) {
    if (options.type && options.type == "checkIn") {
      this.type = options.type;
      this.storeId = options.storeId;
      this.venueId = options.venueId;
      this.timer = 1000;
    } else {
      this.params = JSON.parse(options.params);
      this.timer = 500;
    }
    setNavTab();
    this.crx = wx.createCameraContext();
    this.flag = true;
    this.faceTimer = setInterval(() => {
      if (this.flag) {
        this.takePhoto();
      }
    }, this.timer);
  },
  onUnload() {
    clearInterval(this.faceTimer);
    this.flag = true;
    this.type = ""
  },
  onHide() {
    clearInterval(this.faceTimer);
    this.flag = true;
    this.type = ""
  },
  methods: {
    load(e) {
      console.log("load");
      console.log(e);
    },
    error(e) {
      console.log("error");
      console.log(e);
    },
    flipCamera() {
      this.device = !this.device;
    },
    // start(e) {
    //   this.camera = !this.camera;
    // },
    takePhoto() {
      let that = this;
      this.crx.takePhoto({
        success(res) {
          that.tempImagePath = res.tempImagePath;
          wx.getFileSystemManager().readFile({
            filePath: res.tempImagePath,
            encoding: "base64",
            success(res) {
              that.baiduFaceDetect(res.data);
            }
          });
        }
      });
    },
    baiduFaceDetect(wxPathBase64) {
      let that = this;
      this.flag = false;
      HttpRequest({
        url: "/baidu/face/detect", // 判断是否是人脸
        method: "POST",
        data: {
          image: wxPathBase64,
          imageType: "BASE64"
        },
        header: {
          "content-type": "application/x-www-form-urlencoded" // 默认值
        },
        success(res) {
          console.log("=========baiduFaceDetect=======success==");
          if (res.data.code == 200) {
            if (that.type == "checkIn") {
              that.faceCheckIn(wxPathBase64);
            } else {
              that.searchFace(wxPathBase64);
            }
          } else {
            console.log(res.data.message);
            that.flag = true;
            if (that.type == "checkIn") {
              return;
            }
            Toast({
              mask: false,
              message: res.data.message
            });
          }
        }
      });
    },
    // 人脸搜索+消费
    searchFace(wxPathBase64) {
      let that = this;
      HttpRequest({
        url: "/baidu/face/match",
        method: "POST",
        data: {
          image: wxPathBase64,
          imageType: "BASE64",
          customerId: that.params.studentId
          // storeId: that.params.storeId,
          // venueId: that.params.venueId,
        },
        header: {
          "content-type": "application/x-www-form-urlencoded" // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            clearInterval(that.faceTimer);
            if (
              that.params.way == 5 ||
              that.params.way == 2 ||
              that.params.way == 9
            ) {
              wx.showLoading({
                title: "上课中..."
              });
              attendclass(that.params.appointId, 1)
                .then(res => {
                  wx.redirectTo({
                    url: `../../appointmentResult/main?coachAppointId=${
                      that.params.appointId
                    }&type=staff`
                  });
                })
                .catch(res => {
                  wx.hideLoading();
                });
            }
            if (that.params.way == 3) {
              that.pushThreeMsg();
              EventBus.$emit("confirmed");
              wx.navigateBack({
                delta: 1
              });
            }
          } else {
            // Toast({
            //   mask: false,
            //   message: res.data.message
            // });
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 500
            });
            setTimeout(() => {
              that.flag = true;
            }, 500);
            // if (res.data.message == "人脸模糊") {
            //   Toast({
            //     mask: false,
            //     message: res.data.message
            //   });
            //   that.flag = true;
            // } else {
            // if (res.data.message.indexOf("匹配指数过低") > -1) {
            //   return that.flag = true;
            // }
            // wx.showModal({
            //   title: "提示",
            //   content: res.data.message,
            //   showCancel: false,
            //   success(res) {
            //     that.flag = true;
            //   }
            // });
            // }
          }
        },
        fail() {
          that.flag = true;
          // clearInterval(that.faceTimer)
        }
      });
    },
    // 人脸识别 入场签到
    faceCheckIn(wxPathBase64) {
      let that = this;
      HttpRequest({
        url: "/baidu/face/search",
        method: "POST",
        data: {
          imageType: "BASE64",
          image: wxPathBase64,
          storeId: that.storeId,
          venueId: that.venueId
        },
        header: {
          "content-type": "application/x-www-form-urlencoded" // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              that.flag = true;
            }, 1000);
          } else if (res.data.code == 401) {
            let second = 3;
            that.showCenterTip = true
            // let toast = Toast.loading({
            //   duration: 0, // 持续展示 toast
            //   forbidClick: true, // 禁用背景点击
            //   message: `${res.data.message}\n${second} 秒后重新识别`,
            //   loadingType: "spinner",
            //   selector: "#van-toast"
            // });
            const timer = setInterval(() => {
              if (second) {
                that.centerTips = `${res.data.message}\n${second} 秒后重新识别`
                second--;
                // toast.setData({
                //   message: `${res.data.message}\n${second} 秒后重新识别`
                // });
              } else {
                that.showCenterTip = false
                that.flag = true;
                clearInterval(timer);
                // Toast.clear();
              }
            }, 1000);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 500
            });
            setTimeout(() => {
              that.flag = true;
            }, 500);
          }
        }
      });
    },
    // 教练+前台发消息
    pushMsg() {
      let that = this;
      HttpRequest({
        url: "/mobile/coach/attendclass/verify/coachAndFront",
        data: {
          coachId: that.params.coachId,
          coachAppointId: that.params.appointId
        }
      });
    },
    // 三方签到发消息
    pushThreeMsg() {
      let that = this;
      HttpRequest({
        url: "/mobile/coach/attendclass/verify/coachAndCustomerAndFront",
        data: {
          coachAppointId: that.params.appointId,
          customerSignWay: 1
        }
      });
    }
  }
};
</script>

<style lang="less">
.camera {
  width: 100%;
  height: 100vh;
  // position: relative;
  .img-wrapper {
    position: fixed;
    padding: 5px 10px;
    top: 15px;
    right: 15px;
    color: #fff;
    border-radius: 4px;
    // width: 30px;
    // height: 20px;
  }
  .tip {
    position: absolute;
    left: 50%;
    bottom: 8%;
    transform: translateX(-50%);
    line-height: 32px;
    padding: 0 15px;
    border-radius: 5px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .center-tip {
    bottom: 50%;
  }
  .face-outline {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 90vw;
    height: 90vw;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
