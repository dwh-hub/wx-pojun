<template>
  <div class="customer">
    <div class="list-header">
      <div class="tabs" :style="{background: themeColor}">
        <span class="student" :class="{underline: tabIndex == 1}" @click="tabIndex = 1">列表</span>
        <span class="customer" :class="{underline: tabIndex == 2}">汇总</span>
        <!-- @click="tabIndex = 2" -->
      </div>
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>

    <div class="customer-list">
      <div class="customer-item" v-for="(item,index) in customerList" :key="index">
        <div class="item-left" @click="selectCustomer(item,index)" v-show="isOperate">
          <div class="icon-wrapper" :class="{border: !item.isSelect}">
            <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect">
          </div>
        </div>
        <staff-coach-item @clickIcon="call(item)" @clickItem="toDetail(item,index)" :info="item">
          <div>
            <img src="/static/images/staff/phone.svg" alt>
            <img src="/static/images/staff/right-arrow.svg" alt>
          </div>
        </staff-coach-item>
      </div>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无客户" v-if="!customerList.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && customerList.length">暂无更多</div>
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
        <div class="btn" @click="operate" :style="{background: themeColor}">{{operateText}}</div>
      </div>
    </div>

    <van-popup
      :show="showSalesPopup"
      @close="showSalesPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="sales-list">
        <div
          class="sales-item"
          v-for="(item, index) in actionList"
          :key="index"
          @click="selectRole(item)"
        >
          <div class="avatar">
            <img :src="window.api + item.headImgPath" alt>
          </div>
          <div class="name">{{item.userName}}</div>
          <div class="phone"></div>
        </div>
      </div>
    </van-popup>
    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="getOperate"></suspension-window>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  debounce
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import suspensionWindow from "../components/suspension-window.vue";
import colorMixin from "COMPS/colorMixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../../../libs/regenerator-runtime/runtime.js";

