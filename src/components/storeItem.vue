<template>
  <div class="store-item" @click="tapStore">
    <div class="store-cover">
      <img>
    </div>
    <div class="store-info">
      <div class="store-top">
        <span class="store-name">$店名$</span>
        <span class="store-range">距离</span>
      </div>
      <div class="store-bottom">$一个很长很长很长很长很长很长的地址$</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  methods: {
    tapStore() {
      this.$emit('tapStore')
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
    line-height: 40px;
    padding-left: 20px;
    padding-right: 10px;
    .store-top {
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
}
</style>

