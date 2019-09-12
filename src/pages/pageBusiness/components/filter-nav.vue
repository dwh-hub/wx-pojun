<template>
  <div class="filter-nav">
    <div class="nav">
      <div class="nav-item" v-for="(item,index) in _nav" :key="index" @click="selectNav(index)">
        <span v-show="currentNav!=index">{{item.navTitle}}</span>
        <span v-show="currentNav==index" :style="{color: window.color}">{{item.navTitle}}</span>
        <i class="triangle-icon" :class="{active: (showSlideList && currentNav==index)}"></i>
        <cover-view
          v-if="isCoverView"
          class="mask"
          v-show="(maskShow && currentNav==index)"
          @click.prevent.stop="clickMask"
        >
          <cover-view
            v-if="isCoverView"
            class="list-warpper-cover"
            :class="{show: (showSlideList && currentNav==index)}"
            @click.stop="clickMask"
          >
            <cover-view class="store-nav-list">
              <cover-view
                class="store-nav-item"
                v-for="(itemS, indexS) in item.children"
                :key="indexS"
                @click.stop="clickSonNav(index,itemS)"
              >
                <cover-view class="item-span">{{itemS.sonText}}</cover-view>
              </cover-view>
            </cover-view>
          </cover-view>
        </cover-view>

        <div
          v-else
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
              <div class="item-span">{{itemS.sonText}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-to" v-if="hasTodetail" @click="toDetail">
        <span>详情</span>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </div>
      <div class="more-filter" v-if="hasMoreFilter" @click="moreFilter">
        <span>筛选</span>
        <i class="triangle-icon"></i>
      </div>
    </div>

    <div class="sidebar-filter" v-if="hasMoreFilter" :class="{sidebarTrans: showSidebar}">
      <div class="sidebar-mask" @click="clickMask" v-show="showSidebar"></div>
      <div class="sidebar-content"></div>
    </div>
    <!-- <div class="filter-text">{{filterText}}</div> -->
    <div v-if="!isCoverView" class="mask" v-show="maskShow" @click.prevent="clickMask"></div>
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
          name: "",
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
          name: "",
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
          name: "",
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
    },
    hasTodetail: {
      type: Boolean,
      default: false
    },
    hasMoreFilter: {
      type: Boolean,
      default: false
    },
    isCoverView: {
      type: Boolean,
      default: false
    },
    toDetail: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      searchText: "",
      currentNav: 0,
      maskShow: false,
      showSlideList: false,
      date: "",
      _nav: [],
      filterText: "",
      showSidebar: false
    };
  },
  computed: {
    window() {
      return window;
    },
    maskTop() {
      if (!this.maskShow) {
        return "42px";
      }
      return (42 + this._nav[this.currentNav].children.length * 50) * 2 + "rpx";
    }
  },
  mounted() {
    EventBus.$on("showStoreMask", () => {
      this.maskShow = false;
      this.showSlideList = false;
    });
    this._nav = this.nav;
    this.computedFilterText();
  },
  methods: {
    moreFilter() {
      this.showSidebar = true;
    },
    computedFilterText() {
      let filterText = "";
      this._nav.forEach((e, index) => {
        filterText += `${this._nav[index].name}：${
          this._nav[index].navTitle == this._nav[index].name
            ? "全部"
            : this._nav[index].navTitle
        }，`;
      });
      this.filterText = filterText.slice(0, filterText.length - 1);
    },
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
      this.computedFilterText();
      this.maskShow = false;
      this.showSlideList = false;
      if (item.action) {
        item.action();
      }
    },
    clickMask() {
      this.maskShow = false;
      this.showSlideList = false;
      this.showSidebar = false;
      EventBus.$emit("showFilterMask");
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
  margin-bottom: 4px;
  .nav {
    display: flex;
    height: 42px;
    background-color: #fff;
    position: relative;
    // border-bottom: 1rpx solid #eee;
    .triangle-icon {
      display: inline-block;
      vertical-align: middle;
      width: 8px;
      height: 6px;
      margin-left: 5px;
      margin-bottom: 2px;
      background-size: 100%;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAA8UlEQVQokX2STWoCURCEP8WdrsxRZq6QI+QEuU82CiELySZRcBW8gIRsBEvwEiEEJCQRIcSfCa0tM7Gd+VZDv6o3Xd2vliTJLXAFtIEVUKeaHdAEPoBhA3gCLoELoFVp/c+nee1vY+AGWARJOQv3jOuSfoG+d7IpteRsXNuXtD7m/QLugUmQRyauNc9hYJIyYOqd/ARLjg35wbTuySdu7Xhrj8GWs4/qWjhdmaQ3F82D9VAbSHovFs/t/BnoAstC7RvoAC+n4nCBpC0wKkSxrJZ7JClsqZZl+1kE0jRNgJ4fXEuandPZSyzjFbjzQ/uOAH/Q5FRf0oqbkAAAAABJRU5ErkJggg==");
      transition: transform 0.3s;
      background-repeat: no-repeat;
      &.active {
        transform: rotate(-180deg);
      }
    }
    > div {
      flex: 1;
      line-height: 42px;
      text-align: center;
      > span {
        color: #0a0204;
      }
    }
    .detail-to {
      flex: 0 0 50px;
      width: 50px;
      padding: 0 5px;
      > img {
        width: 18px;
        height: 18px;
      }
    }
    .more-filter {
      .triangle-icon {
        width: 8px;
        height: 9px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAA3ElEQVQ4jc3SMUoDURDG8V+MrTewzA32CgoWNnaCaEpvYCGk8Bq2amunpQi2Eqs0KZJAQCySJhaCQpCFXfLYt5GXrfyqYWa+/8DMtLIsu8Q5tmymJW5ywBS7G5pLzfKpoyidrkkO6OKtgXmAkxwwwT5eopb1esUehuXi5jjE41rLSk84wIfK5hc4wl1kWem+GDQvM9XTfeMM15GVWxzjK0zW3X5Z/MVzkOvjFD/V5jpAqXEQT6NqAmA7iNtRNQGQpP8NCHfQCPCeAvhrylXxNBfYaQL4RA8P6NR24Bfn5iSJzQj1iQAAAABJRU5ErkJggg==);
      }
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
    .list-warpper-cover {
      display: none;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      max-height: 300px;
      overflow: hidden;
      z-index: 98;
      &.show {
        display: block;
      }
      .store-nav-list {
        text-align: left;
        overflow-y: scroll;
        max-height: 300px;
        background-color: #fff;
        .store-nav-item {
          .item-span {
            box-sizing: border-box;
            line-height: 50px;
            padding-left: 20px;
            border-top: 1rpx solid #eee;
          }
        }
      }
    }
    .list-warpper {
      position: absolute;
      top: 38px;
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
          .item-span {
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .filter-text {
    padding-left: 15px;
    line-height: 24px;
    font-size: 12px;
    color: #86a1bf;
    background-color: #f6f6f6;
    border-bottom: 1rpx solid #eee;
    .Mult-line(1);
  }
}

.sidebar-filter {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 98;
  &.sidebarTrans {
    top: 0;
    .sidebar-content {
      right: 0;
    }
  }
  .sidebar-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .sidebar-content {
    position: absolute;
    right: -80%;
    top: 0;
    width: 80%;
    height: 100%;
    background-color: #fff;
    transition: right 0.3s;
  }
}

.mask {
  position: fixed;
  top: 180px;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 97;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
