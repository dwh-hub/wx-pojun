<template>
  <div class="memberMineTab">
    <div class="mine_top" :style="{'background-color': themeColor}">
      <div class="mineImgDiv">
        <!-- <img
          class="mineImg"
          :src="userInfo.headImgPath || 'https://pojun-tech.cn/assets/img/morenTo.png'"
        >-->
        <div class="mineImg">
          <open-data type="userAvatarUrl"></open-data>
        </div>
      </div>
      <div class="mineDetail" @click="singIn" v-if="!isLogin">
        <button
          class="authorize"
          type="default"
          open-type="getPhoneNumber"
          @getphonenumber="_getPhoneNumber"
        >点击登录</button>
      </div>
      <div class="mineDetail" v-else>
        <p class="mineName">{{userInfo.name || '昵称'}}</p>
        <p class="minePhone">{{encryptPhone || '手机号'}}</p>
      </div>
    </div>

    <div class="mineDeail">
      <div class="detail-block">
        <div class="block-flex" @click="navTo('../memberCard/main')">
          <div class="count" v-if="isLogin">{{cardNum || 0}}</div>
          <div class="count" v-else>0</div>
          <div class="count-text">会员卡</div>
        </div>
        <div class="block-flex" @click="navTo('../classTimes/main')">
          <div class="count">{{FreeCount || 0}}</div>
          <div class="count-text">消费记录</div>
        </div>
      </div>
      <div
        class="detail_item"
        v-for="(item, index) in mineNav"
        :key="index"
        @click="navTo(item.navigatorUrl)"
      >
        <img alt :src="item.imgUrl" />
        <span class="detail_title">{{item.navName}}</span>
        <span class="detail_contrnt" v-if="isLogin">{{item.hit}}{{item.text}}</span>
      </div>
    </div>
    <div
      class="mineExit"
      :style="{'background-color': themeColor}"
      @click="singOut"
      v-if="isLogin"
    >解除绑定</div>

    <select-company v-if="showCompanyList" :companyList="companyList" :role="role"></select-company>
    <!-- <login-popup :options="options" v-if="!isLogin"></login-popup> -->
    <page-footer></page-footer>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  wxLogin,
  HttpRequest
} from "COMMON/js/common.js";
import { getPhoneNumber } from "COMMON/js/merge_login.js";
import store from "../../utils/store";
import pageFooter from "COMPS/pageFooter.vue";
import colorMixin from "COMPS/colorMixin.vue";
import selectCompany from "COMPS/selectCompany.vue";
// import loginPopup from "COMPS/loginPopup.vue";

import { getPhoneNumber_staff } from "COMMON/js/only_staff_login.js";

