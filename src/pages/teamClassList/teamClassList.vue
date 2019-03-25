<template>
  <div class="team-class-list">
    <div class="header">
      <select-date @selectWeek="getClassList"></select-date>
      <div class="nav-tab">
        <div class="store" :class="{active: currentNav==1}" @click="selectNav(1)">
          {{curStore}}
          <div class="list-warpper" :class="{slideWrap: showStoreNav}" @click.stop="clickMask">
            <div class="store-nav-list" :class="{slide: showStoreNav}">
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
        <div class="coach" :class="{active: currentNav==4}" @click="selectNav(4)">
          全部教练
          <div class="list-warpper" :class="{slideWrap: showCoachNav}" @click.stop="clickMask">
            <div class="store-nav-list" :class="{slide: showCoachNav}">
              <div
                class="store-nav-item"
                v-for="(item, index) in coachNav"
                :key="index"
                @click.stop="selectCoach(item)"
              >{{item.userName}}</div>
            </div>
          </div>
        </div>
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
      showStoreNav: false,
      showCoachNav: false,
      // nav团课列表
      storeNav: [],
      // nav教练列表
      coachNav: [],
      // 分页的团课
      classList: [],
      // 存储所有的团课
      allClassList: [],
      // 当前选择的门店
      curStoreId: "",
      // 当前选择的教练id
      curCoachId: "",
      // 当前选择的日期
      curDate: "",
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
    this.curDate = formatDate(new Date(), "yyyy-MM-dd");
    this.getAllStore();
    this.getClassList();
    this.getCoachList();
  },
  computed: {
    maskShow() {
      if (this.showStoreNav || this.showCoachNav) {
        return true;
      } else {
        return false;
      }
    }
  },
  // 触底刷新
  onReachBottom() {
    let allLen = this.allClassList.length;
    let len = this.classList.length;
    if (allLen > 20 && allLen > len) {
      if (allLen - len >= 20) {
        this.classList = this.classList.concat(
          this.allClassList.slice(len - 1, len + 20)
        );
      } else {
        this.classList = this.classList.concat(
          this.allClassList.slice(len - 1, allLen - 1)
        );
      }
    }
  },
  methods: {
    selectNav(index) {
      this.currentNav = index;
      if (index == 4 && this.curStoreId == "") {
        return wx.showToast({
          title: "请先选择门店",
          icon: "none",
          duration: 1000
        });
      }
      index == 1 ? (this.showStoreNav = true) : (this.showStoreNav = false);
      index == 4 ? (this.showCoachNav = true) : (this.showCoachNav = false);
    },
    // 选择门店
    selectStore(item) {
      this.showStoreNav = false;
      this.curStoreId = item.storeId;
      this.curStore = item.storeName || "全部门店";
      this.getClassList();
      this.getCoachList();
    },
    // 选择教练
    selectCoach(item) {
      this.curCoachId = item.userId
      this.getClassList();
    },
    clickMask() {
      this.showStoreNav = false;
      this.showCoachNav = false;
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
    // 获取团课列表
    getClassList(date) {
      if (date) {
        this.curDate = date;
      }
      wx.showLoading({
        title: "加载中"
      });
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/weekView",
        methods: "POST",
        data: {
          coachId: that.curCoachId,
          storeId: that.curStoreId,
          calendarStart: that.curDate,
          calendarEnd: that.curDate
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code === 200) {
            that.allClassList = res.data.data;
            if (res.data.data.length > 20) {
              that.classList = res.data.data.slice(0, 20);
            } else {
              that.classList = res.data.data;
            }
          }
        }
      });
    },
    // 获取教练列表
    getCoachList() {
      let that = this;
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/customer/register/userofrole",
          data: {
            storeId: that.curStoreId,
            positionType: 1
          },
          success(res) {
            that.coachNav = res.data.data;
            if(!res.data.data.length) {
              that.coachNav = that.coachNav.concat({
                userName: '无'
              })
            }
            resolve();
          }
        });
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
        height: 0px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0);
        transition: height 0.3s;
        z-index: 98;
        &.slideWrap {
          height: 300px;
        }
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


  