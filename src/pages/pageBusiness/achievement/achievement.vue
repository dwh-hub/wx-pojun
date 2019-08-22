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

              }
            },
            {
              sonText: "近七天",
              action: () => {

              }
            },
            {
              sonText: "本月",
              action: () => {

              }
            },
            {
              sonText: "上月",
              action: () => {

              }
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
      ]
    };
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav
  },
  mounted() {
    setNavTab();
    this.getAchievementTable()
  },
  methods: {
    getAchievementTable() {
      let that = this;
      HttpRequest({
        url: "/performance/card/pagestotal",
        data: that.requestData,
        success(res) {
          if (res.data.code == 200) {
            let sum = 0
            res.data.data.forEach((e) => {
              sum += e.cost
            })
            that.headerData[0].dataNum = sum
            that.headerData[1].dataNum = sum
          }
        }
      });
    },
    toDetail() {
      wx.navigateTo({
        url: '../achievement_list/main'
      })
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
}
</style>