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
        :searchText="filter.namePhone"
        :isOverlap="true"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData" :isOverlap="true"></header-data>
      <filter-nav
        @allFilter="showFilter"
        @submitFilter="getFilter"
        :nav="nav"
        :moreFilterList="moreFilter"
        :hasMoreFilter="true"
      ></filter-nav>
    </div>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>

    <div class="customer-list common-list" :style="{'margin-bottom': isPhoneX ? '74px':'40px'}">
      <div class="customer-item-wrapper" v-for="(item,index) in list" :key="index">
        <div class="item-left" @click="selectCustomer(item,index)" v-show="isOperate">
          <div class="icon-wrapper" :class="{border: !item.isSelect}">
            <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect" />
          </div>
        </div>
        <div class="customer-item" v-if="item.id" @click="toDetail(item,index)">
          <div class="cover">
            <div class="tag" :style="{background: item.statusColor}">{{item.customerClassChar}}</div>
            <img :src="item.cover" @error="loadFail(index)"/>
          </div>
          <div class="customer-info">
            <div class="customer-base-info">
              <img class="customer-sex" :src="item.sexSrc" />
              <span class="customer-name">{{item.name}}</span>
            </div>
            <div class="customer-service">
              <span>服务教练:</span>
              <span class="service-text">{{item.serviceCoachName}}</span>
              <span>服务销售:</span>
              <span class="service-text">{{item.serviceUserName}}</span>
            </div>
          </div>
          <div class="customer-operate">
            <img
              class="phone"
              @click.stop="clickIcon(...arguments,item)"
              src="/static/images/staff/phone.png"
              alt
            />
            <img src="/static/images/staff/right-arrow.svg" alt />
          </div>
        </div>

        <div class="coach-skeleton" v-else>
          <div class="cover"></div>
          <div class="skeleton-wrapper">
            <div class="skeleton-name"></div>
            <div class="skeleton-desc"></div>
            <div class="skeleton-time"></div>
          </div>
        </div>
        <!-- <staff-coach-item @clickIcon="clickIcon(...arguments,item)" @clickItem="toDetail(item,index)" :info="item">
          <div>
            <img data-type="follow-up" class="follow-up" src="/static/images/staff/workbench_icon/coach_service_icon_7.jpg" alt="">
            <img src="/static/images/staff/phone.svg" alt>
            <img src="/static/images/staff/right-arrow.svg" alt>
          </div>
        </staff-coach-item>-->
      </div>
      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无客户" v-if="!list.length && !isLoading"></none-result>
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
      <div class="block" v-if="isPhoneX"></div>
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
            <!-- <img :src="item.headImgPath" alt> -->
            <image :src="item.headImgPath" mode="aspectFill"></image>
          </div>
          <div class="name">{{item.userName}}</div>
          <div class="phone"></div>
        </div>
      </div>
    </van-popup>

    <van-popup
      :show="showFollowUpPopup"
      @close="showFollowUpPopup = false;trackContent=''"
      :duration="200"
      custom-style="width:85vw;border-radius:5px;top: 40%;"
    >
      <div class="followUp-popup">
        <div class="content">
          <van-cell
            title="跟进结果"
            @click="showTrackResult = true"
            :value="selectedResult.name"
            is-link
          />
          <van-cell title="下次跟进时间" :value="trackTime" @click="isResultDateShow = true" is-link />
          <textarea class="textarea" v-model="trackContent" @focus="onFocus" placeholder="请输入跟进内容" />
        </div>
        <div class="popup-bottom-btn">
          <div class="cancel" :style="{color: themeColor}" @click="showFollowUpPopup = false">取消</div>
          <div class="save" :style="{backgroundColor: themeColor}" @click="saveFollowUp">保存</div>
        </div>
      </div>
    </van-popup>

    <van-action-sheet
      :show="showTrackResult"
      :actions="trackResult"
      @close="showTrackResult = false"
      @select="selectResult"
    />
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime(...arguments, timePickerType == 'consumed' ? 1 : 0, 4)"
    ></timePicker>
    <timePicker
      :pickerShow="isResultDateShow"
      :config="resultDateConfig"
      @hidePicker="isResultDateShow = false"
      @setPickerTime="setResultTime"
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
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
// import staffCoachItem from "../components/staff-coach-item.vue";
// import suspensionWindow from "../components/suspension-window.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
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
              isDiyDate: true,
              date: '',
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
              isDiyDate: true,
              date: '',
              action: () => {
                this.timePickerType = "consumed";
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "客户状态",
          name: "客户状态",
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
              sonText: "订金",
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
      moreFilter: [
        {
          name: "客户性别",
          isRadio: true,
          isParmas: false,
          isTimer: false,
          param: "searchSex",
          value: "",
          children: [
            {
              name: "男",
              value: "1"
            },
            {
              name: "女",
              value: "2"
            }
          ]
        },
        {
          name: "跟进回访",
          isRadio: true,
          isParmas: true,
          isTimer: true,
          isInput: true,
          param: "searchTrackTimeStart",
          param_2: "searchTrackTimeEnd",
          value: "",
          value_2: "",
          children: [
            {
              name: "今日回访",
              dateValue: "day",
              value: "",
              value_2: ""
            },
            {
              name: "本周回访",
              dateValue: "week",
              value: "",
              value_2: ""
            },
            {
              name: "本月回访",
              dateValue: "month",
              value: "",
              value_2: ""
            },
            {
              name: "昨日回访",
              dateValue: "yesterday",
              value: "",
              value_2: ""
            },
            {
              name: "上周回访",
              dateValue: "lastWeek",
              value: "",
              value_2: ""
            },
            {
              name: "上月回访",
              dateValue: "lastMonth",
              value: "",
              value_2: ""
            },
            {
              name: "近300天回访",
              dateValue: 300,
              value: "",
              value_2: ""
            },
            {
              name: "近90天回访",
              dateValue: 90,
              value: "",
              value_2: ""
            },
            {
              name: "近半年回访",
              dateValue: 180,
              value: "",
              value_2: ""
            }
          ]
        },
        {
          name: "约访",
          isRadio: true,
          isParmas: true,
          isTimer: true,
          isInput: true,
          param: "nextTrackTimeStart",
          param_2: "nextTrackTimeEnd",
          value: "",
          value_2: "",
          children: [
            {
              name: "今日约访",
              dateValue: "day",
              value: "",
              value_2: ""
            },
            {
              name: "本周约访",
              dateValue: "week",
              value: "",
              value_2: ""
            },
            {
              name: "本月约访",
              dateValue: "month",
              value: "",
              value_2: ""
            },
            {
              name: "昨日约访",
              dateValue: 1,
              value: "",
              value_2: ""
            },
            {
              name: "上周约访",
              dateValue: "lastWeek",
              value: "",
              value_2: ""
            },
            {
              name: "上月约访",
              dateValue: "lastMonth",
              value: "",
              value_2: ""
            },
            {
              name: "近300天约访",
              dateValue: 300,
              value: "",
              value_2: ""
            },
            {
              name: "近90天约访",
              dateValue: 90,
              value: "",
              value_2: ""
            },
            {
              name: "近半年约访",
              dateValue: 180,
              value: "",
              value_2: ""
            }
          ]
        },
        {
          name: "活跃日期",
          isRadio: true,
          isParmas: true,
          isTimer: true,
          isInput: true,
          param: "lastConsumedTimeStart",
          param_2: "lastConsumedTimeEnd",
          value: "",
          value_2: "",
          children: [
            {
              name: "今日活跃",
              dateValue: "day",
              value: "",
              value_2: ""
            },
            {
              name: "本周活跃",
              dateValue: "week",
              value: "",
              value_2: ""
            },
            {
              name: "本月活跃",
              dateValue: "month",
              value: "",
              value_2: ""
            },
            {
              name: "昨日活跃",
              dateValue: 1,
              value: "",
              value_2: ""
            },
            {
              name: "上周活跃",
              dateValue: "lastWeek",
              value: "",
              value_2: ""
            },
            {
              name: "上月活跃",
              dateValue: "lastMonth",
              value: "",
              value_2: ""
            },
            {
              name: "近300天活跃",
              dateValue: 300,
              value: "",
              value_2: ""
            },
            {
              name: "近90天活跃",
              dateValue: 90,
              value: "",
              value_2: ""
            },
            {
              name: "近半年活跃",
              dateValue: 180,
              value: "",
              value_2: ""
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "总客户",
          dataNum: "0",
          color: "#333"
        },
        {
          dataText: "潜在",
          dataNum: "0",
          color: "#f25642"
        },
        {
          dataText: "现有",
          dataNum: "0",
          color: "#119bf0"
        }
      ],
      operateList: [
        {
          text: "分配销售",
          authorityId: 58,
          hasAuth: checkAuth(58),
          style: `color:themeColor;`,
          action: () => {
            this.distributeSale();
          }
          // class: 'operate icon-fenpei',
          // iconUrl: "/static/images/staff/close.svg"
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
      ],
      isOperate: false,
      isAllSelect: false,
      showSalesPopup: false,
      showFollowUpPopup: false,
      trackContent: "",
      resultDateConfig: {
        endDate: false,
        column: "second",
        dateLimit: true,
        initStartTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        initEndTime: "2019-12-01",
        limitStartTime: "2015-05-06",
        limitEndTime: "2055-05-06"
      },
      curCustomer: {},
      showTrackResult: false,
      isResultDateShow: false,
      trackTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
      selectedResult: { id: 1, name: "继续跟进" },
      trackResult: [{ id: 1, name: "继续跟进" }, { id: 3, name: "不确定" }],
      actionList: [],
      selectedRole: {},
      operateText: "",
      timePickerType: "",
      filter: {
        namePhone: "",
        customerClass: "",
        addTimeStart: "",
        addTimeEnd: "",
        lastConsumedTimeStart: "",
        lastConsumedTimeEnd: ""
      }
    };
  },
  mounted() {
    console.log("客户列表");
    this.refreshList();
  },
  onLoad(options) {
    if (options.searchText) {
      this.filter.namePhone = options.searchText;
      this.selectedStore = JSON.parse(options.store);
    }
    this.operateList.forEach(e => {
      e.hasAuth = checkAuth(e.authorityId)
      e.style = e.style.replace('themeColor', window.color)
    })
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    headerData,
    filterNav,
    // staffCoachItem,
    // suspensionWindow,
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
    },
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  onPullDownRefresh() {
    this.isOperate = false;
    this.showSalesPopup = false;
  },
  methods: {
    loadFail(index) {
      this.list[index].cover = window.api + "/assets/img/morenTo.png";
    },
    selectResult(item) {
      this.selectedResult = item.mp.detail;
      this.showTrackResult = false;
    },
    clearFilter() {
      for (let key in this.filter) {
        this.filter[key] = "";
      }
    },
    setResultTime(val) {
      let data = val.mp.detail;
      this.trackTime = data.startTime;
    },
    saveFollowUp() {
      if (!this.trackContent.length) {
        return wx.showToast({
          title: "请输入跟进内容",
          icon: "none",
          duration: 1000
        });
      }
      if (this.trackContent.length < 5) {
        return wx.showModal({
          title: "提示",
          content: "跟进内容不能少于5个字",
          showCancel: false
        });
      }
      let that = this;
      wx.showLoading();
      HttpRequest({
        url: window.api + "/customer/track/inserttrack",
        data: {
          customerId: that.curCustomer.id,
          trackResult: that.selectedResult.id,
          nextTrackTime: that.trackTime,
          content: that.trackContent,
          storeId: that.selectedStore.storeId,
          customerClass: that.curCustomer.customerClass,
          TrackUserType: "1"
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message || "跟进成功",
              icon: "success",
              duration: 1000
            });
            that.showFollowUpPopup = false;
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    onFocus(e) {
      e.mp.detail.height;
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            searchStore: that.selectedStore.storeId || ''
          },
          that.filter
        );
        HttpRequest({
          url: "/customer/list/static/count",
          data: _data,
          success(res) {
            if (res.data.code != 200) {
              return;
            }
            that.headerData[1].dataNum = res.data.data.prospectiveCount || "";
            that.headerData[2].dataNum = res.data.data.existingCount || "";
          }
        });
        HttpRequest({
          url: "/customer/list/search",
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
              let curStoreService =
                e.customerInfoList.filter(e => {
                  return e.storeName == that.selectedStore.storeName;
                })[0] || {};
              return {
                isSelect: false,
                id: e.id,
                sex: e.sex,
                sexSrc:
                  e.sex == "男"
                    ? "/static/images/staff/man.png"
                    : e.sex == "女"
                      ? "/static/images/staff/women.png"
                      : "",
                phone: e.phone,
                cover: e.headImgPath
                  ? e.headImgPath
                  : window.api + "/assets/img/morenTo.png",
                serviceCoachName:
                  curStoreService.serviceCoachName ||
                  e.customerInfoList[0].serviceCoachName ||
                  "--",
                serviceUserName:
                  curStoreService.serviceUserName ||
                  e.customerInfoList[0].serviceUserName ||
                  "--",
                name: e.name,
                customerClassChar: e.customerClassChar,
                statusColor:
                  e.customerClassChar == "现有" ? "#119bf0" : "#f25642",
                // first_1: e.name,
                // first_2: e.customerClassChar,
                // second_1: e.cardNum || 0,
                // second_tip_1: "合同数：",
                // second_2: "",
                // third_1: e.lastTrackTime || "--",
                // third_tip_1: "最后跟进时间：",
                customerClass: e.customerClass
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
                : window.api + "/assets/img/morenTo.png";
            });
            resolve(res);
          }
        });
      });
    },
    // 分配教练
    allotCoach() {
      let _customerIdStr = "";
      console.log(this.list);
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
            // 推送消息
            HttpRequest({
              url: "/sendmsg/user/allotsCustomerMsg",
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
    },
    distributeSale() {
      if (!this.selectedStore.storeId) {
        return wx.showToast({
          title: "请选择门店",
          icon: "none"
        });
      }
      this.operateText = "分配销售";
      this.isOperate = true;
      this.getUserofrole(1).then(res => {
        if (res.data.code == 200) {
          this.actionList = res.data.data;
        }
      });
    },
    // 通过回传的iconText来获取对应的列表
    // getOperate(param) {
    //   if(!this.selectedStore.storeId) {
    //     return wx.showToast({
    //       title: "请选择门店",
    //       icon: 'none'
    //     })
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
    clickIcon(event, item) {
      if (event.mp.target.dataset.type == "follow-up") {
        if (!that.selectedStore.storeId) {
          return wx.showToast({
            title: "请先选择门店",
            icon: "none"
          });
        }
        this.curCustomer = item;
        this.showFollowUpPopup = true;
        return;
      }
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
    // 会员状态 1 潜在 3 现有 4 订金 5失效
    toggleState(state) {
      this.filter.customerClass = state || "";
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
      let date = `${obj.startTime.split(' ')[0]}~${obj.endTime.split(' ')[0]}`.replace(/-/g, "/")
      if (this.timePickerType == "consumed") {
        this.filter.lastConsumedTimeStart = obj.startTime;
        this.filter.lastConsumedTimeEnd = obj.endTime;
        this.nav[1].children[4].date = date
        return;
      }
      this.filter.addTimeStart = obj.startTime;
      this.filter.addTimeEnd = obj.endTime;
      this.nav[0].children[4].date = date
    },
    getFilter(parmas) {
      this.filter = Object.assign({}, this.filter, parmas);
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "~COMMON/less/common.less";

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
    .customer-item-wrapper {
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
      .customer-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px 5px 10px 10px;
        border-bottom: 1rpx solid #f6f6f6;
        .cover {
          position: relative;
          flex: 0 0 32px;
          height: 32px;
          margin-right: 10px;
          border-radius: 2px;
          overflow: hidden;
          background-color: #eee;
          .tag {
            position: absolute;
            top: -2px;
            right: 5px;
            width: 40px;
            padding-top: 6px;
            padding-bottom: 1px;
            text-align: center;
            font-size: 8px;
            transform: rotate(-45deg);
            background-color: red;
            color: #fff;
          }
          > img {
            width: 100%;
            height: 100%;
          }
        }
        .customer-info {
          flex: 1;
          .customer-base-info {
            .customer-name {
              font-size: 14px;
            }
            .customer-sex {
              vertical-align: middle;
              margin-right: 3px;
              width: 12px;
              height: 12px;
            }
          }
          .customer-service {
            > span {
              font-size: 12px;
              color: #999;
            }
            .service-text {
              color: #666;
              margin-right: 10px;
            }
          }
        }
        .customer-operate {
          img {
            width: 18px;
            height: 18px;
          }
          .phone {
            width: 28px;
            height: 28px;
          }
        }
      }
    }
  }
  // .staff-coach-item {
  //   border-bottom: 1rpx solid #eee;
  //   flex: 1;
  //   .icon-right {
  //     img {
  //       margin-top: 10px;
  //       width: 18px;
  //       height: 18px;
  //     }
  //     .follow-up {
  //       width: 50px;
  //       height: 50px;
  //     }
  //   }
  // }
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
    color: #2a82e4;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    z-index: 2;
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
      .btn {
        display: inline-block;
        padding: 0 15px;
        border-left: 1rpx solid #fff;
        color: #fff;
      }
    }
    .block {
      flex-grow: 1;
      width: 100%;
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
        > image {
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
  .followUp-popup {
    .content {
      padding: 15px;
      box-sizing: border-box;
      .textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        min-height: 75px;
        font-size: 14px;
        border: 1rpx solid #ccc;
      }
    }
  }
  .popup-bottom-btn {
    display: flex;
    border-top: 1rpx solid #eee;
    > div {
      flex: 1;
      line-height: 36px;
      text-align: center;
    }
    .save {
      color: #fff;
    }
    .cancel {
      background-color: #fff;
    }
  }
  .van-cell__title,
  .van-cell__value {
    flex-basis: auto;
  }
}
</style>
