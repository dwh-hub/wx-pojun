<template>
  <div class="coach-student">
    <div class="tabs">
      <span class="student" :class="{underline: tabIndex == 1}" @click="tabIndex = 1">学员列表</span>
      <span class="customer" :class="{underline: tabIndex == 2}" @click="tabIndex = 2">汇总</span>
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
    <header-data :headerData="headerData"></header-data>
    <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>
    <div class="student-list">
      <staff-coach-item @clickIcon="appoint">
        <div>
          <div class="appoint">约课</div>
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
          navTitle: "登记时间",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            },
            {
              sonText: "自定义"
            }
          ]
        },
        {
          navTitle: "未维护时间",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            },
            {
              sonText: "自定义"
            }
          ]
        },
        {
          navTitle: "会员状态",
          children: [
            {
              sonText: "潜在"
            },
            {
              sonText: "现有"
            },
            {
              sonText: "定金"
            },
            {
              sonText: "失效"
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "人数",
          dataNum: "12"
        },
        {
          dataText: "数据二",
          dataNum: "42"
        },
        {
          dataText: "数据三",
          dataNum: "39"
        }
      ],
      operateList: [
        {
          text: "分配销售",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "分配教练",
          iconUrl: "/static/images/staff/calendar.svg"
        },
        {
          text: "发送手机短信",
          iconUrl: "/static/images/staff/calendar.svg"
        },
        {
          text: "关注",
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
.coach-student {
  .tabs {
    padding: 0 5px;
    background-color: #fff;
    > span {
      display: inline-block;
      padding: 0 15px;
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
      margin-bottom: 1px;
      .icon-right {
        margin-top: 16px;
        img {
          width: 18px;
          height: 18px;
        }
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
}
</style>
