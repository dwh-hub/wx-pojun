<template>
  <div class="achievement">
    <!-- <div class="subtitle">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg" />
      <span class="subtitle-text">销售员业绩</span>
    </div>-->
    <div class="header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :isCoverView="true"
        :search="searchChange"
        :isOverlap="true"
        @selectStore="selectStore"
      ></header-search>
      <header-data :isOverlap="true" :headerData="headerData"></header-data>
      <filter-nav :nav="nav" :isCoverView="true" :hasTodetail="true" :toDetail="toDetail"></filter-nav>
    </div>

    <div class="line-view-wrapper">
      <ff-canvas id="achievement-line" canvas-id="achievement-line" :opts="opts" />
    </div>

    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="isPickerShow = false"
      @setPickerTime="setPickerTime"
    ></timePicker>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  filterDateMethod
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import colorMixin from "COMPS/colorMixin.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import { initLine, getUserofrole } from "../common/js/http.js";
import achieveData from "../common/js/achievement.js";

export default {
  data() {
    return {
      achievementTable: [],
      achievementForm: [],
      // requestData: {
      //   // masterCardClassId: '',
      //   // secondCardClassId: '',
      //   // customerName: '',
      //   storeId: '',
      //   transactUserId: wx.getStorageSync("userInfo").userId,
      //   timeStart: "2019-8-1 00:00:00",
      //   timeEnd: "2019-8-31 23:59:59",
      //   belongerId: wx.getStorageSync("userInfo").userId,
      //   isCoverage: 0
      // },
      nav: [
        {
          navTitle: "所有业务",
          name: "业务类型",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filter.purchasePattern = "";
              }
            },
            {
              sonText: "新购",
              action: () => {
                this.filter.purchasePattern = 1;
              }
            },
            {
              sonText: "转卡",
              action: () => {
                this.filter.purchasePattern = 2;
              }
            },
            {
              sonText: "请假",
              action: () => {
                this.filter.purchasePattern = 3;
              }
            },
            {
              sonText: "转让",
              action: () => {
                this.filter.purchasePattern = 4;
              }
            },
            {
              sonText: "补办",
              action: () => {
                this.filter.purchasePattern = 5;
              }
            },
            {
              sonText: "补余",
              action: () => {
                this.filter.purchasePattern = 6;
              }
            },
            {
              sonText: "订金",
              action: () => {
                this.filter.purchasePattern = 7;
              }
            },
            {
              sonText: "退款",
              action: () => {
                this.filter.purchasePattern = 8;
              }
            },
            {
              sonText: "手牌遗失",
              action: () => {
                this.filter.purchasePattern = 9;
              }
            },
            {
              sonText: "手牌损坏",
              action: () => {
                this.filter.purchasePattern = 10;
              }
            },
            {
              sonText: "手牌租用",
              action: () => {
                this.filter.purchasePattern = 11;
              }
            }
          ]
        },
        {
          navTitle: "业绩归属人",
          name: "业绩归属人",
          children: []
        },
        {
          navTitle: "本月",
          name: "办理日期",
          children: [
            {
              sonText: "今日",
              action: () => {
                this.filterDate('day');
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterDate('week');
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate('month');
              }
            },
            {
              sonText: "上月",
              action: () => {
                this.filterDate('lastMonth');
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "业绩总额",
          dataNum: "0",
          color: "#ffae08"
        },
        {
          dataText: "实际业绩总额",
          dataNum: "0",
          color: "#14c88b "
        }
      ],
      pickerConfig: {
        endDate: true,
        column: "day",
        dateLimit: true,
        initStartTime: "2019-01-01",
        initEndTime: "2019-12-01",
        limitStartTime: "2015-05-06",
        limitEndTime: "2055-05-06"
      },
      isPickerShow: false,
      opts: {
        lazyLoad: true
      },
      filter: {
        timeStart: "",
        timeEnd: "",
        purchasePattern: "",
        belongerId: "",
        belongerName: ""
      },
      storeList: [],
      selectedStore: {}
    };
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    headerSearch
  },
  watch: {
    filter: {
      handler(val) {
        this.refreshData();
      },
      deep: true
    }
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this.nav[2].navTitle = "本月"
    this.filterDate('month');
    this.refreshData();
  },
  methods: {
    searchChange(event) {
      this.filter.belongerName = event;
    },
    selectStore(item) {
      if (!item.storeId) {
        this.filter.belongerId = ''
        this.nav[1].navTitle = '全部'
      }
      this.selectedStore = item;
      this.refreshData();
    },
    refreshData() {
      this.getAchievementTable();
      this.getAchievementChart();
      this._getUserofrole();
    },
    getAchievementTable() {
      let that = this;
      let _data = Object.assign(
        {},
        that.filter,
        {
          isCoverage: 0,
          storeId: that.selectedStore.storeId,
          transactUserId: that.filter.belongerId
        }
      );
      HttpRequest({
        url: "/performance/card/pagestotal",
        data: _data,
        success(res) {
          if (res.data.code == 200) {
            let sum = 0;
            res.data.data.forEach(e => {
              sum += e.cost;
            });
            that.headerData[0].dataNum = sum;
            that.headerData[1].dataNum = sum;
          }
        }
      });
    },
    toDetail() {
      achieveData.nav = this.nav
      achieveData.filter = this.filter
      wx.navigateTo({
        url: "../achievement_list/main"
      });
    },
    getAchievementChart() {
      let that = this;
      that.filter.storeId = that.selectedStore.storeId;
      HttpRequest({
        url: "/performance/card/pagestotal/day",
        data: that.filter,
        success(res) {
          let isIOS = wx.getSystemInfoSync().system.indexOf("iOS") > -1;
          let data = JSON.parse(res.data.data);
          data.sort(that.sortUpDate);
          let chartData = data.map(e => {
            return {
              time: isIOS ? e.date.replace(/-/g, "/") : e.date,
              tem: e.proportionPrice
            };
          });
          that.$mp.page
            .selectComponent("#achievement-line")
            .init(initLine, chartData);
        }
      });
    },
    sortUpDate(a, b) {
      return Date.parse(a.date) - Date.parse(b.date);
    },
    setPickerTime(val) {
      let data = val.mp.detail;
      let date = data.endTime.split(" ")[0];
      data.endTime = date + " 23:59:59";
      this.setDate(data);
    },
    filterDate(day) {
      let obj = filterDateMethod(day);
      this.setDate(obj);
      // this.refreshData();
    },
    setDate(obj) {
      this.filter.timeStart = obj.startTime;
      this.filter.timeEnd = obj.endTime;
    },
    _getUserofrole() {
      getUserofrole(this.selectedStore.storeId, 0).then(data => {
        let list = data.map(e => {
          return {
            sonText: e.userName,
            // name: e.userName,
            // id: e.userId,
            // sex: e.sex,
            // cover: e.headImgPath,
            action: () => {
              this.filter.belongerId = e.userId;
            }
          };
        });
        this.nav[1].children = [
          {
            sonText: "全部",
            action: () => {
              this.filter.belongerId = "";
            }
          }
        ].concat(list);
      });
    }
    // getAchievementForm() {
    //   let that = this;
    //   HttpRequest({
    //     url: "/performance/card/pages",
    //     data: that.requestData,
    //     success(res) {
    //       if (res.data.code == 200 && res.data.data.length) {
    //         let _data;
    //         _data = res.data.data.map(e => {
    //         });
    //         if (that.page == 1) {
    //           that.achievementForm = _data;
    //         } else {
    //           that.achievementForm = that.achievementForm.concat(_data);
    //         }
    //         that.page++;
    //       }
    //     }
    //   });
    // }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
@import "../common/less/staff_common.less";
.achievement {
  .line-view-wrapper {
    margin-top: 15px;
    box-sizing: border-box;
    height: 40vh;
    padding-right: 10px;
    background-color: #fff;
  }
  .filter-nav {
    .mask {
      top: 178px;
    }
  }
}
</style>