<template>
  <div class="staff_appoint_teamclass">
    <div class="header-search">
      <div class="search-wrapper">
        <van-search
          :value="searchText"
          background="#fff"
          @change="searchChange"
          placeholder="请输入搜索内容"
        ></van-search>
      </div>
    </div>
    <header-data></header-data>
    <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    <staff-coach-item></staff-coach-item>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>
    <suspension-window :operateList="operateList" @operate="operate"></suspension-window>
    <!-- <div class="suspension">
      <div class="operate-wrapper" v-show="showOperate" @click.stop="operate">
        <div class="operate-item">
          <span>批量取消课程</span><image mode="aspectFit" src="/static/images/staff/close.svg"></image>
        </div>
        <div class="operate-item">
          <span>排课</span><image mode="aspectFit" src="/static/images/staff/calendar.svg"></image>
        </div>
      </div>
      <image @click="toggleOperate" mode="aspectFit" src="/static/images/staff/suspension.svg"></image>
    </div>
    <div class="mask-all" v-show="showOperate" @click="showOperate = false"></div> -->
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import suspensionWindow from "../components/suspension-window.vue";

export default {
  data() {
    return {
      searchText: "",
      isShowFilter: false,
      nav: [
        {
          navTitle: "今日",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            }
          ]
        },
        {
          navTitle: "时间段",
          children: [
            {
              sonText: "全部"
            },
            {
              sonText: "0:00-8:00"
            },
            {
              sonText: "9:00-16:00"
            },
            {
              sonText: "16:00-24:00"
            }
          ]
        },
        {
          navTitle: "条件三",
          children: [
            {
              sonText: "子条件四"
            },
            {
              sonText: "子条件二"
            }
          ]
        }
      ],
      operateList: [{
        text: '批量取消课程',
        iconUrl: '/static/images/staff/close.svg'
      },{
        text: '排课',
        iconUrl: '/static/images/staff/calendar.svg'
      }]
      // showOperate: false
    };
  },
  mounted() {
    setNavTab();
  },
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    suspensionWindow
  },
  computed: {
    window() {
      return window
    }
  },
  methods: {
    showFilter() {
      this.isShowFilter = true;
    },
    searchChange(e) {
      console.log(e);
    },
    operate(param) {
      console.log(param)
    }
    // toggleOperate() {
    //   this.showOperate = !this.showOperate
    // },
    // operate() {

    // }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";

page {
  height: 100%;
  background-color: #f6f6f6;
}
.staff_appoint_teamclass {
  .filter-nav {
    margin-top: 5px;
    margin-bottom: 1px;
  }

  // .suspension {
  //   position: fixed;
  //   right: 20px;
  //   bottom: 20px;
  //   z-index: 2;
  //   >image {
  //     float: right;
  //    width: 45px;
  //    height: 45px; 
  //   }
  //   .operate-wrapper {
  //     text-align: right;
  //     margin-right: 5px;
  //     .operate-item {
  //       margin-bottom: 10px;
  //       >span {
  //         display: inline-block;
  //         vertical-align: middle;
  //         margin-right: 10px;
  //         color: #fff;
  //       }
  //       >image {
  //         display: inline-block;
  //         vertical-align: middle;
  //         width: 30px;
  //         height: 30px; 
  //       }
  //     }
  //   }
  // }
}
</style>
