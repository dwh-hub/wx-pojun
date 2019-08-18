<template>
  <div class="receivable">
    <div class="subtitle" style="border-bottom: 1rpx solid #eee;" v-if="TemplateBillingData != 4">
      <img class="screening-icon" src="/static/images/staff/title-icon.svg" />
      <span class="subtitle-text">确认收款</span>
    </div>
    <div class="order-info">
      <div class="order-pactId">合同编号：{{TemplateBillingData.pactId}}</div>
      <div class="order-desc">合同详细：{{orderDesc}}</div>
    </div>
    <div class="price-type-form">
      <div class="subtitle" style="border-bottom: 1rpx solid #eee;" v-if="TemplateBillingData != 4">
        <img class="screening-icon" src="/static/images/staff/title-icon.svg" />
        <span class="subtitle-text">确认收款方式与金额（应付金额：{{payablePrice}}）</span>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">现金</div>
        <div class="cell-content">
          <input class="cell-input pay-cell" type="number" v-model="reqBaseData.cashPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">银行卡</div>
        <div class="cell-content">
          <input class="cell-input pay-cell" type="number" v-model="reqBaseData.cardPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">支付宝</div>
        <div class="cell-content">
          <input class="cell-input pay-cell" type="number" v-model="reqBaseData.aliPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">微信</div>
        <div class="cell-content">
          <input class="cell-input pay-cell" type="number" v-model="reqBaseData.wechatPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">转账</div>
        <div class="cell-content">
          <input class="cell-input pay-cell" type="number" v-model="reqBaseData.transferAccounts" />
        </div>
      </div>
      <div class="input-cell-wrapper" v-if="TemplateBillingData.billingType != 4">
        <div class="cell-value">抵扣金额</div>
        <div class="cell-content">
          <input
            class="cell-input"
            type="number"
            v-model="deductionMoney"
            :disabled="!deductionArray.length"
            @click="clickDedInput"
          />
          <div class="add-ded" @click="addDed">+</div>
        </div>
      </div>
      <div class="cell-tip" v-if="deductionArray.length">{{dedTip}}</div>
    </div>
    <div class="receivable-bottom" :class="{'safe-bottom': isIphoneX}">
      <div class="price">收款：{{payCost}}元</div>
      <div class="receivable-btn">
        <div :style="{color: themeColor}" @click="back">删除</div>
        <div :style="{color: themeColor}" @click="back">取消收款</div>
        <div :style="{'background-color': themeColor}" class="confirm" @click="confirm">确认收款</div>
      </div>
    </div>

    <van-popup
      class="ded-list-pop"
      :show="showCardList"
      position="bottom"
      @close="closeDedPopup"
      custom-style="width:100%;max-height:60vh;"
    >
      <header-search :search="searchDed" placeholder="请输入手机号搜索"></header-search>
      <div class="ded-group">
        <div
          class="ded-item"
          v-for="(item, index) in deductionlist"
          :key="index"
          @click="selectDed(item, index)"
        >
          <!-- <div> -->
            <span>姓名：{{item.name}}</span>
            <span>手机：{{item.phone}}</span>
            <span>合同编号：{{item.pactId}}</span>
            <span>购买金额：{{item.sellingPrice}}</span>
            <span>办理时间：{{item.transactTimeFmt}}</span>
          <!-- </div> -->
          <!-- <div>
            <span>购买金额:{{item.sellingPrice}}</span>
            <span>办理时间:{{item.transactTimeFmt}}</span>
          </div> -->
          <div class="icon" v-if="item.isSelect">
            <van-icon name="checked" :color="themeColor" size="2em" />
          </div>
        </div>
      </div>
      <div class="confirm-select" @click="closeDedPopup" :style="{'background-color':themeColor}">确认</div>
    </van-popup>
  </div>
</template>

