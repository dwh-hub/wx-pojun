<template>
  <div class="handwrite-board">
    <canvas
      class="sign"
      canvas-id="sign"
      @touchmove="move"
      @touchstart="start"
      @touchend="end"
      @touchcancel="cancel"
      @longtap="tap"
      disable-scroll="true"
      binderror="error"
    ></canvas>
    <div class="handBtn">
      <div @click="skip">跳过</div>
      <div @click="clear" class="delBtn">重写</div>
      <div @click="upload" class="subBtn" :style="{'background-color':window.color}">完成</div>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
export default {
  data() {
    return {
      id: "",
      content: null,
      touchs: [],
      imgList: [],
      signImage: ""
    };
  },
  onLoad(options) {
    this.id = options.id;
    setNavTab();
    this.content = null;
    this.touchs = [];
    //获得Canvas的上下文
    this.content = wx.createCanvasContext("sign");
    //设置线的颜色
    this.content.setStrokeStyle("#000");
    //设置线的宽度
    this.content.setLineWidth(3);
    //设置线两端端点样式更加圆润
    this.content.setLineCap("round");
    //设置两条线连接处更加圆润
    this.content.setLineJoin("round");
  },
  computed: {
    window() {
      return window;
    }
  },
  methods: {
    // 画布的触摸移动开始手势响应
    start: function(event) {
      //获取触摸开始的 x,y
      let point = {
        x: event.mp.changedTouches[0].x,
        y: event.mp.changedTouches[0].y
      };
      this.touchs.push(point);
    },
    // 画布的触摸移动手势响应
    move: function(e) {
      let point = { x: e.touches[0].x, y: e.touches[0].y };
      this.touchs.push(point);
      if (this.touchs.length >= 2) {
        this.draw(this.touchs);
      }
    },
    // 画布的触摸移动结束手势响应
    end: function(e) {
      // console.log("触摸结束" + e);
      //清空轨迹数组
      for (let i = 0; i < this.touchs.length; i++) {
        this.touchs.pop();
      }
    },
    // 画布的触摸取消响应
    cancel: function(e) {
      // console.log("触摸取消" + e);
    },
    // 画布的长按手势响应
    tap: function(e) {
      // console.log("长按手势" + e);
    },
    error: function(e) {
      // console.log("画布触摸错误" + e);
    },
    //绘制
    draw: function() {
      let point1 = this.touchs[0];
      let point2 = this.touchs[1];
      this.touchs.shift();
      this.content.moveTo(point1.x, point1.y);
      this.content.lineTo(point2.x, point2.y);
      this.content.stroke();
      this.content.draw(true);
    },
    skip() {
      let that = this
      wx.redirectTo({
        url: `../../appointmentResult/main?coachAppointId=${that.id}&type=staff`
      });
    },
    //清除操作
    clear: function() {
      //清除画布
      this.content.clearRect(0, 0, 750, 700);
      this.content.draw(true);
    },
    //保存图片
    saveClick: function() {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: "sign",
        success: function(res) {
          //打印图片路径
          console.log(res.tempFilePath);
          //设置保存的图片
          that.signImage = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 1000
              });
            }
          });
        }
      });
    },
    // 上传
    upload() {
      var that = this;
      wx.showModal({
        title: "提示",
        content: "确认上传该签名？",
        success(model_res) {
          if (model_res.confirm) {
            wx.showLoading({
              title: "上传中..."
            });
            wx.canvasToTempFilePath({
              canvasId: "sign",
              success: function(res) {
                that.signImage = res.tempFilePath;

                // HttpRequest({
                //   url: "/coach/private/upload/handwrittenBoard",
                //   data: {
                //     handwrittenImg: res.tempFilePath,
                //     coachAppointId: that.id
                //   },
                //   success(res) {
                //     console.log(res)
                //   }
                // })
                wx.uploadFile({
                  url: window.api + "/coach/private/upload/handwrittenBoard",
                  filePath: res.tempFilePath,
                  name: "handwrittenImg",
                  header: {
                    "Content-Type": "multipart/form-data",
                    Cookie: wx.getStorageSync("Cookie")
                  },
                  formData: {
                    coachAppointId: that.id
                  },
                  success() {
                    wx.hideLoading();
                    wx.showToast({
                      title: "上传签名成功",
                      icon: "success",
                      duration: 1000
                    });
                    setTimeout(() => {
                      wx.redirectTo({
                        url: `../../appointmentResult/main?coachAppointId=${that.id}&type=staff`
                      });
                    }, 1000);
                  }
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.handwrite-board {
  display: flex;
  height: 100vh;
  flex-direction: column;
  .sign {
    flex: 1;
    width: 100vw;
    border: 1px dashed #ccc;
    box-sizing: border-box;
  }
  .handBtn {
    flex: 0 0 50px;
    display: flex;
    > div {
      flex: 1;
      font-size: 16px;
      line-height: 50px;
      text-align: center;
    }
    .delBtn {
      border-left: 1rpx solid #eee;
    }
    .subBtn {
      color: #fff;
    }
  }
}
</style>
