<template>
  <div class="follow_up_log">
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
    <div class="card-list">
      <staff-coach-item
        v-for="(item, index) in list"
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
      <none-result text="暂无合同" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
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
import staffCoachItem from "../components/staff-coach-item.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
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
            }]
        },
        {
          navTitle: "筛选条件三",
          children: [
            {
              sonText: "无"
            }]
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
      selectedStore: {},
      storeList: [],
      filter: {
        nameOrPhone: "",
        trackTimeEnd: "",
        trackTimeStart: ""
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
  mixins: [colorMixin, listPageMixin],
  onLoad(options) {
    if (options.trackUserType) {
      this.trackUserType = options.trackUserType;
    }
  },
  // onUnload() {
  //   this.clearData();
  // },
  mounted() {
    this.nav[0].navTitle = "今日";
    let _title = this.trackUserType == 1 ? "销售跟进日志" : "教练跟进日志";
    setNavTab(_title);
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.filterDate(1);
  },
  methods: {
    clearData() {
      this.page = 1;
      // this.list = [{}, {}, {}, {}];
      this.isLoading = true;
      this.headerData[0].dataNum = 0;
      for (let key in this.filter) {
        this.filter[key] = "";
      }
    },
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    selectStore(item) {
      this.selectedStore = item;
    },
    toCardDetail(item) {
      wx.navigateTo({
        url: `../customer_detail/main?id=${item.id}&type=staff`
      });
    },
    call(item) {
      wx.makePhoneCall({
        phoneNumber: item.phone
      });
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        let _url = "";
        if (that.trackUserType == 1) {
          _url = "/user/work/trackrecoredpages";
        } else if (that.trackUserType == 2) {
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
          url: _url,
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              return (that.list = []);
            }
            that.headerData[0].dataNum = res.data.data.recCount || 0;
            let _data = res.data.data.result.map(async e => {
              if (e.headImgPath) {
                if (e.headImgPath.indexOf(".jsp") != -1) {
                  await that.getAvatar(e.headImgPath).then(res => {
                    e.headImgPath = res;
                  });
                } else {
                  e.headImgPath = window.api + e.headImgPath;
                }
              }
              return {
                id: e.customerId,
                sex: e.sex,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                first_1: e.customerName,
                second_1: e.content,
                second_tip_1: e.content ? "跟进内容：" : "--",
                phone: e.phone
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.trackTimeStart = obj.startTime;
      this.filter.trackTimeEnd = obj.endTime;
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
    .mask {
      top: 165px;
    }
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
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
