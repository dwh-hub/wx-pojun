<template>
  <div class="common-list">
    <list-day-item :info="item" v-for="(item,index) in list" :key="index"></list-day-item>
    <van-loading :color="themeColor" v-if="isLoading"/>
  </div>
</template>

<script>
import {setNavTab} from "COMMON/js/common.js";
import listDayItem from "../components/list-day-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      isLoading: false,
      title: "",
      list: []
    };
  },
  components: {
    listDayItem
  },
  mounted() {
    setNavTab();
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  onLoad(options) {
    if (options.list) {
      this.list = JSON.parse(options.list);
      wx.setNavigationBarTitle({
        title: options.title
      });
    }
  }
};
</script>

<style lang="less">
.common-list {
  border-bottom: 1rpx solid #eee;
}
</style>
