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
          <img src="/static/images/staff/phone.svg" alt />
          <img src="/static/images/staff/right-arrow.svg" alt />
        </div>
      </staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading" />
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
              sonText: "全部(登记时间)",
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
                this.timePickerType = ""
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "跟进时间",
          children: [
            {
              sonText: "全部(跟进时间)",
              action: () => {
                this.filterTrackDate(0);
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterTrackDate(1);
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterTrackDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterTrackDate(30);
              }
            },
            {
              sonText: "自定义",
              action: () => {
                this.timePickerType = "track"
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "跟进结果",
          children: [
            {
              sonText: "全部(跟进结果)",
              action: () => {
                this.filter.trackResult = "";
              }
            },
            {
              sonText: "继续跟进",
              action: () => {
                this.filter.trackResult = 1;
              }
            },
            {
              sonText: "已预约",
              action: () => {
                this.filter.trackResult = 2;
              }
            },
            {
              sonText: "不确定",
              action: () => {
                this.filter.trackResult = 3;
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
          dataText: "潜在客户",
          dataNum: "0"
        },
        {
          dataText: "现有客户",
          dataNum: "0"
        }
      ],
      filter: {
        nameOrPhone: "",
        addTimeStart: "",
        addTimeEnd: "",
        trackTimeEnd: "",
        trackTimeStart: "",
        trackResult: ""
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
          url: "/customer/track/static/count",
          data: _data,
          success(res) {
            that.headerData[1].dataNum = res.data.data.existingCount;
            that.headerData[2].dataNum = res.data.data.prospectiveCount;
          }
        });
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
      this.timePickerType == ""
      this.setDate(obj);
    },
    filterTrackDate(day) {
      let obj = this.filterDateMethod(day);
      this.timePickerType == "track"
      this.setDate(obj);
    },
    setDate(obj) {
      if(this.timePickerType == "track") {
        this.filter.trackTimeStart = obj.startTime
        this.filter.trackTimeEnd = obj.endTime
        return
      }
      this.filter.addTimeStart = obj.startTime;
      this.filter.addTimeEnd = obj.endTime;
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
