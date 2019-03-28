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
    <span class="showTooltips" @click="login">绑定</span>
  </div>
</template>

<script>
import { setNavTab, checkPhoneFormat, window } from "COMMON/js/common.js";
import store from "../../utils/store";

export default {
  data() {
    return {
      isSend: false,
      phone: "",
      // 验证码
      vCode: "",
      // TODO: 短信验证码id
      smsSendLogId: 15679,
      userInfo: {},
      CDTime: 0
    };
  },
  onLoad() {
    setNavTab();
  },
  methods: {
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
              // TODO: smsSendLogId
              // that.smsSendLogId = res.data.data;
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
    // 登录
    login() {
      let that = this;
      wx.showLoading({
        title: "正在登录..."
      });
      wx.request({
        url: window.api + "/sms/authCode/nocompany",
        data: {
          phone: that.phone,
          code: that.vCode
        },
        success(data) {
          // TODO: 获取sessionKey和openid
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
          that.getUserInfo().then(() => {
            // 绑定
            wx.request({
              url: window.api + "/wxcustomer/bindCard",
              data: {
                phone: that.phone,
                companyId: that.userInfo.companyId
                // smsSendLogId: that.smsSendLogId
              },
              success(res) {
                wx.hideLoading();
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
                  setTimeout(() => {
                    wx.reLaunch({
                      url: "../mine/main"
                    });
                  }, 1000);
                }
              }
            });
          });
        }
      });
    },
    // 获取用户信息
    getUserInfo() {
      let that = this;
      return new Promise(function(resolve) {
        wx.request({
          url: window.api + "/wxcustomer/findAllCustomer",
          data: {
            phone: that.phone
          },
          success(res) {
            that.userInfo = res.data.data[0];
            store.commit("saveUserInfo", res.data.data[0]);
            wx.setStorage({
              key: "userInfo",
              data: res.data.data[0]
            });
            resolve();
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
}
</style>


