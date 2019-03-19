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
    </div>
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
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.coach-detail {
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
  .coach-imgs {
    padding: 0 20px;
    .title {
      margin-top: 15px;
      font-weight: bold;
    }
  }
  .coach-desc {
    >p {
      margin-top: 5px;
      color: #bababa;
    }
  }
}
</style>

