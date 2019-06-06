<template>
  <div class="color-mixin"></div>
</template>

<script>
import { getThemeColor, window } from "COMMON/js/common.js";
export default {
  data() {
    return {
      themeColor: ""
    };
  },
  mounted() {
    if (window.color && window.color != "#2a82e4") {
      this.themeColor = window.color;
    } else {
      getThemeColor().then(color => {
        this.themeColor = color;
      });
    }
  }
};
</script>

<style>
</style>
