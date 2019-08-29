<template>
  <div class="header-search">
    <div v-if="storeList.length" class="store" :style="{background: color}" @click="toggleStore">
      <sapn class="store-text">{{selectedStore.storeName || '门店'}}</sapn>
      <i class="triangle-icon"></i>
    </div>

    <cover-view v-if="isCoverView" class="mask-all" v-show="showMask" @click.prevent="showMask = false;showStoreList = false">
      <cover-view class="store-list" :style="{'top': '0px'}">
        <cover-view
          class="store-item"
          @click="selectStore(item)"
          v-for="(item,index) in _storeList"
          :key="index"
        >{{item.storeName}}</cover-view>
      </cover-view>
    </cover-view>
    <div class="store-list" v-else v-show="showStoreList">
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
          v-model="text"
          :placeholder="placeholder"
          placeholder-style="color:#999;"
          @input="_search"
          @confirm="enterSearch"
        >
      </div>
    </div>
    
    <div v-if="!isCoverView" class="mask-all" v-show="showMask" @click.prevent="showMask = false;showStoreList = false"></div>
  </div>
</template>

<script>
import { debounce } from "COMMON/js/common.js";
import {EventBus} from '../common/js/eventBus.js'
import store from "@/utils/store.js";
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
      type: Function,
      default: function() {
      }
    },
    enterSearch: {
      type: Function,
      default: function() {
      }
    },
    searchText: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请输入手机号或姓名搜索"
    },
    isCoverView: {
      type: Boolean,
      default: false
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
    EventBus.$on('showFilterMask', () => {
      this.showMask = false;
      this.showStoreList = false;
    })
    this.text = this.searchText
    this._storeList = store.state.allStore;
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0];
    
    EventBus.$on('selectedStore', (item) => {
      if(undefined == this.selectedStore || null == this.selectedStore) {
        return
      }
      if (item.storeName != this.selectedStore.storeName) {
        this.selectedStore = item
      }
    })
  },
  computed: {
    maskTop() {
      if(!this.showMask) {
        return "42px"
      }
      return (42 + this._storeList.length*46)*2 + 'rpx'
    }
  },
  watch: {
    storeList: {
      handler(val, oldVal) {
        this.selectedStore = this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
        this._storeList = val
      },
      deep: true
    },
    // selectedStore: {
    //   handler(val, oldval) {
    //     console.log("======selectedStore=====")
    //     EventBus.$emit('selectedStore', val)
    //   },
    //   deep: true
    // }
  },
  methods: {
    toggleStore() {
      this.showMask = !this.showMask;
      this.showStoreList = !this.showStoreList;
      EventBus.$emit('showStoreMask')
    },
    selectStore(item) {
      if (this.selectedStore.storeId == item.storeId) {
        this.showStoreList = false;
        this.showMask = false;
        return
      }
      this.selectedStore = item;
      this.showMask = false;
      this.showStoreList = false;
      this.$emit("selectStore", item)
    },
    _search: debounce(function(e){
      if(!this.search) {
        return
      }
      this.search(e.mp.detail.value)
    },200)
  }
};
</script>

<style lang="less" scoped>
@import "../common/less/staff_common.less";
.header-search {
  display: flex;
  width: 100%;
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
    overflow-y: scroll;
    z-index: 99;
    .store-item {
      padding-left: 15px;
      line-height: 46px;
      box-sizing: border-box;
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
    top: 44px;
  }
}
</style>
