<template>
  <div class="coach-list-wrapper">
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
      <div class="Signing" :class="{active: currentNav==2}" @click="selectSigning">是否签约</div>
      <div class="search" :class="{active: currentNav==3}" @click="selectSearch">搜索</div>
    </div>
    <div class="coach-list">
      <!-- <div class="sub-title">$标题$</div> -->
      <coach-item :info="item" v-for="(item, index) in coachList" :key="index"></coach-item>
    </div>
    <div class="mask" v-show="showStoreList" @click="showStoreList = false"></div>
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
      coachList: [],
      storeNav: {},
      // 当前选择的选择门店
      curStore: "全部门店",
      curStoreId: "",
      // 当前登录用户的ID
      customerId: ""
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
    this.getAllStore().then(() => {
      this.getSingInCoachList();
    });
  },
  methods: {
    selectAllStore() {
      this.currentNav = 1;
      this.showStoreList = true;
    },
    // 获取全部门店
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
    // 签约
    selectSigning() {
      this.currentNav = 2;
    },
    // 搜索
    selectSearch() {
      this.currentNav = 3;
    },
    // 选择门店
    selectStore(item) {
      this.showStoreList = false;
      this.getCoachList(item.storeId);
      this.curStore = item.storeName;
      this.curStoreId = item.storeId;
      console.log(item);
      console.log(this.curStoreId);
    },
    // 获取教练列表
    getCoachList(id) {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/register/userofrole",
        data: {
          storeId: id || "",
          positionType: 1
        },
        success(res) {
          // TODO: 暂未分页
          if (res.data.data.length > 20) {
            that.coachList = res.data.data.slice(0, 20);
          }
          that.coachList = res.data.data;
        }
      });
    },
    // 获取签约教练
    getSingInCoachList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/card/selectSignOnCoach",
        data: {
          storeId: that.curStoreId,
          customerId: that.customerId
        },
        success(res) {
          console.log(res.data.data);
        }
      });
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
    display: flex;
    position: relative;
    margin-bottom: 8px;
    background-color: #fff;
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
  .coach-list {
    padding: 0 10px;
    .sub-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .coach-item {
      margin-bottom: 20px;
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

