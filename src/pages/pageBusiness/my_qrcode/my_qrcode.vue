<template>
  <div class="my-qrcode" :style="{'background-color':themeColor}">
    <div class="store-name">{{storeName}}</div>
    <!-- <div class="qr-code-wrapper">
      <div class="qr-header">
        <div class="avatar">
          <open-data type="userAvatarUrl"></open-data>
        </div>
        <div class="name">{{userInfo.userName}}</div>
        <div class="phone">{{userInfo.phone}}</div>
      </div>
      <p class="qr-code-top-tip">邀请客户加入福利多多</p>
      <img class="qr-code" :src="QRSrc" />
      <p class="qr-code-bottom-tip">微信扫一扫二维码加入</p>
    </div>-->
    <canvas id="myCanvas" canvas-id="myCanvas"></canvas>
    <div class="share-wrapper">
      <div class="share-text">
        <span :style="{'background-color':themeColor}">分享邀请</span>
      </div>
      <div class="share-group">
        <button open-type="share" class="share-item clear-button">
          <div class="share-icon">
            <img class src="/static/images/wx-icon.png" alt />
          </div>
          <div class="share">微信邀请</div>
        </button>
        <!-- <button class="share-item clear-button">
          <div class="share-icon">
            <img class src="/static/images/wx-share-icon.png" alt />
          </div>
          <div class="share">朋友圈分享</div>
        </button> -->
        <button class="share-item clear-button" @click="canvasToImage">
          <div class="share-icon">
            <img class src="/static/images/wx-share-icon.png" alt />
          </div>
          <div class="share">下载海报</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      storeId: "",
      storeName: "",
      userInfo: "",
      QRSrc: "https://test.lirenos.com/images/minicode/55/minicode.png",
      headerImg: "",
      canvasHidden: true,
      windowWidth: "",
      scale: "",
      shareInfo: {
        headerImg: "",
        qrcode: ""
      }
    };
  },
  mixins: [colorMixin],
  onLoad(options) {
    this.storeId = options.storeId;
    this.storeName = options.storeName;
    this.userInfo = wx.getStorageSync("staff_info");
    setNavTab();
    this.windowWidth = wx.getSystemInfoSync().windowWidth;
    // this.cacheImg();
    this.getQRCode().then(() => {
      this.cacheImg();
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  methods: {
    getQRCode() {
      let that = this;
      wx.showLoading({
        title: "二维码生成中..."
      });
      return new Promise(resolve => {
        HttpRequest({
          url: window.api + "/mini/getCodeUnlimit",
          data: {
            scene: `${wx.getStorageSync("companyId")}-${that.storeId}-${
              that.userInfo.userId
            }`
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.QRSrc = window.api + res.data.data;
              resolve();
            } else {
              wx.showModal({
                title: "提示",
                content: res.data.message,
                showCancel: false
              });
            }
          }
        });
      });
    },
    // 把线上图片资源转为本地路径
    cacheImg() {
      let that = this;
      //缓存canvas绘制小程序二维码
      wx.downloadFile({
        url: that.QRSrc,
        success: function(res) {
          //缓存二维码
          that.shareInfo.qrcode = res.tempFilePath;
          wx.downloadFile({
            url: that.headerImg || window.api + '/assets/img/morenTo.png',
            success: function(res1) {
              that.shareInfo.headerImg = res1.tempFilePath;
              that.canvasDraw();
            }
          });
        }
      });
    },
    canvasDraw() {
      const ctx = wx.createCanvasContext("myCanvas");
      var that = this;
      let windowWidth = this.windowWidth;
      let headWH = 30; // 头像直径
      let center = 0.7 * windowWidth / 2; // 画布中心

      let radius = 10; // 圆角的半径
      let radiusW = 0.7 * windowWidth; // 圆角矩形选区的宽度
      let radiusH = windowWidth; // 圆角矩形选区的左上角 y坐标
      let radiusX = 0; // 圆角矩形选区的左上角 x坐标
      let radiusY = 0; // 圆角矩形选区的左上角 y坐标

      // ctx.setFillStyle("#fff");
      ctx.beginPath();
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      // 这里是使用 fill 还是 stroke都可以，二选一即可
      ctx.setFillStyle("#fff");
      // ctx.setStrokeStyle('transparent')
      // 左上角
      ctx.arc(
        radiusX + radius,
        radiusY + radius,
        radius,
        Math.PI,
        Math.PI * 1.5
      );

      // border-top
      ctx.moveTo(radiusX + radius, radiusY);
      ctx.lineTo(radiusX + radiusW - radius, radiusY);
      ctx.lineTo(radiusX + radiusW, radiusY + radius);
      // 右上角
      ctx.arc(
        radiusX + radiusW - radius,
        radiusY + radius,
        radius,
        Math.PI * 1.5,
        Math.PI * 2
      );

      // border-right
      ctx.lineTo(radiusX + radiusW, radiusY + radiusH - radius);
      ctx.lineTo(radiusX + radiusW - radius, radiusY + radiusH);
      // 右下角
      ctx.arc(
        radiusX + radiusW - radius,
        radiusY + radiusH - radius,
        radius,
        0,
        Math.PI * 0.5
      );

      // border-bottom
      ctx.lineTo(radiusX + radius, radiusY + radiusH);
      ctx.lineTo(radiusX, radiusY + radiusH - radius);
      // 左下角
      ctx.arc(
        radiusX + radius,
        radiusY + radiusH - radius,
        radius,
        Math.PI * 0.5,
        Math.PI
      );

      // border-left
      ctx.lineTo(radiusX, radiusY + radius);
      ctx.lineTo(radiusX + radius, radiusY);

      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      ctx.fill();
      // ctx.stroke()
      ctx.closePath();
      // 剪切
      ctx.clip();

      // ctx.setFillStyle("#fff");
      // ctx.fillRect(0, 0, windowWidth * 0.8, windowWidth); // 画布大小
      ctx.fillRect(0, 0, headWH, headWH); // 头像矩形框

      let avatarurl_x = 0.7 * windowWidth / 2 - headWH / 2; // 头像在画布上的X轴位置
      let avatarurl_y = 15; // 头像在画布上的Y轴位置
      let name_y = avatarurl_y + headWH + 12 + 5; // name Y轴位置 行高：12
      let phone_y = name_y + 12 + 5;
      let shabisi_y = phone_y + 16 + 10;
      ctx.save();
      ctx.beginPath(); // 开始绘制头像
      //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      ctx.arc(
        headWH / 2 + avatarurl_x,
        headWH / 2 + avatarurl_y,
        headWH / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.clip(); //画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
      ctx.drawImage(
        this.shareInfo.headerImg,
        avatarurl_x,
        avatarurl_y,
        headWH,
        headWH
      ); // 推进去图片，必须是https图片
      ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
      // 绘制姓名
      ctx.setFillStyle("#505050");
      ctx.setFontSize(12);
      ctx.setTextAlign("center");
      ctx.fillText(this.userInfo.userName, center, name_y);
      // 绘制手机号
      ctx.setFillStyle("#505050");
      ctx.setFontSize(12);
      ctx.setTextAlign("center");
      ctx.fillText(this.userInfo.phone, center, phone_y);
      // 绘制邀请广告语
      ctx.setFillStyle("#ff8d1a");
      ctx.setFontSize(16);
      ctx.setTextAlign("center");
      ctx.fillText("邀请客户加入福利多多", center, shabisi_y);
      // 绘制二维码图片
      let qrWH = 180;
      let qr_x = center - qrWH / 2;
      let qr_y = shabisi_y + 20;
      ctx.drawImage(this.shareInfo.qrcode, qr_x, qr_y, qrWH, qrWH);
      // 绘制底部tips
      let tip_y = qr_y + qrWH + 12 + 15;
      ctx.setFillStyle("#a6a6a6");
      ctx.setFontSize(12);
      ctx.setTextAlign("center");
      ctx.fillText("微信扫一扫二维码加入", center, tip_y);
      ctx.draw();
    },
    canvasToImage() {
      var that = this;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: "myCanvas",
        success: function(res) {
          console.log("朋友圈分享图生成成功");
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log("朋友圈分享图保存成功")
            }
          })
          // wx.previewImage({
          //   current: res.tempFilePath, // 当前显示图片的http链接
          //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
          // });
        },
        fail: function(err) {
          console.log("失败");
          console.log(err);
        }
      });
    }
  }
};
</script>

