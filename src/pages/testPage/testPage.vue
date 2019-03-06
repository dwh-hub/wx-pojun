<template>
  <div class="web-wrapper">
    <web-view src="http://192.168.1.115/loginPage" @load="loaded"></web-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {},
  methods: {
    loaded() {
      setTimeout(() => {
        wx.redirectTo({
          url: "../webInline/main"
        });
      }, 2000);
    }
  }
};
</script>

<style>
</style>