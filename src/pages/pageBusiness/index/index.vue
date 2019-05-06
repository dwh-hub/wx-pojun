<template>
  <div class="index">
    <!-- <camera
      device-position="front"
      flash="off"
      binderror="error"
      style="width: 100%; height: 300px;"
    ></camera>
    <div class="btn-area">
      <button type="primary" @click="takePhoto">拍照</button>
    </div>
    <div class="btn-area">
      <button type="primary" @click="startRecord">开始录像</button>
    </div>
    <div class="btn-area">
      <button type="primary" @click="stopRecord">结束录像</button>
    </div>
    <div class="preview-tips">预览</div>
    <image mode="widthFix" :src="src"></image>
    <video v-if="videoSrc" class="video" :src="videoSrc"></video> -->
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
export default {
  data() {
    return {
      src: '',
      videoSrc: '',
      ctx: null
    };
  },
  mounted() {
    setNavTab();
      // this.ctx = wx.createCameraContext();
  },
  methods: {
    // takePhoto() {
    //   this.ctx.takePhoto({
    //     quality: "high",
    //     success: res => {
    //       this.src =  res.tempImagePath
    //     }
    //   });
    // },
    // startRecord() {
    //   this.ctx.startRecord({
    //     success: (res) => {
    //       console.log('startRecord')
    //     }
    //   })
    // },
    // stopRecord() {
    //   this.ctx.stopRecord({
    //     success: (res) => {
    //       this.src = res.tempThumbPath
    //       this.videoSrc = res.tempVideoPath
    //     }
    //   })
    // },
    // error(e) {
    //   console.log(e.detail);
    // }
  }
};
</script>

<style lang="less">
page {
  background-color: #F8F8F8;
  height: 100%;
  font-size: 32rpx;
  line-height: 1.6;
}

.btn-area {
  margin-top: 60rpx;
  box-sizing: border-box;
  width: 100%;
  padding: 0 30rpx;
}

.preview-tips {
  margin: 20rpx 0;  
  text-align: center;
}

.video {
  margin: 50px auto;
  width: 100%;
  height: 300px;
}
</style>
