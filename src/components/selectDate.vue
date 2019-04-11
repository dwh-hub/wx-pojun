<template>
  <div class="select-date">
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
        <div
          class="item-round"
          :class="{active: selectDateIndex == index}"
          @click="selectWeek(index)"
        >{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "COMMON/js/common.js";
export default {
  data() {
    return {
      // 今天至今天+6的日期
      weekArray: [],
      dayArray: [],
      dateArray: [],
      curWeek: "",
      curDay: "",
      // 选择的日期index
      selectDateIndex: 0
    };
  },
  mounted() {
    this.getDateArray();
  },
  // computed: {
  //   activeThemeColor() {

  //   }
  // },
  methods: {
    getDateArray() {
      let date = new Date();
      let week = [
        "周日",
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
        "周六"
      ];
      let _weekArray = [];
      let _dayArray = [];
      let _dateArray = [];
      let day = date.getDate();
      let weekIndex = date.getDay();
      let timesStamp = date.getTime()
      this.curWeek = week[weekIndex];
      this.curDay = day;

      for (let i = 0; i < 7; i++) {
        _weekArray.push(week[weekIndex + i]);
        _dayArray.push(new Date(timesStamp + 24*60*60*1000*i).getDate())
        _dateArray.push(formatDate(new Date(timesStamp + 24*60*60*1000*i), 'yyyy-MM-dd'));
      }
      this.weekArray = _weekArray;
      this.dayArray = _dayArray;
      this.dateArray = _dateArray
      console.log(_dateArray)
    },
    selectWeek(index) {
      this.selectDateIndex = index;
      formatDate(new Date(), 'yyyy-MM')
      let date = this.dateArray[index]
      this.$emit("selectWeek", date);
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.select-date {
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
</style>


