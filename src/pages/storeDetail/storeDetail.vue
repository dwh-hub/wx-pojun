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
      <div class="phone" @click="call">
        <img src="/static/images/icon-phone.png">
      </div>
    </div>
    <div class="team-class-part">
      <title-cell title="团课" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllStore"></title-cell>
      <team-class-item></team-class-item>
    </div>
    <div class="coach-part">
      <title-cell title="私教" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllStore"></title-cell>
      <coach-item></coach-item>
    </div>
  </div>
</template>

<script>
import {setNavTab} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";

export default {
  name: "storeDetail",
  data() {},
  components: {
    titleCell,
    teamClassItem,
    coachItem
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  methods: {
    toAllStore() {
      wx.navigateTo({
        url: "../allStore/main"
      });
    },
    call() {
      wx.makePhoneCall({
        phoneNumber: "1340000"
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
.store-detail {
  padding-bottom: 20px;
  .swiper {
    height: 180px;
  }
  .banner {
    width: 100%;
    height: 100%;
  }
  .address {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    > h4 {
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
        margin-top: 12px;
        color: #bababa;
      }
    }
    .phone {
      flex: 0 0 75px;
      position: relative;
      box-sizing: border-box;
      > img {
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
  .team-class-part,
  .coach-part {
    padding: 0 15px;
    .title-cell {
      margin: 5px 0;
      .title {
        font-weight: bold;
      }
    }
  }
}
</style>
