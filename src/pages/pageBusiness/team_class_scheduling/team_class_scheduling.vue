<template>
  <div class="team_class_scheduling" :class="{'isPhoneX-wrap': isPhoneX}">
    <div class="class-info-wrapper">
      <img :src="schedulingDetail.masterImg" alt>
      <div class="class-info">
        <div class="name">{{schedulingDetail.anotherName}}</div>
        <div class="duration">时长：{{schedulingDetail.timeSpan || ''}}分钟</div>
      </div>
      <div v-if="type == 'modify'" class="delete-class" @click="deleteClass">删除</div>
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
    <div class="batch-time" v-if="type == 'batch'">
      <van-cell
        title="开始日期"
        @click="showDatePopup = true; dateType='startDate'"
        :value="classStartDate"
        is-link
      />
      <van-cell
        title="结束日期"
        @click="showDatePopup = true; dateType='endDate'"
        :value="classEndDate"
        is-link
      />
      <div class="shcheduling-date" v-if="batchStartTime">
        <div class="time">{{batchStartTime}} - {{batchEndTime}}</div>
        <div class="date">{{batchWeekStr}}</div>
      </div>
      <div class="add-time-btn" @click="addSchedulingTime" :style="{color: themeColor}">{{batchStartTime ? '修改':'新增'}}课程时间</div>  
    </div>
    <van-cell-group custom-class="van-cell-group" v-else>
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
    </van-cell-group>
    <div class="item-cell">
      <div class="cell-left">是否可以重复上课</div>
      <div class="cell-right">
        <van-radio-group :value="isLimitAttendTimes" @change="onChangeLimitAttend" custom-class="radio-group">
          <van-radio :checked-color="themeColor" custom-class="radio" name="0">是</van-radio>
          <van-radio :checked-color="themeColor" custom-class="radio" name="1">否</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="item-cell">
      <div class="cell-left">是否预约</div>
      <div class="cell-right">
        <van-radio-group :value="isAppoint" @change="onChangeAppoint" custom-class="radio-group">
          <van-radio :checked-color="themeColor" custom-class="radio" name="1">是</van-radio>
          <van-radio :checked-color="themeColor" custom-class="radio" name="2">否</van-radio>
        </van-radio-group>
      </div>
    </div>

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
        <input type="text" class="cell-right" v-model.lazy="schedulingDetail.minPeople">
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
      <div class="item-cell">
        <div class="cell-left">最大上课人数</div>
        <input type="text" class="cell-right" v-model.lazy="schedulingDetail.maxPeople">
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
      <div class="item-cell">
        <div class="cell-left">预约截止时间</div>
        <input type="text" class="cell-right" v-model.lazy="schedulingDetail.stopAppoint"> 分钟
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
      <div class="item-cell">
        <div class="cell-left">预约开始时间</div>
        <input type="text" class="cell-right" v-model.lazy="schedulingDetail.advanceAppoint"> 分钟
        <van-icon name="arrow" color="#999999" size="1.2em"/>
      </div>
    </van-cell-group>

    <div class="item-cell" v-if="isAppoint == 1">
      <div class="cell-left">是否预约团课座位:</div>
      <div class="cell-right">
        <van-radio-group :value="isPlanSeat" @change="onChangeSeat" custom-class="radio-group">
          <van-radio :checked-color="themeColor" custom-class="radio" name="1">是</van-radio>
          <van-radio :checked-color="themeColor" custom-class="radio" name="0">否</van-radio>
        </van-radio-group>
      </div>
    </div>
    <van-cell-group v-if="isAppoint == 1 && isPlanSeat == 1">
      <van-cell title="座位模板" is-link @click="showSeatPopop = true" :value="selectedSeatChar"/>
    </van-cell-group>

    <div class="save-btn" :style="{backgroundColor: themeColor}" @click="save">
      保存
      <div class="block" v-if="isPhoneX"></div>
    </div>

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
        :min-date="minDate"
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
            <van-icon name="checked" :color="themeColor" size="2em"/>
          </div>
        </div>
        <div class="block" v-if="isPhoneX"></div>
        <div class="action-sure" :style="{'background-color': themeColor}" @click="showCoachPopup = false">确认</div>
      </div>
    </van-popup>
    <!-- 场馆列表 -->
    <van-popup
      :show="showVenuePopup"
      @close="showVenuePopup = false"
      :duration="200"
      overlay-style="background-color:rgba(0,0,0,0.6);"
      position="bottom"
      custom-style="width:100%"
      :z-index="101"
    >
      <div class="action-list" style="padding-bottom: 0px;">
        <div class="action-item" @click="selectVenue(item)" v-for="(item, index) in venueList" :key="index">
          <div class="text">{{item.venueName}}</div>
        </div>
      </div>
    </van-popup>
    <!-- 座位列表 -->
    <van-popup
      :show="showSeatPopop"
      @close="showSeatPopop = false"
      :duration="200"
      overlay-style="background-color:rgba(0,0,0,0.6);"
      position="bottom"
      custom-style="width:100%"
      :z-index="101"
    >
      <div class="action-list" style="padding-bottom: 0px;">
        <div class="action-item" @click="selectSeat(item)" v-for="(item, index) in seatList" :key="index">
          <div class="text">{{item.seatName}}</div>
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
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import { setTimeout } from 'timers';
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
      minDate: new Date().getTime(),
      currentDateStamp: new Date().getTime(),
      timeType: "", // 控制时间选择
      dateType: "", // 控制日期选择
      currentTime: "00:00",
      classDate: formatDate(new Date(), "yyyy-MM-dd"),
      classStartTime: "00:00",
      classEndTime: "23:59",
      /* 批量排期日期 */
      classStartDate: formatDate(new Date(), "yyyy-MM-dd"),
      classEndDate: "",
      batchStartTime: "",
      batchEndTime: "",
      batchWeek: [],
      batchWeekStr: "",
       /* 批量排期日期 */
      isLimitAttendTimes: "1",
      isAppoint: "1", // 是否预约
      isAppointAttend: "1", // 是否预约才能上课
      showSeatPopop: false, // 显示座位列表
      seatList: [],
      isPlanSeat: "0", // 是否选择座位
      selectedSeatChar: "", // 选择的座位模板
      teamSeatId: "" // 选择的座位模板Id
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
    if (this.type == "modify"){
      setNavTab('修改团课')
    }
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    if(store.state.classStartTime) {
      this.batchStartTime = store.state.classStartTime
      this.batchEndTime = store.state.classEndTime
      this.batchWeek = store.state.schedulingWeekArr.sort(function(a,b){
        return Number(a) - Number(b);
      })
      let _weekStr = ''
      this.batchWeek.forEach(e => {
        if(e == 1) {
          _weekStr += '星期一,'
        }if(e == 2) {
          _weekStr += '星期二,'
        }if(e == 3) {
          _weekStr += '星期三,'
        }if(e == 4) {
          _weekStr += '星期四,'
        }if(e == 5) {
          _weekStr += '星期五,'
        }if(e == 6) {
          _weekStr += '星期六,'
        }if(e == 0) {
          _weekStr += '星期日,'
        }
      });
      this.batchWeekStr = _weekStr
    }
  },
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    }
  },
  mounted() {
    setNavTab();
    if(this.type == "modify") {
      this.getTeamSchedule()
    } else {
      this.getSchedulingDetail();
      this.getVenueList();
      this.getCoachList();
    }
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
      // console.log('e.mp.detail:'+formatDate(new Date(e.mp.detail), "yyyy-MM-dd"))
      // console.log('this.classStartDate:'+this.classStartDate)
      // console.log('e.mp.detail:'+new Date(e.mp.detail).getTime())
      // console.log('this.classStartDate:'+new Date(this.classStartDate).getTime())

      if(this.dateType == 'startDate') {
        this.classStartDate =  formatDate(new Date(e.mp.detail), "yyyy-MM-dd");
      }
      if(this.dateType == 'endDate') {
        if(new Date(e.mp.detail).getTime() < new Date(this.classStartDate.replace(/-/g, "/")+' 00:00:00').getTime()) {
          return wx.showModal({
            title: "提示",
            content: "结束时间必须大于开始时间",
            showCancel: false
          });
        }
        this.classEndDate = formatDate(new Date(e.mp.detail), "yyyy-MM-dd");
      }
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
          new Date(this.classDate.replace(/-/g, "/") + " " + e.mp.detail).getTime() <
          new Date(this.classDate.replace(/-/g, "/") + " " + this.classStartTime).getTime()
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
    // 获取排期详情
    getSchedulingDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamTempStore/getOne",
        data: {
          teamTempStoreId: that.teamTempStoreId
        },
        success(res) {
          if (res.data.code == 200) {
            let data = res.data.data
            if(!data.masterImg) {
              data.masterImg = window.api + "/assets/img/morenImg.png";
            } else {
              data.masterImg = window.api + data.masterImg
            }
            data.venueId = data.venueIdIntArray[0];
            that.isAppoint = data.isNeedAppoint == 0 ? "2" : "1";
            that.isAppointAttend = data.isNeedAppoint == 1 ? "1" : "2";
            that.schedulingDetail = res.data.data;
            that.getSeatList()
          }
        }
      });
    },
    // 获取座位模板列表
    getSeatList() {
      let that = this
      HttpRequest({
        url: '/teamClass/seat/pages_nolimit',
        data: {
          storeId: that.storeId,
          venueId: that.schedulingDetail.venueId,
          status: 0,
          pageSize: 100
        },
        success(res) {
          that.seatList = res.data.data.result
          if (that.teamSeatId) {
            that.seatList.forEach(e => {
              if (e.teamSeatId == that.teamSeatId) {
                that.selectedSeatChar = e.seatName
              }
            })
          }
        }
      })
    },
    // 选择座位模板
    selectSeat(item) {
      this.selectedSeatChar = item.seatName
      this.teamSeatId = item.teamSeatId
      this.showSeatPopop = false
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
            let data = res.data.data
            if(!data.masterImg) {
              data.masterImg = window.api + "/assets/img/morenImg.png";
            } else {
              data.masterImg = window.api + data.masterImg
            }
            that.isAppoint = data.isNeedAppoint == 0 ? "2" : "1";
            that.isAppointAttend = data.isNeedAppoint == 1 ? "1" : "2";
            that.classDate = formatDate(new Date(data.timeStart), "yyyy-MM-dd")
            that.classStartTime = formatDate(new Date(data.timeStart), "hh:mm")
            that.classEndTime = formatDate(new Date(data.timeEnd), "hh:mm")
            that.selectedCoachStr = data.coachNameArray.join(',')
            that.selectedCoachIdStr = data.coachIdIntArray.join(',')
            that.isPlanSeat = String(data.isPlanSeat)
            that.teamSeatId = data.teamSeatId
            
            that.schedulingDetail = data;

            that.getCoachList()
            that.getSeatList()
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
              that.selectedCoachStr.indexOf(e.userName) > -1 ? e["isSelect"] = true:e["isSelect"] = false 
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
    onChangeLimitAttend(event) {
      this.isLimitAttendTimes = event.mp.detail;
    },
    onChangeAppoint(event) {
      this.isAppoint = event.mp.detail;
      if (this.isAppoint == "2") {
        this.isAppointAttend = "2"
        this.isPlanSeat = "0"
      }
      this.getIsNeedAppoint();
    },
    onChangeSeat(event) {
      this.isPlanSeat = event.mp.detail;
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
    save() {
      if (this.isAppoint == 1) {
        if (!this.teamSeatId && this.isPlanSeat == 1) {
          return wx.showModal({
            title: "提示",
            content: "请选择座位模板",
            showCancel: false
          });
        }
        if (!this.schedulingDetail.minPeople && this.schedulingDetail.minPeople !== "" && this.schedulingDetail.minPeople != 0) {
          return wx.showModal({
            title: "提示",
            content: "请填写最小上课人数",
            showCancel: false
          });
        }
        if (!this.schedulingDetail.maxPeople && this.schedulingDetail.maxPeople !== "" && this.schedulingDetail.maxPeople != 0) {
          return wx.showModal({
            title: "提示",
            content: "请填写最大上课人数",
            showCancel: false
          });
        }
        if (!this.schedulingDetail.stopAppoint && this.schedulingDetail.stopAppoint !== "" && this.schedulingDetail.stopAppoint != 0) {
          return wx.showModal({
            title: "提示",
            content: "请填写预约截止时间",
            showCancel: false
          });
        }
        if (!this.schedulingDetail.advanceAppoint && this.schedulingDetail.advanceAppoint !== "" && this.schedulingDetail.advanceAppoint != 0) {
          return wx.showModal({
            title: "提示",
            content: "请填写预约开始时间",
            showCancel: false
          });
        }
      }
      if(this.type == "modify") {
        this.updateSchedule()
      } else {
        this.addTeamSchedule()
      }
    },
    // 排期
    addTeamSchedule() {
      let that = this;
      if (this.selectedCoachIdStr == "") {
        return wx.showModal({
          title: "提示",
          content: "请选择上课教练",
          showCancel: false
        });
      }
      let _timeStr
      if(this.type == "batch") {
        if (!this.classEndDate) {
          return wx.showModal({
            title: "提示",
            content: "请选择结束日期",
            showCancel: false
          });
        }
        _timeStr = this.eachTime(this.batchStartTime,this.batchEndTime)
        if (!_timeStr.length) {
          return wx.showModal({
            title: "提示",
            content: "请选择课程时间",
            showCancel: false
          });
        }
      } else {
        _timeStr = [
            {
              calendar: that.classDate + " 00:00:00",
              timeStart: that.classDate + " " + that.classStartTime + ":00",
              timeEnd: that.classDate + " " + that.classEndTime + ":00"
            }
          ]
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
          teamScheduleTimeJsonStr: _timeStr,
          attendClassPersonLimit: that.isLimitAttendTimes,
          isPlanSeat: that.isPlanSeat,
          teamSeatId: that.teamSeatId
        },
        success(res) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false,
            success() {
              if(res.data.code == 200) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        }
      });
    },
    // 修改团课
    updateSchedule() {
      let that = this
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/update",
        data: {
          teamScheduleId: that.teamScheduleId,
          coachIdArray: that.selectedCoachIdStr,
          calendar: that.classDate + " 00:00:00",
          timeStart: that.classDate + " " + that.classStartTime + ":00",
          timeEnd: that.classDate + " " + that.classEndTime + ":00",
          isNeedAppoint: that.schedulingDetail.isNeedAppoint,
          minPeople: that.schedulingDetail.minPeople,
          maxPeople: that.schedulingDetail.maxPeople,
          stopAppoint: that.schedulingDetail.stopAppoint,
          advanceAppoint: that.schedulingDetail.advanceAppoint,
          attendClassPersonLimit: that.isLimitAttendTimes,
          isPlanSeat: that.isPlanSeat,
          teamSeatId: that.teamSeatId
        },
        success(res) {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false,
            success() {
              if(res.data.code == 200) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        }
      })
    },
    deleteClass() {
      let that = this
      wx.showModal({
        title: "提示",
        content: "是否确认删除该团课？",
        success(res) {
          if (res.confirm) {
            wx.showLoading()
            HttpRequest({
              url: '/teamClass/teamSchedule/delete',
              data: {
                teamScheduleIdArray: that.schedulingDetail.teamScheduleId
              },
              success(res) {
                wx.hideLoading()
                if(res.data.code == 200) {
                  wx.showToast({
                    title: res.data.message,
                    icon: "success",
                    duration: 1000
                  });
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 500)
                } else {
                  wx.showModal({
                    title: "提示",
                    content: res.data.message,
                    showCancel: false
                  });
                }
              }
            })
          }
        }
      });
    },
    addSchedulingTime() {
      if(this.classStartDate == "") {
        return wx.showModal({
          title: "提示",
          content: "请选择结束时间",
          showCancel: false
        });
      }
      if(this.classEndDate == "") {
        return wx.showModal({
          title: "提示",
          content: "请选择结束时间",
          showCancel: false
        });
      }
      wx.navigateTo({
        url: "../select_scheduling_date/main"
      })
    },
    eachTime(classStart,classEnd){
      console.log("classStartDate:"+this.classStartDate)
      console.log("classEndDate:"+this.classEndDate)
      var arr = []
      var teamClassWeekendArr = this.batchWeek;
      var timeStareStr = (new Date(this.classStartDate.replace(/-/g, "/"))).getTime();
      var timeEndStr = (new Date(this.classEndDate.replace(/-/g, "/"))).getTime();
      for(var i = timeStareStr ; i <= timeEndStr ; i+=86400000){
        for(var j = 0 ; j < teamClassWeekendArr.length ; j++){
          if((new Date(i)).getDay() == teamClassWeekendArr[j]){
            var contentParam = {}; 
            contentParam.calendar = formatDate(new Date(i), 'yyyy-MM-dd')+" 00:00:00";
            contentParam.timeStart = formatDate(new Date(i), 'yyyy-MM-dd')+" "+classStart+":00";
            contentParam.timeEnd = formatDate(new Date(i), 'yyyy-MM-dd')+" "+classEnd+":00"
            arr.push(contentParam);
          }
        }
      }
      return arr;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
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
    .delete-class {
      line-height:26px;
      height:26px;
      color:#fff;
      border-radius:3px;
      padding: 0 10px;
      margin-top:14px;
      background-color: #ec6c62;
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
    position: relative;
    max-height: 60vh;
    padding-bottom: 48px;
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
          border-radius: 5px;
          background-color: #eee;
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
    .action-sure {
      position: sticky;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 46px;
      text-align: center;
      color: #fff;
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
  .batch-time {
    margin-bottom: 15px;
    .shcheduling-date {
      padding: 6px 15px;
      background-color: #fff;
      border-bottom: 1rpx solid #eee;
      .time, .date {
        line-height: 24px;
      }
    }
    .add-time-btn {
      line-height: 40px;
      text-align: center;
      background-color: #fff;
    }
  }
}
</style>
