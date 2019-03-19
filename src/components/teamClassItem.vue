<template>
  <div class="team-class-item" @click="toDetail">
    <div class="cover">
      <img>
    </div>
    <div class="team-class-info">
      <div class="team-class-name">$瑜伽$</div>
      <div class="team-class-coach">$教练$</div>
      <div class="team-class-time">$9:45-15:45$</div>
    </div>
    <div class="tag">
      <div class="team-class-type">$瑜伽$</div>
      <div class="team-class-status">$热门$</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "team-class-item",
  props: {},
  methods: {
    toDetail() {
      wx.navigateTo({
        url: '../teamClassDetail/main'
      })
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.team-class-item {
  display: flex;
  padding-right: 10px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 2px;
  background-color: #fff;
  .cover {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    > img {
      width: 100%;
      height: 100%;
      background-color: #bfbfbf;
    }
  }
  .team-class-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    > div {
      flex: 1;
      line-height: 30px;
      .Mult-line(1);
    }
    .team-class-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .team-class-coach {
      font-size: 15px;
      color: #333;
    }
    .team-class-time {
      font-size: 12px;
      color: #bababa;
    }
  }
  .tag {
    .team-class-type {
      font-size: 10px;
      padding: 2px 5px;
      color: #999;
      border: 1px solid #ccc;
    }
    .team-class-status {
      font-size: 10px;
      padding: 2px 5px;
      color: #f17f55;
      background-color: #feeee9;
    }
  }
}
</style>


