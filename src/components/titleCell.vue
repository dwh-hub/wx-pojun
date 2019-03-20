<template>
  <div class="title-cell clearfix">
    <div class="title" :style="{fontSize: titleSize+'px'}">{{title}}</div>
    <div class="more-text" :style="{fontSize: moreSize+'px'}" @click="tapMore">{{moreText}}<img v-if="moreText" class="arrow" src="/static/images/icon-right-arrow.png"></div>
  </div>
</template>

<script>
export default {
  name:　'title-cell',
  props: {
    title: {
      type: String
    },
    moreText: {
      type: String,
      default: ''
    },
    titleSize: {
      type: Number,
      default: 16
    },
    moreSize: {
      type: Number,
      default: 16
    }
  },
  data() {
    return {};
  },
  computed: {
    presetStyle() {
      return {
        fontSize: this.size + 'px'
      }
    }
  },
  methods: {
    tapMore() {
      this.$emit('tapMore')
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.title-cell {
  text-align: right;
  line-height: 40px;
  .title {
    float: left;
    color: #333;
  }
  .more-text {
    color: #bababa;
    .arrow {
      width: 20px;
      height: 20px;
    }
  }
}
</style>

