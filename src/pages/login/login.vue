<template>
  <div class="memberComes">
    <div class="title_img">
      <img
        class="company_imgs"
        alt
        src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png"
      >
    </div>
    <div class="hello">
      <span>第一次使用，请绑定您的会籍信息</span>
    </div>
    <div class="boundDiv">
      <span class="phone">手机号</span>
      <input class="phone-input" type="text" v-model="phone" maxlength="11" placeholder="请输入手机号">
      <div class="code sendcode" v-show="isSend">{{"重新发送("+CDTime+"s)" }}</div>
      <div class="code" @click="getVCode" v-show="!isSend">获取验证码</div>
    </div>
    <div class="boundDiv">
      <input class type="text" v-model="vCode" placeholder="请输入验证码">
    </div>
    <span class="showTooltips" @click="login">登录</span>
    <div class="toHome" @click="toHome">暂不登录</div>
    <van-popup
      :show="showBindBox"
      @close="showBindBox = false"
      :duration="200"
      custom-style="width:85%;border-radius: 5px;"
    >
      <div class="companyList">
        <p>请选择你要绑定的公司</p>
        <div class="companyMain">
          <span
            v-for="(item, index) in companyList"
            :key="index"
            :class="{active:　item.companyId == curCompany.companyId}"
            @click="selectCompany(item)"
          >{{item.companyName}}</span>
        </div>
        <span class="showTooltips" @click="bind(index)">绑定</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { setNavTab, checkPhoneFormat, window,getThemeColor } from "COMMON/js/common.js";
import store from "../../utils/store";

