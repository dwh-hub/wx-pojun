<template>
  <div class="workbench">
    <div class="header-search list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :isCoverView="true"
        :enterSearch="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <!-- <div class="search-wrapper">
        <van-search
          :value="searchText"
          :background="themeColor"
          @search="searchChange"
          placeholder="请输入搜索内容"
        ></van-search>
      </div> -->
    </div>
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
      <span class="edit-service" @click="editService">编辑</span>
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
        <img :src="window.api + companyInfo.logimage" alt="">
        <!-- <img src="https://pojun-tech.cn/assets/img/loginlogo.png" alt=""> -->
        <!-- <div class="text">工作台</div> -->
      </div>
      <van-tabbar-item icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { setNavTab, window, formatDate, HttpRequest } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue"
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import { getUseServiceList, initLine } from "../common/js/http.js";
import { serviceList, filterAuth } from "../common/js/service_config.js";
// import F2 from '@antv/wx-f2';

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
      name: '',
      storeList: [],
      selectedStore: {},
      companyInfo: {}
    };
  },
  components: {
    headerSearch
  },
  mixins:[colorMixin],
  computed: {
    window() {
      return window
    }
  },
  mounted() {
    setNavTab();
    this.getCompanyInfo()
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0];
    this.getLineView()
    this.name = wx.getStorageSync('staff_info') ? wx.getStorageSync('staff_info').userName : ''
  },
  onShow() {
    filterAuth()
    getUseServiceList().then((data) => {
      if(!data.length) {
        data = serviceList.slice(0,7)
      }
      data.push({
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_4.svg",
        text: "全部服务",
        navUrl: "../allServices/main"
      })
      this.services = data
    })
  },
  methods: {
    getCompanyInfo() {
      let that = this;
      HttpRequest({
        url: window.api + "/system/set/wxcompanyinfo",
        data: {
          companyId: wx.getStorageSync("companyId") || ''
        },
        success(res) {
          that.companyInfo = JSON.parse(res.data.data.baseInfo);
        }
      });
    },
    toNav(url) {
      if(!url) {
        return
      }
      wx.navigateTo({
        url: url
      });
    },
    // 更改默认门店
    selectStore(item) {
      this.storeList.forEach(e => {
        if (e.storeId == item.storeId) {
          e.isDefault = true
        } else {
          e.isDefault = false
        }
      })
      store.commit("saveAllStore", this.storeList);
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
      let store = JSON.stringify(this.selectedStore)
      wx.navigateTo({
        url: `../customer/main?searchText=${e.mp.detail.value}&store=${store}`
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
          that.noAuthLineView = true
          let isIOS = wx.getSystemInfoSync().system.indexOf("iOS") > -1
          let data = res.data.data.map(e => {
            return {
              time: isIOS ? ("2019/"+e.date.replace(/-/g, "/")) : e.date,
              tem: e.cost
            };
          });
          that.$mp.page
            .selectComponent("#line-view")
            .init(initLine, data);
        }
      });
    },
    // initDataLine(canvas, width, height, initData) {
    //   let data = []
    //   if (!initData.length) {
    //     data = [
    //       {
    //         time: formatDate(new Date(), "yyyy-MM-dd"),
    //         tem: ""
    //       }
    //     ];
    //   } else {
    //     data = initData;
    //   }
    //   let chart = new F2.Chart({
    //     el: canvas,
    //     width,
    //     height
    //   });

    //   let defs = {
    //     time: {
    //       type: "timeCat",
    //       mask: "MM-DD",
    //       range: [0, 1]
    //     },
    //     tem: {
    //       tickCount: 5,
    //       min: 0,
    //       alias: "元"
    //     }
    //   };
    //   chart.source(data, defs);
    //   // chart.tooltip({
    //   //   showXTip: true,
    //   //   onChange(e) {
    //   //     console.log(e)
    //   //   },
    //   //   onShow(ev) {
    //   //     console.log(ev)
    //   //     const { items } = ev;
    //   //     // items[0].name = null;
    //   //     // items[0].name = items[0].title;
    //   //     // items[0].value = '¥ ' + items[0].value;
    //   //   }
    //   // });
    //   chart.tooltip({
    //     custom: true,
    //     showXTip: true,
    //     showYTip: true,
    //     showCrosshairs: true,
    //     snap: true,
    //     crosshairsType: 'xy',
    //     crosshairsStyle: {
    //       lineDash: [2]
    //     }
    //   });

    //   chart
    //     .line()
    //     .position("time*tem")
    //     .shape("smooth");
    //   chart
    //     .point()
    //     .position("time*tem")
    //     .shape("smooth")
    //     .style({
    //       stroke: "#fff",
    //       lineWidth: 1
    //     });
    //   chart.render();
    // },
    editService() {
      wx.navigateTo({
        url: '../allServices/main?type=edit'
      })
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
  padding-bottom: 60px;
  .header-search {
    width: 100%;
  }
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
  .subtitle {
    .edit-service {
      float: right;
      margin-top:-4px;
      margin-right: 5px;
      padding:2px 10px;
      border-radius:3px;
      color:#fff;
      background-color:#01c8d1;
    }
  }
}
</style>
