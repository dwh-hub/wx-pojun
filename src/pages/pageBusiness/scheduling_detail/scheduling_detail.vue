<template>
  <div class="scheduling_detail">
    <div class="class-info-wrapper block-wrapper">
      <img src alt>
      <div class="class-info block-info">
        <div class="name">{{classDetail.anotherName}}</div>
        <div class="duration">时长：{{classDetail.timeSpan}}分钟</div>
      </div>
    </div>
    <van-cell-group custom-class="van-cell-group">
      <van-cell title="门店" :value="classDetail.storeName" is-link/>
      <van-cell title="场地" :value="classDetail.venueName" is-link/>
      <van-cell title="课程时长" :value="classDetail.timeSpan+'分钟'" is-link/>
      <van-cell title="教练" :value="classDetail.coachStr" is-link/>
      <van-cell title="上课日期" :value="classDetail.classStartTime" is-link/>
      <van-cell title="上课时间" :value="classDetail.classStartDate" is-link/>
      <van-cell title="是否预约" :value="classDetail.isNeedAppointText" is-link/>
      <van-cell title="最小上课人数" :value="classDetail.minPeople" is-link/>
      <van-cell title="最大上课人数" :value="classDetail.maxPeople" is-link/>
      <van-cell title="预约截止时间" :value="classDetail.stopAppoint" is-link/>
      <van-cell title="预约开始时间" :value="classDetail.advanceAppoint+'分钟'" is-link/>
    </van-cell-group>
    <div class="cell-title">上课列表</div>
    <div class="student-list">
      <div class="student-item block-wrapper" v-for="(item, index) in studentList" :key="index">
        <img :src="item.masterImg" alt>
        <div class="class-info block-info">
          <div class="first">{{item.name}}</div>
          <div class="second">{{item.secondCardClassName}}</div>
          <div class="third">{{item.statusChar}}</div>
        </div>
        <div
          class="class-over"
          v-if="item.status == 2"
          :style="{'background-color': themeColor}"
          @click="classOver(item)"
        >下课</div>
      </div>
    </div>
    <div class="fixed-bottom-btn" :style="{backgroundColor: themeColor}" @click="addStudent">新增上课学员</div>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      classDetail: {},
      studentPage: 0,
      studentList: [],
      teamScheduleId: 0
    };
  },
  onLoad(options) {
    if (options.teamScheduleId) {
      this.teamScheduleId = options.teamScheduleId;
      this.getClassDetail();
      this.getStudentList();
    }
  },
  mixins: [colorMixin],
  mounted() {
    setNavTab();
  },
  methods: {
    addStudent() {
      if(this.classDetail.timeEnd < new Date().getTime()) {
        return wx.showModal({
          title: "提示",
          content: "该团课已结束",
          showCancel: false
        });
      }
      if (this.classDetail.isNeedAppoint == 1) {
        return wx.showModal({
          title: "提示",
          content: "该课程需要预约",
          showCancel: false
        });
      }
      wx.navigateTo({
        url: `../contract_list/main?type=addStudent&venueId=${
          this.classDetail.venueId
        }&teamScheduleId=${this.classDetail.teamScheduleId}`
      });
    },
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/getOne",
        data: {
          teamScheduleId: that.teamScheduleId
        },
        success(res) {
          if (res.data.code == 200) {
            let _res = res.data.data;
            _res.coachStr = String(_res.coachNameArray);
            _res.classStartTime =
              formatDate(new Date(_res.timeStart), "hh:mm") +
              "-" +
              formatDate(new Date(_res.timeEnd), "hh:mm");
            _res.classStartDate = formatDate(
              new Date(_res.timeStart),
              "yyyy-MM-dd"
            );
            // _res.isAppoint = _res.isNeedAppoint ? "是" : "否";
            if (_res.isNeedAppoint == 0) {
              _res.isNeedAppointText = "不需要预约";
            }
            if (_res.isNeedAppoint == 1) {
              _res.isNeedAppointText = "需要预约，必须预约了才能上课";
            }
            if (_res.isNeedAppoint == 2) {
              _res.isNeedAppointText = "需要预约，不预约也可以上课";
            }
            that.classDetail = _res;
          }
        }
      });
    },
    getStudentList() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/pagesNoLimit",
        data: {
          teamScheduleId: that.teamScheduleId,
          page: that.studentPage,
          pageNo: that.studentPage,
          pageCount: 100,
          pageSize: 100
        },
        success(res) {
          if (res.data.code == 200) {
            that.studentList = res.data.data.result.map(e => {
              // TODO:
              // if(!e.masterImg) {
              e.masterImg = window.api + "/assets/img/morenTo.png";
              // }
              return e;
            });
          }
        }
      });
    },
    classOver(item) {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/finish/attend",
        data: {
          teamAttendId: item.teamAttendId
        },
        success(res) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
          if (res.data.code == 200) {
            that.getStudentList();
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.scheduling_detail {
  padding-bottom: 50px;
  .block-wrapper {
    display: flex;
    padding: 15px;
    background-color: #fff;
    > img {
      width: 60px;
      height: 60px;
      border-radius: 3px;
      background-color: #eee;
    }
    .block-info {
      flex: 1;
      margin-left: 15px;
      > div {
        line-height: 30px;
      }
    }
    .class-info {
      > div {
        line-height: 22px;
        color: #333;
      }
      .first {
        font-size: 16px;
      }
      .second {
        font-size: 13px;
        color: #bfbfbf;
      }
      .third {
        font-size: 12px;
      }
    }
    .class-over {
      line-height: 26px;
      height: 26px;
      width: 50px;
      font-size: 14px;
      margin: auto;
      text-align: center;
      vertical-align: middle;
      border-radius: 2px;
      color: #fff;
    }
  }
  .student-item {
    border-bottom: 1rpx solid #eee;
  }
  .cell-title {
    line-height: 40px;
    padding-left: 15px;
    color: #333;
    border-bottom: 1rpx solid #eee;
  }
  .van-cell__title,
  .van-cell__value {
    flex-basis: auto;
  }
}
</style>
