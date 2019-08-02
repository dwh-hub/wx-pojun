<template>
<!-- 废弃页面 -->
  <div class="authorize-login">
    <image src="https://pojun-tech.cn/assets/img/coordinates.png" mode="aspectFit"></image>
    <div class="authorize-bottom" v-if="isShow">
      <div class="tip">请完成微信授权以继续使用</div>
      <button
        v-if="!scope_userInfo"
        class="authorize"
        type="primary"
        open-type="getUserInfo"
        @getuserinfo="_getUserInfo"
      >获取用户信息</button>
      <button
        v-if="scope_userInfo"
        class="authorize"
        type="primary"
        open-type="getPhoneNumber"
        @getphonenumber="_getPhoneNumber"
      >微信授权登录</button>
      <div class="toHome" @click="toHome">暂不登录</div>
    </div>
    <van-popup
      :show="showBindBox"
      :duration="200"
      custom-style="width:85%;border-radius: 5px;"
    >
      <div class="storeList">
        <p>您本次浏览的门店是：</p>
        <div class="companyMain">
          <span
            v-for="(item, index) in storeList"
            :key="index"
            :class="{active:　item.id == curStore.id}"
            @click="selectStore(item)"
          >{{item.name}}</span>
        </div>
        <span class="showTooltips" @click="register">进入</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  wxLogin,
  HttpRequest,
  getWXCompany,
  getCompanyColor,
  getThemeColor
} from "COMMON/js/common.js";
import store from "../../utils/store";
import { getMessage } from "COMMON/js/api.js";
export default {
  data() {
    return {
      userInfo: {},
      // phone: "",
      showBindBox: false,
      // companyList: [],
      // 选择的公司
      // curCompany: {},
      isShow: true,
      scope_userInfo: false,
      storeList: [],
      curStore: {},
    };
  },
  onLoad(options) {
    wxLogin();
    wx.getLocation({
      type: "wgs84",
      success(res) {}
    });
    // 获取公司id --> 获取公司主题色
    if (options.appid) {
      // 通过微信公众号appId获取公司信息(companyId, companyName)
      getWXCompany(options.appid).then(() => {
        this.login();
      });
    } else if (options.scene) {
      // 扫码进入时携带scene参数时(参数：公司id,门店id)
      var scene = decodeURIComponent(options.scene);
      var companyId = scene.split("-")[0];
      var storeId = scene.split("-")[1];
      wx.setStorageSync("companyId", companyId);
      wx.setStorageSync("storeId", storeId);
      getThemeColor();
      this.login();
    } else {
      // 直接进入小程序时，设置默认公司id
      getCompanyColor().then(() => {
        this.login();
      });
    }
  },
  mounted() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          that.scope_userInfo = false;
          wx.authorize({
            scope: "scope.userInfo",
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.startRecord();
            }
          });
        } else {
          wx.getUserInfo({
            success(res) {
              that.userInfo = res.userInfo
              wx.setStorageSync("wx_userInfo", res.userInfo);
            }
          })
          that.scope_userInfo = true;
        }
      }
    });
  },
  onPullDownRefresh() {
    if (store.state.isLogin) {
      wx.switchTab({
        url: "../homepage/main"
      });
    } else {
      this.isShow = true;
    }
    wx.stopPullDownRefresh();
  },
  methods: {
    toHome() {
      wx.switchTab({
        url: "../homepage/main"
      });
    },
    _getPhoneNumber(e) {
      this.getPhoneNumber(e, "../homepage/main", true);
    },
    _getUserInfo(e) {
      if (JSON.stringify(e.mp.detail).indexOf("fail") == -1) {
        wx.setStorageSync("wx_userInfo", e.mp.detail.userInfo);
        this.scope_userInfo = true;
      }
    },
    login() {
      let that = this;
      if (!wx.getStorageSync("phone") || !wx.getStorageSync("openId")) {
        this.isShow = true;
        return store.commit("changeLogin", false);
      }
      this.isShow = false;
      wx.showLoading({
        title: "加载中..."
      });
      wx.request({
        url: window.api + "/wxcustomer/bindCard",
        data: {
          phone: wx.getStorageSync("phone"),
          companyId: wx.getStorageSync("userInfo").companyId,
          miniOpenId: wx.getStorageSync("openId")
        },
        success(res) {
          wx.setStorage({
            key: "Cookie",
            data: res.header["Set-Cookie"]
          });
          if (res.data.code === 200) {
            store.commit("changeLogin", true);
            getMessage();
            wx.hideLoading();
            wx.reLaunch({
              url: "../homepage/main"
            });
          } else {
            that.isShow = true;
            store.commit("changeLogin", false);
            wx.hideLoading();
            wx.removeStorageSync("userInfo");
            wx.removeStorageSync("phone");
          }
        }
      });
    },
    selectStore(item) {
      this.curStore = item
    },
    getAllStore() {
      let that = this;
      wx.request({
        url: window.api + "/store/all-store-name-list-nolimit",
        data: {
          companyId: wx.getStorageSync("companyId")
        },
        success(res) {
          if (res.data.code === 200) {
            that.storeList = res.data.data.map(e => {
              return {
                name: e.storeName,
                id: e.storeId
              };
            });
            that.curStore = that.storeList[0]
            that.showBindBox = true
          }
        }
      });
    },
    // 已下临时从api.js里拆出来的方法
    getPhoneNumber(e, url, isTab) {
      let that = this
      if (!e.mp.detail.encryptedData) {
        return;
      }
      wx.showLoading({
        title: "登录中..."
      });
      HttpRequest({
        url: window.api + "/mini/getphone",
        data: {
          sessionKey: wx.getStorageSync("sessionKey"),
          encryptedData: e.mp.detail.encryptedData,
          iv: e.mp.detail.iv
        },
        success(res) {
          if (res.data.code == 200) {
            wx.setStorage({
              key: "phone",
              data: res.data.data,
              success: function() {
                that._login(url, isTab);
              }
            });
          } else {
            wx.hideLoading();
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    // 登录
    _login(url, isTab) {
      this.getUserInfo().then(() => {
        this.bindMethod(url, isTab);
      });
    },
    // 获取用户信息
    getUserInfo() {
      let that = this
      return new Promise(function(resolve) {
        wx.request({
          url: window.api + "/wxcustomer/findAllCustomer",
          data: {
            phone: wx.getStorageSync("phone"),
            companyId: wx.getStorageSync("companyId")
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              let _data = res.data.data;
              if (!_data.length) {
                if (wx.getStorageSync("storeId")) {
                  return that.register();
                }
                // return wx.showModal({
                //   title: "提示",
                //   content: "您目前不是该店会员，是否前往注册会员？",
                //   success(res) {
                //     if (res.confirm) {
                //       wx.navigateTo({
                //         url: "../register/main"
                //       });
                //     }
                //   }
                // });
                that.getAllStore()
              }

              if (_data.length == 1) {
                // that.userInfo = _data[0];
                store.commit("saveUserInfo", _data[0]);
                wx.setStorage({
                  key: "userInfo",
                  data: _data[0]
                });
                wx.setStorage({
                  key: "companyId",
                  data: _data[0].companyId
                });
                wx.setStorage({
                  key: "companyName",
                  data: _data[0].companyName
                });
                return resolve();
              }
              // that.showBindBox = true;
              // that.companyList = _data;
              // that.curCompany = _data[0];
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
    // 绑定方法
    bindMethod(url, isTab) {
      wx.showLoading({
        title: "登录中..."
      });
      wx.request({
        url: window.api + "/wxcustomer/bindCard",
        data: {
          phone: wx.getStorageSync("phone"),
          companyId: wx.getStorageSync("companyId"),
          miniOpenId: wx.getStorageSync("openId")
        },
        success(res) {
          wx.setStorage({
            key: "Cookie",
            data: res.header["Set-Cookie"]
          });
          if (res.data.code === 200) {
            wx.hideLoading();
            wx.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1000
            });
            wx.removeStorageSync("storeId");
            getMessage();
            store.commit("changeLogin", true);
            getThemeColor();
            let _url = url ? url : "./main";
            if (isTab) {
              setTimeout(() => {
                wx.reLaunch({
                  url: _url
                });
              }, 1000);
            } else {
              setTimeout(() => {
                wx.redirectTo({
                  url: _url
                });
              }, 1000);
            }
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
    // 注册
    register() {
      let that = this
      wx.showLoading({
        title: "加载中..."
      });
      HttpRequest({
        url: window.api + "/wxcustomer/addCustomer",
        data: {
          companyId: wx.getStorageSync("companyId"),
          phone: wx.getStorageSync("phone"),
          // 扫码进入时
          // name: wx.getStorageSync("phone"),
          // storeId: wx.getStorageSync("storeId"),
          // sex: 0
          name: wx.getStorageSync("wx_userInfo").nickName,
          storeId: that.curStore.id || wx.getStorageSync("storeId"),
          sex: wx.getStorageSync("wx_userInfo").gender
        },
        success(res) {
            wx.hideLoading();
          if (res.data.code === 200) {
            // that.bindMethod();
            that._login("../homepage/main", true);
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

.authorize-login {
  padding: 15px;
  padding-top: 50px;
  > image {
    width: 100%;
  }
  .authorize-bottom {
    // position: fixed;
    // bottom: 120px;
    // left: 0;
    // padding: 15px;
    // margin-top: 20px;
    text-align: center;
    box-sizing: border-box;
    width: 100%;
    .tip {
      text-align: center;
      line-height: 36px;
    }
    .authorize {
      font-size: 16px;
      height: 36px;
      line-height: 36px;
      margin-bottom: 10px;
    }
  }
  .storeList {
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
      height: 32px;
      line-height: 32px;
      width: 100%;
      text-align: center;
      border-radius: 5px;
      border: 1px solid #cccccc;
      margin-top: 10px;
    }
    .showTooltips {
      background-color: #1aad19;
      color: #fff;
    }
  }
}
</style>


