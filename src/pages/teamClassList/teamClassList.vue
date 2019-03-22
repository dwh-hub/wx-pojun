<template>
  <div class="team-class-list">
    <div class="header">
      <select-date @selectWeek="getClassList"></select-date>
      <div class="nav-tab">
        <div class="store" :class="{active: currentNav==1}" @click="selectAllStore">
          {{curStore}}
          <div class="store-nav-list" v-show="showStoreList" :class="{slide: showStoreList}">
            <div
              class="store-nav-item"
              v-for="(item, index) in storeNav"
              :key="index"
              @click.stop="selectStore(item)"
            >{{item.storeName}}</div>
          </div>
        </div>
        <div class="class" :class="{active: currentNav==2}" @click="selectAllClass">全部课程</div>
        <div class="time" :class="{active: currentNav==3}" @click="selectAllTime">全部时间</div>
        <div class="coach" :class="{active: currentNav==4}" @click="selectAllCoach">全部教练</div>
      </div>
    </div>
    <div class="list">
      <team-class-item :info="item" v-for="(item, index)  in classList" :key="index"></team-class-item>
    </div>
    <div class="mask" v-show="showStoreList" @click="showStoreList = false"></div>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import teamClassItem from "COMPS/teamClassItem";
import selectDate from "COMPS/selectDate";
export default {
  data() {
    return {
      currentNav: 1,
      showStoreList: false,
      storeNav: [],
      classList: [],
      // 当前选择的门店
      curStore: '全部门店'
    };
  },
  onLoad() {
    setNavTab("", "#2a82e4");
  },
  components: {
    teamClassItem,
    selectDate
  },
  mounted() {
    this.getAllStore();
    this.getClassList();
  },
  methods: {
    selectAllStore() {
      this.currentNav = 1;
      this.showStoreList = true;
    },
    selectStore(item) {
      this.showStoreList = false;
      this.curStore = item.storeName
      this.getClassList("", item.storeId);
    },
    selectAllClass() {
      this.currentNav = 2;
    },
    selectAllTime() {
      this.currentNav = 3;
    },
    selectAllCoach() {
      this.currentNav = 4;
    },
    // 获取全部门店
    getAllStore() {
      let that = this;
      wx.request({
        url: window.api + "/store/all-store-name-list-nolimit",
        data: {
          companyId: that.companyId || ""
        },
        success(res) {
          let _storeList = [];
          _storeList = res.data.data.map(e => {
            return {
              storeName: e.storeName,
              storeId: e.storeId
            };
          });
          _storeList.push({
            storeName: '全部门店',
            storeId: ''
          })
          that.storeNav = _storeList
          console.log(that.storeNav);
        }
      });
    },
    getClassList(date, id) {
      wx.showLoading({
        title: "加载中"
      });
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/weekView",
        methods: "POST",
        data: {
          storeId: id || "",
          calendarStart: date || formatDate(new Date(), "yyyy-MM-dd"),
          calendarEnd: date || ""
        },
        success(res) {
          wx.hideLoading();
          // TODO: 暂未分页
          if (res.data.code === 200) {
            if (res.data.data.length > 20) {
              that.classList = res.data.data.slice(0, 20);
            }
            that.classList = res.data.data;
            console.log(that.classList);
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.team-class-list {
  .header {
    .nav-tab {
      display: flex;
      position: relative;
      > div {
        flex: 1;
        line-height: 42px;
        text-align: center;
        border-top: 1rpx solid #eee;
        border-bottom: 1rpx solid #eee;
        border-right: 1rpx solid #eee;
        &:nth-last-of-type(1) {
          border-right: none;
        }
        &.active {
          color: @theme-color;
        }
      }
      .store-nav-list {
        position: absolute;
        top: 42px;
        left: 0px;
        width: 100%;
        text-align: left;
        max-height: 300px;
        background-color: #fff;
        overflow-y: auto;
        z-index: 98;
        &.slide {
          z-index: 98;
        }
        .store-nav-item {
          line-height: 50px;
          padding-left: 20px;
          border-top: 1rpx solid #eee;
          &.active {
            color: @theme-color;
          }
        }
      }
    }
  }
  .list {
    padding: 15px;
    .team-class-item {
      margin-bottom: 15px;
    }
  }
  .mask {
    position: fixed;
    top: 120px;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 97;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>


  