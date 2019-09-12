<template>
  <div
    class="select-date"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <div class="date-month">
      <div
        class="month-item"
        v-for="(item, index) in dayArray"
        :key="index"
        @click="selectWeek(index)"
      >
        <div class="item-round">
          <span :style="selectDateIndex == index ? dateStyle : ''">{{item}}</span>
        </div>
      </div>
    </div>
    <div class="date-week">
      <div
        class="week-item"
        v-for="(item, index) in weekArray"
        :key="index"
        @click="selectWeek(index)"
      >
        <span :style="selectDateIndex == index ? weekStyle : ''">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, window } from "COMMON/js/common.js";
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
      selectDateIndex: 0,
      startX: "", // 触摸开始时 X坐标
      startY: "", // 触摸开始时 Y坐标
      endX: "", // 触摸结束时 X坐标
      endY: "" // 触摸结束时 Y坐标
    };
  },
  mounted() {
    this.getDateArray(new Date());
  },
  computed: {
    themeColor() {
      return window.color;
    },
    dateStyle() {
      if (!this.themeColor) {
        return "";
      }
      return `background-color: ${this.themeColor};color:#fff`;
    },
    weekStyle() {
      if (!this.themeColor) {
        return "";
      }
      return `color: ${this.themeColor}`;
    }
  },
  methods: {
    getDateArray(weekDate) {
      let date = weekDate;
      let week = [
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六"
      ];
      let _weekArray = [];
      let _dayArray = [];
      let _dateArray = [];
      let day = date.getDate();
      let weekIndex = date.getDay();
      let timesStamp = date.getTime();
      this.curWeek = week[weekIndex];
      this.curDay = day;

      for (let i = 0; i < 7; i++) {
        _weekArray.push(week[weekIndex + i]);
        _dayArray.push(
          new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getDate()
        );
        _dateArray.push(
          formatDate(
            new Date(timesStamp + 24 * 60 * 60 * 1000 * i),
            "yyyy-MM-dd"
          )
        );
      }
      this.weekArray = _weekArray;
      this.dayArray = _dayArray;
      this.dateArray = _dateArray;
      console.log(_dateArray);
    },
    selectWeek(index) {
      this.selectDateIndex = index;
      formatDate(new Date(), "yyyy-MM");
      let date = this.dateArray[index];
      this.$emit("selectWeek", date);
    },
    onTouchstart(e) {
      this.startX = e.pageX;
      this.startY = e.pageY;
    },
    onTouchmove(e) {},
    onTouchend(e) {
      this.endX = e.pageX;
      this.endY = e.pageY;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.select-date {
  padding: 5px 0;
  box-shadow: 0px 2px 7px 0px rgba(1, 60, 97, 0.1);
  border-radius: 5px;
  .date-month,
  .date-week {
    display: flex;
    > div {
      flex: 1;
      text-align: center;
    }
  }
  .date-month {
    margin-bottom: 5px;
    .month-item {
      .item-round {
        > span {
          display: inline-block;
          width: 22px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>


