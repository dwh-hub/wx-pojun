<template>
  <div class="store-item">
    <div v-if="info.storeId" @click="toDetail">
      <div class="store-cover">
        <!-- <img src="http://pojun-tech.cn/images/team/37/1.5510765515557332E12.jpeg"> -->
        <img :src="info.cover">
      </div>
      <div class="store-info">
        <div class="store-top">
          <span class="store-name">{{info.storeName}}</span>
          <span class="store-range" :style="{'color': themeColor}">{{info.range}}</span>
        </div>
        <div class="store-bottom">{{info.address || '未设置详细地址'}}</div>
      </div>
    </div>
    <div class="store-skeleton" v-else>
      <div class="store-cover">
      </div>
      <div class="store-info">
        <div class="store-top">
          <span class="store-name"></span>
        </div>
        <div class="store-bottom"></div>
      </div>
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
        return {
          storeId: "",
          storeName: "",
          range: "",
          address: ""
        };
      }
    }
  },
  computed: {
    themeColor() {
      return window.color;
    }
  },
  methods: {
    toDetail() {
      wx.navigateTo({
        url: "../storeDetail/main?storeId=" + this.info.storeId
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.store-item {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 2px 10px #ccc;
  .store-cover {
    width: 100%;
    height: 140px;
    > img {
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }
  }
  .store-info {
    padding: 14px 10px 14px 20px;
    .store-top {
      margin-bottom: 8px;
      .store-name {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
      .store-range {
        float: right;
        font-size: 14px;
      }
    }
    .store-bottom {
      font-size: 14px;
      color: #bababa;
    }
  }
  .store-skeleton {
    .store-cover,.store-top,.store-bottom {
      background-color: #eee;
    }
    .store-top {
      height: 18px;
      width: 200px;
    }
    .store-bottom {
      height: 14px;
      width: 100px;
    }
  }
}
</style>

