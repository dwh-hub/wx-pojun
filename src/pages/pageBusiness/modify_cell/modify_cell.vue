<template>
  <div class="modify-cell">
    <input type="text" v-model="cellText">
    <div class="confirm" @click="back">确认</div>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
export default {
  data() {
    cellInfo: {
    }
  },
  computed: {
    cellText() {
      return this.cellInfo.cellText
    }
  },
  onLoad(options) {
    this.cellInfo = JSON.parse(options.cellInfo);
  },
  mounted() {
    setNavTab();
  },
  methods: {
    back() {
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.modify-cell {
  >input {
    line-height: 42px;
    height: 42px;
    border-bottom: 1px solid #eee;
    padding-left: 15px;
  }
  .confirm {
    width: 95vw;
    margin: 0 auto;
    margin-top: 10px;
    text-align: center;
    line-height: 36px;
    border-radius: 5px;
    color: #fff;
    background-color: #2a82e4;
  }
}
</style>