export default {
  data() {
    return {
      isSend: false,
      phone: "18259260870", // 15159125113
      // 验证码
      vCode: "",
      // smsSendLogId: 15679,
      userInfo: {},
      CDTime: 0,
      showBindBox: false,
      companyList: [],
      // 选择的公司
      curCompany: {}
    };
  },
  onLoad() {
    setNavTab();
  },
  methods: {
    toHome() {
      wx.switchTab({
        url: "../homepage/main"
      });
    },
    // 获取验证码
    getVCode() {
      let that = this;
      // 手机验证
      checkPhoneFormat(this.phone)
        .then(() => {
          // 开始倒计时
          this.codeCountdown();
          // 校验验证码or拿短信id
          wx.request({
            url: window.api + "/sms/sendcode/nocompany",
            data: {
              phone: that.phone
            },
            success(res) {
              console.log(res);
              that.smsSendLogId = res.data.data;
            }
          });
        })
        .catch(() => {
          wx.showToast({
            title: "手机号格式不正确",
            icon: "none",
            duration: 1000
          });
        });
    },
    // 倒计时
    codeCountdown: function() {
      this.CDTime = 60;
      this.isSend = true;
      let that = this;
      var interval = setInterval(function() {
        that.CDTime--;
        if (that.CDTime < 1) {
          that.isSend = false;
          clearInterval(interval);
        }
      }, 1000);
    },
    // 选择公司
    selectCompany(item) {
      this.curCompany = item;
    },
    // 绑定公司
    bind() {
      this.showBindBox = false;
      this.userInfo = this.curCompany;
      store.commit("saveUserInfo", this.curCompany);
      wx.setStorage({
        key: "userInfo",
        data: this.curCompany
      });
      wx.setStorage({
        key: "companyId",
        data: this.curCompany.companyId
      });
      this.bindMethod();
    },
    // 登录
    login() {
      // wx.request({
      //   url: window.api + "/sms/authCode/nocompany",
      //   data: {
      //     phone: that.phone,
      //     code: that.vCode
      //   },
      //   success(data) {
      // wx.login({
      //   success(res) {
      //     if(res.code) {
      //       wx.request({
      //         url: '',
      //         data: {
      //           code: res.code
      //         },
      //         success(res) {
      //          wx.setStorage({
      //            key: 'openid',
      //            data: 'res.data.data.openid'
      //          })
      //          wx.setStorage({
      //            key: 'sessionKey',
      //            data: 'res.data.data.sessionKey'
      //          })
      //         }
      //       })
      //     } else {
      //       console.log('登录失败!' + res.errMsg)
      //     }
      //   }
      // })
      this.getUserInfo().then(() => {
        this.bindMethod();
      });

      // }
      // });
    },
    bindMethod() {
      let that = this;
      // 绑定
      wx.request({
        url: window.api + "/wxcustomer/bindCard",
        data: {
          phone: that.phone,
          companyId: that.userInfo.companyId,
          miniOpenId: wx.getStorageSync("openId")
          // smsSendLogId: that.smsSendLogId
        },
        success(res) {
          wx.setStorage({
            key: "Cookie",
            data: res.header["Set-Cookie"]
          });
          if (res.data.code === 200) {
            wx.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1000
            });
            store.commit("changeLogin", true);
            getThemeColor()
            setTimeout(() => {
              wx.reLaunch({
                url: "../mine/main"
              });
            }, 1000);
          } else {
            return wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    // 获取用户信息
    getUserInfo() {
      wx.showLoading({
        title: "正在登录..."
      });
      let that = this;
      return new Promise(function(resolve) {
        wx.request({
          url: window.api + "/wxcustomer/findAllCustomer",
          data: {
            phone: that.phone
            // companyId: wx.getStorageSync("companyId")
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              if (!res.data.data.length) {
                return wx.showModal({
                  title: "提示",
                  content: "没有找到您的登记信息",
                  showCancel: false
                });
              }
              if (res.data.data.length == 1) {
                that.userInfo = res.data.data[0];
                store.commit("saveUserInfo", res.data.data[0]);
                wx.setStorage({
                  key: "userInfo",
                  data: res.data.data[0]
                });
                wx.setStorage({
                  key: "companyId",
                  data: res.data.data[0].companyId
                });
                return resolve();
              }
              that.showBindBox = true;
              that.companyList = res.data.data;
              that.curCompany = res.data.data[0];
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
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
.pl {
  float: left;
}
.pr {
  float: right;
}
.pb {
  clear: both;
}
.memberComes {
  .title_img {
    margin-top: 30px;
    .company_imgs {
      width: 65px;
      height: 65px;
      border-radius: 5px;
      border: 1px solid #eeeeee;
      display: block;
      margin: auto;
    }
  }
  .hello {
    padding: 10px 15px;
    border-bottom: 1px solid #eeeeee;
    > span {
      display: block;
      width: 100%;
      text-align: center;
      height: 36px;
      line-height: 36px;
      background: #98caff;
      color: white;
      border-radius: 20px;
      margin-top: 20px;
    }
  }
  .boundDiv {
    display: flex;
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #eeeeee;
    > span {
      flex: 0 0 20%;
      text-align: center;
      height: 45px;
      line-height: 45px;
      // padding-left: 15px;
    }
    > input {
      flex: 1;
      height: 45px;
      line-height: 45px;
      padding-left: 15px;
      border: none;
      background: initial;
    }
    .code {
      flex: 0 0 30%;
      text-align: center;
      border-left: 1px solid #eee;
      background: #fff;
      line-height: 50px;
      font-size: 16px;
      color: #3cc51f;
      &.sendcode {
        background-color: #d3d3d3;
        color: #fff;
      }
    }
  }
  .showTooltips {
    background-color: #1aad19;
    display: block;
    width: 90%;
    margin: auto;
    text-align: center;
    height: 45px;
    line-height: 45px;
    color: white;
    border-radius: 5px;
    margin-top: 15px;
  }
  .companyList {
    padding: 15px;
    background: white;
    .companyMain {
      > span {
        &.active {
          color: @theme-color;
          border: 1rpx solid @theme-color;
        }
      }
    }
    > p {
      width: 100%;
      text-align: center;
    }
    span {
      display: block;
      height: 40px;
      line-height: 40px;
      width: 100%;
      text-align: center;
      border-radius: 5px;
      border: 1px solid #cccccc;
      margin-top: 20px;
    }
  }
}
</style>


