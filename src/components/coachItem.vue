<template>
  <div class="coach-item">
    <div class="cover">
      <img>
    </div>
    <div class="coach-info">
      <div class="coach-name">$瑜伽$</div>
      <div class="coach-desc">$信息$</div>
    </div>
    <div class="tag">
      <div class="coach-type">$瑜伽$</div>
      <div class="coach-status">$热门$</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "coach-item",
  props: {}
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.coach-item {
  display: flex;
  padding-right: 10px;
  box-shadow: 0px 0px 5px #ccc;
  background-color: #fff;
  .cover {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    padding: 12px;
    box-sizing: border-box;
    > img {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background-color: #bfbfbf;
    }
  }
  .coach-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    > div {
      flex: 1;
      line-height: 45px;
      .Mult-line(1);
    }
    .coach-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .coach-desc {
      font-size: 15px;
      color: #333;
    }
  }
  .tag {
    .coach-type {
      font-size: 10px;
      padding: 2px 5px;
      color: #999;
      border: 1px solid #ccc;
    }
    .coach-status {
      font-size: 10px;
      padding: 2px 5px;
      color: #f17f55;
      background-color: #feeee9;
    }
  }
}
</style>


