<template>
  <div class="team-class-detail" :class="{'isPhoneX-wrap':isPhoneX}">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      indicator-active-color="rgba(74, 134, 232, 1)"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in 3" :key="index">
        <swiper-item>
          <!-- <img :src="item" class="banner"> -->
          <img
            class="banner"
            src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg"
          >
        </swiper-item>
      </div>
    </swiper>
    <div class="class-name">{{classDetail.anotherName || '课程名称'}}</div>
    <div class="coach-detail">
      <div class="coach-detail-item" v-for="(item, index) in coachList" :key="index">
        <div class="cover">
          <img scr="http://pojun-tech.cn/assets/img/morenm.png">
        </div>
        <div class="name">{{item.coachName}}</div>
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
          <span class="range">{{range}}</span>
        </div>
        <div class="address">{{address || '暂无详细地址'}}</div>
      </div>
      <!-- <div class="class-type">$合同结算$</div> -->
    </div>
    <div class="class-desc">
      <div class="title">课程介绍</div>
      <div class="desc-text">
        <p>
          {{classDetail.description || '暂无课程介绍'}}
        </p>
        <!-- <p>课程还没有填写简介</p> -->
      </div>
    </div>
    <div class="class-people">
      <div class="people-info">
        <div class="num">已预约（{{classDetail.appointCount}}/{{classDetail.maxPeople}}）人</div>
      </div>
    </div>
    <div class="ruler">
      <div class="title">预约规则</div>
      <p>1.开课前24小时可以预约。2.开课前24小时可以预约。</p>
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
      :class="{'isPhoneX-bottom':isPhoneX}"
      @click="appointClass"
    >马上预约</div>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import store from "../../utils/store";

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
      companyId: ""
    };
  },
  components: {
    titleCell
  },
  onLoad(option) {
    this.id = option.classId;
    setNavTab();
  },
  mounted() {
    this.companyId = wx.getStorageSync("companyId");
    this.longitude = store.state.longitude;
    this.latitude = store.state.latitude;
    this.getClassDetail();
    this.getClassCoach();
  },
  computed: {
    statrTime() {
      if (this.classDetail.timeStart) {
        return formatDate(new Date(this.classDetail.timeStart), "hh:mm");
      }
    },
    endTime() {
      if (this.classDetail.timeEnd) {
        return formatDate(new Date(this.classDetail.timeEnd), "hh:mm");
      }
    },
    classTime() {
      let week = ["日", "一", "二", "三", "四", "五", "六"];
      let w = "周" + week[new Date(this.classDetail.timeStart).getDay()];
      let md = formatDate(new Date(this.classDetail.timeStart), "M月dd");
      return md + " " + w + " " + this.statrTime + "-" + this.endTime;
    },
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  methods: {
    // 预约团课
    appointClass() {
      if (!store.state.isLogin) {
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
      // wx.showModal({
      //   title: "提示",
      //   content: "确认预约该团课？",
      //   success(res) {
      //     if (res.confirm) {
      // HttpRequest({
      //   url: window.api + "/teamClass/teamAppoint/add",
      //   data: {}
      // });
      wx.navigateTo({
        url:
          "../memberCard/main?classId=" +
          that.id +
          "&storeId=" +
          that.classDetail.storeId +
          "&venueId=" +
          that.classDetail.venueId
      });
      // wx.navigateTo({
      //   url: "../appointmentResult/main?classId=" + that.id
      // });
      // }
      // }
      // });
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
            that.classDetail = res.data.data;
            that.getAddress();
          }
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
            that.coachList = res.data.data;
          }
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
            that.range = _range
          }
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
        > img {
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
        margin-bottom: 10px;
        > span {
          color: @theme-color;
        }
        .name {
          font-size: 16px;
          margin-right: 10px;
        }
        .range {
          font-size: 12px;
        }
      }
      .address {
        margin-bottom: 10px;
        color: #bababa;
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
}
</style>