export default {
  data() {
    return {
      isShowFilter: false,
      tabIndex: 1,
      nav: [
        {
          navTitle: "全部",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.getDate(0);
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.getDate(1);
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.getDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.getDate(30);
              }
            }
            // {
            //   sonText: "自定义",
            //   isDiyDate: true,
            //   action: (date) => {
            //     this.getDate(date);
            //   }
            // }
          ]
        },
        {
          navTitle: "未维护时间",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            }
          ]
        },
        {
          navTitle: "客户状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.toggleState();
              }
            },
            {
              sonText: "潜在",
              action: () => {
                this.toggleState(1);
              }
            },
            {
              sonText: "现有",
              action: () => {
                this.toggleState(3);
              }
            },
            {
              sonText: "定金",
              action: () => {
                this.toggleState(4);
              }
            },
            {
              sonText: "失效",
              action: () => {
                this.toggleState(5);
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "人数",
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
          text: "分配销售",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "分配教练",
          iconUrl: "/static/images/staff/calendar.svg"
        }
        // {
        //   text: "发送手机短信",
        //   iconUrl: "/static/images/staff/calendar.svg"
        // },
        // {
        //   text: "关注",
        //   iconUrl: "/static/images/staff/calendar.svg"
        // }
      ],
      customerList: [{}, {}, {}, {}],
      isLoading: true,
      isNoMore: false,
      isOperate: false,
      isAllSelect: false,
      showSalesPopup: false,
      page: 1,
      storeList: [],
      // coachList: [],
      // saleList: [],
      actionList: [],
      selectedRole: {},
      selectedStore: {},
      operateText: "",
      filter: {
        namePhone: "",
        customerClass: "",
        addTimeStart: "",
        addTimeEnd: ""
      }
    };
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.getCustomerList();
  },
  onHide() {
    this.clearFilter();
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    suspensionWindow,
    headerSearch,
    noneResult
  },
  computed: {
    window() {
      return window;
    },
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
  onReachBottom() {
    this.getCustomerList();
  },
  onPullDownRefresh() {
    this.customerList = [{}, {}, {}, {}];
    this.page = 1;
    this.isLoading = false;
    this.isNoMore = false;
    this.isOperate = false;
    this.showSalesPopup = false;
    this.getCustomerList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    clearFilter() {
      for (let key in this.filter) {
        this.filter[key] = "";
      }
    },
    selectStore(item) {
      this.selectedStore = item;
      this.page = 1;
      this.isNoMore = false;
      this.getCustomerList();
    },
    getCustomerList() {
      if (this.isNoMore) {
        return;
      }
      this.isLoading = true;
      let that = this;
      var _data = Object.assign(
        {},
        {
          page: that.page,
          searchStore: that.selectedStore.storeId
        },
        that.filter
      );
      HttpRequest({
        url: window.api + "/customer/list/search",
        data: _data,
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            let _res = res.data.data;
            let _data;
            if (!_res.result.length) {
              // if (that.page == 1) {
              //   that.customerList = [];
              // }
              that.isNoMore = true;
            }
            that.page++;
            // if (that.headerData[0].dataNum == "0") {
            that.headerData[0].dataNum = _res.recCount;
            // }
            _data = _res.result.map(async e => {
              if (e.headImgPath) {
                if (e.headImgPath.indexOf(".jsp") != -1) {
                  await that.getAvatar(e.headImgPath).then(res => {
                    e.headImgPath = res;
                  });
                } else {
                  e.headImgPath = window.api + e.headImgPath
                }
              }
              return {
                isSelect: false,
                id: e.id,
                sex: e.sex,
                phone: e.phone,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                first_1: e.name,
                first_2: e.customerClassChar,
                second_1: e.cardNum || 0,
                second_tip_1: "合同数：",
                second_2: "",
                third_1: e.lastTrackTime || "暂无",
                third_tip_1: "最后签到时间："
              };
            });
            Promise.all(_data).then(result => {
              _data = result;
              if (that.page == 2 || that.page == 1) {
                that.customerList = _data;
              } else {
                that.customerList = that.customerList.concat(_data);
              }
            });
          } else {
            that.customerList = [];
          }
        }
      });
    },
    getAvatar(url) {
      return new Promise(function(resolve, reject) {
        wx.request({
          url: window.api + url,
          success(res) {
            resolve(res.data);
          }
        });
      });
    },
    // 获取教练/销售列表 type 1 教练 0 销售
    getUserofrole(type) {
      let that = this;
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/customer/register/userofrole",
          data: {
            storeId: that.selectedStore.storeId,
            positionType: type
          },
          success(res) {
            resolve(res);
          }
        });
      });
    },
    // 分配教练
    allotCoach() {
      let _customerIdStr = "";
      this.customerList.forEach(e => {
        if (e.isSelect) {
          _customerIdStr = _customerIdStr + e.id + ",";
        }
      });
      let that = this;
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/mobile/coach/allot/allocate",
          data: {
            customerIdStr: _customerIdStr,
            serviceCoachId: that.selectedRole.userId,
            serviceCoachName: that.selectedRole.userName,
            storeId: that.selectedStore.storeId
          },
          success(res) {
            resolve(res);
          }
        });
      });
    },
    // 分配销售
    allotSale() {
      let _customerIdStr = "";
      this.customerList.forEach(e => {
        if (e.isSelect) {
          _customerIdStr = _customerIdStr + e.id + ",";
        }
      });
      let that = this;
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/customer/list/allotcustomer",
          data: {
            customerIdStr: _customerIdStr,
            serviceUserIdArray: that.selectedRole.userId,
            serviceUserName: that.selectedRole.userName,
            storeId: that.selectedStore.storeId
          },
          success(res) {
            resolve(res);
          }
        });
      });
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
    showFilter() {
      this.isShowFilter = true;
    },
    searchChange(event) {
      this.filter.namePhone = event;
      this.page = 1;
      this.isNoMore = false;
      this.getCustomerList();
    },
    // 通过回传的iconText来获取对应的列表
    getOperate(param) {
      this.operateText = param;
      this.isOperate = true;
      if (param == "分配教练") {
        this.getUserofrole(0).then(res => {
          if (res.data.code == 200) {
            this.actionList = res.data.data;
          }
        });
      }
      if (param == "分配销售") {
        this.getUserofrole(1).then(res => {
          if (res.data.code == 200) {
            this.actionList = res.data.data;
          }
        });
      }

      if (param == "发送手机短信") {
      }
    },
    call(item) {
      wx.makePhoneCall({
        phoneNumber: item.phone
      });
    },
    // 选择教练/销售 分配
    selectRole(item) {
      this.selectedRole = item;
      let that = this;
      wx.showModal({
        title: "提示",
        content: `是否将选中的客户分配给${that.selectedRole.userName}？`,
        success(res) {
          if (res.confirm) {
            let _method;
            if (that.operateText == "分配教练") {
              _method = that.allotCoach();
            }
            if (that.operateText == "分配销售") {
              _method = that.allotSale();
            }
            wx.showLoading({
              title: "请稍后..."
            });
            _method.then(res => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: "分配成功",
                  icon: "success",
                  duration: 1000
                });
              } else {
                wx.showModal({
                  title: "错误",
                  content: res.data.message,
                  showCancel: false
                });
              }
              that.cancelOperate();
              wx.hideLoading();
            });
          }
        }
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
    operate() {
      if (!this.selectNum) {
        return wx.showToast({
          title: "未选择客户",
          icon: "none",
          duration: 1000
        });
      }
      this.showSalesPopup = true;
    },
    cancelOperate() {
      this.isOperate = false;
      this.isAllSelect = false;
      this.showSalesPopup = false;
      this.customerList = this.customerList.map(e => {
        e.isSelect = false;
        return e;
      });
    },
    getDate(day) {
      if (!day || day == 0) {
        this.filter.addTimeStart = "";
        this.filter.addTimeEnd = "";
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
      this.isNoMore = false;
      this.getCustomerList();
    },
    // 会员状态 1 潜在 3 现有 4 订金 5失效
    toggleState(state) {
      this.filter.customerClass = state || "";
      this.page = 1;
      this.isNoMore = false;
      this.getCustomerList();
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.customer {
  .tabs {
    padding: 0 5px;
    background-color: #fff;
    > span {
      display: inline-block;
      padding: 0 15px;
      line-height: 36px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      &.underline {
        border-bottom: 2px solid #fff;
      }
    }
  }
  .filter-nav {
    .mask {
      top: 205px;
    }
  }
  .customer-list {
    .customer-item {
      display: flex;
      background-color: #fff;
      .item-left {
        // flex: 0 0 30px;
        padding-left: 10px;
        box-sizing: border-box;
        .icon-wrapper {
          margin-top: 27px;
        }
      }
    }
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    flex: 1;
    .icon-right {
      margin-top: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
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
  .sales-list {
    max-height: 50vh;
    .sales-item {
      display: flex;
      border-top: 1rpx solid #eee;
      .avatar {
        width: 50px;
        height: 50px;
        padding: 7px 10px;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        margin-right: 10px;
      }
      .name,
      .phone {
        line-height: 65px;
        border-top: 1rpx solid #eee;
      }
    }
  }
}
</style>
