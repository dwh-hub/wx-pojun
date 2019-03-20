<template>
  <div id="memberActiveDetail">
    <div class="active-cover">
      <!-- <img src alt> -->
    </div>
    <div class="active-title">$活动标题$</div>
    <div class="active-num">$仅限前300名$</div>
    <div class="active-content-wrapper">
      <div class="active-content-t">活动内容</div>
      <div class="active-content"></div>
    </div>
    <div class="activeBottom">
      <span class="activeBottomTitle">人数：</span>
      <div class="count-wrapper">
        <span class="decrease" @click="signNum--">-</span>
        <span class="numbers">{{signNum}}</span>
        <span class="increase" @click="signNum++">+</span>
      </div>
      <span class="sign">报名</span>
    </div>
  </div>
</template>

<script>
import {setNavTab} from 'COMMON/js/common.js'
export default {
  data() {
    return {
      signNum: '1'
    };
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

#memberActiveDetail {
  .active-title {
    margin: 0px 15px;
    text-align: center;
    height: 40px;
    // padding-bottom: 10px;
    border-bottom: 2px solid #ddd;
    font-weight: bolder;
    line-height: 40px;
    font-size: 15px;
    color: #565656;
  }
  .active-num {
    margin: 0 15px;
    font-size: 14px;
    color: #666;
    height: 25px;
    line-height: 25px;
    margin-top: 15px;
  }
  .active-content-wrapper {
    border-top: 5px solid #f4f4f4;
    padding: 0 15px;
    padding-top: 10px;
    .active-content-t {
      color: #333;
      padding-left: 5px;
      border-width: 0 0 0 2px;
      border-style: solid;
      font-size: 14px;
      font-weight: 500;
    }
    .active-content {
      img {
        width: 100%;
      }
    }
  }
  .activeBottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    padding-left: 15px;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    .activeBottomTitle {
      display: block;
      float: left;
    }
    .count-wrapper {
      // float: left;
      display: inline-block;
      margin-top: 3px;
      line-height: 30px;
      text-align: center;
      // border-radius: 4px;
      border: 1px solid #dbdbdb;
      .decrease,
      .increase {
        display: inline-block;
        width: 31px;
      }
      .numbers {
        display: inline-block;
        min-width: 40px;
        border-left: 1px solid #dbdbdb;
        border-right: 1px solid #dbdbdb;
      }
    }
    .sign {
      float: right;
      display: block;
      width: 90px;
      text-align: center;
      background-color: #3b97eb;
      color: #fff;
    }
  }
}
</style>


