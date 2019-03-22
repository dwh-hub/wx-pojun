<template>
  <div class="check-in-record">
    <div class="flex-wrapper" v-for="(item, index) in 6" :key="index">
      <div class="cover flex-left">
        <img>
      </div>
      <div class="flex-middle">
        <div class="flex-middle-item">50次卡</div>
        <div class="flex-middle-item">02-25 14：05</div>
      </div>
      <div class="flex-right">1次</div>
    </div>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
export default {
  data() {
    return {};
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  }
};
</script>

<style lang="less">
@import '~COMMON/less/reset';
@import '~COMMON/less/common';
</style>


