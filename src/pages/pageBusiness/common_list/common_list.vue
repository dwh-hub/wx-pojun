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
  mounted() {
    setNavTab();
  },
  onLoad(options) {
    console.log(options)
    if (options.list) {
      this.list = options.list;
      wx.setNavigationBarTitle({
        title: options.title
      });
    }
  }
};
</script>

<style>
</style>
