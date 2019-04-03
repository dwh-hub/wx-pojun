<template>
  <div class="coach-detail" :class="{'isPhoneX-wrap':isPhoneX}">
    <div class="coach">
      <div class="cover">
        <img :src="window.api + coachInfo.headImgPath">
      </div>
      <div class="coach-info">
        <div class="coach-name">{{coachInfo.userName || '教练名'}}</div>
        <div
          class="coach-times"
        >共授课{{(coachInfo.privateCountByCoach+coachInfo.teamCountByCoach) || '0'}}节</div>
      </div>
    </div>
    <div class="coach-desc">
      <div class="title">个人简介</div>
      <p>{{coachInfo.individualResume || '暂无个人简介'}}</p>
    </div>
    <div class="coach-imgs">
      <div class="title">个人形象</div>
      <div class="img-group">
        <img :src="window.api + item" v-for="(item, index) in personalImage" :key="index">
      </div>
    </div>
    <div class="course">
      <div class="title">成长历程</div>
      <div class="course-content">
        <wxParse :content="coachInfo.growthProcess || '<p>无</p>'" :imageProp="{domain: window, mode: 'widthFix'}"/>
      </div>
    </div>
    <div
      class="bottom-btn appointment-btn"
      @click="toAppoint"
      :style="{'background-color': window.color}"
    >
      马上预约
      <div class="block" v-if="isPhoneX"></div>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import store from "../../utils/store";
import wxParse from "mpvue-wxparse";

export default {
  data() {
    return {
      coachId: "",
      coachInfo: {}
    };
  },
  onLoad(option) {
    this.coachId = option.coachId;
    setNavTab();
  },
  mounted() {
    this.getCoachDetail();
  },
  components: {
    wxParse
  },
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    },
    window() {
      return window
    }
  },
  methods: {
    toAppoint() {
      if (!store.state.isLogin) {
        return wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1000
        });
      }
      wx.navigateTo({
        url: "../appointmentCoach/main?coachId=" + this.coachId
      });
    },
    getCoachDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/employee/file/datailByCus/" + that.coachId,
        success(res) {
          that.coachInfo = res.data.data;
          console.log(that.coachInfo)
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
@import url("~mpvue-wxparse/src/wxParse.css");

.coach-detail {
  padding-bottom: 60px;
  .coach {
    display: flex;
    border-radius: 2px;
    background-color: #fff;
    padding: 10px 0;
    .cover {
      flex: 0 0 90px;
      width: 90px;
      // height: 90px;
      // padding: 12px;
      padding-left: 12px;
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
      justify-content: center;
      padding-left: 12px;
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
      .coach-times {
        color: #bababa;
      }
    }
  }
  .coach-desc,
  .coach-imgs,
  .course {
    padding: 0 20px;
    .title {
      margin-top: 15px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
  .coach-desc {
    > p {
      color: #bababa;
    }
  }
  .coach-imgs {
    .img-group {
      display: flex;
      > img {
        flex: 1;
        margin-right: 5px;
        width: 100%;
        height: 80px;
        border-radius: 2px;
        background-color: #eee;
        &:nth-last-of-type(1) {
          margin-right: 0px;
        }
      }
    }
  }
  .course {
    .course-content {
      // width: 100%;
      // height: 270px;
      // border-radius: 15px;
      // background-color: #eee;
    }
  }
}
</style>

