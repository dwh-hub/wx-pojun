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
          style="top: 160px;"
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
      <div class="sidebar-content">
        <div class="filter-main" :style="{'padding-bottom': isPhoneX ? '160rpx' : '92rpx'}">
          <div class="filter-item" v-for="(item, index) in filterList" :key="index">
            <div class="filter-item-title">{{item.name}}（{{item.isRadio ? '单选' : '多选'}}）</div>
            <div class="filter-input-select" v-if="item.type == 3">
              <input type="text" disabled placeholder="请选择">
              <img src="/static/images/arrow-bottom.png" alt="">
            </div>
            <div class="filter-options" v-else>
              <div
                class="filter-option"
                v-for="(option, key) in item.children"
                :key="key"
                :class="[(item.children.length > 9 && key > 7 && !item.isShowAll)?'hidden':'']"
                :style="option.isSelect ? selectedStyle : ''"
                @click="selectOption(item, index, option, key)"
              >{{option.name}}</div>
              <div class="filter-option show-all" v-if="item.children.length > 9 && !item.isShowAll" @click="showAllFilter(item, index)">显示全部</div>
              <div class="filter-option show-all" v-if="item.children.length > 9 && item.isShowAll" @click="hideAllFilter(item, index)">收起</div>
              <div class="filter-time" v-if="item.isTimer">
                <picker
                  mode="date"
                  class="filter-picker"
                  @change="changeTime(...arguments, item, 'value')"
                >
                  <view class="filter-option">{{item.value ? item.value : '请选择日期'}}</view>
                </picker>
                <div class="line"></div>
                <picker
                  mode="date"
                  class="filter-picker"
                  @change="changeTime(...arguments, item, 'value_2')"
                >
                  <view class="filter-option">{{item.value_2 ? item.value_2 : '请选择日期'}}</view>
                </picker>
              </div>
              <div class="filter-input filter-option" v-if="item.isInput">
                <input type="number" @input="inputFilterDay(...arguments, item)" />
                <span>天未{{item.name}}</span>
              </div>
            </div>
          </div>
          <div class="sidebar-btn" v-if="showSidebar">
            <span :style="{color: window.color}" @click="resetFilter">重置</span>
            <span
              :style="{'background-color': window.color,color: '#fff'}"
              @click="confirmFilter"
            >确定</span>
            <div class="block" v-if="isPhoneX"></div>
          </div>
        </div>
      </div>
    </div>
    <scroll-text :txt="filterText" @close="isHiddenScrollText = false" v-if="isHiddenScrollText"></scroll-text>
    <!-- <div class="filter-text">{{filterText}}</div> -->
    <div v-if="!isCoverView" class="mask" v-show="maskShow" @click.prevent="clickMask"></div>
  </div>
</template>

<script>
import { window, filterDateMethod } from "COMMON/js/common.js";
import { EventBus } from "../common/js/eventBus.js";
import store from "@/utils/store";
import scrollText from './scroll-text.vue'

