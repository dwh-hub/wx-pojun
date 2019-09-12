<template>
  <div class="team-class-detail" :class="{'isPhoneX-wrap':isPhoneX}">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      :indicator-active-color="window.color"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in classDetail.masterImg" :key="index">
        <swiper-item>
          <!-- <img :src="window.api + item" class="banner"> -->
          <image :src="window.api + item" mode="aspectFill" class="banner"></image>
          <!-- <img
            class="banner"
            src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg"
          >-->
        </swiper-item>
      </div>
    </swiper>
    <div class="class-name">{{classDetail.anotherName || '课程名称'}}</div>
    <div class="coach-detail">
      <div
        class="coach-detail-item"
        v-for="(item, index) in coachList"
        :key="index"
        @click="toNav(item.coachId)"
      >
        <div class="cover">
          <image :src="window.api + item.coachHeadImg" mode="aspectFill"></image>
          <!-- <img :src="window.api + item.coachHeadImg"> -->
        </div>
        <div class="name">{{item.coachName || '教练名'}}</div>
      </div>
      <!-- <div class="coach-info">
        <div class="coach-name">$JsonG 宁宁$</div>
        <div class="coach-desc">$简介$</div>
      </div>-->
    </div>
    <div class="class-info">
      <title-cell :title="classTime" moreText :moreSize="14" :titleSize="16"></title-cell>
      <div class="address-group">
        <div class="store">
          <span class="name">{{classDetail.storeName}}</span>
          <span class="range" :style="{'color': window.color}">{{range}}</span>
        </div>
        <div class="address-detail" @click="toMap()">
          <span>{{address || '暂无详细地址'}}</span>
          <img v-if="address" src="/static/images/address.png">
        </div>
        <div class="address"></div>
      </div>
      <!-- <div class="class-type">$合同结算$</div> -->
    </div>
    <div class="class-desc">
      <div class="title">课程介绍</div>
      <div class="desc-text">
        <p>{{classDetail.description || '暂无课程介绍'}}</p>
        <!-- <p>课程还没有填写简介</p> -->
      </div>
    </div>
    <div class="class-people">
      <div class="people-info">
        <div class="num">
          已预约（{{classDetail.appointCount}}
          <span v-if="classDetail.maxPeople">/{{classDetail.maxPeople}}</span>）人
        </div>
      </div>
    </div>
    <div class="ruler">
      <div class="title">预约规则</div>
      <p>1.开课前24小时可以预约。</p>
    </div>
    <div class="process">
      <div class="title">上课流程</div>
      <div class="process-group">
        <span class="process-item">线上预约</span>
        <img class="arrow" src="/static/images/icon-right-arrow.png">
        <span class="process-item">等待开课</span>
        <img class="arrow" src="/static/images/icon-right-arrow.png">
        <span class="process-item">成功上课</span>
      </div>
    </div>
    <div
      class="bottom-btn appointment"
      @click="appointClass"
      :style="{'background-color': window.color}"
      v-if="canAppoint && isLogin"
    >
      马上预约
      <div class="block" v-if="isPhoneX"></div>
    </div>
    <button
      v-else
      class="bottom-btn appointment clearBtn"
      :style="{'background-color': window.color,color:'#fff'}"
      type="default"
      open-type="getPhoneNumber"
      @getphonenumber="_getPhoneNumber"
    >马上预约</button>
    <div class="bottom-btn appointmentNone" v-if="!canAppoint">
      不可预约
      <div class="block" v-if="isPhoneX"></div>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  getRange
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import store from "../../utils/store";
import pageFooter from "COMPS/pageFooter.vue"
import {getPhoneNumber} from "COMMON/js/api.js"

