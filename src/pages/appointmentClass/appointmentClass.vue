<template>
  <div class="appointmentClass">
    <div class="nav-tab">
      <div class="stay" @click="selectNav(1)" v-show="currentNav!=1">待上课</div>
      <!-- :class="{active: currentNav==1}" -->
      <div
        class="stay"
        :style="{'color': themeColor}"
        @click="selectNav(1)"
        v-show="currentNav==1"
      >待上课</div>
      <div class="assess" @click="selectNav(2)" v-show="currentNav!=2">待评价</div>
      <!-- :class="{active: currentNav==2}" -->
      <div
        class="assess"
        :style="{'color': themeColor}"
        @click="selectNav(2)"
        v-show="currentNav==2"
      >待评价</div>
      <div class="complete" @click="selectNav(3)" v-show="currentNav!=3">已评价</div>
      <!-- :class="{active: currentNav==3}" -->
      <div
        class="complete"
        :style="{'color': themeColor}"
        @click="selectNav(3)"
        v-show="currentNav==3"
      >已评价</div>
    </div>
    <div class="stay-list" v-if="!(!teamClassList.length && !coachList.length)">
      <div class="stay-team-class">
        <title-cell title="团课" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllList(1)"></title-cell>
        <div class="team-class-wrapper">
          <team-class-item
            @clickClass="toClassDetail(item)"
            :info="item"
            :isToDetail="false"
            v-for="(item, index) in teamClassList"
            :key="index"
            :isTag="true"
          ></team-class-item>
        </div>
        <none-result text="你还没有预约团课呢" v-if="!teamClassList.length"></none-result>
      </div>
      <div class="stay-coach">
        <title-cell
          title="私教课"
          moreText="全部"
          :moreSize="14"
          :titleSize="16"
          @tapMore="toAllList(2)"
        ></title-cell>
        <div class="coach-wrapper">
          <!-- <coach-item
            @clickCoach="toCoachDetail(item)"
            :info="item"
            :hasBtn="false"
            :isToDetail="false"
            v-for="(item, index) in coachList"
            :key="index"
          ></coach-item>-->
          <team-class-item
            @clickClass="toCoachDetail(item)"
            :info="item"
            :isToDetail="false"
            v-for="(item, index) in coachList"
            :key="index"
            :isTag="true"
          ></team-class-item>
        </div>
        <none-result text="你还没有预约私教呢" v-if="!coachList.length"></none-result>
      </div>
    </div>
    <van-action-sheet
      :show="showSelect"
      :actions="actions"
      :safe-area-inset-bottom="false"
      @close="closeSelect"
      @select="selectCur"
    ></van-action-sheet>
    <none-result
      text="你还没有准备好吗"
      buttonText="试试预约"
      @tapBtn="toggleSelect"
      v-if="!teamClassList.length && !coachList.length"
    ></none-result>
    <div
      class="bottom-btn"
      :style="{'background-color': themeColor}"
      v-if="isBottomAppoint"
      @click="toggleSelect"
    >继续预约</div>
    <page-footer v-if="teamClassList.length || coachList.length"></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import noneResult from "COMPS/noneResult.vue";
import titleCell from "COMPS/titleCell.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import pageFooter from "COMPS/pageFooter.vue";
import colorMixin from "COMPS/colorMixin.vue";

