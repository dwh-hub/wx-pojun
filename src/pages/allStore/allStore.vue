<template>
  <div class="all-store">
    <store-item :info="item" v-for="(item, index) in storeList" :key="index"></store-item>
  </div>
</template>

<script>
import storeItem from "COMPS/storeItem.vue";
import { setNavTab, window, getRange } from "COMMON/js/common.js";
import store from "../../utils/store";

export default {
  name: "all-store",
  data() {
    return {
      storeList: [{},{},{}],
      companyId: "",
      longitude: "", // 经度
      latitude: "" // 纬度
    };
  },
  components: {
    storeItem
  },
  onLoad() {
    setNavTab();
    this.companyId = wx.getStorageSync("companyId");
  },
  mounted() {
    this.longitude = store.state.longitude;
    this.latitude = store.state.latitude;
    this.getAllStore();
    
    // if (wx.getStorageSync("userInfo")) {
    //   this.companyId = wx.getStorageSync("userInfo").companyId;
    // }
    this.companyId = wx.getStorageSync("companyId");
  },
  methods: {
    getAllStore() {
      let that = this;
      // wx.showLoading({
      //   title: "加载中..."
      // });
      wx.request({
        url: window.api + "/store/all-store-name-list-nolimit",
        data: {
          companyId: that.companyId || ""
        },
        success(res) {
          if (res.data.code === 200) {
            let _storeList = [];
            _storeList = res.data.data.map(e => {
              let _range;
              if (e.mapPoint) {
                let _lat = e.mapPoint.split(",")[1];
                let _lng = e.mapPoint.split(",")[0];
                _range = getRange(that.latitude, that.longitude, _lat, _lng);
              }
              return {
                cover: e.images ? window.api + e.images.split(",")[0] : "",
                address: e.address,
                range: _range,
                storeName: e.storeName,
                storeId: e.storeId
              };
            });
            that.storeList = _storeList;
          } else {
            that.storeList = []
          }
          // wx.hideLoading();
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


