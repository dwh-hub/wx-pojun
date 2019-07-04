<template>
  <div class="header-search">
    <div v-if="storeList.length" class="store" :style="{background: color}" @click="toggleStore">
      <sapn class="store-text">{{selectedStore.storeName || '门店'}}</sapn>
      <i class="triangle-icon"></i>
    </div>
    <div class="store-list" v-show="showStoreList">
      <div
        class="store-item"
        @click="selectStore(item)"
        v-for="(item,index) in _storeList"
        :key="index"
      >{{item.storeName}}</div>
    </div>
    <div class="search-wrapper" :style="{background: color}">
      <div class="input-wrapper">
        <image class="search-icon" mode="aspectFit" src="/static/images/staff/search.svg"></image>
        <input
          class="search-input"
          type="text"
          :value="text"
          placeholder="请输入搜索内容"
          placeholder-style="color:#999;"
          @input="_search"
        >
      </div>
    </div>
    <div class="mask-all" v-show="showMask" @click.prevent="showMask = false;showStoreList = false"></div>
  </div>
</template>

<script>
import { debounce } from "COMMON/js/common.js";
export default {
  props: {
    storeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    color: {
      type: String
    },
    search: {
      type: Function
    },
    searchText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showStoreList: false,
      showMask: false,
      selectedStore: {},
      _storeList: [],
      text: ""
    };
  },
  mounted() {
    this.text = this.searchText
    if(this.storeList.length) {
      this._storeList = this.storeList
      this.selectedStore = this.storeList[0]
    }
  },
  watch: {
    storeList(val, oldVal) {
      this.selectedStore = val[0]
      this._storeList = val
    }
  },
  methods: {
    toggleStore() {
      this.showMask = !this.showMask;
      this.showStoreList = !this.showStoreList;
    },
    selectStore(item) {
      if (this.selectedStore.storeId == item.storeId) {
        return this.showMask = false;
      }
      this.selectedStore = item;
      this.showMask = false;
      this.showStoreList = false;
      this.$emit("selectStore", item)
    },
    _search: debounce(function(e){
      this.text = e.mp.detail.value
      this.search(e.mp.detail.value)
    },200)
  }
};
</script>

<style lang="less" scoped>
.header-search {
  display: flex;
  position: relative;
  /* 兼容真机白边 */
  margin-top: -1rpx;
  .store {
    height: 44px;
    /* 兼容真机白边 */
    margin-right: -1px;
    .store-text {
      display: inline-block;
      vertical-align: middle;
      line-height: 44px;
      height: 44px;
      padding-left: 10px;
      color: #fff;
    }

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
  }
  .store-list {
    position: absolute;
    top: 44px;
    width: 100%;
    min-height: 44px;
    max-height: 40vh;
    overflow: auto;
    z-index: 99;
    .store-item {
      padding: 15px;
      background-color: #fff;
      border-bottom: 1rpx solid #eee;
      box-shadow: none;
      border-radius: 0px;
    }
  }
  .search-wrapper {
    flex: 1;
    box-sizing: border-box;
    padding: 7px 15px;
    height: 44px;
    .input-wrapper {
      display: flex;
      padding: 3px 10px 3px 2px;
      border-radius: 4px;
      background-color: #f6f6f6;
      .search-icon {
        width: 24px;
        height: 24px;
        // margin-top: 4px;
        vertical-align: middle;
      }
      .search-input {
        flex: 1;
        width: 100%;
        height: 24px;
        min-height: 24px;
        padding: 0;
        margin: 0;
        line-height: inherit;
        color: #333;
        text-align: left;
        background-color: transparent;
        border: 0;
        box-sizing: border-box;
        resize: none;
      }
    }
  }
  .mask-all {
    top: 82px;
  }
}
</style>
