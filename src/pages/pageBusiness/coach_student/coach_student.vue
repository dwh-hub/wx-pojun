<template>
  <div class="customer">
    <div class="list-header">
      <!-- <div class="tabs" :style="{background: themeColor}">
        <span class="student" :class="{underline: tabIndex == 1}" @click="tabIndex = 1">列表</span>
        <span class="customer" :class="{underline: tabIndex == 2}">汇总</span>
      </div>-->
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        :isOverlap="true"
        @selectStore="selectStore"
      ></header-search>
      <header-data :isOverlap="true" :headerData="headerData"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>

    <div class="customer-list common-list">
      <div class="customer-item" v-for="(item,index) in list" :key="index">
        <div class="item-left" @click="selectCustomer(item,index)" v-show="isOperate">
          <div class="icon-wrapper" :class="{border: !item.isSelect}">
            <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect" />
          </div>
        </div>
        <staff-coach-item @clickIcon="appoint(item)" @clickItem="toDetail(item,index)" :info="item">
          <div>
            <div class="appoint" :style="{background: themeColor}">约课</div>
            <img src="/static/images/staff/right-arrow.svg" alt />
          </div>
        </staff-coach-item>
      </div>
      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无学员" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
    </div>

    <div class="operate-bottom" v-if="isOperate">
      <div class="left" @click="selectAll">
        <div class="icon-wrapper" :class="{border: !isAllSelect}">
          <img src="/static/images/staff/select-icon.png" alt v-show="isAllSelect" />
        </div>
        <span class="left-text">全选</span>
      </div>
      <div class="middle">已选{{selectNum || '0'}}人</div>
      <div class="right">
        <div class="btn" @click="cancelOperate()" :style="{background: themeColor}">取消操作</div>
        <div class="btn" @click="operate" :style="{background: themeColor}">{{operateText}}</div>
      </div>
    </div>

    <div class="bottom-operate-btn" v-if="!isOperate">
      <div
        v-for="(item, index) in operateList"
        :key="index"
        class="operate-item"
        :style="item.style"
        @click="item.action"
        :class="{hidde: item.hasAuth}"
      >{{item.text}}</div>
      <div class="block" v-if="isPhoneX"></div>
    </div>

    <van-popup
      :show="showSalesPopup"
      @close="showSalesPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%;max-height:50vh;"
    >
      <div class="sales-list">
        <div
          class="sales-item"
          v-for="(item, index) in actionList"
          :key="index"
          @click="selectRole(item)"
        >
          <div class="avatar">
            <img :src="window.api + item.headImgPath" alt />
          </div>
          <div class="name">{{item.userName}}</div>
          <div class="phone"></div>
        </div>
      </div>
    </van-popup>
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime"
    ></timePicker>
    <!-- <suspension-window v-if="!isOperate" :operateList="operateList" @operate="getOperate"></suspension-window> -->
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
import { checkAuth } from "../common/js/service_config.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import suspensionWindow from "../components/suspension-window.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import colorMixin from "COMPS/colorMixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";

