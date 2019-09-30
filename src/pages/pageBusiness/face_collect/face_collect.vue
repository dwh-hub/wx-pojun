<template>
  <div class="face-collect">
    <!-- <button @click="takePhoto">拍照</button> -->
    <div class="camera-button">
      <image class="camera-icon" src="/static/images/staff/camera_1.svg" v-if="!isCamera && !uploadImgSrc"></image>
      <image class="upload-img" :src="uploadImgSrc" v-if="!isCamera && uploadImgSrc"></image>
      <camera class="camera" v-if="isCamera" :device-position="device?'back':'front'" flash="off"></camera>
      <!-- <div class="camera-text">拍照</div> -->
    </div>
    <image class="flip" src="/static/images/staff/camera.svg" @click="cameraFlip"></image>
    <div class="customer-name">{{customerName}}</div>
    <!-- <div class="switch">
      <switch :checked="isOpenFaceRule" style="zoom: 0.8;" @change="changeStandard" />
      <span>标准人脸检测</span>
    </div> -->
    <div class="bottom-wrapper">
      <div class="check_in-input-wrapper" v-if="hasKeyboard">
        <input type="text" v-model="checkInNum" class="check_in-input" placeholder="请输入手机号或卡号确认信息" disabled>
        <image class="search-icon" mode="aspectFit" src="/static/images/staff/search.svg"></image>
      </div> 
      <keyboard :isShow="hasKeyboard" :isFixed="false" :isAdaptive="isPhoneX" @onInputChange="keyboardInput" @onIputdelete="keyboardDelete" @onLongPressDelete="keyboardDeleteAll"></keyboard>
      <div class="bottom-operate-btn" :style="{'background-color': themeColor}">
        <div class="operate-item" @click="takePhoto">拍照上传</div>
        <div class="operate-item" @click="faceCollect">人脸采集</div>
        <div class="block" v-if="isPhoneX"></div>
      </div>
      <div class="keyboard-mask" v-if="isCamera"></div>
    </div>

    <canvas canvas-id='photo_canvas' :style="{width: '688rpx', height: canvas_h+'px'}" id='photo_canvas'></canvas>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
