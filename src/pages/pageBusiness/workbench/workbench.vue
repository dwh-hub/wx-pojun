<template>
  <div class="workbench">
    <!-- <div class="top-quick" v-for="(item,index) in quickEnter" :key="index">
      <div class="quick">
        <image mode="aspectFit" :src="item.iconUrl"></image>
        <div class="quick-text">{{item.text}}</div>
      </div>
    </div>-->
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
    <!-- <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="demo-canvas"/> -->
    <div class="subtitle">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg">
      <span class="subtitle-text">经营分析</span>
    </div>
    <div class="subtitle" style="padding-bottom: 0px;">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg">
      <span class="subtitle-text">常用服务</span>
    </div>
    <div class="common-services icon-wrapper">
      <div class="services-item icon-item" @click="toNav(item.navUrl)" v-for="(item,index) in services" :key="index">
        <image mode="aspectFit" :src="item.iconUrl"></image>
        <div class="services-icon icon-text">{{item.text}}</div>
      </div>
    </div>
    <van-tabbar active="2" @change="changeTabbar">
      <van-tabbar-item icon="home-o">快捷</van-tabbar-item>
      <van-tabbar-item icon="question-o">帮助</van-tabbar-item>
      <van-tabbar-item icon="desktop-o">工作台</van-tabbar-item>
      <van-tabbar-item icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue"
import {getOpenServiceList} from "../common/js/service_config.js"
// import echarts from "echarts";
// import mpvueEcharts from "mpvue-echarts";

// let chart = null;

// function initChart(canvas, width, height) {
//   chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   });
//   canvas.setChart(chart);

//   var option = {}; // ECharts 配置项

//   chart.setOption(option);

//   return chart; // 返回 chart 后可以自动绑定触摸操作
// }

export default {
  data() {
    return {
      // echarts,
      // onInit: initChart,
      activeIndex: 2,
      searchText: "",
      services: []
    };
  },
  mixins:[colorMixin],
  // components: {
  //  mpvueEcharts
  // },
  mounted() {
    setNavTab();
    this.services = getOpenServiceList().slice(0,7)
    this.services.push({
      iconUrl: "/static/images/staff/workbench_icon/workbench_icon_4.svg",
      text: "全部服务",
      navUrl: "../allServices/main"
    })
  },
  methods: {
    toNav(url) {
      if(!url) {
        return
      }
      wx.navigateTo({
        url: url
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
      if (e.mp.detail == 3) {
        wx.redirectTo({
          url: "../staff_message/main"
        });
      }
      if (e.mp.detail == 4) {
        wx.redirectTo({
          url: "../staff_mine/main"
        });
      }
    },
    searchChange(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";

page {
  height: 100%;
  background-color: #f6f6f6;
}
.workbench {
  .subtitle {
    margin-top: 5px;
  }
  .icon-item {
    padding: 0;
    margin-top: 5px;
    >image {
      width: 50px;
      height: 50px;
    }
    .icon-text {
      margin-top: -12px; 
      font-size: 12px;
    }
  }
  .common-services {
    padding-bottom: 15px;
  }
}
</style>
