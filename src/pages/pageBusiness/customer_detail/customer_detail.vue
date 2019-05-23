<template>
  <div class="customer">
    <div class="customer-base-info">
      <div class="cover">
        <div class="avatar"></div>
      </div>
      <div class="coach-info">
        <div class="coach-name">{{userInfo.name}}</div>
        <div class="coach-phone">{{userInfo.phone}}</div>
      </div>
      <div class="icon-right">
        <img src="/static/images/staff/phone.svg" alt>
      </div>
    </div>
    <van-tabs :active="tabIndex" @change="changeTab" :color="themeColor" swipeable>
      <van-tab title="出勤信息">
        <header-data :headerData="checkInData"></header-data>
        <filter-nav></filter-nav>
        <list-day-item v-for="(item,index) in checkInList" :key="index"></list-day-item>
      </van-tab>
      <van-tab title="跟进回访">
        <header-data :headerData="FollowUpData"></header-data>
        <filter-nav></filter-nav>
        <div class="tab-list-wrapper">
          <list-day-item :info="item" v-for="(item,index) in followUpList" :key="index"></list-day-item>
        </div>
      </van-tab>
      <van-tab title="合同">
        <header-data :headerData="cardData"></header-data>
        <filter-nav></filter-nav>
        <div class="card-list">
          <card v-for="(item,index) in cardList" :info="item" :key="index"></card>
        </div>
      </van-tab>
      <!-- <van-tab title="订单信息"></van-tab> -->
      <van-tab title="更多信息">
        <div class="info">
          <van-cell-group custom-class="van-cell-group">
            <van-cell title="姓名" :value="userInfo.name"/>
            <van-cell title="性别" :value="userInfo.sexChar"/>
            <van-cell title="手机号" :value="userInfo.phone"/>
            <van-cell title="出生日期" :value="userInfo.birthTime || '未填写'"/>
            <van-cell title="身份证号" :value="userInfo.idCardNum || '未填写'"/>
          </van-cell-group>
          <van-cell title="服务教练" @click="showCoachList()">
            <div slot="right-icon">
              <div class="tab-cover" v-for="(item, index) in serviceCoachList" :key="index">
                <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
              </div>
              <van-icon name="arrow" color="#999"/>
            </div>
          </van-cell>
          <van-cell title="服务销售" @click="showSaleList()">
            <div slot="right-icon">
              <div class="tab-cover" v-for="(item, index) in serviceSaleList" :key="index">
                <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
              </div>
              <van-icon name="arrow" color="#999"/>
            </div>
          </van-cell>
          <van-cell title="健身目的" is-link/>
          <van-cell title="客户星级" :value="userInfo.starLevel" is-link/>
        </div>
      </van-tab>
    </van-tabs>

    <van-popup
      :show="showPopup"
      @close="showPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="list">
        <div class="item" v-for="(item, index) in actionList" :key="index">
          <div class="avatar">
            <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
          </div>
          <div class="name">{{item.name}}</div>
          <div class="store">{{item.storeName}}</div>
        </div>
      </div>
    </van-popup>

    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="operate"></suspension-window>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import listDayItem from "../components/list-day-item.vue";
