<template>
  <div class="all-store">
    <store-item @tapStore="toStoreDetail"></store-item>
  </div>
</template>

<script>
import storeItem from 'COMPS/storeItem.vue';
export default {
  name: 'all-store',
  data() {
    return {

    }
  },
  components: {
    storeItem
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


