<template>
  <div class="coach-detail">
    <div class="coach">
      <div class="cover">
        <img>
      </div>
      <div class="coach-info">
        <div class="coach-name">$高子涵$</div>
        <div class="coach-times">$13节课 共授课19次$</div>
      </div>
    </div>
    <div class="coach-desc">
      <div class="title">个人简介</div>
      <p>$一个很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的简介$</p>
    </div>
    <div class="coach-imgs">
      <div class="title">个人形象</div>
      <div class="img-group">
        <img><img><img>
      </div>
    </div>
    <div class="course">
      <div class="title">成长历程</div>
      <div class="course-content"></div>
    </div>
    <div class="bottom-btn appointment-btn" @click="toAppoint">马上预约</div>  
  </div>
</template>

<script>
import { setNavTab } from "COMMON/js/common.js";
export default {
  data() {
    return {};
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  methods: {
    toAppoint() {
      wx.navigateTo({
        url: '../appointmentCoach/main'
      })
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

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
    >p {
      color: #bababa;
    }
  }
  .coach-imgs {
    .img-group {
      display: flex;
      >img {
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
      width: 100%;
      height: 270px;
      border-radius: 15px;
      background-color: #eee;
    }
  }
}
</style>

