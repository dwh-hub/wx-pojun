<template>
  <div class="assess" :class="{'isPhoneX-wrap':isPhoneX}">
    <!-- <div class="coach">
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
    </div>-->
    <team-class-item :info="detail" :isToDetail="false"></team-class-item>
    <div class="coach-assess">
      <div class="assess-title">{{typeText}}服务评价</div>
      <van-rate :value="coachRateVaule" :size="36" @change="onCoachRate"/>
    </div>
    <div class="store">
      <!-- <img src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg" alt> -->
      <img :src="detail.image" alt="">
      <span class="store-name">{{detail.storeName}}</span>
    </div>
    <div class="store-assess">
      <div class="assess-title">商家评价</div>
      <van-rate :value="storeRateVaule" :size="36" @change="onStoreRate"/>
    </div>
    <div class="remarks">备注</div>
    <textarea
      class="remarks-text"
      placeholder="请写下您对该课程的评价..."
      placeholder-style="color:#bababa;"
      v-model="remarks"
    />
    <div class="assess-btn bottom-btn" :style="{'background-color': themeColor}" @click="assess">
      立即评价
      <div class="block" v-if="isPhoneX"></div>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest, WechatMenuisLogin } from "COMMON/js/common.js";
import teamClassItem from "COMPS/teamClassItem.vue";
import store from "../../utils/store";
import pageFooter from "COMPS/pageFooter.vue"

export default {
  data() {
    return {
      coachRateVaule: 5,
      storeRateVaule: 5,
      teamClasVaule: 5,
      remarks: "",
      typeText: "",
      teamAttendId: null,
      coachAppointId: null,
      detail: {}
    };
  },
  onShow() {
    this.coachRateVaule = 5
    this.storeRateVaule = 5
    this.teamClasVaule = 5
    this.remarks = ""
  },
  onHide() {
    this.clearId()
  },
  onUnload() {
    this.clearId()
  },
  onLoad(options) {
    WechatMenuisLogin()
    // this.detail = JSON.parse(options.detail);
    // this.detail["masterImg"] = window.api + this.detail.headImgPath;
    // console.log(JSON.parse(options.detail));
    if (options.teamAttendId) {
      this.typeText = "团课"
      this.teamAttendId = options.teamAttendId;
      this.getClassDetail()
    }
    if (options.coachAppointId) {
      this.typeText = "教练"
      this.coachAppointId = options.coachAppointId;
      this.getCoachDetail()
      // this.detail["anotherName"] = this.detail.projectName;
    }
    setNavTab();
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  components: {
    teamClassItem,
    pageFooter
  },
  computed: {
    window() {
      return window;
    },
    isPhoneX() {
      return store.state.isIphoneX;
    },
    themeColor() {
      return window.color;
    }
  },
  methods: {
    clearId() {
      this.teamAttendId = null
      this.coachAppointId = null
    },
    assess() {
      console.log("assess")
      let url;
      let data = {};
      if (this.teamAttendId) {
        url = "/teamClass/finish/evalute/save";
        data = {
          teamAttendId: this.teamAttendId,
          scheduleStarLevel: this.coachRateVaule,
          storeStarLevel: this.storeRateVaule,
          remarks: this.remarks
        };
      }
      if (this.coachAppointId) {
        url = "/wxcustomer/class/evaluate/save";
        data = {
          coachAppointId: this.coachAppointId,
          coachStarLevel: this.coachRateVaule,
          storeStarLevel: this.storeRateVaule,
          remarks: this.remarks
        };
      }
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
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                  wx.hideLoading();
                if (res.data.code == 200) {
                  wx.showToast({
                    title: res.data.message,
                    icon: "success",
                    duration: 1000
                  });
                  setTimeout(() => {
                    wx.switchTab({
                      url: "/pages/appointmentClass/main"
                    });
                  }, 500);
                } else {
                  wx.showModal({
                    title: "提示",
                    content: res.data.message,
                    showCancel: false
                  });
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
    },
    // 团课
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/getOne",
        data: {
          teamAttendId: that.teamAttendId
        },
        success(res) {
          if (res.data.code === 200) {
            that.detail = res.data.data;
          }
        }
      });
    },
    // 私教课
    getCoachDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/detail",
        data: {
          coachAppointId: that.coachAppointId
        },
        success(res) {
          if (res.data.code === 200) {
            let data = res.data.data
            data.handwrittenImgPath = data.handwrittenImgPath ? window.api + data.handwrittenImgPath : data.handwrittenImgPath
            data["anotherName"] = data.projectName;
            that.detail = data;
          }
        }
      });
    },
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
  // .coach {
  //   display: flex;
  //   .cover {
  //     flex: 0 0 70px;
  //     width: 70px;
  //     height: 70px;
  //     box-sizing: border-box;
  //     > img {
  //       width: 70px;
  //       height: 70px;
  //       border-radius: 50%;
  //       background-color: #bfbfbf;
  //     }
  //   }
  //   .coach-info {
  //     flex: 1;
  //     display: flex;
  //     flex-direction: column;
  //     box-sizing: border-box;
  //     padding-left: 10px;
  //     > div {
  //       flex: 1;
  //       line-height: 35px;
  //       .Mult-line(1);
  //     }
  //     .coach-name {
  //       font-size: 16px;
  //       font-weight: bold;
  //       color: #333;
  //     }
  //     .coach-date {
  //       font-size: 14px;
  //       color: @theme-color;
  //     }
  //   }
  //   .more-text {
  //     color: #bababa;
  //     line-height: 70px;
  //     .arrow {
  //       width: 20px;
  //       height: 20px;
  //     }
  //   }
  // }
  .team-class-item {
    box-shadow: none;
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
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      margin-left: 12px;
      color: #333;
    }
  }
  .coach-assess,
  .store-assess {
    width: 100%;
    height: 120px;
    margin: 15px 0;
    text-align: center;
    background-color: #fff;
    border-radius: 2px;
    .assess-title {
      padding: 15px 0;
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


