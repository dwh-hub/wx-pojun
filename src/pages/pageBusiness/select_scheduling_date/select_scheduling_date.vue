<template>
  <div class="select_scheduling_date">
    <van-cell-group custom-class="van-cell-group">
      <van-cell
        title="开始时间"
        @click="showTimePopup = true;timeType='start'"
        :value="classStartTime"
        is-link
      />
      <van-cell
        title="结束时间"
        @click="showTimePopup = true;timeType='end'"
        :value="classEndTime"
        is-link
      />
    </van-cell-group>
    <div class="select-time-text">上课时间为每周的{{selectWeek}}的{{classStartTime}} - {{classEndTime}}</div>
    <div
      class="week clearfix"
      v-for="(item, index) in week"
      :key="index"
      @click="select(item, index)"
    >
      <div class="text">{{item.text}}</div>
      <div class="icon" v-if="item.isSelect">
        <van-icon name="checked" :color="themeColor" size="1.5em"/>
      </div>
    </div>
    <div class="confirm-btn" @click="back" :style="{backgroundColor: themeColor}">确认</div>
    <van-popup
      :show="showTimePopup"
      @close="showTimePopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%;"
    >
      <van-datetime-picker type="time" :value="currentTime" @confirm="changeTime"/>
    </van-popup>
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
export default {
  data() {
    return {
      showTimePopup: false,
      currentTime: "00:00",
      timeType: "",
      classStartTime: "00:00",
      classEndTime: "23:59",
      week: [
        {
          text: "周一",
          value: "1",
          isSelect: true
        },
        {
          text: "周二",
          value: "2",
          isSelect: true
        },
        {
          text: "周三",
          value: "3",
          isSelect: true
        },
        {
          text: "周四",
          value: "4",
          isSelect: true
        },
        {
          text: "周五",
          value: "5",
          isSelect: true
        },
        {
          text: "周六",
          value: "6",
          isSelect: true
        },
        {
          text: "周日",
          value: "0",
          isSelect: true
        }
      ],
      selectWeek: "周一,周二,周三,周四,周五,周六,周日,",
      weekArr: ["1","2","3","4","5","6","0"]
    };
  },
  mounted() {
    setNavTab();
  },
  mixins: [colorMixin],
  methods: {
    changeTime(e) {
      this.currentTime = e.mp.detail;
      if (this.timeType == "start") {
        this.classStartTime = e.mp.detail;
        let EndTime =
          Number(e.mp.detail.split(":")[0]) +
          1 +
          ":" +
          e.mp.detail.split(":")[1];
        this.classEndTime = EndTime.length == 4 ? "0" + EndTime : EndTime;
      } else {
        if (
          new Date("1970-01-01" + " " + e.mp.detail).getTime() <
          new Date("1970-01-01" + " " + this.classStartTime).getTime()
        ) {
          return wx.showModal({
            title: "提示",
            content: "结束时间必须大于开始时间",
            showCancel: false
          });
        }
        this.classEndTime = e.mp.detail;
      }
      this.showTimePopup = false;
    },
    select(item, index) {
      if (this.selectWeek.indexOf(item.text) == -1) {
        this.selectWeek = this.selectWeek + item.text + ",";
        this.weekArr.push(item.value);
        this.week[index].isSelect = true;
      } else {
        this.week[index].isSelect = false;
        this.weekArr.forEach((e, index) => {
          if (e == item.value) {
            this.weekArr.splice(index, 1);
          }
        });
        this.selectWeek = this.selectWeek.replace(
          new RegExp(item.text + ",", "g"),
          ""
        );
      }
      console.log(this.weekArr)
    },
    back() {
      store.commit("changeClassStartTime", this.classStartTime);
      store.commit("changeClassEndTime", this.classEndTime);
      store.commit("changeSchedulingWeekArr", this.weekArr);
      wx.navigateBack({
        url: `../team_class_scheduling/mian?batchStartTime=${
          this.batchStartTime
        }`
      });
    }
  }
};
</script>

<style lang="less">
.select_scheduling_date {
  .week {
    padding: 0 15px;
    border-bottom: 1rpx solid #eee;
    box-sizing: border-box;
    .text {
      float: left;
      line-height: 44px;
    }
    .icon {
      float: right;
      margin-top: 10px;
      .van-icon {
        vertical-align: middle;
      }
    }
  }
  .select-time-text {
    line-height: 20px;
    padding: 6px 15px;
    color: #838383;
    background-color: #f6f6f6;
  }
  .confirm-btn {
    position: fixed;
    bottom: 0;
    left: 0px;
    line-height: 46px;
    font-size: 16px;
    width: 100%;
    text-align: center;
    color: #fff;
    z-index: 5;
  }
  // 闭合浮动
  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
</style>
