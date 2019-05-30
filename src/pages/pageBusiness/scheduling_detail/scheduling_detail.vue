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
      <van-cell title="是否预约" :value="classDetail.isNeedAppoint" is-link/>
      <van-cell title="最小上课人数" :value="classDetail.minPeople" is-link/>
      <van-cell title="最大上课人数" :value="classDetail.maxPeople" is-link/>
      <van-cell title="预约截止时间" :value="classDetail.stopAppoint" is-link/>
      <van-cell title="预约开始时间" :value="classDetail.advanceAppoint+'分钟'" is-link/>
    </van-cell-group>
    <div class="cell-title">上课列表</div>
    <div class="student-list">
      <div class="student-item block-wrapper" v-for="(item, index) in studentList" :key="index">
        <img src alt>
        <div class="class-info block-info">
          <div class="name"></div>
          <div class="duration">时长：分钟</div>
        </div>
        <div></div>
      </div>
    </div>
    <div class="fixed-bottom-btn" :style="{backgroundColor: themeColor}">新增上课学员</div>
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
            _res.isAppoint = _res.isNeedAppoint ? "是" : "否";
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
            that.studentList = res.data.data.result;
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
      background-color: #eee;
    }
    .block-info {
      flex: 1;
      margin-left: 15px;
      > div {
        line-height: 30px;
      }
    }
  }
  .cell-title {
    line-height: 40px;
    padding-left: 15px;
    color: #333;
    border-bottom: 1rpx solid #eee;
  }
}
</style>
