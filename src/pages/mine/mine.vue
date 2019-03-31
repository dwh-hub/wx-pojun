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
        <p id="mineName">未登录</p>
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
      isLogin: false
    };
  },
  onLoad() {
    this.getTimes();
    setNavTab();
  },
  mounted() {
    this.userInfo = wx.getStorageSync("userInfo");
    store.commit("saveUserInfo", this.userInfo);
    this.isLogin = store.state.isLogin
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
                  wx.removeStorage({
                    key: "userInfo",
                    success(res) {}
                  });
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
    singIn() {
      wx.navigateTo({
        url: "../login/main"
      });
    },
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
            wx.navigateTo({
              // url: "../authorizeLogin/main"
              url: "../login/main"
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
      > p {
        line-height: 33px;
        font-size: 15px;
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
}
</style>


