<template>
  <!-- @touchstart="touchStart" @touchend="touchEnd" -->
  <div class="homepage">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      indicator-active-color="rgba(74, 134, 232, 1)"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in bannerList" :key="index">
        <swiper-item>
          <!-- <img :src="item" class="banner"> -->
          <img
            class="banner"
            src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg"
          >
        </swiper-item>
      </div>
    </swiper>
    <!-- <div class="company">
      <div class="company-cover">
        <img src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png" alt>
      </div>
      <div class="company-detail">
        <div class="company-title">破军科技</div>
        <div class="company-text">在更好的为会员服务的道路上越走越远。</div>
      </div>
    </div>-->
    <div class="tab-list">
      <div class="tab-item" @click="toNav('../teamClassList/main')">
        <img src="/static/images/icon-team.png" alt>
        <div class="text">团课</div>
      </div>
      <div class="tab-item" @click="toNav('../coachList/main')">
        <img src="/static/images/icon-team.png" alt>
        <div class="text">私教</div>
      </div>
      <div class="tab-item" @click="toNav('../memberCard/main')">
        <img src="/static/images/icon-member.png" alt>
        <div class="text">会员卡</div>
      </div>
      <div class="tab-item">
        <img src="/static/images/icon-notice.png" alt>
        <div class="text">公告</div>
      </div>
    </div>
    <div class="nearby-store-wrapper">
      <title-cell
        title="附近的店"
        moreText="全部门店"
        :moreSize="14"
        :titleSize="18"
        @tapMore="toNav('../allStore/main')"
      ></title-cell>
      <div class="store-wrapper">
        <div class="nearby-store" v-for="(item, index) in 2" :key="index">
          <!-- @click="toNav('../storeDetail/main')" -->
          <div class="cover">
            <img src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg">
          </div>
          <div class="nearby-bottom">
            <span class="name">$推荐店名$</span>
            <span class="range">$距离KM$</span>
          </div>
        </div>
      </div>
    </div>
    <div class="recommend-wrapper">
      <title-cell title="为你推荐" :titleSize="18"></title-cell>
      <team-class-item :info="recommendClass" v-if="recommendClass.anotherName"></team-class-item>
      <coach-item :info="recommendCoach" v-if="recommendCoach.userName"></coach-item>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";
import store from "../../utils/store";

export default {
  data() {
    return {
      bannerArr: ["https://www.pojun-tech.com/assets/img/morenImg.jpg"],
      storeList: [],
      // touch: {
      //   x: "",
      //   y: ""
      // }
      longitude: "", // 经度
      latitude: "", // 维度
      bannerList: [],
      recommendCoach: {},
      recommendClass: {}
    };
  },
  components: {
    titleCell,
    teamClassItem,
    coachItem
  },
  mounted() {
    let that = this;
    wx.getLocation({
      type: "wgs84",
      success(res) {
        console.log('经度:'+ res.longitude)
        console.log('维度:'+ res.latitude)
        that.latitude = res.latitude;
        that.longitude = res.longitude;
      }
    });
    this.getBannerList();
    this.getRecommendCoach();
    this.getRecommendClass()
  },
  onLoad() {
    setNavTab("前锋体育");
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh;
    }, 2000);
  },
  methods: {
    toNav(url) {
      if(url.indexOf('memberCard') > -1 && !store.state.isLogin) {
        return wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000
        })
      }
      wx.navigateTo({
        url: url
      });
    },
    // 获取轮播图
    getBannerList() {
      let that = this;
      wx.request({
        url: window.api + "/system/set/wxcompanyinfo",
        data: {
          companyId: ""
        },
        success(res) {
          if (res.data.code === 200) {
            that.bannerList = res.data.data.wxCarousel.split(",").map(e => {
              return (e = window.api + e);
            });
            console.log(that.bannerList);
          }
        }
      });
    },
    //　推荐团课
    getRecommendClass() {
      let that = this
      HttpRequest({
        url: window.api + '/teamClass/schedule/recommend',
        data: {
          storeId: '',
        },
        success(res) {
          if(res.data.code == 200) {
            that.recommendClass = res.data.data
          }
        }
      })
    },
    // 推荐教练
    getRecommendCoach() {
      let that = this;
      HttpRequest({
        url: window.api + "/coach/private/appoint/recommend",
        success(res) {
          if (res.data.code == 200) {
            let _data = res.data.data;
            that.recommendCoach = {
              userName: _data.coachName,
              userId: _data.coachId
            };
          }
        }
      });
    }
    // touchStart(e) {
    //   // console.log(e)
    //   this.touch.x = e.clientX;
    //   this.touch.y = e.clientY;
    // },
    // touchEnd(e) {
    //   // console.log(e)
    //   let x = e.mp.changedTouches[0].clientX;
    //   let y = e.mp.changedTouches[0].clientY;
    //   this.getTouchData(x, y, this.touch.x, this.touch.y);
    // },
    // getTouchData(endX, endY, startX, startY) {
    //   let turn = "";
    //   if (endX - startX > 50 && Math.abs(endY - startY) < 50) {
    //     //右滑
    //     turn = "right";
    //   } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {
    //     //左滑
    //     turn = "left";
    //   }
    //   console.log("turn:" + turn);
    //   if (turn == "right") {
    //     console.log("右滑");
    //   }
    //   // return turn;
    // }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
@import "~COMMON/less/common.less";
page{background-color: #f6f6f6;height: 100%;}
.homepage {
  padding-bottom: 20px;
  background-color: #f6f6f6;
  .swiper {
    height: 180px;
  }
  .banner {
    width: 100%;
    height: 100%;
  }
  .tab-list {
    display: flex;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1rpx solid #eee;
    .tab-item {
      flex: 1;
      text-align: center;
      > img {
        width: 20px;
        height: 20px;
        padding: 10px;
        background-color: @theme-color;
        border-radius: 50%;
      }
      .text {
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
  .nearby-store-wrapper {
    padding: 0 15px;
    // .border-1px(#eee, bottom);
    border-bottom: 1rpx solid #eee;
    .title-cell,
    .title {
      font-weight: bold;
    }
    .store-wrapper {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      .nearby-store {
        flex: 0 0 48%;
        width: 96%;
        .cover {
          width: 100%;
          > img {
            width: 100%;
            height: 90px;
            background-color: #eee;
            border-radius: 5px;
          }
        }
        .nearby-bottom {
          padding-top: 10px;
          .name {
            font-size: 15px;
            margin-right: 5px;
            color: #505050;
          }
          .range {
            font-size: 12px;
            color: @theme-color;
          }
        }
      }
    }
  }
  .recommend-wrapper {
    padding: 0 15px;
    .title-cell,
    .title {
      font-weight: bold;
    }
    .team-class-item {
      margin-bottom: 20px;
    }
  }
}
</style>