export default {
  name: "team-class-detail",
  data() {
    return {
      id: "",
      classDetail: {},
      coachList: [],
      address: "",
      range: "",
      longitude: "", // 经度
      latitude: "", // 纬度,
      companyId: "",
      // 团课时间是否过期
      canAppoint: true,
      loadCount: 0,
      storeLat: '',
      storeLong: '',
      isLogin: false
    };
  },
  components: {
    titleCell,
    pageFooter
  },
  onLoad(option) {
    // 进页面前先清空数据
    Object.assign(this.$data, this.$options.data());
    this.id = option.classId;
    setNavTab();
  },
  onShow() {
    this.isLogin = wx.getStorageSync("isLogin")
  },
  onUnload() {
    this.loadCount = 0
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  mounted() {
    wx.showLoading({
      title: '加载中...'
    })
    this.companyId = wx.getStorageSync("companyId");
    this.longitude = store.state.longitude;
    this.latitude = store.state.latitude;
    this.getClassDetail();
    this.getClassCoach();
  },
  watch: {
    loadCount() {
      if(this.loadCount >= 2) {
        wx.hideLoading()
      }
    }
  },
  computed: {
    statrTime() {
      if (this.classDetail.timeStart) {
        return formatDate(new Date(this.classDetail.timeStart), "hh:mm");
      }
      return "";
    },
    endTime() {
      if (this.classDetail.timeEnd) {
        return formatDate(new Date(this.classDetail.timeEnd), "hh:mm");
      }
      return "";
    },
    classTime() {
      if (this.classDetail.timeStart) {
        let week = ["日", "一", "二", "三", "四", "五", "六"];
        let w = "周" + week[new Date(this.classDetail.timeStart).getDay()];
        let md = formatDate(new Date(this.classDetail.timeStart), "M月dd");
        return md + " " + w + " " + this.statrTime + "-" + this.endTime;
      }
      return "";
    },
    isPhoneX() {
      return store.state.isIphoneX;
    },
    window() {
      return window;
    }
  },
  methods: {
    toMap() {
      if (this.storeLat) {
        wx.openLocation({
          latitude: parseFloat(this.storeLat),
          longitude: parseFloat(this.storeLong),
          scale: 18,
          success(res) {
            console.log(res);
          }
        });
      }
    },
    _getPhoneNumber(e) {
      let url = "../teamClassDetail/main?classId=" + this.id
      getPhoneNumber(e,url)
    },
    toNav(id) {
      if (id) {
        wx.navigateTo({
          url: "../coachDetail/main?coachId=" + id
        });
      }
    },
    // 预约团课
    appointClass() {
      if (!wx.getStorageSync("isLogin")) {
        return wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1000
        });
      }
      let that = this;
      if (
        this.classDetail.isNeedAppoint == 0 ||
        this.classDetail.isNeedAppoint == 3
      ) {
        return wx.showToast({
          title: "该课程无需预约",
          icon: "none",
          duration: 2000
        });
      }
      wx.navigateTo({
        url:
          "../memberCard/main?classId=" +
          that.id +
          "&storeId=" +
          that.classDetail.storeId +
          "&venueId=" +
          that.classDetail.venueId
      });
    },
    // 获取团课详情
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/getOne",
        data: {
          teamScheduleId: that.id,
          companyId: that.companyId
        },
        methods: "POST",
        success(res) {
          if (res.data.code === 200) {
            if (new Date().getTime() > res.data.data.timeEnd) {
              that.canAppoint = false;
            }
            res.data.data.masterImg = res.data.data.masterImg.split(",");
            that.classDetail = res.data.data;
            that.getAddress();
          }
          that.loadCount++
        }
      });
    },
    // 获取团课的教练
    getClassCoach() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamCoach/getCoach",
        data: {
          teamScheduleId: that.id,
          companyId: that.companyId
        },
        methods: "POST",
        success(res) {
          if (res.data.code) {
            res.data.data.forEach(e => {
              if(!e.coachHeadImg) {
                e.coachHeadImg = "/assets/img/morenTo.png"
              }
            });
            that.coachList = res.data.data;
          }
          that.loadCount++
        }
      });
    },
    // 获取地址
    getAddress() {
      let that = this;
      HttpRequest({
        url: window.api + "/store/detail/" + that.classDetail.storeId,
        success(res) {
          let _data = res.data.data;
          let _address = _data.parentName + _data.cityName + _data.address;
          _address = _address.replace(/null/g, "");
          _address = _address.replace(/[0]/gi, "");
          that.address = _address;
          if (_data.mapPoint) {
            let _lat = _data.mapPoint.split(",")[1];
            let _lng = _data.mapPoint.split(",")[0];
            let _range = getRange(that.latitude, that.longitude, _lat, _lng);
            that.range = _range;
            that.storeLat = _lat
            that.storeLong = _lng
          }
          that.loadCount++
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.team-class-detail {
  padding-bottom: 60px;
  .banner {
    width: 100%;
    height: 100%;
  }
  .swiper {
    height: 180px;
  }
  .class-name {
    line-height: 50px;
    padding-left: 15px;
    font-size: 16px;
    font-weight: bold;
  }
  .coach-detail {
    display: flex;
    padding-right: 10px;
    padding-bottom: 10px;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;
    overflow-y: auto;
    .coach-detail-item {
      flex: 0 0 90px;
      .cover {
        width: 100%;
        padding: 12px;
        box-sizing: border-box;
        > image {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          background-color: #bfbfbf;
        }
      }
      .name {
        text-align: center;
      }
    }
    // .coach-info {
    //   flex: 1;
    //   display: flex;
    //   flex-direction: column;
    //   padding-left: 12px;
    //   .coach-name {
    //     flex: 0 0 40px;
    //     font-size: 16px;
    //     line-height: 40px;
    //     font-weight: bold;
    //     color: #333;
    //   }
    //   .coach-desc {
    //     .Mult-line(3);
    //     flex: 1;
    //     font-size: 14px;
    //     color: #bababa;
    //   }
    // }
  }
  .class-info {
    padding: 5px 15px 15px 15px;
    border-bottom: 1rpx solid #eee;
    .address-group {
      .store {
        margin-bottom: 8px;
        .name {
          font-size: 16px;
          margin-right: 10px;
        }
        .range {
          font-size: 12px;
        }
      }
    .address-detail {
      color: #bababa;
      > span {
        display: inline-block;
        vertical-align: middle;
      }
      > img {
        display: inline-block;
        vertical-align: middle;
        width: 15px;
        height: 15px;
        margin-left: 10px;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
      }
    }
    }
    .class-type {
      color: #bababa;
    }
  }
  .class-desc,
  .ruler,
  .process {
    .title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 12px;
    }
    padding: 10px 12px 20px 12px;
    border-bottom: 1rpx solid #eee;
  }
  .class-desc {
    .desc-text {
      padding-left: 5px;
      box-sizing: border-box;
      color: #bababa;
    }
  }
  .class-people {
    color: #bababa;
    line-height: 50px;
    padding: 0 12px;
    border-bottom: 1rpx solid #eee;
  }
  .ruler {
    > p {
      color: #bababa;
    }
  }
  .process {
    .process-group {
      .process-item {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 15px;
        border: 1rpx solid #bababa;
        color: #bababa;
      }
      .arrow {
        width: 30px;
        height: 30px;
      }
    }
  }
  .appointmentNone {
    background-color: #bfbfbf;
  }
}
</style>
