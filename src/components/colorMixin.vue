<template>
  <div class="color-mixin"></div>
</template>

<script>
import {getThemeColor} from "COMMON/js/common.js"
export default {
  data() {
    return {
      themeColor: ''
    }
  },
  mounted() {
    getThemeColor().then((color) => {
      this.themeColor = color
    })
  }
};
</script>

<style>
</style>
