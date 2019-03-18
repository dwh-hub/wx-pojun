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
    <div class="address">
      <h4>地址</h4>
      <div class="store">$店名$$距离$</div>
      <div class="address-detail">$一个很长很长很长很长很长很长很长的地址$</div> 
    </div>
    <div class="business-hours">
      <div class="business">
        <div class="business-text">营业时间</div>
        <div class="time">$09:00-22:00$</div>
      </div>
      <div class="phone">
        <img src="/static/images/icon-phone.png">
      </div>
    </div>
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
  .address {
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
    >h4 {
      font-weight: bold;
      font-size: 16px;
    }
    .store {
      font-size: 16px;
      color: @theme-color;
      margin: 8px 0;
    }
    .address-detail {
      color: #bababa;
    }
  }
  .business-hours {
    display: flex;
    height: 75px;
    border-bottom: 1px solid #eee;
    .business {
      flex: 1;
      padding-left: 20px;
      .business-text {
        font-size: 16px;
        margin-top: 12px;
        font-weight: bold;
      }
      .time {
        margin-top: 10px;
        color: #bababa;
      }
    }
    .phone {
      flex: 0 0 75px;
      position: relative;
      box-sizing: border-box;
      >img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 12px 18px;
        width: 30px;
        height: 30px;
        border-left: 1px solid #eee;
      }
    }
  }
}
</style>