export default {
  data() {
    return {
      // 1 待上课 2 待评价 3 已完成
      currentNav: 1,
      showSelect: false,
      // 当前显示的团课，私教列表
      teamClassList: [{}, {}],
      coachList: [{}, {}],
      // 储存数据 私教 1 待上课 2 待评价 3 已完成
      coachList_3: [],
      coachList_2: [],
      coachList_1: [],
      // 团课 1 待上课 2 待评价 3 已完成
      teamClass_1: [],
      teamClass_3: [],
      teamClass_2: [],
      // classId: "",
      // 当前登录用户的id
      customerId: "",
      actions: [{ name: "团课" }, { name: "私教" }]
    };
  },
  mixins: [colorMixin],
  components: {
    noneResult,
    titleCell,
    teamClassItem,
    pageFooter
  },
  onLoad(options) {
    if (options.nav) {
      this.currentNav = options.nav;
    }
  },
  onShow() {
    this._onLoad();
  },
  onPullDownRefresh() {
    this.selectNav(this.currentNav);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  computed: {
    // btnText() {
    //   if (!this.teamClassList.length && !this.coachList.length) {
    //     return "试试预约";
    //   }
    //   return "";
    // },
    isBottomAppoint() {
      // if (this.teamClassList.length || this.coachList.length) {
      //   if (!this.teamClassList[0].teamScheduleId || !this.coachList[0].coachAppointId) {
      //     return false;
      //   }
      //   return true;
      // }
      if (this.teamClassList.length) {
        if (!this.teamClassList[0].teamScheduleId) {
          return false;
        }
        return true;
      }
      
      if (this.coachList.length) {
        if (!this.coachList[0].coachAppointId) {
          return false;
        }
        return true;
      }

      return false;
    }
  },
  methods: {
    _onLoad() {
      // 进页面前先清空数据
      // this.clearData();
      // setTimeout(() =>{
      this.customerId = wx.getStorageSync("userInfo").id;
      setNavTab();
      this.selectNav(this.currentNav, false);
      // },500)
    },
    clearData() {
      this.showSelect = false;
      this.teamClassList = [{}, {}];
      this.coachList = [{}, {}];
      this.coachList_3 = [{}, {}];
      this.coachList_2 = [{}, {}];
      this.coachList_1 = [{}, {}];
      this.teamClass_1 = [{}, {}];
      this.teamClass_3 = [{}, {}];
      this.teamClass_2 = [{}, {}];
    },
    selectNav(index, isClear = true) {
      this.currentNav = index;
      if (!wx.getStorageSync("isLogin")) {
        this.teamClassList = [];
        this.coachList = [];
        return;
      }
      if (isClear) {
        this.clearData();
      }
      setTimeout(() => {
        if (index == 1) {
          // 待上课
          this.getOwnCoachClassList(2).then(() => {
            this.coachList = this.coachList_1;
          });
          this.getOwnTeamClassList(1).then(() => {
            this.teamClassList = this.teamClass_1;
          });
        } else if (index == 2) {
          // 待评价
          this.getOwnCoachClassList(3, 1).then(() => {
            this.coachList = this.coachList_2;
          });
          this.getOwnTeamClassList(3, 1).then(() => {
            this.teamClassList = this.teamClass_2;
          });
        } else if (index == 3) {
          // 3 已评价
          this.getOwnCoachClassList(3, 0).then(() => {
            this.coachList = this.coachList_3;
          });
          this.getOwnTeamClassList(3, 0).then(() => {
            this.teamClassList = this.teamClass_3;
          });
        }
      }, 500);
    },
    toggleSelect() {
      this.showSelect = true;
    },
    toAllList(type) {
      if (type == 1 && this.teamClassList.length < 2) {
        return wx.showToast({
          title: "暂无更多团课",
          icon: "none",
          duration: 1000
        });
      }
      // if (type == 2 && this.coachList.length < 2) {
      //   return wx.showToast({
      //     title: "暂无更多私教课",
      //     icon: "none",
      //     duration: 1000
      //   });
      // }
      // type 1 团课 2 私教课
      let status;
      let waitEvaluate;
      if (type == 1 && this.currentNav == 1) {
        // 团课待上课
        status = 1;
      } else if (this.currentNav == 2) {
        // 团课/私教待评价
        status = 3;
        waitEvaluate = 1;
      } else if (this.currentNav == 3) {
        // 团课/私教已完成
        status = 3;
      } else if (type == 2 && this.currentNav == 1) {
        // 私教待上课
        status = 2;
      }
      wx.navigateTo({
        url: `../myClassList/main?type=${type}&status=${status}&waitEvaluate=${waitEvaluate || ''}`
      });
    },
    selectCur(event) {
      this.showSelect = false;
      if (event.target.name == "团课") {
        wx.navigateTo({
          url: "../teamClassList/main"
        });
      } else if (event.target.name == "私教") {
        wx.navigateTo({
          url: "../coachList/main"
        });
      }
    },
    closeSelect() {
      this.showSelect = false;
    },
    /**
     * 获取我的课程 团课列表
     * @param {Number} status 1 待上课 3 已下课
     * @param {Number} waitEvaluate 1 待评价
     */
    getOwnTeamClassList(status, waitEvaluate) {
      // wx.showLoading({
      //   title: "加载中..."
      // });
      // 待评价
      if (status == 3 && waitEvaluate == 1) {
        return this.getTWaitEvaluate();
      }
      let that = this;
      let _data = {};
      if (status == 1) {
        _data = {
          customerId: that.customerId,
          statusType: status
        };
      } else {
        _data = {
          customerId: that.customerId,
          status: status,
          waitEvaluate: waitEvaluate == 0 ? 0 : (waitEvaluate || '')
        };
      }
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/teamClass/teamAttend/pagesNoLimit",
          data: _data,
          success(res) {
            if (res.data.code === 200) {
              let _list =
                res.data.data.result.length > 2
                  ? res.data.data.result.slice(0, 2)
                  : res.data.data.result;
              // 待上课
              if (status == 1) {
                that.teamClass_1 = _list;
                // 已完成
              } else if (status == 3 && !waitEvaluate) {
                that.teamClass_3 = _list;
              }
              resolve();
            }
            // wx.hideLoading();
          }
        });
      });
    },
    /**
     * 获取我的课程 私教列表
     * @param {Number} status 3 已下课 2 待上课
     * @param {Number} waitEvaluate 1 待评价
     */
    getOwnCoachClassList(status, waitEvaluate) {
      // wx.showLoading({
      //   title: "加载中..."
      // });
      // 待评价
      if (status == 3 && waitEvaluate == 1) {
        return this.getWaitEvaluateList();
      }
      let that = this;
      let _data = {};
      if (status == 2) {
        _data = {
          customerId: that.customerId,
          statusType: status
        };
      } else {
        _data = {
          customerId: that.customerId,
          status: status,
          waitEvaluate: waitEvaluate || waitEvaluate == 0 ? 0 : (waitEvaluate || '')
        };
      }
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/mobile/coach/appoint/pages/own",
          data: _data,
          success(res) {
            if (res.data.code === 200) {
              let _data = res.data.data.result.map(e => {
                return {
                  anotherName: e.projectName,
                  masterImg: e.coachHeadImg,
                  userId: e.coachId,
                  coachAppointId: e.coachAppointId,
                  timeStart: e.timeStart,
                  timeEnd: e.timeEnd,
                  storeName: e.storeName,
                  venueName: e.venueName,
                  coachNameArrayStr: e.coachName,
                  status: e.status,
                  statusChar: e.statusChar
                };
              });
              _data = _data.length > 2 ? _data.slice(0, 2) : _data;
              // 待评价
              if (status == 2) {
                that.coachList_1 = _data;
                // 已完成
              } else if (status == 3 && !waitEvaluate) {
                that.coachList_3 = _data;
              }
              resolve();
            }
            // wx.hideLoading();
          }
        });
      });
    },
    // 获取私教待评价列表
    getWaitEvaluateList() {
      // wx.showLoading({
      //   title: "加载中..."
      // });
      let that = this;
      return new Promise(function(resolve) {
        HttpRequest({
          url: window.api + "/mobile/coach/waitEvaluatePages",
          data: {
            customerId: that.customerId,
            page: 1,
            pageSize: 2
          },
          success(res) {
            if (res.data.code === 200) {
              let _data = res.data.data.result
              _data.forEach(e => {
                  e['masterImg'] = e.coachHeadImg
              });
              that.coachList_2 = _data || [];
              resolve();
            }
            // wx.hideLoading();
          }
        });
      });
    },
    // 获取团课待评价列表
    getTWaitEvaluate() {
      // wx.showLoading({
      //   title: "加载中..."
      // });
      let that = this;
      return new Promise(function(resolve) {
        HttpRequest({
          url: window.api + "/teamClass/waitEvaluatePages",
          data: {
            customerId: that.customerId,
            page: 1,
            pageSize: 2
          },
          success(res) {
            if (res.data.code === 200) {
              that.teamClass_2 = res.data.data.result.slice(0, 2);
              resolve();
            }
            // wx.hideLoading();
          }
        });
      });
    },
    // 跳转团课课程详情
    toClassDetail(item) {
      wx.navigateTo({
        url: "../appointmentResult/main?teamAttendId=" + item.teamAttendId
      });
    },
    // 跳转私教课课程详情
    toCoachDetail(item) {
      wx.navigateTo({
        url: "../appointmentResult/main?coachAppointId=" + item.coachAppointId
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";

.appointmentClass {
  padding: 52px 0;
  .nav-tab {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 10px solid #f5f5f5;
    background-color: #fff;
    > div {
      flex: 1;
      line-height: 42px;
      text-align: center;
      border-bottom: 1rpx solid #eee;
      border-right: 1rpx solid #eee;
      &:nth-last-of-type(1) {
        border-right: none;
      }
      &.active {
        color: @theme-color;
      }
    }
  }
  .title-cell .title {
    font-weight: bold;
  }
  .stay-list {
    padding: 0 15px;
    .team-class-wrapper {
      .team-class-item {
        margin-bottom: 15px;
      }
    }
  }
  .stay-coach {
    .coach-wrapper {
      .coach-item,
      .team-class-item {
        margin-bottom: 15px;
        .coach-desc {
          line-height: 20px;
        }
      }
    }
  }
  .bottom-btn {
    color: #fff;
  }
}
</style>


