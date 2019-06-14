<template>
  <div class="suspension_window">
    <div class="suspension">
      <div class="operate-wrapper" v-show="showOperate">
        <div class="operate-item" v-for="(item, index) in operateList" :key="index" @click.stop="operate(item)">
          <span>{{item.text}}</span>
          <image mode="aspectFit" :src="item.iconUrl"></image>
        </div>
      </div>
      <!-- <image @click="toggleOperate" mode="aspectFit" src="/static/images/staff/suspension.svg"></image> -->
      <i class="icon-suspension" @click="toggleOperate" :style="{'color': themeColor}"></i>
    </div>
    <div class="mask-all" v-show="showOperate" @click="showOperate = false"></div>
  </div>
</template>

<script>
import { window } from "COMMON/js/common.js";
export default {
  props: {
    operateList: {
      type: Array,
      default: [
        {
          text: '',
          iconUrl: ''
        }
      ]
    }
  },
  data() {
    return {
      showOperate: false
    };
  },
  computed: {
    themeColor() {
      return window.color
    }
  },
  methods: {
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
    bottom: 20px;
    z-index: 2;
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
      }
    }
  }
}
</style>
