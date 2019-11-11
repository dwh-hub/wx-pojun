<template>
  <div class="achievement-list">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
        :isOverlap="true"
      ></header-search>
      <!-- <filter-date @changeDate="setDate"></filter-date> -->
      <header-data :headerData="headerData" :isOverlap="true"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>
    <div class="list common-list">
      <div class="list-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <div v-if="item.id">
          <div class="cover">
            <div>
              <div class="card-status" :class="item.class">{{item.masterCardClassName}}</div>
              <div class="date">{{item.date}}</div>
            </div>
            <div class="vertical-line"></div>
          </div>
          <div class="item-info">
            <div class="item-top">
              合同编号：{{item.pactId}}
              <!-- <span>合同编号：{{item.pactId}}</span> -->
              <!-- <span>{{item.proportionPrice}}元</span> -->
            </div>
            <!-- <div class="item-middle">[{{item.purchasePatternChar}}] {{item.customerName || "--"}}</div> -->
            <div class="item-middle">合同类型: {{item.masterCardClassName}}</div>
            <div class="item-desc">
              合同信息: {{item.secondCardClassName}}
              <!-- <div>卡：{{item.secondCardClassName}}（{{item.statusText}}）</div>
              <div>业绩归属：{{item.userName || '--'}}（归属比例:{{item.proportion*100}}%）</div>
              <div>付款金额：{{item.cost}}元</div>-->
            </div>
          </div>
          <div class="item-right">
            <div class="money">
              <div class="sum-money">￥{{item.proportionPrice}}</div>
              <div class="sale-money">
                <div class="sale-money-text">￥{{item.proportionPrice * item.proportion}}</div>
                <div class="sale">{{item.proportion*100}}%{{item.userName || '--'}}</div>
              </div>
            </div>
            <img src="/static/images/staff/right-arrow.svg" alt />
          </div>
        </div>
        <div class="coach-skeleton" v-else>
          <div class="cover">
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
  filterDateMethod
} from "COMMON/js/common.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import filterDate from "../components/filter-date.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import { getUserofrole } from "../common/js/http.js";
import achieveData from "../common/js/achievement.js";

export default {
  data() {
    return {
      headerData: [
        {
          dataText: "业绩总额",
          dataNum: "0",
          color: "#ffae08"
        },
        {
          dataText: "实际业绩总额",
          dataNum: "0",
          color: "#14c88b "
        }
      ],
      page: 1,
      nav: [
        {
          navTitle: "所有业务",
          name: "业务类型",
          children: [
            {
              sonText: "所有业务",
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
          navTitle: "业绩归属人",
          name: "业绩归属人",
          children: [
            {
              sonText: "无"
            }
          ]
        },
        {
          navTitle: "本月",
          name: "办理日期",
          children: [
            {
              sonText: "今日",
              action: () => {
                this.filterDate("day");
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterDate("week");
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate("month");
              }
            },
            {
              sonText: "上月",
              action: () => {
                this.filterDate("lastMonth");
              }
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
    noneResult,
    filterDate
  },
  mounted() {
    setNavTab();
    this._getUserofrole();
    if(achieveData.nav.length) {
      this.nav.forEach((e, index) => {
        e.navTitle = achieveData.nav[index].navTitle
      })
      this.filter = JSON.parse(JSON.stringify(achieveData.filter))
    } else {
      this.nav[2].navTitle = "本月"
      this.filterDate('month');
    }
  },
  mixins: [colorMixin, listPageMixin],
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    getAchievementTable() {
      let that = this;
      var _data = Object.assign({}, that.filter, {
        storeId: that.selectedStore.storeId,
        isCoverage: 0
      });
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
            name: "储值卡",
            class: "yuan"
          };
        case 1:
          return {
            name: "时期卡",
            class: "day"
          };
        case 2:
          return {
            name: "次卡",
            class: "unit"
          };
        default:
          return {
            name: "订金合同",
            class: "unit"
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
                id: e.makeupCardId,
                statusText: that.transClass(e.authorityUnit || "").name,
                class: that.transClass(e.authorityUnit).class,
                pactId: e.pactId,
                masterCardClassName: e.masterCardClassName,
                proportionPrice: e.proportionPrice,
                purchasePatternChar: e.purchasePatternChar,
                customerName: e.customerName,
                secondCardClassName: e.secondCardClassName,
                userName: e.userName,
                proportion: e.proportion,
                cost: e.cost,
                date: formatDate(new Date(e.performancEallotTime), "yyyy/MM/dd")
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
      this.selectedStore = item;
      if (!item.storeId) {
        this.filter.belongerId = "";
        this.nav[1].navTitle = "全部";
      }
      this._getUserofrole();
      this.refreshList();
    },
    _getUserofrole() {
      getUserofrole(this.selectedStore.storeId, 0).then(data => {
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
    filterDateMethod(day) {
      return filterDateMethod(day);
    },
    setDate(obj) {
      this.filter.timeStart = obj.startTime;
      this.filter.timeEnd = obj.endTime;
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
.achievement-list {
  .list {
    .list-item {
      > div {
        display: flex;
        padding: 10px 15px 10px 0;
        border-bottom: 1rpx solid #f6f6f6;
        .cover {
          flex: 0 0 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          .vertical-line {
            width: 1px;
            height: 23px;
            margin-left: 6px;
            background-color: #f6f6f6;
          }
          .date {
            margin-top: 10px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          .card-status {
            width: 44px;
            height: 44px;
            margin: 0 auto;
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
          line-height: 22px;
          font-size: 12px;
          color: #333;
          // > span {
          //   margin-right: 20px;
          //   font-size: 12px;
          //   color: #333;
          // }
        }
        // .item-top,
        // .item-middle {
        //   line-height: 24px;
        // }
        // .item-top {
        //   font-weight: bold;
        // }
        .item-middle,
        .item-desc {
          color: #666;
        }
      }
      .item-right {
        display: flex;
        align-items: center;
        justify-content: center;
        .money {
          text-align: center;
          .sum-money {
            padding-bottom: 5px;
            color: #14c88b;
            font-size: 12px;
            font-weight: bold;
            border-bottom: 1rpx solid #f6f6f6;
          }
          .sale-money {
            padding-top: 5px;
            .sale-money-text {
              color: #ffae08;
              font-size: 12px;
              font-weight: bold;
            }
            .sale {
              font-size: 10px;
              color: #999;
            }
          }
        }
        > img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>