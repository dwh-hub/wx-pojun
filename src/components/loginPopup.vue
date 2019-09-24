<template>
  <div class="login-popup" v-show="showPopup">
    <div class="authorize-popup" v-show="showAuthorizePoppup">
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
    <select-company v-if="showCompanyList" :companyList="companyList"></select-company>
  </div>
</template>

<script>
import {
  window,
  // wxLogin,
  HttpRequest,
  getWXCompany,
  getCompanyColor,
  getThemeColor
} from "COMMON/js/common.js";
import selectCompany from "COMPS/selectCompany.vue"
import {
  getPhoneNumber,
  getMessage,
  staff_login,
  getUserInfo,
  enterMember,
  enterStaff
} from "COMMON/js/merge_login.js";
import { 
  getPhoneNumber_staff
} from "COMMON/js/only_staff_login.js";

export default {
  props: ["options"],
  data() {
    return {
      showPopup: true,
      showAuthorizePoppup: true,
      showCompanyList: false,
      companyList: [],
      userInfo: {},
      companyInfo: {},
      systemSteup: {}
    };
  },
  onShow() {
    this.showAuthorizePoppup = true
    this.showCompanyList = false
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
  components: {
    selectCompany
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
      // wxLogin();
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
      if(wx.getStorageSync("isLogin")) {
        return
      }
      if (wx.getStorageSync("phone") && wx.getStorageSync("openId") && !wx.getStorageSync("instMsgSubKey") && !window.isPublic) {
        getUserInfo().then((member_res) => {
          enterMember(member_res)
        })
      }
    },
    _getPhoneNumber(e) {
      if(window.isPublic) {
        return getPhoneNumber_staff(e).then(res => {
          this.showAuthorizePoppup = false
          this.companyList = res.data.data.map(e => {
            return {
              companyName: e.companyName,
              companyId: e.companyId
            }
          })
          this.showCompanyList = true
        })
      }
      getPhoneNumber(e, "../homepage/main", true);
    }
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
