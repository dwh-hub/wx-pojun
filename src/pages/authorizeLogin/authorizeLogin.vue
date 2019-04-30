<template>
  <div class="authorize-login">
    <image src="https://pojun-tech.cn/assets/img/coordinates.png" mode="aspectFit"></image>
    <div class="authorize-bottom" v-if="isShow">
      <div class="tip">请完成微信授权以继续使用</div>
      <!-- <button 
        class="authorize"
        type="primary"
        open-type="getUserInfo" 
        @getuserinfo="getUserInfo">
        获取用户信息
      </button> -->
      <button
        class="authorize"
        type="primary"
        open-type="getPhoneNumber"
        @getphonenumber="_getPhoneNumber"
      >微信授权登录</button>
      <div class="toHome" @click="toHome">暂不登录</div>
    </div>
    <!-- <van-popup
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
    </van-popup> -->
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
import { getPhoneNumber,getMessage } from "COMMON/js/api.js";
export default {
  data() {
    return {
      userInfo: {},
      phone: "",
      showBindBox: false,
      companyList: [],
      // 选择的公司
      curCompany: {},
      isShow: true
    };
  },
  onLoad(options) {
    wxLogin();
    wx.getLocation({
      type: "wgs84",
      success(res) {
      }
    });
    // 获取公司id --> 获取公司主题色
    if (options.appid) {
      // 通过微信公众号appId获取公司信息(companyId, companyName)
      getWXCompany(options.appid).then(() => {
        this.login()
      })
    } else if(options.scene) {
      // 扫码进入时携带scene参数时(参数：公司id,门店id)
      var scene = decodeURIComponent(options.scene)
      var companyId = scene.split("-")[0]
      var storeId = scene.split("-")[1]
       wx.setStorageSync('companyId', companyId)
       wx.setStorageSync('storeId', storeId)
       getThemeColor()
       this.login()
    } else {
      // 直接进入小程序时，设置默认公司id
      getCompanyColor().then(() => {
        this.login()
      })
    }
  },
  methods: {
    toHome() {
      wx.switchTab({
        url: "../homepage/main"
      });
    },
    _getPhoneNumber(e) {
      getPhoneNumber(e,"../homepage/main",true);
    },
    getUserInfo(e) {
      console.log(e)
      if(e.mp.detail.indexOf("fail") == -1) {
        console.log(e.mp.detail)
      }
    },
    login() {
      let that = this
      if (!wx.getStorageSync("phone") || !wx.getStorageSync("openId")) {
        this.isShow = true
        return store.commit("changeLogin", false);
      }
      this.isShow = false
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
            getMessage()
            wx.hideLoading();
            wx.reLaunch({
              url: '../homepage/main'
            });
          } else {
            that.isShow = true
            store.commit("changeLogin", false);
            wx.hideLoading();
            wx.removeStorageSync("userInfo");
            wx.removeStorageSync("phone");
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


