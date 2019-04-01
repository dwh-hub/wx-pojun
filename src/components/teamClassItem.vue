<template>
  <div class="team-class-item" @click="toDetail">
    <div class="cover">
      <!-- <img src="http://pojun-tech.cn/images/team/37/1.5510765515557332E12.jpeg"> -->
      <img :src="window.api + info.masterImg">
    </div>
    <div class="team-class-info">
      <div class="team-class-name">{{info.anotherName || info.projectName || '团课名称'}}</div>
      <div class="team-class-coach">{{coachStr || '团课教练'}}</div>
      <div class="team-class-time">
        <span>{{info.storeName}}-{{info.venueName || '场馆名称'}}</span>
        {{startTime}}~{{endTime}}
      </div>
    </div>
    <div class="tag">
      <!-- <div class="team-class-type">$瑜伽$</div>
      <div class="team-class-status">$热门$</div>-->
    </div>
  </div>
</template>

<script>
import { formatDate, window } from "COMMON/js/common.js";
export default {
  name: "team-class-item",
  props: {
    info: {
      type: Object,
      default: function() {
        return {};
      }
    },
    isToDetail: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toDetail() {
      if (this.isToDetail) {
        return wx.navigateTo({
          url: "../teamClassDetail/main?classId=" + this.info.teamScheduleId
        });
      }
      this.$emit("clickClass");
    }
  },
  computed: {
    startTime() {
      if (this.info.timeStart) {
        return formatDate(new Date(this.info.timeStart), "hh:mm");
      }
      return "";
    },
    endTime() {
      if (this.info.timeEnd) {
        return formatDate(new Date(this.info.timeEnd), "hh:mm");
      }
      return "";
    },
    coachStr() {
      if (JSON.stringify(this.info) == "{}") {
        return "";
      }
      if (this.info.coachName) {
        return this.info.coachName;
      }
      if (this.info.coachNameArrayStr) {
        return this.info.coachNameArrayStr;
      }
      return this.info.coachNameArray.toString(" ");
    },
    window() {
      return window;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.team-class-item {
  display: flex;
  padding-right: 10px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 2px;
  background-color: #fff;
  .cover {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    > img {
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }
  .team-class-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    > div {
      flex: 1;
      line-height: 30px;
      .Mult-line(1);
    }
    .team-class-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .team-class-coach {
      font-size: 15px;
      color: #333;
    }
    .team-class-time {
      > span {
        font-size: 14px;
        margin-right: 5px;
        color: #999;
      }
      font-size: 12px;
      color: #bababa;
    }
  }
  .tag {
    .team-class-type {
      font-size: 10px;
      padding: 2px 5px;
      color: #999;
      border: 1px solid #ccc;
    }
    .team-class-status {
      font-size: 10px;
      padding: 2px 5px;
      color: #f17f55;
      background-color: #feeee9;
    }
  }
}
</style>


