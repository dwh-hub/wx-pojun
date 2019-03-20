<template>
  <div class="team-class-list">
    <select-date></select-date>
    <div class="nav-tab">
      <div class="store" :class="{active: currentNav==1}" @click="selectAllStore">全部门店</div>
      <div class="class" :class="{active: currentNav==2}" @click="selectAllClass">全部课程</div>
      <div class="time" :class="{active: currentNav==3}" @click="selectAllTime">全部时间</div>
      <div class="coach" :class="{active: currentNav==4}" @click="selectAllCoach">全部教练</div>
    </div>
    <div class="list">
      <team-class-item></team-class-item>
    </div>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
import teamClassItem from "COMPS/teamClassItem";
import selectDate from "COMPS/selectDate";
export default {
  data() {
    return {
      currentNav: 1
    };
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  components: {
    teamClassItem,
    selectDate
  },
  methods: {
    selectAllStore() {
      this.currentNav = 1;
    },
    selectAllClass() {
      this.currentNav = 2;
    },
    selectAllTime() {
      this.currentNav = 3;
    },
    selectAllCoach() {
      this.currentNav = 4;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.team-class-list {
  .nav-tab {
    display: flex;
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
  .list {
    padding: 15px;
  }
}
</style>


  