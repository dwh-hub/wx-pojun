<template>
  <div class="homepage" @touchstart="touchStart" @touchend="touchEnd">
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
    <div class="company">
      <div class="company-cover">
        <img src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png" alt>
      </div>
      <div class="company-detail">
        <div class="company-title">破军科技</div>
        <div class="company-text">在更好的为会员服务的道路上越走越远。</div>
      </div>
    </div>
    <!-- <div class="store-list">
      <div class="all-store">全部门店</div>
    </div>-->
    <!-- <navigator open-type="exit" target="miniProgram">关闭按钮</navigator> -->
    <div class="more_Company">
      <div class="moreCompanyBlue"></div>
      <p class="more_CompanyTitle">全部门店</p>
      <div class="moreCompany_list">
        <div
          class="moreCompany_detail"
          v-for="(item, index) in storeList"
          :key="index"
          @click="toStoreDetail"
        >
          <div class="pl moreCompanyImg_div">
            <img id="store_img" src="/static/images/banner-1.jpg">
          </div>
          <div class="pl moreCompany_text">
            <div class="moreCompany_title">{{item.storeName}}</div>
            <div>电话：{{item.phoneNum}}</div>
            <div>地址：{{item.address}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  mounted() {},
  onLoad() {},
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
    touchStart(e) {
      // console.log(e)
      this.touch.x = e.clientX;
      this.touch.y = e.clientY;
    },
    touchEnd(e) {
      // console.log(e)
      let x = e.mp.changedTouches[0].clientX;
      let y = e.mp.changedTouches[0].clientY;
      this.getTouchData(x, y, this.touch.x, this.touch.y);
    },
    getTouchData(endX, endY, startX, startY) {
      let turn = "";
      if (endX - startX > 50 && Math.abs(endY - startY) < 50) {
        //右滑
        turn = "right";
      } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {
        //左滑
        turn = "left";
      }
      console.log('turn:' + turn);
      if (turn == "right") {
        console.log('右滑');
      }
      // return turn;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

.homepage {
  .swiper {
    height: 200px;
  }
  .banner {
    width: 100%;
    height: 100%;
  }
  .company {
    display: flex;
    margin-top: 15px;
    padding-bottom: 20px;
    border-bottom: 10px solid #f3f3f3;
    .company-cover {
      flex: 0 0 65px;
      height: 65px;
      width: 65px;
      margin: 0 10px;
      border: 1px solid #eee;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .company-detail {
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      flex-direction: column;
      // justify-content: center;
      line-height: 28px;
      .company-text {
        line-height: 16px;
        font-size: 14px;
      }
    }
  }
  // .store-list {
  //   padding: 10px 15px;
  //   border-top: 8px solid #f3f3f3;
  //   .all-store {
  //     line-height: 24px;
  //     font-size: 15px;
  //     padding-left: 12px;
  //     border-left: 5px solid #2193fa;
  //   }
  // }
  .pl {
    float: left;
  }
  .pr {
    float: right;
  }
  .more_Company {
    position: relative;
    // top: 250px;
    // width: 100%;
    .moreCompanyBlue {
      position: absolute;
      top: 0;
      left: 15px;
      width: 5px;
      height: 24px;
      background: #2193fa;
      border-radius: 9px;
    }
    .more_CompanyTitle {
      padding-left: 12px;
      font-size: 15px;
      height: 27px;
      line-height: 24px;
      margin: 10px 15px;
    }
    .moreCompany_list {
      .moreCompany_detail {
        padding: 0 15px;
        height: 76px;
        border-bottom: 1px solid #eeeeee;
        margin-top: 12px;
        .moreCompanyImg_div {
          #store_img {
            width: 96px;
            height: 66px;
          }
        }
        .moreCompany_text {
          padding-left: 11px;
          width: 66%;
          overflow: hidden;
          height: 67px;
          .moreCompany_title {
            font-size: 15px !important;
            font-weight: bold;
          }
          > div {
            margin-bottom: 5px;
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
