<template>
  <div id="memberActiveDetail">
    <div class="active-cover">
      <img src alt>
    </div>
    <div class="active-title">$活动标题$</div>
    <div class="active-num">$仅限前300名$</div>
    <div class="active-content-wrapper">
      <div class="active-content-t">活动内容</div>
      <div class="active-content"></div>
    </div>
    <div class="activeBottom">
      <span class="activeBottomTitle">人数：</span>
      <ul class="count">
        <li class="pl" style="margin-left: 20px;">
          <span id="num-jian" class="num-jian">-</span>
        </li>
        <li class="pl">
          <input
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            type="number"
            class="input-num"
            id="input-num"
            value="1"
          >
        </li>
        <li class="pl">
          <span id="num-jia" class="num-jia">+</span>
        </li>
      </ul>
      <span id="sign">报名</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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
    padding-bottom: 10px;
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
  }
  .activeBottom {
    width: 100%;
    height: 53px;
    position: fixed;
    bottom: 0px;
    line-height: 53px;
    padding-left: 15px;
    border-top: 1px solid #eee;
    .activeBottomTitle {
      display: block;
      float: left;
    }
  }
}
</style>


