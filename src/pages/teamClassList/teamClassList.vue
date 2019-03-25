<template>
  <div class="team-class-list">
    <div class="header">
      <select-date @selectWeek="getClassList"></select-date>
      <div class="nav-tab">
        <div class="store" :class="{active: currentNav==1}" @click="selectNav(1)">
          {{curStore}}
          <div class="list-warpper" @click.stop="clickMask">
            <div class="store-nav-list" :class="{slide: showStoreList}">
              <div
                class="store-nav-item"
                v-for="(item, index) in storeNav"
                :key="index"
                @click.stop="selectStore(item)"
              >{{item.storeName}}</div>
            </div>
          </div>
        </div>
        <div class="class" :class="{active: currentNav==2}" @click="selectNav(2)">全部课程</div>
        <div class="time" :class="{active: currentNav==3}" @click="selectNav(3)">全部时间</div>
        <div class="coach" :class="{active: currentNav==4}" @click="selectNav(4)">全部教练</div>
      </div>
    </div>
    <div class="list">
      <team-class-item :info="item" v-for="(item, index)  in classList" :key="index"></team-class-item>
    </div>
    <div class="mask" v-show="maskShow" @click="clickMask"></div>
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
      // 分页的团课
      classList: [],
      // 存储所有的团课
      allClassList: [],
      // 当前选择的门店
      curStore: "全部门店"
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
  computed: {
    maskShow() {
      if (this.showStoreList) {
        return true;
      } else {
        return false;
      }
    }
  },
  onReachBottom() {
    let allLen = this.classList.length;
    let len = this.classList.length;
    if (allLen > 20 && allLen > len) {
      if (allLen - len >= 20) {
        this.classList = this.classList.concat(
          this.classList.slice(len - 1, len + 20)
        );
      } else {
        this.classList = this.classList.concat(
          this.classList.slice(len - 1, allLen - 1)
        );
      }
    }
    console.log("触底刷新");
  },
  methods: {
    selectNav(index) {
      index == 1 ? (this.showStoreList = true) : (this.showStoreList = false);
    },
    selectStore(item) {
      this.showStoreList = false;
      this.curStore = item.storeName || "全部门店";
      this.getClassList("", item.storeId);
    },
    clickMask() {
      this.showStoreList = false;
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
            storeName: "全部门店",
            storeId: ""
          });
          that.storeNav = _storeList;
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
          if (res.data.code === 200) {
            that.allClassList = res.data.data

            if (res.data.data.length > 20) {
              that.classList = res.data.data.slice(0, 20);
            } else {
              that.classList = res.data.data;
            }
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
      .list-warpper {
        position: absolute;
        top: 42px;
        left: 0px;
        width: 100%;
        height: 300px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0);
        z-index: 98;
        .store-nav-list {
          text-align: left;
          max-height: 300px;
          transform: translateY(-100%);
          background-color: #fff;
          overflow-y: auto;
          transition: transform 0.3s;
          &.slide {
            transform: translateY(0px);
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


  