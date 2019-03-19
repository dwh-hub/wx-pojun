<template>
  <div class="coach-list-wrapper">
    <div class="nav-tab">
      <div class="store" :class="{active: currentNav==1}" @click="selectAllStore">全部门店</div>
      <div class="Signing" :class="{active: currentNav==2}" @click="selectSigning">是否签约</div>
      <div class="search" :class="{active: currentNav==3}" @click="selectSearch">搜索</div>
    </div>
    <div class="coach-list">
      <coach-item v-for="(item, index) in 3" :key="index"></coach-item>
    </div>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
import coachItem from "COMPS/coachItem.vue";
export default {
  data() {
    return {
      currentNav: 1
    };
  },
  components: {
    coachItem
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  methods: {
    selectAllStore() {
      this.currentNav = 1
    },
    selectSigning() {
      this.currentNav = 2
    },
    selectSearch() {
      this.currentNav = 3
    },
  }
};
</script>

<style lang="less">
@import '~COMMON/less/common.less';

page{
  background-color: #f5f5f5;
}
.coach-list-wrapper {
  .nav-tab {
    display: flex;
    background-color: #fff;
    > div {
      flex: 1;
      line-height: 42px;
      text-align: center;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      border-right: 1rpx solid #eee;
      &:nth-last-of-type(1) {
        border-right: none;
      }
      &.active {
        color: @theme-color;
      }
    }
  }
  .coach-list {
    padding: 0 10px;
    .coach-item {
      margin-bottom: 20px;
    }
  }
}
</style>

