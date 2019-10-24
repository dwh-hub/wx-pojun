<template>
  <div class="select-time">
    <div class="specific-date" v-if="dayTime.length">
      <div class="date-hours">
        <div class="time-icon">
          <div class="day">
            <i class="sun"></i>
          </div>
          <div class="night">
            <i class="moon"></i>
          </div>
        </div>
        <div class="hour-group">
          <div
            class="hour"
            v-for="(item, index) in dayTime"
            :key="index"
            :class="{disable: item.disable}"
            @click="selectHour(item, index)"
          >
            <span
              v-if="curHourIndex == index"
              :style="{'background-color':themeColor,color:'#fff'}"
            >{{item.hour}}</span>
            <span v-else>{{item.hour}}</span>
          </div>
        </div>
      </div>
      <div class="date-second">
        <div
          class="second-item"
          v-for="(item, index) in curTimeObj.arr"
          :key="index"
          :class="{disable: item.disable}"
          @click="selectSecond(item,index)"
        >
          <!-- :class="{bold: item.second % 15 == 0}" -->
          <span
            v-if="curSecondIndex == index"
            :style="{'background-color':themeColor,color:'#fff'}"
          >{{item.second}}</span>
          <span v-else>{{item.second}}</span>
        </div>
      </div>
    </div>
    <div class="date-group-footer">
      <div class="tips">
        <div class="already">
          <span class="already-block" :style="{'background-color': themeColor}"></span>
          <span>已选择</span>
        </div>
        <div :style="{color: themeColor}">{{_confirDate}}</div>
        <!-- <div class="can">
          <span class="can-block"></span>
          <span>可预约</span>
        </div>
        <div class="none">
          <span class="none-block"></span>
          <span>不可预约</span>
        </div>-->
      </div>
      <div class="confirm-date" :style="{'background-color': themeColor}" @click="selectDate">确定</div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  props: {
    dayDate: {
      type: String,
      default: "00:00"
    },
    openStoreTime: {
      type: String,
      default: "00:00"
    },
    closetoreTime: {
      type: String,
      default: "23:59"
    },
    periodTime: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      todayPeriodTime: [],
      dayTime: [],
      curTimeObj: {},
      curTime: "",
      curEndTime: "",
      curHourIndex: -1,
      curSecondIndex: -1
    };
  },
  mixins: [colorMixin],
  computed: {
    confirmDate() {
      if (this.curEndTime) {
        return (
          "（" +
          this.dayDate +
          " " +
          this.curTime +
          "~" +
          this.curEndTime +
          "）"
        );
      }
      return "";
    },
    _confirDate() {
      return this.confirmDate.replace(/-/g, "/");
    }
  },
  methods: {
    computedTime() {
      const HOUR = 60 * 60 * 1000;
      const DAY = 24 * HOUR;

      let target = [];
      let hourTime = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ];
      let _openStart = this.openStoreTime || "00:00";
      let _openEnd = this.closetoreTime || "23:59";
      let _nowDay = this.curDate || formatDate(new Date(), "yyyy-MM-dd");
      // 关店时间 合到被占用时间
      let closeTimeArr = [
        {
          timeStart: new Date(_nowDay + " " + "00:00").getTime(),
          timeEnd: new Date(_nowDay + " " + _openStart).getTime()
        },
        {
          timeStart: new Date(_nowDay + " " + _openEnd).getTime(),
          timeEnd: new Date(_nowDay + " " + "24:00").getTime()
        }
      ];
      this.todayPeriodTime = this.periodTime.concat(closeTimeArr);
      // 获取当日的时间（0点）
      let baseDay = new Date(_nowDay + " " + "00:00").getTime();
      // let baseDay = parseInt(this.todayPeriodTime[0].timeStart / DAY) * DAY - 8 * HOUR;
      // 填充第一层
      for (let i in hourTime) {
        target.push({
          hour: hourTime[i],
          disable: false,
          start: baseDay + parseInt(i) * HOUR,
          end: baseDay + (parseInt(i) + 1) * HOUR,
          arr: []
        });
      }

      // 5分钟间隔
      const TIME_SPLIT = 5 * 60 * 1000;
      // 填充第二层
      for (let i in target) {
        for (let j = 0; j < 12; ++j) {
          target[i].arr.push({
            second: String(j * 5).length == 2 ? j * 5 : "0" + j * 5,
            disable: false,
            start: target[i].start + j * TIME_SPLIT,
            // end: target[i].start + (j + 1) * TIME_SPLIT
            end: target[i].start + HOUR
          });
        }
      }
      // 比对当前格子是否被占用
      for (let i in target) {
        let hourEle = target[i];
        // if (this.isUsed(hourEle.start, hourEle.end)) {
        //   hourEle.disable = true;
        // }
        for (let j = 0; j < 12; ++j) {
          let element = target[i].arr[j];
          if (this.isUsed(element.start, element.end)) {
            element.disable = true;
          }
        }
        if (
          !hourEle.arr.filter(e => {
            return !e.disable;
          }).length
        ) {
          hourEle.disable = true;
        }
      }
      this.dayTime = target;
      for (let k in target) {
        if (!target[k].disable) {
          this.selectHour(target[k], k);
          return;
        }
      }
    },
    // 判断当前时间节点是否被占用的函数
    isUsed(start, end) {
      for (let i in this.todayPeriodTime) {
        let element = this.todayPeriodTime[i];
        if (
          // 开始时间在预约时间内
          (element.timeStart - 60 * 60 * 1000 <= start &&
            start <= element.timeEnd) ||
          (element.timeStart <= end && end <= element.timeEnd)
        ) {
          return true;
        }
      }

      return false;
    },
    selectHour(item, index) {
      if (item.disable) {
        return;
      }
      this.curTimeObj = item;
      let _item;
      _item = item.hour;
      this.curTime = _item;
      this.curHourIndex = index;
      let hour = _item.slice(0, 2);
      let _curEndtime =
        Number(_item.split(":")[0]) + 1 + ":" + _item.split(":")[1];
      if (Number(_curEndtime.split(":")[0]) < 10) {
        this.curEndTime = "0" + String(_curEndtime);
      } else {
        this.curEndTime = _curEndtime;
      }
      for (let k in item.arr) {
        if (!item.arr[k].disable) {
          this.selectSecond(item.arr[k], k);
          break;
        }
      }
    },
    selectSecond(item, index) {
      if (item.disable) {
        return;
      }
      if (this.curHourIndex == -1) {
        return;
      }
      this.curTime = this.curTime.split(":")[0] + ":" + item.second;
      this.curEndTime = this.curEndTime.split(":")[0] + ":" + item.second;
      this.curSecondIndex = index;
    },
    selectDate() {
      this.$emit("selectDate", {
        confirmDate: this.confirmDate,
        startTime: this.curTime,
        endTime: this.curEndTime
      });
    }
  }
};
</script>

