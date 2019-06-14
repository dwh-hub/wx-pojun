<template>
  <div class="satff_team_class">
    <header-search
      :storeList="storeList"
      :color="themeColor"
      :search="searchChange"
      @selectStore="selectStore"
    ></header-search>
    <header-data :headerData="headerData"></header-data>
    <filter-nav :nav="nav"></filter-nav>
    <div class="class-list">
      <team-class-item
        :info="item"
        :isToDetail="false"
        v-for="(item, index) in classList"
        @clickClass="selectClass(item)"
        :key="index"
      ></team-class-item>
    </div>
    <van-loading :color="themeColor" v-if="isLoading"/>
    <none-result text="暂无课程" v-if="!classList.length && !isLoading"></none-result>

    <van-popup
      :show="showOperatePopup"
      @close="showOperatePopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="operate-list">
        <div
          class="operate-item"
          v-for="(item, index) in actionList"
          :key="index"
          @click="item.action"
        >{{item.text}}</div>
      </div>
    </van-popup>

    <!-- <suspension-window v-if="!isOperate" :operateList="operateList"></suspension-window> -->
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
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
// import staffCoachItem from "../components/staff-coach-item.vue";
// import suspensionWindow from "../components/suspension-window.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import colorMixin from "COMPS/colorMixin.vue";
import noneResult from "COMPS/noneResult.vue";
export default {
  data() {
    return {
      nav: [
        {
          navTitle: "今日",
          children: [
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
            }
          ]
        },
        {
          navTitle: "筛选条件二",
          children: [
            {
              sonText: "全部"
            }
          ]
        },
        {
          navTitle: "筛选条件三",
          children: [
            {
              sonText: "全部"
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
          iconUrl: "/static/images/staff/close.svg",
          action: () => {}
        },
        {
          text: "批量排期",
          iconUrl: "/static/images/staff/calendar.svg",
          action: () => {
            console.log("批量排期");
          }
        }
      ],
      storeList: [],
      actionList: [
        {
          text: "查看详情",
          action: () => {
            this.showOperatePopup = false;
            wx.navigateTo({
              url:
                "../scheduling_detail/main?teamScheduleId=" +
                this.selectedClass.teamScheduleId
            });
          }
        },
        {
          text: "单日排期",
          action: () => {
            this.toScheduling('single');
          }
        },
        {
          text: "批量排期",
          action: () => {
            this.toScheduling('batch');
          }
        }
      ],
      selectedStore: {},
      selectedClass: {},
      showOperatePopup: false,
      isLoading: true,
      isOperate: false,
      classList: [{}, {}, {}, {}],
      page: 1,
      filter: {}
    };
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    // this.getClassList();
    this.filterDate(1);
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    // staffCoachItem,
    teamClassItem,
    headerSearch,
    noneResult
    // suspensionWindow
  },
  onReachBottom() {
    this.getClassList();
  },
  methods: {
    selectStore(item) {
      this.selectedStore = item;
      this.page = 1;
      this.getClassList();
    },
    getClassList() {
      this.isLoading = true;
      let that = this;
      var _data = Object.assign(
        {},
        {
          pageNo: that.page,
          page: that.page
        },
        that.filter
      );
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/pages",
        data: _data,
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            let _res = res.data.data;
            let _data;
            if (!_res.result.length && that.page == 1) {
              return (that.classList = []);
            }
            that.page++;
            // if (that.headerData[0].dataNum == "0") {
              that.headerData[0].dataNum = _res.recCount;
            // }
            _data = res.data.data.result.map(e => {
              // TODO:
              // if (!e.masterImg) {
              e.masterImg = "/assets/img/morenImg.png";
              // }
              return e;
            });
            if (that.page == 2 || that.page == 1) {
              that.classList = _data;
            } else {
              that.classList = that.classList.concat(_data);
            }
          } else {
            that.classList = [];
          }
        }
      });
    },
    searchChange(event) {
      this.filter.namePhone = event;
      this.page = 1;
    },
    filterDate(day) {
      if (!day || day == 0) {
        this.filter.calendarEnd = "";
        this.filter.calendarStart = "";
      } else {
        const DAY = 24 * 60 * 60 * 1000;
        let stamp = new Date().getTime();
        let endTime = formatDate(new Date(stamp), "yyyy-MM-dd") + " 23:59:59";
        let startTime =
          formatDate(new Date(stamp - DAY * day), "yyyy-MM-dd") + " 23:59:59";
        this.filter.calendarStart = startTime;
        this.filter.calendarEnd = endTime;
      }
      this.page = 1;
      this.getClassList();
    },
    selectClass(item) {
      this.showOperatePopup = true;
      this.selectedClass = item;
    },
    toScheduling(type) {
      this.showOperatePopup = false;
      wx.navigateTo({
        url:
          `../team_class_scheduling/main?teamTempStoreId=${this.selectedClass.teamTempStoreId}&storeId=${this.selectedClass.storeId}&type=${type}`
      });
    }
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
    margin-top: 5px;
    margin-bottom: 1px;
    .mask {
      top: 165px;
    }
  }
  .team-class-item {
    padding: 10px 0;
    padding-left: 10px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  .team-class-item-y {
    box-shadow: none;
  }
  .staff-coach-item {
    border-bottom: 1rpx solid #eee;
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
}
</style>
