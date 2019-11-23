<template>
  <div class="daily-member">
    <div class="active-people">本月累计活跃会员数：{{monthActiveNum}}人</div>
    <div class="chart">
      <div class="pie-chart-wrapper" style="height: 300rpx;">
        <ff-canvas id="daily-member-chart" canvas-id="daily-member-chart" :opts="opts" />
      </div>
    </div>
    <div class="daily-member-sum">
      <div class="data-item">
        <div class="num">{{memberData.memberAll}}</div>
        <div class="text">全部会员数</div>
      </div>
      <div class="data-item">
        <div class="num">{{memberData.attend}}</div>
        <div class="text">
          <span class="dot"></span>
          当{{dateType.char}}活跃会员数
        </div>
      </div>
    </div>
    <div class="new-data">
      <div class="title">当{{dateType.char}}新增</div>
      <div class="new-data-table">
        <div class="data-item">
          <div class="num">{{memberData.newCard}}</div>
          <div class="text">新购卡会员</div>
        </div>
        <div class="data-item">
          <div class="num">{{memberData.newEntry}}</div>
          <div class="text">新注册会员</div>
        </div>
        <div class="data-item">
          <div class="num">{{memberData.trackNum}}</div>
          <div class="text">跟进新用户数</div>
        </div>
        <div class="data-item">
          <div class="num">{{memberData.serviceNum}}</div>
          <div class="text">会员维护数</div>
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
  formatDate,
  filterDateMethod
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
import F2 from "@antv/wx-f2";
// https://github.com/antvis/wx-f2 wx-f2 图表文档
export default {
  data() {
    return {
      opts: {
        lazyLoad: true
      },
      dateType: {},
      timeStart: "",
      timeEnd: "",
      storeId: "",
      memberData: {},
      monthActiveNum: 0
    };
  },
  onUnload() {
    this.memberData = {};
  },
  onLoad(options) {
    this.storeId = options.storeId;
    this.memberData = JSON.parse(options.memberData);
    this.dateType = JSON.parse(options.dateType);
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
    this.getMonthActive();
    this.$nextTick(() => {
      setTimeout(() => {
        this.$mp.page
          .selectComponent("#daily-member-chart")
          .init(this.initPieChart);
      }, 20);
    });
  },
  methods: {
    initPieChart(canvas, width, height) {
      let chart = null;
      let _percent =
        this.memberData.memberAll == 0
          ? 1
          : this.memberData.attend / this.memberData.memberAll;
      console.log(_percent);
      // const map = {
      //   当日活跃会员数: parseInt(_percent * 100) + "%",
      //   其他: 100 - parseInt(_percent * 100) + "%"
      // };
      const data = [
        {
          name: `当${this.dateType.char}活跃会员数`,
          percent: Number(_percent.toFixed(2)),
          a: "1"
        },
        { name: "其他", percent: 1 - _percent.toFixed(2), a: "1" }
      ];
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
      // chart.legend({
      //   position: "right",
      //   itemFormatter(val) {
      //     return val + "  " + map[val];
      //   }
      // });
      chart.legend(false);
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
          "#1ad193",
          "#0c9cf0",
          "#2FC25B",
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
        });

      chart.render();
      return chart;
    },
    // 获取本月活跃人数
    getMonthActive() {
      let monthDate = filterDateMethod("month");
      let that = this;
      HttpRequest({
        url: "/attendance/record/attendCount",
        data: {
          timeStart: monthDate.startTime,
          timeEnd: monthDate.timeEnd,
          storeId: that.storeId
        },
        success(res) {
          that.monthActiveNum = res.data.data;
        }
      });
    }
  }
};
</script>

<style lang="less">
page {
  background-color: #f6f6f6;
}
.daily-member {
  .active-people {
    padding-top: 20px;
    padding-left: 15px;
    font-size: 12px;
    color: #666;
    background-color: #fff;
  }
  .chart {
    background-color: #fff;
  }
  .daily-member-sum {
    display: flex;
    margin-bottom: 10px;
    background-color: #fff;
    .data-item {
      flex: 1;
      text-align: center;
      padding: 10px 0;
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
          background-color: #1ad193;
        }
      }
    }
  }
  .new-data {
    background-color: #fff;
    .title {
      line-height: 54px;
      font-weight: bold;
      padding-left: 16px;
      font-size: 15px;
      border-bottom: 1rpx solid #eee;
    }
    .new-data-table {
      display: grid;
      grid-template-columns: repeat(2, 50%);
      grid-template-rows: repeat(2, 50%);
      .data-item {
        text-align: center;
        padding-top: 25px;
        padding-bottom: 16px;
        &:nth-of-type(1) {
          border-right: 1rpx solid #eee;
          border-bottom: 1rpx solid #eee;
        }
        &:nth-last-of-type(1) {
          border-left: 1rpx solid #eee;
          border-top: 1rpx solid #eee;
        }
        .num {
          font-size: 16px;
        }
        .text {
          font-size: 13px;
          margin-top: 5px;
          color: #666;
        }
      }
    }
  }
}
</style>