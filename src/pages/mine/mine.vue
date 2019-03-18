<template>
  <div id="memberMineTab" class="clickTab">
    <div class="mine_top">
      <div class="mineImgDiv pl">
        <img
          class="mineImg"
          alt
          src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png"
        >
      </div>
      <div class="pl mineDetail">
        <p id="mineName">$姓名（身份）$</p>
        <p id="minePhone">$130 4567 8192$</p>
      </div>
    </div>
    <div class="mineDeail">
      <div
        class="detail_item"
        v-for="(item, index) in mineNav"
        :key="index"
        @click="navTo(item.navigatorUrl)"
      >
        <img alt :src="item.imgUrl">
        <span class="detail_title">{{item.navName}}</span>
        <!-- <span class="detail_contrnt" id="carCount"></span> -->
      </div>
    </div>
    <div class="mineExit">解除绑定</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mineNav: [
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/mineCar.png",
          navName: "会员卡",
          navigatorUrl: '../memberCard/main'
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/lessons.png",
          navName: "上课次数",
          navigatorUrl: '../classTimes/main'
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/appiont.png",
          navName: "预约记录",
          navigatorUrl: '../appointmentRecord/main'
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/comeCost.png",
          navName: "签到记录",
          navigatorUrl: '../checkInRecord/main'
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/integral.png",
          navName: "我的积分",
          navigatorUrl: '../myPoints/main'
        },
        {
          imgUrl: "https://www.pojun-tech.cn/assets/img/checkFace.png",
          navName: "人脸设置",
          navigatorUrl: '../faceSetUp/main'
        }
      ]
    };
  },
  methods: {
    navTo(url) {
      wx.navigateTo({
        url: url
      })
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

#memberMineTab {
  .mine_top {
    padding: 20px 30px;
    box-sizing: border-box; 
    height: 110px;
    .mineImgDiv {
      border-radius: 50%;
      .mineImg {
        width: 66px;
        height: 66px;
        border-radius: 5px;
      }
    }
    .mineDetail {
      margin: 13px 0 0 15px;
      > p {
        margin: -5px 0 10px 0;
        font-size: 15px;
      }
    }
  }
  .mineDeail {
    border-top: 10px solid #f4f4f4;
    .detail_item {
      height: 46px;
      border-bottom: 1px solid #ededed;
      font-size: 15px;
      line-height: 46px;
      padding-left: 15px;
      > img {
        display: inline-block;
        vertical-align: middle;
        width: 25px;
        height: 25px;
      }
      .detail_title {
        vertical-align: middle;
        margin-left: 10px;
        color: #515151;
      }
      // .detail_contrnt {
      //   float: right;
      //   margin-right: 15px;
      // }
    }
  }
  .mineExit {
    position: absolute;
    bottom: 15px;
    left: 4%;
    width: 92%;
    height: 40px;
    line-height: 40px;
    color: white;
    text-align: center;
    border-radius: 5px;
    background: #5db2ff;
    &:active {
      opacity: 0.6;
    }
  }
}
</style>


