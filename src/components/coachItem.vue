<template>
  <div class="coach-item" @click="toDetail">
    <div class="cover">
      <img src="http://pojun-tech.cn/assets/img/morenm.png">
    </div>
    <div class="coach-info">
      <div class="coach-name">{{info.userName || '教练名字'}}</div>
      <div class="coach-desc">$我是最美最美最美最美的$</div>
      <div class="coach-times">$13节课 共授课19次$</div>
    </div>
    <div class="tag" v-if="hasTag">
      <div class="coach-type">$瑜伽$</div>
      <div class="coach-status">$热门$</div>
    </div>
    <div class="appoint" v-if="hasBtn" @click.stop="toAppoint">预约</div>
  </div>
</template>

<script>
export default {
  name: "coach-item",
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    },
    hasTag: {
      type: Boolean,
      default: false
    },
    hasBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toDetail() {
      wx.navigateTo({
        url: '../coachDetail/main?coachId=' + this.info.userId
      })
    },
    toAppoint() {
      wx.navigateTo({
        url: '../appointmentCoach/main?coachId=' + this.info.userId
      })
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.coach-item {
  display: flex;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 2px;
  background-color: #fff;
  padding: 10px 0;
  padding-right: 5px;
  .cover {
    flex: 0 0 90px;
    width: 90px;
    // height: 90px;
    // padding: 12px;
    padding-left: 12px;
    box-sizing: border-box;
    > img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .coach-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    > div {
      flex: 1;
      // line-height: 30px;
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
  .tag {
    .coach-type {
      font-size: 10px;
      padding: 2px 5px;
      color: #999;
      border: 1px solid #ccc;
    }
    .coach-status {
      font-size: 10px;
      padding: 2px 5px;
      color: #f17f55;
      background-color: #feeee9;
    }
  }
  .appoint {
    line-height: 24px;
    height: 24px;
    width: 60px;
    margin: auto;
    text-align: center;
    vertical-align: middle;
    border-radius: 2px;
    background-color: @theme-color;
    color: #fff;
  }
}
</style>


