<template>
  <div class="contract-list">
    <header-search
      :storeList="storeList"
      :color="themeColor"
      :search="searchChange"
      @selectStore="selectStore"
    ></header-search>
    <header-data :headerData="headerData"></header-data>
    <filter-nav :nav="nav"></filter-nav>
    <div class="card-list">
      <staff-coach-item
        v-for="(item, index) in cardList"
        :key="index"
        :info="item"
        @clickItem="toCardDetail(item)"
      ></staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无合同" v-if="!cardList.length && !isLoading"></none-result>
    </div>

    <van-popup
      :show="showProjectPopup"
      @close="showProjectPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="action-list">
        <div
          class="action-item"
          v-for="(item, index) in projectList"
          :key="index"
          @click="selectProject(item)"
        >{{item.projectName}}</div>
      </div>
    </van-popup>

    <van-popup
      :show="showUserPopup"
      @close="showUserPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="action-list">
        <div
          class="action-item"
          v-for="(item, index) in userpList"
          :key="index"
          @click="selectUser(item)"
        >{{item.customerName}}</div>
      </div>
    </van-popup>
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
import staffCoachItem from "../components/staff-coach-item.vue";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import noneResult from "COMPS/noneResult.vue";
export default {
  data() {
    return {
      type: "", // 判断点击合同的事件 addStudent = 新增上课学员
      venueId: "", // options 的场馆参数
      teamScheduleId: "", // options 的 teamScheduleId 参数
      nav: [
        {
          navTitle: "办理时间",
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
            }
          ]
        },
        {
          navTitle: "筛选条件二",
          children: []
        },
        {
          navTitle: "卡类型",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterType();
              }
            },
            {
              sonText: "会籍卡",
              action: () => {
                this.filterType(1);
              }
            },
            {
              sonText: "私教卡",
              action: () => {
                this.filterType(4);
              }
            },
            {
              sonText: "团课卡",
              action: () => {
                this.filterType(3);
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "总计",
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
      cardstatuslist: [],
      page: 1,
      cardList: [{}, {}, {}, {}],
      selectedStore: {},
      storeList: [],
      isLoading: true,
      filter: {
        nameOrPhone: "",
        transactTimeEnd: "",
        transactTimeStart: "",
        cardType: ""
      },
      selectedCard: {},
      showProjectPopup: false,
      showUserPopup: false,
      projectList: [],
      selectedProject: {},
      userpList: [],
      selectedUser: {}
    };
  },
  onLoad(options) {
    if (options.type) {
      this.type = options.type;
      this.venueId = options.venueId;
      this.teamScheduleId = options.teamScheduleId
    }
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.getCardPage();
  },
  onReachBottom() {
    this.getCardPage();
  },
  components: {
    headerSearch,
    headerData,
    filterNav,
    staffCoachItem,
    noneResult
  },
  mixins: [colorMixin],
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
      this.page = 1;
      this.getCardPage();
    },
    selectStore(item) {
      this.selectedStore = item;
      this.page = 1;
      this.getCardPage();
    },
    toCardDetail(item) {
      if (this.type == "addStudent") {
        this.selectedCard = item
        // 新增上课学员
        this.getProject()
        return
      }
      wx.navigateTo({
        url: `../../cardDetail/main?id=${item.id}&type=staff`
      });
    },
    getCardPage() {
      this.isLoading = true;
      let that = this;
      var _data = Object.assign(
        {},
        {
          page: that.page,
          storeId: that.selectedStore.storeId
        },
        that.filter
      );
      HttpRequest({
        url: window.api + "/customer/card/pages",
        data: _data,
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            if (!res.data.data.result.length && that.page == 1) {
              return (that.cardList = []);
            }
            that.page++;
            // if (that.headerData[0].dataNum == "0") {
              that.headerData[0].dataNum = res.data.data.recCount;
            // }
            let _data = res.data.data.result.map(e => {
              return {
                id: e.id,
                pactId: e.pactId,
                cover: window.api + e.headImgPath,
                first_1: `${e.name}(${e.pactId})`,
                second_1: e.secondCardClass,
                rightText: e.cardStatusChar,
                cardClassId: e.cardClassId,
                storeId: e.storeId
              };
            });
            if (that.page == 2 || that.page == 1) {
              that.cardList = _data;
            } else {
              that.cardList = that.cardList.concat(_data);
            }
          }
        }
      });
    },
    getCardstatuslist() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/card/cardstatuslist",
        success(res) {
          that.cardstatuslist = res.data.data;
        }
      });
    },
    transformCardStatus(status) {
      this.cardstatuslist.forEach(e => {
        if (e.cardStatus == status) {
          return e.cardStatusChar;
        }
      });
    },
    filterDate(day) {
      if (!day || day == 0) {
        this.filter.transactTimeEnd = "";
        this.filter.transactTimeStart = "";
        return
      }
        // const DAY = 24 * 60 * 60 * 1000;
        // let stamp = new Date().getTime();
        // let endTime = formatDate(new Date(stamp), "yyyy-MM-dd") + " 23:59:59";
        // let startTime =
        //   formatDate(new Date(stamp - DAY * day), "yyyy-MM-dd") + " 23:59:59";
        // this.filter.transactTimeStart = startTime;
        // this.filter.transactTimeEnd = endTime;
        let date = new Date();
        const DAY = 24 * 60 * 60 * 1000;
        const HOUR8 = 8 * 60 * 60 *1000;
        let nowStamp = date.getTime();
        let today = date.getDate() - 1;
        let weekday = date.getDay() - 1;
        if (day == 1) {
          this.filter.transactTimeStart = formatDate(new Date(parseInt(nowStamp / DAY) * DAY - HOUR8), 'yyyy-MM-dd hh:mm:ss');
          this.filter.transactTimeEnd = formatDate(new Date(parseInt(nowStamp / DAY) * DAY  + DAY - HOUR8 - 1), 'yyyy-MM-dd hh:mm:ss');
        }
        if(day == 7) {
          this.filter.transactTimeStart = formatDate(new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - weekday*DAY), 'yyyy-MM-dd hh:mm:ss');
          this.filter.transactTimeEnd = formatDate(new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 + (7-weekday)*DAY-1), 'yyyy-MM-dd hh:mm:ss');
        }
        if(day == 30) {
          this.filter.transactTimeStart = formatDate(new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - today*DAY), 'yyyy-MM-dd hh:mm:ss');
          this.filter.transactTimeEnd = formatDate(new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 + (30-today)*DAY-1), 'yyyy-MM-dd hh:mm:ss');
        }
      this.page = 1;
      this.getCardPage();
    },
    filterType(type) {
      this.filter.cardType = type || "";
      this.page = 1;
      this.getCardPage();
    },
    selectProject(item) {
      this.selectedProject = item
      this.showProjectPopup = false
      this.getUserp()
    },
    selectUser(item) {
      this.selectedUser = item
      this.showUserPopup = false
      this.addAttend()
    },
    /* 上课流程 - 开始 */
    // 获取项目
    getProject() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/getProject",
        data: {
          cardClassId: that.selectedCard.cardClassId,
          storeId: that.selectedCard.storeId,
          venueId: that.venueId,
          teamScheduleId: that.teamScheduleId
        },
        success(res) {
          if (res.data.code == 200 && res.data.data.length) {
            if (res.data.data.length == 1) {
              that.selectedProject = res.data.data[0]
              that.getUserp();
            } else {
              that.showProjectPopup = true;
              that.projectList = res.data.data;
            }
          }
        }
      });
    },
    // 获取使用人
    getUserp() {
      let that = this;
      HttpRequest({
        url: window.api + "/card/relevance/user/get",
        data: {
          cardId: that.selectedCard.id
        },
        success(res) {
          if (res.data.code == 200 && res.data.data.length) {
            if (res.data.data.length == 1) {
              that.selectedUser = res.data.data[0]
              that.addAttend()
            } else {
              that.showUserPopup = true;
              that.userpList = res.data.data;
            }
          }
        }
      });
    },
    addAttend() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/attend",
        data: {
          projectId: that.selectedProject.projectId,
          storeId: that.selectedCard.storeId,
          venueId: that.venueId,
          physicsCardNo: that.selectedUser.physicsCardNo,
          passMode: 10, // 教练点名上课
          teamScheduleId: that.teamScheduleId
        },
        success(res) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      });
    }
    /* 上课流程-结束 */
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.contract-list {
  .filter-nav {
    margin-top: 5px;
    margin-bottom: 1px;
    .mask {
      top: 165px;
    }
  }
  .staff-coach-item {
    border-bottom: 1rpx solid #eee;
    .coach-info {
      line-height: 26px;
    }
    .icon-right {
      line-height: 60px;
    }
  }
  .action-list {
    max-height: 50vh;
    .action-item {
      border-top: 1rpx solid #eee;
      line-height: 48px;
      text-align: center;
    }
  }
}
</style>
