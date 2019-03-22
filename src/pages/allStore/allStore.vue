<template>
  <div class="all-store">
    <store-item :info="item" v-for="(item, index) in storeList" :key="index"></store-item>
  </div>
</template>

<script>
import storeItem from "COMPS/storeItem.vue";
import { setNavTab, window } from "COMMON/js/common.js";

export default {
  name: "all-store",
  data() {
    return {
      storeList: [],
      companyId: ""
    };
  },
  components: {
    storeItem
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  mounted() {
    this.getAllStore();
    if (wx.getStorageSync("userInfo")) {
      this.companyId = wx.getStorageSync("userInfo").companyId;
    }
  },
  methods: {
    getAllStore() {
      let that = this;
      wx.request({
        url: window.api + "/store/all-store-name-list-nolimit",
        data: {
          companyId: that.companyId || ""
        },
        success(res) {
          let _storeList = [];
          _storeList = res.data.data.map(e => {
            return {
              cover: window.api + e.images.split(",")[0],
              address: e.address,
              range: "",
              storeName: e.storeName,
              storeId: e.storeId
            };
          });
          that.storeList = _storeList;
          console.log(that.storeList)
        }
      });
    }
  }
};
</script>

<style lang="less">
page {
  background-color: #f5f5f5;
}
.all-store {
  padding: 15px;
  .store-item {
    margin-bottom: 15px;
  }
}
</style>


