<template>
  <div class="appointmentClass">
    <div class="top-nav clearfix">
      <div class="now-date pl">今天：{{formatDate}}</div>
      <div class="nav pr">
        <span class="private" @click="privateList" :class="{ select: isPrivate }">私教</span>
        <span class="league" @click="leagueList" :class="{ select: !isPrivate }">团课</span>
      </div>
    </div>
    <div class="store-list">
      <div class="current-store">
        <img src="/static/images/icon-address.png" alt>
        <span class="store-name">$XX店$</span>
        <img class="more" src="/static/images/arrow-bottom.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPrivate: true
    };
  },
  methods: {
    privateList() {
      this.isPrivate = true;
    },
    leagueList() {
      this.isPrivate = false;
    }
  },
  computed: {
    formatDate() {
      let date = new Date();
      let week = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      // x月x日 星期x
      return (
        date.getMonth() + 1 + "月" + date.getDate() + "日" + week[date.getDay()]
      );
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";

.appointmentClass {
  .top-nav {
    line-height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #eee;
    .now-date {
      font-size: 12px;
      color: #333;
    }
    .nav {
      > span {
        display: inline-block;
        line-height: 30px;
        padding: 0 10px;
        color: #333;
        font-size: 14px;
        &.select {
          color: #5db2ff;
          border-bottom: 2px solid #5db2ff;
        }
      }
    }
  }
  .store-list {
    .current-store {
      padding: 0 10px;
      line-height: 28px;
      > img {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
      }
      .store-name {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        margin-left: 10px;
      }
      .more {
        float: right;
        width: 20;
        height: 20px;
        margin-top: 5px;
      }
    }
  }
}
</style>


