<template>
  <div class="none-result">
    <!-- <i></i>  http://pojun-tech.cn/assets/img/none-result.png-->
    <image mode="aspectFit" :src="window.api + '/assets/img/none-result.png'"></image>
    <p>{{text}}</p>
    <div class="result-btn" :style="{'background-color': window.color}" v-if="buttonText" @click="tapBtn">{{buttonText}}</div>
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
    window() {
      return window;
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
      width: 150px;
      height: 150px;
    }
    // >i {
    //   display: inline-block;
    //   width: 100px;
    //   height: 100px;
    //   background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTU0MzY3ODUxODE1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ0NDYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTYyOS44NjYwMTcgMjI3LjAwMTIxOGgyMTIuMDM0MTA1bC0yMjQuNTA2Njk5LTIyNC41MDY2OTl2MjEyLjAzNDEwNWMwIDYuMjM2Mjk3IDYuMjM2Mjk3IDEyLjQ3MjU5NCAxMi40NzI1OTQgMTIuNDcyNTk0eiIgcC1pZD0iNDQ0NyIgZmlsbD0iI2IzYjRiMyI+PC9wYXRoPjxwYXRoIGQ9Ik02MjguNjE4NzU4IDYwNi4xNjgwODhIMjE1Ljc3NTg4M2MtMTQuOTY3MTEzIDAtMjcuNDM5NzA4LTEyLjQ3MjU5NC0yNy40Mzk3MDgtMjcuNDM5NzA4czEyLjQ3MjU5NC0yNy40Mzk3MDggMjcuNDM5NzA4LTI3LjQzOTcwOGg0MzAuMzA0NTA3YzEzLjcxOTg1NCAwIDIzLjY5NzkyOSA5Ljk3ODA3NiAyNi4xOTI0NDggMjIuNDUwNjcgMzkuOTEyMzAyLTIzLjY5NzkyOSA4Ni4wNjA5MDEtMzcuNDE3NzgzIDEzNS45NTEyNzktMzcuNDE3NzgzIDEyLjQ3MjU5NCAwIDI0Ljk0NTE4OSAxLjI0NzI1OSAzNi4xNzA1MjQgMi40OTQ1MTlWMjgwLjYzMzM3NEg2MjkuODY2MDE3Yy0zNi4xNzA1MjQgMC02Ni4xMDQ3NS0yOS45MzQyMjctNjYuMTA0NzUtNjYuMTA0NzVWMEg1My42MzIxNTZDMjMuNjk3OTI5IDAgMCAyMy42OTc5MjkgMCA1My42MzIxNTZ2ODYwLjYwOTAxM2MwIDI5LjkzNDIyNyAyMy42OTc5MjkgNTMuNjMyMTU2IDUzLjYzMjE1NiA1My42MzIxNTZoNTM4LjgxNjA3OGMtMzMuNjc2MDA1LTQ0LjkwMTM0LTUzLjYzMjE1Ni0xMDEuMDI4MDE1LTUzLjYzMjE1Ni0xNjAuODk2NDY4IDAtNzkuODI0NjA0IDM0LjkyMzI2NC0xNTIuMTY1NjUyIDg5LjgwMjY4LTIwMC44MDg3Njl6TTIxNS43NzU4ODMgMzkwLjM5MjIwNWg0MzAuMzA0NTA3YzE0Ljk2NzExMyAwIDI3LjQzOTcwOCAxMi40NzI1OTQgMjcuNDM5NzA3IDI3LjQzOTcwNyAwIDE0Ljk2NzExMy0xMi40NzI1OTQgMjcuNDM5NzA4LTI3LjQzOTcwNyAyNy40Mzk3MDhIMjE1Ljc3NTg4M2MtMTQuOTY3MTEzIDAtMjcuNDM5NzA4LTEyLjQ3MjU5NC0yNy40Mzk3MDgtMjcuNDM5NzA4IDAtMTQuOTY3MTEzIDEyLjQ3MjU5NC0yNy40Mzk3MDggMjcuNDM5NzA4LTI3LjQzOTcwN3oiIHAtaWQ9IjQ0NDgiIGZpbGw9IiNiM2I0YjMiPjwvcGF0aD48cGF0aCBkPSJNODA2Ljk3Njg1NyA1OTIuNDQ4MjM0Yy0xMTguNDg5NjQ3IDAtMjE1Ljc3NTg4MyA5Ni4wMzg5NzctMjE1Ljc3NTg4MyAyMTUuNzc1ODgzIDAgMTE4LjQ4OTY0NyA5Ni4wMzg5NzcgMjE1Ljc3NTg4MyAyMTUuNzc1ODgzIDIxNS43NzU4ODNDOTI2LjcxMzc2NCAxMDIyLjc1Mjc0MSAxMDIyLjc1Mjc0MSA5MjYuNzEzNzY0IDEwMjIuNzUyNzQxIDgwNi45NzY4NTdjMC0xMTguNDg5NjQ3LTk2LjAzODk3Ny0yMTQuNTI4NjI0LTIxNS43NzU4ODQtMjE0LjUyODYyM3ogbTAgMzQ5LjIzMjY0M2MtMTQuOTY3MTEzIDAtMjcuNDM5NzA4LTEyLjQ3MjU5NC0yNy40Mzk3MDctMjcuNDM5NzA4IDAtMTQuOTY3MTEzIDEyLjQ3MjU5NC0yNy40Mzk3MDggMjcuNDM5NzA3LTI3LjQzOTcwNyAxNC45NjcxMTMgMCAyNy40Mzk3MDggMTIuNDcyNTk0IDI3LjQzOTcwOCAyNy40Mzk3MDcgMCAxNi4yMTQzNzMtMTIuNDcyNTk0IDI3LjQzOTcwOC0yNy40Mzk3MDggMjcuNDM5NzA4eiBtMC04MS4wNzE4NjRjLTE0Ljk2NzExMyAwLTI3LjQzOTcwOC0xNDcuMTc2NjE0LTI3LjQzOTcwNy0xNjAuODk2NDY3czEyLjQ3MjU5NC0yNy40Mzk3MDggMjcuNDM5NzA3LTI3LjQzOTcwOGMxNC45NjcxMTMgMCAyNy40Mzk3MDggMTIuNDcyNTk0IDI3LjQzOTcwOCAyNy40Mzk3MDhTODIxLjk0Mzk3MSA4NjAuNjA5MDEzIDgwNi45NzY4NTcgODYwLjYwOTAxM3oiIHAtaWQ9IjQ0NDkiIGZpbGw9IiNiM2I0YjMiPjwvcGF0aD48L3N2Zz4=);
    //   background-size: cover;
    // }
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


