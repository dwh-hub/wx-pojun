<template>
  <div class="check-in-record">
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
    <div class="check-in-list">
      <staff-coach-item
        v-for="(item, index) in list"
        :key="index"
        @clickIcon="clickIcon(item)"
        @clickItem="toDetail(item,index)"
        :info="item"
      >
        <div class="operate" :style="{border: '1px solid '+themeColor,color: themeColor}">撤销</div>
        <img src="/static/images/staff/right-arrow.svg" alt />
      </staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading" />
    </div>

    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime"
    ></timePicker>

    <van-dialog
      use-slot
      title="请输入账号密码确认操作"
      :show="showRevokeDialog"
      show-cancel-button
      @confirm="confirmPwd"
      @close="showRevokeDialog = false">
      <input type="text" class="input-pwd" v-model="pwd" placeholder="请输入账号密码">
    </van-dialog>
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
import listPageMixin from "../components/list-page-mixin.vue";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
import { getVenueList } from "../common/js/http.js";

export default {
  data() {
    return {
      timePickerType: "",
      nav: [
        {
          navTitle: "今日",
          name: "签到时间",
          children: [{
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
                this.showPicker();
              }
            }]
        },
        {
          navTitle: "全部场馆",
          name: "场馆",
          children: []
        },
        {
          navTitle: "入场状态",
          name: "入场状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filter.status = ""
              }
            },
            {
              sonText: "已入场",
              action: () => {
                this.filter.status = 0
              }
            },{
              sonText: "已退场",
              action: () => {
                this.filter.status = 1
              }
            },{
              sonText: "已撤销",
              action: () => {
                this.filter.status = 2
              }
            }]
        }
      ],
      headerData: [
        {
          dataText: "签到人数",
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
      filter: {
        namePhoneCardHandCard: "",
        venueId: "",
        status: "",
        timeStart: "",
        timeEnd: ""
      },
      selectedCustomer: {},
      pwd: "",
      showRevokeDialog: false
    };
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    headerSearch,
    noneResult
  },
  mounted() {
    this.refreshList();
    this._getVenueList()
  },
  methods: {
    searchChange(event) {
      this.filter.namePhoneCardHandCard = event;
    },
    filterDate() {},
    toDetail(item, index) {
      wx.navigateTo({
        url: "../customer_detail/main?id=" + item.id
      });
    },
    clickIcon(item) {
      this.showRevokeDialog = true
      this.selectedCustomer = item
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
          url: "/consumption/log/pages",
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
              let statusText = e.status == 1 ? '已退场' : (e.status == 2 ? '已撤销' : '已入场')
              return {
                isSelect: false,
                id: e.customerId,
                consumptionLogId: e.consumptionLogId,
                sex: e.sex,
                phone: e.phone,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                first_1: e.customerName,
                first_2: e.phone,
                second_1: `${e.venueName}  ${e.secondCardClassName}(${
                  e.passModeValue
                })`,
                second_tip_1: "场馆：",
                second_2: "",
                status: e.status,
                rightText: statusText,
                color: statusText == '已入场' ? '#00baad' : '#808080'
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    confirmPwd() {
      let that = this
      HttpRequest({
        url: `/consumption/general/withraw/${that.selectedCustomer.consumptionLogId}/${that.pwd}`,
        success(res) {
          that.pwd = ""
          if(res.data.code == 200)  {
            that.refreshList()
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      })
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.timeStart = obj.startTime;
      this.filter.timeEnd = obj.endTime;
    },
    _getVenueList() {
      getVenueList(this.selectedStore.storeId).then((res) => {
        let venueList = res.map(e => {
          e.sonText = e.venueName
          e.action = () => {
            this.filter.venueId = e.venueId
          }
          return e
        })
        this.nav[1].children = [{
            sonText: "全部场馆",
            action: () => {
              this.filter.venueId = ""
            }
          }].concat(venueList)
      })
    },
  }
};
</script>

<style lang="less">
.check-in-record {
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    flex: 1;
    .coach-info {
      >div {
        line-height: 30px;
      }
      .coach-times {
        color: #808080;
      }
    }
    .icon-right {
      div {font-size: 12px;}
      .operate {
        line-height: 24px;
        padding: 0 5px;
        margin-left: 5px;
        border-radius: 9px;
      }
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .input-pwd {
    margin: 15px;
    padding: 0 15px;
  }
}
</style>