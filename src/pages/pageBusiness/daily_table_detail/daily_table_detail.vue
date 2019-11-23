<template>
  <div class="daily-train">
    <!-- 团课 -->
    <div class="table-sum" v-if="type=='team'">
      <div class="data-item">
        <div class="num">{{tableData.times}}</div>
        <div class="text">服务人次</div>
      </div>
      <div class="data-item">
        <div class="num">{{tableData.person}}</div>
        <div class="text">出勤人数</div>
      </div>
      <div class="data-item">
        <div class="num">{{tableData.schedule}}</div>
        <div class="text">排课数</div>
      </div>
    </div>
    <!-- 私教 -->
    <div class="table-sum" v-if="type=='private'">
      <div class="data-item">
        <div class="num">{{tableData.times}}</div>
        <div class="text">服务人次</div>
      </div>
      <div class="data-item">
        <div class="num">{{tableData.person}}</div>
        <div class="text">出勤人数</div>
      </div>
    </div>
    <!-- 自主训练 -->
    <div class="table-sum" v-if="type=='train'">
      <div class="data-item">
        <div class="num">{{tableData.times}}</div>
        <div class="text">入场人次</div>
      </div>
      <div class="data-item">
        <div class="num">{{tableData.person}}</div>
        <div class="text">入场人数</div>
      </div>
    </div>
    <!-- 商品销售 -->
    <div class="table-sum" v-if="type=='goodsSell'">
      <div class="data-item">
        <div class="num">{{tableData.totalSell}}</div>
        <div class="text">总收入(元)</div>
      </div>
      <div class="data-item">
        <div class="num">{{tableData.orderNum}}</div>
        <div class="text">订单数</div>
      </div>
    </div>
    <div class="line-train-wrapper" v-if="type=='train'">
      <ff-canvas id="line-train" canvas-id="line-train" :opts="opts" />
    </div>
    <div class="line-train-wrapper" v-if="type=='team'">
      <ff-canvas id="line-team" canvas-id="line-team" :opts="opts" />
    </div>
    <div class="line-train-wrapper" v-if="type=='private'">
      <ff-canvas id="line-private" canvas-id="line-private" :opts="opts" />
    </div>
    <!-- <div class="line-train-wrapper" v-if="type=='goodsSell'">
      <ff-canvas id="line-goodsSell" canvas-id="line-goodsSell" :opts="opts" />
    </div>-->
  </div>
</template>

