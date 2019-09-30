<template>
  <div class="suspension_window" v-if="operateListLength || operateListLength > 0">
    <div class="suspension" :style="{'right': right + 'px','bottom': bottom + 'px'}" @touchmove.stop="setTouchMove">
      <div class="operate-wrapper" v-show="showOperate">
        <div class="operate-item" v-for="(item, index) in _operateList" :key="index" :class="{hidden: item.hasAuth == undefined ? false : !item.hasAuth}" @click.stop="operate(item)">
          <span>{{item.text}}</span>
          <i :class="item.class" v-if="item.class" :style="{'color': themeColor}"></i>
          <image mode="aspectFit" v-else :src="item.iconUrl"></image>
        </div>
      </div>
      <!-- <image @click="toggleOperate" mode="aspectFit" src="/static/images/staff/suspension.svg"></image> -->
      <i class="icon-suspension" @click="toggleOperate" :style="{'color': themeColor}"></i>
    </div>
    <div class="mask-all" v-show="showOperate" @click.stop="showOperate = false" @touchmove.stop="preventTouchMove"></div>
  </div>
</template>

<script>
import { window } from "COMMON/js/common.js";
import {checkAuth} from "../common/js/service_config.js";
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
      right: 20,
      bottom: 40,
      windowH: wx.getSystemInfoSync().windowHeight,
      windowW: wx.getSystemInfoSync().windowWidth,
      _operateList: []
    };
  },
  mounted() {
    this._operateList = this.operateList.map(e => {
      if(e.authorityId) {
        e.hasAuth = checkAuth(e.authorityId)
      }
      return e
    })
  },
  computed: {
    themeColor() {
      return window.color
    },
    operateListLength() {
      return this.operateList.filter(e => e.hasAuth).length
    }
  },
  methods: {
    setTouchMove(e) {
      let clientX = e.mp.touches[0].clientX
      let clientY = e.mp.touches[0].clientY
      //此处clientY与clientX为拖动悬浮窗超过设定的大小会返回默认显示位置
      if ((clientX < 350 && clientX > 50) && (clientY > 50 && this.windowH-clientY > 20)){
        this.right = this.windowW - clientX
        this.bottom = this.windowH - clientY
      } else {
        this.right = 20 //默认显示位置 left距离
        this.bottom = 40  //默认显示位置 top距离
      }
    },
    preventTouchMove() {
      // wx.stopPullDownRefresh()
    },
    toggleOperate() {
      this.showOperate = !this.showOperate;
    },
    operate(item) {
      this.showOperate = false
      if(item.action) {
        item.action()
      }
      this.$emit("operate",item.text)
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
@import "../common/less/font.less";
.suspension_window {
  .suspension {
    position: fixed;
    right: 20px;
    bottom: 40px;
    z-index: 4;
    .icon-suspension {
      float: right;
      font-size: 35px;
      // background-color: #fff;
      background: radial-gradient(circle, #fff 50%, rgba(0,0,0,0) 50%);
      // border-radius: 50%;
    }
    // > image {
    //   float: right;
    //   width: 45px;
    //   height: 45px;
    //   border-radius: 50%;
    //   background: radial-gradient(circle, #fff 50%, rgba(0,0,0,0) 50%)
    // }
    .operate-wrapper {
      text-align: right;
      margin-right: 3px;
      .operate-item {
        margin-bottom: 10px;
        > span {
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
          color: #fff;
        }
        > image {
          display: inline-block;
          vertical-align: middle;
          width: 30px;
          height: 30px;
        }
        >i {
          display: inline-block;
          vertical-align: middle;
          font-size: 25px;
        }
      }
    }
  }
  .hidden {
    display: none;
  }
}
</style>
