<template>
  <div class="follow_up_log">
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
        v-for="(item, index) in followUpList"
        :key="index"
        :info="item"
        @clickItem="toCardDetail(item)"
        @clickIcon="call(item)"
      >
        <div>
          <img src="/static/images/staff/phone.svg" alt>
          <img src="/static/images/staff/right-arrow.svg" alt>
        </div>
      </staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无合同" v-if="!followUpList.length && !isLoading"></none-result>
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
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import noneResult from "COMPS/noneResult.vue";
export default {
  data() {
    return {
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
          navTitle: "筛选条件三",
          children: []
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
      isLoading: true,
      followUpList: [{}, {}, {}, {}],
      selectedStore: {},
      storeList: [],
      page: 1,
      filter: {
        nameOrPhone: "",
        searchTrackTimeEnd: "",
        searchTrackTimeStart: ""
      },
      trackUserType: 1 // 1 销售 2 教练
    };
  },
  components: {
    headerSearch,
    headerData,
    filterNav,
    staffCoachItem,
    noneResult
  },
  mixins: [colorMixin],
  onLoad(options) {
    if (options.trackUserType) {
      this.trackUserType = options.trackUserType;
    }
  },
  onUnload() {
    this.clearData();
  },
  onReachBottom() {
    this.getLogPages();
  },
  mounted() {
    let _title = this.trackUserType == 1?'销售跟进日志':'教练跟进日志'
    setNavTab(_title);
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.getLogPages();
  },
  methods: {
    clearData() {
      this.page = 1;
      this.followUpList = [{}, {}, {}, {}];
      this.isLoading = true;
      this.headerData[0].dataNum = 0
      for (let key in this.filter) {
        this.filter[key] = "";
      }
    },
    searchChange(event) {
      this.filter.nameOrPhone = event;
      this.page = 1;
      this.getLogPages();
    },
    selectStore(item) {
      this.selectedStore = item;
      this.page = 1;
      this.getLogPages();
    },
    toCardDetail(item) {
      wx.navigateTo({
        url: `../../cardDetail/main?id=${item.id}&type=staff`
      });
    },
    call(item) {
      wx.makePhoneCall({
        phoneNumber: item.phone
      });
    },
    getLogPages() {
      this.isLoading = true;
      let that = this;
      let _url = "";
      if (this.trackUserType == 1) {
        _url = "/user/work/trackrecoredpages";
      } else if (this.trackUserType == 2) {
        _url = "/customer/track/pages";
      }
      var _data = Object.assign(
        {},
        {
          page: that.page,
          order: 1, // 1 id排序 2下次跟进排序
          TrackUserType: that.trackUserType,
          storeId: that.selectedStore.storeId
        },
        that.filter
      );
      HttpRequest({
        url: window.api + _url,
        data: _data,
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            if (!res.data.data.result.length && that.page == 1) {
              return (that.followUpList = []);
            }
            that.page++;
            if (that.headerData[0].dataNum == "0") {
              that.headerData[0].dataNum = res.data.data.recCount;
            }
            let _data = res.data.data.result.map(e => {
              return {
                id: e.customerId,
                cover: window.api + e.headImgPath,
                first_1: e.customerName,
                second_1: e.content,
                second_tip_1: e.content ? "跟进内容：" : "--",
                phone: e.phone
              };
            });
            if (that.page == 2 || that.page == 1) {
              that.followUpList = _data;
            } else {
              that.followUpList = that.followUpList.concat(_data);
            }
          }
        }
      });
    },
    filterDate(day) {
      if (!day || day == 0) {
        this.filter.searchTrackTimeEnd = "";
        this.filter.searchTrackTimeEnd = "";
      } else {
        const DAY = 24 * 60 * 60 * 1000;
        let stamp = new Date().getTime();
        let endTime = formatDate(new Date(stamp), "yyyy-MM-dd") + " 23:59:59";
        let startTime =
          formatDate(new Date(stamp - DAY * day), "yyyy-MM-dd") + " 23:59:59";
        this.filter.searchTrackTimeStart = startTime;
        this.filter.searchTrackTimeEnd = endTime;
      }
      this.page = 1;
      this.getLogPages();
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.follow_up_log {
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
      margin-top: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
