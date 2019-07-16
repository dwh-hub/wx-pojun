<template>
<!-- 废弃页面 -->
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
    <div class="item-wrapper" v-for="(item, index) in teamclassList" :key="index">
      <div class="item-left" @click="selectClass(item,index)" v-show="isOperate">
        <div class="icon-wrapper" :class="{border: !item.isSelect}">
          <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect">
        </div>
      </div>
      <staff-coach-item @clickItem="navTo('../schedule_class/main')"></staff-coach-item>
    </div>
    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>
    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="operate"></suspension-window>
    <div class="operate-bottom" v-if="isOperate">
      <div class="left" @click="selectAll">
        <div class="icon-wrapper" :class="{border: !isAllSelect}">
          <img src="/static/images/staff/select-icon.png" alt v-show="isAllSelect">
        </div>
        <span class="left-text">全选</span>
      </div>
      <div class="middle">已选{{selectNum || '0'}}节</div>
      <div class="right">
        <div class="btn" @click="isOperate = false">取消操作</div>
        <div class="btn" @click="batchCancel">批量取消课程</div>
      </div>
    </div>
    <van-dialog id="van-dialog"/>
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import suspensionWindow from "../components/suspension-window.vue";
import Dialog from "../../../../static/vant/dialog/dialog";
import Toast from "../../../../static/vant/toast/toast";

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
      operateList: [
        {
          text: "批量取消课程",
          hasAuth: true,
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "排课",
          hasAuth: true,
          iconUrl: "/static/images/staff/calendar.svg"
        }
      ],
      teamclassList: [
        {
          isSelect: false
        }
      ],
      isAllSelect: false,
      isOperate: false
      // showOperate: false
    };
  },
  onShow() {
    this.isOperate = false
  },
  mounted() {
    this.nav[0].navTitle = "今日";
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
    },
    selectNum() {
      let _num = 0;
      this.teamclassList.forEach(e => {
        if (e.isSelect) {
          _num++;
        }
      });
      return _num;
    }
  },
  methods: {
    navTo(url) {
      wx.navigateTo({
        url: url
      });
    },
    selectClass(item, index) {
      if (!this.isOperate) {
        return;
      }
      this.teamclassList[index].isSelect = !item.isSelect;
      if (this.teamclassList.filter(e => true !== e.isSelect).length > 0) {
        this.isAllSelect = false;
      } else {
        this.isAllSelect = true;
      }
    },
    showFilter() {
      this.isShowFilter = true;
    },
    searchChange(e) {
      console.log(e);
    },
    operate(param) {
      console.log(param);
      if (param == "批量取消课程") {
        this.isOperate = true;
      }
    },
    selectAll() {
      let that = this;
      this.teamclassList = this.teamclassList.map(e => {
        if (that.isAllSelect) {
          e.isSelect = false;
          that.isAllSelect = false;
        } else {
          e.isSelect = true;
          that.isAllSelect = true;
        }
        return e;
      });
    },
    batchCancel() {
      if (!this.selectNum) {
        return Toast("未选择课程");
      }
      Dialog.confirm({
        title: `确认取消课程${this.selectNum}节`,
        message: "确认取消所选的课程吗？",
        asyncClose: true
      })
        .then(() => {
          setTimeout(() => {
            Dialog.close();
            this.isOperate = false;
            Toast("取消成功");
          }, 1000);
        })
        .catch(() => {
          Dialog.close();
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
.staff_appoint_teamclass {
  .item-wrapper {
    display: flex;
    background-color: #fff;
    .item-left {
      // flex: 0 0 30px;
      padding-left: 10px;
      box-sizing: border-box;
      .icon-wrapper {
        margin-top: 27px;
      }
    }
  }
  .operate-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 40px;
    height: 40px;
    color: #2a82e4;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    justify-content: space-between;
    .left {
      .icon-wrapper {
        display: inline-block;
        margin: 0 15px;
        &.border {
          vertical-align: middle;
        }
      }
      .left-text {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .right {
      // float: right;
      .btn {
        display: inline-block;
        padding: 0 15px;
        border-left: 1rpx solid #fff;
        color: #fff;
        background-color: #2a82e4;
      }
    }
  }
  .icon-wrapper {
    width: 20px;
    height: 20px;
    &.border {
      border: 1rpx solid #eee;
      border-radius: 50%;
    }
    > img {
      width: 100%;
      height: 100%;
    }
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
