<template>
  <div class="check-in-customer">
    <div class="customer-detail">
      <staff-coach-item :info="info" @clickIcon="clickIcon(info.first_2)" @clickItem="toCustomerDetail">
        <img src="/static/images/staff/phone.svg" alt />
        <img src="/static/images/staff/right-arrow.svg" alt />
      </staff-coach-item>
    </div>
    <!-- <filter-nav :nav="nav"></filter-nav> -->
    <div class="filter-wrapper">
      <switch @change="filterExpire"/><span>只显示使用中和未激活</span>
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in list" :key="index" @click="toCardDetail(item)">
        <div v-if="item.id">
          <div class="cover">
            <div class="card-status" :class="item.class">{{item.masterClassName}}</div>
          </div>
          <div class="item-info">
            <div class="item-top">
              <span>{{item.cardClassName}}(ID:{{item.id}})</span>
            </div>
            <div class="item-middle">卡号： {{item.physicsCardNo}}</div>
            <div class="item-desc">
              <div>开卡时间：{{item.time}}</div>
            </div>
          </div>
          <div class="icon-right">
            <div>
              <div class="tip">{{item.cardStatusChar}}</div>
              <div
                class="check"
                :style="{'color':themeColor, 'border': '1rpx solid '+themeColor}"
                @click.stop="checkIn(item)"
              >签到</div>
            </div>
            <img src="/static/images/staff/right-arrow.svg" alt />
          </div>
        </div>
        <div class="coach-skeleton" v-else>
          <div class="cover">
            <div class="card-status"></div>
          </div>
          <div class="skeleton-wrapper">
            <div class="skeleton-name"></div>
            <div class="skeleton-desc"></div>
            <div class="skeleton-time"></div>
          </div>
        </div>
      </div>

      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无业绩" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
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
import staffCoachItem from "../components/staff-coach-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
import filterNav from "../components/filter-nav.vue";
import noneResult from "COMPS/noneResult.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import checkPopup from "../components/check_popup/check_popup.vue";
import {
  checkPopupData,
  checkMethods
} from "../components/check_popup/check_popup.js";

