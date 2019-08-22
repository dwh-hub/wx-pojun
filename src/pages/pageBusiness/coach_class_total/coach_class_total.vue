<template>
  <div class="coach-class-total">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>
    
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
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
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import noneResult from "COMPS/noneResult.vue";

export default {
  data() {
    return {
      nav: [
        {
          navTitle: "上课日期",
          name: "上课日期",
          children: [
            {
              sonText: "全部(上课日期)",
              action: () => {
                this.filterDate(0);
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterDate(1);
              }
            },
            {
              sonText: "本周",
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
              sonText: "自定义",
              isDiyDate: true,
              action: () => {
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "上课教练",
          name: "上课教练",
          children: []
        },
        {
          navTitle: "卡类型",
          name: "卡类型",
          children: [
          ]
        },
        {
          navTitle: "服务项目",
          name: "服务项目",
          children: [
          ]
        }
      ],
      headerData: [
        {
          dataText: "上课人数",
          dataNum: "0"
        },
        {
          dataText: "上课数量",
          dataNum: "0"
        },
        {
          dataText: "上课总额",
          dataNum: "0"
        }
      ],
      filter: {
        coachName: "",
        calendarStart: "",
        calendarEnd: ""
      },
      classMap: [],
      projectMap: [],
      userMap: []
    };
  },
  onLoad(options) {},
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  mounted() {
    setNavTab();
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    headerSearch,
    noneResult
  },
  methods: {
    loadData() {
      let that = this
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
      })
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj)
    },
    setDate(obj) {
      this.filter.calendarStart = obj.startTime;
      this.filter.calendarEnd = obj.endTime;
    },
  }
};
</script>

<style lang="less">
</style>
