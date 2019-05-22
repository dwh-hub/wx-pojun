<template>
  <!-- 左 日期 右 文本的 列表 -->
  <div class="day-list">
    <div class="flex-wrapper">
      <div class="cover flex-left">
        <div class="day">{{info.day}}</div>
        <div class="month">{{info.month}}月</div>
      </div>
      <div class="flex-middle">
        <div class="flex-middle-item">{{info.topText}}</div>
        <div class="flex-middle-item">{{info.bottomText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: function () {
        return {
          day: '18',
          month: '08',
          topText: '上面的文本',
          bottomText: '下面的文本',
        }
      }
    }
  }
};
</script>

<style lang="less">
.flex-wrapper {
  padding: 0;
  padding-right: 15px;
  align-items: center;
  border: none;
  border-top: 1rpx solid #eee;
  .flex-left {
    flex: 0 0 50px;
    padding: 10px 15px;
    margin-right: 15px;
    border-right: 1rpx solid #eee;
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
    padding: 10px 0;
  }
}
</style>
