<template>
  <div class="active">
    <div
      class="active-item"
      v-for="(item, index) in activeList"
      :key="index"
      @click="toActiveDetail(item)"
    >
      <div v-if="item.markId">
        <div class="active-cover">
          <img :src="window.api + item.thumbUrl">
        </div>
        <div class="active-info clearfix">
          <div class="active-detail-left">
            <div class="active-top">
              <span class="active-name">{{item.title}}</span>
            </div>
            <div class="active-bottom">{{item.storeName || '暂无地址'}}</div>
          </div>
          <div class="active-detail">
            <div>报名日期:{{item.addTime}}</div>
            <div>报名人数:{{item.entryNum}}人</div>
            <div>总金额:{{item.totalPay || 0}}元</div>
          </div>
        </div>
      </div>
      <div class="active-skeleton" v-else>
        <div class="active-cover"></div>
        <div class="active-info clearfix">
          <div class="active-top"></div>
          <div class="active-bottom"></div>
        </div>
      </div>
    </div>
    <!-- <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading"/>
    </div>-->
    <none-result v-if="isNoneResult" text="暂无活动"></none-result>
    <page-footer v-if="!isNoneResult"></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import noneResult from "COMPS/noneResult.vue";
import pageFooter from "COMPS/pageFooter.vue";
export default {
  data() {
    return {
      activeList: [{}, {}, {}],
      page: 1,
      companyId: "",
      // isLoading: false,
      isNoneResult: false
    };
  },
  mounted() {
    // if (wx.getStorageSync("userInfo")) {
    //   this.companyId = wx.getStorageSync("userInfo").companyId;
    // }
    setNavTab();
    this.companyId = wx.getStorageSync("companyId");
    this.getActiveList();
    //
  },
  components: {
    noneResult,
    pageFooter
  },
  computed: {
    window() {
      return window;
    }
  },
  onReachBottom() {
    this.getActiveList();
  },
  onPullDownRefresh() {
    this.activeList = [{}, {}, {}];
    this.page = 1;
    this.getActiveList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    toActiveDetail(item) {
      wx.navigateTo({
        url: "../activeDetail/main?markId=" + item.markId
      });
    },
    // 获取活动列表
    getActiveList() {
      // this.isLoading = false;
      let that = this;
      HttpRequest({
        url: window.api + "/wxmarketing/pagesAndEntryInfo",
        data: {
          page: that.page,
          companyId: that.companyId
        },
        success(res) {
          // that.isLoading = false;
          if (that.page == 1) {
            that.activeList = [];
          }
          if (res.data.code === 200) {
            let _data = res.data.data.result;
            if (!_data.length) {
              if (that.page == 1) {
                return (that.isNoneResult = true);
              }
              return;
            }
            _data.forEach(e => {
              e.addTime = e.addTime.substr(0, 13) + "点";
            });
            that.activeList = that.activeList.concat(_data);
            that.page++;
          } else {
            that.isNoneResult = true;
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
@import "~COMMON/less/common.less";

// .active {
//   box-sizing: border-box;
//   width: 100%;
//   height: 100%;
//   padding: 0 15px;
//   padding-bottom: 50px;
//   overflow-y: auto;
//   .activ-item {
//     width: 100%;
//     margin-top: 20px;
//     box-shadow: 1px 3px 10px #c5c5c5;
//     .activeImg {
//       > img {
//         height: 170px;
//         width: 100%;
//         border-top-left-radius: 3px;
//         border-top-right-radius: 3px;
//       }
//     }
//   }
//   .activeDetailBottom {
//     // height: 65px;
//     .activeTitle {
//       font-size: 16px;
//       font-weight: bold;
//       padding: 10px 5px 5px 10px;
//     }
//     .activeContent {
//       font-size: 15px;
//       padding-left: 10px;
//       padding-bottom: 5px;
//       color: #afafaf;
//     }
//   }

//   .active_bottom {
//     height: 50px;
//     clear: both;
//   }
// }
.active {
  padding: 15px;
  .active-item {
    background-color: #fff;
    border-radius: 2px;
    margin-bottom: 20px;
    box-shadow: 0px 2px 10px #ccc;
    .active-cover {
      width: 100%;
      height: 140px;
      > img {
        width: 100%;
        height: 100%;
        background-color: #ccc;
      }
    }
    .active-info {
      padding: 10px;
      padding-right: 0px;
      box-sizing: border-box;
      display: flex;
      .active-detail-left {
        flex: 1;
        overflow: hidden;
        word-break: break-all;
        // flex-basis: auto;
        .active-top {
          margin-bottom: 8px;
          .active-name {
            font-size: 16px;
            color: #333;
            font-weight: bold;
          }
        }
        .active-bottom {
          font-size: 14px;
          color: #bababa;
        }
      }
      .active-detail {
        flex: 0 0 160px;
        font-size: 0px;
        // flex-basis: auto;
        > div {
          font-size: 12px;
        }
      }
    }
  }
  .active-skeleton {
    .active-cover,
    .active-top,
    .active-bottom {
      background-color: #eee;
    }
    .active-info {
      display: block;
    }
    .active-top {
      height: 18px;
      width: 240px;
    }
    .active-bottom {
      margin-top: 10px;
      height: 14px;
      width: 120px;
    }
  }
}
</style>
