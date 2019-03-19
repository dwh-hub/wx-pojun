<template>
  <div class="all-store">
    <store-item @tapStore="toStoreDetail"></store-item>
  </div>
</template>

<script>
import storeItem from 'COMPS/storeItem.vue';
import {setNavTab} from "COMMON/js/common.js";

export default {
  name: 'all-store',
  data() {
    return {

    }
  },
  components: {
    storeItem
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  methods: {
    toStoreDetail() {
      wx.navigateTo({
        url: '../storeDetail/main'
      })
    }
  }
}
</script>

<style lang="less">
  page {background-color: #f5f5f5;}
  .all-store {
    padding: 15px;
  }
</style>