<script>
import { setNavTab, HttpRequest } from "COMMON/js/common.js";
import { initLine } from "../common/js/http.js";
import F2 from "@antv/wx-f2";
export default {
  data() {
    return {
      dateType: {},
      timeStart: {},
      timeEnd: {},
      tableData: {},
      storeId: '',
      type: "",
      opts: {
        lazyLoad: true
      }
    };
  },
  onUnload() {
    this.tableData = {}
  },
  onLoad(options) {
    console.log(options)
    this.dateType = JSON.parse(options.dateType);
    this.tableData = JSON.parse(options.data);
    this.type = options.type;
    this.storeId = options.storeId;
    this.timeStart =
      options.timeStart ||
      formatDate(new Date(new Date().setHours(0, 0, 0, 0)), "yyyy-MM-dd") +
        " 00:00:00";
    this.timeEnd =
      options.timeEnd ||
      formatDate(new Date(new Date().setHours(0, 0, 0, 0)), "yyyy-MM-dd") +
        " 23:59:59";
    let timer;
    if (this.dateType.key == "day") {
      timer = `(${this.timeStart.slice(5, 10)})`;
    }
    if (this.dateType.key == "week") {
      timer = `(${this.timeStart.slice(5, 10)}~${this.timeEnd.slice(5, 10)})`;
    }
    if (this.dateType.key == "month") {
      timer = `(${this.timeStart.slice(5, 7)}月)`;
    }
    this.$nextTick(() => {
      if (this.type == "train") {
        setNavTab(`自主训练${timer}`);
        this.getTrain();
      }
      if (this.type == "team") {
        setNavTab(`团课${timer}`);
        this.getTeam();
      }
      if (this.type == "private") {
        setNavTab(`私教${timer}`);
        this.getPrivate();
      }
      if (this.type == "goodsSell") {
        setNavTab(`商品销售${timer}`);
      }
    });
  },
  methods: {
    getTrain() {
      let that = this;
      HttpRequest({
        url: "/finance/statement/mini/signtotal",
        data: {
          timeStart: that.timeStart,
          timeEnd: that.timeEnd,
          storeId: that.storeId
        },
        success(res) {
          let data = [];
          for (let k in res.data.data) {
            console.log(k);
            console.log(res.data.data[k]);
            data.push({
              time: k.replace(/-/g, "/"),
              tem: res.data.data[k]
            });
          }
          that.$nextTick(() => {
            that.$mp.page.selectComponent("#line-train").init(initLine, data);
          });
        }
      });
    },
    getTeam() {
      let that = this;
      HttpRequest({
        url: "/teamClass/teamScheduleTotal",
        data: {
          timeStart: that.timeStart,
          timeEnd: that.timeEnd,
          storeId: that.storeId
        },
        success(res) {
          let map = {};
          let totalCost = 0;
          let res_data = res.data.data;
          res_data.forEach(e => {
            totalCost += e.scheduleNum;
          });
          let data = res_data.map((e, index) => {
            map[e.anotherName] =
              totalCost == 0
                ? e.scheduleNum +
                  "节 " +
                  parseInt(Number(1 / res_data.length * 100)) +
                  "%"
                : e.scheduleNum +
                  "节 " +
                  parseInt(Number(e.scheduleNum) / totalCost * 100) +
                  "%";
            return {
              name: e.anotherName,
              percent:
                totalCost == 0
                  ? Number(Number(1 / res_data.length).toFixed(2))
                  : Number((Number(e.scheduleNum) / totalCost).toFixed(2)),
              cost: e.scheduleNum,
              a: "1"
            };
          });
          that.$mp.page
            .selectComponent("#line-team")
            .init(that.initPieChart, data, map);
        }
      });
    },
    getPrivate() {
      let that = this;
      HttpRequest({
        url: "/mobile/coach/getcoach",
        data: {
          storeId: that.storeId,
          calendarStart: that.timeStart,
          calendarEnd: that.timeEnd,
          status: 3
        },
        success(res) {
          let map = {};
          let totalCost = 0;
          let res_data = res.data.data;
          res_data.forEach(e => {
            totalCost += e.appointNumber;
          });
          let data = res_data.map(e => {
            // map[e.userName] =
            //   totalCost == 0
            //     ? Number((1 / res_data.length * 100).toFixed(2))
            //     : Number((e.appointNumber / totalCost * 100).toFixed(2));
            return {
              name: e.userName,
              cost: e.appointNumber,
              percent:
                totalCost == 0
                  ? Number((1 / res_data.length * 100).toFixed(2))
                  : Number((Number(e.appointNumber) / totalCost).toFixed(2)),
              a: "1"
            };
          });
          data.sort(function(a, b) {
            return b.percent - a.percent;
          });
          if (data.length > 5) {
            let otherList = data.slice(4);
            let otherObj = {
              name: "其他",
              percent: 0,
              cost: 0,
              a: "1"
            };
            otherList.forEach((e, i) => {
              otherObj.percent += e.percent;
              otherObj.cost += e.cost;
            });
            otherObj.percent = Number(otherObj.percent.toFixed(2));
            data = data.slice(0, 4);
            data.push(otherObj);
          }
          data.map(function(obj) {
            map[obj.name] = obj.cost + "次 " + obj.percent + "%";
          });
          that.$mp.page
            .selectComponent("#line-private")
            .init(that.initPieChart, data, map);
        }
      });
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
        });

      chart.render();
      return chart;
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.daily-train {
  .table-sum {
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
      }
    }
  }
  .line-train-wrapper {
    box-sizing: border-box;
    padding-right: 10px;
    height: 40vh;
    background-color: #fff;
    #line-train {
      height: 100;
      width: 100%;
    }
  }
}
</style>