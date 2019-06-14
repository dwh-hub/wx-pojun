<template>
  <div class="public-sea">
    <header-search
      :storeList="storeList"
      :color="themeColor"
      :search="searchChange"
      @selectStore="selectStore"
    ></header-search>
    <header-data :headerData="headerData"></header-data>
    <filter-nav :nav="nav"></filter-nav>
    <div class="customer-list">
      <div class="customer-item" v-for="(item,index) in customerList" :key="index">
        <div class="item-left" @click="selectCustomer(item,index)" v-show="isOperate">
          <div class="icon-wrapper" :class="{border: !item.isSelect}">
            <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect">
          </div>
        </div>
        <staff-coach-item @clickIcon="call(item)" @clickItem="toDetail(item,index)" :info="item"></staff-coach-item>
      </div>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无客户" v-if="!customerList.length && !isLoading"></none-result>
    </div>

    <div class="operate-bottom" v-if="isOperate">
      <div class="left" @click="selectAll">
        <div class="icon-wrapper" :class="{border: !isAllSelect}">
          <img src="/static/images/staff/select-icon.png" alt v-show="isAllSelect">
        </div>
        <span class="left-text">全选</span>
      </div>
      <div class="middle">已选{{selectNum || '0'}}人</div>
      <div class="right">
        <div class="btn" @click="cancelOperate()" :style="{background: themeColor}">取消操作</div>
        <div class="btn" @click="claim" :style="{background: themeColor}">认领</div>
      </div>
    </div>
    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="getOperate"></suspension-window>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import headerSearch from "../components/header-search.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import suspensionWindow from "../components/suspension-window.vue";
import noneResult from "COMPS/noneResult.vue";