export default {
  data() {
    return {
      isShowFilter: false,
      tabIndex: 1,
      nav: [
        {
          navTitle: "全部",
          name: "登记时间",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterDate(0);
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
                this.timePickerType = "";
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "签到时间",
          name: "签到时间",
          children: [
            {
              sonText: "全部",
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
                this.timePickerType = "consumed";
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "学员状态",
          name: "学员状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.toggleState();
              }
            },
            {
              sonText: "未办理",
              action: () => {
                this.toggleState(1);
              }
            },
            {
              sonText: "已办理",
              action: () => {
                this.toggleState(2);
              }
            },
            {
              sonText: "已失效",
              action: () => {
                this.toggleState(3);
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
          dataText: "已办理",
          dataNum: "0"
        },
        {
          dataText: "未办理",
          dataNum: "0"
        }
      ],
      operateList: [
        // {
        //   text: "分配销售",
        //   iconUrl: "/static/images/staff/close.svg"
        // }
        {
          text: "分配教练",
          authorityId: 69,
          hasAuth: checkAuth(69),
          style: `color:themeColor;`,
          action: () => {
            this.distributeCoach();
          }
          // class: 'operate icon-fenpei',
          // iconUrl: "/static/images/staff/calendar.svg"
        },
        {
          text: "新增客户",
          authorityId: 26,
          hasAuth: checkAuth(26),
          style: `background-color:themeColor;color:#fff;`,
          action: () => {
            wx.navigateTo({
              url: "../customer_register/main"
            });
          }
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
      // list: [{}, {}, {}, {}],
      // isLoading: true,
      isOperate: false,
      isAllSelect: false,
      showSalesPopup: false,
      // page: 1,
      // storeList: [],
      // coachList: [],
      // saleList: [],
      actionList: [],
      selectedRole: {},
      // selectedStore: {},
      operateText: "",
      timePickerType: "",
      filter: {
        nameOrPhone: "",
        trainerStatus: "",
        addTimeStart: "",
        addTimeEnd: "",
        lastConsumedTimeStart: "",
        lastConsumedTimeEnd: ""
      }
    };
  },
  mounted() {
    this.refreshList();
    this.operateList.forEach(e => {
      e.hasAuth = checkAuth(e.authorityId)
      e.style = e.style.replace('themeColor', window.color)
    })
  },
  mixins: [colorMixin, listPageMixin],
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
      this.list.forEach(e => {
        if (e.isSelect) {
          _num++;
        }
      });
      return _num;
    }
  },
  methods: {
    appoint(item) {
      wx.navigateTo({
        // url: "../appoint_coach/main?id=" + item.id
        url: `../appoint_coach/main?id=${item.id}&type=预约`
      });
    },
    toggleStore() {
      this.showMask = !this.showMask;
      this.showStoreList = !this.showStoreList;
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            pageNo: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: "/mobile/coach/static/count",
          data: _data,
          success(res) {
            that.headerData[1].dataNum = res.data.data.transactedCount;
            that.headerData[2].dataNum = res.data.data.noTransactCount;
          }
        });
        HttpRequest({
          url: window.api + "/mobile/coach/resourcepool/pages",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              that.list = [];
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
                first_1: e.name,
                second_1: e.serviceCoachName || "--",
                second_tip_1: "服务教练：",
                third_1: e.lastTrackTime ? formatDate(new Date(e.lastTrackTime), 'yyyy/MM/dd hh:mm') : "--",
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
            res.data.data.forEach(e => {
              e.headImgPath = e.headImgPath
                ? window.api + e.headImgPath
                : "https://pojun-tech.cn/assets/img/morenTo.png";
            });
            resolve(res);
          }
        });
      });
    },
    // 分配教练
    allotCoach() {
      let _customerIdStr = "";
      this.list.forEach(e => {
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
            HttpRequest({
              url: "/sendmsg/user/allotsCoachMsg",
              data: {
                allotRandom: res.data.data,
                storeId: that.selectedStore.storeId
              }
            });
            resolve(res);
          }
        });
      });
    },
    // 分配销售
    allotSale() {
      let _customerIdStr = "";
      this.list.forEach(e => {
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
      this.filter.nameOrPhone = event;
      this.refreshList();
    },
    distributeCoach() {
      if(!this.selectedStore.storeId) {
        return wx.showToast({
          title: "请选择门店",
          icon: 'none'
        })
      }
      this.operateText = "分配教练";
      this.isOperate = true;
      this.getUserofrole(0).then(res => {
        if (res.data.code == 200) {
          this.actionList = res.data.data;
        }
      });
    },
    // 通过回传的iconText来获取对应的列表
    // getOperate(param) {
    //   if (!this.selectedStore.storeId) {
    //     return wx.showToast({
    //       title: "请选择门店",
    //       icon: "none"
    //     });
    //   }
    //   this.operateText = param;
    //   this.isOperate = true;
    //   if (param == "分配教练") {
    //     this.getUserofrole(0).then(res => {
    //       if (res.data.code == 200) {
    //         this.actionList = res.data.data;
    //       }
    //     });
    //   }
    //   if (param == "分配销售") {
    //     this.getUserofrole(1).then(res => {
    //       if (res.data.code == 200) {
    //         this.actionList = res.data.data;
    //       }
    //     });
    //   }

    //   if (param == "发送手机短信") {
    //   }
    // },
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
              wx.hideLoading();
              if (res.data.code === 200) {
                that.refreshList();
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
            });
          }
        }
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
      this.list = this.list.map(e => {
        e.isSelect = false;
        return e;
      });
    },
    // 学员状态 1未办理，2已办理，3已失效
    toggleState(state) {
      this.filter.trainerStatus = state || "";
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.timePickerType = "";
      this.setDate(obj);
    },
    filterConsumedDate(day) {
      let obj = this.filterDateMethod(day);
      this.timePickerType = "consumed";
      this.setDate(obj);
    },
    setDate(obj) {
      if (this.timePickerType == "consumed") {
        this.filter.lastConsumedTimeStart = obj.startTime;
        this.filter.lastConsumedTimeEnd = obj.endTime;
        return;
      }
      this.filter.addTimeStart = obj.startTime;
      this.filter.addTimeEnd = obj.endTime;
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: @pageColor;
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
    .appoint {
      display: inline-block;
      vertical-align: middle;
      line-height: 24px;
      width: 50px;
      text-align: center;
      border-radius: 16px;
      color: #fff;
      background-color: #4d97e8;
    }
  }
  .staff-coach-item {
    border-bottom: 1rpx solid #eee;
    flex: 1;
    .icon-right {
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
          background-color: #eee;
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
