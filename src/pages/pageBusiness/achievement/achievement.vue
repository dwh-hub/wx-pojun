<template>
  <div class="achievement">
    <div class="subtitle">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg" />
      <span class="subtitle-text">销售员业绩</span>
    </div>
    <div class="header">
      <header-data :headerData="headerData"></header-data>
      <filter-nav :nav="nav" :hasTodetail="true" :toDetail="toDetail"></filter-nav>
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
  formatDate
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import { initLine } from "../common/js/http.js";

export default {
  data() {
    return {
      achievementTable: [],
      achievementForm: [],
      requestData: {
        // masterCardClassId: '',
        // secondCardClassId: '',
        // customerName: '',
        // storeId: '',
        transactUserId: wx.getStorageSync("userInfo").userId,
        timeStart: "2019-8-1 00:00:00",
        timeEnd: "2019-8-31 23:59:59",
        belongerId: wx.getStorageSync("userInfo").userId,
        isCoverage: 0
      },
      nav: [
        {
          navTitle: "所有业务",
          name: "业务类型",
          children: [
            {
              sonText: ""
            }
          ]
        },
        {
          navTitle: "所有销售",
          name: "销售/教练名",
          children: [
            {
              sonText: "无"
            }
          ]
        },
        {
          navTitle: "近七天",
          name: "时间",
          children: [
            {
              sonText: "今日",
              action: () => {
                this.filterDate(1);
              }
            },
            {
              sonText: "近七天",
              action: () => {
                this.filterDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate(30);
              }
            },
            {
              sonText: "上月",
              action: () => {}
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "业绩总额",
          dataNum: "0"
        },
        {
          dataText: "实际业绩总额",
          dataNum: "0"
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
        timeEnd: ""
      }
    };
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav
  },
  watch: {
    filter: {
      handler() {
        this.getAchievementTable()
        this.getAchievementChart();
      },
      deep: true
    }
  },
  mounted() {
    setNavTab();
    this.filterDate(7);
  },
  methods: {
    getAchievementTable() {
      let that = this;
      HttpRequest({
        url: "/performance/card/pagestotal",
        data: that.requestData,
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
      wx.navigateTo({
        url: "../achievement_list/main"
      });
    },
    getAchievementChart() {
      let that = this;
      HttpRequest({
        url: "/performance/card/pagestotal/day",
        data: {
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd
        },
        success(res) {
          let isIOS = wx.getSystemInfoSync().system.indexOf("iOS") > -1;
          let data = JSON.parse(res.data.data);
          data.sort(that.sortUpDate)
          let chartData = data.map(e => {
            return {
              time: isIOS ? e.date.replace(/-/g, "/") : e.date,
              tem: e.proportionPrice
            };
          });
          that.$mp.page.selectComponent("#achievement-line").init(initLine, chartData);
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
      this.setDate(data)
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj)
    },
    setDate(obj) {
      this.filter.timeStart = obj.startTime;
      this.filter.timeEnd = obj.endTime;
    },
    filterDateMethod(day) {
      let obj = {
        startTime: "",
        endTime: ""
      };
      if (!day) {
        return obj;
      }
      let date = new Date();
      const DAY = 24 * 60 * 60 * 1000;
      const HOUR8 = 8 * 60 * 60 * 1000;
      let nowStamp = date.getTime();
      let today = date.getDate() - 1;
      let weekday = date.getDay() - 1;
      if (day == 1) {
        obj.startTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8),
          "yyyy-MM-dd hh:mm:ss"
        );
        obj.endTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY + DAY - HOUR8 - 1),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (day == 7) {
        obj.startTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - weekday * DAY),
          "yyyy-MM-dd hh:mm:ss"
        );
        obj.endTime = formatDate(
          new Date(
            parseInt(nowStamp / DAY) * DAY - HOUR8 + (7 - weekday) * DAY - 1
          ),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (day == 30) {
        obj.startTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - today * DAY),
          "yyyy-MM-dd hh:mm:ss"
        );
        obj.endTime = formatDate(
          new Date(
            parseInt(nowStamp / DAY) * DAY - HOUR8 + (30 - today) * DAY - 1
          ),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      return obj;
    },
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
    box-sizing: border-box;
    height: 40vh;
    padding-right: 10px;
    background-color: #fff;
  }
}
</style>