<template>
  <div class="header-data" :class="{overlap: isOverlap}">
    <div class="data-item" v-for="(item, index) in headerData" :key="index">
      <div class="num" :style="{color: item.color || '#999'}">{{item.dataNum || '0'}}</div>
      <div class="text">{{item.dataText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerData: {
      type: Array,
      default: [
        {
          dataText: "数据一",
          dataNum: "12"
        },
        {
          dataText: "数据二",
          dataNum: "42"
        },
        {
          dataText: "数据三",
          dataNum: "39"
        }
      ]
    },
    isOverlap: {
      type: Boolean,
      default: false
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
  height: 66px;
  margin: 20px 10px 5px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 7px 0px rgba(1, 60, 97, 0.1);
  &.overlap {
    position: relative;
    margin-top: -40px;
  }
  .data-item {
    flex: 1;
    position: relative;
    text-align: center;
    padding: 10px 0;
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 20px;
      width: 1px;
      background-color: #f6f6f6;
    }
    .num {
      font-size: 18px;
      font-weight: bold;
      margin: 3px 0;
    }
    .text {
      font-size: 13px;
      color: #666;
    }
  }
}
// .header-data {
//   display: flex;
//   border-bottom: 20rpx solid #f6f6f6;
//   background-color: #fff;
//   .data-item {
//     flex: 1;
//     text-align: center;
//     padding: 10px 0;
//     .num {
//       font-size: 20px;
//       font-weight: bold;
//       margin-bottom: 3px;
//     }
//     .text {
//       font-weight: bold;
//       font-size: 16px;
//       margin-top: 10px;
//       color: #999;
//     }
//   }
// }
</style>