<style lang="less">
.my-qrcode {
  height: 100vh;
  .store-name {
    color: #fff;
    text-align: center;
    padding: 10px 0;
  }
  #myCanvas {
    width: 70vw;
    height: 100vw;
    margin: 0 auto;
    box-shadow: 0px 30px 30px 0px rgba(0, 0, 0, 0.5);
  }
  // .qr-code-wrapper {
  //   width: 70vw;
  //   margin: 0 auto;
  //   text-align: center;
  //   background-color: #fff;
  //   border-radius: 10px;
  //   box-shadow: 0px 30px 30px 0px rgba(0, 0, 0, 0.5);
  //   overflow: hidden;
  //   .qr-header {
  //     .avatar {
  //       width: 30px;
  //       height: 30px;
  //       border-radius: 50%;
  //       margin: 0 auto;
  //       margin-top: 10px;
  //       overflow: hidden;
  //     }
  //     .name {
  //       font-size: 12px;
  //       color: #333;
  //       margin-top: 5px;
  //     }
  //     .phone {
  //       font-size: 12px;
  //       margin: 5px 0;
  //     }
  //   }
  //   .qr-code-top-tip {
  //     font-size: 16px;
  //     color: #ff8d1a;
  //     margin-bottom: 10px;
  //   }
  //   .qr-code {
  //     width: 180px;
  //     height: 180px;
  //     margin: 0 auto;
  //     background-color: rgba(255, 54, 8, 0.6);
  //   }
  //   .qr-code-bottom-tip {
  //     margin: 15px 0;
  //     font-size: 12px;
  //     color: #a6a6a6;
  //   }
  // }
  .share-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 70vw;
    margin-left: 15vw;
    .share-text {
      height: 1px;
      border-top: 1px solid #fff;
      text-align: center;
      > span {
        position: relative;
        padding: 0 5px;
        top: -12px;
        color: #fff;
      }
    }
    .share-group {
      display: flex;
      width: 100%;
      justify-content: space-around;
      margin-top: 25px;
      margin-bottom: 20px;
      .share-item {
        flex: 1;
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        .share-icon {
          width: 26px;
          height: 26px;
          margin: 0 auto;
          border-radius: 2px;
          background-color: #fff;
          > img {
            width: 15px;
            height: 15px;
            margin-bottom: 8px;
          }
        }
        .share {
          font-size: 10px;
          color: #fff;
        }
      }
    }
  }
  .clear-button {
    &::after {
      border: none;
    }
    background-color: rgba(0, 0, 0, 0);
    border-radius: 0;
  }
}
</style>