<template>
  <div class="satff_team_class">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        placeholder="请输入团课名称查询"
        :isOverlap="true"
        @selectStore="selectStore"
      ></header-search>
      <header-data :isOverlap="true" :headerData="headerData"></header-data>
      <filter-nav :nav="nav" @submitFilter="getFilter" :hasMoreFilter="true" :moreFilterList="moreFilter"></filter-nav>
    </div>
    <div class="class-list common-list">
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
      @setPickerTime="setPickerTime(...arguments, 0, 4)"
    ></timePicker>
    <suspension v-if="!isOperate" :operateList="operateList"></suspension>
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
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import suspension from "../components/suspension.vue";
import { getUserofrole } from "../common/js/http"
export default {
  data() {
    return {
      nav: [
        {
          navTitle: "今日",
          name: "课程时间",
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
          navTitle: "课程状态",
          name: "课程状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filter.scheduleldStatus = ""
              }
            },
            {
              sonText: "已上课",
              action: () => {
                this.filter.scheduleldStatus = 1
              }
            },{
              sonText: "未上课",
              action: () => {
                this.filter.scheduleldStatus = 0
              }
            }
          ]
        },
        {
          navTitle: "场馆",
          name: "场馆",
          children: [
            {
              sonText: "全部场馆"
            }
          ]
        }
      ],
      moreFilter: [
        {
          name: "是否需要预约",
          isRadio: true,
          isParmas: false,
          isTimer: false,
          param: "isNeedAppoint",
          value: "",
          children: [
            {
              name: "需要预约",
              value: "1,2"
            },
            {
              name: "无需预约",
              value: "0"
            }
          ]
        },
        {
          name: "上课教练",
          // type: 3,
          isShowAll: false,
          isRadio: false,
          isParmas: false,
          isTimer: false,
          param: "coachId",
          value: "",
          children: []
        }
      ],
      headerData: [
        {
          dataText: "课程数",
          dataNum: "0"
        },
        {
          dataText: "已开课",
          dataNum: "0"
        },
        {
          dataText: "未开课",
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
      selectedClass: {},
      showOperatePopup: false,
      isOperate: false,
      filter: {
        namePhone: "",
        anotherName: "",
        calendarStart: "",
        calendarEnd: "",
        scheduleldStatus: "",
        venueId: ''
      }
    };
  },
  mounted() {
    this.nav[0].navTitle = "今日";
    this.getVenueList()
    this.filterDate(1);
    getUserofrole(this.selectedStore.storeId, 1).then((data) => {
      this.moreFilter[1].children = data.map(e => {
        return {
          name: e.userName,
          value: e.userId
        }
      })
    })
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
    suspension
  },
  methods: {
    selectStore(item) {
      this.selectedStore = item;
      this.getVenueList()
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
          url: '/teamClass/teamSchedule/static/count',
          data: _data,
          success(res) {            
            that.headerData[1].dataNum = res.data.data.classedCount
            that.headerData[2].dataNum = res.data.data.disClassCount
          }
        })
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
      this.filter.anotherName = event;
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
    getVenueList() {
      let that = this
      HttpRequest({
        url: '/venue/name/list',
        data: {
          storeId: that.selectedStore.storeId
        },
        success(res) {
          let venueList = res.data.data.map(e => {
            e.sonText = e.venueName
            e.action = () => {
              that.filter.venueId = e.venueId
            }
            return e
          })
          that.nav[2].children = [{
              sonText: "全部场馆",
              action: () => {
                that.filter.venueId = ""
              }
            }].concat(venueList)
        }
      })
    }
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
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color:  @pageColor;
}
.satff_team_class {
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
  .hidden {
    display: none;
  }
}
</style>