<script>
import { setNavTab, HttpRequest, formatDate } from "COMMON/js/common.js";
import billingData from "../common/js/billingData";
import colorMixin from "COMPS/colorMixin.vue";
import headerSearch from "../components/header-search.vue";
export default {
  data() {
    return {
      deductionMoney: 0,
      customerDeduction: [], // 该用户的拥有的抵扣合同列表
      deductionArray: [], // 选择的抵扣合同列表
      showCardList: false,
      reqBaseData: {},
      deductionlist: [],
      dedFilterPhone: ""
    };
  },
  components: {
    headerSearch
  },
  mixins: [colorMixin],
  onLoad() {
    this.reqBaseData = {
      storeId: billingData.selectedStore.storeId,
      phone: billingData.selectedCustomer.phone,
      id: billingData.selectedCustomer.id,
      name: billingData.selectedCustomer.name,
      sex: billingData.selectedCustomer.sex,
      birthTime: "",
      transactuser: billingData.selectedSale.userName,
      transactUserId: billingData.selectedSale.userId,
      buyCardTime: billingData.date,
      pactId: billingData.pactId,
      cardSource: billingData.selectedSource.value,
      remarks: billingData.remarks,
      transferAccounts: 0,
      paymentType: 0, // 0 全款 1 定金 2 赠送
      wechatPay: 0,
      aliPay: 0,
      cardPay: 0,
      cashPay: 0,
      token: billingData.token,
      referrerPhone: ""
    };
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    setNavTab();
    this.checkDeduction();
    this.getDeductionlist();
  },
  computed: {
    billingText() {
      if (billingData.billingType == 1) {
        return "购买会籍卡";
      }
      if (billingData.billingType == 2) {
        return "购买私教卡";
      }
      if (billingData.billingType == 3) {
        return "购买团课卡";
      }
      if (billingData.billingType == 4) {
        return "预交定金";
      }
    },
    payCardType() {
      if (billingData.payCardType == 1) {
        return "定期开卡";
      }
      if (billingData.payCardType == 2) {
        return "立即开卡";
      }
      if (billingData.payCardType == 3) {
        return "手动开卡";
      }
    },
    TemplateBillingData() {
      return billingData;
    },
    orderDesc() {
      if (billingData.billingType == 4) {
        return `${this.billingText}-客户：${
          billingData.selectedCustomer.name
        }(${billingData.selectedCustomer.phone})，办理销售：${
          billingData.selectedSale.userName
        }`;
      }
      return `${this.billingText}-客户：${billingData.selectedCustomer.name}(${
        billingData.selectedCustomer.phone
      })，${billingData.selectedCard.first_1}，${
        billingData.selectedCard.salePrice || 0
      }元，${this.payCardType}(${billingData.payCardStartDate} -
        ${billingData.payCardEndDate})，办理销售：${
        billingData.selectedSale.userName
      }，卡号：${billingData.cardNum || "无"}`;
    },
    payablePrice() {
      if (billingData.billingType == 4) {
        return billingData.depositSellingPrice;
      } else {
        return billingData.selectedCard.salePrice || 0;
      }
    },
    dedTip() {
      let pact = ""
      this.deductionArray.forEach((e) => {
        pact += e.pactId + ','
      })
      return `合同编号为${pact}将被用于抵扣`
    },
    payCost() {
      return Number(
        Number(this.reqBaseData.transferAccounts) +
          Number(this.reqBaseData.wechatPay) +
          Number(this.reqBaseData.aliPay) +
          Number(this.reqBaseData.cardPay) +
          Number(this.reqBaseData.cashPay)
      );
    },
    isIphoneX() {
      return billingData.isIphoneX
    }
  },
  methods: {
    confirm() {
      if (
        Number(this.payCost) + Number(this.deductionMoney) !=
        this.payablePrice
      ) {
        return wx.showToast({
          title: "实付金额有误",
          icon: "none",
          duration: 1000
        });
      }
      if (billingData.billingType == 4) {
        this.addAubscription();
      } else {
        this.addCompact();
      }
    },
    // 查看用户的定金合同
    checkDeduction() {
      let that = this;
      HttpRequest({
        url: "/customer/card/checkDeduction",
        data: {
          phone: billingData.selectedCustomer.phone
        },
        success(res) {
          if (res.data.code == 200) {
            that.customerDeduction = res.data.data;
          }
        }
      });
    },
    // 新增合同
    addCompact() {
      wx.showLoading({
        title: '加载中..'
      })
      let that = this;
      let data;
      let _deductionArray = this.deductionArray.map(e => {
        return String(e.cardId);
      });
      let _periodOfValidity = 0
      if(billingData.selectedCard.authorityUnit == 1) {
        _periodOfValidity = Number(billingData.selectedCard.buyAuthority) + Number(billingData.curCardSet.giveAwayAuthority)
      } else {
        _periodOfValidity = billingData.selectedCard.periodOfValidity
      }
      billingData.curCardSet.isCanTransCard = billingData.curCardSet.canTransCard
      let basaData = {
        mainUser: billingData.selectedCustomer.name,
        cardClassId: billingData.selectedCard.cardId,
        sellingPrice: billingData.selectedCard.salePrice || 0,
        buyAuthority: billingData.selectedCard.buyAuthority,
        periodOfValidity: _periodOfValidity,
        teachCardType: billingData.selectedCard.teachCardType,
        canTeachCard: billingData.isTeachingContract,
        authorityUnit: billingData.selectedCard.authorityUnit,
        coachUserId: billingData.selectedCoach.userId,
        labelIdsStr: billingData.selectedLableId,
        isTimingOfActivation: billingData.payCardType,
        activateDate:
          billingData.payCardType == 1 ? billingData.payCardStartDate : "",
        doomsday:
          billingData.payCardType == 1 ? billingData.payCardEndDate : "",
        phoneVerifyStatus: "",
        physicsCardNo: billingData.cardNum,
        pactImgPath: JSON.stringify(billingData.uploadImgList),
        compactNum: 1,
        compactSumMoney: billingData.selectedCard.salePrice || 0,
        deductionMoney: that.deductionMoney,
        deductionArray: JSON.stringify(_deductionArray),
        cardUserJson: [],
        cost: that.payCost
      };
      data = Object.assign(billingData.curCardSet, basaData, this.reqBaseData);
      for (let k in data) {
        if (undefined == data[k] || data[k] == null) {
          data[k] = "";
        }
      }
      HttpRequest({
        url: "/customer/register/compact",
        data: data,
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.addWorkLog(that.billingText, res.data.message);
            that.msgPush(res.data.data);
            if (billingData.payCardType == 2) {
              that.cardActiveMsg();
            }
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 2
              })
            }, 1000);
          }
        }
      });
    },
    // 新增定金合同
    addAubscription() {
      wx.showLoading({
        title: '加载中..'
      })
      let that = this;
      let data = Object.assign(
        {
          isSubscriptionPact: 1,
          customerClass: billingData.selectedCustomer.customerClass,
          isCanBack: billingData.canpayment,
          sellingPrice: billingData.depositSellingPrice,
          cost: that.payCost
        },
        this.reqBaseData
      );
      HttpRequest({
        url: "/customer/register/subscription/save",
        data: data,
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.addWorkLog("购买订金合同", res.data.message);
            that.deductionMsgPush(res.data.data);
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 2
              })
            }, 1000);
          }
        }
      });
    },
    // 新增合同日志
    addWorkLog(logTitle, result) {
      let that = this;
      HttpRequest({
        url: "/system/log/addWorkLog",
        data: {
          workType: 23,
          descInfo: `${logTitle}:业务详情：${
            billingData.selectedCustomer.name
          }(${billingData.selectedCustomer.phone}),（合同号：${
            billingData.pactId
          }）,有效天数：${billingData.selectedCard.periodOfValidity}天,赠送${
            billingData.curCardSet.giveAwayAuthority
          }${billingData.selectedCard.unit},购卡金额:${
            billingData.selectedCard.salePrice || 0
          },销售员:${billingData.selectedSale.userName},微信:${
            this.reqBaseData.wechatPay
          },支付宝:${this.reqBaseData.aliPay},刷卡:${
            this.reqBaseData.cardPay
          },现金:${this.reqBaseData.cashPay},转账:${
            this.reqBaseData.transferAccounts
          },抵扣:${this.deductionMoney} 操作人：${
            wx.getStorageSync("staff_info").userName
          }(${wx.getStorageSync("staff_info").phone}),操作时间:${formatDate(
            new Date(),
            "yyyy-MM-dd hh:mm:ss"
          )}`,
          result: result,
          storeId: billingData.selectedStore.storeId,
          cardId: "",
          customerId: billingData.selectedCustomer.id
        }
      });
    },
    // 新增合同推送信息
    msgPush(data) {
      for (let k in data) {
        if (null == data[k] || undefined == data[k]) {
          data[k] = "";
        }
      }
      HttpRequest({
        url: "/customer/register/compact/push",
        data: data
      });
    },
    // 新增定金合同推送
    deductionMsgPush(data) {
      for (let k in data) {
        if (null == data[k] || undefined == data[k]) {
          data[k] = "";
        }
      }
      HttpRequest({
        url: "/customer/register/subscription/push",
        data: data
      });
    },
    // 合同激活推送
    cardActiveMsg() {
      HttpRequest({
        url: "/sendmsg/customer/cardActiveMsg",
        data: {
          activeSuccessCardIdStr: billingData.selectedCustomer.id,
          storeId: billingData.selectedStore.storeId
        }
      });
    },
    clickDedInput() {
      if (!this.deductionArray.length) {
        wx.showToast({
          title: "未选择抵扣合同",
          icon: "none"
        });
      }
    },
    addDed() {
      if (!this.deductionlist.length) {
        return wx.showToast({
          title: "无可用抵扣合同",
          icon: "none"
        });
      }
      this.showCardList = true;
    },
    // 获取抵扣合同
    getDeductionlist() {
      let that = this;
      HttpRequest({
        url: "/customer/register/deductionlist",
        data: {
          name: "",
          pactId: "",
          phone: that.dedFilterPhone || "",
          page: 1,
          pageSize: 100
        },
        success(res) {
          if (null != res.data.data && res.data.code == 200) {
            that.deductionlist = res.data.data.result.map(e => {
              e.transactTimeFmt = formatDate(
                new Date(e.transactTime),
                "yyyy-MM-dd"
              );
              e.isSelect = false;
              return e;
            });
          }
        }
      });
    },
    // 搜索抵扣合同
    searchDed(e) {
      this.dedFilterPhone = e;
      this.getDeductionlist();
    },
    // 选择抵扣合同
    selectDed(item) {
      if (!this.deductionArray.filter(e => e.cardId == item.cardId).length) {
        item.isSelect = true;
        // this.deductionArray.push(item);
      } else {
        item.isSelect = false;
        // this.deductionArray.splice(index, 1);
      }
      // let sum = 0
      // this.deductionArray.forEach(e => {
      //   sum += e.sellingPrice;
      // });
      // this.deductionMoney = sum
    },
    closeDedPopup() {
      let dedArr = []
      let sum = 0
      this.deductionlist.forEach((e) => {
        if (e.isSelect) {
          dedArr.push(e)
          sum += e.sellingPrice
        }
      })
      this.deductionArray = dedArr
      this.deductionMoney = sum
      this.showCardList = false;
    },
    confirmSelect() {
      // this.deductionMoney = deductionArray
      this.showCardList = false;
    },
    back() {
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
@import "../common/less/staff_common.less";
@import "../common/less/form.less";

.receivable {
  .subtitle-text {
    font-weight: bold;
  }
  .input-cell-wrapper {
    .cell-value {
      flex: 0 0 25%;
    }
    .cell-content {
      display: flex;
      .cell-input {
        position: relative;
        flex: 1;
      }
      .pay-cell {
        &:after {
          content: "元";
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .add-ded {
        width: 46px;
        height: 46px;
        font-size: 20px;
        margin-right: -15px;
        border-left: 1rpx solid #eee;
        line-height: 46px;
        text-align: center;
      }
    }
  }
  .order-info {
    padding: 0 15px;
    padding-bottom: 10px;
    border-bottom: 1rpx solid #eee;
    .order-pactId {
      line-height: 30px;
    }
    .order-desc {
      line-height: 20px;
    }
  }
  .receivable-bottom {
    position: fixed;
    bottom: 0px;
    left: 0px;
    display: flex;
    width: 100%;
    line-height: 48px;
    height: 48px;
    border-top: 1rpx solid #eee;
    .price {
      font-size: 16px;
      padding: 0 10px;
      font-weight: bold;
    }
    .receivable-btn {
      flex: 1;
      display: flex;
      > div {
        flex: 1;
        border-left: 1rpx solid #eee;
        text-align: center;
      }
    }
  }
  .confirm {
    color: #fff;
  }
  .ded-list-pop {
    position: relative;
    .header-search {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 2;
    }
    .ded-group {
      margin-bottom: 42px;
      .ded-item {
        position: relative;
        padding: 0 10px;
        border-top: 1rpx solid #eee;
        display: flex;
        flex-wrap: wrap;
        >span {
          line-height: 30px;
          margin-right: 20px;
        }
        // > div {
        //   line-height: 30px;
        //   > span {
        //     margin-right: 20px;
        //   }
        // }
        .icon {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
        }
      }
    }
    .confirm-select {
      position: sticky;
      bottom: 0;
      left: 0;
      font-size: 16px;
      color: #fff;
      width: 100%;
      text-align: center;
      line-height: 48px;
    }
  }
  .cell-tip {
    box-sizing: border-box;
    padding: 0 15px;
  }
}
</style>
