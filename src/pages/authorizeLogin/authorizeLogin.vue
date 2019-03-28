<template>
  <div class="authorize-login">
    <!-- <image src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png"></image> -->
    <div class="tip">请完成微信授权以继续使用</div>
    <button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信授权登录</button>
  </div>
</template>

<script>
import { setNavTab, checkPhoneFormat, window } from "COMMON/js/common.js";
import store from "../../utils/store";
export default {
  data() {
    userInfo: {
    }
  },
  onLoad() {
    setNavTab();
  },
  methods: {
    // 获取微信加密数据
    getPhoneNumber(e) {
      console.log(e.mp.detail.errMsg);
      console.log(e.mp.detail.iv);
      console.log(e.mp.detail.encryptedData);
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
.authorize-login {
  padding: 15px;
}
</style>