export default {
  data() {
    return {
      mineNav: [
        // {
        //   imgUrl: "https://www.pojun-tech.cn/assets/img/mineCar.png",
        //   navName: "会员卡",
        //   navigatorUrl: "../memberCard/main",
        //   hit: "",
        //   text: "张"
        // },
        // {
        //   imgUrl: "https://www.pojun-tech.cn/assets/img/lessons.png",
        //   navName: "上课次数",
        //   navigatorUrl: "../classTimes/main",
        //   hit: "",
        //   text: "次"
        // },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/appiont.png",
          navName: "预约记录",
          navigatorUrl: "../appointmentRecord/main",
          hit: "",
          text: "次"
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/comeCost.png",
          navName: "签到记录",
          navigatorUrl: "../checkInRecord/main",
          hit: "",
          text: "次"
        }
        // {
        //   imgUrl: "https://www.pojun-tech.cn/assets/img/comeCost.png",
        //   navName: "商户端",
        //   navigatorUrl: "../pageBusiness/workbench/main",
        //   hit: "",
        //   text: "次"
        // },
        // {
        //   imgUrl: "https://www.pojun-tech.cn/assets/img/comeCost.png",
        //   navName: "我是工作人员",
        //   navigatorUrl: "../pageBusiness/index/main",
        //   hit: "",
        //   text: ""
        // }
        // {
        //   imgUrl: "https://www.pojun-tech.cn/assets/img/integral.png",
        //   navName: "我的积分",
        //   navigatorUrl: "../myPoints/main",
        //   hit: "",
        //   text: "分"
        // },
        // {
        //   imgUrl: "https://www.pojun-tech.cn/assets/img/checkFace.png",
        //   navName: "人脸设置",
        //   navigatorUrl: "../faceSetUp/main",
        //   hit: "",
        //   text: ""
        // }
      ],
      // 临时的用户数据
      userInfo: {},
      phone: "",
      companyList: [],
      // 会员卡张数
      cardNum: "",
      // 积分
      myPoints: "",
      // 消费次数
      FreeCount: "",
      showCompanyList: false,
      isLogin: false,
      role: ''
    };
  },
  components: {
    pageFooter,
    selectCompany
  },
  mixins: [colorMixin],
  onShow() {
    this.showCompanyList = false
    this.isLogin = wx.getStorageSync("isLogin")
    this.getTimes();
    if(wx.getStorageSync("isLogin") == false) {
      wxLogin();
    }
    if (this.themeColor != window.color) {
      this.themeColor = window.color;
      setNavTab(wx.getStorageSync("companyName"));
    }
    this.userInfo = wx.getStorageSync("userInfo");
    store.commit("saveUserInfo", this.userInfo);
  },
  mounted() {
    setNavTab();
    // this.isLogin = wx.getStorageSync("isLogin");
    this.themeColor = window.color;
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  computed: {
    encryptPhone() {
      if (this.userInfo.phone) {
        return (
          this.userInfo.phone.substr(0, 3) +
          "****" +
          this.userInfo.phone.substr(7)
        );
      }
      return "";
    }
  },
  methods: {
    _getPhoneNumber(e) {
      if (window.isPublic) {
        return getPhoneNumber_staff(e).then(res => {
          this.role = res.role
          this.companyList = res.companyList
          this.showCompanyList = true;
        });
      }
      getPhoneNumber(e, "../mine/main", true);
    },
    navTo(url) {
      // TODO:
      if (!wx.getStorageSync("isLogin")) {
        return wx.showToast({
          title: "请登录",
          icon: "none",
          duration: 1000
        });
      }
      wx.navigateTo({
        url: url
      });
    },
    // 退出登录
    singOut() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确认解除绑定吗？",
        success(res) {
          if (res.confirm) {
            HttpRequest({
              url: window.api + "/wxcustomer/exit",
              data: {
                unSubType: 2,
                exitType: 2
              },
              success(res) {
                if (res.data.code === 200) {
                  wx.removeStorageSync("userInfo");
                  wx.removeStorageSync("phone");
                  wx.setStorageSync("isLogin", false)
                  wx.showToast({
                    title: "解绑成功",
                    icon: "success",
                    duration: 1000
                  });
                  that.cardNum = ''
                  that.FreeCount = ''
                  wx.reLaunch({
                    url: "./main"
                  });
                } else {
                  wx.showModal({
                    title: "提示",
                    content: res.data.message,
                    showCancel: false
                  });
                }
              }
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    getTimes() {
      let that = this;
      HttpRequest({
        url: window.api + "/wxcustomer/selfcount",
        method: "POST",
        success(res) {
          if (res.data.code === 200) {
            that.myPoints = res.data.data.selfIntegral || "";
            that.FreeCount = res.data.data.attendClassCount || "";
            that.cardNum = res.data.data.cardCount || "";
            that.mineNav.forEach(function(e) {
              if (e.navName == "会员卡") {
                e.hit = res.data.data.cardCount || "";
              } else if (e.navName == "上课次数") {
                e.hit = res.data.data.attendClassCount || "";
              } else if (e.navName == "预约记录") {
                e.hit = res.data.data.appointCount || "";
              } else if (e.navName == "签到记录") {
                e.hit = res.data.data.consumeLogCount || "";
              }
              // else if (e.navName == "我的积分") {
              //   e.hit = res.data.data.selfIntegral;
              // }
            });
          } else {
            wx.setStorageSync("isLogin", false)
            // wx.navigateTo({
            //   url: "../authorizeLogin/main"
            //   // url: "../login/main"
            // });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

page {
  background-color: #f5f6f7;
}
.memberMineTab {
  .mine_top {
    height: 50vw;
    padding: 30px 20px;
    box-sizing: border-box;
    display: flex;
    .mineImgDiv {
      border-radius: 50%;
      flex: 0 0 66px;
      .mineImg {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .mineDetail {
      flex: 1;
      margin-left: 10px;
      .authorize {
        &::after {
          border: 0;
        }
        text-align: left;
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
      }
      > p {
        line-height: 32px;
      }
      .mineName {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
      }
      .minePhone {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  .mineDeail {
    margin: 0 20px;
    margin-top: -47px;
    .detail-block {
      height: 94px;
      background-color: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      .block-flex {
        flex: 1;
        text-align: center;
        .count {
          font-size: 18px;
          font-weight: bold;
        }
        .count-text {
          color: #909090;
          margin-top: 10px;
        }
      }
    }
    .detail_item {
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      padding-left: 15px;
      border-radius: 4px;
      margin-top: 10px;
      background-color: #fff;
      > img {
        display: inline-block;
        vertical-align: middle;
        width: 25px;
        height: 25px;
      }
      .detail_title {
        vertical-align: middle;
        margin-left: 10px;
      }
      .detail_contrnt {
        float: right;
        margin-right: 15px;
      }
    }
  }
  .mineExit {
    position: absolute;
    bottom: 15px;
    left: 5%;
    width: 90%;
    height: 40px;
    line-height: 40px;
    color: white;
    text-align: center;
    border-radius: 5px;
    &:active {
      opacity: 0.8;
    }
  }
}
</style>


