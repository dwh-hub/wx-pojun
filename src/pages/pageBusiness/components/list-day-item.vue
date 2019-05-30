<template>
  <!-- 左 日期 右 文本的 列表 -->
  <div class="day-list">
    <div class="flex-wrapper">
      <div class="cover flex-left">
        <div class="day">{{info.day}}</div>
        <div class="month">{{info.month}}月</div>
      </div>
      <div class="flex-middle">
        <wxParse :content="info.topText||'<p></p>'" />
        <wxParse :content="info.bottomText||'<p></p>'" />
        <!-- <div class="flex-middle-item">{{info.topText}}</div> -->
        <!-- <div class="flex-middle-item">{{info.bottomText}}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import wxParse from "mpvue-wxparse";
export default {
  props: {
    info: {
      type: Object,
      default: function () {
        return {
          day: '',
          month: '',
          topText: '',
          bottomText: '',
        }
      }
    }
  },
  components: {
    wxParse
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
.flex-wrapper {
  padding: 0;
  padding-right: 15px;
  align-items: center;
  border: none;
  border-top: 1rpx solid #eee;
  .flex-left {
    flex: 0 0 50px;
    padding: 10px 15px;
    // margin-right: 15px;
    > div {
      text-align: center;
      font-weight: bold;
    }
    .month {
      font-size: 15px;
      color: gray;
    }
    .day {
      font-size: 30px;
      color: #333;
    }
  }
  .flex-middle {
    border-left: 1rpx solid #eee;
    padding: 10px 0;
    padding-left: 15px;
    >div {
      .Mult-line(3);
    }
  }
}
</style>
