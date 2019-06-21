<template>
  <div class="login-popup" v-show="showPopup">
    <div class="authorize-popup">
      <div class="logo">
        <image :src="window.api + companyInfo.logimage" mode="aspectFill"></image>
      </div>
      <div class="name">{{companyInfo.name}}</div>
      <div class="tip">{{systemSteup.enterTags || '注册成功后将获得惊喜大礼包'}}</div>
      <div class="btn-wrapper">
        <button
          class="authorize"
          type="primary"
          open-type="getPhoneNumber"
          @getphonenumber="_getPhoneNumber"
        >微信快捷登录</button>
        <button class="login-none" v-if="!systemSteup.isNeedLogin" @click="showPopup = false">暂不登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  window,
  wxLogin,
  HttpRequest,
  getWXCompany,
  getCompanyColor,
  getThemeColor
} from "COMMON/js/common.js";
import store from "../utils/store";
import {
  getPhoneNumber,
  getMessage,
  staff_login,
  getUserInfo,
  enterMember,
  enterStaff
} from "COMMON/js/merge_login.js";
export default {
  props: ["options"],
  data() {
    return {
      showPopup: true,
      userInfo: {},
      companyInfo: {},
      // storeList: [],
      // curStore: {},
      systemSteup: {}
    };
  },
  mounted() {
    this._onLoad(this.options);
    this.getCompanyInfo();
  },
  computed: {
    window() {
      return window;
    }
  },
  methods: {
    rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getCompanyInfo() {
      let that = this;
      HttpRequest({
        url: window.api + "/system/set/wxcompanyinfo",
        data: {
          companyId: wx.getStorageSync("companyId")
        },
        success(res) {
          that.companyInfo = JSON.parse(res.data.data.baseInfo);
        }
      });
    },
    getSystemSteup() {
      let that = this;
      HttpRequest({
        url: window.api + "/system/setup/company/query",
        data: {
          companyId: wx.getStorageSync("companyId")
        },
        success(res) {
          that.systemSteup = res.data.data;
        }
      });
    },
    _onLoad(options) {
      wxLogin();
      // 获取公司id --> 获取公司主题色
      if (options.appid) {
        console.log("appid:" + options.appid);
        // 通过微信公众号appId获取公司信息(companyId, companyName)
        getWXCompany(options.appid).then(() => {
          this.login();
        });
      } else if (options.scene) {
        console.log("scene:" + options.scene);
        // 扫码进入时携带scene参数时(参数：公司id,门店id)
        var scene = decodeURIComponent(options.scene);
        var companyId = scene.split("-")[0];
        var storeId = scene.split("-")[1];
        var serviceUserId = scene.split("-")[2];
        wx.setStorageSync("companyId", companyId);
        wx.setStorageSync("storeId", storeId);
        wx.setStorageSync("serviceUserId", serviceUserId);
        getThemeColor();
        this.login();
      } else {
        // 直接进入小程序时，设置默认公司id
        getCompanyColor().then(() => {
          this.login();
        });
      }
    },
    login() {
      if (wx.getStorageSync("phone") && wx.getStorageSync("openId") && !wx.getStorageSync("instMsgSubKey")) {
        getUserInfo().then((member_res) => {
          enterMember(member_res)
        })
      }
      if (wx.getStorageSync("instMsgSubKey") && wx.getStorageSync("phone")) {
        wx.showLoading()
        staff_login().then((staff_res) => {
          wx.hideLoading()
          if(!staff_res) {
            return
          }
          enterStaff(staff_res)
        })
      }
    },
    _getPhoneNumber(e) {
      getPhoneNumber(e, "../homepage/main", true);
    }
    // login() {
    //   let that = this;
    //   if (!wx.getStorageSync("phone") || !wx.getStorageSync("openId")) {
    //     // this.isShow = true;
    //     store.commit("changeLogin", false);
    //     this.staff_login()
    //     return
    //   }
    //   console.log("storeid:" + wx.getStorageSync("storeId"));
    //   console.log("userInfo.storeId:" + wx.getStorageSync("userInfo").storeId);
    //   if (
    //     wx.getStorageSync("storeId") &&
    //     wx.getStorageSync("userInfo").storeId != wx.getStorageSync("storeId")
    //   ) {
    //     return store.commit("changeLogin", false);
    //   }
    //   // this.isShow = false;
    //   wx.showLoading({
    //     title: "加载中..."
    //   });
    //   wx.request({
    //     url: window.api + "/wxcustomer/bindCard",
    //     data: {
    //       phone: wx.getStorageSync("phone"),
    //       companyId: wx.getStorageSync("userInfo").companyId,
    //       miniOpenId: wx.getStorageSync("openId")
    //     },
    //     success(res) {
    //       wx.setStorage({
    //         key: "Cookie",
    //         data: res.header["Set-Cookie"]
    //       });
    //       if (res.data.code === 200) {
    //         store.commit("changeLogin", true);
    //         getMessage();
    //         wx.hideLoading();
    //         wx.reLaunch({
    //           url: "../homepage/main"
    //         });
    //       } else {
    //         // that.isShow = true;
    //         store.commit("changeLogin", false);
    //         wx.hideLoading();
    //         wx.removeStorageSync("userInfo");
    //         wx.removeStorageSync("phone");
    //       }
    //     }
    //   });
    // },
    // staff_login() {
    //   if(!wx.getStorageSync("instMsgSubKey") || !wx.getStorageSync("phone")) {
    //     return
    //   }
    //   wx.request({
    //     url: window.api + '/user/login/mini',
    //     data: {
    //       phone: wx.getStorageSync("phone"),
    //       companyId: wx.getStorageSync("companyId")
    //     },
    //     success(res) {
    //       if (res.data.code == 200 || res.data.code == 201) {
    //         wx.setStorageSync("Cookie", res.header["Set-Cookie"]);
    //         wx.setStorageSync("instMsgSubKey", res.data.data.instMsgSubKey);
    //         wx.setStorageSync("staff_info", res.data.data);
    //         wx.setStorageSync("companyId", res.data.data.companyId);
    //         wx.setStorageSync("companyName", res.data.data.companyName);
    //         wx.navigateTo({
    //           url: "../pageBusiness/workbench/main"
    //         })
    //       }
    //     }
    //   })
    // },
    // getAllStore() {
    //   let that = this;
    //   wx.request({
    //     url: window.api + "/store/all-store-name-list-nolimit",
    //     data: {
    //       companyId: wx.getStorageSync("companyId")
    //     },
    //     success(res) {
    //       if (res.data.code === 200) {
    //         that.storeList = res.data.data.map(e => {
    //           return {
    //             name: e.storeName,
    //             id: e.storeId
    //           };
    //         });
    //         that.curStore = that.storeList[0];
    //       }
    //     }
    //   });
    // },
    // getPhoneNumber(e, url, isTab) {
    //   let that = this;
    //   if (!e.mp.detail.encryptedData) {
    //     return;
    //   }
    //   wx.showLoading({
    //     title: "登录中..."
    //   });
    //   HttpRequest({
    //     url: window.api + "/mini/getphone",
    //     data: {
    //       sessionKey: wx.getStorageSync("sessionKey"),
    //       encryptedData: e.mp.detail.encryptedData,
    //       iv: e.mp.detail.iv
    //     },
    //     success(res) {
    //       if (res.data.code == 200) {
    //         wx.setStorage({
    //           key: "phone",
    //           data: res.data.data,
    //           success: function() {
    //             that._login(url, isTab);
    //           }
    //         });
    //       } else {
    //         wx.hideLoading();
    //         wx.showModal({
    //           title: "提示",
    //           content: res.data.message,
    //           showCancel: false
    //         });
    //       }
    //     }
    //   });
    // },
    // // 登录
    // _login(url, isTab) {
    //   this.getAllStore();
    //   this.getUserInfo().then(() => {
    //     this.bindMethod(url, isTab);
    //   });
    // },
    // // 获取用户信息
    // getUserInfo() {
    //   let that = this;
    //   // findCustomerStore
    //   return new Promise(function(resolve) {
    //     wx.request({
    //       url: window.api + "/wxcustomer/findCustomerStore",
    //       data: {
    //         phone: wx.getStorageSync("phone"),
    //         companyId: wx.getStorageSync("companyId")
    //       },
    //       success(res) {
    //         wx.hideLoading();
    //         if (res.data.code == 200) {
    //           let _data = res.data.data;

    //           //  || (wx.getStorageSync("storeId") && wx.getStorageSync("userInfo").storeId != wx.getStorageSync("storeId"))
    //           if (!_data.length) {
    //             return that.register();
    //           }

    //           if (_data.length) {
    //             if (
    //               wx.getStorageSync("storeId") &&
    //               !_data.filter(e => {
    //                 return e.storeId == wx.getStorageSync("storeId");
    //               }).length
    //             ) {
    //               return that.register();
    //             }

    //             store.commit("saveUserInfo", _data[0]);
    //             wx.setStorage({
    //               key: "userInfo",
    //               data: _data[0]
    //             });
    //             wx.setStorage({
    //               key: "companyId",
    //               data: _data[0].companyId
    //             });
    //             wx.setStorage({
    //               key: "companyName",
    //               data: _data[0].companyName
    //             });
    //             return resolve();

    //           }
    //         } else {
    //           wx.showModal({
    //             title: "提示",
    //             content: res.data.message,
    //             showCancel: false
    //           });
    //         }
    //       }
    //     });
    //   });
    // },
    // // 绑定方法
    // bindMethod(url, isTab) {
    //   let that = this;
    //   wx.showLoading({
    //     title: "登录中..."
    //   });
    //   wx.request({
    //     url: window.api + "/wxcustomer/bindCard",
    //     data: {
    //       phone: wx.getStorageSync("phone"),
    //       companyId: wx.getStorageSync("companyId"),
    //       miniOpenId: wx.getStorageSync("openId")
    //     },
    //     success(res) {
    //       wx.setStorage({
    //         key: "Cookie",
    //         data: res.header["Set-Cookie"]
    //       });
    //       if (res.data.code === 200) {
    //         wx.hideLoading();
    //         wx.showToast({
    //           title: "登录成功",
    //           icon: "success",
    //           duration: 1000
    //         });
    //         wx.removeStorageSync("storeId");
    //         getMessage();
    //         store.commit("changeLogin", true);
    //         getThemeColor();
    //         // that.loginSuccess = true
    //         let _url = url ? url : "./main";
    //         if (isTab) {
    //           setTimeout(() => {
    //             wx.reLaunch({
    //               url: _url
    //             });
    //           }, 1000);
    //         } else {
    //           setTimeout(() => {
    //             wx.redirectTo({
    //               url: _url
    //             });
    //           }, 1000);
    //         }
    //       } else {
    //         return wx.showModal({
    //           title: "提示",
    //           content: res.data.message,
    //           showCancel: false
    //         });
    //       }
    //     }
    //   });
    // },
    // // 注册
    // register() {
    //   let that = this;
    //   wx.showLoading({
    //     title: "加载中..."
    //   });
    //   HttpRequest({
    //     url: window.api + "/wxcustomer/addCustomer",
    //     data: {
    //       id: wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").id : undefined,
    //       companyId: wx.getStorageSync("companyId"),
    //       phone: wx.getStorageSync("phone"),
    //       serviceUserId: wx.getStorageSync("serviceUserId")
    //         ? wx.getStorageSync("serviceUserId")
    //         : "",
    //       // 扫码进入时
    //       // name: wx.getStorageSync("phone"),
    //       // storeId: wx.getStorageSync("storeId"),
    //       // sex: 0
    //       name:  wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").name : ("微信用户" + that.rand(1000, 9999)), // wx.getStorageSync("wx_userInfo").nickName,
    //       storeId: wx.getStorageSync("storeId")
    //         ? wx.getStorageSync("storeId")
    //         : that.curStore.id, //that.curStore.id || wx.getStorageSync("storeId"),
    //       sex: 0 //wx.getStorageSync("wx_userInfo").gender
    //     },
    //     success(res) {
    //       wx.hideLoading();
    //       if (res.data.code === 200) {
    //         wx.removeStorageSync("storeId");
    //         if (wx.getStorageSync("serviceUserId")) {
    //           wxPush();
    //         }
    //         that._login("../homepage/main", true);
    //       } else {
    //         wx.showModal({
    //           title: "提示",
    //           content: res.data.message,
    //           showCancel: false
    //         });
    //       }
    //     }
    //   });
    // }
  }
};
</script>

<style lang="less">
.login-popup {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  .authorize-popup,
  .success-popup,
  .storeList {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    border-radius: 6px;
    background-color: #fff;
    z-index: 99;
  }
  .authorize-popup {
    text-align: center;
    padding: 30px;
    .logo {
      margin-bottom: 15px;
      > image {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        border-radius: 50%;
      }
    }
    .name {
      margin-bottom: 50px;
      font-size: 24px;
      font-weight: bold;
    }
    .tip {
      color: #999;
      line-height: 24px;
      font-size: 12px;
      margin-bottom: 15px;
    }
    .btn-wrapper {
      > button {
        line-height: 42px;
        border-radius: 21px;
        font-size: 16px;
        background-color: #46c260;
      }
      .login-none {
        margin-top: 10px;
        background-color: #fff;
        color: #46c260;
        border: 1px solid #46c260;
      }
    }
  }
}
</style>
