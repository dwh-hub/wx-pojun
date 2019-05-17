<template>
  <div class="member">
    <div class="tabs">
      <span class="student" :class="{underline: tabIndex == 1}" @click="tabIndex = 1">学员</span>
      <span class="customer" :class="{underline: tabIndex == 2}" @click="tabIndex = 2">客户</span>
    </div>
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
    <filter-nav @allFilter="showFilter"></filter-nav>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>
    <div class="student-list" v-show="tabIndex == 1">
      <staff-coach-item @clickIcon="appoint">
        <div>
          <div class="appoint">约课</div>
          <img src="/static/images/staff/right-arrow.svg" alt>
        </div>
      </staff-coach-item>
    </div>
    <div class="customer-list" v-show="tabIndex == 2">
      <staff-coach-item @clickIcon="call">
        <div>
          <img src="/static/images/staff/phone.svg" alt>
          <img src="/static/images/staff/right-arrow.svg" alt>
        </div>
      </staff-coach-item>
    </div>

    <suspension-window :operateList="operateList" @operate="operate"></suspension-window>
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
      tabIndex: 1,
      nav: [
        {
          navTitle: "条件一",
          children: [
            {
              sonText: "子条件一"
            },
            {
              sonText: "子条件二"
            }
          ]
        },
        {
          navTitle: "条件二",
          children: [
            {
              sonText: "子条件三"
            },
            {
              sonText: "子条件二"
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
      operateList: [
        {
          text: "批量取消课程",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "排课",
          iconUrl: "/static/images/staff/calendar.svg"
        }
      ]
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
      return window;
    }
  },
  methods: {
    showFilter() {
      console.log(13354);
      this.isShowFilter = true;
    },
    searchChange(e) {
      console.log(e);
    },
    operate(param) {
      console.log(param);
    },
    appoint() {
      wx.navigateTo({
        url: "../appoint_coach/main"
      });
    },
    call() {
      wx.makePhoneCall({
        phoneNumber: ""
      });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.member {
  .tabs {
    padding: 0 5px;
    background-color: #fff;
    > span {
      display: inline-block;
      width: 60px;
      line-height: 36px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      &.underline {
        border-bottom: 2px solid #4d97e8;
      }
    }
  }
  .filter-nav {
    margin-top: 5px;
    margin-bottom: 1px;
    .mask {
      top: 205px;
    }
  }
  .student-list {
    margin-bottom: 1px;
    .staff-coach-item {
      .icon-right {
        margin-top: 16px;
      }
      .appoint {
        display: inline-block;
        vertical-align: middle;
        line-height: 24px;
        width: 50px;
        text-align: center;
        border-radius: 16px;
        color: #fff;
        background-color: #4d97e8;
      }
    }
  }
  .staff-coach-item {
    margin-bottom: 1px;
    .icon-right {
      margin-top: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
