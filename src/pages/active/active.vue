<template>
  <!-- <div class="active"> -->
  <div id="memberActiveTab" class="clickTab">
    <!-- <img style="margin-top: 86px;" alt="" src="/assets/img/noActive.png"> -->
    <div class="activeList">
      <div class="activeListMain">
        <div class="activeDetail" v-for="(item, index) in activeList" :key="index" @click="toActiveDetail">
          <div class="activeImg">
            <img alt src="/static/images/banner-1.jpg">
          </div>
          <div class="activeDetailBottom">
            <p class="activeTitle">{{item.title}}</p>
            <p class="activeContent">{{item.storeName}}</p>
          </div>
        </div>
      </div>
      <!-- <div class="active_bottom">
        <div class="dropload-load">
          <span class="loading"></span>加载中...
        </div>
      </div> -->
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {
      activeList: [
        {
          cover: '',
          title: '马戏城店创始会员预定活动',
          storeName: '马戏城店'
        },{
          cover: '',
          title: '马戏城店',
          storeName: '马戏城店'
        }
      ]
    };
  },
  mounted() {},
  methods: {
    toActiveDetail() {
      wx.navigateTo({
        url: "../activeDetail/main"
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

#memberActiveTab {
  .activeList {
    // position: absolute;
    // top: 46px;
    // bottom: 0px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 15px;
    padding-bottom: 50px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .activeListMain {
      .activeDetail {
        width: 100%;
        margin-top: 20px;
        box-shadow: 1px 3px 10px #c5c5c5;
        border-radius: 5px;
        .activeImg {
          border-bottom: 1px solid #eeeeee;
          > img {
            height: 170px;
            width: 100%;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }
        }
      }
      .activeDetailBottom {
        height: 65px;
        .activeTitle {
          font-size: 16px;
          font-weight: bold;
          padding: 10px 5px 5px 10px;
        }
        .activeContent {
          font-size: 15px;
          padding-left: 10px;
          color: #afafaf;
        }
      }
    }
    .active_bottom {
      height: 50px;
      clear: both;
    }
  }
}
</style>
