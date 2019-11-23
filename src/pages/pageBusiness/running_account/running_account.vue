<template>
  <div class="running-account">
    <div class="turnover-wrapper">
      <div class="turnover-sum">
        <div class="data-sum">
          <div class="sum-text">本{{dateType.char}}销售总收入(元)</div>
          <div class="sum-num">{{sumData.totalCost}}</div>
        </div>
        <div class="turnover-row">
          <div class="data-item">
            <div class="text">较前一{{dateType.char}}增长(元)</div>
            <div class="num">{{sumData.yesterdayCostUp}}</div>
          </div>
          <div class="data-item">
            <div class="text">增幅</div>
            <div class="num">{{sumData.gain}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="account-chart-wrapper" style="height: 420rpx;">
      <ff-canvas id="account-chart" canvas-id="account-chart" :opts="opts" />
    </div>
    <div class="account-table">
      <tr>
        <td>类型</td>
        <td>当日收入(元)</td>
      </tr>
      <tr v-for="(item, index) in accountTable" :key="index">
        <td class="account-text">
          <div>{{item.name}}</div>
          <div class="desc" v-if="item.desc">{{item.desc}}</div>
        </td>
        <td>{{item.num}}</td>
      </tr>
    </div>
    <div class="member-data-wrapper">
      <div class="data-sum">
        <div class="sum-text">会员卡销售收入(元)</div>
        <div class="sum-num">{{memberTable.totalSell}}</div>
      </div>
      <div class="member-chart-wrapper" style="height: 300rpx;">
        <ff-canvas id="member-chart" canvas-id="member-chart" :opts="opts" />
      </div>
      <div class="member-sum">
        <div class="data-item">
          <div class="num">{{memberTable.dayCard}}</div>
          <div class="text">
            <span class="dot red"></span>期限卡(元)
          </div>
        </div>
        <div class="data-item">
          <div class="num">{{memberTable.timesCard}}</div>
          <div class="text">
            <span class="dot blue"></span>次卡(元)
          </div>
        </div>
        <div class="data-item">
          <div class="num">{{memberTable.valueCard}}</div>
          <div class="text">
            <span class="dot green"></span>储值卡(元)
          </div>
        </div>
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
import F2 from "@antv/wx-f2";

export default {
  data() {
    return {
      accountTable: [],
      memberTable: {},
      timeStart: "",
      timeEnd: "",
      storeId: "",
      sumData: {},
      dateType: {},
      opts: {
        lazyLoad: true
      }
    };
  },
  onUnload() {
    this.sumData = {}
    this.accountTable = []
  },
  onLoad(options) {
    let data = JSON.parse(options.data);
    this.accountTable = data.map((e, index) => {
      return {
        name: e.businessTypeChar,
        num: e.totalCostStr.replace(/\([^\)]*\)/g,"")
      };
    });
    this.sumData = JSON.parse(options.sumData);
    this.dateType = JSON.parse(options.dateType);
    this.storeId = options.storeId;
    this.timeStart =
      options.timeStart ||
      formatDate(new Date(new Date().setHours(0, 0, 0, 0)), "yyyy-MM-dd") +
        " 00:00:00";
    this.timeEnd =
      options.timeEnd ||
      formatDate(new Date(new Date().setHours(0, 0, 0, 0)), "yyyy-MM-dd") +
        " 23:59:59";
    if (this.dateType.key == "day") {
      setNavTab(`运营流水(${this.timeStart.slice(5, 10)})`);
    }
    if (this.dateType.key == "week") {
      setNavTab(
        `运营流水(${this.timeStart.slice(5, 10)}~${this.timeEnd.slice(5, 10)})`
      );
    }
    if (this.dateType.key == "month") {
      setNavTab(`运营流水(${this.timeStart.slice(5, 7)}月)`);
    }
  },
  mounted() {
    // setNavTab();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getAccountChart();
      }, 20);
    });
    this.getMemberChart();
  },
  methods: {
    getMemberChart() {
      let that = this;
      HttpRequest({
        url: "/finance/statement/mini/memberSell",
        data: {
          timeStart: that.timeStart,
          timeEnd: that.timeEnd,
          storeId: that.storeId
        },
        success(res) {
          let obj = res.data.data;
          that.memberTable = obj;
          let map = {
            期限卡:
              obj.totalSell == 0
                ? "33%"
                : Number(obj.dayCard / obj.totalSell * 100) + "%",
            次卡:
              obj.totalSell == 0
                ? "33%"
                : Number(obj.timesCard / obj.totalSell * 100) + "%",
            储值卡:
              obj.totalSell == 0
                ? "33%"
                : Number(obj.valueCard / obj.totalSell * 100) + "%"
          };
          let data = [
            {
              name: "期限卡",
              percent:
                obj.totalSell == 0
                  ? 0.33
                  : Number((obj.dayCard / obj.totalSell).toFixed(2)),
              a: "1"
            },
            {
              name: "次卡",
              percent:
                obj.totalSell == 0
                  ? 0.33
                  : Number((obj.timesCard / obj.totalSell).toFixed(2)),
              a: "1"
            },
            {
              name: "储值卡",
              percent:
                obj.totalSell == 0
                  ? 0.33
                  : Number((obj.valueCard / obj.totalSell).toFixed(2)),
              a: "1"
            }
          ];
          that.$nextTick(() => {
            that.$mp.page
              .selectComponent("#member-chart")
              .init(that.initPieChart, data, map);
          });
        }
      });
    },
    getAccountChart() {
      let _accountTable = [];
      let totalCost = 0;
      let map = {};
      let data = [];
      this.accountTable.forEach(e => {
        if (e.name != "合计") {
          _accountTable.push(e);
        } else {
          totalCost = Number(e.num);
        }
      });
      data = _accountTable.map((e, index) => {
        map[e.name] =
          totalCost == 0
            ? parseInt(1 / data.length * 100) + "%"
            : parseInt(Number(e.num) / totalCost * 100) + "%";
        return {
          name: e.name,
          percent:
            totalCost == 0
              ? Number((1 / data.length).toFixed(2))
              : Number((Number(e.num) / totalCost).toFixed(2)),
          a: "1"
        };
      });

      this.$mp.page
        .selectComponent("#account-chart")
        .init(this.initPieChart, data, map);
    },
    initPieChart(canvas, width, height, wData, wMap) {
      let chart = null;
      let map = wMap;
      let data = wData;
      if (!data.length) {
        map = { 无: "100%" };
        data = [
          {
            name: "无",
            percent: 1,
            a: "1"
          }
        ];
      }
      chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        percent: {
          formatter(val) {
            return val * 100 + "%";
          }
        }
      });
      chart.legend({
        position: "right",
        itemFormatter(val) {
          return val + "  " + map[val];
        }
      });
      chart.tooltip(false);
      chart.coord("polar", {
        transposed: true,
        radius: 0.85
      });
      chart.axis(false);
      chart
        .interval()
        .position("a*percent")
        .color("name", [
          "#ff6955",
          "#60bcf5",
          "#1ad193",
          "#FACC14",
          "#F04864",
          "#8543E0"
        ])
        .adjust("stack")
        .style({
          lineWidth: 1,
          stroke: "#fff",
          lineJoin: "round",
          lineCap: "round"
        })
        // .animate({
        //   appear: {
        //     duration: 1200,
        //     easing: "bounceOut"
        //   }
        // });

      chart.render();
      return chart;
    }
  }
};
</script>

