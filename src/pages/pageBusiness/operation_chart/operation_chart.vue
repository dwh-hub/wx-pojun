<template>
  <div class="operation_chart">
    <!-- <div class="list-header"> -->
    <filter-nav :nav="nav"></filter-nav>
    <van-tabs :active="navIndex" @change="onChange" :color="themeColor" swipeable animated>
      <van-tab title="运营报表"></van-tab>
      <van-tab title="课程报表"></van-tab>
    </van-tabs>
    <!-- </div> -->
    <div class="sub-tab">
      <div class="chart-list" :class="{active: subNavIndex==1}" @click="changeSubNavIndex(1)">汇总</div>
      <div class="total-detail" :class="{active: subNavIndex==2}" @click="changeSubNavIndex(2)">明细</div>
    </div>
    <div class="operation" v-show="navIndex == 0">
      <!-- <scroll-view scroll-y :style="{height: scrollViewHeight + 'px'}"> -->
      <div v-show="subNavIndex == 1">
        <div class="chart-title">门店排行</div>
        <div style="height: 40vh">
          <ff-canvas id="store" canvas-id="store" :opts="opts" />
        </div>
        <div class="chart-title">业绩排行</div>
        <div style="height: 40vh">
          <ff-canvas id="card" canvas-id="card" :opts="opts" />
        </div>
        <div class="chart-title">销售排行</div>
        <div style="height: 40vh">
          <ff-canvas id="sale" canvas-id="sale" :opts="opts" />
        </div>
        <div class="chart-title">客户构成</div>
        <div style="height: 40vh">
          <ff-canvas id="customer" canvas-id="customer" :opts="opts" />
        </div>
        <div class="chart-title">客流量</div>
        <div style="height: 40vh">
          <ff-canvas id="customer-line" canvas-id="customer-line" :opts="opts" />
        </div>
      </div>
      <div v-if="subNavIndex == 2" class="operation-detail-wrapper">
        <div class="tabel-wrapper">
          <table>
            <tr>
              <td>交易类型</td>
              <td>交易笔数</td>
              <td>实际收入</td>
            </tr>
            <tr>
              <td>新购</td>
              <td class="blus">{{sellInfo.newPurchasedCount}}笔</td>
              <td class="oranges">¥{{sellInfo.newPurchasedMoney}}</td>
            </tr>
            <tr>
              <td>转卡</td>
              <td class="blus">{{sellInfo.trancCardCount}}笔</td>
              <td class="oranges">¥{{sellInfo.trancCardMoney}}</td>
            </tr>
            <tr>
              <td>请假</td>
              <td class="blus">{{sellInfo.stopCardCount}}笔</td>
              <td class="oranges">¥{{sellInfo.stopCardMoney}}</td>
            </tr>
            <tr>
              <td>转让</td>
              <td class="blus">{{sellInfo.transferCardCount}}笔</td>
              <td class="oranges">¥{{sellInfo.transferCardMoney}}</td>
            </tr>
            <tr>
              <td>补办</td>
              <td class="blus">{{sellInfo.lossmakeCardCount}}笔</td>
              <td class="oranges">¥{{sellInfo.lossmakeCardMoney}}</td>
            </tr>
            <tr>
              <td>补余</td>
              <td class="blus">{{sellInfo.spareMoneyCount}}笔</td>
              <td class="oranges">¥{{sellInfo.spareMoneyMoney}}</td>
            </tr>
            <tr>
              <td>订金</td>
              <td class="blus">{{sellInfo.subscriptionpactCount}}笔</td>
              <td class="oranges">¥{{sellInfo.subscriptionpactMoney}}</td>
            </tr>
            <tr>
              <td>退款</td>
              <td class="blus">{{sellInfo.reimburseCount}}笔</td>
              <td class="oranges">¥{{sellInfo.reimburseMoney}}</td>
            </tr>
            <tr>
              <td>合计</td>
              <td>{{sellInfo.totalCount}}笔</td>
              <td>¥{{sellInfo.totalMoney}}</td>
            </tr>
          </table>
        </div>
        <div class="operation-detail">
          <div class="title">/报表明细/</div>
          <list-day-item v-for="(item, index) in sellList" :hasTag="true" :key="index" :info="item"></list-day-item>
        </div>
      </div>
      <!-- </scroll-view> -->
    </div>
    <div class="store_chart" v-show="navIndex == 1">
      <div v-show="subNavIndex == 1">
        <div class="chart-title">门店授课排行</div>
        <div style="height: 40vh">
          <ff-canvas id="store-class" canvas-id="store-class" :opts="opts" />
        </div>
        <div class="chart-title">教练授课排行</div>
        <div style="height: 40vh">
          <ff-canvas id="coach-class" canvas-id="coach-class" :opts="opts" />
        </div>
      </div>
      <div v-show="subNavIndex == 2">
        <staff-coach-item v-for="(item, index) in coachList" :key="index" :info="item"></staff-coach-item>
      </div>
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
import F2 from "@antv/wx-f2";
import listDayItem from "../components/list-day-item";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
export default {
  data() {
    return {
      navIndex: 0,
      subNavIndex: 1,
      nav: [
        {
          navTitle: "",
          children: []
        },
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
        }
      ],
      opts: {
        lazyLoad: true
      },
      storeChartData: [],
      cartChartData: [],
      customerChartData: [],
      saleChartData: [],
      customerLineData: [], // 客流量
      filter: {
        timeStart: "",
        timeEnd: "",
        storeId: ""
      },
      sellInfo: {},
      sellList: [],
      coachList: [],
      sellPage: 1,
      coachPage: 1,
      storeList: [],
      selectedStore: {}
      // scrollViewHeight: ""
    };
  },
  mixins: [colorMixin],
  components: {
    listDayItem,
    staffCoachItem,
    filterNav
  },
  onLoad(options) {
    if (options.nav) {
      this.navIndex = options.nav;
    }
  },
  onReachBottom() {
    if (this.navIndex == 0 && this.subNavIndex == 2) {
      this.getSellList();
    }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  mounted() {
    setNavTab();
    // this.computedScrollHeight();

    this.nav[0].navTitle = "今日";
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.nav[0].navTitle = this.selectedStore.storeName;
    this.filter.storeId = this.selectedStore.storeId;
    this.nav[0].children = this.storeList.map(e => {
      return {
        sonText: e.storeName,
        action: () => {
          this.filterStore(e.storeId);
        }
      };
    });

    this.filterDate(1);
    // this.getSellInfo();
    // this.getSellList();
    // this.getCoachList();
    // this.renderChart();
  },
  methods: {
    onChange(e) {
      this.navIndex = e.mp.detail.index;
      this.changeFilter();
    },
    // renderChart() {
    //   if (this.navIndex == 0 && this.subNavIndex == 1) {
    //     this.getStoreChartData();
    //     this.getCardChartData();
    //     this.getSaleChartData();
    //     this.getCustomerChartData();
    //     this.getLineData();
    //   }
    //   if (this.navIndex == 1 && this.subNavIndex == 1) {
    //     this.getStoreClassData();
    //     this.getCoachClassData();
    //   }
    // },
    changeFilter() {
      if (this.navIndex == 0) {
        if (this.subNavIndex == 1) {
          this.getStoreChartData();
          this.getCardChartData();
          this.getSaleChartData();
          this.getCustomerChartData();
          this.getLineData();
        }
        if (this.subNavIndex == 2) {
          this.getSellInfo();
          this.getSellList();
        }
      }
      if (this.navIndex == 1) {
        if (this.subNavIndex == 1) {
          this.getStoreClassData();
          this.getCoachClassData();
        }
        if (this.subNavIndex == 2) {
          this.getCoachList();
        }
      }
    },
    changeSubNavIndex(index) {
      if (this.subNavIndex == index) {
        return;
      }
      this.subNavIndex = index;
      this.changeFilter();
    },
    // computedScrollHeight() {
    //   let that = this;
    //   let windowHeight;
    //   wx.getSystemInfo({
    //     success: function(res) {
    //       windowHeight = res.windowHeight;

    //       let query = wx.createSelectorQuery();
    //       query.select(".list-header").boundingClientRect();

    //       query.exec(res => {
    //         let infoHeight = res[0].height;
    //         let scrollViewHeight = windowHeight - infoHeight;
    //         that.scrollViewHeight = scrollViewHeight;
    //       });
    //     }
    //   });
    // },
    getStoreChartData() {
      let that = this;
      HttpRequest({
        url: window.api + "/finance/statement/pieView",
        data: {
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd
        },
        success(res) {
          that.storeChartData = res.data.data.map(e => {
            return {
              name: e.storeName,
              cost: e.cost
            };
          });
          that.$mp.page
            .selectComponent("#store")
            .init(that.initDataChart, that.storeChartData, "元");
        }
      });
    },
    getCardChartData() {
      let that = this;
      HttpRequest({
        url: window.api + "/survey/sumvolumeofcardclass",
        data: {
          storeId: that.filter.storeId,
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd
        },
        success(res) {
          that.cartChartData = res.data.data.map(e => {
            return {
              name: e.masterCardClassName,
              cost: e.cost
            };
          });
          that.$mp.page
            .selectComponent("#card")
            .init(that.initDataChart, that.cartChartData, "元");
        }
      });
    },
    getSaleChartData() {
      let that = this;
      HttpRequest({
        url: window.api + "/survey/performancepievie",
        data: {
          storeId: that.filter.storeId,
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd
        },
        success(res) {
          that.saleChartData = res.data.data.map(e => {
            return {
              name: e.userName,
              cost: e.performance
            };
          });
          that.$mp.page
            .selectComponent("#sale")
            .init(that.initDataChart, that.saleChartData, "元");
        }
      });
    },
    getCustomerChartData() {
      let that = this;
      HttpRequest({
        url: window.api + "/survey/customertype",
        data: {
          storeId: that.filter.storeId,
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd
        },
        success(res) {
          that.customerChartData = res.data.data.map(e => {
            return {
              name: e.customerClassChar,
              cost: e.count
            };
          });
          that.$mp.page
            .selectComponent("#customer")
            .init(that.initDataChart, that.customerChartData, "人");
        }
      });
    },
    getStoreClassData() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/statement/attendstrore",
        data: {
          calendarStart: that.filter.timeStart,
          calendarEnd: that.filter.timeEnd
        },
        success(res) {
          let _data = res.data.data.map(e => {
            return {
              name: e.storeName,
              cost: e.number
            };
          });
          that.$mp.page
            .selectComponent("#store-class")
            .init(that.initDataChart, _data, "节");
        }
      });
    },
    getCoachClassData() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/getcoach",
        data: {
          storeId: that.filter.storeId,
          calendarStart: that.filter.timeStart,
          calendarEnd: that.filter.timeEnd,
          status: 3
        },
        success(res) {
          let _data = res.data.data.map(e => {
            return {
              name: e.userName,
              cost: e.appointNumber
            };
          });
          that.$mp.page
            .selectComponent("#coach-class")
            .init(that.initDataChart, _data, "次");
        }
      });
    },
    initDataChart(canvas, width, height, initData, unit) {
      let sumCost = 0;
      let data = [];
      if (!initData.length) {
        data = [
          {
            name: "无",
            percent: 100,
            cost: 0
          }
        ];
      } else {
        initData.forEach(e => {
          sumCost += e.cost;
        });
        data = initData.map(e => {
          return {
            name: e.name,
            percent:
              sumCost == 0
                ? Number((1 / initData.length * 100).toFixed(2))
                : Number((e.cost / sumCost * 100).toFixed(2)),
            cost: e.cost
          };
        });
      }
      data.sort(function(a, b) {
        return b.cost - a.cost;
      });
      if (data.length > 5) {
        let otherList = data.slice(4);
        let otherObj = {
          name: "其他",
          percent: 0,
          cost: 0
        };
        otherList.forEach((e, i) => {
          otherObj.percent += e.percent;
          otherObj.cost += e.cost;
        });
        otherObj.percent = Number(otherObj.percent.toFixed(2));
        data = data.slice(0, 4);
        data.push(otherObj);
      }
      let map = {};
      data.map(function(obj) {
        map[obj.name] = obj.cost + unit + " " + obj.percent + "%";
      });
      let chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val + "%";
          }
        }
      });
      chart.tooltip(false);
      chart.legend({
        position: "right",
        itemFormatter: function itemFormatter(val) {
          return val + "    " + map[val];
        }
      });
      chart.coord("polar", {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.85
      });
      chart.axis(false);
      let colorArr = [
        "#1890FF",
        "#13C2C2",
        "#2FC25B",
        "#FACC14",
        "#F04864",
        "#8543E0"
      ];
      if (data.length < 6) {
        // 兼容手机端 圆环内显示0%的颜色BUG
        let hasCostLength = data.filter(e => e.cost > 0).length;
        if (hasCostLength >= 1) {
          colorArr = colorArr.slice(0, hasCostLength);
          for (let i=0; i < (data.length - hasCostLength); i++) {
            colorArr.push('#FFFFFF')
          }
        } else {
          colorArr = colorArr.slice(0, data.length.length);
        }
        // colorArr = colorArr.slice(0, data.length.length);
      }
      chart
        .interval()
        .position("a*percent")
        .color("name", colorArr)
        .adjust("stack");

      chart.guide().text({
        position: ["50%", "50%"],
        content: `总计：${sumCost}`,
        style: {
          fill: "#666666", // 文本颜色
          fontSize: "14", // 文本大小
          fontWeight: "bold" // 文本粗细
        }
      });
      // chart.pieLabel({
      //   sidePadding: 30,
      //   activeShape: true,
      // onClick: function onClick(ev) {
      //   var data = ev.data;
      //   if (data) {
      //     $("#title").text(data.type);
      //     $("#money").text(data.money);
      //   }
      // }
      // });
      chart.render();
    },
    getLineData() {
      let that = this;
      HttpRequest({
        url: window.api + "/survey/signlineview",
        data: {
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd
        },
        success(res) {
          that.customerLineData = res.data.data.map(e => {
            return {
              time: formatDate(new Date(e.day), "yyyy-MM-dd"),
              tem: e.count
            };
          });
          that.$mp.page
            .selectComponent("#customer-line")
            .init(that.initDataLine, that.customerLineData);
        }
      });
    },
    initDataLine(canvas, width, height, initData) {
      let data = [];
      if (!initData.length) {
        data = [
          {
            time: formatDate(new Date(), "yyyy-MM-dd"),
            tem: ""
          }
        ];
      } else {
        data = initData;
      }
      let chart = new F2.Chart({
        el: canvas,
        width,
        height
      });

      let defs = {
        time: {
          type: "timeCat",
          mask: "MM-DD",
          range: [0, 1]
        },
        tem: {
          tickCount: 5,
          min: 0,
          alias: "人"
        }
      };
      chart.source(data, defs);
      chart.tooltip({
        custom: true,
        showXTip: true,
        showYTip: true,
        showCrosshairs: true,
        snap: true,
        crosshairsType: "xy",
        crosshairsStyle: {
          lineDash: [2]
        }
      });
      chart
        .line()
        .position("time*tem")
        .shape("smooth");
      chart
        .point()
        .position("time*tem")
        .shape("smooth")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
    },
    getSellInfo() {
      let that = this;
      HttpRequest({
        url: window.api + "/user/work/mobilesell/info",
        data: {
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd,
          storeId: that.filter.storeId
        },
        success(res) {
          that.sellInfo = res.data.data;
        }
      });
    },
    getSellList() {
      let that = this;
      HttpRequest({
        url: window.api + "/finance/statement/income",
        data: {
          timeStart: that.filter.timeStart,
          timeEnd: that.filter.timeEnd,
          storeId: that.filter.storeId,
          page: that.sellPage
        },
        success(res) {
          if (res.data.code == 200) {
            let _res = res.data.data;
            let _data;
            if (!_res.result.length && that.page == 1) {
              return (that.sellList = []);
            }
            that.sellPage++;
            _data = res.data.data.result.map(e => {
              return {
                day: e.addTime.substring(8, 10),
                month: e.addTime.substring(5, 7),
                topText: `${e.customerName}(${e.pactId})`,
                bottomText: `${e.secondCardClassName}（${e.cost}元）`,
                tagText: e.purchasePatternChar
              };
            });
            if (that.sellPage == 2 || that.sellPage == 1) {
              that.sellList = _data;
            } else {
              that.sellList = that.sellList.concat(_data);
            }
          }
        }
      });
    },
    getCoachList() {
      console.log("=====getCoachList=====");
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/getcoach",
        data: {
          storeId: that.filter.storeId,
          calendarStart: that.filter.timeStart,
          calendarEnd: that.filter.timeEnd,
          status: 3
        },
        success(res) {
          that.coachList = res.data.data.map(e => {
            return {
              id: e.userId,
              cover: window.api + "/assets/img/morenm.png",
              first_1: e.userName,
              rightText: e.appointNumber + "节课"
            };
          });
        }
      });
    },
    filterDate(day) {
      if (!day || day == 0) {
        this.filter.timeEnd = "";
        this.filter.timeStart = "";
        this.sellPage = 1;
        this.coachPage = 1;
        this.changeFilter();
        return;
      }
      let date = new Date();
      const DAY = 24 * 60 * 60 * 1000;
      const HOUR8 = 8 * 60 * 60 * 1000;
      let nowStamp = date.getTime();
      let today = date.getDate() - 1;
      let weekday = date.getDay() - 1;
      if (day == 1) {
        this.filter.timeStart = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8),
          "yyyy-MM-dd hh:mm:ss"
        );
        this.filter.timeEnd = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY + DAY - HOUR8 - 1),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (day == 7) {
        this.filter.timeStart = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - weekday * DAY),
          "yyyy-MM-dd hh:mm:ss"
        );
        this.filter.timeEnd = formatDate(
          new Date(
            parseInt(nowStamp / DAY) * DAY - HOUR8 + (7 - weekday) * DAY - 1
          ),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (day == 30) {
        this.filter.timeStart = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - today * DAY),
          "yyyy-MM-dd hh:mm:ss"
        );
        this.filter.timeEnd = formatDate(
          new Date(
            parseInt(nowStamp / DAY) * DAY - HOUR8 + (30 - today) * DAY - 1
          ),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      this.sellPage = 1;
      this.coachPage = 1;
      this.changeFilter();
    },
    filterStore(id) {
      this.filter.storeId = id;
      this.sellPage = 1;
      this.coachPage = 1;
      this.changeFilter();
    }
  }
};
</script>

