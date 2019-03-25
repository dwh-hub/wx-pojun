<template>
  <div class="coach-list-wrapper">
    <div class="nav-tab">
      <div class="nav-tab-left">
        <div class="store" :class="{active: currentNav==1}" @click="selectNav(1)">
          {{curStore}}
          <div class="list-warpper" :class="{slideWrap: showStoreList}">
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
        <div class="signing" :class="{active: currentNav==2}" @click="selectNav(2)">
          {{curCoachStatus}}
          <div class="list-warpper" :class="{slideWrap: showSigning}" @click.stop="clickMask">
            <div class="store-nav-list" :class="{slide: showSigning}">
              <div class="store-nav-item" @click.stop="selectCoach(1)">全部教练</div>
              <div class="store-nav-item" @click.stop="selectCoach(2)">已签约教练</div>
              <!-- <div class="store-nav-item">未签约</div> -->
            </div>
          </div>
        </div>
        <div class="search" :class="{active: currentNav==3}" @click="selectNav(3)">搜索</div>
      </div>
      <div class="search-wrapper" :class="{'show-search':showSearch}">
        <van-search :value="searchText" show-action @cancel="searchCancel" placeholder="请输入搜索关键词"/>
      </div>
    </div>
    <div class="coach-list">
      <!-- <div class="sub-title">$标题$</div> -->
      <coach-item :info="item" v-for="(item, index) in curCoachList" :key="index"></coach-item>
    </div>
    <div class="mask" v-show="maskShow" @click="clickMask"></div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import coachItem from "COMPS/coachItem.vue";
export default {
  data() {
    return {
      currentNav: 1,
      // 显示门店下拉框
      showStoreList: false,
      // 显示签约列表
      showSigning: false,
      // 显示搜索框
      showSearch: false,
      searchText: "",
      // 分页的所有教练列表
      coachList: [],
      // 储存所有教练的教练列表
      allCoachList: [],
      // 签约教练列表
      signOnCoachList: [],
      storeNav: {},
      // 当前选择的选择门店
      curStore: "全部门店",
      curCoachStatus: "全部",
      curStoreId: "",
      // 当前登录用户的ID
      customerId: "",
      // 当前显示的教练列表
      curCoachList: [],
      // 是否签约 false 全部 true 已签约
      isSingin: false
    };
  },
  components: {
    coachItem
  },
  onLoad() {
    setNavTab("", "#2a82e4");
    this.customerId = wx.getStorageSync("userInfo").id;
  },
  mounted() {
    this.getAllStore();
    // .then(() => {
    //   this.getSingInCoachList();
    // });
  },
  onReachBottom() {
    let allLen = this.allCoachList.length;
    let len = this.coachList.length;
    if (allLen > 20 && allLen > len) {
      if (allLen - len >= 20) {
        this.coachList = this.coachList.concat(
          this.allCoachList.slice(len - 1, len + 20)
        );
      } else {
        this.coachList = this.coachList.concat(
          this.allCoachList.slice(len - 1, allLen - 1)
        );
      }
    }
    this.curCoachList = this.coachList;
    console.log("触底刷新");
  },
  computed: {
    maskShow() {
      if (this.showSigning || this.showStoreList) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    selectNav(index) {
      this.currentNav = index;
      index == 1 ? (this.showStoreList = true) : (this.showStoreList = false);
      index == 2 ? (this.showSigning = true) : (this.showSigning = false);
      index == 3 ? (this.showSearch = true) : (this.showSearch = false);
    },
    searchCancel() {
      this.showSearch = false;
    },
    // 获取全部门店列表
    getAllStore() {
      let that = this;
      return new Promise(function(resolve) {
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
            that.storeNav = _storeList;
            // 默认一个门店的教练列表
            that.selectStore(that.storeNav[0]);
            resolve();
          }
        });
      });
    },
    // 选择门店
    selectStore(item) {
      console.log(this.isSingin)
      this.showStoreList = false;
      this.curStore = item.storeName;
      this.curStoreId = item.storeId;
      if (this.isSingin) {
        this.getSingInCoachList().then(() => {
          this.curCoachList =  this.signOnCoachList
        });
      } else {
        this.getCoachList(item.storeId).then(() => {
          this.curCoachList =  this.coachList
        });
      }
    },
    // 教练签约筛选
    selectCoach(index) {
      this.showSigning = false;
      // index 1 全部 2 已签约
      if (index === 1) {
        this.curCoachStatus = "全部";
        this.isSingin = false;
        this.getCoachList(item.storeId).then(() => {
          this.curCoachList =  this.coachList
        });
      } else if (index === 2) {
        this.curCoachStatus = "已签约";
        this.isSingin = true;
        this.getSingInCoachList().then(() => {
          this.curCoachList =  this.signOnCoachList
        });
      }
    },
    // 获取教练列表
    getCoachList(id) {
      let that = this;
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/customer/register/userofrole",
          data: {
            storeId: id || "",
            positionType: 1
          },
          success(res) {
            that.allCoachList = res.data.data;
            if (res.data.data.length > 20) {
              that.coachList = res.data.data.slice(0, 20);
            } else {
              that.coachList = res.data.data;
            }
            resolve();
          }
        });
      });
    },
    // 获取签约教练
    getSingInCoachList() {
      let that = this;
      return new Promise(function(resolve, reject) {
        HttpRequest({
          url: window.api + "/customer/card/selectSignOnCoach",
          data: {
            storeId: that.curStoreId,
            customerId: that.customerId
          },
          success(res) {
            // console.log(res.data.data);
            that.signOnCoachList = res.data.data;
            resolve();
          }
        });
      });
    },
    clickMask() {
      this.showStoreList = false;
      this.showSigning = false;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

page {
  background-color: #f5f5f5;
}
.coach-list-wrapper {
  .nav-tab {
    position: relative;
    margin-bottom: 8px;
    background-color: #fff;
    .nav-tab-left {
      display: flex;
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
    }
    .search-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      transform: translateX(-100%);
      transition: transform 0.3s;
      background-color: #fff;
      &.show-search {
        transform: translateX(0px);
      }
      ._van-search {
        width: 100%;
      }
    }
    .list-warpper {
      position: absolute;
      top: 42px;
      left: 0px;
      width: 100%;
      height: 0px;
      overflow: hidden;
      transition: height 0.3s;
      background-color: rgba(0, 0, 0, 0);
      z-index: 98;
      &.slideWrap {
        height: 300px;
      }
      .store-nav-list {
        text-align: left;
        max-height: 300px;
        transform: translateY(-100%);
        overflow-y: auto;
        transition: transform 0.3s;
        background-color: #fff;
        &.slide {
          // z-index: 98;
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
  .coach-list {
    padding: 0 10px;
    .sub-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .coach-item {
      margin-bottom: 10px;
    }
  }
  .mask {
    position: fixed;
    top: 42px;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 97;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>

