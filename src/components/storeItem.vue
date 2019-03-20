<template>
  <div class="store-item" @click="toDetail">
    <div class="store-cover">
      <!-- TODO: :src="info.cover" -->
      <img>
    </div>
    <div class="store-info">
      <div class="store-top">
        <span class="store-name">{{info.storeName}}</span>
        <span class="store-range">{{info.range}}</span>
      </div>
      <div class="store-bottom">{{info.address || '暂无地址'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  methods: {
    toDetail() {
      wx.navigateTo({
        url: '../storeDetail/main?storeId='+ this.info.storeId
      })
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
        color: @theme-color;
      }
    }
    .store-bottom {
      font-size: 14px;
      color: #bababa;
    }
  }
}
</style>

