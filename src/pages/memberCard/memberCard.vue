<template>
  <div class="memberCard">
    <card @hasClick="toCardDetail" :info="item" v-for="(item, index) in cardInfoList" :key="index"></card>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import card from "COMPS/card";
import store from "../../utils/store";

export default {
  data() {
    return {
      cardInfoList: [],
      userInfo: {}
    };
  },
  components: {
    card
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  mounted() {
    this.userInfo = wx.getStorageSync("userInfo");
    this.getCards();
  },
  methods: {
    toCardDetail(id) {
      console.log(id);
      wx.navigateTo({
        url: "../cardDetail/main?id=" + id
      });
    },
    getCards() {
      let that = this;
      // if (window.DEBUGGING) {
      //   return new Promise(function(resolve) {
      //     resolve([
      //       {
      //         activateDate: "2019-03-01 20:42:33",
      //         authorityUnit: "次",
      //         authorityUnitChar: null,
      //         balanceAuthority: 10,
      //         buyCardTime: "2019-03-01 20:42:14.0",
      //         canLossMake: 1,
      //         canTeachCard: 1,
      //         canTransfer: 1,
      //         cardAddTime: 1551444153000,
      //         cardBalance: null,
      //         cardClass: null,
      //         cardClassId: 933,
      //         cardClassName: "跆拳道10次卡",
      //         cardNo: null,
      //         cardStatus: "2",
      //         cardStatusChar: "使用中",
      //         coachName: "王老板",
      //         coachSex: null,
      //         coachUserId: 986,
      //         compactNum: 1,
      //         companyId: null,
      //         customerId: 277463,
      //         doomsday: "2019-04-19 20:42:33",
      //         endCardTime: null,
      //         handleUserId: null,
      //         id: 180527,
      //         isActivityByPhoto: null,
      //         isCanBack: null,
      //         isCanOverdueStopCard: 1,
      //         isCanStopCard: 1,
      //         isCanTransCard: 1,
      //         isRealCanLabel: null,
      //         isRealCanLossMake: null,
      //         isRealCanTransCard: null,
      //         isRealCanTransfer: null,
      //         isRealCanstopCard: null,
      //         isSubscriptionPact: 0,
      //         mainUser: "曾帅帅很帅",
      //         masterClassName: "培训测试卡",
      //         name: "曾帅帅很帅",
      //         openCardTime: null,
      //         openId: null,
      //         otherAuthority: 0,
      //         otherDays: 20,
      //         pactId: "3531321351351",
      //         periodOfValidity: 30,
      //         phone: "18259260870",
      //         physicsCardNo: "5204226137458493",
      //         remarks: null,
      //         sellingPrice: 2000,
      //         sex: null,
      //         storeId: 94,
      //         storeName: "思明店",
      //         teachCardType: 1,
      //         timesUser: null,
      //         totalAuthority: 10,
      //         transactUserId: 986,
      //         transactUserName: "王老板"
      //       }
      //     ]);
      //   }).then(res => {
      //     console.log(res);
      //     this.cardInfoList = res;
      //   });
      // }

      wx.showLoading({
        title: "加载中"
      });
      HttpRequest({
        url: window.api + "/customer/card/cardInfos",
        data: {
          page: 1,
          pageCount: 100,
          customerId: that.userInfo.id
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code) {
            that.cardInfoList = res.data.data.result;
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";

.memberCard {
  padding: 0 20px;
  padding-top: 15px;
  .card {
    margin-bottom: 15px;
  }
}
</style>


