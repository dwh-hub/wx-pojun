<template>
  <div id="cardDetail">
    <card></card>
    <div class="moneyRecode">
      <div class="spend">
        <div class="spend-text">消费</div>
        <div class="spend-num">$1000.00元$</div>
      </div>
      <div class="balance">
        <div class="balance-text">剩余</div>
        <div class="balance-num">$1000.00元$</div>
      </div>
    </div>
    <div class="card-info">
      <div class="carad-info-item">
        <span class="item-title">拥有人</span>
        <span class="item-content">$姓名（身份）$</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">联系方式</span>
        <span class="item-content">$13046886548$</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">办理销售</span>
        <span class="item-content">$13$</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">办理时间</span>
        <span class="item-content">$2019-03-01$</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">合同编号</span>
        <span class="item-content">$32132132$</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">上课教练</span>
        <span class="item-content">$名字$</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">有效期</span>
        <span class="item-content">$2019-03-01~2019-03-01$</span>
      </div>
    </div>
  </div>
</template>

<script>
import card from "COMPS/card";
export default {
  data() {
    return {};
  },
  components: {
    card
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

#cardDetail {
  padding: 15px 30px;
  color: #666;
  .moneyRecode {
    margin: 15px 0;
    display: flex;
    justify-content: space-around;
    >div {
      flex: 1;
      text-align: center;
      line-height: 30px;
    }
    .spend {
      border-right: 1px solid #eee;
    }
  }
  .card-info {
    .carad-info-item {
      display: flex;
      justify-content:  space-between;
      line-height: 50px;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>


