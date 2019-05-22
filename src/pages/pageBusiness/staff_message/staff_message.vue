<template>
  <div class="staff_message">
    <div class="header-search">
      <div class="search-wrapper">
        <van-search
          :value="searchText"
          :background="themeColor"
          @change="searchChange"
          placeholder="请输入搜索内容"
        ></van-search>
      </div>
    </div>
    <van-tabbar active="3" @change="changeTabbar">
      <van-tabbar-item icon="home-o">快捷</van-tabbar-item>
      <van-tabbar-item icon="question-o" dot>帮助</van-tabbar-item>
      <van-tabbar-item icon="desktop-o">工作台</van-tabbar-item>
      <van-tabbar-item icon="chat-o" info="5">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue"
export default {
  data() {
    return {};
  },
  mounted() {
    setNavTab();
  },
  mixins:[colorMixin],
  methods: {
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
      if (e.mp.detail == 4) {
        wx.redirectTo({
          url: "../staff_mine/main"
        });
      }
    }
  }
};
</script>

<style lang="less">
</style>
