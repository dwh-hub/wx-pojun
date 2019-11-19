<template>
  <div class="team-class-item">
    <div v-if="info.teamScheduleId || info.coachAppointId" @click="toDetail" class="team-class-item-y">
      <div class="cover">
        <!-- <img src="http://pojun-tech.cn/images/team/37/1.5510765515557332E12.jpeg"> -->
        <!-- <img :src="window.api + info.masterImg"> -->
        <image :src="window.api + info.masterImg" mode="aspectFill"></image>
      </div>
      <div class="team-class-info">
        <div class="team-class-name">{{info.anotherName || info.projectName || ''}}</div>
        <div class="team-class-coach">{{coachStr || ''}}</div>
        <div class="team-class-time">
          <span>{{info.storeName || ''}}<span v-if="info.venueName">-</span>{{info.venueName || ''}}</span>
          {{startTime}}~{{endTime}}
        </div>
      </div>
      <div class="tag" v-if="isTag" :style="{'background-color': tag.color}">{{tag.text}}</div>
    </div>
    <div v-else>
      <div class="cover"></div>
      <div class="skeleton-wrapper">
        <div class="skeleton-name"></div>
        <div class="skeleton-coach"></div>
        <div class="skeleton-time">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
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
    },
    isTag: {
      type: Boolean,
      default: false
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
    tag() {
      if (this.info.status == "1") {
        return {
          text: "已预约",
          color: "#70b624"
        }
      } else if (this.info.status == "3") {
        return {
          text: this.info.statusChar,
          color: "#2ab4fc"
        }
      } else if (this.info.status == "0") {
        return {
          text: this.info.statusChar,
          color: "#ff9800"
        }
      } else if (this.info.status == "9") {
        return {
          text: "前台已确认",
          color: "#ffcccc"
        }
      } else {
        return {
          text: this.info.statusChar,
          color: "#ef4f4f"
        }
      }
      return {
          text: "",
          color: ""
        };
    },
    startTime() {
      if (this.info.timeStart) {
        if (typeof this.info.timeStart == 'string') {
          return formatDate(new Date(this.info.timeStart.replace(/-/g, "/")), "hh:mm");
        }
        return formatDate(new Date(this.info.timeStart), "hh:mm");
      }
      return "";
    },
    endTime() {
      if (this.info.timeEnd) {
        if (typeof this.info.timeEnd == 'string') {
          return formatDate(new Date(this.info.timeStart.replace(/-/g, "/")), "hh:mm");
        }
        return formatDate(new Date(this.info.timeEnd), "hh:mm");
      }
      return "";
    },
    coachStr() {
      if (JSON.stringify(this.info) == "{}") {
        return "";
      }
      if (this.info.coachName) {
        return this.info.coachName.replace(/null/g,'');
      }
      if (this.info.coachNameArrayStr) {
        return this.info.coachNameArrayStr.replace(/null/g,'');
      }
      if(this.info.coachNameArray) {
        return this.info.coachNameArray.toString(" ").replace(/null/g,'');
      }
      return ''
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
  > div {
    display: flex;
    padding-right: 10px;
    box-shadow: 0px 0px 10px #eee;
    border-radius: 2px;
    background-color: #fff;
  }
  .cover {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    background-color: #eee;
    > image {
      width: 100%;
      height: 100%;
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
  .skeleton-wrapper {
    padding: 0 12px;
    width: 100%;
    > div {
      margin-top: 12px;
    }
    .skeleton-name {
      height: 14px;
      background-color: #eee;
    }
    .skeleton-coach {
      height: 10px;
      background-color: #eee;
    }
    .skeleton-time {
      > span {
        display: inline-block;
        margin-top: 8px;
        height: 8px;
        width: 40px;
        margin-right: 10px;
        background-color: #eee;
      }
    }
  }
  .team-class-item-y {
    position: relative;
    overflow: hidden;
    .tag {
      position: absolute;
      right: -30px;
      top: 12px;
      width: 120px;
      line-height: 20px;
      text-align: center;
      color: #fff;
      position: absolute;
      transform: rotate(32deg);
      font-size: 12px;
    }
  }
  // .tag {
    // .team-class-type {
    //   font-size: 10px;
    //   padding: 2px 5px;
    //   color: #999;
    //   border: 1px solid #ccc;
    // }
    // .team-class-status {
    //   font-size: 10px;
    //   padding: 2px 5px;
    //   color: #f17f55;
    //   background-color: #feeee9;
    // }
  // }
}
</style>


