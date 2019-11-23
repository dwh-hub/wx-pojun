<template>
  <div class="daily-paper">
    <div class="company-base-info" :style="{'background-color': themeColor}">
      <div class="cover">
        <img :src="window.api + companyInfo.logimage" alt />
      </div>
      <div class="company-info">
        <div class="company-name">{{companyInfo.name}}</div>
        <div class="company-desc"></div>
      </div>
      <div class="store-select" @click="showStore = !showStore">
        <span class="store-text">{{selectedStore.storeName}}</span>
        <i class="triangle-icon"></i>
      </div>
      <div class="store-list" v-if="showStore">
        <div
          class="store-item"
          @click="selcetStore(item)"
          v-for="(item, index) in storeList"
          :key="index"
        >{{item.storeName}}</div>
      </div>
    </div>
    <div class="surface">
      <div class="circular" :style="{'background-color': themeColor}"></div>
    </div>
    <div class="turnover-wrapper">
      <filter-date @changeDate="setDate"></filter-date>
      <div class="turnover-sum">
        <div class="data-sum" @click="skipPage('../running_account/main')">
          <div class="sum-text">本{{dateType.char}}销售总收入(元)</div>
          <div class="sum-num">{{sumData.totalCost}}</div>
          <img src="/static/images/staff/right-arrow.svg" alt />
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
    <div class="daily-table-wrapper">
      <div class="daily-subtitle">经营状况</div>
      <div class="daily-table" @click="skipPage('../daily_table_detail/main', 'team')">
        <div class="table-title">团课</div>
        <div class="table-data">
          <div class="table-data-item">
            <div class="hit">{{teamData.times}}</div>
            <div class="text">服务人次</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{teamData.person}}</div>
            <div class="text">出勤人数</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{teamData.schedule}}</div>
            <div class="text">排课数</div>
          </div>
        </div>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </div>
      <div class="daily-table" @click="skipPage('../daily_table_detail/main', 'private')">
        <div class="table-title">私教</div>
        <div class="table-data">
          <div class="table-data-item">
            <div class="hit">{{privateData.times}}</div>
            <div class="text">服务人次</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{privateData.person}}</div>
            <div class="text">出勤人数</div>
          </div>
        </div>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </div>
      <div class="daily-table" @click="skipPage('../daily_table_detail/main', 'train')">
        <div class="table-title">自主训练</div>
        <div class="table-data">
          <div class="table-data-item">
            <div class="hit">{{normalData.times}}</div>
            <div class="text">入场人次</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{normalData.person}}</div>
            <div class="text">入场人数</div>
          </div>
        </div>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </div>
      <div class="daily-table" @click="skipPage('../daily_table_detail/main', 'goodsSell')">
        <div class="table-title">商品销售</div>
        <div class="table-data">
          <div class="table-data-item">
            <div class="hit">{{goodsSellData.totalSell}}</div>
            <div class="text">总收入(元)</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{goodsSellData.orderNum}}</div>
            <div class="text">订单数</div>
          </div>
        </div>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </div>
      <div class="daily-subtitle">会员</div>
      <div class="daily-table" @click="skipPage('../daily_member/main')">
        <div class="table-data">
          <div class="table-data-item">
            <div class="hit">{{memberData.memberAll}}</div>
            <div class="text">全部会员数</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{memberData.attend}}</div>
            <div class="text">出勤人数</div>
          </div>
          <div class="table-data-item">
            <div class="hit">{{memberData.newCard}}</div>
            <div class="text">新购卡会员数</div>
          </div>
        </div>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </div>
    </div>
    <div class="mask" @click="showStore = false" v-if="showStore"></div>
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
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import filterDate from "../components/filter-date.vue";

