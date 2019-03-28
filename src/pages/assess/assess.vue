<template>
  <div class="assess">
    <div class="coach">
      <div class="cover">
        <img>
      </div>
      <div class="coach-info">
        <div class="coach-name">$张教练$</div>
        <div class="coach-date">$3-14 16:00-17:00$</div>
      </div>
      <div class="more-text">
        $趣味有氧$
        <img class="arrow" src="/static/images/icon-right-arrow.png">
      </div>
    </div>
    <div class="coach-assess">
      <div class="assess-title">服务评价</div>
      <van-rate :value="coachRateVaule" :size="36" @change="onCoachRate"/>
    </div>
    <div class="store">
      <img src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg" alt>
      <span class="store-name">$三体店$</span>
    </div>
    <div class="store-assess">
      <div class="assess-title">商家评价</div>
      <van-rate :value="storeRateVaule" :size="36" @change="onStoreRate"/>
    </div>
    <div class="remarks">
      备注
    </div>
    <textarea class="remarks-text" placeholder="请写下您对该课程的评价..." placeholder-style="color:#bababa;" v-model="remarks" />
    <div class="assess-btn bottom-btn" @click="assess">立即评价</div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
export default {
  data() {
    return {
      coachRateVaule: 5,
      storeRateVaule: 5,
      teamClasVaule: 5,
      remarks: "",
      teamAttendId: null,
      coachAppointId: null
    };
  },
  onLoad(options) {
    if (options.teamAttendId) {
      this.teamAttendId = options.teamAttendId;
    }
    if (options.coachAppointId) {
      this.coachAppointId = options.coachAppointId;
    }
    setNavTab();
  },
  methods: {
    assess() {
      console.log(this.coachRateVaule);
      console.log(this.storeRateVaule);
      let url;
      let data = {};
      if (this.teamAttendId) {
        url = "/teamClass/finish/evalute/save";
        data = {
          teamAttendId: this.teamAttendId,
          scheduleStarLevel: this.teamClasVaule,
          storeStarLevel: this.storeRateVaule,
          remarks: this.remarks
        };
      }
      if (this.coachAppointId) {
        url= "/wxcustomer/class/evalute/save"
        data = {
          coachAppointId: this.coachAppointId,
          coachStarLevel: this.teamClasVaule,
          storeStarLevel: this.storeRateVaule,
          remarks: this.remarks
        };
      }
    console.log(url)
    console.log(data)
      let that = this;
      wx.showModal({
        title: "确认",
        content: "是否确认评价？",
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: "提交评价"
            });
            HttpRequest({
              url: window.api + url,
              data: data,
              method: 'PSOT',
              success(res) {
                if (res.data.code == 200) {
                  wx.hideLoading();
                  wx.showToast({
                    title: "评价成功",
                    icon: "success",
                    duration: 1000
                  });
                  setTimeout(() => {}, 1000);
                }
              }
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    onCoachRate(event) {
      this.coachRateVaule = event.mp.detail;
    },
    onStoreRate(event) {
      this.storeRateVaule = event.mp.detail;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

page {
  background-color: #f5f5f5;
}
.assess {
  padding: 15px;
  padding-bottom: 50px;
  .coach {
    display: flex;
    .cover {
      flex: 0 0 70px;
      width: 70px;
      height: 70px;
      box-sizing: border-box;
      > img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #bfbfbf;
      }
    }
    .coach-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding-left: 10px;
      > div {
        flex: 1;
        line-height: 35px;
        .Mult-line(1);
      }
      .coach-name {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .coach-date {
        font-size: 14px;
        color: @theme-color;
      }
    }
    .more-text {
      color: #bababa;
      line-height: 70px;
      .arrow {
        width: 20px;
        height: 20px;
      }
    }
  }
  .store {
    > img {
      display: inline-block;
      vertical-align: middle;
      width: 100px;
      height: 55px;
      border-radius: 5px;
    }
    .store-name {
      display: inline-block;
      margin-left: 12px;
      color: #333;
    }
  }
  .coach-assess,
  .store-assess {
    width: 100%;
    height: 180px;
    margin: 15px 0;
    text-align: center;
    background-color: #fff;
    border-radius: 2px;
    .assess-title {
      padding-top: 15px;
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .remarks {
    font-size: 18px;
  }
  .remarks-text {
    width: 100%;
    height: 150px;
    margin: 15px 0;
    padding: 15px;
    background-color: #fff;
    border-radius: 2px;
  }
}
</style>


