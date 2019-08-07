<template>
  <div class="header-data">
    <div class="data-item" v-for="(item, index) in headerData" :key="index">
      <div class="num">{{item.dataNum || '0'}}</div>
      <div class="text">{{item.dataText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerData: {
      type: Array,
      default: [{
        dataText: '数据一',
        dataNum: '12'
      },{
        dataText: '数据二',
        dataNum: '42'
      },{
        dataText: '数据三',
        dataNum: '39'
      }]
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
.header-data {
  display: flex;
  border-bottom: 20rpx solid #f6f6f6;
  background-color: #fff;
  .data-item {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    .num {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 3px;
    }
    .text {
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
      color: #999;
    }
  }
}
</style>