export default {
  data() {
    return {
      storeList: [],
      selectedStore: {},
      companyInfo: {},
      showStore: false,
      timeStart:
        formatDate(new Date(new Date().setHours(0, 0, 0, 0)), "yyyy-MM-dd") +
        " 00:00:00",
      timeEnd:
        formatDate(new Date(new Date().setHours(0, 0, 0, 0)), "yyyy-MM-dd") +
        " 23:59:59",
      // 收入列表
      allSumData: [],
      // 总收入table
      sumData: {
        totalCost: "",
        yesterdayCostUp: "",
        gain: ""
      },
      // 筛选时间类型 日 周 月
      dateType: {
        char: "日",
        key: "day"
      },
      // 团课
      teamData: {},
      // 私教
      privateData: {},
      // 自主训练
      normalData: {},
      // 商品销售
      goodsSellData: {},
      // 会员
      memberData: {}
    };
  },
  mixins: [colorMixin],
  components: {
    filterDate
  },
  mounted() {
    setNavTab();
    let storeList = store.state.allStore;
    if (storeList[0].storeId) {
      storeList.unshift({
        storeName: "所有门店",
        storeId: ""
      });
    }
    this.storeList = storeList;
    this.selectedStore =
      this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this.getCompanyInfo();
    this.getAllData();
  },
  computed: {
    window() {
      return window;
    }
  },
  methods: {
    getAllData() {
      this.getSumData();
      this.getDataTable();
    },
    getCompanyInfo() {
      let that = this;
      HttpRequest({
        url: "/system/set/wxcompanyinfo",
        data: {
          companyId: wx.getStorageSync("companyId") || ""
        },
        success(res) {
          that.companyInfo = JSON.parse(res.data.data.baseInfo);
        }
      });
    },
    // 获取头部统计数据
    getSumData() {
      let todayStamp = new Date().setHours(0, 0, 0, 0);
      let sumData = {
        totalCost: "",
        yesterdayCostUp: "",
        gain: ""
      };
      let _timeStart =
        this.timeStart ||
        formatDate(new Date(todayStamp), "yyyy-MM-dd") + " 00:00:00";
      let _timeEnd =
        this.timeEnd ||
        formatDate(new Date(todayStamp), "yyyy-MM-dd") + " 23:59:59";

      let lastObj = {};
      if (this.dateType.key == "day") {
        lastObj = filterDateMethod("yesterday");
      }
      if (this.dateType.key == "week") {
        lastObj = filterDateMethod("lastWeek");
      }
      if (this.dateType.key == "month") {
        lastObj = filterDateMethod("lastMonth");
      }
      let lastTimeStart = lastObj.startTime;
      let lastTimeEnd = lastObj.endTime;
      // let _timeStartStamp =
      //   new Date(_timeStart.replace(/-/g, "/")).getTime() - 24 * 60 * 60 * 100;
      // let _timeEndStamp =
      //   new Date(_timeEnd.replace(/-/g, "/")).getTime() - 24 * 60 * 60 * 100;

      this.getSumDataMehod(_timeStart, _timeEnd, true).then(res => {
        sumData.totalCost = res.totalCostStr;
        this.getSumDataMehod(lastTimeStart, lastTimeEnd).then(y_res => {
          sumData.yesterdayCostUp = (
            sumData.totalCost - y_res.totalCostStr
          ).toFixed(2);
          // let _gain = (
          //   Number(y_res.totalCostStr) / Number(sumData.totalCost)
          // ).toFixed(2) || '0.00';
          let _gain;
          if (Number(y_res.totalCostStr) === 0) {
            _gain = 0.0;
          } else if (Number(sumData.totalCost) === 0) {
            _gain = 0.0;
          } else {
            _gain =
              (
                (sumData.totalCost - y_res.totalCostStr) /
                Number(y_res.totalCostStr) *100
              ).toFixed(2) || "0.00";
          }
          sumData.gain =
            sumData.yesterdayCostUp < 0 ? `${_gain}%` : `+${_gain}%`;
          this.sumData = sumData;
        });
      });
    },
    getSumDataMehod(timeStart, timeEnd, isNowData = false) {
      let that = this;
      return new Promise((resolve, reject) => {
        HttpRequest({
          url: "/finance/statement/mini/ordertotal",
          data: {
            timeStart: timeStart,
            timeEnd: timeEnd,
            storeId: that.selectedStore.storeId
          },
          success(res) {
            let _sumData;
            if (isNowData) {
              that.allSumData = res.data.data;
            }
            res.data.data.forEach(e => {
              if (e.businessTypeChar == "合计") {
                _sumData = e;
              }
            });
            resolve(_sumData);
          }
        });
      });
    },
    // 获取运营状况数据
    getDataTable() {
      let that = this;
      HttpRequest({
        url: "/finance/statement/mini/incomestatus",
        data: {
          timeStart:
            that.timeStart ||
            formatDate(
              new Date(new Date().setHours(0, 0, 0, 0)),
              "yyyy-MM-dd"
            ) + " 00:00:00",
          timeEnd:
            that.timeEnd ||
            formatDate(
              new Date(new Date().setHours(0, 0, 0, 0)),
              "yyyy-MM-dd"
            ) + " 23:59:59",
          storeId: that.selectedStore.storeId
        },
        success(res) {
          res.data.data.forEach((e, index) => {
            if (e.type == "team") that.teamData = e;
            if (e.type == "private") that.privateData = e;
            if (e.type == "normal") that.normalData = e;
            if (e.type == "goodsSell") that.goodsSellData = e;
            if (e.type == "member") that.memberData = e;
          });
        }
      });
    },
    setDate(obj) {
      this.timeStart = obj.startTime;
      this.timeEnd = obj.endTime;
      this.dateType.key = obj.type;
      this.dateType.char = this.trnasDate(obj.type);
      this.getAllData();
    },
    trnasDate(str) {
      switch (str) {
        case "day":
          return "日";
        case "week":
          return "周";
        case "month":
          return "月";
      }
    },
    skipPage(url, type) {
      let _url = `${url}?storeId=${
        this.selectedStore.storeId
      }&dateType=${JSON.stringify(this.dateType)}&timeStart=${
        this.timeStart
      }&timeEnd=${this.timeEnd}`;
      if (url.includes("running_account")) {
        // _url = _url + "&data=" + JSON.stringify(this.allSumData);
        _url = `${_url}&data=${JSON.stringify(
          this.allSumData
        )}&sumData=${JSON.stringify(this.sumData)}`;
      }
      if (url.includes("daily_member")) {
        _url = _url + "&memberData=" + JSON.stringify(this.memberData);
      }
      if (url.includes("daily_table_detail")) {
        if (type == 'train') {
          _url = `${_url}&data=${JSON.stringify(this.normalData)}&type=${type}`;
        }
        if (type == 'team') {
          _url = `${_url}&data=${JSON.stringify(this.teamData)}&type=${type}`;
        }
        if (type == 'private') {
          _url = `${_url}&data=${JSON.stringify(this.privateData)}&type=${type}`;
        }
        if (type == 'goodsSell') {
          _url = `${_url}&data=${JSON.stringify(this.goodsSellData)}&type=${type}`;
        }
      }
      wx.navigateTo({
        url: _url
      });
    },
    selcetStore(item) {
      this.showStore = false;
      this.selectedStore = item;
      this.getAllData();
    }
  }
};
</script>

