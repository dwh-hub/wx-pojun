<template>
  <div class="achievement-list">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <div v-if="item.id">
          <div class="cover">
            <div class="card-status" :class="item.class">{{item.masterCardClassName}}</div>
          </div>
          <div class="item-info">
            <div class="item-top">
              <span>合同编号：{{item.pactId}}</span>
              <span>{{item.proportionPrice}}元</span>
            </div>
            <div class="item-middle">[{{item.purchasePatternChar}}] {{item.customerName}}</div>
            <div class="item-desc">
              <div>卡：{{item.secondCardClassName}}（{{item.statusText}}）</div>
              <div>业绩归属：{{item.userName}}（归属比例:{{item.proportion*100}}%）</div>
              <div>付款金额：{{item.cost}}元</div>
            </div>
          </div>
          <div class="icon-right">
            <img src="/static/images/staff/right-arrow.svg" alt />
          </div>
        </div>
        <div class="coach-skeleton" v-else>
          <div class="cover">
            <div class="card-status"></div>
          </div>
          <div class="skeleton-wrapper">
            <div class="skeleton-name"></div>
            <div class="skeleton-desc"></div>
            <div class="skeleton-time"></div>
          </div>
        </div>
      </div>

      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无业绩" v-if="!list.length && !isLoading"></none-result>
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
  formatDate,
  debounce
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import { getUserofrole } from "../common/js/http.js";

export default {
  data() {
    return {
      headerData: [
        {
          dataText: "业绩总额",
          dataNum: "0"
        },
        {
          dataText: "实际业绩总额",
          dataNum: "0"
        }
      ],
      page: 1,
      nav: [
        {
          navTitle: "所有业务",
          name: "业务类型",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filter.purchasePattern = "";
              }
            },
            {
              sonText: "新购",
              action: () => {
                this.filter.purchasePattern = 1;
              }
            },
            {
              sonText: "转卡",
              action: () => {
                this.filter.purchasePattern = 2;
              }
            },
            {
              sonText: "请假",
              action: () => {
                this.filter.purchasePattern = 3;
              }
            },
            {
              sonText: "转让",
              action: () => {
                this.filter.purchasePattern = 4;
              }
            },
            {
              sonText: "补办",
              action: () => {
                this.filter.purchasePattern = 5;
              }
            },
            {
              sonText: "补余",
              action: () => {
                this.filter.purchasePattern = 6;
              }
            },
            {
              sonText: "订金",
              action: () => {
                this.filter.purchasePattern = 7;
              }
            },
            {
              sonText: "退款",
              action: () => {
                this.filter.purchasePattern = 8;
              }
            },
            {
              sonText: "手牌遗失",
              action: () => {
                this.filter.purchasePattern = 9;
              }
            },
            {
              sonText: "手牌损坏",
              action: () => {
                this.filter.purchasePattern = 10;
              }
            },
            {
              sonText: "手牌租用",
              action: () => {
                this.filter.purchasePattern = 11;
              }
            }
          ]
        },
        {
          navTitle: "所有销售",
          name: "销售/教练名",
          children: [
            {
              sonText: "无"
            }
          ]
        },
        {
          navTitle: "近七天",
          name: "时间",
          children: [
            {
              sonText: "今日",
              action: () => {
                this.filterDate(1);
              }
            },
            {
              sonText: "近七天",
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
              sonText: "上月",
              action: () => {}
            }
          ]
        }
      ],
      filter: {
        nameOrPhone: "",
        timeStart: "",
        timeEnd: "",
        purchasePattern: "",
        belongerId: ""
      }
    };
  },
  components: {
    headerSearch,
    headerData,
    filterNav,
    staffCoachItem,
    noneResult
  },
  mounted() {
    setNavTab();
    this._getUserofrole();
    this.filterDate(7);
  },
  mixins: [colorMixin, listPageMixin],
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    getAchievementTable() {
      let that = this;
      var _data = Object.assign(
        {},
        {
          storeId: that.selectedStore.storeId,
          isCoverage: 0
        },
        that.filter
      );
      HttpRequest({
        url: "/performance/card/pagestotal",
        data: _data,
        success(res) {
          if (res.data.code == 200) {
            let sum = 0;
            res.data.data.forEach(e => {
              sum += e.cost;
            });
            that.headerData[0].dataNum = sum;
            that.headerData[1].dataNum = sum;
          }
        }
      });
    },
    transClass(value) {
      switch (value) {
        case 0:
          return {
            name: '储值卡',
            class: 'yuan'
          };
        case 1:
          return {
            name: '时期卡',
            class: 'day'
          };
        case 2:
          return {
            name: '次卡',
            class: 'unit'
          };
      }
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            storeId: that.selectedStore.storeId,
            isCoverage: 0
          },
          that.filter
        );
        HttpRequest({
          url: "/performance/card/pages",
          data: _data,
          success(res) {
            let data = res.data.data.result.map(e => {
              // let statusText = "";
              // if (e.authorityUnit == 0) {
              //   statusText = "储值卡";
              // }
              // if (e.authorityUnit == 1) {
              //   statusText = "时期卡";
              // }
              // if (e.authorityUnit == 2) {
              //   statusText = "次卡";
              // }
              return {
                // TODO: id
                id: e.makeupCardId,
                statusText: that.transClass(e.authorityUnit).name,
                class: that.transClass(e.authorityUnit).class,
                pactId: e.pactId,
                masterCardClassName: e.masterCardClassName,
                proportionPrice: e.proportionPrice,
                purchasePatternChar: e.purchasePatternChar,
                customerName: e.customerName,
                secondCardClassName: e.secondCardClassName,
                userName: e.userName,
                proportion: e.proportion,
                cost: e.cost
              };
            });
            resolve(data);
          }
        });
      });
    },
    toDetail(item) {
      wx.navigateTo({
        url: "../achievement_detail/main?id=" + item.id
      });
    },
    refreshList() {
      this.page = 1;
      this.isNoMore = false;
      this.list = [{}, {}, {}, {}];
      this.getAchievementTable();
      this.getList();
    },
    selectStore(item) {
      console.log("list-page-minxi-main");
      this.selectedStore = item;
      this._getUserofrole();
      this.refreshList();
    },
    _getUserofrole() {
      getUserofrole(this.selectedStore.storeId, 2).then(data => {
        let list = data.map(e => {
          return {
            sonText: e.userName,
            action: () => {
              this.filter.belongerId = e.userId;
            }
          };
        });
        this.nav[1].children = [
          {
            sonText: "全部",
            action: () => {
              this.filter.belongerId = "";
            }
          }
        ].concat(list);
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.timeStart = obj.startTime;
      this.filter.timeEnd = obj.endTime;
    }
  }
};
</script>

