<template>
  <div class="face">
    <!-- <button @click="start" type="primary">{{camera? '结束':'开始'}}</button> -->
    <camera class="camera" :device-position="device?'back':'front'" v-if="camera" flash="off">
      <cover-image class="camera-flip" src="/static/images/staff/camera.svg" @click="flipCamera"></cover-image>
    </camera>
    <!-- <button @click="takePhoto" v-if="camera" type="primary">拍照</button> -->
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
import Toast from '../../../../static/vant/toast/toast';
export default {
  data() {
    return {
      params: {},
      device: false, // 默认前置摄像头
      camera: true,
      crx: {},
      tempImagePath: "",
      faceTimer: null,
      flag: true
    };
  },
  onLoad(options) {
    this.params = JSON.parse(options.params)
    setNavTab();
    this.crx = wx.createCameraContext();
    this.faceTimer = setInterval(() => {
      if(this.flag) {
        this.takePhoto()
      }
    }, 1000)
  },
  onUnload() {
    clearInterval(this.faceTimer)
    this.flag = true
  },
  onHide() {
    clearInterval(this.faceTimer)
    this.flag = true
  },
  methods: {
    flipCamera() {
      this.device = !this.device
    },
    start(e) {
      this.camera = !this.camera;
    },
    takePhoto() {
      let that = this;
      this.crx.takePhoto({
        success(res) {
          that.tempImagePath = res.tempImagePath;
          wx.getFileSystemManager().readFile({
            filePath: res.tempImagePath,
            encoding: 'base64',
            success(res) {
              that.baiduFaceDetect(res.data)
            }
          })
        }
      });
    },
    baiduFaceDetect(wxPathBase64) {
      let that = this;
      this.flag = false
      HttpRequest({
        url: '/baidu/face/detect', // 判断是否是人脸
        method: 'POST',
        data: {
          image: wxPathBase64,
          imageType: 'BASE64'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          if(res.data.code == 200) {
            that.searchFace(wxPathBase64)
          } else {
            that.flag = true
            Toast({
              mask: false,
              message: res.data.message
            });
          }
        }
      })
    },
    // 人脸搜索+消费
    searchFace(wxPathBase64) {
      let that = this;
      HttpRequest({
        url: '/baidu/face/match',
        method: 'POST',
        data: {
          image: wxPathBase64,
          imageType: 'BASE64',
          customerId: that.params.studentId
          // storeId: that.params.storeId,
          // venueId: that.params.venueId,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          if(res.data.code == 200) {
            clearInterval(that.faceTimer)
            wx.showLoading({
              title: '上课中...'
            })
            attendclass(that.params.appointId).then((res) => {
              wx.redirectTo({
                url: `../../appointmentResult/main?coachAppointId=${
                  that.params.appointId
                }&type=staff`
              });
            })
          } else {
            if (res.data.message == '人脸模糊') {
              that.flag = true
              Toast({
                mask: false,
                message: res.data.message
              });
            } else {
              clearInterval(that.faceTimer)
              wx.showModal({
                title: "提示",
                content: res.data.message,
                showCancel: false,
                success(res) {
                  that.flag = true
                }
              });
            }
          }
        },
        fail() {
          clearInterval(that.faceTimer)
        }
      })
    }
  }
};
</script>

<style lang="less">
.camera {
  width: 100%;
  height: 100vh;
  position: relative;
  .camera-flip {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 30px;
    height: 20px;
  }
}
</style>