export default {
  data() {
    return {
      page: 1,
      nav: [
        {
          navTitle: "登记时间",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterDate();
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterDate();
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterDate();
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate();
              }
            }
          ]
        },
        {
          navTitle: "筛选条件二",
          children: [
            {
              sonText: "未维护时间"
            }
          ]
        },
        {
          navTitle: "客户状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterType();
              }
            },
            {
              sonText: "现有",
              action: () => {
                this.filterType(3);
              }
            },
            {
              sonText: "潜在",
              action: () => {
                this.filterType(1);
              }
            },
            {
              sonText: "定金",
              action: () => {
                this.filterType(4);
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "数据一",
          dataNum: "0"
        },
        {
          dataText: "数据二",
          dataNum: "0"
        },
        {
          dataText: "数据三",
          dataNum: "0"
        }
      ],
      operateList: [
        {
          text: "认领",
          iconUrl: "/static/images/staff/close.svg"
        }
      ],
      customerList: [{}, {}, {}, {}],
      isLoading: false,
      isOperate: false,
      isAllSelect: false,
      showStoreList: false,
      selectedStore: {},
      storeList: [],
      showMask: false,
      filter: {
        nameOrPhone: "",
        addTimeEnd: "",
        addTimeStart: "",
        customerClass: ""
      }
    };
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.getCustomerList();
  },
  onReachBottom() {
    this.getCustomerList();
  },
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    suspensionWindow,
    headerSearch,
    noneResult
  },
  mixins: [colorMixin],
  computed: {
    selectNum() {
      let _num = 0;
      this.customerList.forEach(e => {
        if (e.isSelect) {
          _num++;
        }
      });
      return _num;
    }
  },
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
      this.page = 1;
      this.getCustomerList();
    },
    selectStore(item) {
      this.selectedStore = item;
      this.page = 1;
      this.getCustomerList();
    },
    toDetail(item, index) {
      if (this.isOperate) {
        this.selectCustomer(item, index);
        return;
      }
      if (!item.id) {
        return;
      }
      wx.navigateTo({
        url: "../customer_detail/main?id=" + item.id
      });
    },
    selectCustomer(item, index) {
      if (!this.isOperate) {
        return;
      }
      this.customerList[index].isSelect = !item.isSelect;
      if (this.customerList.filter(e => true !== e.isSelect).length > 0) {
        this.isAllSelect = false;
      } else {
        this.isAllSelect = true;
      }
    },
    selectAll() {
      let that = this;
      if (that.isAllSelect) {
        that.isAllSelect = false;
        this.customerList = this.customerList.map(e => {
          e.isSelect = false;
          return e;
        });
      } else {
        that.isAllSelect = true;
        this.customerList = this.customerList.map(e => {
          e.isSelect = true;
          return e;
        });
      }
    },
    getCustomerList() {
      this.isLoading = true;
      let that = this;
      var _data = Object.assign(
        {},
        {
          page: that.page,
          storeId: that.selectedStore.storeId
        },
        that.filter
      );
      HttpRequest({
        url: window.api + "/customer/public/pages",
        data: _data,
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            let _res = res.data.data;
            let _data;
            if (!_res.result.length && that.page == 1) {
              return (that.customerList = []);
            }
            that.page++;
            // if (that.headerData[0].dataNum == "0") {
              that.headerData[0].dataNum = _res.recCount;
            // }
            _data = _res.result.map(e => {
              return {
                isSelect: false,
                id: e.customerId,
                cover: window.api + e.headImgPath,
                first_1: e.customerName,
                first_2: e.customerClass,
                second_1: e.totalCardCount || 0,
                second_tip_1: "合同数：",
                second_2: "",
                third_1: e.lastTrackTime,
                third_tip_1: "最后签到时间："
              };
            });
            if (that.page == 2 || that.page == 1) {
              that.customerList = _data;
            } else {
              that.customerList = that.customerList.concat(_data);
            }
          } else {
            that.customerList = [];
          }
        }
      });
    },
    filterDate(day) {
      if (!day || day == 0) {
        this.filter.addTimeEnd = "";
        this.filter.addTimeStart = "";
      } else {
        const DAY = 24 * 60 * 60 * 1000;
        let stamp = new Date().getTime();
        let endTime = formatDate(new Date(stamp), "yyyy-MM-dd") + " 23:59:59";
        let startTime =
          formatDate(new Date(stamp - DAY * day), "yyyy-MM-dd") + " 23:59:59";
        this.filter.addTimeStart = startTime;
        this.filter.addTimeEnd = endTime;
      }
      this.page = 1;
      this.getCardPage();
    },
    filterType(type) {
      this.filter.customerClass = type || "";
      this.page = 1;
      this.getCustomerList();
    },
    getOperate() {
      this.isOperate = true;
    },
    cancelOperate() {
      this.isOperate = false;
      this.isAllSelect = false;
      this.customerList = this.customerList.map(e => {
        e.isSelect = false;
        return e;
      });
    },
    claim() {
      if (!this.selectNum) {
        return wx.showToast({
          title: "请先选择客户",
          icon: "none",
          duration: 1000
        });
      }
      let that = this;
      wx.showModal({
        title: "提示",
        content: `是否确认认领？`,
        success(res) {
          if (res.confirm) {
            wx.showLoading();
            let _customerIdStr = "";
            that.customerList.forEach(e => {
              if (e.isSelect) {
                _customerIdStr = _customerIdStr + e.id + ",";
              }
            });
            HttpRequest({
              url: window.api + "/customer/public/claim",
              data: {
                customerIdArray: _customerIdStr,
                storeId: that.selectedStore.storeId
              },
              success(res) {
                wx.hideLoading();
                wx.showModal({
                  title: "提示",
                  content: res.data.message,
                  showCancel: false
                });
                if (res.data.code == 200) {
                  that.headerData[0].dataNum = 0
                  that.cancelOperate();
                  that.page = 1;
                  that.getCustomerList();
                }
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
  overflow-y: auto !important;
}
.public-sea {
  .filter-nav {
    margin-top: 5px;
    margin-bottom: 1px;
    .mask {
      top: 165px;
    }
  }
  .customer-list {
    .customer-item {
      display: flex;
      background-color: #fff;
      .item-left {
        padding-left: 10px;
        box-sizing: border-box;
        .icon-wrapper {
          margin-top: 27px;
        }
      }
    }
  }
  .staff-coach-item {
    flex: 1;
    border-bottom: 1rpx solid #eee;
  }

  .icon-wrapper {
    width: 20px;
    height: 20px;
    &.border {
      border: 1rpx solid #eee;
      border-radius: 50%;
    }
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .operate-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 40px;
    height: 40px;
    color: #2a82e4;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    justify-content: space-between;
    .left {
      .icon-wrapper {
        display: inline-block;
        margin: 0 15px;
        &.border {
          vertical-align: middle;
        }
      }
      .left-text {
        display: inline-block;
      }
    }
    .right {
      // float: right;
      .btn {
        display: inline-block;
        padding: 0 15px;
        border-left: 1rpx solid #fff;
        color: #fff;
      }
    }
  }
}
</style>