<style lang="less">
.operation_chart {
  .tab-nav {
    .tab-item {
      line-height: 40px;
      border-bottom: 1px solid;
    }
  }
  .chart-title {
    line-height: 38px;
    font-size: 15px;
    padding-left: 15px;
    border-bottom: 1px solid #dedede;
    color: #666;
    border-top: 1px solid #dedede;
  }
  .sub-tab {
    > div {
      display: inline-block;
      width: 50%;
      line-height: 36px;
      text-align: center;
    }
    .active {
      font-size: 16px;
      color: #000;
      font-weight: bold;
    }
  }
  .tabel-wrapper {
    > table {
      color: #666;
      > tr {
        display: flex;
        width: 100%;
        > td {
          flex: 1;
          line-height: 36px;
          font-size: 14px;
          padding: 0;
          border-right: 1px solid #e7e7e7;
          text-align: center;
        }
      }
      .blus {
        color: #00ced8;
      }
      .oranges {
        color: #f9944e;
      }
    }
  }
  .operation-detail {
    .title {
      line-height: 36px;
      text-align: center;
      background-color: #f3f3f3;
    }
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    .avatar {
      border-radius: 0px;
    }
    .coach-name {
      font-size: 16px;
      font-weight: normal;
    }
    .icon-right {
      color: #b2b4bd;
      margin-right: 15px;
    }
  }
  .mask {
    top: 48px;
  }
}
</style>