<style lang="less">
.select-time {
  width: 100%;
  box-shadow: 0px 2px 7px 0px rgba(1, 60, 97, 0.1);
  border-radius: 2px;
  overflow: hidden;
  .specific-date {
    .date-hours {
      display: flex;
      align-items: center;
      max-height: 486rpx;
      overflow: hidden;
      border-top: 1rpx solid #eee;
      .time-icon {
        flex: 0 0 60px;
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .day {
          height: 242rpx;
        }
        .night {
          height: 242rpx;
          border-top: 1rpx solid #e5e5e5;
        }
        .sun,
        .moon {
          display: inline-block;
          width: 30px;
          height: 30px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .sun {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAEBUlEQVRoge2byWsUQRSHv2hMRqMIimBUzMEF9OQtERMFBXEDPZiTGvUi5uLuURTyHwiiR3EFwaAnUTGHXF0PCkmMCoIgCoIY92Wk4HV8VPVkZnqqq9uQD4oMtbxfva7u6qpXHTKgGbgrqTmLDoRmF1CUtCu0+CQnJ30alUJjaPEsHC6W+B2ELBzOlAmHxzsTDsfQBJwE9rlFiahTjeo82dwAdAFTnJIE7FfvzZMe7O1R9vY4pdVzQNnb7cPhVcBXj063AA8ltTil1aGdNWljjfZG2Qb88uj0FA+3n+3sAadGjXRZTh/1LVAFqTsbYTtdjVABWAS0A1sktUtewaldmmDORhinfyrBbqfGP2YAncAlYBj4bHW2KHnDUqdT2pSiO7SzEXrmfgs0WOXmVXYcGIpxsFwakselybLZIFo1OTvZyamMB8A7YClwHuhTrdYC12TrN1vlDwB3gBuSbgP3gTeya4rqmr/rgc3i/CvJ/yOjPw84AZxJ2PeasEf2IPBDjcIn4CywMqaupkHqnJU2UfsfYtOumwt6rFv1OrAsQcdMm17LVo9TK2P0zGluvcMeunNUbAWfoMqxRs3av4GdZepXw06xWRSNNZl6KjPpMzUKPkbW5piy/xSY5tQIiO7MzRRlbyqdI05pIKbLK8N0YgRYnKLsEtEwWi9FOzjb1VU/F0D8nNLrdEoDcEVNVG0B9NrUBHbZKU2ZgtxaRVlBeYk0lMFoDIrmiyo3HKMkjWktkCUespH/6dTwj9F4JFbnSx+qph6YC6yTKxYXGDdxp+9AP/Ba8prVqcGw0yI9novlRul3pL0QWC35pXz4Btyrl+dhrVPF5Ymsd03Dmar0g1MzPbRW1IeCvLZWVKDa9z+HaRNFPM0I75BbemqZ26Ff/ho+qvJZTov00FpRH0yftsotPdZjaQKR95ySClksQkWJVITiqmh+S3mh46BfS4P/02upFvTCozWAXquPhUctk1avsrHXKfXPXtXfGwH0HLLaPLzKavOAbNWiBX2aVz0X20MCBQCO5ykAQMohni4V18pFiCfioBXE83HupKMpxZhwbebYYVoziy9P0KnleQ7TlgvEjyQIxI+o9rkKxHfLyueUtZA3O6/HMedHA7I0NKN1SFKP5A3E1H9s7eLqRGuwzAFeKujAe9xh2jR5jms5TLNnYy+HaUmwz2fHutr2cemXGAe/yMb+Yh6PS2s5jC7IaqxDHYh3SF4uD8SDn7yPQep98S2Q649aNnk23CIH6g/y+tnSbs9XMdMP0+qdHJdoo/8euOWUVo/WrES/HKdllp8j7/QxqUTQLNovOLnJ0UG2uIBbEioeiImvacc7Ew6Pd7JwOI0PxCsmC4e/l/g9bsnuX/GAvyPshOwqZK3FAAAAAElFTkSuQmCC");
        }
        .moon {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFJ0lEQVRogd1ba4hVVRT+5o5dh5zRwXISIicdR8UpxqSskIzKUgwfaVOCYmk/VNIIIgV/WFJYglhQGfUjTXz8MB8/NCIVVDR7kI+xMJ+Zo+Oj0TTHMsfpxoLvyOKu++ieOee4z3xwuGfOWmfvtc5ee6/H3oOAMBjAGgC/ABgYVKMuYgCAtQBS6qprj4qWAHgLwNU0ZU8BKDfcMUcNgG+Ukl8C+JH3i9ubsqMA/E7lmgBM5Wgf4rNh5o0YYzqAViq2HUAVVRnIZxcA3N5elJ2tTPhzALcq2kt8vsW8FVO8qpR9N4MK75P2oaHEEHVK2XeyiL+B9JmGEjPUArhEZT7NInoRgD3kGW2oMUIpgH1qbnbMIrqs0IfJN9RQY4SPqMRJAHfmELsMwAnyDjbUmOARAP9SiZF5RBZL+I28Qww1BkgC+IEKrPwf4mqTjmXQ8SKFvwig0lAtZNHay3fGGqqDSCiRJJiYw/v3aKr54IWYgrvy8DoBrfCzAKoZKxcSRJzgb5WhOKxwMYAZvP8MwHnDmR0HSYmFwh4eoHn+A6CvoebGcOXCSnNyOoT5FPprHyKJn27m+4MM1TEkeA2nWOt9iHeK4aXgCUN1EFU05esA+vkUbw5HeDfXA6fhZUQHANziU1Ap+7QwQnvQUB1CglkRGEC0+BTtZwA7GYhMN1THFK7hfb2hFoaPyf2c6y7qW5r084ZSGDryo0lbn0StRCE4RiEfC6CtcWxLpsZDhuoIzlDIILZIZA5vZXu7AHQwHA7gPAW8NyBRZPvlb7Y531AdUvg+Q/GP11Tx75moFcqH0yGVaFaz3T9c881HKNiThtI2lKuKZqNyfzcd31OoiSEIUqVqXr8GuE74RoJfX9ArhPaPsl59FsDdAL5ywV0t4AgsM5TgIC6vQc3p8VErqTGBgtSH7Df7qIqoXIvSNuUiQw23Qa8B6B1yp50BrFJKSzo5wnCFjCRTQxFgUkR9Sv3sslJcXNjDhitEfMCON0bYZ43aeUwxl17H3Y4yw902dGHefyMeeJyd/sXVNEpIwvFd2uGYYzwvUkfvkShQHqm69AQwhu0cZ7sNRWTwUjtZWOYBeNM0ES6KOZenMADqpHq7yu2ck/wQjQyHm7julPKSQKeCtfVqrkfJNKk36z9mq6joZh49khGdxvNfDWkjX8glNbqfOE1avLi+SHXUjaUa+X0dwEIjSvQoY3TWn/VyGcE7ANxGq2hlAfIaR7yREd1h/spiPJdWeyBTCuyNclNc9oryoKfyBi9kYi1jOCgMKww1fvCORe7JMJ9vYKyaJxMMNT6QGl2KZv9oPqmXUOFLLmQ4PlDJhCXFGCMvOqtDLbKQdY+RskmeFBTZ9xUSr/fn4pXiYdIuhsNNeNYppxhqC5XwKVWQ2xSDo8He6SPxu0/7bWS0Unqno+adVCPbGkQSNFLtAdfDh6mEiEpanxddTQ6qqyEqCL8YYSqZC2NU+PlnGCVh+ZrblJ9eHkHRIBMqVEqb4s5naKXgEsbZXmcXuCFeYTiDh2RRL6clFYuj8iBD1f86eFnWvJBGXCxrFk8M6fJQ0LX0vJA8+hW1A5niir6JI1Gb4yRuLhQzDpjGqkizav84S0R+2kWReeIP5Sy9Ts5wkkf+AWQ/dzgkZTtHBZrpQkpokt05ktU8a3JPWqVDgp+lAL5gqdcZSKH9bW60X2lDAi8fZAeAN4Lc6AtqhLOhB4D7mYDIyElxQa6uLMtI4U7yVXEpEsbKsUepUoivlzhYFqfgAOA/UkN4oAq0tJoAAAAASUVORK5CYII=");
        }
      }
      .hour-group {
        flex: 1;
        width: 100%;
        display: grid;
        // grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
        grid-template-columns: 25% 25% 25% 25%;
        grid-template-rows: auto;
        .hour {
          border-left: 1rpx solid #e5e5e5;
          border-bottom: 1rpx solid #e5e5e5;
          line-height: 40px;
          text-align: center;
          color: #333;
          > span {
            display: inline-block;
            width: 100%;
          }
          &:nth-of-type(n + 21) {
            border-bottom: none;
          }
          &.active {
            background-color: #43cf7c;
            color: #fff;
          }
          &.disable {
            background-color: #ddd !important;
          }
        }
      }
    }

    .date-second {
      display: flex;
      width: 100%;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      .second-item {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #333;
        > span {
          display: inline-block;
          line-height: 22px;
          width: 22px;
          margin: 10px 0;
          border-radius: 50%;
        }
        // .bold {
        //   font-size: 14px;
        //   font-weight: bold;
        //   color: #333;
        // }
        &.active {
          background-color: #43cf7c;
          color: #fff;
        }
        &.disable {
          background-color: #ddd !important;
        }
      }
    }
  }
  .date-group-footer {
    display: flex;
    .tips {
      flex-grow: 0;
      padding-left: 10px;
      line-height: 42px;
      > div {
        display: inline-block;
        > span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .already-block,
      .can-block,
      .none-block {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
      // .already-block {
      //   background-color: #43cf7c;
      // }
      // .can-block {
      //   border: 1rpx solid #eee;
      // }
      // .none-block {
      //   background-color: #ccc;
      // }
    }
  }
  .confirm-date {
    flex: 1;
    line-height: 42px;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
</style>
