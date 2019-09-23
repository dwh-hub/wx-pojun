<template>
  <div class="allograph-class">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>

    <div class="common-list">
      <div class="customer-item" v-for="(item,index) in list" :key="index">
        <div class="time-item-wrapper" v-if="item.customerList">
          <div class="time">
            <img src="/static/images/clock-icon.png" alt />
            <span>{{item.lastConsumedTime}}</span>
            <span>{{item.customerList.length}}人</span>
          </div>
          <staff-coach-item
            v-for="(item2, index2) in item.customerList"
            :key="item2.id"
            @clickIcon="appoint(item2)"
            @clickItem="toDetail(item2,index2)"
            :info="item2"
          >
            <div>
              <div class="appoint" :style="{color: themeColor,'border-color':themeColor}">代约私教</div>
              <img src="/static/images/staff/right-arrow.svg" alt />
            </div>
          </staff-coach-item>
        </div>
      </div>
      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无学员" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
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
import { checkAuth } from "../common/js/service_config.js";
import headerSearch from "../components/header-search.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
import { getUserofrole } from "../common/js/http.js";

export default {
  data() {
    let that = this
    return {
      nav: [
        {
          navTitle: "活跃日期(升序)",
          name: "排序",
          children: [
            {
              sonText: '最近活跃(降序)',
              action: function() {
                that.filter.orderField = "lastConsumedTime";
                if (that.filter.orderAsc == 1) {
                  that.filter.orderAsc = 2
                  this.sonText = '最近活跃(升序)'
                } else {
                  that.filter.orderAsc = 1
                  this.sonText = '最近活跃(降序)'
                }
              }
            },
            {
              sonText: '最近购卡(降序)',
              action: function() {
                that.filter.orderField = "lastBuyCardTime";
                if (that.filter.orderAsc == 1) {
                  that.filter.orderAsc = 2
                  this.sonText = '最近购卡(降序)'
                } else {
                  that.filter.orderAsc = 1
                  this.sonText = '最近购卡(升序)'
                }
              }
            },
            {
              sonText: '登记日期(降序)',
              action: function() {
                that.filter.orderField = "addTime";
                if (that.filter.orderAsc == 1) {
                  that.filter.orderAsc = 2
                  this.sonText = '登记日期(降序)'
                } else {
                  that.filter.orderAsc = 1
                  this.sonText = '登记日期(升序)'
                }
              }
            }
          ]
        },
        {
          navTitle: "服务销售",
          name: "服务销售",
          children: []
        },
        {
          navTitle: "服务教练",
          name: "服务教练",
          children: []
        }
      ],
      filter: {
        nameOrPhone: "",
        orderField: "",
        orderAsc: 1, // 1 升序
        serviceCoachId: '',
        serviceUserId: ''
      }
    };
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    filterNav,
    staffCoachItem,
    headerSearch,
    noneResult
  },
  mounted() {
    this.refreshList();
    this.getCoachList()
    this.getSalehList()
  },
  computed: {
    orderAscText() {
      if (!this.filter.orderAsc) {
        return '升序'
      }
      return this.filter.orderAsc == 1 ? '升序' : '降序'
    }
  },
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    selectStore(item) {
      this.selectedStore = item;
      this.getCoachList()
      this.getSalehList()
      this.refreshList()
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            pageNo: that.page,
            page: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: window.api + "/customer/list/allcustomer/daygroup",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              that.list = [];
            }
            let _res = res.data.data;
            _res.result.forEach(item => {
              let _list = item.customerList.map(async e => {
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
                  id: e.id,
                  sex: e.sex,
                  phone: e.phone,
                  cover: e.headImgPath
                    ? e.headImgPath
                    : "http://pojun-tech.cn/assets/img/morenTo.png",
                  first_1: e.name,
                  first_2: e.phone.slice(0, 3) + "****" + e.phone.slice(7),
                  second_1: e.lastConsumedTime
                    ? formatDate(
                        new Date(e.lastConsumedTime),
                        "yyyy/MM/dd hh:mm"
                      )
                    : "--",
                  second_tip_1: "最近上课：",
                  third_1: e.serviceCoachName || "--",
                  third_tip_1: "服务教练："
                };
              });

              Promise.all(_list).then(result => {
                item.customerList = result;
              });
            });
            resolve(_res.result);
          }
        });
      });
    },
    toDetail(item, index) {
      if (!item.id) {
        return;
      }
      wx.navigateTo({
        url: "../customer_detail/main?id=" + item.id
      });
    },
    appoint(item) {
      wx.navigateTo({
        // url: "../appoint_coach/main?id=" + item.id
        url: `../appoint_coach/main?id=${item.id}&type=私教代约`
      });
    },
    getCoachList() {
      this._getUserofrole(1, 'serviceCoachId', 2)
    },
    getSalehList() {
      this._getUserofrole(2, 'serviceUserId', 1)
    },
    _getUserofrole(positionType, param, index) {
      getUserofrole(this.selectedStore.storeId, positionType).then((data) => {
        let list = data.map(e => {
          return {
            sonText: e.userName,
            action: () => {
              this.filter[param] = e.userId;
            }
          };
        });
        this.nav[index].children = [
          {
            sonText: "全部",
            action: () => {
              this.filter[param] = "";
            }
          }
        ].concat(list);
      })
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
.allograph-class {
  .common-list {
    .time-item-wrapper {
      border-bottom: 5px solid #f6f6f6;
      .time {
        padding: 5px 0 5px 10px;
        > img {
          width: 10px;
          height: 10px;
        }
        > span {
          font-size: 12px;
          color: #999;
          margin-left: 3px;
        }
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
      .appoint {
        display: inline-block;
        vertical-align: middle;
        line-height: 24px;
        padding: 0 5px;
        text-align: center;
        border-radius: 4px;
        background-color: #fff;
        border: 1rpx solid;
      }
    }
  }
}
</style>