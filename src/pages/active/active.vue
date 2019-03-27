<template>
  <div class="active">
    <div class="active-item" v-for="(item, index) in activeList" :key="index" @click="toActiveDetail">
      <div class="active-cover">
        <!-- TODO: :src="info.cover" -->
        <img>
      </div>
      <div class="active-info">
        <div class="active-top">
          <span class="active-name">{{item.title}}</span>
        </div>
        <div class="active-bottom">{{item.storeName || '暂无地址'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {setNavTab,window,HttpRequest} from 'COMMON/js/common.js'
export default {
  data() {
    return {
      activeList: [
        {
          cover: "",
          title: "马戏城店创始会员预定活动",
          storeName: "马戏城店"
        },
        {
          cover: "",
          title: "马戏城店",
          storeName: "马戏城店"
        }
      ],
      page: 1,
    };
  },
  mounted() {
    this.getActiveList()
  },
  onLoad() {
    setNavTab();
  },
  methods: {
    toActiveDetail() {
      wx.navigateTo({
        url: "../activeDetail/main"
      });
    },
    // 获取活动详情
    getActiveList() {
      let that = this
      HttpRequest({
        url: window.api+ '/wxmarketing/pages',
        data:{
          page: that.page,
          pageSize: 15
        },
        success(res) {
          if(res.data.code === 200){
            that.activeList = res.data.data.result
          }
        }
      })
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

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
      padding: 10px 10px 10px 10px;
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
  }
}
</style>