export default {
  data() {
    return {
      info: {},
      customerId: "",
      storeId: "",
      venueId: "",
      nav: [
        {
          navTitle: "全部",
          name: "全部方式",
          children: []
        },
        {
          navTitle: "状态",
          name: "状态",
          children: [{
            sonText: '全部',
            action: () => {
              this.filter.cardType = ''
            }
          },{
            sonText: '有效',
            action: () => {
              this.filter.cardType = 1
            }
          },{
            sonText: '未激活',
            action: () => {
              this.filter.cardType = 2
            }
          },{
            sonText: '无效',
            action: () => {
              this.filter.cardType = 3
            }
          }]
        },
        {
          navTitle: "最近使用",
          name: "最近使用",
          children: []
        }
      ],
      filter: {
        cardType: '' // 1 使用中 2 未激活 3 其他 4 1+2
      },
      isFilterExpire: false
    };
  },
  onLoad(options) {
    this.customerId = options.id;
    this.storeId = options.storeId;
    this.venueId = options.venueId;
    checkPopupData.customerId = options.id;
    checkPopupData.storeId = options.storeId;
    checkPopupData.venueId = options.venueId;
  },
  mounted() {
    setNavTab();
    this.refreshList();
    this.getDetail();
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    staffCoachItem,
    filterNav,
    checkPopup,
    noneResult
  },
  methods: {
    getDetail() {
      let that = this;
      HttpRequest({
        url: "/customer/archives/detail",
        data: {
          customerId: that.customerId
        },
        success(res) {
          let data = res.data.data;
          let serviceUserName = "";
          let serviceCoachName = "";
          data.customerStoreArrays.forEach(e => {
            serviceUserName += e.serviceUserName || "";
            serviceCoachName += e.serviceCoachName || "";
          });
          that.info = {
            id: data.id,
            cover: data.headImgPath
              ? window.api + data.headImgPath
              : window.api + "/assets/img/morenTo.png",
            sex: data.sex,
            first_1: data.name,
            first_2: data.phone,
            second_1: serviceUserName || "暂无",
            second_tip_1: "服务销售：",
            second_2: serviceCoachName || "暂无",
            second_tip_2: "服务教练："
          };
        }
      });
    },
    filterExpire(e) {
      if(e.mp.detail.value) {
        this.filter.cardType = 4
      } else {
        this.filter.cardType = ''
      }
    },
    toCustomerDetail() {
      let that = this
      wx.navigateTo({
        url: "../customer_detail/main?id=" + that.customerId
      });
    },
    toCardDetail(item) {
      wx.navigateTo({
        url: `../../cardDetail/main?id=${item.id}&type=staff`
      });
    },
    loadData() {
      let that = this;
      return new Promise(resolve => {
        HttpRequest({
          url: "/card/relevance/user/cardInfoPages",
          data: {
            customerId: that.customerId,
            cardType: that.filter.cardType,
            page: that.page
          },
          success(res) {
            let list = res.data.data.result.map(e => {
              return {
                masterClassName: e.masterClassName,
                cardClassName: e.cardClassName,
                id: e.id,
                physicsCardNo: e.physicsCardNo,
                time:
                  e.buyCardTime.split(" ")[0].replace(/-/g, "/") +
                  "  " +
                  e.buyCardTime.split(" ")[1].replace(/-/g, "/"),
                cardStatusChar: e.cardStatusChar,
                class: that.trnasTeachCardType(e.teachCardType),
                canTeachCard: e.canTeachCard,
                teachCardType: e.teachCardType,
                cardId: e.id,
                cardName: e.cardClassName,
                cardClassId: e.cardClassId,
                authorityUnit: e.authorityUnit
              };
            });
            resolve(list);
          }
        });
      });
    },
    trnasTeachCardType(value) {
      switch (value) {
        case 0:
          return "member";
        case 1:
          return "team";
        case 2:
          return "private";
        case 3:
          return "another";
      }
    },
    clickIcon(phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      });
    },
    // 签到
    checkIn(item) {
      checkPopupData.showMask = true;
      checkPopupData.physicsCardNo = item.physicsCardNo;
      checkPopupData.cardId = item.cardId;
      checkPopupData.cardName = item.cardName;
      checkPopupData.cardClassId = item.cardClassId;
      checkPopupData.canTeachCard = item.canTeachCard;
      checkPopupData.teachCardType = item.teachCardType;
      checkPopupData.authorityUnit = item.authorityUnit
      checkMethods.getCardCost();
      // if (item.canTeachCard == 1) {
      //   if (item.teachCardType == 1) {
      //     //团课卡
      //     checkMethods.getTeamSchedule();
      //   } else if (item.teachCardType == 2) {
      //     checkPopupData.showMask = false;
      //     checkMethods.toCoachCheckIn()
      //     //私教卡
      //   }
      // } else if (item.canTeachCard == 0) {
      //   checkMethods.getCardCost();
      // }
    }
    // 获取会籍项目
    // getCardCost(item) {
    //   let that = this;
    //   HttpRequest({
    //     url: "/consumption/general/card/cost",
    //     data: {
    //       storeId: that.storeId,
    //       venueId: that.venueId,
    //       physicsCardNo: item.physicsCardNo,
    //       frontSign: "",
    //       valueCardFee: "" // 储值卡的扣费金额
    //     },
    //     success(res) {
    //       let data = res.data.data;
    //       let code = res.data.code;
    //       if (code == 202 || code == 201) {
    //         // 消费天 202 其他 201
    //         // 快速签到时直接签到
    //       }
    //       if (code == 503) {
    //         checkPopupData.physicsCardNo = item.physicsCardNo;
    //         // 含有多个项目，选择
    //         checkPopupData.projectList = data.map(e => {
    //           e.cardType =
    //             e.valueCardType == 1
    //               ? "会籍"
    //               : e.valueCardType == 2
    //                 ? "私教"
    //                 : "团课";
    //           e.class =
    //             e.valueCardType == 1
    //               ? "member"
    //               : e.valueCardType == 2
    //                 ? "private"
    //                 : "team";
    //           return e;
    //         });
    //         checkPopupData.showProject = true;
    //       }
    //       if (code == 519) {
    //         // 团课
    //       }
    //       if (code == 513) {
    //         // 私教 TODO: 私教预约页面待处理
    //         wx.navigateTo({
    //           url: `../appoint_coach/main?id=${item.id}&type=前台代签`
    //         });
    //       }
    //     }
    //   });
    // }
  }
};
</script>

<style lang="less">
.check-in-customer {
  .customer-detail {
    .staff-coach-item {
      border-bottom: 5px solid #e5e5e5;
      .coach-info > div {
        line-height: 30px;
      }
      .icon-right {
        img {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
  .filter-wrapper {
    text-align: right;
    padding: 10px 15px 0 0;
  }
  .list {
    .list-item {
      > div {
        display: flex;
        padding: 10px 15px 10px 0;
        border-bottom: 1rpx solid #eee;
        .cover {
          flex: 0 0 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          .card-status {
            width: 44px;
            height: 44px;
            font-size: 10px;
            text-align: center;
            line-height: 44px;
            border-radius: 50%;
            color: #fff;
            &.private {
              background-color: #000000;
            }
            &.team {
              background-color: #ff5733;
            }
            &.member {
              background-color: #43cf7c;
            }
            &.another {
              background-color: #a6a6a6;
            }
          }
        }
      }
      .item-info {
        flex: 1;
        > div {
          line-height: 1.5em;
          font-size: 12px;
          color: #333;
          > span {
            margin-right: 20px;
            font-size: 12px;
            color: #333;
          }
        }
        .item-top,
        .item-middle {
          line-height: 24px;
        }
        .item-top {
          font-weight: bold;
        }
        .item-desc > div {
          font-size: 10px;
          color: #808080;
        }
      }
      .icon-right {
        display: flex;
        align-items: center;
        justify-content: center;
        .tip {
          font-size: 12px;
          text-align: center;
          margin-bottom: 5px;
        }
        .check {
          display: inline-block;
          line-height: 24px;
          width: 50px;
          text-align: center;
          border-radius: 16px;
        }
        > img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>