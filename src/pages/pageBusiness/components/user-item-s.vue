<template>
  <div class="user-item" v-if="info.id">
    <div class="cover">
      <div class="tag" :style="{background: statusColor}">{{info.customerClassChar}}</div>
      <img :src="info.headImgPath" @error="loadFail" />
    </div>
    <div class="user-info">
      <div class="user-base-info">
        <img class="user-sex" :src="sexSrc" />
        <span class="user-name">{{info.name}}</span>
      </div>
      <div class="user-service">
        <span>服务教练:</span>
        <span class="service-text">{{info.serviceCoachName || '无'}}</span>
        <!-- <span>服务销售:</span>
        <span class="service-text">{{info.serviceUserName || '无'}}</span> -->
      </div>
    </div>
    <div class="right-content" @click="iconevent">
      <span>服务销售: {{info.serviceUserName || '无'}}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { window } from "COMMON/js/common.js";
export default {
  props: {
    info: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    sexSrc() {
      if (this.info.sex) {
        if (this.info.sex == "男" || this.info.sex == 1)
          return "/static/images/staff/man.png";
        if (this.info.sex == "女" || this.info.sex == 2)
          return "/static/images/staff/women.png";
      }
      return "";
    },
    statusColor() {
      if (this.customerClassChar == "现有") {
        return "#119bf0";
      }
      return "#f25642";
    }
  },
  methods: {
    loadFail() {
      this.info.cover = window.api + "/assets/img/morenTo.png";
    },
    iconevent() {
      this.$emit("iconevent");
    }
  }
};
</script>

<style lang="less">
.user-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 5px 10px 10px;
  border-bottom: 1rpx solid #f6f6f6;
  box-sizing: border-box;
  .cover {
    position: relative;
    flex: 0 0 32px;
    height: 32px;
    margin-right: 10px;
    border-radius: 2px;
    overflow: hidden;
    background-color: #eee;
    .tag {
      position: absolute;
      top: -2px;
      right: 5px;
      width: 40px;
      padding-top: 6px;
      padding-bottom: 1px;
      text-align: center;
      font-size: 8px;
      transform: rotate(-45deg);
      background-color: red;
      color: #fff;
    }
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .user-info {
    flex: 1;
    .user-base-info {
      .user-name {
        font-size: 14px;
      }
      .user-sex {
        vertical-align: middle;
        margin-right: 3px;
        width: 12px;
        height: 12px;
      }
    }
    .user-service {
      > span {
        font-size: 12px;
        color: #999;
      }
      .service-text {
        color: #666;
        margin-right: 10px;
      }
    }
  }
  .right-content {
    padding: 5px 5px 5px 10px;
    border-left: 1px solid #ffae08;
    span {
      font-size: 12px;
      margin-right: 5px;
      font-weight: bold;
      color: #666;
    }
  }
}
</style>