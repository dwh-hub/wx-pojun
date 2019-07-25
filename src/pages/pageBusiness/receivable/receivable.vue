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
          <input class="cell-input" type="number" v-model="reqBaseData.cashPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">银行卡</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="reqBaseData.cardPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">支付宝</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="reqBaseData.aliPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">微信</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="reqBaseData.wechatPay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">转账</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="reqBaseData.transferAccounts" />
        </div>
      </div>
    </div>
    <div class="receivable-bottom">
      <div class="price">收款：{{payCost}}元</div>
      <div class="receivable-btn">
        <div :style="{color: themeColor}" @click="back">删除</div>
        <div :style="{color: themeColor}" @click="back">取消收款</div>
        <div :style="{'background-color': themeColor}" class="confirm" @click="confirm">确认收款</div>
      </div>
    </div>
  </div>
</template>

<script>
import { setNavTab, HttpRequest, formatDate } from "COMMON/js/common.js";
import billingData from "../common/js/billingData";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      // cashPay: 0,
      // cardPay: 0,
      // aliPay: 0,
      // wechatPay: 0,
      // transferAccounts: 0,
      // cost: "23879",
      deductionMoney: 0,
      deduction: [],
      reqBaseData: {
        storeId: billingData.selectedStore.storeId,
        phone: billingData.selectedCustomer.phone,
        id: billingData.selectedCustomer.id,
        name: billingData.selectedCustomer.name,
        sex: billingData.selectedCustomer.sex,
        birthTime: "",
        transactUserId: billingData.selectedSale.userId,
        transactuser: billingData.selectedSale.userId,
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
        token: billingData.token
      }
    };
  },
  mounted() {
    setNavTab();
    this.checkDeduction();
  },
  mixins: [colorMixin],
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
      return `${this.billingText}-客户：${billingData.selectedCustomer.name}(${
        billingData.selectedCustomer.phone
      })，${billingData.selectedCard.first_1}，${
        billingData.selectedCard.salePrice
      }元，${this.payCardType}(${billingData.payCardStartDate} -
        ${billingData.payCardEndDate})，办理销售：${
        billingData.selectedSale.userName
      }，卡号：${billingData.cardNum || "无"}`;
    },
    payablePrice() {
      if (billingData.billingType == 4) {
        return billingData.depositSellingPrice;
      } else {
        return billingData.selectedCard.salePrice;
      }
    },
    payCost() {
      return Number(
        Number(this.reqBaseData.transferAccounts) +
        Number(this.reqBaseData.wechatPay) +
        Number(this.reqBaseData.aliPay) +
        Number(this.reqBaseData.cardPay) +
        Number(this.reqBaseData.cashPay)
      );
    }
  },
  methods: {
    confirm() {
      if(this.payCost != this.payablePrice) {
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
            that.deduction = res.data.data;
          }
        }
      });
    },
    // 新增合同
    addCompact() {
      let that = this;
      let data;
      let basaData = {
        // storeId: billingData.selectedStore.storeId,
        // phone: billingData.selectedCustomer.phone,
        // id: billingData.selectedCustomer.id,
        // name: billingData.selectedCustomer.name,
        // sex: billingData.selectedCustomer.sex,
        // birthTime: "",
        // transactUserId: billingData.selectedSale.userId,
        // transactuser: billingData.selectedSale.userId,
        // buyCardTime: billingData.date,
        // pactId: billingData.pactId,
        // remarks: billingData.remarks,
        // cardSource: billingData.selectedSource.value,
        /* 收款新增参数 */
        // transferAccounts: that.transferAccounts,
        // paymentType: 0,
        // wechatPay: that.wechatPay,
        // aliPay: that.aliPay,
        // cardPay: that.cardPay,
        // cashPay: that.cashPay,
        // cost: that.cost, // 总数
        // token: billingData.token,
        mainUser: billingData.selectedCustomer.name,
        cardClassId: billingData.selectedCard.cardId,
        sellingPrice: billingData.selectedCard.salePrice,
        buyAuthority: billingData.selectedCard.buyAuthority,
        periodOfValidity: billingData.selectedCard.periodOfValidity,
        teachCardType: billingData.teachCardType,
        canTeachCard: billingData.isTeachingContract,
        authorityUnit: billingData.selectedCard.authorityUnit,
        coachUserId: billingData.selectedCoach.userId,
        labelIdsStr: billingData.selectedLable.cardLabelId,
        isTimingOfActivation: billingData.payCardType,
        activateDate:
          billingData.payCardType == 1 ? billingData.payCardStartDate : "",
        doomsday:
          billingData.payCardType == 1 ? billingData.payCardEndDate : "",
        phoneVerifyStatus: "",
        physicsCardNo: billingData.cardNum,
        pactImgPath: billingData.uploadImgList,
        compactNum: 1,
        compactSumMoney: billingData.selectedCard.salePrice,
        deductionMoney: that.deductionMoney,
        deductionArray: [],
        cardUserJson: [],
        cost: that.payCost
      };
      data = Object.assign(basaData, billingData.curCardSet, this.reqBaseData);
      for(let k in data) {
        if(!data[k] || data[k] == null) {
          data[k] = ""
        }
      }
      HttpRequest({
        url: "/customer/register/compact",
        data: data,
        success(res) {
          if (res.data.code == 200) {
            that.addWorkLog(this.billingText, res.data.message);
            that.msgPush(res.data.data);
            if (billingData.payCardType == 2) {
              that.cardActiveMsg();
            }
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            })
          }
        }
      });
    },
    // 新增定金合同
    addAubscription() {
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
          if (res.data.code == 200) {
            that.addWorkLog("购买订金合同", res.data.message);
            that.deductionMsgPush(res.data.data);
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            })
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
            billingData.selectedCard.salePrice
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
      HttpRequest({
        url: "/customer/register/compact/push",
        data: data
      });
    },
    // 新增定金合同推送
    deductionMsgPush(data) {
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
    back() {
      wx.navigateBack({
        delta: 1
      })
    }
  }
};
</script>

<style lang="less">
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
    .cell-input {
      position: relative;
      &:after {
        content: "元";
        position: absolute;
        top: 0;
        right: 0;
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
}
</style>
