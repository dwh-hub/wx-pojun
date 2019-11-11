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
      <div
        class="services-item icon-item"
        @click="toNav(item.navUrl)"
        v-for="(item,index) in typeList"
        :key="index"
      >
        <image mode="aspectFit" :src="item.iconUrl" :class="item.class"></image>
        <div class="services-icon icon-text">{{item.text}}</div>
      </div>
    </div>
    <picker @change="onVenueChange" :value="venueIndex" :range="venueNameList">
      <div class="venue" :style="{'border': '1px solid '+ themeColor}">
        {{venueNameList[venueIndex]}}
        <image class="icon" src="/static/images/arrow-bottom.png"></image>
      </div>
    </picker>
    <div class="record-list">
      <p class="record-sum">今日入场人次：{{recordSum}}</p>
      <scroll-view scroll-x style="widtgh: 100%;" @scrolltolower="scrolltolower">
        <div class="record-item" v-for="(item, index) in recordList" :key="index">
          <img :src="item.cover"  @error="loadFail(index)"/>
          <div class="name">{{item.name}}</div>
        </div>
      </scroll-view>
    </div>
    <div class="bottom-wrapper">
      <div class="check_in-input-wrapper">
        <input
          type="text"
          v-model="checkInNum"
          class="check_in-input"
          placeholder="请输入手机号或卡号确认签到"
          disabled
        />
        <image class="search-icon" mode="aspectFit" src="/static/images/staff/search.svg"></image>
      </div>
      <keyboard
        :isShow="true"
        :isFixed="false"
        :isAdaptive="isPhoneX"
        @onInputChange="keyboardInput"
        @onIputdelete="keyboardDelete"
        @onLongPressDelete="keyboardDeleteAll"
      ></keyboard>
      <div class="bottom-btn" @click="confirmCheckIn" :style="{'background-color': themeColor}">
        确认签到
        <div class="block" v-if="isPhoneX"></div>
      </div>
    </div>
    <check-popup></check-popup>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import {
  checkPopupData,
  checkMethods
} from "../components/check_popup/check_popup.js";
import checkPopup from "../components/check_popup/check_popup.vue";
import { getVenueList } from "../common/js/http.js";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import headerSearch from "../components/header-search.vue";