<style lang="less">
.daily-paper {
  .company-base-info {
    position: relative;
    display: flex;
    background-color: #fff;
    padding: 10px 30px 15px;
    .cover {
      flex: 0 0 44px;
      width: 44px;
      height: 44px;
      > image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .company-info {
      flex: 1;
      padding-left: 12px;
      > div {
        line-height: 22px;
        color: #fff;
      }
      .company-name {
        font-weight: bold;
      }
      .company-desc {
        font-size: 12px;
      }
    }
    .store-select {
      position: absolute;
      top: 12px;
      right: 30px;
      padding: 10px 5px;
      .store-text {
        display: inline-block;
        vertical-align: middle;
        color: #fff;
      }
      .triangle-icon {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 14px;
        margin-left: 5px;
        margin-bottom: 2px;
        background-size: 100%;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAj0lEQVQ4T92TsQ3CUAwF7zZgAEagYATEBAzAAJRsQs0ANGkYAVZASKxAxwg8FJQChSRS9LtYcmW9k/1sS2FYqGeKgCQroM6uqNTHb+HPgyRL4ALMWoQXsFZvg4C6mGQPHFqAnXpst9W7hSRnYNMITuq2a6YhwBy4A29goT5HAZpRvmaq176Dm+IhjX2uYg8+HDAfEQ9s5NoAAAAASUVORK5CYII=");
        transition: transform 0.3s;
        background-repeat: no-repeat;
        &.active {
          transform: rotate(-180deg);
        }
      }
    }
    .store-list {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 100%;
      z-index: 100;
      background-color: #fff;
      .store-item {
        width: 100%;
        line-height: 42px;
        padding-left: 15px;
        box-shadow: none;
        border-radius: 0px;
        border-bottom: 1rpx solid #eee;
      }
    }
  }
  .surface {
    position: relative;
    height: 75px;
    margin-top: -1px;
    overflow: hidden;
    z-index: -1;
    .circular {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 500px;
      height: 100px;
      border-radius: 50%;
    }
  }

  .turnover-wrapper {
    position: relative;
    margin-top: -80px;
    .filter-date {
      top: 0;
      transform: translate(-50%, -50%);
      box-shadow: 0px -1px 3px 1px rgba(23, 128, 192, 0.19);
    }
    .turnover-sum {
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0px 2px 7px 0px rgba(1, 60, 97, 0.1);
      margin: 20px 10px 5px 10px;
      .data-sum {
        position: relative;
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
        > img {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
        }
      }
      .turnover-row {
        display: flex;
        height: 66px;
        .data-item {
          flex: 1;
          text-align: center;
          padding: 10px 0;
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
  .daily-table-wrapper {
    padding: 0 10px;
    box-sizing: border-box;
    .daily-subtitle {
      height: 15px;
      margin-top: 16px;
      margin-bottom: 15px;
      line-height: 15px;
      font-size: 15px;
      padding-left: 5px;
      border-left: 2px solid #119bf0;
      color: #333;
      font-weight: bold;
    }
    .daily-table {
      position: relative;
      box-shadow: 0px 2px 7px 0px rgba(1, 60, 97, 0.1);
      border-radius: 5px;
      padding: 12px 0 16px 16px;
      margin-bottom: 10px;
      .table-title {
        font-size: 16px;
        color: #333;
      }
      .table-data {
        .table-data-item {
          display: inline-block;
          width: 90px;
          margin-top: 18px;
          .hit {
            font-weight: bold;
            font-size: 17px;
          }
          .text {
            margin-top: 8px;
            font-size: 12px;
            color: #666;
          }
        }
      }
      > img {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
      }
    }
  }
  .mask {
    position: fixed;
    top: 75px;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>