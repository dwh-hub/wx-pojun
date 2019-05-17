<template>
  <div class="tabbar-wrapper">
    <div class="tabbar">
      <div class="tab-item">
        <img src="" alt="">
        <div class="tab-text">首页</div>
      </div>
      <div class="tab-item">
        <img src="" alt="">
        <div class="tab-text">会员</div>
      </div>
      <div class="tab-item">
        <img src="" alt="">
        <div class="tab-text">工作台</div>
      </div>
      <div class="tab-item">
        <img src="" alt="">
        <div class="tab-text">在线帮助</div>
      </div>
      <div class="tab-item">
        <img src="" alt="">
        <div class="tab-text">我的</div>
      </div>
      <!-- <div class="tab-item" v-for="(item, index) in tab" :key="index">{{item.title}}</div> -->
    </div>
    <div class="block" v-if="isPhoneX"></div>
  </div>
</template>

<script>
import store from "../../../utils/store";
export default {
  data() {
    return {
      tab: [
        {
          title: "首页",
          url: "",
          icon: "",
          selectIcon: ""
        },
        {
          title: "帮助",
          url: "",
          icon: "",
          selectIcon: ""
        },
        {
          title: "消息",
          url: "",
          icon: "",
          selectIcon: ""
        },
        {
          title: "个人中心",
          url: "",
          icon: "",
          selectIcon: ""
        }
      ]
    };
  },
  mounted() {
    console.log(this);
  },
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  }
};
</script>

<style lang="less">
.tabbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  .tabbar {
    width: 100%;
    display: flex;
    height: 48px;
    border-top: 1px solid #e5e5e5;
  }
  .tab-item {
    flex: 1;
    text-align: center;
    padding-top: 4px;
    >img {
      width: 25px;
      height: 25px;
      margin: 0 auto;
      background-color: #808080;
    }
    .tab-text {
    color: #808080;
    }
  }
}
</style>
