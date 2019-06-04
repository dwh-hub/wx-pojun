<template>
  <div class="team_class_scheduling">
    <div class="class-info-wrapper">
      <img src alt>
      <div class="class-info">
        <div class="name">{{schedulingDetail.anotherName}}</div>
        <div class="duration">时长：{{schedulingDetail.timeSpan || ''}}分钟</div>
      </div>
    </div>
    <van-cell-group custom-class="van-cell-group">
      <van-cell
        title="场地"
        @click="showVenue"
        :value="schedulingDetail.venueNameArray?schedulingDetail.venueNameArray[0]:schedulingDetail.venueName"
        is-link
      />
      <van-cell title="课程时长" :value="(schedulingDetail.timeSpan|| '--') + '分钟'"/>
      <van-cell title="教练" is-link @click="showCoachPopup = true" :value="selectedCoachStr"/>
    </van-cell-group>
    <div class="cell-subtitle">课程排期</div>
    <van-cell-group custom-class="van-cell-group">
      <van-cell title="课程日期" @click="changeClassDate" :value="classDate" is-link/>
      <van-cell
        title="开始时间"
        @click="showTimePopup = true;timeType='start'"
        :value="classStartTime"
        is-link
      />
      <van-cell
        title="结束时间"
        @click="showTimePopup = true;timeType='end'"
        :value="classEndTime"
        is-link
      />
      <div class="item-cell">
        <div class="cell-left">是否预约</div>
        <div class="cell-right">
          <van-radio-group :value="isAppoint" @change="onChangeAppoint" custom-class="radio-group">
            <van-radio :checked-color="themeColor" custom-class="radio" name="1">是</van-radio>
            <van-radio :checked-color="themeColor" custom-class="radio" name="2">否</van-radio>
          </van-radio-group>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group custom-class="van-cell-group" v-if="isAppoint == 1">
      <div class="item-cell">
        <div class="cell-left">是否预约才能上课</div>
        <div class="cell-right">
          <van-radio-group
            :value="isAppointAttend"
            @change="onChangeAppointAttend"
            custom-class="radio-group"
          >
            <van-radio :checked-color="themeColor" custom-class="radio" name="1">是</van-radio>
            <van-radio :checked-color="themeColor" custom-class="radio" name="2">否</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="item-cell">
        <div class="cell-left">最小上课人数</div>
        <input type="text" class="cell-right" v-model="schedulingDetail.minPeople">
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
      <div class="item-cell">
        <div class="cell-left">最大上课人数</div>
        <input type="text" class="cell-right" v-model="schedulingDetail.maxPeople">
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
      <div class="item-cell">
        <div class="cell-left">预约截止时间</div>
        <input type="text" class="cell-right" v-model="schedulingDetail.stopAppoint"> 分钟
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
      <div class="item-cell">
        <div class="cell-left">预约开始时间</div>
        <input type="text" class="cell-right" v-model="schedulingDetail.advanceAppoint"> 分钟
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
    </van-cell-group>

    <div class="save-btn" :style="{backgroundColor: themeColor}" @click="addTeamSchedule">保存</div>

    <van-popup
      :show="showDatePopup"
      @close="showDatePopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%;"
    >
      <van-datetime-picker
        type="date"
        :value="currentDateStamp"
        :min-date="currentDateStamp"
        @confirm="changeDate"
      />
    </van-popup>

    <van-popup
      :show="showTimePopup"
      @close="showTimePopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%;"
    >
      <van-datetime-picker type="time" :value="currentTime" @confirm="changeTime"/>
    </van-popup>

    <van-popup
      :show="showCoachPopup"
      @close="showCoachPopup = false"
      :duration="200"
      overlay-style="background-color:rgba(0,0,0,0.6);"
      position="bottom"
      custom-style="width:100%;max-height: 50vh;"
      :z-index="101"
    >
      <div class="action-list">
        <div
          class="action-item coach-popup-item"
          v-for="(item, index) in coachList"
          :key="index"
          @click="selectCoach(item, index)"
        >
          <div class="coach-cover">
            <!-- <img :src="item.headImgPath" alt> -->
            <image :src="item.headImgPath" mode="aspectFill"></image>
          </div>
          <div class="text">{{item.userName}}</div>
          <div class="icon" v-if="item.isSelect">
            <van-icon name="checked" color="#07c160" size="2em"/>
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup
      :show="showVenuePopup"
      @close="showVenuePopup = false"
      :duration="200"
      overlay-style="background-color:rgba(0,0,0,0.6);"
      position="bottom"
      custom-style="width:100%"
      :z-index="101"
      @click="selectVenue"
    >
      <div class="action-list">
        <div class="action-item" v-for="(item, index) in venueList" :key="index">
          <div class="text">{{item.venueName}}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  debounce
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      type: "",
      /* 单日排期参数 */
      teamTempStoreId: 0,
      storeId: 0,
      schedullingType: "",
      /* 修改 */
      teamScheduleId: 0,
      /* ---- */
      schedulingDetail: {},
      coachList: [],
      selectedCoachStr: "",
      selectedCoachIdStr: "",
      venueList: [],
      setup: {},
      showDatePopup: false,
      showTimePopup: false,
      showCoachPopup: false,
      showVenuePopup: false,
      actionList: [],
      currentDateStamp: new Date().getTime(),
      timeType: "",
      currentTime: "00:00",
      classDate: formatDate(new Date(), "yyyy-MM-dd"),
      classStartTime: "00:00",
      classEndTime: "23:59",
      isAppoint: "1", // 是否预约
      isAppointAttend: "1" // 是否预约才能上课
    };
  },
  onLoad(options) {
    if (options.teamTempStoreId) {
      this.teamTempStoreId = options.teamTempStoreId;
      this.storeId = options.storeId;
    }
    if(options.teamScheduleId) {
      this.teamScheduleId = options.teamScheduleId
      this.storeId = options.storeId;
    }
    this.type = options.type
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    setNavTab();
    if(this.type == "single") {
      this.getSchedulingDetail();
      this.getVenueList();
    }
    if(this.type == "modify") {
      this.getTeamSchedule()
    }
    this.getCoachList();
  },
  mixins: [colorMixin],
  methods: {
    showVenue() {
      if(this.type == "modify") {
        return
      }
      this.showVenuePopup = true
    },
    changeDate(e) {
      this.currentDateStamp = e.mp.detail;
      this.classDate = formatDate(new Date(e.mp.detail), "yyyy-MM-dd");
      this.showDatePopup = false;
    },
    changeTime(e) {
      this.currentTime = e.mp.detail;
      if (this.timeType == "start") {
        this.classStartTime = e.mp.detail;
        let EndTime =
          Number(e.mp.detail.split(":")[0]) +
          1 +
          ":" +
          e.mp.detail.split(":")[1];
        this.classEndTime = EndTime.length == 4 ? "0" + EndTime : EndTime;
      } else {
        if (
          new Date(this.classDate + " " + e.mp.detail).getTime() <
          new Date(this.classDate + " " + this.classStartTime).getTime()
        ) {
          return wx.showModal({
            title: "提示",
            content: "结束时间必须大于开始时间",
            showCancel: false
          });
        }
        this.classEndTime = e.mp.detail;
      }
      this.showTimePopup = false;
    },
    getSchedulingDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamTempStore/getOne",
        data: {
          teamTempStoreId: that.teamTempStoreId
        },
        success(res) {
          if (res.data.code == 200) {
            // TODO:
            // if(!res.data.data.masterImg) {
            res.data.data.masterImg = window.api + "/assets/img/morenImg.png";
            // }
            res.data.data.venueId = res.data.data.venueIdIntArray[0];
            that.isAppoint = res.data.data.isNeedAppoint == 0 ? "2" : "1";
            that.isAppointAttend = res.data.data.isNeedAppoint == 1 ? "1" : "2";
            that.schedulingDetail = res.data.data;
          }
        }
      });
    },
    getTeamSchedule() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/getOne",
        data: {
          teamScheduleId: that.teamScheduleId
        },
        success(res) {
          if (res.data.code == 200) {
            // TODO:
            // if(!res.data.data.masterImg) {
            res.data.data.masterImg = window.api + "/assets/img/morenImg.png";
            // }
            that.isAppoint = res.data.data.isNeedAppoint == 0 ? "2" : "1";
            that.isAppointAttend = res.data.data.isNeedAppoint == 1 ? "1" : "2";
            that.classDate = formatDate(new Date(res.data.data.timeStart), "yyyy-MM-dd")
            that.classStartTime = formatDate(new Date(res.data.data.timeStart), "hh:mm")
            that.classEndTime = formatDate(new Date(res.data.data.timeEnd), "hh:mm")
            that.selectedCoachStr = res.data.data.coachNameArray.join(',')
            that.selectedCoachIdStr = res.data.data.coachIdIntArray.join(',')
            
            that.schedulingDetail = res.data.data;
          }
        }
      });
    },
    getCoachList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/register/userofrole",
        data: {
          storeId: that.storeId,
          positionType: 1
        },
        success(res) {
          if (res.data.code == 200) {
            that.coachList = res.data.data.map(e => {
              if (e.headImgPath) {
                e.headImgPath = window.api + e.headImgPath;
              } else {
                e.headImgPath = window.api + "/assets/img/morenTo.png";
              }
              e["isSelect"] = false;
              return e;
            });
          }
        }
      });
    },
    getStoreSetup() {
      let that = this;
      HttpRequest({
        url: window.api + "/system/setup/store/query",
        data: {
          storeId: ""
        },
        success(res) {
          if (res.data.code == 200) {
            that.setup = res.data.data;
          }
        }
      });
    },
    getVenueList() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/getVenue",
        data: {
          storeId: that.storeId,
          teamTempStoreId: that.teamTempStoreId
        },
        success(res) {
          if (res.data.code == 200) {
            that.venueList = res.data.data;
          }
        }
      });
    },
    selectCoach(item, index) {
      if (this.selectedCoachStr.indexOf(item.userName) == -1) {
        this.selectedCoachStr = this.selectedCoachStr + item.userName + ",";
        this.selectedCoachIdStr = this.selectedCoachIdStr + item.userId + ",";
        this.coachList[index].isSelect = true;
      } else {
        this.coachList[index].isSelect = false;
        this.selectedCoachStr = this.selectedCoachStr.replace(
          new RegExp(item.userName + ",", "g"),
          ""
        );
        this.selectedCoachIdStr = this.selectedCoachIdStr.replace(
          new RegExp(item.userId + ",", "g"),
          ""
        );
      }
    },
    selectVenue(item) {
      this.schedulingDetail.venueNameStr = item.venueName;
      this.schedulingDetail.venueId = item.venueId;
      this.showVenuePopup = false;
    },
    onChangeAppoint(event) {
      this.isAppoint = event.mp.detail;
      this.getIsNeedAppoint();
    },
    onChangeAppointAttend(event) {
      this.isAppointAttend = event.mp.detail;
      this.getIsNeedAppoint();
    },
    getIsNeedAppoint() {
      if (this.isAppoint == 1 && this.isAppointAttend == 1) {
        this.schedulingDetail.isNeedAppoint = 1;
      } else if (this.isAppoint == 1 && this.isAppointAttend == 2) {
        this.schedulingDetail.isNeedAppoint = 2;
      } else if (this.isAppoint == 2 && this.isAppointAttend == 2) {
        this.schedulingDetail.isNeedAppoint = 0;
      }
    },
    changeClassDate() {
      this.showDatePopup = true;
    },
    addTeamSchedule() {
      let that = this;
      if (this.selectedCoachIdStr == "") {
        return wx.showModal({
          title: "提示",
          content: "请选择上课教练",
          showCancel: false
        });
      }
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/add",
        data: {
          storeId: that.storeId,
          teamTempStoreId: that.teamTempStoreId,
          coachIdArray: that.selectedCoachIdStr,
          venueId: that.schedulingDetail.venueId,
          isNeedAppoint: that.schedulingDetail.isNeedAppoint,
          minPeople: that.schedulingDetail.minPeople,
          maxPeople: that.schedulingDetail.maxPeople,
          stopAppoint: that.schedulingDetail.stopAppoint,
          advanceAppoint: that.schedulingDetail.advanceAppoint,
          teamScheduleTimeJsonStr: [
            {
              calendar: that.classDate + " 00:00:00",
              timeStart: that.classDate + " " + that.classStartTime + ":00",
              timeEnd: that.classDate + " " + that.classEndTime + ":00"
            }
          ]
        },
        success(res) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
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
.team_class_scheduling {
  padding-bottom: 50px;
  .class-info-wrapper {
    display: flex;
    padding: 15px;
    background-color: #fff;
    > img {
      width: 60px;
      height: 60px;
      background-color: #eee;
    }
    .class-info {
      flex: 1;
      margin-left: 15px;
      > div {
        line-height: 30px;
      }
    }
  }
  .item-cell {
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
  }
  .cell-subtitle {
    padding-left: 15px;
    line-height: 36px;
    color: #999;
  }
  .save-btn {
    position: fixed;
    bottom: 0;
    left: 0px;
    line-height: 46px;
    font-size: 16px;
    width: 100%;
    text-align: center;
    color: #fff;
    z-index: 5;
  }
  .action-list {
    max-height: 50vh;
    .action-item {
      border-top: 1rpx solid #eee;
      line-height: 48px;
      text-align: center;
      .coach-cover {
        width: 40px;
        height: 40px;
        border-radius: 3px;
        margin: 0 15px;
        > image {
          width: 100%;
          height: 100%;
        }
      }
      .icon {
        float: right;
        margin-right: 30px;
        .van-icon {
          vertical-align: middle;
        }
      }
      > div {
        display: inline-block;

        vertical-align: middle;
      }
    }
    .coach-popup-item {
      text-align: left;
      padding: 5px 0;
    }
  }
  .item-cell {
    .van-icon {
      vertical-align: middle;
    }
    .radio {
      margin: 0 5px !important;
    }
  }
}
</style>
