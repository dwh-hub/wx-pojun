<template>
  <div class="authorize-login">
    <image src="https://www.pojun-tech.com/images/company_log/37/1.5344641783646104E12.png"></image>
    <div class="tip">请完成微信授权以继续使用</div>
    <button class="authorize" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信授权登录</button>

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
        <span class="showTooltips" @click="bind">绑定</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  setNavTab,
  checkPhoneFormat,
  window,
  HttpRequest
} from "COMMON/js/common.js";
import store from "../../utils/store";
export default {
  data() {
    return {
      userInfo: {},
      phone: "",
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
    // 获取微信加密数据
    getPhoneNumber(e) {
      let that = this;
      HttpRequest({
        url: window.api + "/mini/getphone",
        data: {
          sessionKey: wx.getStorageSync("sessionKey"),
          encryptedData: e.mp.detail.encryptedData,
          iv: e.mp.detail.iv
        },
        success(res) {
          that.phone = res.data.data;
          wx.setStorage({
            key: "phone",
            data: res.data.data
          });
          that.login();
        }
      });
    },
    // 登录
    login() {
      this.getUserInfo().then(() => {
        this.bindMethod();
      });
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
      this.bindMethod();
    },
    // 绑定方法
    bindMethod() {
      let that = this;
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
            setTimeout(() => {
              wx.reLaunch({
                url: "../mine/main"
              });
            }, 1000);
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
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              if (!res.data.data.length) {
                return wx.showModal({
                  title: "提示",
                  content: "没有找到您的登记信息，请先登记信息",
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: "../register/main"
                      })
                    }
                  }
                });
              }
              if (res.data.data.length == 1) {
                that.userInfo = res.data.data[0];
                store.commit("saveUserInfo", res.data.data[0]);
                wx.setStorage({
                  key: "userInfo",
                  data: res.data.data[0]
                });
                return;
              }
              that.showBindBox = true;
              that.companyList = res.data.data;
              that.curCompany = res.data.data[0];
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
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

.authorize-login {
  padding: 15px;
  // padding-top: 200px;
  >image {
    width: 100%;
  }
  .tip {
    text-align: center;
    line-height: 36px;
  }
  .authorize {
    font-size: 16px;
    height: 36px;
    line-height: 36px;
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


