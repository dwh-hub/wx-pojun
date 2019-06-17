<template>
  <div class="appoint_result">
    <div class="result-img">
      <image src="http://pojun-tech.cn/assets/img/come_class.png" mode="aspectFit" alt="" v-if="type=='attend'"></image>
      <image src="http://pojun-tech.cn/assets/img/order_success.png" mode="aspectFit" alt="" v-else></image>
    </div>
    <van-cell-group>
      <van-cell title="上课日期" :value="timeStart" />
      <van-cell title="课程名称" :value="classDetail.projectName" />
      <van-cell title="地点" :value="classDetail.storeName+'-'+classDetail.venueName" />
      <van-cell title="使用合同" :value="classDetail.cardClassName" />
    </van-cell-group>
    <div class="appoint-bottom-btn">
      <div class="see-btn" @click="seeAppoint" :style="{backgroundColor: themeColor}">查看预约</div>
      <div class="goon-btn" @click="toAppoint" :style="{backgroundColor: themeColor}">继续预约</div>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest, formatDate } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      coachAppointId: '', // 预约成功后返回的预约id
      classDetail: {},
      type: ''
    }
  },
  onLoad(options) {
    if(options.coachAppointId) {
      this.coachAppointId = options.coachAppointId
      this.type  = options.type || ''
    }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  mounted() {
    setNavTab();
    this.getCoachClassDetail()
  },
  mixins: [colorMixin],
  computed: {
    timeStart() {
      if (this.classDetail.timeStart) {
        return formatDate(new Date(this.classDetail.timeStart), "yyyy-MM-dd");
      } else {
        return "";
      }
    },
  },
  methods: {
    getCoachClassDetail() {
      let that = this;
      console.log("getCoachClassDetail")
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/detail",
        data: {
          coachAppointId: that.coachAppointId
        },
        success(res) {
          if (res.data.code === 200) {
            that.classDetail = res.data.data;
          }
        }
      });
    },
    seeAppoint() {
      wx.redirectTo({
        url: '../private_coach_class/main'
      })
    },
    toAppoint() {
      wx.redirectTo({
        url: '../coach_student/main'
      })
    }
  }
};
</script>

<style lang="less">
.appoint_result {
  .result-img {
    width: 100%;
    >image {
      width: 100%;
    }
  }
  .appoint-bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    .see-btn {
      border-right: 1rpx solid #fff;
    }
    >div {
      flex: 1;
      line-height: 42px;
      text-align: center;
      color: #fff;
    }
  }
}
</style>
