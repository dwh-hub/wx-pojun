<template>
  <div class="staff_mine">
    <van-cell
      value="基本信息"
      custom-class="lg-cell"
      value-class="cell-right"
      is-link
      @click="baseInfoCell"
    >
      <view slot="title">
        <!-- <div class="avatar">
          <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
        </div>-->
        <div class="avatar">
          <open-data type="userAvatarUrl"></open-data>
        </div>
        <div class="name">{{userInfo.userName || "昵称"}}</div>
      </view>
    </van-cell>

    <van-cell-group custom-class="van-cell-group">
      <van-cell title="信息展示" is-link/>
      <van-cell title="消息设置" is-link/>
      <van-cell title="专属二维码" is-link @click="showStore = true"/>
    </van-cell-group>

    <!-- <button @click="login">登录</button> -->
    <div class="mineExit" :style="{'background-color': window.color}" @click="signOut">退出登录</div>

    <van-tabbar active="4" @change="changeTabbar">
      <van-tabbar-item icon="home-o">快捷</van-tabbar-item>
      <van-tabbar-item icon="question-o">帮助</van-tabbar-item>
      <van-tabbar-item icon="desktop-o">工作台</van-tabbar-item>
      <van-tabbar-item icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>

    <van-popup
      :show="showQR"
      @close="showQR = false"
      :duration="200"
      custom-style="border-radius: 4px;"
    >
      <div class="qr-code-popup">
        <div class="popup-header">
          <div class="avatar">
            <open-data type="userAvatarUrl"></open-data>
          </div>
          <div class="info">
            <div class="user-name">
              <span>{{userInfo.userName || "昵称"}}</span>
              <span class="sex"></span>
            </div>
          </div>
        </div>
        <img class="qr-code" :src="QRSrc">
        <p class="qr-code-tip">扫一扫上面二维码，浏览俱乐部实景信息</p>
      </div>
    </van-popup>

    <van-action-sheet
      :show="showStore"
      :actions="storeList"
      @close="showStore = false"
      @select="selectStore"
      title="请选择门店"
    />
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import {staff_login,enterStaff} from "COMMON/js/merge_login.js";
import store from "@/utils/store.js";
export default {
  data() {
    return {
      showQR: false,
      showStore: false,
      storeList: [],
      selectedStore: {},
      QRSrc: "",
      userInfo: {}
    };
  },
  computed: {
    window() {
      return window;
    }
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore.map(e => {
      e["name"] = e.storeName;
      return e;
    });
    this.selectedStore = this.storeList[0];
    this.userInfo = wx.getStorageSync("staff_info");
  },
  methods: {
    login() {
      staff_login().then((res) => {
        enterStaff()
      })
      // let that = this;
      // wx.request({
      //   url: window.api + "/user/login",
      //   data: {
      //     phone: "18888888881",
      //     password: "2131",
      //     companyId: "53"
      //   },
      //   success(res) {
      //     if (res.data.code == 200) {
      //       wx.setStorageSync("Cookie", res.header["Set-Cookie"]);
      //       wx.setStorageSync("companyId", "53");
      //       wx.setStorageSync("instMsgSubKey", res.data.data.instMsgSubKey);
      //       wx.setStorageSync("staff_info", res.data.data);
      //       // that.getStaffInfo();
      //     }
      //   }
      // });
    },
    signOut() {
      wx.showModal({
        title: "提示",
        content: "是否退出登录？",
        success(res) {
          if (res.confirm) {
            wx.request({
              url: window.api + '/user/cancelbind'
            })
            wx.removeStorageSync("instMsgSubKey");
            wx.removeStorageSync("phone");
            wx.removeStorageSync("authInto")
            wx.removeStorageSync("staff_info")
            wx.switchTab({
              url: "../../homepage/main"
            });
          }
        }
      });
    },
    // getStaffInfo() {
    //   let that = this;
    //   HttpRequest({
    //     url: window.api + "/user/detail/own",
    //     success(res) {
    //       wx.setStorageSync("staff_info", res.data.data);
    //       // positionType 0 销售 1 教练 2 销售+教练 null 都不是
    //     }
    //   });
    // },
    baseInfoCell() {
      wx.navigateTo({
        url: `../staff_base_info/main?id=${this.userInfo.userId}&type=oneself`
      });
    },
    changeTabbar(e) {
      if (e.mp.detail == 0) {
        wx.redirectTo({
          url: "../index/main"
        });
      }
      if (e.mp.detail == 1) {
        wx.navigateTo({
          url: "../service_web/main"
        });
      }
      if (e.mp.detail == 2) {
        wx.redirectTo({
          url: "../workbench/main"
        });
      }
      if (e.mp.detail == 3) {
        wx.redirectTo({
          url: "../staff_message/main"
        });
      }
    },
    selectStore(e) {
      this.showStore = false;
      this.selectedStore = e.mp.detail;
      this.getQRCode().then(() => {
        this.showQR = true;
      });
      // this.getQRCode()
    },
    getQRCode() {
      let that = this;
      wx.showLoading();
      return new Promise(resolve => {
        HttpRequest({
          url: window.api + "/mini/getCodeUnlimit",
          data: {
            scene: `${that.userInfo.companyId}-${that.selectedStore.storeId}-${
              that.userInfo.userId
            }`
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.QRSrc = window.api + res.data.data;
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
page {
  height: 100%;
  background-color: #f6f6f6;
}
.staff_mine {
  .lg-cell {
    .van-cell__right-icon-wrap {
      margin-top: 12px;
    }
  }
  .van-cell-group {
    margin-top: 5px;
    background-color: #fff;
  }
  .avatar {
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    height: 50px;
    margin-right: 15px;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .name {
    display: inline-block;
  }
  .cell-right {
    line-height: 50px;
    vertical-align: middle;
  }
  .qr-code-popup {
    padding: 20px;
    .popup-header {
      display: flex;
      padding-bottom: 15px;
      color: #333;
      .avatar {
        margin-right: 15px;
        width: 50px;
        height: 50px;
      }
      .info {
        vertical-align: top;
        font-size: 14px;
        color: #333;
      }
      .sex {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 5px;
        vertical-align: middle;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
    .qr-code {
      width: 70vw;
      height: 70vw;
    }
    .qr-code-tip {
      text-align: center;
      margin: 15px 0;
      font-size: 12px;
      color: #999;
    }
  }
  .mineExit {
    position: absolute;
    bottom: 65px;
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
