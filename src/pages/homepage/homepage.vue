<template>
 <!-- @touchstart="touchStart" @touchend="touchEnd" -->
  <div class="homepage">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="rgba(0, 0, 0, .3)"
      indicator-active-color="rgba(0, 0, 0, .6)"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in 3" :key="index">
        <swiper-item>
          <!-- <img :src="item" class="banner"> -->
          <img class="banner" src="/static/images/banner-1.jpg">
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
    </div> -->
    <div class="tab-list">
      <div class="tab-item">
        <img src="/static/images/user.png" alt="">
        <div class="text">团课</div>
      </div>
      <div class="tab-item">
        <img src="/static/images/user.png" alt="">
        <div class="text">私教</div>
      </div>
      <div class="tab-item">
        <img src="/static/images/user.png" alt="">
        <div class="text">会员卡</div>
      </div>
      <div class="tab-item">
        <img src="/static/images/user.png" alt="">
        <div class="text">公告</div>
      </div>
    </div>
    <div class="nearby-store-wrapper">
      <title-cell title="附近的店" moreText="全部门店" :moreSize="14" :titleSize="18"></title-cell>
      <div class="store-wrapper">
        <div class="nearby-store" v-for="(item, index) in 2" :key="index">
          <div class="cover">
            <img>
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
      <team-class-item></team-class-item>
      <coach-item></coach-item>
    </div>
  </div>
</template>

<script>
import setNavTab from 'COMMON/js/common.js'
import titleCell from 'COMPS/titleCell.vue'
import teamClassItem from 'COMPS/teamClassItem.vue'
import coachItem from 'COMPS/coachItem.vue'

export default {
  data() {
    return {
      bannerArr: ["https://www.pojun-tech.com/assets/img/morenImg.jpg"],
      storeList: [
        {
          imgPath: "1",
          storeName: "思明店",
          phoneNum: "18894562567",
          address: "思明区群鸿商业城28号58号楼"
        },
        {
          imgPath: "2",
          storeName: "骏景店",
          phoneNum: "0595-68973238",
          address: "港塘路94-96号鼎盛骏景小区会所"
        },
        {
          imgPath: "3",
          storeName: "思明店",
          phoneNum: "18894562567",
          address: "思明区群鸿商业城28号58号楼"
        },
        {
          imgPath: "1",
          storeName: "思明店",
          phoneNum: "18894562567",
          address: "思明区群鸿商业城28号58号楼"
        },
        {
          imgPath: "2",
          storeName: "骏景店",
          phoneNum: "0595-68973238",
          address: "港塘路94-96号鼎盛骏景小区会所"
        },
        {
          imgPath: "3",
          storeName: "思明店",
          phoneNum: "18894562567",
          address: "思明区群鸿商业城28号58号楼"
        }
      ],
      touch: {
        x: "",
        y: ""
      }
    };
  },
  components: {
    titleCell,
    teamClassItem,
    coachItem
  },
  mounted() {
  },
  onLoad() {
    setNavTab('前锋体育', '#2a82e4');
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh;
    }, 2000);
  },
  methods: {
    toStoreDetail() {
      wx.navigateTo({
        url: "../storeDetail/main"
      });
    },
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
    padding-top: 20px;
    padding-bottom: 5px;
    .border-1px(#eee, bottom);
    .tab-item {
      flex: 1;
      text-align: center;
      >img {
        width: 32px;
        height: 32px;
      }
      .text {
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
  .nearby-store-wrapper {
    padding: 0 15px;
    .border-1px(#eee, bottom);
    .title-cell,
    .title {
      font-weight: bold;
    }
    .store-wrapper {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      .nearby-store {
        flex:  0 0 48%;
        width: 96%;
        .cover {
          width: 100%;
          >img {
            width: 100%;
            height: 90px;
            background-color: #bfbfbf;
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
            color: #2a82e4;
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