<style lang="less">
page {
  background-color: #f6f6f6;
}
.running-account {
  .data-sum {
    text-align: center;
    padding: 25px 0px 10px 0;
    .sum-text {
      font-size: 15px;
      color: #666;
    }
    .sum-num {
      margin-top: 6px;
      font-size: 19px;
      font-weight: bold;
      color: #119bf0;
    }
  }
  .turnover-wrapper {
    background-color: #fff;
    margin-bottom: 5px;
    .turnover-sum {
      .turnover-row {
        display: flex;
        height: 66px;
        .data-item {
          flex: 1;
          text-align: center;
          margin: 10px 0;
          &:nth-of-type(n + 1) {
            border-left: 1rpx solid #eee;
          }
          .num {
            font-size: 18px;
            font-weight: bold;
            margin: 3px 0;
            color: #f95d51;
          }
          .text {
            font-size: 13px;
            color: #666;
          }
        }
      }
    }
  }
  .account-chart-wrapper {
    background-color: #fff;
  }
  .account-table {
    background-color: #fff;
    margin-bottom: 5px;
    > tr {
      &:nth-of-type(2n) {
        background-color: #f6f6f6;
      }
      display: flex;
      border-top: 1rpx solid #eee;
      > td {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 42px;
        text-align: center;
        font-size: 13ox;
        color: #333;
        &:nth-of-type(2n) {
          border-left: 1rpx solid #eee;
        }
      }
      .account-text {
        .desc {
          color: #666;
          font-size: 10px;
        }
      }
    }
  }
  .member-data-wrapper {
    background-color: #fff;
    .member-sum {
      display: flex;
      margin-bottom: 10px;
      background-color: #fff;
      .data-item {
        flex: 1;
        text-align: center;
        margin: 10px 0;
        &:nth-of-type(n + 1) {
          border-left: 1rpx solid #eee;
        }
        .num {
          font-size: 18px;
          font-weight: bold;
          margin: 3px 0;
          color: #333;
        }
        .text {
          font-size: 13px;
          color: #666;
          .dot {
            display: inline-block;
            vertical-align: middle;
            width: 4px;
            height: 4px;
            margin-right: 5px;
            border-radius: 50%;
            background-color: ;
            &.red {
              background-color: #ff6955;
            }
            &.blue {
              background-color: #60bcf5;
            }
            &.green {
              background-color: #1ad193;
            }
          }
        }
      }
    }
  }
}
</style>