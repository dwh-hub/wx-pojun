<template>
  <div class="scroll-text" :style="{'background-color':txtBackcolor}">
    <div class="scroll-left">
      <div class="text-wrapper" :animation="animationData">
        <text class="txt-light" :style="{'color': txtColor}">{{txt}}</text>
      </div>
    </div>
    <span class="close" @click="closeTxt">×</span>
  </div>
</template>

<script>
export default {
  props: {
    txtBackcolor: {
      type: String,
      default: "#e8f3fa"
    },
    txtColor: {
      type: String,
      default: "#999"
    },
    txt: {
      type: String,
      default: ""
    }
  },
  watch: {
    txt(val) {
      console.log(val)
      this.$nextTick(() => {
        setTimeout(() => {
          this.getHeight();  
        }, 200);
      });
    }
  },
  data() {
    return {
      animation: null,
      animationData: null
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getHeight();
    // });
    // this.getHeight();
  },
  methods: {
    util(obj) {
      console.log(obj);
      // 计算动画时长
      let continueTime = (parseInt(obj.list*2 / obj.container) + 1) * 2000;
      let setIntervalTime = 50 + continueTime;

      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "linear", //线性
        delay: 0 //0则不延迟
      });
      this.animation = animation;
      animation
        .translateX(obj.container)
        .step({ duration: 50, timingFunction: "step-start" })
        .translateX(-obj.list)
        .step({ duration: continueTime });
      this.animationData = animation.export();
      setInterval(() => {
        animation
          .translateX(obj.container)
          .step({ duration: 50, timingFunction: "step-start" })
          .translateX(-obj.list)
          .step({ duration: continueTime });
        this.animationData = animation.export();
      }, setIntervalTime);
    },
    getHeight() {
      let obj = new Object();
      //创建节点选择器
      let query = wx.createSelectorQuery();
      query.select(".scroll-left").boundingClientRect();
      query.select(".txt-light").boundingClientRect();
      query.exec(res => {
        console.log(res);
        obj.container = res[0].width; // 框的width
        obj.list = res[1].width; // 文本的长度
        if (obj.list > obj.container) {
          this.util(obj);
        }
      });
    },
    closeTxt() {
      this.$emit('close')
    }
  }
};
</script>

<style lang="less">
.scroll-text {
  display: flex;
  .scroll-left {
    flex: 1;
    overflow: hidden;
  }
  .text-wrapper {
    position: relative;
    height: 20px;
    width: 100%;
  }
  .txt-light {
    padding: 0 5px;
    position: absolute;
    white-space: nowrap;
    line-height: 20px;
    font-size: 12px;
  }
  >span {
    font-size: 20px;
    line-height: 20px;
    margin-right: 10px;
    color: #f95d51;
  }
}
</style>
