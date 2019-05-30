<template>
  <div class="coach-item">
    <div @click="toDetail" v-if="info.userId">
      <div class="cover">
        <!-- <img src="http://pojun-tech.cn/images/team/37/1.5510765515557332E12.jpeg"> -->
        <!-- <img :src="imgUrl"> -->
        <!-- <image :src="imgUrl" mode="aspectFill"></image> -->
        <div class="avatar" :style="{'background-image':'url('+imgUrl+')'}"></div>
      </div>
      <div class="coach-info">
        <div class="coach-name">{{info.userName || '教练名字'}}</div>
        <div class="coach-desc">{{info.individualResume || '暂无个人简介'}}</div>
        <div
          class="coach-times"
          :style="{'color': color}"
        >已授课：{{(info.privateCountByCoach + info.teamCountByCoach) || '0'}}节</div>
      </div>
      <div class="tag" v-if="hasTag">
        <div class="coach-type">$瑜伽$</div>
        <div class="coach-status">$热门$</div>
      </div>
      <div
        class="appoint"
        :style="{'background-color': color}"
        v-if="hasBtn && isLogin"
        @click.stop="toAppoint"
      >预约</div>
      <button
        v-else
        class="appoint clearBtn"
        :style="{'background-color': color}"
        type="default"
        @click.stop
        open-type="getPhoneNumber"
        @getphonenumber="_getPhoneNumber"
      >预约</button>
    </div>
    <div class="coach-skeleton" v-else>
      <div class="cover"><div class="avatar"></div></div>
      <div class="skeleton-wrapper">
        <div class="skeleton-name"></div>
        <div class="skeleton-desc"></div>
        <div class="skeleton-time"></div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../utils/store";
import {getPhoneNumber} from "COMMON/js/api.js";
import { window } from "COMMON/js/common";
export default {
  name: "coach-item",
  props: {
    info: {
      type: Object,
      default: function() {
        return {};
      }
    },
    hasTag: {
      type: Boolean,
      default: false
    },
    hasBtn: {
      type: Boolean,
      default: true
    },
    isToDetail: {
      type: Boolean,
      default: true
    },
    color: {
      type: String
    }
  },
  computed: {
    isLogin() {
      return store.state.isLogin
    },
    imgUrl() {
      if (this.info.headImgPath) {
        return window.api + this.info.headImgPath;
      }
      return "http://pojun-tech.cn/assets/img/morenTo.png";
    }
  },
  methods: {
    _getPhoneNumber(e) {
      getPhoneNumber(e)
    },
    toDetail() {
      if (this.isToDetail) {
        return wx.navigateTo({
          url: "../coachDetail/main?coachId=" + this.info.userId
        });
      }
      this.$emit("clickCoach");
    },
    toAppoint() {
      if (!store.state.isLogin) {
        return wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1000
        });
      }
      wx.navigateTo({
        url: "../appointmentCoach/main?coachId=" + this.info.userId
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.coach-item {
  > div {
    display: flex;
    box-shadow: 0px 0px 10px #eee;
    border-radius: 2px;
    background-color: #fff;
    padding: 10px 0;
    padding-right: 10px;
  }
  .cover {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    // padding: 12px;
    padding-left: 12px;
    // box-sizing: border-box;
    .avatar {
      // width: 80px;
      // height: 80px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position: 50% 50%;
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
      line-height: 28px;
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
    line-height: 26px;
    height: 26px;
    width: 50px;
    font-size: 14px;
    margin: auto;
    text-align: center;
    vertical-align: middle;
    border-radius: 2px;
    color: #fff;
  }
  .coach-skeleton {
    .cover {
      .avatar {
        // background-color: #eee;
      }
    }
    .skeleton-wrapper {
      padding: 0 12px;
      width: 100%;
      .skeleton-name {
        margin-top: 8px;
        height: 16px;
        background-color: #eee;
      }
      .skeleton-desc {
        margin-top: 12px;
        height: 12px;
        width: 200px;
        background-color: #eee;
      }
      .skeleton-time {
        margin-top: 12px;
        height: 10px;
        width: 100px;
        margin-right: 10px;
        background-color: #eee;
      }
    }
  }
}
</style>


