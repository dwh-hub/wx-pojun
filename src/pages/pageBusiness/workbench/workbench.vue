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
          @search="searchChange"
          placeholder="请输入搜索内容"
        ></van-search>
      </div>
    </div>
    <!-- <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="demo-canvas"/> -->
    <div class="subtitle" v-if="noAuthLineView">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg">
      <span class="subtitle-text">经营分析</span>
    </div>
    <div class="line-view-wrapper" v-if="noAuthLineView">
      <ff-canvas id="line-view" canvas-id="line-view" :opts="opts"/>
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
    <div class="welcome-tip">欢迎您，{{name}}<open-data type="userNickName" v-if="!name"></open-data>!</div>
    <van-tabbar active="5" @change="changeTabbar">
      <van-tabbar-item icon="home-o">快捷</van-tabbar-item>
      <van-tabbar-item icon="question-o">帮助</van-tabbar-item>
      <!-- <van-tabbar-item icon="desktop-o">工作台</van-tabbar-item> -->
      <div class="index-tab">
        <img src="https://pojun-tech.cn/assets/img/loginlogo.png" alt="">
        <!-- <div class="text">工作台</div> -->
      </div>
      <van-tabbar-item icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { setNavTab, window, formatDate, HttpRequest } from "COMMON/js/common.js";
// import getauthList from "COMMON/js/authInto.config.js"
import colorMixin from "COMPS/colorMixin.vue"
import {getUseServiceList} from "../common/js/service_config.js"
import F2 from "../../../../static/f2-canvas/lib/f2";

export default {
  data() {
    return {
      activeIndex: 2,
      searchText: "",
      services: [],
      noAuthLineView: true,
      opts: {
        lazyLoad: true
      },
      name: ''
    };
  },
  mixins:[colorMixin],
  mounted() {
    setNavTab();
    this.services = getUseServiceList()
    this.getLineView()
    this.name = wx.getStorageSync('staff_info').userName

    // getauthList().then((data) => {
      // console.log(data)
    // })
  },
  onShow() {
    this.services = getUseServiceList()
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
      if (e.mp.detail == 2) {
        wx.redirectTo({
          url: "../staff_message/main"
        });
      }
      if (e.mp.detail == 3) {
        wx.redirectTo({
          url: "../staff_mine/main"
        });
      }
    },
    searchChange(e) {
      wx.navigateTo({
        url: '../customer/main?searchText=' + e.mp.detail
      })
    },
    getLineView() {
      let that = this;
      let now_time = new Date().getTime()
      HttpRequest({
        url: window.api + "/finance/statement/lineView",
        data: {
          timeStart: formatDate(new Date(now_time-(6*24*60*60*1000)), 'yyyy-MM-dd') + ' 00:00:00',
          timeEnd: formatDate(new Date(now_time), 'yyyy-MM-dd') + ' 23:59:59'
        },
        success(res) {
          if(res.data.code == 500) {
            return that.noAuthLineView = false
          }
          let data = res.data.data.map(e => {
            return {
              time: e.date,
              tem: e.cost
            };
          });
          that.$mp.page
            .selectComponent("#line-view")
            .init(that.initDataLine, data);
        }
      });
    },
    initDataLine(canvas, width, height, initData) {
      let data = []
      if (!initData.length) {
        data = [
          {
            time: formatDate(new Date(), "yyyy-MM-dd"),
            tem: ""
          }
        ];
      } else {
        data = initData;
      }
      let chart = new F2.Chart({
        el: canvas,
        width,
        height
      });

      let defs = {
        time: {
          type: "timeCat",
          mask: "MM-DD",
          range: [0, 1]
        },
        tem: {
          tickCount: 5,
          min: 0,
          alias: "元"
        }
      };
      chart.source(data, defs);
      chart.tooltip({
        showCrosshairs: true
      });
      chart
        .line()
        .position("time*tem")
        .shape("smooth");
      chart
        .point()
        .position("time*tem")
        .shape("smooth")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
    },
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
  .line-view-wrapper {
    box-sizing: border-box;
    height: 40vh;
    padding-right: 10px;
    background-color:#fff;
  }
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
  .index-tab {
    flex: 1;
    text-align: center;
    >img {
      display: block;
      width: 35px;
      height: 35px;
      margin: 0 auto;
      margin-top: 7px;
      border-radius: 50%;
    }
  }
  .welcome-tip {
    text-align: center;
    margin: 15px 0;
    color: #999;
  }
}
</style>
