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
    <div class="check_in-input-wrapper">
      <input type="text" v-model="checkInNum" class="check_in-input" placeholder="请输入手机号或卡号确认签到">
      <image class="search-icon" mode="aspectFit" src="/static/images/staff/search.svg"></image>
    </div> 
    <div class="bottom-btn" @click="confirmCheckIn">
      确认签到
      <div class="block" v-if="isPhoneX"></div>
    </div>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
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
      venueList: [],
      checkInNum: "",
      frontSign: "",
      brushCardSwich: 0 // 是否开启快速签到
    }
  },
  components: {
    headerSearch
  },
  mixins:[colorMixin],
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
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
      this.getSetting()
    },
    _getVenueList() {
      getVenueList(this.selectedStore.storeId).then((res) => {
        this.venueList = res
        let nameList = []
        res.forEach(e => {
          nameList.push(e.venueName)
        })
        this.venueNameList = nameList
      })
    },
    // 获取门店设置
    getSetting() {
      let that = this
      HttpRequest({
        url: 'consumption/log/sign/getsetting',
        data: {
          storeId: that.selectedStore.storeId
        },
        success(res) {
          that.brushCardSwich = res.data.data.brushCardSwich
        }
      })
    },
    // 校验
    confirmCheckIn() {
      let that = this
      HttpRequest({
        url: '/customer/register/compact/querycard',
        data: {
          cardId: that.checkInNum
        },
        success(res) {
          if(res.data.code == 500) { // 为卡号
            that.frontSign = ""
          } else { // 不为卡号,查询客户
            that.frontSign = 1
            that.getCustomerList()
          }
        }
      })
    },
    getCustomerList() {
      let that = this
      HttpRequest({
        url: '/consumption/general/customerforcost',
        data: {
          nameOrPhone: that.checkInNum,
          customerClass: 3
        },
        success(res) {
          if(!res.data.data.result.length || res.data.data.result.length > 1) {
            wx.showModal({
              title: "提示",
              content: "请输入具体信息查询",
              showCancel: false
            });
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "~COMMON/less/common.less";
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
  .check_in-input-wrapper {
    position: relative;
    margin-top: 15px;
    .check_in-input {
      padding: 0 20px;
      box-sizing: border-box;
      height: 70px;
      text-align: center;
      background-color: #e7e7e7;
    }
    .search-icon {
      position: absolute;
      top: 24px;
      right: 10px;
      width: 22px;
      height: 22px;
    }
  }
  .bottom-btn {
    font-size: 14px;
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