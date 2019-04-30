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
          <div class="count-text">消费次数</div>
        </div>
      </div>
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
    <div
      class="mineExit"
      :style="{'background-color': themeColor}"
      @click="singOut"
      v-if="isLogin"
    >解除绑定</div>
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
            :class="{active: item.companyId == curCompany.companyId}"
            @click="selectCompany(item)"
          >{{item.companyName}}</span>
        </div>
        <span class="showTooltips" @click="bind">绑定</span>
      </div>
    </van-popup>
    <page-footer></page-footer>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  wxLogin,
  getCookie,
  HttpRequest,
  getThemeColor
} from "COMMON/js/common.js";
import {getPhoneNumber} from "COMMON/js/api.js";
import store from "../../utils/store";
import pageFooter from "COMPS/pageFooter.vue"

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
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/comeCost.png",
          navName: "我是工作人员",
          navigatorUrl: "../pageBusiness/index/main",
          hit: "",
          text: ""
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
      curCompany: {},
      // 会员卡张数
      cardNum: "",
      // 积分
      myPoints: "",
      // 消费次数
      FreeCount:"",
      themeColor: ""
    };
  },
  components: {
    pageFooter
  },
  onShow() {
    if(store.state.isLogin == false) {
      wxLogin();
    }
    if (this.themeColor != window.color) {
      this.themeColor = window.color;
      setNavTab(wx.getStorageSync("companyName"));
    }
  },
  mounted() {
    this.getTimes();
    setNavTab();
    this.userInfo = wx.getStorageSync("userInfo");
    store.commit("saveUserInfo", this.userInfo);
    this.isLogin = store.state.isLogin;
    this.themeColor = window.color
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  computed: {
    isLogin() {
      return store.state.isLogin;
    },
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
      getPhoneNumber(e,"../mine/main",true)
    },
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
      let that = this;
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
                  wx.removeStorageSync("userInfo");
                  wx.removeStorageSync("phone");
                  store.commit("changeLogin", false);
                  wx.showToast({
                    title: "解绑成功",
                    icon: "success",
                    duration: 1000
                  });
                  wx.reLaunch({
                    url: "../authorizeLogin/main"
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
            that.myPoints = res.data.data.selfIntegral;
            that.FreeCount = res.data.data.attendClassCount;
            that.cardNum = res.data.data.cardCount;
            that.mineNav.forEach(function(e) {
              if (e.navName == "会员卡") {
                e.hit = res.data.data.cardCount;
              } else if (e.navName == "上课次数") {
                e.hit = res.data.data.attendClassCount;
              } else if (e.navName == "预约记录") {
                e.hit = res.data.data.appointCount;
              } else if (e.navName == "签到记录") {
                e.hit = res.data.data.consumeLogCount;
              }
              // else if (e.navName == "我的积分") {
              //   e.hit = res.data.data.selfIntegral;
              // }
            });
          } else {
            store.commit("changeLogin", false);
            // wx.navigateTo({
            //   url: "../authorizeLogin/main"
            //   // url: "../login/main"
            // });
          }
        }
      });
    },
    // 获取微信加密数据
    // getPhoneNumber(e) {
    //   let that = this;
    //   if(!e.mp.detail.encryptedData) {
    //     return
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
    //         that.phone = res.data.data;
    //         wx.setStorage({
    //           key: "phone",
    //           data: res.data.data
    //         });
    //         that.login();
    //       } else {
    //         wx.hideLoading();
    //       }
    //     }
    //   });
    // },
    // 登录
    // login() {
    //   this.getUserInfo().then(() => {
    //     this.bindMethod();
    //   });
    // },
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
      wx.setStorage({
        key: "companyName",
        data: this.curCompany.companyName
      });
      this.bindMethod();
    },
    // 绑定方法
    // bindMethod() {
    //   let that = this;
    //   wx.request({
    //     url: window.api + "/wxcustomer/bindCard",
    //     data: {
    //       phone: that.phone,
    //       companyId: that.userInfo.companyId,
    //       miniOpenId: wx.getStorageSync("openId")
    //       // smsSendLogId: that.smsSendLogId
    //     },
    //     success(res) {
    //       wx.setStorage({
    //         key: "Cookie",
    //         data: res.header["Set-Cookie"]
    //       });
    //       if (res.data.code === 200) {
    //         wx.showToast({
    //           title: "登录成功",
    //           icon: "success",
    //           duration: 1000
    //         });
    //         store.commit("changeLogin", true);
    //         getThemeColor();
    //         setTimeout(() => {
    //           wx.reLaunch({
    //             url: "../mine/main"
    //           });
    //         }, 1000);
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
    // 获取用户信息
    // getUserInfo() {
    //   // wx.showLoading({
    //   //   title: "正在登录..."
    //   // });
    //   let that = this;
    //   return new Promise(function(resolve) {
    //     wx.request({
    //       url: window.api + "/wxcustomer/findAllCustomer",
    //       data: {
    //         phone: that.phone,
    //         companyId: wx.getStorageSync("companyId")
    //       },
    //       success(res) {
    //         wx.hideLoading();
    //         if (res.data.code == 200) {
    //           let _data = res.data.data
    //           if (!_data.length) {
    //             return wx.showModal({
    //               title: "提示",
    //               content: "没有找到您的登记信息，请先登记信息",
    //               success(res) {
    //                 if (res.confirm) {
    //                   wx.navigateTo({
    //                     url: "../register/main"
    //                   });
    //                 }
    //               }
    //             });
    //           }

    //           if (_data.length == 1) {
    //             that.userInfo = _data[0];
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
    //           that.showBindBox = true;
    //           that.companyList = _data;
    //           that.curCompany = _data[0];
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
    // }
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


