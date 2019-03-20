<template>
  <div class="appointment-coach">
    <div class="coach">
      <div class="cover">
        <img>
      </div>
      <div class="coach-info">
        <div class="coach-name">$张教练$</div>
        <div class="coach-times">$签约课数：18$</div>
      </div>
      <div class="tiems">
        <div class="num">$1次$</div>
        <div class="text">本次扣费</div>
      </div>
    </div>
    <div class="cell-list-sm">
      <title-cell
        title="授课门店"
        :moreText="storeCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="isStorePopup = true"
      ></title-cell>
      <title-cell
        title="预约时间"
        :moreText="timeCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="isTimePopup = true"
      ></title-cell>
    </div>
    <div class="cell-list-lg">
      <title-cell
        title="扣费合同"
        :moreText="cardCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="isCardPopup = true"
      ></title-cell>
      <title-cell title="预约备注" moreText="请选择" :moreSize="14" :titleSize="16"></title-cell>
    </div>
    <div class="bottom-btn appoint-coach" @click="appointCoach">发起预约</div>

    <!-- 选择门店弹出框 -->
    <van-popup
      class="store-pop"
      :show="isStorePopup"
      position="bottom"
      @close="isStorePopup = false"
    >
      <div class="pop-title">
        <span>请选择授课门店</span>
        <img src="/static/images/icon-close.png" @click="isStorePopup = false">
      </div>
      <div class="store-list">
        <div class="store-popup-item" @click="selectStore">
          <div class="cover">
            <img>
          </div>
          <div class="store-info">
            <div class="name">
              $三迪中心店$
              <span class="range">0.81km</span>
            </div>
            <div class="address">福州仓山大街272号万达广场A9楼三楼</div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 选择时间弹出框 -->
    <van-popup class="time-pop" :show="isTimePopup" position="bottom" @close="isTimePopup = false">
      <div class="pop-title">
        <span>选择开始时间</span>
        <img src="/static/images/icon-close.png" @click="isTimePopup = false">
      </div>
      <select-date></select-date>
      <div class="specific-date">
        <div class="morning">
          <h5>上午</h5>
          <div class="hours">
            <div class="hour" v-for="(item, index) in morningTimes" :class="{active: item == curTime}" :key="index" @click="selectHour(item)">
              {{item}}
            </div> 
          </div>
        </div>
        <div class="noon">
          <h5>中午</h5>
          <div class="hours">
            <div class="hour" v-for="(item, index) in noonTimes" :class="{active: item == curTime}" @click="selectHour(item)" :key="index">
              {{item}}
            </div> 
          </div>
        </div>
        <div class="afternoon">
          <h5>下午</h5>
          <div class="hours">
            <div class="hour" v-for="(item, index) in afternoonTimes" :class="{active: item == curTime}" @click="selectHour(item)" :key="index">
              {{item}}
            </div> 
          </div>
        </div>
        <div class="afternoon">
          <h5>晚上</h5>
          <div class="hours">
            <div class="hour" v-for="(item, index) in nightTime" :class="{active: item == curTime}" @click="selectHour(item)" :key="index">
              {{item}}
            </div> 
          </div>
        </div>
      </div>
      <div class="tips">
        <div class="already">
          <span class="already-block"></span>
          <span>已选择</span>
        </div>
        <div class="can">
          <span class="can-block"></span>
          <span>可预约</span>
        </div>
        <div class="none">
          <span class="none-block"></span>
          <span>不可预约</span>
        </div>
      </div>
      <div class="confirm-date" @click="selectDate">确定</div>
    </van-popup>

    <!-- 选择消费合同 -->
    <van-popup class="cards-pop" :show="isCardPopup" position="bottom" @close="isCardPopup = false">
      <div class="pop-title">
        <span>请选择本次消费合同</span>
        <img src="/static/images/icon-close.png" @click="isCardPopup = false">
      </div>
      <div class="cards-list">
        <div class="cards-popup-item" @click="selectCard">
          <div class="cover">
            <img>
          </div>
          <div class="cards-info">
            <div class="name">
              $常规课$
              <span>121311</span>
            </div>
            <div class="times">剩余次数：15次</div>
            <div class="date">结束日期：2019年9月18日</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import selectDate from "COMPS/selectDate.vue";