export default {
  props: {
    nav: {
      type: Array,
      default: [
        // {
        //   navTitle: "今日",
        //   name: "",
        //   children: [
        //     {
        //       sonText: "今日"
        //     },
        //     {
        //       sonText: "本周"
        //     },
        //     {
        //       sonText: "本月"
        //     }
        //   ]
        // },
        // {
        //   navTitle: "时间段",
        //   name: "",
        //   children: [
        //     {
        //       sonText: "全部"
        //     },
        //     {
        //       sonText: "0:00-8:00"
        //     },
        //     {
        //       sonText: "9:00-16:00"
        //     },
        //     {
        //       sonText: "16:00-24:00"
        //     }
        //   ]
        // },
        // {
        //   navTitle: "条件三",
        //   name: "",
        //   children: [
        //     {
        //       sonText: "子条件四"
        //     },
        //     {
        //       sonText: "子条件二"
        //     }
        //   ]
        // }
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
    moreFilterList: {
      type: Array,
      default: () => {
        return [{
          name: "客户性别",
          isRadio: true, // 是否单选
          type: 0, // 筛选类型 1 列举点击 2 时间 3 下拉选择
          isParmas: false, // 是否多参数
          isTimer: false, // 是否是时间选择
          param: "sex", // 字段名
          value: "",
          children: [
            {
              name: "男",
              value: "1"
            },
            {
              name: "女",
              value: "2"
            }
          ]
        }];
      }
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
      filterList: [], // 详情筛选列表
      filterText: "",
      showSidebar: false,
      selectedStyle: `background-color:#fff;border: 1rpx solid ${
        window.color
      };color: ${window.color}`,
      isHiddenScrollText: true
    };
  },
  components: {
    scrollText
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
    },
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  watch: {
    nav: {
      handler(val) {
        console.log('nav改动')
        this._nav = val
        this.computedFilterText()
      },
      deep: true
    }
  },
  mounted() {
    EventBus.$on("showStoreMask", () => {
      this.maskShow = false;
      this.showSlideList = false;
    });
    this._nav = this.nav;
    this.filterList = this.moreFilterList.map((e, index) => {
      e.children.forEach(k => {
        k.isSelect = false;
        if (e.isTimer && k.dateValue) {
          let time = filterDateMethod(k.dateValue);
          k.value = time.startTime.split(" ")[0];
          k.value_2 = time.endTime.split(" ")[0];
        }
      });
      return e;
    });
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
      // this.computedFilterText();
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
    },
    selectOption(parents, parentsIndex, option, index) {
      let _options = this.filterList[parentsIndex].children;
      if (!parents.isRadio) {
        _options[index].isSelect = !_options[index].isSelect;
        this.$set(_options, index, _options[index]);
        let _value = ''
        parents.children.forEach(e => {
          e.isSelect ? _value += e.value+',' : ''
        })
        parents.value = _value
      } else {
        _options.forEach(e => {
          e.isSelect = false;
        });
        _options[index].isSelect = true;
        this.$set(_options, index, _options[index]);
        parents.value = option.isSelect ? option.value : "";
      }
      if (parents.isTimer) {
        parents.value_2 = option.isSelect ? option.value_2 : "";
      }
    },
    inputFilterDay(e, item) {
      item.children.forEach(e => {
        e.isSelect = false;
      });
      let time = filterDateMethod(Number(e.mp.detail.value));
      item.value = time.startTime.split(" ")[0];
      item.value_2 = time.endTime.split(" ")[0];
    },
    changeTime(event, item, value) {
      item.children.forEach(e => {
        e.isSelect = false;
      });
      item[value] = event.mp.detail.value;
    },
    resetFilter() {
      this.filterList.forEach(parent => {
        parent.value = "";
        if (parent.isTimer) {
          parent.value_2 = "";
        }
        parent.children.forEach(e => {
          e.isSelect = false;
        });
        // 触发视图层更新
        this.$set(this.filterList, 0, this.filterList[0]);
      });
    },
    confirmFilter() {
      this.showSidebar = false;
      let params = {};
      this.filterList.forEach(e => {
        if (e.param) {
          params[e.param] = e.value;
          if (e.isTimer) {
            params[e.param] = e.value ? e.value + " 00:00:00" : "";
            params[e.param_2] = e.value_2 ? e.value_2 + " 23:59:59" : "";
          }
        }
      });
      this.$emit("submitFilter", params);
    },
    showAllFilter(item, index) {
      item.isShowAll = true
      this.$set(this.filterList, index, item);
    },
    hideAllFilter(item, index) {
      item.isShowAll = false
      this.$set(this.filterList, index, item);
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
      overflow: hidden;
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
    padding-left: 5px;
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
    .filter-main {
      position: relative;
      height: 100%;
      overflow-y: scroll;
      padding: 0 10px;
      // padding-left: 10px;
      // padding-right: 3px;
      box-sizing: border-box;
      .filter-item {
        .filter-item-title {
          color: #a6a6a6;
          font-size: 10px;
          line-height: 15px;
          margin: 8px 0;
        }
        .filter-input-select {
          display: flex;
          align-items: center;
          background-color: #e5e5e5;
          border-radius: 2px;
          >input {
            flex: 1;
            height: 30px;
            font-size: 12px;
            padding-left: 10px;
          }
          >img {
            width: 15px;
            height: 15px;
            margin-right: 10px;
          }
        }
        .filter-options {
          display: grid;
          grid-template-columns: repeat(3, 33.33%);
          grid-row-gap: 8px;
          .filter-option {
            background-color: #e5e5e5;
            line-height: 29px;
            height: 30px;
            margin-right: 7px;
            text-align: center;
            color: #505050;
            font-size: 12px;
            border-radius: 5px;
            box-sizing: border-box;
          }
          .show-all {
            background-color: #fff;
            border: 1rpx solid #666;
            color: #505050;
          }
          .hidden {
            display: none;
          }
          .filter-time {
            display: flex;
            grid-column-start: span 3;
            .filter-picker {
              flex: 0 0 40%;
              .filter-option {
                padding: 0 5px;
              }
            }
            .line {
              flex: 1;
              margin: 14px 10px 0 10px;
              height: 1px;
              background-color: #999;
            }
          }
          .filter-input {
            grid-column-start: span 3;
            text-align: right;
            padding-right: 10px;
            > input {
              display: inline-block;
              vertical-align: middle;
              padding: 0 5px;
              width: 40px;
              font-size: 12px;
              color: #505050;
              border: 1rpx solid #999;
              border-radius: 2px;
              height: 22px;
            }
            > span {
              vertical-align: middle;
              margin-left: 5px;
              color: #505050;
              font-size: 12px;
            }
          }
        }
      }
      .sidebar-btn {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;
        > span {
          flex: 1;
          text-align: center;
          line-height: 36px;
        }
        .block {
          flex-grow: 1;
          width: 100%;
        }
      }
    }
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
