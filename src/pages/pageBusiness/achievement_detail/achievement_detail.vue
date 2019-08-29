<template>
  <div class="achievement-detail" :class="{'isPhoneX-wrap':isPhoneX}">
    <div class="achievement-header">  
      <div class="sell-price">￥{{detail.cost}}元</div>
      <div class="sell-text">金额</div>
    </div>
    <div class="achievement-info">
      <div class="line-cell">
        <span class="cell-name">订单号:</span>
        <span class="cell-value">{{detail.orderNumber}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单类型:</span>
        <span class="cell-value">{{detail.purchasePatternChar}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">客户:</span>
        <span class="cell-value">{{detail.customerName}}（ID:{{detail.customerId}}）</span>
      </div>
      <div class="table-cell">
        <span class="cell-name">订单明细:</span>
        <div class="table">
          <tr>
            <td>品名</td>
            <td>数量</td>
            <td>单价</td>
            <td>金额</td>
          </tr>
          <tr>
            <td>{{detail.secondCardClassName}}</td>
            <td>1</td>
            <td>{{detail.sellingPrice}}</td>
            <td>{{detail.sellingPrice}}</td>
          </tr>
        </div>
      </div>
      <div class="line-cell">
        <span class="cell-name">合同编号:</span>
        <span class="cell-value">{{detail.pactId}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">办理销售:</span>
        <span class="cell-value">{{detail.transactUserName}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">业绩归属:</span>
        <span class="cell-value">{{detail.performence}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">支付方式:</span>
        <span class="cell-value">{{detail.payChar}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单备注:</span>
        <span class="cell-value">{{detail.remark || "无"}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单来源:</span>
        <span class="cell-value">{{detail.cardSourceChar || "无"}}</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单标签:</span>
        <span class="cell-value">{{detail.labelsName || "无"}}</span>
      </div>
      <div class="table-cell">
        <span class="cell-name">合同照片:</span>
        <span v-if="!detail.pactImg.length">无</span>
        <div class="img-list" v-if="detail.pactImg.length">
          <img src="" alt="" v-for="(item, index) in detail.pactImg" :key="index">
        </div>
      </div>
      <div class="line-cell">
        <span class="cell-name">合同使用人:</span>
        <span class="cell-value">{{detail.cardUsers}}</span>
      </div>
      <div class="bottom-cell">
        <div><span>开单时间：{{detail.cardAddTime}}</span><span>操作人：{{detail.cardAddUserName}}</span></div>
        <div><span>收款时间：{{detail.paymentTime}}</span><span>操作人：{{detail.paymentUserName}}</span></div>
      </div>
    </div>
    <!-- <div class="bottom-btn" :style="{'background-color': themeColor,color:'#fff'}">
      返回
      <div class="block" v-if="isPhoneX"></div>
    </div> -->
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
export default {
  data() {
    return {
      id: '',
      imgList: [],
      detail: {
        pactImg: []
      }
    }
  },
  mounted() {
    setNavTab()
    this.getAchievementDetail()
  },
  onLoad(options) {
    this.id = options.id
  },
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  methods: {
    getAchievementDetail() {
      let that = this;
      HttpRequest({
        url: '/performance/card/detail',
        data: {
          makeupCardId: that.id
        },
        success(res) {
          if (res.data.code == 200) {
            let data = res.data.data
            let performence = ""
            let cardUsers = ""
            data.performence.forEach(e => {
              performence += `${e.userName} ${e.proportion*data.cost}元，`
            })
            data.performence = performence.slice(0,performence.length-1)
            data.cardUsers.forEach(e => {
              cardUsers += `${e.customerName}，`
            })
            data.cardUsers = cardUsers.slice(0,cardUsers.length-1)
            data.cardAddTime = formatDate(new Date(data.cardAddTime), 'yyyy/MM/dd hh:mm:ss')
            data.paymentTime = formatDate(new Date(data.paymentTime), 'yyyy/MM/dd hh:mm:ss')

            let payChar = ""
            data.wechatPay ? (payChar = payChar + `微信：${data.wechatPay}元,`) : ''
            data.aliPay ? (payChar = payChar + `支付宝：${data.aliPay}元,`) : ''
            data.cardPay ? (payChar = payChar + `刷卡：${data.cardPay}元,`) : ''
            data.cashPay ? (payChar= payChar + `现金：${data.cashPay}元,`) : ''
            data.transferAccounts ? (payChar = payChar + `转账：${data.transferAccounts}元,`) : ''
            data.deductionMoney ? (payChar = payChar + `折扣：${data.deductionMoney}元,`) : ''
            data.payChar = payChar.slice(0,payChar.length-1)
            that.detail = data
          }
        }
      })
    },
    // 查看合同
    previewImage(item) {
      // wx.previewImage({
      //   current: item,
      //   urls: this.showImgList
      // })
    }
  }
}
</script>

<style lang="less">
@import "~COMMON/less/common.less";
  .achievement-detail {
    .achievement-header {
      margin: 15px 0;
      text-align: center;
      .sell-price {
        font-size: 16px;
        line-height: 30px;
      }
      .sell-text {
        font-size: 12px;
        line-height: 20px;
      }
    }
    .achievement-info {
      padding: 0 15px;
      .line-cell, .table-cell {
        .cell-name {
          margin-right: 5px;
        }
        >span {
          line-height: 24px;
          font-size: 12px;
          color: #333;
        }
      }
      .table-cell {
        .table {
          border: 1rpx solid #333;
          margin: 5px 0;
          >tr {
            display: flex;
            &:nth-of-type(1) {
              border-bottom: 1rpx solid #333;
            }
            >td {
              flex: 1;
              text-align: center;
              line-height: 24px;
              font-size: 12px;
              color: #333;
              border-right: 1rpx solid #333;
              &:last-of-type {
                border-right: none;
              }
            }
          }
        }
        .img-list {
          padding-left: 15px;
          margin: 5px 0;
          >img {
            width: 50px;
            height: 50px;
            border: 1rpx solid #eee;
          }
        }
      }
    }
    .bottom-cell {
      >div>span {
        margin-right: 15px;
        line-height: 24px;
        font-size: 12px;
        color: #a6a6a6;
      }
    }
  }
</style>