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
          background="#fff"
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
    <div class="subtitle">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg">
      <span class="subtitle-text">常用服务</span>
    </div>
    <div class="common-services icon-wrapper">
      <div class="services-item icon-item" @click="toNav(item.navUrl)" v-for="(item,index) in services" :key="index">
        <image mode="aspectFit" :src="item.iconUrl"></image>
        <div class="services-icon icon-text">{{item.text}}</div>
      </div>
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
      // quickEnter: [
      //   {
      //     iconUrl: "/static/images/staff/card.svg",
      //     text: "购卡",
      //     navUrl: ""
      //   },
      //   {
      //     iconUrl: "/static/images/staff/add.svg",
      //     text: "添加客户",
      //     navUrl: ""
      //   },
      //   {
      //     iconUrl: "/static/images/staff/active.svg",
      //     text: "营销活动",
      //     navUrl: ""
      //   },
      //   {
      //     iconUrl: "/static/images/staff/check-in.svg",
      //     text: "入场签到",
      //     navUrl: ""
      //   }
      // ],
      services: [
        {
          iconUrl: "/static/images/staff/customer_icon_1.svg",
          text: "客户",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/services_icon_2.svg",
          text: "合同",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/coach_icon_1.svg",
          text: "私教",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/services_icon_4.svg",
          text: "团课排课",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/venue_icon_1.svg",
          text: "人事",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/sale_icon_1.svg",
          text: "销售crm",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/coach_icon_2.svg",
          text: "教练crm",
          navUrl: ""
        },{
          iconUrl: "/static/images/staff/services_icon_8.svg",
          text: "全部服务",
          navUrl: "../allServices/main"
        }]
    };
  },
  // components: {
  //   mpvueEcharts
  // },
  mounted() {
    setNavTab();
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
      this.activeIndex = e.mp.detail;
      if (e.mp.detail == 1) {
        wx.navigateTo({
          url: "../member/main"
        });
      }
      if (e.mp.detail == 0) {
        wx.redirectTo({
          url: "../index/main"
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

page {
  height: 100%;
  background-color: #f6f6f6;
}
.workbench {
  .subtitle {
    margin-top: 5px;
  }
}
</style>
