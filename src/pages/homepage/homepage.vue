<template>
  <div class="homepage">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      :indicator-active-color="themeColor"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in bannerList" :key="index">
        <swiper-item>
          <image :src="item" mode="aspectFill" class="banner" @click="previewImage(item)"></image>
        </swiper-item>
      </div>
    </swiper>
    <div class="tab-list">
      <div class="tab-item" @click="toNav('../teamClassList/main')">
        <img src="/static/images/icon-team.png" :style="{'background-color': themeColor}">
        <div class="text">团课</div>
      </div>
      <div class="tab-item" @click="toNav('../coachList/main')">
        <img src="/static/images/icon-coach.png" :style="{'background-color': themeColor}">
        <div class="text">私教</div>
      </div>
      <div class="tab-item" @click="toNav('../memberCard/main')">
        <img class="" src="/static/images/icon-member.png" :style="{'background-color': themeColor}">
        <div class="text">会员卡</div>
      </div>
      <div class="tab-item" @click="toNav()">
        <img src="/static/images/icon-notice.png" :style="{'background-color': themeColor}">
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
        <div
          class="nearby-store"
          v-for="(item, index) in nearbyStoreList"
          :key="index"
          @click="toStoreDetail(item.storeId)"
        >
          <div class="cover">
            <image :src="item.cover" mode="aspectFill"></image>
          </div>
          <div class="nearby-bottom">
            <span class="name">{{item.storeName}}</span>
            <span class="range" :style="{'color': themeColor}">{{item.range}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="recommend-wrapper">
      <title-cell title="为你推荐" :titleSize="18"></title-cell>
        <div class="class-item">
          <div v-if="!recommendClass.loading && recommendClass.teamScheduleId" @click="toDetail">
            <div class="class-cover">
              <image :src="window.api + recommendClass.masterImg" mode="aspectFill"></image>
            </div>
            <div class="class-info">
              <div class="class-top">
                <span class="class-name">{{recommendClass.anotherName}}</span>
                <span class="class-time" v-if="recommendClass.timeStart">{{(recommendClass.timeStart || '')+"~"+(recommendClass.timeEnd || '')}}</span>
              </div>
              <div class="class-bottom">
                <span class="class-coach">{{recommendClass.coachNameArrayStr}}</span>
                <span class="class-venue">{{recommendClass.storeName || ''}}<span v-if="recommendClass.venueName">-</span>{{recommendClass.venueName || ''}}</span>
              </div>
            </div>
          </div>
          <div class="class-skeleton" v-if="recommendClass.loading">
            <div class="class-cover">
            </div>
            <div class="class-info">
              <div class="class-top">
                <span class="class-name"></span>
              </div>
              <div class="class-bottom"></div>
            </div>
          </div>
        </div>
      <coach-item :color="themeColor" :info="item" v-for="(item, index) in recommendCoach" :key="index"></coach-item>
    </div>
    <login-popup :options="options" v-if="!isLogin"></login-popup>

    <page-footer></page-footer>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  getRange,
  formatDate,
  getWXCompany,
  getCompanyColor,
  wxLogin
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";
import pageFooter from "COMPS/pageFooter.vue"
import loginPopup from "COMPS/loginPopup.vue"
import colorMixin from "COMPS/colorMixin.vue"
import store from "../../utils/store";
import {
  getPhoneNumber,
  getMessage,
  staff_login,
  getUserInfo,
  enterMember,
  enterStaff
} from "COMMON/js/merge_login.js";

export default {
  data() {
    return {
      storeList: [],
      longitude: "", // 经度
      latitude: "", // 维度
      bannerList: [],
      recommendCoach: [{}],
      recommendClass: {
        loading: true
      },
      companyId: "",
      nearbyStoreList: [{},{}],
      // themeColor: "",
      options: null
    };
  },
  mixins:[colorMixin],
  components: {
    titleCell,
    teamClassItem,
    coachItem,
    pageFooter,
    loginPopup
  },
  mounted() {
  },
  onShow() {
    wxLogin();
    let that = this;
    // 场景值为公众号自定义菜单进入时，无法触发组件的mounted钩子，在这里自动登录
    if (wx.getLaunchOptionsSync().scene == 1035 && !store.state.isLogin) {
      getCompanyColor().then(() => {
        this.login();
      });
    }
    wx.getLocation({
      type: "wgs84",
      success(res) {
        console.log("经度:" + res.longitude);
        console.log("维度:" + res.latitude);
        that.latitude = res.latitude;
        that.longitude = res.longitude;
        store.commit("saveLongitude", res.longitude);
        store.commit("saveLatitude", res.latitude);
        that.getNearbyStoreList();
      },
      fail(res) {
        that.getNearbyStoreList();
      }
    });
    if(!this.nearbyStoreList.length) {
      this.getNearbyStoreList();
    }
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation'] && JSON.stringify(res.authSetting).length > 2) {
          wx.showModal({
            title: "授权",
            content: "部分功能需要地理位置，是否授权？",
            success(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          });
        }
      }
    })
  },
  onLoad(options) {
    this.setTheme()
    this._mounted()
    this.options = options
    // this.getCompanyInfo()
  },
  computed: {
    isLogin() {
      return store.state.isLogin
    },
    window() {
      return window
    }
  },
  onPullDownRefresh() {
    this.recommendCoach = [{}]
    this.recommendClass = {
      loading: true
    }
    this.getBannerList()
    this.getRecommendCoach();
    this.getRecommendClass()
    if(!this.nearbyStoreList.length) {
      this.getNearbyStoreList();
    }
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    // 自动登录的逻辑
    login() {
      if (wx.getStorageSync("phone") && wx.getStorageSync("openId") && !wx.getStorageSync("instMsgSubKey")) {
        getUserInfo().then((member_res) => {
          enterMember(member_res)
        })
      }
      if (wx.getStorageSync("instMsgSubKey") && wx.getStorageSync("phone")) {
        wx.showLoading()
        staff_login().then((staff_res) => {
          wx.hideLoading()
          if(!staff_res) {
            return
          }
          enterStaff(staff_res)
        })
      }
    },
    _mounted() {
      this.companyId = wx.getStorageSync("companyId");
      console.log(this.companyId)
      let that = this;
      this.getBannerList();
      this.getRecommendCoach();
    },
    setTheme() {
      const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
      if (extConfig.name) {
        setNavTab(wx.getStorageSync(extConfig.name));
      } else {
        setNavTab(wx.getStorageSync("companyName"));
      }
      // this.themeColor = window.color || "#2a82e4";
    },
    toNav(url) {
      if (!url) {
        return wx.showToast({
          title: "暂未开放",
          icon: "none",
          duration: 1000
        });
      }
      if (url.indexOf("memberCard") > -1 && !store.state.isLogin) {
        return wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1000
        });
      }
      wx.navigateTo({
        url: url
      });
    },
    toStoreDetail(id) {
      if(id) {
        wx.navigateTo({
          url: '../storeDetail/main?storeId='+id
        });
      }
    },
    // 获取轮播图
    getBannerList() {
      let that = this;
      wx.request({
        url: window.api + "/system/set/wxcompanyinfo",
        data: {
          companyId: that.companyId
        },
        success(res) {
          if (res.data.code === 200) {
            that.bannerList = res.data.data.wxCarousel.split(",").map(e => {
              return (e = window.api + e);
            });
          }
        }
      });
    },
    //　推荐团课
    getRecommendClass() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/schedule/recommend",
        data: {
          companyId: that.companyId,
          storeId: that.nearbyStoreList[0]
            ? that.nearbyStoreList[0].storeId
            : ""
        },
        success(res) {
          if (res.data.code == 200 && res.data.data) {
            let _data = res.data.data
            _data.coachNameArrayStr = _data.coachNameArrayStr.replace(/null/g,'');
            _data.timeStart = formatDate(new Date(_data.timeStart), "hh:mm")
            _data.timeEnd = formatDate(new Date(_data.timeEnd), "hh:mm")
            that.recommendClass = res.data.data;
          } else {
            that.recommendClass = {loading: false}
          }
        }
      });
    },
    // 推荐教练
    getRecommendCoach() {
      let that = this;
      HttpRequest({
        url: window.api + "/coach/private/appoint/recommend",
        success(res) {
          if (res.data.code == 200 && res.data.data) {
            let _data = res.data.data;
            let _list = []
            _list.push({
              userName: _data.coachName,
              userId: _data.coachId,
              headImgPath: _data.coachHeadImg,
              individualResume: _data.individualResume,
              teamCountByCoach: _data.teamCountByCoach,
              privateCountByCoach: _data.privateCountByCoach
            })
            that.recommendCoach = _list;
          } else {
            that.recommendCoach = []
          }
        }
      });
    },
    // 获取附近门店列表
    getNearbyStoreList() {
      let that = this;
      console.log("=====getNearbyStoreList=======")
      wx.request({
        url: window.api + "/store/all-store-name-list-nolimit",
        data: {
          companyId: wx.getStorageSync("companyId")
        },
        success(res) {
          if (res.data.code === 200) {
            let _list = res.data.data;
            let _storeList = [];
            res.data.data.forEach(e => {
              let _range;
              if (e.mapPoint) {
                let _lat = e.mapPoint.split(",")[1];
                let _lng = e.mapPoint.split(",")[0];
                _range = getRange(that.latitude, that.longitude, _lat, _lng);
              }
              let _data = {
                cover: e.images ? window.api + e.images.split(",")[0] : "",
                address: e.address,
                range: _range,
                storeName: e.storeName,
                storeId: e.storeId
              };
              if (_range) {
                _storeList.push(_data);
              }
            });
            _storeList.sort(that.compare("range"));
            that.nearbyStoreList = _storeList.slice(0, 2);
            if (!_storeList.length) {
              _list = _list.slice(0, 2);
              that.nearbyStoreList = _list.map(e => {
                return {
                  cover: e.images ? window.api + e.images.split(",")[0] : "",
                  address: e.address,
                  range: "",
                  storeName: e.storeName,
                  storeId: e.storeId
                };
              });
            }
            that.getRecommendClass();
          } else {
            that.nearbyStoreList = [];
          }
        }
      });
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property] || 0;
        var value2 = b[property] || 0;
        return parseFloat(value1) - parseFloat(value2);
      };
    },
    previewImage(item) {
      wx.previewImage({
        current: item,
        urls: this.bannerList
      })
    },
    toDetail() {
      wx.navigateTo({
        url: "../teamClassDetail/main?classId=" + this.recommendClass.teamScheduleId
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
@import "~COMMON/less/common.less";
page {
  background-color: #fff;
  height: 100%;
}
.homepage {
  padding-bottom: 20px;
  background-color: #fff;
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
          > image {
            width: 100%;
            height: 90px;
            background-color: #eee;
            border-radius: 5px;
          }
        }
        .nearby-bottom {
          padding-top: 10px;
          display: flex;
          .name {
            flex: 1;
            .Mult-line(1);
            font-size: 15px;
            margin-right: 5px;
            color: #505050;
          }
          .range {
            flex: 0 0 70px;
            font-size: 12px;
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
    .class-item {
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0px 2px 10px #ccc;
      margin-bottom: 15px;
      .class-cover {
        width: 100%;
        height: 140px;
        > image {
          width: 100%;
          height: 100%;
          background-color: #ccc;
        }
      }
      .class-info {
        padding: 14px 10px 14px 20px;
        .class-top {
          margin-bottom: 8px;
          .class-name {
            font-size: 16px;
            color: #333;
            font-weight: bold;
          }
          .class-time {
            float: right;
            font-size: 14px;
            color: #bababa;
          }
        }
        .class-bottom {
          .class-coach {
            font-size: 14px;
            color: #bababa;
          }
          .class-venue {
            float: right;
            font-size: 14px;
          }
        }
      }
      .class-skeleton {
        .class-cover,.class-top,.class-bottom {
          background-color: #eee;
        }
        .class-top {
          height: 18px;
          width: 200px;
        }
        .class-bottom {
          height: 14px;
          width: 100px;
        }
      }
    }
  }
}
</style>
