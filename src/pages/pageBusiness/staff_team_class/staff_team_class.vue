<template>
  <div class="satff_team_class">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav :nav="nav"></filter-nav>
    </div>
    <div class="class-list">
      <team-class-item
        :info="item"
        :isToDetail="false"
        v-for="(item, index) in list"
        @clickClass="selectClass(item)"
        :key="index"
      ></team-class-item>
    </div>
    <van-loading :color="themeColor" v-if="isLoading" />
    <none-result text="暂无课程" v-if="!list.length && !isLoading"></none-result>
    <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>

    <!-- <van-popup
      :show="showOperatePopup"
      @close="showOperatePopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="operate-list">
        <div
          class="operate-item"
          :class="{hidden: !item.hasAuth}"
          v-for="(item, index) in actionList"
          :key="index"
          @click="item.action"
        >{{item.text}}</div>
      </div>
    </van-popup> -->
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime"
    ></timePicker>
    <suspension-window v-if="!isOperate" :operateList="operateList"></suspension-window>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import { checkAuth } from "../common/js/service_config.js";
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import suspensionWindow from "../components/suspension-window.vue";
export default {
  data() {
    return {
      nav: [
        {
          navTitle: "今日",
          children: [
            {
              sonText: "全部",
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
              action: () => {
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "筛选条件二",
          children: [
            {
              sonText: "无"
            }
          ]
        },
        {
          navTitle: "筛选条件三",
          children: [
            {
              sonText: "无"
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "课程数",
          dataNum: "0"
        },
        {
          dataText: "数据二",
          dataNum: "0"
        },
        {
          dataText: "数据三",
          dataNum: "0"
        }
      ],
      operateList: [
        {
          text: "单日排期",
          iconUrl: "/static/images/staff/single_calendar.svg",
          hasAuth: true,
          action: () => {
            wx.navigateTo({
              url: "../staff_team_class_kind/main?type=single"
            });}
        },
        {
          text: "批量排期",
          iconUrl: "/static/images/staff/calendar.svg",
          hasAuth: true,
          action: () => {
            wx.navigateTo({
              url: "../staff_team_class_kind/main?type=batch"
            });}
        }
      ],
      storeList: [],
      isLoading: false,
      // actionList: [
      //   {
      //     text: "查看详情",
      //     hasAuth: true,
      //     action: () => {
      //       this.showOperatePopup = false;
      //       wx.navigateTo({
      //         url:
      //           "../scheduling_detail/main?teamScheduleId=" +
      //           this.selectedClass.teamScheduleId
      //       });
      //     }
      //   },
      //   {
      //     text: "单日排期",
      //     hasAuth: checkAuth(292),
      //     action: () => {
      //     }
      //   },
      //   {
      //     text: "批量排期",
      //     hasAuth: checkAuth(292),
      //     action: () => {
      //     }
      //   }
      // ],
      selectedStore: {},
      selectedClass: {},
      showOperatePopup: false,
      isOperate: false,
      filter: {
        namePhone: "",
        calendarStart: "",
        calendarEnd: ""
      }
    };
  },
  mounted() {
    this.nav[0].navTitle = "今日";
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.filterDate(1);
  },
  onShow() {
    if (this.selectedStore.storeId) {
      this.refreshList(1);
    }
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    headerData,
    filterNav,
    teamClassItem,
    headerSearch,
    noneResult,
    suspensionWindow
  },
  methods: {
    selectStore(item) {
      this.selectedStore = item;
      this.refreshList();
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            pageNo: that.page,
            page: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: window.api + "/teamClass/teamSchedule/pages",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              return (that.list = []);
            }
            let _res = res.data.data;
            let _data;
            that.headerData[0].dataNum = _res.recCount || 0;
            res.data.data.result.forEach(e => {
              if (!e.masterImg) {
                e.masterImg = "/assets/img/morenImg.png";
              }
            });
            resolve(res.data.data.result);
          }
        });
      });
    },
    searchChange(event) {
      this.filter.namePhone = event;
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.calendarStart = obj.startTime;
      this.filter.calendarEnd = obj.endTime;
    },
    selectClass(item) {
      this.showOperatePopup = false;
      wx.navigateTo({
        url:
          "../scheduling_detail/main?teamScheduleId=" +
          item.teamScheduleId
      });
      // this.showOperatePopup = true;
      // this.selectedClass = item;
    },
    // toScheduling(type) {
    //   this.showOperatePopup = false;
    //   wx.navigateTo({
    //     url: `../team_class_scheduling/main?teamTempStoreId=${
    //       this.selectedClass.teamTempStoreId
    //     }&storeId=${this.selectedClass.storeId}&type=${type}`
    //   });
    // }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.satff_team_class {
  .filter-nav {
    .mask {
      top: 165px;
    }
  }
  .team-class-item {
    padding: 10px 0;
    padding-left: 10px;
    border-top: 1px solid #eee;
    background-color: #fff;
  }
  .team-class-item-y {
    box-shadow: none;
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    .icon-right {
      line-height: 60px;
    }
  }
  .operate-list {
    max-height: 50vh;
    .operate-item {
      border-top: 1rpx solid #eee;
      line-height: 48px;
      text-align: center;
    }
  }
  .hidden {
    display: none;
  }
}
</style>
