<template>
  <div class="team-class-list">
    <div class="header">
      <div class="select-date-wrapper">
        <select-date @selectWeek="getClassList"></select-date>
      </div>
      <div class="nav-tab">
        <div class="nav-item" v-for="(item,index) in nav" :key="index" @click="selectNav(index)">
          <span v-show="currentNav!=index">{{item.navTitle}}</span>
          <span v-show="currentNav==index" :style="{color: window.color}">{{item.navTitle}}</span>
          <i class="triangle-icon"></i>
          <div
            class="list-warpper"
            :class="{slideWrap: (showSlideList && currentNav==index)}"
            @click.stop="clickMask"
          >
            <div class="store-nav-list" :class="{slide: (showSlideList && currentNav==index)}">
              <div
                class="store-nav-item"
                v-for="(itemS, indexS) in item.children"
                :key="indexS"
                @click.stop="clickSonNav(index,itemS,item)"
              >
                <span>{{itemS.sonText}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <team-class-item :info="item" v-for="(item, index)  in classList" :key="index"></team-class-item>
      <none-result v-if="!classList.length"></none-result>
    </div>
    <div class="mask" v-show="maskShow" @click="clickMask"></div>
    <page-footer v-if="classList.length"></page-footer>
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
import noneResult from "COMPS/noneResult";
import pageFooter from "COMPS/pageFooter.vue"
import colorMixin from "COMPS/colorMixin.vue"
export default {
  data() {
    return {
      currentNav: 0,
      nav: [{
        navTitle: "全部门店",
        children: [],
        action: (item) => {
          this.selectStore(item);
        }
      },{
        navTitle: "全部教练",
        children: [],
        action: (item) => {
          this.selectCoach(item);
        }
      },{
        navTitle: "全部课程",
        children: [],
        action: (item) => {
          this.selectSchedule(item);
        }
      }],
      showSlideList: false,
      maskShow: false,
      // 分页的团课
      classList: [{},{},{},{},{}],
      // 存储所有的团课
      allClassList: [],
      // 当前选择的门店
      curStoreId: "",
      // 当前选择的教练id
      curCoachId: "",
      // 当前选择的日期
      curDate: "",
      companyId: ""
    };
  },
  mixins:[colorMixin],
  components: {
    teamClassItem,
    selectDate,
    noneResult,
    pageFooter
  },
  mounted() {
    setNavTab();
    this.curDate = formatDate(new Date(), "yyyy-MM-dd");
    this.companyId = wx.getStorageSync("companyId");
    this.getAllStore();
    this.getClassList();
  },
  computed: {
    window() {
      return window;
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
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    selectNav(index) {
      if(this.currentNav == index && this.showSlideList) {
        this.maskShow = false
        this.showSlideList = false
        return;
      }
      if ((index == 2 || index == 1) && this.curStoreId == "") {
        return wx.showToast({
          title: "请先选择门店",
          icon: "none",
          duration: 1000
        });
      }
      if(index == 2 && !this.nav[2].children.length) {
        return wx.showToast({
          title: "暂无课程类别",
          icon: "none",
          duration: 1000
        });
      }
      if(index == 1 && !this.nav[1].children.length) {
        return wx.showToast({
          title: "暂无私教",
          icon: "none",
          duration: 1000
        });
      }
      this.currentNav = index;
      this.maskShow = true;
      this.showSlideList = true;
    },
    // 选择门店
    selectStore(item) {
      this.curStoreId = item.storeId;
      if (item.storeName == "全部门店") {
        this.nav[1].navTitle = "全部教练"
        this.curCoachId = "";
        this.nav[2].navTitle = "全部课程";
      }
      this.getClassList();
      this.getCoachList();
      this.getTeamSchedule();
    },
    // 选择教练
    selectCoach(item) {
      this.curCoachId = item.userId;
      this.getClassList();
    },
    // 选择课程
    selectSchedule(item) {
      this.getClassList();
    },
    clickSonNav(index, item, itemF) {
      this.nav[index].navTitle = item.sonText;
      this.maskShow = false;
      this.showSlideList = false;
      if (itemF.action) {
        itemF.action(item);
      }
    },
    clickMask() {
      this.maskShow = false;
      this.showSlideList = false;
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
              sonText: e.storeName,
              storeName: e.storeName,
              storeId: e.storeId
            };
          });
          _storeList.unshift({
            storeName: "全部门店",
            sonText: "全部门店",
            storeId: ""
          });
          that.nav[0].children = _storeList
        }
      });
    },
    // 获取团课列表
    getClassList(date) {
      this.classList = [{}, {}, {}, {},{}];
      if (date) {
        this.curDate = date;
      }
      // wx.showLoading({
      //   title: "加载中"
      // });
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/weekView",
        methods: "POST",
        data: {
          companyId: that.companyId,
          coachId: that.curCoachId,
          storeId: that.curStoreId,
          calendarStart: that.curDate,
          calendarEnd: that.curDate,
          courseTitle: that.nav[2].navTitle == "全部课程" ? "" : that.nav[2].navTitle
        },
        success(res) {
          // wx.hideLoading();
          // setTimeout(() => {
          if (res.data.code === 200) {
            that.allClassList = res.data.data;
            if (res.data.data.length > 20) {
              that.classList = res.data.data.slice(0, 20);
            } else {
              that.classList = res.data.data;
            }
          } else {
            that.classList = [];
          }
          // },2000)
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
            resolve();
            if (!res.data.data.length) {
              // return (that.coachNav = that.coachNav.concat({
              //   userName: "无"
              // }));
              return that.nav[1].children = []
            }
            let _list = res.data.data;
            _list.unshift({
              userName: "全部教练",
              userId: ""
            });
            that.nav[1].children = _list.map(e => {
              e.sonText = e.userName
              return e
            })
          }
        });
      });
    },
    // 获取课程
    getTeamSchedule() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/pagesNoLimit",
        data: {
          storeId: that.curStoreId
        },
        success(res) {
          if (res.data.code === 200) {
            let _list = res.data.data.result;
            let _classList = [];
            _list.forEach(e => {
              for (let k = 0; k < _classList.length; k++) {
                if ((_classList[k] = e)) {
                  return;
                }
              }
              _classList.push(e);
            });
            _classList.unshift({
              courseTitle: "全部课程"
            });
            that.nav[2].children = _classList.map(e => {
              e.sonText = e.courseTitle
              return e
            })
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
  padding-top: 120px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: 98;
    background-color: #fff;
    .select-date-wrapper {
      padding: 10px;
    }
    .nav-tab {
      display: flex;
      position: relative;
      .triangle-icon {
        width: 10px;
        height: 10px;
        display: inline-block;
        vertical-align: middle;
        background-size: 100%;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTU0ODg1MDMwOTQ5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxODgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMS45OTk0ODggODE5LjQxMzQ2MiA3Mi44Mzc0IDIwNC41ODY1MzggOTUxLjE2MjYgMjA0LjU4NjUzOFoiIHAtaWQ9IjIxODkiIGZpbGw9IiM5OTk5OTkiPjwvcGF0aD48L3N2Zz4=");
        transition: transform 0.3s;
        &.active {
          transform: rotate(-180deg);
        }
      }
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
            > img {
              margin-right: 10px;
              width: 36px;
              height: 36px;
              background-color: #eee;
              border-radius: 50%;
            }
            > span {
              display: inline-block;
              vertical-align: middle;
            }
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


  