<template>
  <div class="appointment-result">
    <div class="header">
      <div class="result-text success">$预约成功$</div>
      <p class="result-p">感谢您对本课程的支持，请耐心等待开课</p>
      <div class="btn-group">
        <span class="cancel">取消预约</span>
        <span class="assess">评价</span>
        <span class="again">再约一节</span>
      </div>
    </div>
    <div class="class-info">
      <title-cell title="课程信息" moreText="查看详情" :moreSize="14" :titleSize="16"></title-cell>
      <div class="class-date">上课日期：$2018-4-5$</div>
      <div class="class-name">课程名称：$动感律动单车$</div>
      <div class="class-coach">上课教教：$张三$</div>
    </div>
    <div class="store">
      <div class="title">门店信息</div>
      <store-item></store-item>
    </div>
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell"
import storeItem from "COMPS/storeItem"

export default {
  data() {
    return {};
  },
  components: {
    titleCell,
    storeItem
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.appointment-result {
  .header {
    .result-text {
      line-height: 60px;
      padding-left: 20px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1rpx solid #eee;
      &.success {
        color: #43cf7c;
      }
    }
    .result-p {
      padding-left: 20px;
      margin-top: 10px;
      margin-bottom: 12px;
      color: #bababa;
    }
    .btn-group {
      padding-left: 25px;
      padding-bottom: 10px;
      border-bottom: 1rpx solid #eee;
      >span {
        display: inline-block;
        width: 70px;
        text-align: center;
        line-height: 26px;
        margin-right: 15px;
        border-radius: 2px;
      }
      .cancel {
        color: #333;
        border: 1rpx solid #e2e2e2;
      }
      .assess,
      .again {
        background-color: @theme-color;
        color: #fff;
      }
    }
  }
  .class-info {
    padding: 0 15px;
    .class-date,
    .class-name,
    .class-coach {
      padding-left: 15px;
      line-height: 46px;
      border-top: 1rpx solid #eee;
      color: #333;
    }
  }
  .store {
    padding: 0 15px;
    border-top: 1rpx solid #eee;
    .title {
      line-height: 40px;
      color: #333;
    }
  }
}
</style>
