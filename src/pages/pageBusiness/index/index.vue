<template>
  <div class="index">
    <div class="header-search">
      <div class="store">门店</div>
      <div class="search-wrapper">
        <van-search
          :value="searchText"
          background="#fff"
          @change="search"
          placeholder="请输入搜索内容"
        ></van-search>
      </div>
    </div>
    <header-data></header-data>
    <div class="taamclass list">
      <div class="list-header">
        <span class="title">私教预约</span>
        <span class="info">今日约课13节私教</span>
        <span class="btn" @click="toNav('../staff_appoint_teamclass/main')">约课</span>
      </div>
      <staff-coach-item></staff-coach-item>
      <div class="see-more">查看更多</div>
    </div>

    <div class="coachclass list">
      <div class="list-header">
        <span class="title">私教预约</span>
        <span class="info">今日约课13节私教</span>
        <span class="btn">约课</span>
      </div>
      <staff-coach-item></staff-coach-item>
      <div class="see-more">查看更多</div>
    </div>

    <van-tabbar :active="activeIndex" @change="changeTabbar">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="manager-o" dot>会员</van-tabbar-item>
      <van-tabbar-item icon="desktop-o" info="5">工作台</van-tabbar-item>
      <van-tabbar-item icon="setting-o" info="20">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
import staffCoachItem from "../components/staff-coach-item.vue";
import headerData from "../components/header-data.vue";
export default {
  data() {
    return {
      activeIndex: 0,
      searchText: "",
      teamclassList: [],
      teamcoachList: []
    };
  },
  mounted() {
    setNavTab();
  },
  components: {
    staffCoachItem,
    headerData
  },
  methods: {
    search(e) {
      console.log(e);
    },
    changeTabbar(e) {
      this.activeIndex = e.mp.detail;
      if (e.mp.detail == 1) {
        wx.navigateTo({
          url: "../member/main"
        });
      }
      if (e.mp.detail == 2) {
        wx.redirectTo({
          url: "../workbench/main"
        });
      }
    },
    toNav(url) {
      wx.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.index {
  .list {
    background-color: #fff;
    .list-header {
      height: 44px;
      width: 100%;
      margin-top: 5px;
      padding-left: 10px;
      padding-right: 15px;
      text-align: center;
      box-sizing: border-box;
      .title {
        float: left;
        font-size: 16px;
        line-height: 44px;
      }
      .info {
        font-size: 14px;
        color: #505050;
        line-height: 44px;
      }
      .btn {
        float: right;
        font-size: 12px;
        line-height: 24px;
        margin-top: 10px;
        padding: 0 15px;
        color: #fff;
        background-color: #2a82e4;
        border-radius: 16px;
      }
    }
    .staff-coach-item {
      border-top: 1px solid #e5e5e5;
    }
    .see-more {
      border-top: 1px solid #e5e5e5;
      line-height: 36px;
      text-align: center;
      color: #2a82e4;
    }
  }
}
</style>
