<template>
  <div class="none-result">
    <img src="" alt="">
    <p>{{text}}</p>
    <div class="result-btn" v-if="buttonText" @click="tapBtn">{{buttonText}}</div>
  </div>
</template>

<script>
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
    padding-top: 30px;
    >img {
      width: 120px;
      height: 120px;
      background-color: #eee;
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
      background-color: @theme-color;
      &:active {
        opacity: 0.8;
      }
    }
  }
</style>