import suspensionWindow from "../components/suspension-window.vue";
import colorMixin from "COMPS/colorMixin.vue";
import card from "COMPS/card";
export default {
  data() {
    return {
      tabIndex: 0,
      id: 0,
      isOperate: false,
      checkInData: [
        {
          dataText: "签到",
          dataNum: "12"
        },
        {
          dataText: "团课",
          dataNum: "42"
        },
        {
          dataText: "私教",
          dataNum: "39"
        }
      ],
      FollowUpData: [
        {
          dataText: "总计",
          dataNum: "12"
        },
        {
          dataText: "数据一",
          dataNum: "42"
        },
        {
          dataText: "数据二",
          dataNum: "39"
        }
      ],
      cardData: [
        {
          dataText: "合同数",
          dataNum: "12"
        },
        {
          dataText: "已过期",
          dataNum: "42"
        },
        {
          dataText: "数据二",
          dataNum: "39"
        }
      ],
      followUpList: [],
      checkInList: [{}, {}, {}],
      cardList: [
        {
          id: 213697,
          storeId: 94,
          customerId: 310742,
          name: "会员",
          sex: null,
          phone: "18000241486",
          handleUserId: null,
          cardClassId: 727,
          cardBalance: null,
          buyCardTime: "2019-05-06 17:11:39.0",
          openCardTime: null,
          endCardTime: null,
          cardStatus: "2",
          cardStatusChar: "使用中",
          cardClassName: "会籍1000元卡",
          cardClass: null,
          storeName: "思明店",
          balanceAuthority: 1000.0,
          totalAuthority: 1000.0,
          authorityUnit: "元",
          isCanTransCard: 1,
          masterClassName: "普通会籍卡",
          activateDate: "2019-05-06 17:11:56",
          doomsday: "2020-05-04 17:11:56",
          cardNo: null,
          companyId: null,
          isSubscriptionPact: 0,
          isCanBack: null,
          physicsCardNo: "1171149410660148",
          authorityUnitChar: null,
          pactId: "3213",
          openId: null,
          periodOfValidity: 365,
          canTeachCard: 0,
          isActivityByPhoto: null,
          sellingPrice: 1000.0,
          canTransfer: 1,
          canLossMake: 1,
          isCanStopCard: 0,
          isCanOverdueStopCard: 0,
          isRealCanstopCard: null,
          isRealCanLossMake: null,
          isRealCanTransfer: null,
          isRealCanTransCard: null,
          isRealCanLabel: null,
          coachName: null,
          coachUserId: null,
          coachSex: null,
          transactUserId: 986,
          transactUserName: "王老板",
          otherDays: null,
          otherAuthority: null,
          cardAddTime: 1557133916000,
          timesUser: null,
          mainUser: "会员",
          teachCardType: 0,
          compactNum: 1,
          remarks: null
        }
      ],
      appointList: [],
      operateList: [
        {
          text: "一键上课",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "客户跟进",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "来访预约",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "预约上课",
          iconUrl: "/static/images/staff/close.svg"
        }
      ],
      // 姓名、电话、性别 、出身月份、身份证
      customerInfo: {
        baseInfo: {
          name: "王小明",
          phone: "18000000000",
          sex: "男",
          birthDay: "1998-08-18",
          identityCard: "3623335649875615231"
        }
      },
      serviceCoachList: [],
      serviceSaleList: [],
      userInfo: {},
      showPopup: false,
      // 下弹出来的list
      actionList: []
    };
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    listDayItem,
    suspensionWindow,
    card
  },
  mounted() {
    setNavTab();
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
    this.getFollowUpList();
    this.getCardList();
  },
  methods: {
    getDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/archives/detail",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            let _data = res.data.data
            let _serviceCoachList = []
            let _serviceSaleList = []
            
            _data.starLevel = _data.starLevel ? _data.starLevel+'星':'暂无'
            that.userInfo = _data;

            _data.customerStoreArrays.forEach(e => {
              _serviceCoachList.push({
                storeId:e.storeId,
                storeName: e.storeName,
                name: e.serviceCoachName,
                id: e.serviceCoachId
              })
              _serviceSaleList.push({
                storeId:e.storeId,
                storeName: e.storeName,
                name: e.serviceUserName,
                id: e.serviceUserId
              })
            })

            that.serviceCoachList = _serviceCoachList
            that.serviceSaleList = _serviceSaleList
          }
        }
      });
    },
    showCoachList() {
      this.showPopup = true
      this.actionList = this.serviceCoachList
    },
    showSaleList() {
      this.showPopup = true
      this.actionList = this.serviceSaleList
    },
    // 跟进
    getFollowUpList() {
      let that = this;
      HttpRequest({
        url: window.api + "/user/work/customer/track",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.followUpList = res.data.data.map(e => {
              return {
                id: e.trackUserId,
                day: e.trackTime.substring(8, 10),
                month: e.trackTime.substring(5, 7),
                topText: "操作人：" + e.userName,
                bottomText: "内容:" + e.content
              };
            });
          }
        }
      });
    },
    // 合同
    getCardList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/card/cardInfos",
        data: {
          customerId: that.id,
          page: 1
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.cardList = res.data.data.result;
          }
        }
      });
    },
    // 预约
    getAppointList() {
      let that = this;
      HttpRequest({
        url: window.api + "/user/work/customer/reserved/own",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.appointList = res.data.data.map(e => {
              return {};
            });
          }
        }
      });
    },
    // 签到/出勤/消费
    getCheckInList() {
      let that = this;
      HttpRequest({
        url: window.api + "/consumption/log/pages",
        data: {
          customerId: that.id,
          pageNo: 1
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.checkInList = res.data.data.map(e => {
              return {};
            });
          }
        }
      });
    },
    changeTab(e) {
      console.log(e.mp.detail);
      this.changeTab.tabIndex = e.mp.detail.index;
    },
    operate() {}
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.customer {
  .customer-base-info {
    display: flex;
    background-color: #fff;
    padding: 10px 0;
    padding-right: 15px;
    .cover {
      flex: 0 0 52px;
      width: 52px;
      height: 52px;
      padding-left: 12px;
      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        background-color: #eee;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: 50% 50%;
      }
    }
    .coach-info {
      flex: 1;
      padding-left: 12px;
      color: #505050;
      > div {
        line-height: 26px;
        .Mult-line(1);
      }
    }
    .icon-right {
      margin-top: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .filter-nav {
    margin-top: 5px;
    .mask {
      top: 240px;
    }
  }
  .tab-list-wrapper {
    overflow: auto;
    height: 60vh;
  }
  .card-list {
    padding: 0 20px;
    .card {
      margin-top: 15px;
    }
  }
  ._van-cell-group {
    margin-bottom: 5px;
  }

  .list {
    .item {
      padding-right: 15px;
      border-top: 1rpx solid #eee;
      >div {
        display: inline-block;
      }
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
      .store {
        float: right;
      }
      .name,
      .store {
        line-height: 65px;
      }
    }
  }
  .tab-cover {
    display: inline-block;
    vertical-align: middle;
    width: 25px;
    height: 25px;
    margin-right: 5px;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .van-icon {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
