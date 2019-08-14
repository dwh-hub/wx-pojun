<template>
  <div class="public-sea">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav :nav="nav"></filter-nav>
    </div>
    <div class="customer-list">
      <div class="customer-item" v-for="(item,index) in list" :key="index">
        <div class="item-left" @click="selectCustomer(item,index)" v-show="isOperate">
          <div class="icon-wrapper" :class="{border: !item.isSelect}">
            <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect">
          </div>
        </div>
        <staff-coach-item @clickIcon="call(item)" @clickItem="toDetail(item,index)" :info="item"></staff-coach-item>
      </div>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无客户" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
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
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime"
    ></timePicker>
    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="getOperate"></suspension-window>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import {checkAuth} from "../common/js/service_config.js";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import headerSearch from "../components/header-search.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import suspensionWindow from "../components/suspension-window.vue";
import noneResult from "COMPS/noneResult.vue";
import listPageMinxin from "../components/list-page-mixin.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";

export default {
  data() {
    return {
      // page: 1,
      nav: [
        {
          navTitle: "今日",
          children: [
            {
              sonText: "全部(登记时间)",
              action: () => {
                this.filterDate();
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterDate(1);
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate(30);
              }
            },
            {
              sonText: "自定义",
              action: () => {
                this.timePickerType = ""
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "签到时间",
          children: [
            {
              sonText: "全部(签到时间)",
              action: () => {
                this.filterConsumedDate(0);
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterConsumedDate(1);
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterConsumedDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterConsumedDate(30);
              }
            },
            {
              sonText: "自定义",
              action: () => {
                this.timePickerType = "consumed"
                this.showPicker()
              }
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
              sonText: "订金",
              action: () => {
                this.filterType(4);
              }
            },
            {
              sonText: "失效",
              action: () => {
                this.filterType(5);
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "总计",
          dataNum: "0"
        },
        {
          dataText: "潜在客户",
          dataNum: "0"
        },
        {
          dataText: "现有客户",
          dataNum: "0"
        }
      ],
      operateList: [
        {
          text: "认领",
          hasAuth: checkAuth(55),
          class: 'operate icon-renling',
          iconUrl: "/static/images/staff/close.svg"
        }
      ],
      // list: [{}, {}, {}, {}],
      // isLoading: false,
      isOperate: false,
      isAllSelect: false,
      showStoreList: false,
      showMask: false,
      timePickerType: "",
      filter: {
        nameOrPhone: "",
        addTimeEnd: "",
        addTimeStart: "",
        customerClass: "",
        lastConsumedTimeStart: "",
        lastConsumedTimeEnd: ""
      }
    };
  },
  mounted() {
    this.nav[0].navTitle = "今日";
    this.getList();
  },
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    suspensionWindow,
    headerSearch,
    noneResult
  },
  mixins: [colorMixin, listPageMinxin],
  computed: {
    selectNum() {
      let _num = 0;
      this.list.forEach(e => {
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
      this.list[index].isSelect = !item.isSelect;
      if (this.list.filter(e => true !== e.isSelect).length > 0) {
        this.isAllSelect = false;
      } else {
        this.isAllSelect = true;
      }
    },
    selectAll() {
      let that = this;
      if (that.isAllSelect) {
        that.isAllSelect = false;
        this.list = this.list.map(e => {
          e.isSelect = false;
          return e;
        });
      } else {
        that.isAllSelect = true;
        this.list = this.list.map(e => {
          e.isSelect = true;
          return e;
        });
      }
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: '/customer/public/static/count',
          data: _data,
          success(res) {
            that.headerData[1].dataNum = res.data.data.existingCount
            that.headerData[2].dataNum = res.data.data.prospectiveCount
          }
        })
        HttpRequest({
          url: "/customer/public/pages",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              return (that.list = []);
            }
            let _res = res.data.data;
            let _data;
            that.headerData[0].dataNum = _res.recCount || 0;
            _data = _res.result.map(async e => {
              if (e.headImgPath) {
                if (e.headImgPath.indexOf(".jsp") != -1) {
                  await that.getAvatar(e.headImgPath).then(res => {
                    e.headImgPath = res;
                  });
                } else {
                  e.headImgPath = window.api + e.headImgPath;
                }
              }
              return {
                isSelect: false,
                id: e.customerId,
                sex: e.sex,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                first_1: e.customerName,
                first_2: e.customerClass,
                second_1: e.totalCardCount || 0,
                second_tip_1: "合同数：",
                second_2: "",
                third_1: e.lastTrackTime || '--',
                third_tip_1: "最后签到时间："
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.timePickerType = ""
      this.setDate(obj);
    },
    filterConsumedDate(day) {
      let obj = this.filterDateMethod(day);
      this.timePickerType = "consumed"
      this.setDate(obj)
    },
    setDate(obj) {
      if(this.timePickerType == "consumed") {
        this.filter.lastConsumedTimeStart = obj.startTime
        this.filter.lastConsumedTimeEnd = obj.endTime
        return
      }
      this.filter.addTimeStart = obj.startTime;
      this.filter.addTimeEnd = obj.endTime;
    },
    filterType(type) {
      this.filter.customerClass = type || "";
    },
    getOperate() {
      this.isOperate = true;
    },
    cancelOperate() {
      this.isOperate = false;
      this.isAllSelect = false;
      this.list = this.list.map(e => {
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
            that.list.forEach(e => {
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
                  that.headerData[0].dataNum = 0;
                  that.cancelOperate();
                  that.page = 1;
                  that.getList();
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
    border-top: 1rpx solid #eee;
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
