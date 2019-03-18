<template>
  <div class="store-detail">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      indicator-active-color="rgba(74, 134, 232, 1)"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in 3" :key="index">
        <swiper-item>
          <!-- <img :src="item" class="banner"> -->
          <img class="banner" src="/static/images/banner-1.jpg">
        </swiper-item>
      </div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: "storeDetail",
  data() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
.store-detail {
  .swiper {
    height: 180px;
  }
  .banner {
    width: 100%;
    height: 100%;
  }
}
</style>
