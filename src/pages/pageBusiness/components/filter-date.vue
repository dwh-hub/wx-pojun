<template>
  <div class="filter-date" :style="{'border-color':themeColor}">
    <span
      class="filter-date-item"
      v-for="(item, index) in dateArr"
      :key="index"
      :style="dateStyle+(dateIndex == index ? activeStyle : '')"
      @click="selectDate(item, index)"
    >{{item.name}}</span>
    <!-- <span class="filter-date-item" :style="{'border-right-color':themeColor,color:themeColor}">本周</span>
    <span class="filter-date-item" :style="{color:themeColor}">本月</span>-->
  </div>
</template>

<script>
import { filterDateMethod } from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      dateArr: [
        {
          name: "今日",
          key: 'day'
        },
        {
          name: "本周",
          key: 'week'
        },
        {
          name: "本月",
          key: 'month'
        }
      ],
      dateIndex: 0
    };
  },
  mixins: [colorMixin],
  computed: {
    dateStyle() {
      if(!this.themeColor){
        return ''
      }
      return `border-right-color: ${this.themeColor}; color: ${this.themeColor};`
    },
    activeStyle() {
      if(!this.themeColor){
        return ''
      }
      return `background-color: ${this.themeColor};color: #fff;`
    }
  },
  methods: {
    selectDate(item, index) {
      this.dateIndex = index
      let dateObj = filterDateMethod(item.key)
      this.$emit('changeDate', dateObj)
    }
  }
};
</script>

<style lang="less">
.filter-date {
  position: absolute;
  left: 50%;
  top: 49px;
  transform: translateX(-50%);
  display: inline-block;
  border-radius: 5px;
  background-color: #fff;
  border: 1rpx solid;
  overflow: hidden;
  .filter-date-item {
    display: inline-block;
    width: 40px;
    line-height: 22px;
    text-align: center;
    font-size: 12px;
    border-right: 1rpx solid;
    &:last-of-type {
      border: none;
    }
  }
}
</style>