<style lang="less">
.achievement-list {
  .list {
    .list-item {
      > div {
        display: flex;
        padding: 10px 15px 10px 0;
        border-bottom: 1rpx solid #eee;
        .cover {
          flex: 0 0 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          .card-status {
            width: 44px;
            height: 44px;
            font-size: 10px;
            text-align: center;
            line-height: 44px;
            border-radius: 50%;
            color: #fff;
            &.private {
              background-color: #000000;
            }
            &.yuan {
              background-color: #13bfc4;
            }
            &.day {
              background-color: #ff924f;
            }
            &.unit {
              background-color: #58b4ff;
            }
          }
        }
      }
      .item-info {
        flex: 1;
        > div {
          line-height: 1.5em;
          font-size: 12px;
          color: #333;
          > span {
            margin-right: 20px;
            font-size: 12px;
            color: #333;
          }
        }
        .item-top,
        .item-middle {
          line-height: 24px;
        }
        .item-top {
          font-weight: bold;
        }
        .item-desc > div {
          font-size: 10px;
          color: #808080;
        }
      }
      .icon-right {
        display: flex;
        align-items: center;
        justify-content: center;
        > img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .coach-skeleton {
    .cover .card-status {
      background-color: #eee;
    }
    .skeleton-wrapper {
      padding: 0 12px;
      width: 100%;
      > div {
        margin-top: 12px;
        background-color: #eee;
      }
      .skeleton-name {
        margin-top: 4px;
        height: 16px;
      }
      .skeleton-time {
        height: 12px;
        width: 200px;
      }
      .skeleton-desc {
        height: 10px;
        width: 100px;
        margin-right: 10px;
      }
    }
  }
}
</style>