<template>
  <div
    class="select-date"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <div :animation="Ani">
      <div class="date-month">
        <!-- :class="{active: selectDateIndex == index}" -->
        <div class="month-item" v-for="(item, index) in dayArray" :key="index">
          <span v-show="selectDateIndex != index">{{item}}</span>
          <span v-show="selectDateIndex == index" :style="{color:themeColor}">{{item}}</span>
        </div>
      </div>
      <div class="date-week">
        <div class="week-item" v-for="(item, index) in weekArray" :key="index">
          <!-- :class="{active: selectDateIndex == index}" -->
          <div
            class="item-round"
            @click="selectWeek(index)"
            v-show="selectDateIndex != index"
          >{{item}}</div>
          <div
            class="item-round"
            @click="selectWeek(index)"
            :style="{'background-color': themeColor,color:'#fff'}"
            v-show="selectDateIndex == index"
          >{{item}}</div>
        </div>
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
      windowWidth: "",
      selectDateIndex: 0,
      startX: "", // 触摸开始时 X坐标
      startY: "", // 触摸开始时 Y坐标
      endX: "", // 触摸结束时 X坐标
      endY: "", // 触摸结束时 Y坐标
      Ani: ""
    };
  },
  mounted() {
    this.getDateArray(new Date(), 14);
    this.windowWidth = wx.getSystemInfoSync().windowWidth;
  },
  computed: {
    themeColor() {
      return window.color;
    }
  },
  methods: {
    selectWeek(index) {
      this.selectDateIndex = index;
      formatDate(new Date(), "yyyy-MM");
      let date = this.dateArray[index];
      this.$emit("selectWeek", date);
    },
    computedDate(weekDate, dayNum) {
      let date = weekDate;
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
      let timesStamp = date.getTime();
      this.curWeek = week[weekIndex];
      this.curDay = day;

      for (let i = 0; i < dayNum; i++) {
        let date_tem = new Date(timesStamp + 24 * 60 * 60 * 1000 * i);
        _weekArray.push(week[date_tem.getDay()]);
        _dayArray.push(date_tem.getDate());
        _dateArray.push(formatDate(date_tem, "yyyy-MM-dd"));
      }
      let obj = {
        _weekArray,
        _dayArray,
        _dateArray
      }
      return obj
    },
    getDateArray(weekDate, dayNum) {
      let obj = this.computedDate(weekDate, dayNum)
      this.weekArray = obj._weekArray;
      this.dayArray = obj._dayArray;
      this.dateArray = obj._dateArray;
    },
    onTouchstart(e) {
      this.startX = e.pageX;
      this.startY = e.pageY;
    },
    onTouchmove(e) {
      this.endX = e.pageX;
      this.move();
    },
    onTouchend(e) {
      this.endX = e.mp.changedTouches[0].pageX;
      this.endY = e.mp.changedTouches[0].pageY;
      this.move();
      // // let endX = e.touches[0].pageX;
      // if (this.endX - this.startX > 50) {
      //   this.move(windowWidth);
      // }
      // if (this.startX - this.endX > 50) {
      //   this.move(-windowWidth);
      // }
    },
    move() {
      let _translate = "";
      if (this.endX > this.startX) {
        _translate = this.windowWidth;
      }
      if (this.startX > this.endX) {
        _translate = -this.windowWidth;
      }
      // console.log(translate)
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 100
      });

      animation.translate(_translate, 0).step();

      this.Ani = animation.export();
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.select-date {
  padding: 5px 0;
  overflow: hidden;
  .date-month,
  .date-week {
    // display: flex;
    white-space: nowrap;
    > div {
      display: inline-block;
      // flex: 1;
      width: 14.285%;
      text-align: center;
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
      }
    }
  }
}
</style>


