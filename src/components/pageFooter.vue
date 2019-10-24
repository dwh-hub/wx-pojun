<template>
  <!-- <div class="page-footer">
    <p>欢迎您！<span :style="{color:window.color}">{{userName}}</span></p>
    <span class="footer-text"><span class="company" :style="{color:window.color}">利刃系统</span>由<span class="company">破军科技</span>提供技术支持</span>
  </div> -->
  <div></div>
</template>

<script>
import {window} from "COMMON/js/common.js";
export default {
  data() {
    return {
      userName: ""
    }
  },
  mounted() {
  },
  onShow() {
    this.userName = wx.getStorageSync("userInfo").name;
  },
  computed: {
    window() {
      return window
    }
  }
}
</script>

<style lang="less">

.page-footer {
  width: 100%;
  padding-top: 30px;
  padding-bottom: 15px;
  text-align: center;
  .footer-text {
    display: inline-block;
    margin-top: 10px;
    color:#666;
    >span {
      display: inline-block;
      margin: 0 5px;
    }
  }
}
</style>
