<template>
  <div class="service-web">
    <web-view
      src="https://pubres.aihecong.com/web/link/chatLink.html?entId=11672&group=%E7%B3%BB%E7%BB%9F%E5%94%AE%E5%90%8E"
    ></web-view>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
export default {
  data() {
    return {

    }
  },
  mounted() {
    setNavTab();
  },
  methods: {
    changeTabbar(e) {
      if (e.mp.detail == 0) {
        wx.redirectTo({
          url: "../index/main"
        });
      }
      if (e.mp.detail == 2) {
        wx.redirectTo({
          url: "../workbench/main"
        });
      }
      if (e.mp.detail == 3) {
        wx.redirectTo({
          url: "../staff_message/main"
        });
      }
      if (e.mp.detail == 4) {
        wx.redirectTo({
          url: "../staff_mine/main"
        });
      }
    }
  }
};
</script>

<style>
</style>
