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
      <staff-coach-item v-for="(item, index) in list" :key="index" :info="item"></staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无约访记录" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
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
      selectedStore: {},
      storeList: [],
      filter: {
        nameOrPhone: "",
        appointmentTimeStart: "",
        appointmentTimeEnd: ""
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
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.filterDate(1);
  },
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
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
            page: that.page,
            pageNo: that.page,
            searchStore: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: "/user/work/customer/reserved/pages",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              that.list = [];
              return;
            }
            that.headerData[0].dataNum = res.data.data.recCount;
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
                second_1: e.appointmentPurposeChar,
                second_tip_1: "预约目的：",
                third_1: e.appointmentTime,
                third_tip_1: "最后签到时间：",
                rightText: e.isVisitChar
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
      this.filter.appointmentTimeStart = obj.statrTime;
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
  .filter-nav {
    .mask {
      top: 165px;
    }
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    .icon-right {
      line-height: 60px;
    }
  }
}
</style>
