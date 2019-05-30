<template>
  <div id="cardDetail">
    <card :info="cardInfo"></card>
    <div class="moneyRecode">
      <div class="spend">
        <div class="spend-text">消费</div>
        <div class="spend-num">{{customer.recCount}}次</div>
      </div>
      <div class="balance">
        <div class="balance-text">剩余</div>
        <div class="balance-num">{{cardInfo.periodOfValidity}}{{cardInfo.authorityUnitChar}}</div>
      </div>
    </div>
    <div class="card-info">
      <div class="carad-info-item">
        <span class="item-title">拥有人</span>
        <span class="item-content">{{cardInfo.mainUser || cardInfo.name ||  '--'}}</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">联系方式</span>
        <span class="item-content">{{cardInfo.phone}}</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">办理销售</span>
        <span class="item-content">{{cardInfo.transactUserName}}</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">办理时间</span>
        <span class="item-content">{{activateDate}}</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">合同编号</span>
        <span class="item-content">{{cardInfo.pactId}}</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">上课教练</span>
        <span class="item-content">{{cardInfo.coachUserName || '--'}}</span>
      </div>
      <div class="carad-info-item">
        <span class="item-title">有效期</span>
        <span class="item-content">{{activateDate}}~{{doomsday}}</span>
      </div>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import card from "COMPS/card";
import pageFooter from "COMPS/pageFooter.vue"
export default {
  data() {
    return {
      type: '', // 登录状态是客户还是staff
      cardId: '',
      // 合同详情
      cardInfo: {},
      // 消费统计
      customer: {}
    };
  },
  components: {
    card,
    pageFooter
  },
  onLoad(option) {
    this.cardId = option.id
    this.type = option.type || ''
    setNavTab();
  },
  mounted() {
    this.getCardDetail()
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  computed: {
    // 卡的激活时间
    activateDate() {
      if(this.cardInfo.activateDate) {
        return this.cardInfo.cardAddTime.split(" ")[0]
      }
      return ""
    },
    // 卡的到期时间
    doomsday() {
      if (this.cardInfo.doomsday) {
        return this.cardInfo.doomsday.split(" ")[0]
      }
      return ""
    },
  },
  methods: {
    // 获取合同详情
    getCardDetail() {
      let that = this
      HttpRequest({
        url: window.api + '/customer/card/detail/' + that.cardId,
        success(res) {
          that.cardInfo = res.data.data
          console.log(that.cardInfo)
          that.getCustomer(res.data.data.pactId)
        }
      })
    },
    // 获取消费统计
    getCustomer(id) {
      let _url = ""
      if(this.type == "staff") {
        _url = "/consumption/log/pages"
      } else {
        _url = '/consumption/log/pages/customer'
      }
      let that = this
      HttpRequest({
        url: window.api + _url,
        data: {
          pactId: id
        },
        success(res) {
          that.customer = res.data.data
          console.log(that.customer)
        }
      })
    }
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


