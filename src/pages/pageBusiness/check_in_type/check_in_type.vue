<template>
  <div class="check-in-type">
    <div class="header-search list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
    </div>
    <div class="common-services icon-wrapper">
      <div class="services-item icon-item" @click="toNav(item.navUrl)" v-for="(item,index) in typeList" :key="index">
        <image mode="aspectFit" :src="item.iconUrl" :class="item.class"></image>
        <div class="services-icon icon-text">{{item.text}}</div>
      </div>
    </div>
    <picker @change="onVenueChange" :value="venueIndex" :range="venueNameList">
      <div class="venue" :style="{'border': '1px solid '+ themeColor}">
        {{venueNameList[venueIndex]}}
      </div>
    </picker>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
import { getVenueList } from "../common/js/http.js";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue"
import headerSearch from "../components/header-search.vue";

export default {
  data() {
    return {
      typeList: [{
        iconUrl: "/static/images/staff/face.svg",
        text: "人脸签到",
        navUrl: "",
        class: 'icon-lg'
      },{
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_2.svg",
        text: "签到记录",
        navUrl: "",
        class: ''
      }],
      storeList: [],
      selectedStore: {},
      venueIndex: 0,
      venueNameList: [],
      venueList: []
    }
  },
  components: {
    headerSearch
  },
  mixins:[colorMixin],
  mounted() {
    setNavTab()
    this.storeList = store.state.allStore.filter(e => e.storeId);
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this._getVenueList()
  },
  methods: {
    toNav(url) {
      wx.navigateTo({
        url: url
      });
    },
    searchChange(e) {
    },
    onVenueChange(e) {
      this.venueIndex = e.mp.detail.value
    },
    selectStore(item) {
      this.selectedStore = item
      this._getVenueList()
    },
    _getVenueList() {
      console.log(this.selectedStore)
      getVenueList(this.selectedStore.storeId).then((res) => {
        this.venueList = res
        let nameList = []
        res.forEach(e => {
          nameList.push(e.venueName)
        })
        this.venueNameList = nameList
      })
    }
  }
}
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";
.check-in-type {
  .icon-item {
    padding: 0;
    margin-top: 5px;
    >image {
      width: 50px;
      height: 50px;
    }
    .icon-lg {
      width: 30px;
      height: 30px;
      margin: 10px;
    }
    .icon-text {
      margin-top: -12px; 
      font-size: 12px;
    }
  }
  .venue {
    box-sizing: border-box;
    line-height: 42px;
    width: 100%;
    margin-top: 15px;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    border-radius: 10px;
  }
}
</style>