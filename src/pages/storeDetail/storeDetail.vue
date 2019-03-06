<template>
  <div id="memberIndexDetail" class="clickDetail">
    <div class="storeDetailDiv">
      <div class="indexDetailTop">
        <div class="topImg pl">
          <img id="detailStoreImg" alt src="https://www.pojun-tech.cn/assets/img/coordinates.png">
        </div>
        <p class="pl storeName">破军科技</p>
      </div>
      <div class="storeImg_list">
        <swiper class="swiper" :circular="true" :loop="true">
          <div v-for="(item,index) in 3" :key="index">
            <swiper-item class="swiper-item">
              <img class="banner" src="/static/images/banner-1.jpg">
              <img class="banner" src="/static/images/banner-1.jpg">
            </swiper-item>
          </div>
        </swiper>
      </div>

      <div class="storePlice">
        <div class="pl plice">
          <!-- <i class="address-icon"></i> -->
          <img src="/static/images/icon-address.png" alt>
        </div>
        <div class="pl">
          <p id="provinceName">福建省</p>
          <p class="address">厦门市思明区</p>
        </div>
        <div class="pr storePhone" @click="callPhone">
          <!-- <i class="phone-icon"></i> -->
          <img src="/static/images/icon-phone.png" alt>
        </div>
      </div>

      <div class="facility">
        <div class="moreCompanyBlue"></div>
        <p class="facilityTitle">场馆设施</p>
        <div class="facilityDetail">
          <div class="facilityDetails" v-for="(item, index) in facilityList" :key="index">
            <img class="beforClickImg" alt :src="item.iconPath">
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="storeCoach">
        <div class="moreCompanyBlue"></div>
        <p class="storeCoachTitle">教练秀</p>
        <div class="scroll_box">
          <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
            <div class="student-list">
              <div class="student-item" v-for="(item, index) in 8" :key="index">
                <img src="/static/images/avatar.png" alt>
                <p class="student-name">学员{{index}}</p>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "storeDetail",
  data() {
    return {
      facilityList: [
        {
          name: "水吧",
          iconPath: "https://www.pojun-tech.cn/assets/img/waterBa.png"
        },
        {
          name: "休闲区",
          iconPath: "https://www.pojun-tech.cn/assets/img/cofi.png"
        },
        {
          name: "停车场",
          iconPath: "https://www.pojun-tech.cn/assets/img/carStop.png"
        },
        {
          name: "WIFI",
          iconPath: "https://www.pojun-tech.cn/assets/img/wifi.png"
        },
        {
          name: "更衣柜",
          iconPath: "https://www.pojun-tech.cn/assets/img/changeDresses.png"
        },
        {
          name: "商店",
          iconPath: "https://www.pojun-tech.cn/assets/img/shop.png"
        },
        {
          name: "沐浴",
          iconPath: "https://www.pojun-tech.cn/assets/img/sprinkler.png"
        },
        {
          name: "空调",
          iconPath: "https://www.pojun-tech.cn/assets/img/airConditioner.png"
        }
      ]
      // studentList: [{
      //   name: ''
      // }]
    };
  },
  mounted() {},
  methods: {
    callPhone() {
      wx.showModal({
        title: "拨号",
        content: "确认拨打号码12345678977吗？",
        success(res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: "12345678977" // 仅为示例，并非真实的电话号码
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

.pl {
  float: left;
}
.pr {
  float: right;
}
.pb {
  clear: both;
}
#detailStoreImg {
  border-radius: 50%;
  width: 66px;
  height: 66px;
}
#memberIndexDetail {
  .storeDetailDiv {
    .indexDetailTop {
      padding: 15px;
      height: 98px;
      box-sizing: border-box;
      .topImg {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        box-shadow: 1px 1px 5px #8e8e8e;
      }
      .storeName {
        font-size: 18px;
        line-height: 67px;
        margin-left: 15px;
      }
    }
    .storeImg_list {
      height: 95px;
      padding: 0 10px;
      overflow: hidden;
      .swiper {
        .swiper-item {
          display: flex;
          justify-content: space-between;
          > img {
            box-sizing: border-box;
            width: 50%;
            padding: 0 5px;
            height: 90px;
            border-radius: 10px;
          }
        }
      }
    }
    .storePlice {
      padding: 15px;
      height: 86px;
      font-size: 14px;
      box-sizing: border-box;
      p {
        margin: 0 0 10px;
        line-height: 22px;
      }
      .plice {
        width: 40px;
        height: 1px;
        padding-left: 6px;
        padding-top: 15px;
        > img {
          width: 25px;
          height: 25px;
        }
      }
      .storePhone {
        box-sizing: border-box;
        width: 50px;
        border-left: 1px solid #bbbbbb;
        height: 60px;
        padding: 17px 0 0 20px;
        > img {
          width: 22px;
          height: 26px;
        }
      }
    }
    .moreCompanyBlue {
      position: absolute;
      top: 10px;
      left: 15px;
      width: 5px;
      height: 24px;
      background: #2193fa;
      border-radius: 9px;
    }
    .facilityTitle,
    .storeCoachTitle {
      padding-left: 30px;
      line-height: 46px;
      font-size: 16px;
    }
    .facility {
      position: relative;
      border-top: 10px solid #eeeeee;
      .facilityDetail {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .facilityDetails {
          flex: 0 0 25%;
          width: 25%;
          text-align: center;
          > img {
            width: 26px;
            height: 26px;
          }
          > span {
            display: block;
            width: 100%;
            margin-top: 5px;
            font-size: 14px;
          }
        }
      }
    }
    .storeCoach {
      position: relative;
      clear: both;
      overflow: hidden;
      // .coach_list {
      //   width: 100%;
      //   overflow: hidden;
      //   padding: 15px;
      //   .student-list {
      //     display: inline-block;
      //     height: 110px;
      //     width: 100%;
      //     // overflow-x: scroll;
      //     .student-item {
      //       display: inline-block;
      //       width: 50px;
      //       text-align: center;
      //       > img {
      //         width: 45px;
      //         height: 45px;
      //         border-radius: 5px;
      //       }
      //     }
      //     .student-name {
      //       font-size: 16px;
      //     }
      //   }
      // }
      .scroll_box {
        width: 100%;
        height: 110px;
        overflow: hidden;
        padding: 10px;
        background: #fff;
        white-space: nowrap;
        .student-list {
          width: 80px;
          height: auto;
          margin-right: 12px;
          display: inline-block;
          .student-item {
            display: inline-block;
            width: 50px;
            margin-right: 30px;
            text-align: center;
            > img {
              width: 45px;
              height: 45px;
              border-radius: 5px;
            }
          }
          .student-name {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
