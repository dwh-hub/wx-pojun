<template>
  <div class="filter-nav">
    <div class="nav-item" v-for="(item,index) in _nav" :key="index" @click="selectNav(index)">
      <span v-show="currentNav!=index">{{item.navTitle}}</span>
      <span v-show="currentNav==index" :style="{color: window.color}">{{item.navTitle}}</span>
      <i class="triangle-icon"></i>
      <div
        class="list-warpper"
        :class="{slideWrap: (showSlideList && currentNav==index)}"
        @click.stop="clickMask"
      >
        <div class="store-nav-list" :class="{slide: (showSlideList && currentNav==index)}">
          <div
            class="store-nav-item"
            v-for="(itemS, indexS) in item.children"
            :key="indexS"
            @click.stop="clickSonNav(index,itemS)"
          >
            <span>{{itemS.sonText}}</span>
            <!-- <picker v-else mode="date" :value="date" @change="dateChange($event, item)">
              <view class="picker">{{itemS.sonText}}</view>
            </picker>-->
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="all-filter" @click="allFilter()">
      <span>筛选</span>
      <img class="screening-icon" src="/static/images/staff/screening.png">
    </div>-->
    <div class="mask" v-show="maskShow" @click.prevent="clickMask"></div>

    <!-- <picker mode="date" :value="date" @change="dateChange">
      <view class="picker">当前选择: {{date}}</view>
    </picker>-->
  </div>
</template>

<script>
import { window } from "COMMON/js/common.js";
import { EventBus } from "../common/js/eventBus.js";
export default {
  props: {
    nav: {
      type: Array,
      default: [
        {
          navTitle: "今日",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            }
          ]
        },
        {
          navTitle: "时间段",
          children: [
            {
              sonText: "全部"
            },
            {
              sonText: "0:00-8:00"
            },
            {
              sonText: "9:00-16:00"
            },
            {
              sonText: "16:00-24:00"
            }
          ]
        },
        {
          navTitle: "条件三",
          children: [
            {
              sonText: "子条件四"
            },
            {
              sonText: "子条件二"
            }
          ]
        }
      ]
    }
  },
  data() {
    return {
      searchText: "",
      currentNav: 0,
      maskShow: false,
      showSlideList: false,
      date: "",
      _nav: []
    };
  },
  computed: {
    window() {
      return window;
    }
  },
  mounted() {
    EventBus.$on("showStoreMask", () => {
      this.maskShow = false;
      this.showSlideList = false;
    });
    this._nav = this.nav;
  },
  methods: {
    // dateChange(e, item) {
    //   console.log(e);
    //   console.log(e.mp.detail);
    //   console.log(item)
    // },
    // search(e) {
    //   console.log(e);
    // },
    selectNav(index) {
      if (index == this.currentNav && this.showSlideList) {
        this.maskShow = false;
        this.showSlideList = false;
        return;
      }
      this.currentNav = index;
      this.maskShow = true;
      this.showSlideList = true;
    },
    clickSonNav(index, item) {
      this._nav[index].navTitle = item.sonText;
      this.maskShow = false;
      this.showSlideList = false;
      if (item.action) {
        item.action();
      }
    },
    clickMask() {
      this.maskShow = false;
      this.showSlideList = false;
      EventBus.$emit('showFilterMask')
    },
    allFilter() {
      this.maskShow = false;
      this.showSlideList = false;
      this.$emit("allFilter");
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
.filter-nav {
  display: flex;
  height: 42px;
  background-color: #fff;
  position: relative;
  border-bottom: 1rpx solid #eee;
  .triangle-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 5px;
    vertical-align: middle;
    background-size: 100%;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTU0ODg1MDMwOTQ5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxODgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMS45OTk0ODggODE5LjQxMzQ2MiA3Mi44Mzc0IDIwNC41ODY1MzggOTUxLjE2MjYgMjA0LjU4NjUzOFoiIHAtaWQ9IjIxODkiIGZpbGw9IiM5OTk5OTkiPjwvcGF0aD48L3N2Zz4=");
    transition: transform 0.3s;
    &.active {
      transform: rotate(-180deg);
    }
  }
  > div {
    flex: 1;
    line-height: 42px;
    text-align: center;
  }
  // .nav-item {
  // border-top: 1rpx solid #eee;
  // border-bottom: 1rpx solid #eee;
  // border-right: 1rpx solid #eee;
  // &:nth-last-of-type(1) {
  //   border-right: none;
  // }
  // }
  .all-filter {
    // flex: 1;
    // padding: 0 5px;
    // line-height: 42px;
    .screening-icon {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-left: 5px;
      vertical-align: middle;
      background-size: 100%;
    }
  }
  .list-warpper {
    position: absolute;
    top: 42px;
    left: 0px;
    width: 100%;
    height: 0px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0);
    transition: height 0.3s;
    z-index: 98;
    &.slideWrap {
      height: 300px;
    }
    .store-nav-list {
      text-align: left;
      max-height: 300px;
      transform: translateY(-100%);
      background-color: #fff;
      overflow-y: auto;
      transition: transform 0.3s;
      &.slide {
        transform: translateY(0px);
      }
      .store-nav-item {
        line-height: 50px;
        padding-left: 20px;
        border-top: 1rpx solid #eee;
        > img {
          margin-right: 10px;
          width: 36px;
          height: 36px;
          background-color: #eee;
          border-radius: 50%;
        }
        > span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
}

.mask {
  position: fixed;
  top: 165px;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 97;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
