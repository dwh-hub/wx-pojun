<template>
  <div class="customer_interview">
    <div class="list-header">
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
    </div>
    <div class="card-list">
      <staff-coach-item
        @clickItem="toDetail(item)"
        v-for="(item, index) in list"
        :key="index"
        :info="item"
      ></staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无约访记录" v-if="!list.length && !isLoading"></none-result>
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
              sonText: "全部(预约时间)",
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
          navTitle: "预约目的",
          children: [
            {
              sonText: "全部(预约目的)",
              action: () => {
                this.filter.appointmentPurpose = "";
              }
            },
            {
              sonText: "参观",
              action: () => {
                this.filter.appointmentPurpose = 1;
              }
            },
            {
              sonText: "办理",
              action: () => {
                this.filter.appointmentPurpose = 2;
              }
            },
            {
              sonText: "体验课",
              action: () => {
                this.filter.appointmentPurpose = 3;
              }
            },
            {
              sonText: "上课",
              action: () => {
                this.filter.appointmentPurpose = 4;
              }
            }
          ]
        },
        {
          navTitle: "客户状态",
          children: [
            {
              sonText: "全部(客户状态)",
              action: () => {
                this.filter.customerClass = "";
              }
            },
            {
              sonText: "潜在",
              action: () => {
                this.filter.customerClass = 1;
              }
            },
            {
              sonText: "现有",
              action: () => {
                this.filter.customerClass = 3;
              }
            },
            {
              sonText: "订金",
              action: () => {
                this.filter.customerClass = 4;
              }
            },
            {
              sonText: "失效",
              action: () => {
                this.filter.customerClass = 5;
              }
            }
          ]
        }
      ],
      purpose: 0, // 预约目的
      customerType: 0, // 客户状态
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
        appointmentTimeStart: "",
        appointmentTimeEnd: "",
        appointmentPurpose: "",
        customerClass: ""
      },
      logType: ""
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
  mounted() {
    this.nav[0].navTitle = "今日";
    this.filterDate(1);
  },
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            pageNo: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: "/customer/reserved/static/count",
          data: _data,
          success(res) {
            that.headerData[1].dataNum = res.data.data.prospectiveCount;
            that.headerData[2].dataNum = res.data.data.existingCount;
          }
        });
        HttpRequest({
          url: "/user/work/customer/reserved/pages",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              that.list = [];
              return;
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
                sex: e.visitorSex,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                first_1: e.visitorName,
                second_1: e.appointmentPurposeChar || "无",
                second_tip_1: "预约目的：",
                third_1: e.appointmentTime || "--",
                third_tip_1: "最后签到时间：",
                rightText: e.isVisitChar,
                appointmentPurpose: e.appointmentPurpose,
                customerClass: e.customerClass
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    toDetail(item) {
      wx.navigateTo({
        url: "../customer_detail/main?id=" + item.id
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.appointmentTimeStart = obj.startTime;
      this.filter.appointmentTimeEnd = obj.endTime;
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.customer_interview {
  .staff-coach-item {
    border-bottom: 1rpx solid #eee;
    .icon-right {
      line-height: 60px;
    }
  }
}
</style>
