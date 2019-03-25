<template>
  <div class="appointmentClass">
    <div class="nav-tab">
      <div class="stay" :class="{active: currentNav==1}" @click="selectNav(1)">待上课</div>
      <div class="assess" :class="{active: currentNav==2}" @click="selectNav(2)">待评价</div>
      <div class="complete" :class="{active: currentNav==3}" @click="selectNav(3)">已完成</div>
      <div class="other" :class="{active: currentNav==4}" @click="selectNav(4)">其他</div>
    </div>
    <div class="stay-list" v-if="!(!teamClassList.length && !coachList.length)">
      <div class="stay-team-class">
        <title-cell title="团课" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllStore"></title-cell>
        <div class="team-class-wrapper">
          <team-class-item v-for="(item, index) in teamClassList" :key="index"></team-class-item>
        </div>
        <none-result text="你还没有预约团课呢" v-if="!teamClassList.length"></none-result>
      </div>
      <div class="stay-coach">
        <title-cell title="私教" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllStore"></title-cell>
        <div class="coach-wrapper">
          <coach-item v-for="(item, index) in coachList" :key="index"></coach-item>
        </div>
        <none-result text="你还没有预约私教呢" v-if="!coachList.length"></none-result>
      </div>
    </div>
    <van-action-sheet
      :show="showSelect"
      :actions="actions"
      @close="closeSelect"
      @select="selectCur"
    ></van-action-sheet>
    <none-result
      text="你还没有准备好吗"
      :buttonText="btnText"
      @tapBtn="toggleSelect"
      v-if="!teamClassList.length && !coachList.length"
    ></none-result>
    <div
      class="bottom-btn"
      v-if="teamClassList.length || coachList.length"
      @click="toggleSelect"
    >继续预约</div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import noneResult from "COMPS/noneResult.vue";
import titleCell from "COMPS/titleCell.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";

export default {
  data() {
    return {
      currentNav: 1,
      showSelect: false,
      teamClassList: [],
      coachList: [],
      classId: "",
      // 当前登录用户的id
      customerId: "",
      actions: [{ name: "团课" }, { name: "私教" }]
    };
  },
  components: {
    noneResult,
    titleCell,
    teamClassItem,
    coachItem
  },
  onLoad(option) {
    this.customerId = this.userInfo = wx.getStorageSync("userInfo").id;
    this.classId = option.classId;
    setNavTab("", "#2a82e4");
    this.getOwnClassList();
  },
  computed: {
    btnText() {
      if (!this.teamClassList.length && !this.coachList.length) {
        return "试试预约";
      }
    }
  },
  methods: {
    selectNav(index) {
      this.currentNav = index;
    },
    toggleSelect() {
      this.showSelect = true;
    },
    toAllStore() {
      wx.navigateTo({
        url: "../allStore/main"
      });
    },
    selectCur(event) {
      this.showSelect = false;
      if (event.target.name == "团课") {
        wx.navigateTo({
          url: "../teamClassList/main"
        });
      } else if (event.target.name == "私教") {
        wx.navigateTo({
          url: "../coachList/main"
        });
      }
    },
    closeSelect() {
      this.showSelect = false;
    },
    // 获取我的课程列表 status 3 已下课
    getOwnClassList(status) {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/pages/own",
        data: {
          customerId: that.customerId,
          status: status
        },
        success(res) {
          console.log(res);
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";

.appointmentClass {
  .nav-tab {
    display: flex;
    border-bottom: 10px solid #f5f5f5;
    > div {
      flex: 1;
      line-height: 42px;
      text-align: center;
      border-bottom: 1rpx solid #eee;
      border-right: 1rpx solid #eee;
      &:nth-last-of-type(1) {
        border-right: none;
      }
      &.active {
        color: @theme-color;
      }
    }
  }
  .title-cell .title {
    font-weight: bold;
  }
  .stay-list {
    padding: 0 15px;
  }
}
</style>


