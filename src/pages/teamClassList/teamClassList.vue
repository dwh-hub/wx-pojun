<template>
  <div class="team-class-list">
    <div class="date-group">
      <div class="date-month">
        <div
          class="month-item"
          v-for="(item, index) in dayArray"
          :key="index"
          :class="{active: selectDateIndex == index}"
        >{{item}}</div>
      </div>
      <div class="date-week">
        <div class="week-item" v-for="(item, index) in weekArray" :key="index">
          <div class="item-round" :class="{active: selectDateIndex == index}" @click="selectWeek(index)">{{item}}</div>
        </div>
      </div>
    </div>
    <div class="nav-tab">
      <div class="store" :class="{active: currentNav==1}" @click="selectAllStore">全部门店</div>
      <div class="class" :class="{active: currentNav==2}" @click="selectAllClass">全部课程</div>
      <div class="time" :class="{active: currentNav==3}" @click="selectAllTime">全部时间</div>
      <div class="coach" :class="{active: currentNav==4}" @click="selectAllCoach">全部教练</div>
    </div>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
export default {
  data() {
    return {
      selectDate: "",
      // 今天至今天+6的日期
      weekArray: [],
      dayArray: [],
      curWeek: "",
      curDay: "",
      currentNav: 1,
      selectDateIndex: 0
    };
  },
  onLoad() {
    setNavTab("", "#2a82e4");
    this.getDateArray();
  },
  methods: {
    // 获取今天至今天+6的日期
    getDateArray() {
      let date = new Date();
      let week = [
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日"
      ];
      let _weekArray = [];
      let _dayArray = [];
      let day = date.getDate();
      let weekIndex = date.getDay();
      this.curWeek = week[weekIndex - 1];
      this.curDay = day;

      for (let i = 0; i < 7; i++) {
        _weekArray.push(week[weekIndex - 1 + i]);
        _dayArray.push(day + i);
      }
      this.weekArray = _weekArray;
      this.dayArray = _dayArray;
    },
    selectWeek(index) {
      this.selectDateIndex = index
    },
    selectAllStore() {
      this.currentNav = 1;
    },
    selectAllClass() {
      this.currentNav = 2;
    },
    selectAllTime() {
      this.currentNav = 3;
    },
    selectAllCoach() {
      this.currentNav = 4;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.team-class-list {
  .date-group {
    padding: 5px 0;
    .date-month,
    .date-week {
      display: flex;
      > div {
        flex: 1;
        text-align: center;
      }
    }
    .date-month {
      .month-item {
        &.active {
          color: @theme-color;
        }
      }
    }
    .date-week {
      margin-top: 5px;
      .week-item {
        .item-round {
          border-radius: 50%;
          width: 80%;
          height: 11.4vw;
          line-height: 11.4vw;
          margin-left: 10%;
          &.active {
            background-color: @theme-color;
            color: #fff;
          }
        }
      }
    }
  }
  .nav-tab {
    display: flex;
    > div {
      flex: 1;
      line-height: 42px;
      text-align: center;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      border-right: 1rpx solid #eee;
      &:nth-last-of-type(1) {
        border-right: none;
      }
      &.active {
        color: @theme-color;
      }
    }
  }
}
</style>


  