export default {
  name: "appointment-coach",
  data() {
    return {
      storeCellText: "请选择",
      timeCellText: "请选择",
      cardCellText: "请选择",
      isStorePopup: false,
      isTimePopup: false,
      isCardPopup: false,
      // 开店时间
      startTime: "09:40:20",
      // 关店时间
      endTime: "22:00:00",
      morningTimes: [],
      noonTimes: [],
      afternoonTimes: [],
      nightTime: [],
      // 点击选择的时间
      curTime: ''
    };
  },
  components: {
    titleCell,
    selectDate
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  mounted() {
    this.computedTime();
  },
  methods: {
    // 选择时间
    selectHour(item) {
      this.curTime = item
    },
    // 计算可选择预约时间
    computedTime() {
      let _satarTime = this.startTime.split(":")[0];
      let _endTime = this.endTime.split(":")[0];
      // 上午时间段
      for (let i = 0; i < 12 - Number(_satarTime); i++) {
        this.morningTimes.push(Number(_satarTime) + i + ":00");
      }
      // 中午时间段
      if (Number(_satarTime) < 12 || Number(_endTime) > 14) {
        this.noonTimes = ["12:00", "13:00", "14:00"];
      }
      // 下午时间段
      if (Number(_satarTime) < 15 || Number(_endTime) > 18) {
        this.nightTime = ["15:00", "16:00", "17:00", "18:00"];
      }
      // 晚上时间段
      for (let j = 0; j < Number(_endTime) - 19; j++) {
        this.afternoonTimes.push(19 + j + ":00");
      }
      console.log(this.morningTimes);
      console.log(this.noonTimes);
      console.log(this.afternoonTimes);
      console.log(this.nightTime);
    },
    // 选择门店
    selectStore() {
      this.isStorePopup = false;
      this.storeCellText = "已选择门店";
    },
    // 选择合同
    selectCard() {
      this.isCardPopup = false;
      this.cardCellText = "已选择合同";
    },
    // 选择时间
    selectDate() {
      this.isTimePopup = false;
      this.timeCellText = "已选择时间";
    },
    // 确认预约
    appointCoach() {
      if (this.storeCellText == "请选择" || this.storeCellText == "") {
        return wx.showToast({
          title: "请选择授课门店",
          icon: "none",
          duration: 1000
        });
      }
      if (this.cardCellText == "请选择" || this.cardCellText == "") {
        return wx.showToast({
          title: "请选择预约时间",
          icon: "none",
          duration: 1000
        });
      }
      if (this.timeCellText == "请选择" || this.timeCellText == "") {
        return wx.showToast({
          title: "请选择扣费合同",
          icon: "none",
          duration: 1000
        });
      }
      wx.navigateTo({
        url: "../appointmentResult/main"
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
page {
  background-color: #f5f5f5;
}
.appointment-coach {
  .coach {
    display: flex;
    margin-bottom: 10px;
    padding: 10px 0;
    padding-right: 30px;
    background-color: #fff;
    border-radius: 2px;
    .cover {
      flex: 0 0 90px;
      width: 90px;
      padding-left: 12px;
      box-sizing: border-box;
      > img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #bfbfbf;
      }
    }
    .coach-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;
      > div {
        flex: 1;
        line-height: 35px;
        .Mult-line(1);
      }
      .coach-name {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .coach-desc {
        color: #bababa;
      }
      .coach-times {
        color: #2a82e4;
      }
    }
  }
  .tiems {
    text-align: center;
    margin: auto;
    > div {
      color: @theme-color;
    }
    .num {
      font-size: 20px;
    }
  }
  .cell-list-sm {
    .title-cell {
      padding: 0 15px;
      background-color: #fff;
    }
  }
  .cell-list-lg {
    .title-cell {
      height: 80px;
      line-height: 80px;
      padding: 0 15px;
      margin-top: 15px;
      background-color: #fff;
    }
  }

  .pop-title {
    line-height: 50px;
    margin-left: 50px;
    text-align: center;
    font-size: 16px;
    > img {
      float: right;
      margin-top: 3px;
      padding: 15px;
      width: 15px;
      height: 15px;
    }
  }
  .store-pop {
    .store-list {
      .store-popup-item {
        display: flex;
        padding: 15px 15px;
        border-top: 1rpx solid #eee;
        .cover {
          flex: 0 0 100px;
          margin-right: 10px;
          > img {
            width: 100%;
            height: 60px;
            border-radius: 4px;
            background-color: #eee;
          }
        }
        .store-info {
          flex: 1;
          .name {
            margin-top: 5px;
            margin-bottom: 10px;
            .range {
              margin-left: 10px;
              font-size: 12px;
              color: @theme-color;
            }
          }
          .address {
            font-size: 12px;
            color: #bababa;
            .Mult-line(2);
          }
        }
      }
    }
  }
  .time-pop {
    .select-date {
      border-bottom: 1rpx solid #eee;
    }
    .specific-date {
      padding: 0 15px;
      .morning,
      .noon,
      .afternoon {
        > h5 {
          line-height: 20px;
          font-size: 15px;
          margin: 15px 0;
        }
        .hours {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          .hour {
            flex: 0 0 24%;
            box-sizing: border-box;
            text-align: center;
            margin-right: 1%;
            line-height: 45px;
            font-size: 16px;
            border: 1rpx solid #eee;
            &.active {
              background-color: #43cf7c;
              color: #fff;
            }
            &.none {
              background-color: #ccc;
            }
          }
        }
      }
    }
    .tips {
      padding: 0 15px;
      padding-top: 15px;
      margin-top: 15px;
      border-top: 1rpx solid #eee;
      > div {
        display: inline-block;
        margin-right: 15px;
        > span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .already-block,
      .can-block,
      .none-block {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .already-block {
        background-color: #43cf7c;
      }
      .can-block {
        border: 1rpx solid #eee;
      }
      .none-block {
        background-color: #ccc;
      }
    }
    .confirm-date {
      margin: 15px;
      line-height: 42px;
      background-color: @theme-color;
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
  }
  .cards-pop {
    .cards-list {
      .cards-popup-item {
        display: flex;
        padding: 15px 15px;
        border-top: 1rpx solid #eee;
        .cover {
          flex: 0 0 100px;
          margin-right: 10px;
          > img {
            width: 100%;
            height: 60px;
            border-radius: 4px;
            background-color: #eee;
          }
        }
        .cards-info {
          flex: 1;
          .name {
            line-height: 20px;
            .range {
              margin-left: 10px;
              font-size: 12px;
              color: @theme-color;
            }
          }
          .times,
          .date {
            line-height: 20px;
            color: #bababa;
            .Mult-line(1);
          }
        }
      }
    }
  }
}
</style>

