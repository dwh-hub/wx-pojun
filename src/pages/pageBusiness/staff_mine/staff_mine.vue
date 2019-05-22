<template>
  <div class="staff_mine">
    <van-cell value="基本信息" value-class="cell-right" @click="baseInfoCell">
      <view slot="title">
        <div class="avatar">
          <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
        </div>
        <div class="name">王老板</div>
      </view>
    </van-cell>

    <van-cell-group custom-class="van-cell-group">
      <van-cell title="信息展示" is-link/>
      <van-cell title="消息设置" is-link/>
      <van-cell title="专属二维码" is-link/>
    </van-cell-group>

    <button @click="login">登录</button>

    <van-tabbar active="4" @change="changeTabbar">
      <van-tabbar-item icon="home-o">快捷</van-tabbar-item>
      <van-tabbar-item icon="question-o" dot>帮助</van-tabbar-item>
      <van-tabbar-item icon="desktop-o">工作台</van-tabbar-item>
      <van-tabbar-item icon="chat-o" info="5">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
export default {
  data() {
    return {};
  },
  mounted() {
    setNavTab();
  },
  methods: {
    login() {
      HttpRequest({
        url: window.api + "/user/login",
        data: {
          phone: "18888888888",
          password: "2131"
        },
        success(res) {
          wx.setStorage({
            key: "Cookie",
            data: res.header["Set-Cookie"]
          });
          // wx.setStorage({
          //   key: 'staff_userInfo',
          //   data: res.data.data
          // });
          console.log(res.data);
        }
      });
    },
    baseInfoCell() {
      wx.navigateTo({
        url: "../staff_base_info/main"
      });
    },
    changeTabbar(e) {
      if (e.mp.detail == 0) {
        wx.redirectTo({
          url: "../index/main"
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
    }
  }
  .name {
    display: inline-block;
  }
  .cell-right {
    line-height: 50px;
    vertical-align: middle;
  }
}
</style>
