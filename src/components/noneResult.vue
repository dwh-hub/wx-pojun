<template>
  <div class="none-result">
    <!-- <img src="/static/images/none-result.png" alt=""> -->
    <image src="/static/images/none-result.png" mode="aspectFit"></image>
    <p>{{text}}</p>
    <div class="result-btn" :style="{'background-color': themeColor}" v-if="buttonText" @click="tapBtn">{{buttonText}}</div>
  </div>
</template>

<script>
import {window} from "COMMON/js/common.js";
export default {
  name: 'none-result',
  props: {
    text: {
      type: String,
      default: '暂无内容'
    },
    buttonText: {
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    themeColor() {
      return window.color;
    }
  },
  methods: {
    tapBtn() {
      this.$emit('tapBtn')
    }
  }
}
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

  .none-result {
    text-align: center;
    padding: 30px 0;
    >image {
      width: 100px;
      height: 100px;
      // background-color: #eee;
    }
    >p {
      margin-top: 10px;
      color: #333;
    }
    .result-btn {
      width: 120px;
      line-height: 30px;
      margin: 0 auto;
      margin-top: 15px;
      border-radius: 16px;
      color: #fff;
      &:active {
        opacity: 0.8;
      }
    }
  }
</style>


