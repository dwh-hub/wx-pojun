<template>
  <div id="memberMineTab" class="clickTab">
    <div class="mine_top">
      <div class="mineImgDiv pl">
        <img
          class="mineImg"
          :src="userInfo.headImgPath || 'https://pojun-tech.cn/assets/img/morenTo.png'"
        >
      </div>
      <div class="pl mineDetail" @click="singIn" v-if="!isLogin">
        <button
          class="authorize"
          type="default"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >点击登录</button>
      </div>
      <div class="pl mineDetail" v-else>
        <p id="mineName">{{userInfo.name || '昵称'}}</p>
        <p id="minePhone">{{userInfo.phone || '手机号'}}</p>
      </div>
    </div>
    <div class="mineDeail">
      <div
        class="detail_item"
        v-for="(item, index) in mineNav"
        :key="index"
        @click="navTo(item.navigatorUrl)"
      >
        <img alt :src="item.imgUrl">
        <span class="detail_title">{{item.navName}}</span>
        <span class="detail_contrnt" v-if="isLogin">{{item.hit}}{{item.text}}</span>
      </div>
    </div>
    <div class="mineExit" @click="singOut" v-if="isLogin">解除绑定</div>
    <!-- <div class="mineExit" @click="singIn" v-else>去登录</div> -->
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
import { setNavTab, window, getCookie, HttpRequest } from "COMMON/js/common.js";
import store from "../../utils/store";

export default {
  data() {
    return {
      mineNav: [
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/mineCar.png",
          navName: "会员卡",
          navigatorUrl: "../memberCard/main",
          hit: "",
          text: "张"
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/lessons.png",
          navName: "上课次数",
          navigatorUrl: "../classTimes/main",
          hit: "",
          text: "次"
        },
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
      isLogin: false,
      phone: "",
      showBindBox: false,
      companyList: [],
      // 选择的公司
      curCompany: {}
    };
  },
  onLoad() {
    this.getTimes();
    setNavTab();
  },
  mounted() {
    this.userInfo = wx.getStorageSync("userInfo");
    store.commit("saveUserInfo", this.userInfo);
    this.isLogin = store.state.isLogin;
  },
  computed: {
    isLogin() {
      return store.state.isLogin;
    }
  },
  methods: {
    navTo(url) {
      if (!store.state.isLogin) {
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
      wx.showModal({
        title: "提示",
        content: "确认解除绑定吗？",
        success(res) {
          if (res.confirm) {
            HttpRequest({
              url: window.api + "/wxcustomer/exit",
              success(res) {
                if (res.data.code === 200) {
                  // wx.removeStorage({
                  //   key: "userInfo",
                  //   success(res) {}
                  // });
                  wx.clearStorageSync()
                  store.commit('changeLogin', false)
                  wx.showToast({
                    title: "解绑成功",
                    icon: "success",
                    duration: 1000
                  });
                  wx.reLaunch({
                    url: "../mine/main"
                  });
                }
              }
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    // 登录
    // singIn() {
    // wx.navigateTo({
    //   // url: "../login/main"
    //   url: "../authorizeLogin/main"
    // });
    // },
    getTimes() {
      let that = this;
      HttpRequest({
        url: window.api + "/wxcustomer/selfcount",
        method: "POST",
        success(res) {
          if (res.data.code === 200) {
            that.mineNav.forEach(function(e) {
              if (e.navName == "会员卡") {
                e.hit = res.data.data.cardCount;
              } else if (e.navName == "上课次数") {
                e.hit = res.data.data.attendClassCount;
              } else if (e.navName == "预约记录") {
                e.hit = res.data.data.appointCount;
              } else if (e.navName == "签到记录") {
                e.hit = res.data.data.consumeLogCount;
              } else if (e.navName == "我的积分") {
                e.hit = res.data.data.selfIntegral;
              }
            });
          } else {
            // wx.navigateTo({
            //   url: "../authorizeLogin/main"
            //   // url: "../login/main"
            // });
          }
        }
      });
    },
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
      wx.setStorage({
        key: "companyId",
        data: this.curCompany.companyId
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
                      });
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
                wx.setStorage({
                  key: "companyId",
                  data: res.data.data[0].companyId
                });
                return resolve();
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

#memberMineTab {
  .mine_top {
    padding: 20px 30px;
    box-sizing: border-box;
    height: 110px;
    .mineImgDiv {
      border-radius: 50%;
      .mineImg {
        width: 66px;
        height: 66px;
        border-radius: 5px;
      }
    }
    .mineDetail {
      // margin: 13px 0 0 15px;
      margin-left: 15px;
      .authorize {
        &::after {
          border: 0;
        }
        background-color: rgba(0,0,0,0);
        color: #333;
      }
      > p {
        line-height: 33px;
        font-size: 15px;
      }
      .toLogin {
        height: 66px;
      }
    }
  }
  .mineDeail {
    border-top: 10px solid #f4f4f4;
    .detail_item {
      height: 46px;
      line-height: 46px;
      font-size: 15px;
      padding-left: 15px;
      border-bottom: 1px solid #ededed;
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
    left: 4%;
    width: 92%;
    height: 40px;
    line-height: 40px;
    color: white;
    text-align: center;
    border-radius: 5px;
    background: @theme-color;
    &:active {
      opacity: 0.8;
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