import store from "@/utils/store.js";
export default {
  data() {
    return {
      id: "",
      phone: "",
      isOpenFaceRule: 1,
      hasKeyboard: false, // 是否显示键盘
      checkInNum: "",
      customerName: "",
      device: false,
      isCamera: false,
      faceTimer: null,
      uploadImgSrc: '',
      crx: {},
      canvas_h: ''
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
    if(options.id) {
      this.hasKeyboard = false
      this.id = options.id;
      this.phone = options.phone;
    } else {
      this.hasKeyboard = true
    }
    console.log(this.hasKeyboard)
    this.crx = wx.createCameraContext();
  },
  mixins: [colorMixin],
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  mounted() {
    setNavTab();
  },
  onUnload() {
    this.resetData()
  },
  onHide() {
    // this.resetData()
  },
  methods: {
    resetData() {
      clearInterval(this.faceTimer);
      this.id = ''
      this.phone = ''
      this.type = ''
      this.isCamera = false
      this.device = false
      this.customerName = ''
      this.uploadImgSrc = ''
    },
    // 拍照上传
    takePhoto() {
      // if(!this.id) {
      //   return wx.showToast({
      //     title: '请先查询客户',
      //     icon: 'none'
      //   })
      // }
      let that = this;
      this.searchCustomer().then(() => {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'],
          success: function(photo) {
            // 返回选定照片的本地文件路径列表
            var tempFilePath = photo.tempFilePaths[0];
            console.log("本地图片的路径:", tempFilePath);

            wx.getImageInfo({
              src: tempFilePath,
              success: function (res) {
                var ctx = wx.createCanvasContext('photo_canvas');
                //设置canvas尺寸
                var towidth = 344;  //按宽度344px的比例压缩
                var toheight = Math.trunc(344 * res.height / res.width); //根据图片比例换算出图片高度
                that.canvas_h = toheight
                ctx.drawImage(tempFilePath, 0, 0, res.width, res.height, 0, 0, towidth, toheight)
                ctx.draw(false, function () {
                  // canvas绘制图片
                  wx.canvasToTempFilePath({
                    canvasId: 'photo_canvas',
                    fileType: "jpg",
                    success: function (canvasRes) {
                      // 获去图片base64
                      wx.getFileSystemManager().readFile({
                        filePath: canvasRes.tempFilePath,
                        encoding: "base64",
                        success(base64Res) {
                          that.isOpenFaceRule = 0
                          that.uploadImgSrc = canvasRes.tempFilePath
                          that.upload(base64Res.data, canvasRes.tempFilePath);
                        }
                      });
                    }
                  })
                })
              }
            })

            // wx.getFileSystemManager().readFile({
            //   filePath: tempFilePath,
            //   encoding: "base64",
            //   success(res) {
            //     // console.log(res);
            //     // if (that.isOpenFaceRule) {
            //     //   that.faceDetect(res.data, tempFilePath).then(() => {
            //     //     that.upload(res.data, tempFilePath);
            //     //   });
            //     // } else {
            //     //   that.upload(res.data, tempFilePath);
            //     // }
            //     that.isOpenFaceRule = 0
            //     that.upload(res.data, tempFilePath);
            //   }
            // });
          }
        });
      })
    },
    // 人脸采集
    faceCollect() {
      // if(!this.id) {
      //   return wx.showToast({
      //     title: '请先查询客户',
      //     icon: 'none'
      //   })
      // }
      this.searchCustomer().then(() => {
        console.log('faceCollect')
        this.isOpenFaceRule = 1
        this.isCamera = true
        setTimeout(() => {
          this.cutImg();
        }, 1500)
      })
    },
    cameraFlip() {
      if(!this.isCamera) {
        return
      }
      this.device = !this.device
    },
    // 百度人脸检测
    faceDetect(wxPathBase64, tempFilePath) {
      let that = this;
      // 百度人脸检测
      return new Promise(resolve => {
        HttpRequest({
          url: "/baidu/face/detect",
          method: "POST",
          data: {
            image: wxPathBase64,
            imageType: "BASE64",
            customerId: that.id,
            phone: that.phone
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success(res) {
            if (res.data.code != 200) {
              that.requestModel(res.data.message);
              setTimeout(() => {
                that.cutImg();
              }, 1000)
              return
            }
            resolve();
          }
        });
      });
    },
    // 上传人脸 wxPathBase64 base64文件 tempFilePath 图片本地路径
    upload(wxPathBase64, tempFilePath) {
      console.log("upload")
      wx.showLoading({
        title: '上传中...'
      });
      let that = this;
      // 通过人脸检测后上传图片
      wx.uploadFile({
        url: window.api + "/customer/archives/upload/take",
        filePath: tempFilePath,
        name: "headimg",
        header: {
          "Content-Type": "multipart/form-data",
          Cookie: wx.getStorageSync("Cookie")
        },
        success(img_info) {
          // 上传头像
          console.log(img_info);
          HttpRequest({
            url: "/customer/archives/saveheadimg",
            data: {
              customerId: that.id,
              headImgPath: JSON.parse(img_info.data).data,
              isOpenFaceRule: that.isOpenFaceRule
            },
            success(headImg_info) {
              if (headImg_info.data.code != 200) {
                return that.requestModel(headImg_info.data.message);
              }
              // 获取七牛token值
              HttpRequest({
                url: "/qiniu/getToken",
                data: {},
                success(info) {
                  // 上传图片至七牛
                  HttpRequest({
                    url: "/uface/person/uploadPhotoByBase64",
                    method: "POST",
                    data: {
                      imageType: "BASE64",
                      customerId: that.id,
                      phone: that.phone,
                      image: wxPathBase64,
                      isOpenFaceRule: that.isOpenFaceRule,
                      headImgId: headImg_info.data.data.headImgId,
                      headImgPath: wxPathBase64
                    },
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    success(success) {
                      wx.hideLoading();
                      if(success.data.code != 200) {
                        return wx.showToast({
                          title: success.data.message,
                          icon: 'none',
                          success(res) {
                            setTimeout(() => {
                              that.cutImg();
                            },1500)
                          }
                        });
                      }
                      clearInterval(that.faceTimer);
                      that.isCamera = false
                      wx.showModal({
                        title: "提示",
                        content: success.data.message,
                        showCancel: false,
                        success(res) {
                          if (res.confirm) {
                            wx.navigateBack({
                              delta: 1
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    },
    changeStandard(e) {
      this.isOpenFaceRule = e.mp.detail.value ? 1 : 0;
    },
    requestModel(message) {
      wx.hideLoading();
      if(this.isCamera) {
        wx.showToast({
          title: message,
          icon: 'none'
        })
        return
      }
      wx.showModal({
        title: "提示",
        content: message,
        showCancel: false
      });
    },
    searchCustomer() {
      let that = this
      return new Promise((resolve) => {
        if(!that.hasKeyboard) {
          return resolve()
        }
        wx.showLoading({
          title: '查询中...'
        })
        HttpRequest({
          url: '/customer/list/search',
          data: {
            namePhone: that.checkInNum
          },
          success(res) {
            let list = res.data.data.result
            wx.hideLoading()
            if(res.data.code != 200 || !list.length) {
              return wx.showModal({
                title: "提示",
                content: "未查询到信息",
                showCancel: false
              });
            }
            if(list.length != 1) {
              return wx.showToast({
                title: '请输入具体信息',
                icon: 'none'
              })
            }
            that.customerName = list[0].name
            that.id = list[0].id
            that.phone = list[0].phone
            resolve()
          }
        })
      })
    },
    // 视频流人脸采集
    cutImg(){
      let that = this;
      this.crx.takePhoto({
        success(res) {
          wx.getFileSystemManager().readFile({
            filePath: res.tempImagePath,
            encoding: "base64",
            success(file) {
              that.faceDetect(file.data, res.tempImagePath).then(() => {
                that.upload(file.data, res.tempImagePath);
              });
            }
          });
        }
      });
    },
    // 自定义键盘事件
    keyboardInput(e) {
      this.checkInNum += e.mp.detail
    },
    keyboardDelete() {
      this.checkInNum = this.checkInNum.substr(0, this.checkInNum.length-1);
    },
    keyboardDeleteAll() {
      this.checkInNum = ""
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
.face-collect {
  padding-top: 5vh;
  .flip {
    position: fixed;
    top: 10px;
    right: 20px;
    width: 30px;
    height: 20px;
    padding: 10px;
  }
  .camera-button {
    width: 50vw;
    height: 50vw;
    margin: 0 auto;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: #f4f4f4;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .camera-icon {
      width: 50%;
      height: 50%;
    }
    .upload-img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    >camera {
      width: 100%;
      height: 100%;
    }
    .camera-text {
      font-size: 36px;
      color: #a6a6a6;
    }
    &:active {
      opacity: 0.8;
    }
  }
  .switch {
    margin-top: 25px;
    text-align: center;
    >span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
  .customer-name {
    text-align: center;
    margin-top: 5px;
    font-size: 16px;
    letter-spacing: 2px;
    font-weight: bold;
    color: #333;
  }
  .block { // 底部白块
    height: 34px;
    width: 100%;
    background-color: #fff;
  }
  .bottom-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .check_in-input-wrapper {
      position: relative;
      .check_in-input {
        padding: 0 20px;
        font-size: 16px;
        box-sizing: border-box;
        height: 42px;
        text-align: center;
        background-color: #e7e7e7;
      }
      .search-icon {
        position: absolute;
        top: 12px;
        right: 10px;
        width: 22px;
        height: 22px;
      }
    }
    .bottom-operate-btn {
      position: static;
      .operate-item {
        line-height: 42px;
      }
    }
    .keyboard-mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      background-color: rgba(255,255,255,0.6);
    }
  }
  #photo_canvas {
    position: absolute;
    left: -1000px;
    top: -1000px;
  }
}
</style>