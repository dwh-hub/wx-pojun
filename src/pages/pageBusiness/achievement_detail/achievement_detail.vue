<template>
  <div class="achievement-detail" :class="{'isPhoneX-wrap':isPhoneX}">
    <div class="achievement-header">  
      <div class="sell-price">￥2000.00元</div>
      <div class="sell-text">金额</div>
    </div>
    <div class="achievement-info">
      <div class="line-cell">
        <span class="cell-name">订单号:</span>
        <span class="cell-value">2019809898989</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单类型:</span>
        <span class="cell-value">办卡</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">客户:</span>
        <span class="cell-value">吴娟（ID:99544448）</span>
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
            <td>健身游泳卡</td>
            <td>1</td>
            <td>2000元</td>
            <td>2000元</td>
          </tr>
        </div>
      </div>
      <div class="line-cell">
        <span class="cell-name">卡号:</span>
        <span class="cell-value">7956456321566</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">办理销售:</span>
        <span class="cell-value">陈元</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">业绩归属:</span>
        <span class="cell-value">陈元 1000元 小李 1000元</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">支付方式:</span>
        <span class="cell-value">现金 2000元</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单备注:</span>
        <span class="cell-value">总经理特批价格</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单来源:</span>
        <span class="cell-value">DI派单</span>
      </div>
      <div class="line-cell">
        <span class="cell-name">订单标签:</span>
        <span class="cell-value">培训班A1班</span>
      </div>
      <div class="table-cell">
        <span class="cell-name">合同照片:</span>
        <div class="img-list">
          <img src="" alt="">
        </div>
      </div>
      <div class="line-cell">
        <span class="cell-name">合同使用人:吴娟</span>
        <span class="cell-value"></span>
      </div>
      <div class="bottom-cell">
        <div>开单时间：2019/8/9 12:00       操作人：黄莺</div>
        <div>收款时间：2019/8/9 21:00       操作人：李白</div>
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
      imgList: []
    }
  },
  mounted() {
    setNavTab()
  },
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  methods: {
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
      >div {
        line-height: 24px;
        font-size: 12px;
        color: #a6a6a6;
      }
    }
  }
</style>