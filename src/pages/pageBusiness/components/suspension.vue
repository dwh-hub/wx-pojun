<template>
  <div class="suspension" v-if="_operateList || _operateList > 0">
    <movable-area class="movable-area" v-show="!showOperate">
      <movable-view
        class="movable-view"
        :style="{'background-color':themeColor}"
        direction="vertical"
        @click="toggleOperate"
      >+</movable-view>
    </movable-area>
    <div class="operate-wrapper" :style="{'z-index': showOperate ? 4 : -1}">
      <!-- :class="{hidden: item.hasAuth == undefined ? false : !item.hasAuth}" -->
      <div
        class="operate-item"
        v-for="(item, index) in _operateList"
        :key="index"
        :style="item.transition"
        :class="[(showOperate && item.hasShow) ? 'animation-after' : 'animation-bofore']"
        @click.stop="operate(item)"
      >
        <i class="operate-icon" :class="item.class" :style="{'background-color': themeColor}" v-if="item.class"></i>
        <div class="operate-icon operate-img-wrapper" :style="{'background-color': themeColor}" v-else>
          <img class="operate-img" :src="item.iconUrl">
        </div>
        <span class="operate-text">{{item.text}}</span>
        <img class="close" @click.stop="singleClose(item, index)" src="/static/images/icon-close.png">
      </div>
    </div>
    <div
      class="mask-all"
      v-show="showOperate"
      @click.stop="showOperate = false"
      @touchmove.stop="preventTouchMove"
    ></div>
  </div>
</template>

<script>
import { window } from "COMMON/js/common.js";
import { checkAuth } from "../common/js/service_config.js";
export default {
  props: {
    operateList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showOperate: false,
      _operateList: []
    };
  },
  mounted() {
    let list = this.operateList.map((e, index) => {
      if (e.authorityId) {
        e.hasAuth = checkAuth(e.authorityId);
      }
      e.transition = `transition: transform 0.2s ease-in ${index*30}ms`
      e.hasShow = true
      return e;
    });
    this._operateList = list.filter(e => e.hasAuth == undefined ? true : e.hasAuth)
  },
  computed: {
    themeColor() {
      return window.color;
    },
    // operateListLength() {
    //   return this.operateList.filter(e => e.hasAuth).length;
    // }
  },
  methods: {
    toggleOperate() {
      this.showOperate = !this.showOperate;
      this._operateList.forEach(e => {
        e.hasShow = this.showOperate
      })
    },
    operate(item) {
      this.showOperate = !this.showOperate;
      if (item.action) {
        item.action();
      }
      this.$emit("operate", item.text);
    },
    singleClose(item, index) {
      // TODO: 视图更新
      this.showOperate = false;
      // item.hasShow = false
      // this.$set(this._operateList, index, item);
    },
    // toggleAnimation(delayTime) {
    //   let itemW = '190px'

    //   let animation = wx.createAnimation({
    //     timingFunction: "linear", //线性
    //     delay: delayTime //0则不延迟
    //   })

    //   animation
    //     .translateX(itemW)
    //     .step({ duration: 50, timingFunction: "step-start" })
    //     .translateX(-itemW)
    //     .step({ duration: 400 });

    //   return animation.export()
    // }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";
.suspension {
  .movable-area {
    position: fixed;
    top: 0;
    right: 0;
    width: 38px;
    height: 100vh;
    z-index: 2;
    .movable-view {
      position: absolute;
      top: 50vh;
      width: 38px;
      height: 30px;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      text-align: center;
      box-shadow: -1px 0px 3px 0px rgba(5, 40, 62, 0.1);
      border-radius: 15px 0 0 15px;
    }
  }
  .operate-wrapper {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 4;
    width: 190px;
    .operate-item {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      width: 190px;
      height: 60px;
      box-shadow: 0px 2px 2px 0px rgba(169, 169, 169, 0.25);
      border-radius: 30px 0 0 30px;
      background-color: #fff;
      transition: transform 0.2s ease-in;
      .operate-icon {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        // text-align: center;
        // line-height: 34px;
        margin-left: 15px;
        border-radius: 50px;
        font-size: 18px;
        color: #fff;
        .operate-img {
          width: 20px;
          height: 20px;
        }
      }
      .operate-img-wrapper {
        font-size: 14px;
      }
      .operate-text {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        color: #0a0204;
      }
      .close {
        padding: 15px;
        width: 10px;
        height: 10px;
      }
      &.animation-bofore {
        transform: translate3d(190px, -50%, 0);
      }
      &.animation-after {
        transform: translate3d(0, -50%, 0);
      }
    }
  }
  .mask-all {
    background-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