export default {
  data() {
    return {
      typeList: [
        {
          iconUrl: "/static/images/staff/face.svg",
          text: "人脸签到",
          navUrl: "face",
          class: "icon-lg"
        },
        {
          iconUrl: "/static/images/staff/workbench_icon/workbench_icon_2.svg",
          text: "签到记录",
          navUrl: "../check_in_record/main",
          class: ""
        },
        {
          iconUrl: "/static/images/staff/face.svg",
          text: "人脸采集",
          navUrl: "../face_collect/main",
          class: "icon-lg"
        }
      ],
      storeList: [],
      selectedStore: {},
      venueIndex: 0,
      venueNameList: [],
      venueList: [],
      checkInNum: "",
      frontSign: "",
      brushCardSwich: 0, // 是否开启快速签到
      recordList: [],
      logPage: 1,
      recordSum: 0
    };
  },
  components: {
    headerSearch,
    checkPopup
  },
  mixins: [colorMixin],
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  onUnload() {
    this.recordList = []
  },
  mounted() {
    setNavTab();
    this.checkInNum = "";
    let allStore = store.state.allStore;
    this.storeList = allStore.filter(e => e.storeId);
    this.selectedStore =
      this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this.changeCommonStore();
    this._getVenueList();
    this.getSetting();
  },
  methods: {
    toNav(url) {
      if (url == "face") {
        url = `../face/main?type=checkIn&storeId=${
          this.selectedStore.storeId
        }&venueId=${this.venueList[this.venueIndex].venueId}`;
      }
      wx.navigateTo({
        url: url
      });
    },
    searchChange(e) {},
    getRecord() {
      let that = this;
      HttpRequest({
        url: "/consumption/log/pages",
        data: {
          page: that.logPage,
          pageNo: that.logPage,
          storeId: that.selectedStore.storeId,
          venueId: checkPopupData.venueId,
          timeStart: formatDate(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
          timeEnd: formatDate(new Date(), 'yyyy-MM-dd') + ' 23:59:59'
        },
        success(res) {
          if(res.data.code != 200 && res.data.data.result.length) {
            return
          }
          that.recordSum = res.data.data.recCount
          that.logPage++
          that.recordList = that.recordList.concat(
            res.data.data.result.map(e => {return {name: e.customerName,cover: window.api + (e.headImgPath ? e.headImgPath : '/assets/img/morenTo.png') }})
          );
        }
      });
    },
    changeCommonStore() {
      checkPopupData.storeId = this.selectedStore.storeId;
      checkPopupData.storeName = this.selectedStore.storeName;
    },
    changeCommonVenue() {
      checkPopupData.venueId = this.venueList[this.venueIndex].venueId;
      checkPopupData.venueName = this.venueList[this.venueIndex].venueName;
    },
    onVenueChange(e) {
      this.recordList = []
      this.venueIndex = e.mp.detail.value;
      this.changeCommonVenue();
      this.logPage = 1
      this.getRecord();
    },
    selectStore(item) {
      this.recordList = []
      this.selectedStore = item;
      this.changeCommonStore();
      this._getVenueList();
      this.getSetting();
    },
    _getVenueList() {
      getVenueList(this.selectedStore.storeId).then(res => {
        this.venueList = res;
        this.changeCommonVenue();
        let nameList = [];
        res.forEach(e => {
          nameList.push(e.venueName);
        });
        this.venueNameList = nameList;
        this.logPage = 1
        this.getRecord();
      });
    },
    // 获取门店设置
    getSetting() {
      let that = this;
      HttpRequest({
        url: "/consumption/log/sign/getsetting",
        data: {
          storeId: that.selectedStore.storeId
        },
        success(res) {
          that.brushCardSwich = res.data.data.brushCardSwich;
        }
      });
    },
    // 校验
    confirmCheckIn() {
      let that = this;
      if (!this.checkInNum) {
        return wx.showToast({
          title: "卡号/手机号为空",
          icon: "none"
        });
      }
      HttpRequest({
        url: "/customer/register/compact/querycard",
        data: {
          cardId: that.checkInNum
        },
        success(res) {
          if (res.data.code == 500 && that.brushCardSwich == 1) {
            // 为卡号
            that.frontSign = "";
            checkPopupData.physicsCardNo = that.checkInNum;
            checkMethods.getCardCost();
          } else {
            // 不为卡号,查询客户
            that.frontSign = 1;
            that.getCustomerList();
          }
        }
      });
    },
    // 获取卡号/手机号的用户信息
    getCustomerList() {
      let that = this;
      wx.showLoading();
      HttpRequest({
        url: "/consumption/general/customerforcost",
        data: {
          nameOrPhone: that.checkInNum,
          customerClass: 3
        },
        success(res) {
          let list = res.data.data.result;
          wx.hideLoading();
          if (!list.length) {
            return wx.showModal({
              title: "提示",
              content: "未查询到信息",
              showCancel: false
            });
          }
          if (list.length > 1) {
            // 处理phone-1的情况
            let isSame = false;
            list.forEach(e => {
              if (e.phone == that.checkInNum) {
                isSame = true;
                wx.navigateTo({
                  url: `../check_in_customer/main?id=${e.id}&storeId=${
                    that.selectedStore.storeId
                  }&venueId=${that.venueList[that.venueIndex].venueId}`
                });
              }
            });
            if (isSame) {
              return;
            }
            return wx.showModal({
              title: "提示",
              content: "请输入具体信息查询",
              showCancel: false
            });
          }
          if (list.length == 1) {
            let info = list[0];
            wx.navigateTo({
              url: `../check_in_customer/main?id=${info.id}&storeId=${
                that.selectedStore.storeId
              }&venueId=${that.venueList[that.venueIndex].venueId}`
            });
          }
        }
      });
    },
    // 自定义键盘事件
    keyboardInput(e) {
      this.checkInNum += e.mp.detail;
    },
    keyboardDelete() {
      this.checkInNum = this.checkInNum.substr(0, this.checkInNum.length - 1);
    },
    keyboardDeleteAll() {
      this.checkInNum = "";
    },
    loadFail(index) {
      this.recordList[index].cover = window.api + "/assets/img/morenTo.png";
    },
    scrolltolower() {
      this.getRecord()
    }
    // 获取卡号含有的项目
    // getCardCost() {
    //   let that = this
    //   HttpRequest({
    //     url: '/consumption/general/card/cost',
    //     data: {
    //       storeId: that.selectedStore.storeId,
    //       venueId: that.venueList[that.venueIndex].venueId,
    //       physicsCardNo: that.checkInNum,
    //       frontSign: that.frontSign,
    //       valueCardFee: '' // 储值卡的扣费金额
    //     },
    //     success(res) {
    //       let data = res.data.data
    //       let code = res.data.code
    //       if (code == 202 || code == 201) { // 消费天 202 其他 201
    //         // 快速签到时直接签到
    //       }
    //       if(code == 503) {
    //         // 含有多个项目，选择
    //       }
    //       if(code == 519) {
    //         // 团课
    //       }
    //       if(code == 513) {
    //         // 私教
    //       }
    //     }
    //   })
    // }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "~COMMON/less/common.less";
@import "../common/less/font.less";
.check-in-type {
  .icon-item {
    padding: 0;
    margin-top: 5px;
    > image {
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
  .record-list {
    white-space: nowrap;
    .record-sum {
      text-align: center;
      color: #505050;
      font-size: 10px;
      margin-top: 5px;
    }
    .record-item {
      display: inline-block;
      text-align: center;
      margin-top: 10px;
      width: 50px;
      overflow: hidden;
      > img {
        width: 30px;
        height: 30px;
        margin: 0 auto;
        border-radius: 4px;
        background-color: #eee;
      }
      .name {
        font-size: 10px;
        color: #505050;
      }
    }
  }
  .bottom-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .check_in-input-wrapper {
      position: relative;
      margin-top: 15px;
      .check_in-input {
        padding: 0 20px;
        font-size: 16px;
        box-sizing: border-box;
        height: 50px;
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
      position: static;
      font-size: 14px;
      z-index: 98;
    }
  }
  .venue {
    box-sizing: border-box;
    line-height: 42px;
    width: 100%;
    margin-top: 15px;
    padding-left: 45px;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    border-radius: 10px;
    .icon {
      width: 25px;
      height: 25px;
      margin-top: 10px;
      margin-right: 20px;
      float: right;
    }
  }
}
</style>