<template>
  <div class="team-class-detail">
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
      <div class="cover">
        <img>
      </div>
      <div class="coach-info">
        <div class="coach-name">$JsonG 宁宁$</div>
        <div class="coach-desc">$简介$</div>
      </div>
    </div>
    <div class="class-info">
      <!-- TODO:传课程时间 -->
      <title-cell :title="classTime" moreText="其他时间" :moreSize="14" :titleSize="16"></title-cell>
      <div class="address-group">
        <div class="store">
          <span class="name">{{classDetail.storeName}}</span>
          <span class="range">2.4KM</span>
        </div>
        <div class="address">$福州仓山大街商铺272号万达广场A9楼三楼$</div>
      </div>
      <!-- <div class="class-type">$合同结算$</div> -->
    </div>
    <div class="class-desc">
      <div class="title">课程介绍</div>
      <div class="desc-text">
        <p>
          步入BODYCOMBAT的课程，你会通过拳击、踢腿动作
          进行锻炼、全程可以燃烧高达740卡路里的热量。此项
          课程受众好。这个内容我还可以在瞎掰。如果没有内容
          就按下面显示。
        </p>
        <!-- <p>课程还没有填写简介</p> -->
      </div>
    </div>
    <div class="class-people">
      <div class="people-info">
        <div class="num">已预约7人</div>
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
    <div class="bottom-btn appointment" @click="appointClass">马上预约</div>
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
export default {
  name: "team-class-detail",
  data() {
    return {
      id: "",
      classDetail: {}
    };
  },
  components: {
    titleCell
  },
  onLoad(option) {
    this.id = option.classId;
    setNavTab("", "#2a82e4");
  },
  mounted() {
    this.getClassDetail();
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
      let week = ["一", "二", "三", "四", "五", "六", "日"];
      let w = "周" + week[new Date(this.classDetail.timeStart).getDay() + 1];
      let md = formatDate(new Date(this.classDetail.timeStart), "M月dd");
      return md + " " + w + " " + this.statrTime + "-" + this.endTime;
    }
  },
  methods: {
    appointClass() {
      let that = this
      wx.showModal({
        title: "提示",
        content: "是否确认预约？",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "../appointmentResult/main?classId=" + that.id
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/getOne",
        data: {
          teamScheduleId: that.id
        },
        success(res) {
          if (res.data.code === 200) {
            that.classDetail = res.data.data;
          }
          console.log(res.data.data);
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
    .cover {
      flex: 0 0 90px;
      width: 90px;
      height: 90px;
      padding: 12px;
      box-sizing: border-box;
      > img {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background-color: #bfbfbf;
      }
    }
    .coach-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: 12px;
      .coach-name {
        flex: 0 0 40px;
        font-size: 16px;
        line-height: 40px;
        font-weight: bold;
        color: #333;
      }
      .coach-desc {
        .Mult-line(3);
        flex: 1;
        font-size: 14px;
        color: #bababa;
      }
    }
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
  .class-people,
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
    // line-height: 64px;
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
