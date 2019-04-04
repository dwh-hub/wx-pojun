<template>
  <div class="appointment-coach" :class="{'isPhoneX-wrap':isPhoneX}">
    <div class="coach">
      <div class="cover">
        <img>
      </div>
      <div class="coach-info">
        <div class="coach-name">{{coachInfo.userName || '教练名'}}</div>
        <div
          class="coach-times"
          :style="{'color': themeColor}"
        >共授课{{(coachInfo.privateCountByCoach+coachInfo.teamCountByCoach) || '0'}}节</div>
      </div>
      <div class="tiems">
        <!-- <div class="num">$1次$</div> -->
        <!-- <div class="text">本次扣费</div> -->
      </div>
    </div>
    <div class="cell-list-sm">
      <title-cell
        title="授课门店"
        :moreText="storeCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="isStorePopup = true"
      ></title-cell>
      <title-cell
        title="预约时间"
        :moreText="timeCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="showTimePopup"
      ></title-cell>
    </div>

    <div class="cell-list-lg">
      <title-cell
        title="扣费合同"
        :moreText="cardCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="showCardPopop"
      ></title-cell>
      <!-- <title-cell title="预约备注" moreText="请选择" :moreSize="14" :titleSize="16"></title-cell> -->
    </div>

    <div class="cell-list-sm">
      <title-cell
        title="预约场馆"
        :moreText="venueCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="showVenuePopup"
      ></title-cell>
      <title-cell
        title="预约项目"
        :moreText="projectCellText"
        :moreSize="14"
        :titleSize="16"
        @tapMore="showProjectPopup"
      ></title-cell>
    </div>

    <!-- 选择场馆 -->
    <van-popup
      class="venue-pop"
      :show="isVenuePopup"
      position="bottom"
      @close="isVenuePopup = false"
    >
      <div class="pop-title">
        <span>请选择本次消费的场馆</span>
        <img src="/static/images/icon-close.png" @click="isVenuePopup = false">
      </div>
      <div class="venue-list">
        <div
          class="venue-popup-item"
          @click="selectVenue(item)"
          v-for="(item, index) in venueList"
          :key="index"
        >{{item.venueName}}</div>
      </div>
    </van-popup>

    <!-- 选择项目 -->
    <van-popup
      class="project-pop"
      :show="isProjectPopup"
      position="bottom"
      @close="isProjectPopup = false"
    >
      <div class="pop-title">
        <span>请选择本次消费的项目</span>
        <img src="/static/images/icon-close.png" @click="isProjectPopup = false">
      </div>
      <div class="project-list">
        <div
          class="project-popup-item"
          @click="selectProject(item)"
          v-for="(item, index) in projectList"
          :key="index"
        >{{item.projectName}}</div>
      </div>
    </van-popup>

    <!-- 选择门店弹出框 -->
    <van-popup
      class="store-pop"
      :show="isStorePopup"
      position="bottom"
      @close="isStorePopup = false"
    >
      <div class="pop-title">
        <span>请选择授课门店</span>
        <img src="/static/images/icon-close.png" @click="isStorePopup = false">
      </div>
      <div class="store-list">
        <div
          class="store-popup-item"
          @click="selectStore(item)"
          v-for="(item, index) in storeList"
          :key="index"
        >
          <div class="cover">
            <img>
          </div>
          <div class="store-info">
            <div class="name">
              {{item.storeName}}
              <!-- <span class="range">0.81km*</span> -->
            </div>
            <div class="address">{{item.address || '暂无详细地址'}}</div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 选择时间弹出框 -->
    <van-popup
      class="time-pop"
      custom-style="width: 100%;height: 100vh;"
      :show="isTimePopup"
      position="bottom"
      @close="isTimePopup = false"
    >
      <div class="date-group">
        <div class="date-group-header">
          <div class="pop-title">
            <span>选择开始时间</span>
            <img src="/static/images/icon-close.png" @click="isTimePopup = false">
          </div>
          <select-date @selectWeek="onDate"></select-date>
        </div>
        <div class="specific-date">
          <div class="morning">
            <div class="date-header">
              <h5>上午</h5>
              <div class="mini-data" v-show="showMiniIndex == 1">
                <div
                  class="mini"
                  v-for="(item,index) in miniDate"
                  :key="index"
                  @click="selectHour(item)"
                  :class="{active: item == curTime}"
                >{{item}}</div>
              </div>
            </div>
            <div class="hours">
              <div
                class="hour"
                v-for="(item, index) in morningTimes"
                :class="{active: (item.hour == curTime || item.hour == curEndTime), disable: item.disable}"
                :key="index"
                @click="selectHour(item,1)"
              >{{item.hour}}</div>
            </div>
          </div>
          <div class="noon">
            <div class="date-header">
              <h5>中午</h5>
              <div class="mini-data" v-show="showMiniIndex == 2">
                <div
                  class="mini"
                  v-for="(item,index) in miniDate"
                  :key="index"
                  @click="selectHour(item)"
                  :class="{active: item == curTime}"
                >{{item}}</div>
              </div>
            </div>
            <div class="hours">
              <div
                class="hour"
                v-for="(item, index) in noonTimes"
                :class="{active: (item.hour == curTime || item.hour == curEndTime), disable: item.disable}"
                @click="selectHour(item,2)"
                :key="index"
              >{{item.hour}}</div>
            </div>
          </div>
          <div class="afternoon">
            <div class="date-header">
              <h5>下午</h5>
              <div class="mini-data" v-show="showMiniIndex == 3">
                <div
                  class="mini"
                  v-for="(item,index) in miniDate"
                  :key="index"
                  @click="selectHour(item)"
                  :class="{active: item == curTime}"
                >{{item}}</div>
              </div>
            </div>
            <div class="hours">
              <div
                class="hour"
                v-for="(item, index) in afternoonTimes"
                :class="{active: (item.hour == curTime || item.hour == curEndTime), disable: item.disable}"
                @click="selectHour(item,3)"
                :key="index"
              >{{item.hour}}</div>
            </div>
          </div>
          <div class="afternoon">
            <div class="date-header">
              <h5>晚上</h5>
              <div class="mini-data" v-show="showMiniIndex == 4">
                <div
                  class="mini"
                  v-for="(item,index) in miniDate"
                  :key="index"
                  @click="selectHour(item)"
                  :class="{active: item == curTime}"
                >{{item}}</div>
              </div>
            </div>
            <div class="hours">
              <div
                class="hour"
                v-for="(item, index) in nightTime"
                :class="{active: (item.hour == curTime || item.hour == curEndTime), disable: item.disable}"
                @click="selectHour(item,4)"
                :key="index"
              >{{item.hour}}</div>
            </div>
          </div>
        </div>
        <div class="date-group-footer">
          <div class="tips">
            <div class="already">
              <span class="already-block"></span>
              <span>已选择</span>
            </div>
            <div class="can">
              <span class="can-block"></span>
              <span>可预约</span>
            </div>
            <div class="none">
              <span class="none-block"></span>
              <span>不可预约</span>
            </div>
          </div>
          <div
            class="confirm-date"
            :style="{'background-color': themeColor}"
            @click="selectDate"
          >确定（{{confirmDate}}）</div>
        </div>
      </div>
    </van-popup>

    <!-- 选择消费合同 -->
    <van-popup class="cards-pop" :show="isCardPopup" position="bottom" @close="isCardPopup = false">
      <div class="pop-title">
        <span>请选择本次消费合同</span>
        <img src="/static/images/icon-close.png" @click="isCardPopup = false">
      </div>
      <div class="cards-list">
        <div
          class="cards-popup-item"
          @click="selectCard(item)"
          v-for="(item, index) in cardList"
          :key="index"
        >
          <div class="cover">
            <img>
          </div>
          <div class="cards-info">
            <div class="name">
              {{item.cardClassName}}
              <span>{{item.masterClassName}}</span>
            </div>
            <div class="times">使用权益：{{item.balanceAuthority}}{{item.authorityUnit}}</div>
            <div class="date">结束日期：{{item.doomsday}}</div>
          </div>
        </div>
      </div>
    </van-popup>

    <div
      class="bottom-btn appoint-coach"
      @click="appointCoach"
      :style="{'background-color': themeColor}"
    >
      发起预约
      <div class="block" v-if="isPhoneX"></div>
    </div>
  </div>
</template>

<script>
import {
  setNavTab,
  formatDate,
  window,
  HttpRequest
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import selectDate from "COMPS/selectDate.vue";
import store from "../../utils/store";

export default {
  name: "appointment-coach",
  data() {
    return {
      // 门店选择文本
      storeCellText: "请选择",
      // 时间选择文本
      timeCellText: "请选择",
      // 合同选择文本
      cardCellText: "请选择",
      // 场馆选择文本
      venueCellText: "请选择",
      // 项目选择文本
      projectCellText: "请选择",
      // 门店弹窗
      isStorePopup: false,
      // 时间弹窗
      isTimePopup: false,
      // 合同弹窗
      isCardPopup: false,
      // 场馆弹窗
      isVenuePopup: false,
      // 项目弹窗
      isProjectPopup: false,
      // 开店时间
      openTimeStart: "09:40:20",
      // 关店时间
      openTimeEnd: "22:00:00",
      morningTimes: [],
      noonTimes: [],
      afternoonTimes: [],
      nightTime: [],
      // 当前选择的日期
      curDate: "",
      // 点击选择的时间
      curTime: "",
      // 点击选择的时间的结束时间
      curEndTime: "",
      coachId: "",
      // 可使用合同列表
      cardList: [],
      // 授课门店列表
      storeList: [],
      // 场馆列表
      venueList: [],
      // 项目列表
      projectList: [],
      // 当前登录客户信息
      userInfo: "",
      // 预约的参数
      // 门店id
      selectStoreId: "",
      // 合同id
      selectCardId: "",
      // 合同 cardClassId
      cardClassId: "",
      // 场馆id
      venueId: "",
      // 项目id
      projectId: "",
      // 教练信息
      coachInfo: {},
      // 小时间段
      miniDate: [],
      // 小时间段显示位置 1 上午 2 中午 3 下午 4 晚上
      showMiniIndex: 0,
      // 不能预约的时间
      todayPeriodTime: []
    };
  },
  components: {
    titleCell,
    selectDate
  },
  onLoad(option) {
    // 进页面前先清空数据
    Object.assign(this.$data, this.$options.data())
    this.coachId = option.coachId;
    this.userInfo = wx.getStorageSync("userInfo");
    setNavTab();
  },
  mounted() {
    this.getCoachDetail();
    // this.computedTime();
    this.curDate = formatDate(new Date(), "yyyy-MM-dd");
    this.getCardList();
    this.getStoreList();
    this.getPeriodTime();
  },
  computed: {
    isPhoneX() {
      return store.state.isIphoneX;
    },
    confirmDate() {
      if (this.curEndTime) {
        return this.curDate + " " + this.curTime + "~" + this.curEndTime;
      }
      return "";
    },
    themeColor() {
      return window.color;
    }
  },
  methods: {
    // 时间
    showTimePopup() {
      if (!this.selectStoreId) {
        return wx.showModal({
          title: "提示",
          content: "请先选择门店",
          showCancel: false
        });
      }
      this.isTimePopup = true;
    },
    // 合同
    showCardPopop() {
      if(!this.selectStoreId) {
        return wx.showModal({
          title: "提示",
          content: "请先选择门店",
          showCancel: false
        });
      }
      if (!this.cardList.length) {
        return wx.showModal({
          title: "提示",
          content: "未找到可消费合同",
          showCancel: false
        });
      }
      this.isCardPopup = true;
    },
    // 场馆
    showVenuePopup() {
      if (!this.selectStoreId || !this.selectCardId) {
        return wx.showModal({
          title: "提示",
          content: "请先选择门店和合同",
          showCancel: false
        });
      }
      if (this.selectStoreId && this.selectCardId && !this.venueList.length) {
        return wx.showModal({
          title: "提示",
          content: "该合同无消费的场馆，不可预约",
          showCancel: false
        });
      }
      this.isVenuePopup = true;
    },
    // 项目
    showProjectPopup() {
      if (!this.venueId) {
        return wx.showModal({
          title: "提示",
          content: "请先选择场馆",
          showCancel: false
        });
      }
      if (
        this.selectStoreId &&
        this.selectCardId &&
        this.venueId &&
        !this.venueList.length
      ) {
        return wx.showModal({
          title: "提示",
          content: "未找到可消费的项目，不可预约",
          showCancel: false
        });
      }
      this.isProjectPopup = true;
    },
    // 选择时间
    selectHour(item, index) {
      if(item.disable && item.hour) {
        return
      }
      let _item
      if(item.hour) {
        _item = item.hour
      } else {
        _item = item
      }
      this.curTime = _item;
      this.showMiniIndex = index;
      let hour = _item.slice(0, 2);
      this.miniDate = [hour + ":15", hour + ":30", hour + ":45"];
      // this.curEndTime =
      let _curEndtime =
        Number(_item.split(":")[0]) + 1 + ":" + _item.split(":")[1];
      if (Number(_curEndtime.split(":")[0]) < 10) {
        this.curEndTime = "0" + String(_curEndtime);
      } else {
        this.curEndTime = _curEndtime;
      }
    },
    // 计算可选择预约时间
    computedTime() {
      let _satarTime = this.openTimeStart.split(":")[0] || "09";
      let _endTime = this.openTimeEnd.split(":")[0] || "22";
      let _morningTimes = [];
      let _nightTime = [];
      let _noonTimes = [];
      let _afternoonTimes = [];

      let _allTime = [];

      // 门店营业时间
      for (let h = _satarTime; h <= _endTime; h++) {
        if (h < 10 && h > 0) {
          _allTime.push("0"+h + ":00");
        } else {
          _allTime.push(h + ":00");
        }
      }
      // 不可预约时间
      _allTime = _allTime.map(e => {
        let _timestamp = new Date("2018-04-04 " + e).getTime();
        for (let i in this.todayPeriodTime) {
          if (
            _timestamp >= this.todayPeriodTime[i].timeStart &&
            _timestamp <= this.todayPeriodTime[i].timeEnd
          ) {
            return {
              hour: e,
              disable: true
            };
          }
        }
        return {
          hour: e,
          disable: false
        };
      });
      // 时间分段
      _allTime.forEach(e => {
        let _hour = Number(e.hour.split(":")[0]);
        if (_hour < 12 && _hour >= 0) {
          _morningTimes.push(e);
        } else if (_hour >= 12 && _hour <= 14) {
          _noonTimes.push(e);
        } else if (_hour > 14 && _hour <= 18) {
          _afternoonTimes.push(e);
        } else {
          _nightTime.push(e);
        }
      });
      this.morningTimes = _morningTimes;
      this.noonTimes = _noonTimes;
      this.afternoonTimes = _afternoonTimes;
      this.nightTime = _nightTime;

      // // 上午时间段
      // for (let i = 0; i < 12 - Number(_satarTime); i++) {
      //   let _time = Number(_satarTime) + i + ":00";
      //   if (Number(_satarTime) + i < 10) {
      //     _time = "0" + String(_time);
      //   }
      //   _morningTimes.push(_time);
      // }
      // this.morningTimes = _morningTimes;
      // // 中午时间段
      // if (Number(_satarTime) < 12 || Number(_endTime) > 14) {
      //   this.noonTimes = ["12:00", "13:00", "14:00"];
      // }
      // // 下午时间段
      // if (Number(_satarTime) < 15 || Number(_endTime) > 18) {
      //   this.afternoonTimes = ["15:00", "16:00", "17:00", "18:00"];
      // }
      // // 晚上时间段
      // for (let j = 0; j < Number(_endTime) - 19; j++) {
      //   _nightTime.push(19 + j + ":00");
      // }
      // this.nightTime = _nightTime;
    },
    // 选择门店
    selectStore(item) {
      this.isStorePopup = false;
      this.storeCellText = item.storeName;
      this.selectStoreId = item.storeId;
      if (this.selectStoreId && this.selectCardId) {
        this.getVenueList();
      }
      this.getStoreQuery().then(() => {
        console.log("getStoreQuery");
        this.isTimePopup = true;
      });
    },
    // 选择合同
    selectCard(item) {
      // 先清空一次
      this.selectCardId = "";
      this.cardClassId = "";
      this.venueCellText = "请选择";
      this.projectCellText = "请选择";

      this.isCardPopup = false;
      this.cardCellText = item.cardClassName;
      this.selectCardId = item.id;
      this.cardClassId = item.cardClassId;
      if (this.selectStoreId && this.selectCardId) {
        this.getVenueList();
      }
      if (!this.venueId) {
        this.isVenuePopup = true;
      }
    },
    // 确认选择时间
    selectDate() {
      this.isTimePopup = false;
      this.timeCellText = this.confirmDate;
      if (!this.cardClassId) {
        // this.isCardPopup = true;
        this.showCardPopop();
      }
    },
    // 选择场馆
    selectVenue(item) {
      this.isVenuePopup = false;
      this.venueId = item.venueId;
      this.venueCellText = item.venueName;
      this.getProList();
      if (!this.projectId) {
        this.isProjectPopup = true;
      }
    },
    // 选择项目
    selectProject(item) {
      this.isProjectPopup = false;
      this.projectId = item.projectId;
      this.projectCellText = item.projectName;
    },
    // 确认预约
    appointCoach() {
      let that = this;
      // return console.log({
      //   storeId: that.selectStoreId,
      //   venueId: that.venueId,
      //   coachId: that.coachId,
      //   calendar: that.curDate,
      //   timeStart: that.curDate + that.curTime,
      //   timeEnd: that.curDate + that.curEndTime,
      //   cardId: that.cardClassId,
      //   name: that.userInfo.name,
      //   customerId: that.userInfo.id,
      //   phone: that.userInfo.phone,
      //   projectId: that.projectId,
      //   status: 0
      // });
      if (this.storeCellText == "请选择" || this.storeCellText == "") {
        return wx.showToast({
          title: "请选择授课门店",
          icon: "none",
          duration: 1000
        });
      }
      if (this.cardCellText == "请选择" || this.cardCellText == "") {
        return wx.showToast({
          title: "请选择预约时间",
          icon: "none",
          duration: 1000
        });
      }
      if (this.cardCellText == "请选择" || this.cardCellText == "") {
        return wx.showToast({
          title: "请选择扣费合同",
          icon: "none",
          duration: 1000
        });
      }
      if (this.venueCellText == "请选择" || this.venueCellText == "") {
        return wx.showToast({
          title: "请选择消费场馆",
          icon: "none",
          duration: 1000
        });
      }
      if (this.ProjectCellText == "请选择" || this.ProjectCellText == "") {
        return wx.showToast({
          title: "请选择消费项目",
          icon: "none",
          duration: 1000
        });
      }
      wx.showLoading({
        title: "预约中..."
      });
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/set/customer",
        data: {
          addAppointType: "customer",
          storeId: that.selectStoreId,
          venueId: that.venueId,
          coachId: that.coachId,
          calendar: that.curDate + " " + "00:00:00",
          timeStart: that.curDate + " " + that.curTime + ":00",
          timeEnd: that.curDate + " " + that.curEndTime + ":00",
          cardId: that.selectCardId,
          name: that.userInfo.name,
          customerId: that.userInfo.id,
          phone: that.userInfo.phone,
          projectId: that.projectId,
          status: 0
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code === 200) {
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
            wx.redirectTo({
              url:
                "../appointmentResult/main?coachAppointId=" +
                res.data.data.coachAppointId
            });
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
      // wx.navigateTo({
      //   url: "../appointmentResult/main"
      // });
    },
    // 组件select-date返回的日期
    onDate(date) {
      this.getPeriodTime(date);
      this.curDate = date;
    },
    // 获取教练信息
    getCoachDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/employee/file/datailByCus/" + that.coachId,
        success(res) {
          if (res.data.code === 200) {
            that.coachInfo = res.data.data;
          }
        }
      });
    },
    // 获取教练的授课门店列表
    getStoreList() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/getAttendStoreByCus",
        data: {
          coachId: that.coachId
        },
        success(res) {
          if (res.data.code == 200) {
            that.storeList = res.data.data;
            if (that.storeList.length == 1) {
              that.selectStore(that.storeList[0]);
            } else {
              that.isStorePopup = true;
            }
          }
        }
      });
    },
    // 获取可用合同
    getCardList() {
      let that = this;
      HttpRequest({
        url: window.api + "/card/relevance/user/cardInfoPages",
        data: {
          customerId: that.userInfo.id,
          isAll: 1
        },
        success(res) {
          if (res.data.code == 200) {
            let _list = [];
            res.data.data.result.forEach(e => {
              if (e.teachCardType == 2 && e.cardStatus == 2) {
                e.doomsday = e.doomsday.split(" ")[0];
                _list.push(e);
              }
            });
            that.cardList = _list;
            if (that.cardList.length == 1) {
              that.selectCard(that.cardList[0]);
            }
          }
        }
      });
    },
    // 获取场馆列表
    getVenueList() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/getAttendVenue",
        data: {
          storeId: that.selectStoreId,
          cardClassId: that.cardClassId
        },
        success(res) {
          if (res.data.code === 200) {
            that.venueList = res.data.data;
            if (that.venueList.length == 1) {
              that.selectVenue(that.venueList[0]);
            }
          } else {
            that.venueList = [];
          }
        }
      });
    },
    // 获取项目列表
    getProList() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/getproject",
        data: {
          storeId: that.selectStoreId,
          cardClassId: that.cardClassId,
          venueId: that.venueId
        },
        success(res) {
          if (res.data.code === 200) {
            that.projectList = res.data.data;
            if (that.projectList.length == 1) {
              that.selectProject(that.projectList[0]);
            }
          } else {
            that.projectList = [];
          }
        }
      });
    },
    // 获取教练被占用的时间
    getPeriodTime(date) {
      let that = this;
      HttpRequest({
        url: window.api + "/coach/private/caochTimePeriod",
        data: {
          coachId: that.coachId,
          calendar: date || formatDate(new Date(), "yyyy-MM-dd")
        },
        success(res) {
          if(res.data.code == 200) {
            that.todayPeriodTime = res.data.data;
            that.computedTime()
          } else {
            that.todayPeriodTime = []
          }
          /* 
          let _todayPeriodTime = [];
          res.data.data.forEach(e => {
            console.log(e);
            let _timeStart = formatDate(new Date(e.timeStart), "hh:mm");
            let _endTime = formatDate(new Date(e.timeEnd), "hh:mm");
            let _timeStartH = _timeStart.split(":")[0];
            let _timeStartS = _timeStart.split(":")[1];
            let _endTimeH = _endTime.split(":")[0];
            let _endTimeS = _endTime.split(":")[1];
            let second;
            if (_endTimeS - _timeStartS < 16 && _endTimeS - _timeStartS > 0) {
              second = "15";
            } else if (
              _endTimeS - _timeStartS < 31 &&
              _endTimeS - _timeStartS > 15
            ) {
              second = "30";
            } else if (
              _endTimeS - _timeStartS < 46 &&
              _endTimeS - _timeStartS > 30
            ) {
              second = "45";
            } else {
              second = "00";
            }
            _todayPeriodTime.push(`${_timeStartH}:${second}`);
            _todayPeriodTime.push(`${Number(_timeStartH) + 1}:${second}`);
            // for(let i=0;i<(_endTimeH - _timeStartH);i++) {
            //   console.log(i)
            // }
          });
          console.log(_todayPeriodTime);
          that.todayPeriodTime = _todayPeriodTime;
          // [{
          //   timeStart: 1522814400000,
          //   timeEnd:1522818000000
          // }]
          */
        }
      });
    },
    // 门店系统设置，获取营业时间
    getStoreQuery() {
      let that = this;
      return new Promise(function(resolve) {
        HttpRequest({
          url: window.api + "/system/setup/store/query",
          data: {
            storeId: that.selectStoreId
          },
          success(res) {
            if (res.data.data.openingHoursStart) {
              that.openTimeStart = res.data.data.openingHoursStart;
              that.openTimeEnd = res.data.data.openingHoursEnd;
              that.computedTime();
              resolve();
              // that.businessTime =
              //   res.data.data.openTimeStart + "~" + res.data.data.openTimeEnd;
            }
          }
        });
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
page {
  background-color: #f5f5f5;
}
.appointment-coach {
  .coach {
    display: flex;
    margin-bottom: 10px;
    padding: 10px 0;
    padding-right: 30px;
    background-color: #fff;
    border-radius: 2px;
    .cover {
      flex: 0 0 90px;
      width: 90px;
      padding-left: 12px;
      box-sizing: border-box;
      > img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #bfbfbf;
      }
    }
    .coach-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;
      > div {
        flex: 1;
        line-height: 35px;
        .Mult-line(1);
      }
      .coach-name {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .coach-desc {
        color: #bababa;
      }
    }
  }
  .tiems {
    text-align: center;
    margin: auto;
    > div {
      color: @theme-color;
    }
    .num {
      font-size: 20px;
    }
  }
  .cell-list-sm {
    margin-bottom: 15px;
    .title-cell {
      padding: 0 15px;
      background-color: #fff;
    }
  }
  .cell-list-lg {
    margin-bottom: 15px;
    .title-cell {
      height: 80px;
      line-height: 80px;
      padding: 0 15px;
      background-color: #fff;
    }
  }
  .pop-title {
    line-height: 50px;
    margin-left: 50px;
    text-align: center;
    font-size: 16px;
    > img {
      float: right;
      margin-top: 3px;
      padding: 15px;
      width: 15px;
      height: 15px;
    }
  }
  .venue-list,
  .project-list {
    > div {
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      border-top: 1rpx solid #eee;
    }
  }
  .store-pop {
    .store-list {
      .store-popup-item {
        display: flex;
        padding: 15px 15px;
        border-top: 1rpx solid #eee;
        .cover {
          flex: 0 0 100px;
          margin-right: 10px;
          > img {
            width: 100%;
            height: 60px;
            border-radius: 4px;
            background-color: #eee;
          }
        }
        .store-info {
          flex: 1;
          .name {
            margin-top: 5px;
            margin-bottom: 10px;
            .range {
              margin-left: 10px;
              font-size: 12px;
              color: @theme-color;
            }
          }
          .address {
            font-size: 12px;
            color: #bababa;
            .Mult-line(2);
          }
        }
      }
    }
  }
  .time-pop {
    .date-group {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #fff;
      z-index: 9999;
      .date-group-header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 140px;
      }
      .specific-date {
        position: absolute;
        top: 140px;
        bottom: 130px;
        width: 100%;
        overflow: auto;
      }
      .date-group-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
      }
    }
    .select-date {
      border-bottom: 1rpx solid #eee;
      border-top: 1rpx solid #eee;
      margin-bottom: 10px;
    }
    .specific-date {
      padding: 0 15px;
      box-sizing: border-box;
      .morning,
      .noon,
      .afternoon {
        .date-header {
          display: flex;
          margin-bottom: 15px;
          align-items: center;
          > h5 {
            flex: 0 0 50px;
            text-align: center;
            line-height: 20px;
            font-size: 15px;
            // margin-bottom: 15px;
          }
          .mini-data {
            flex: 1;
            .mini {
              display: inline-block;
              width: 60px;
              margin-top: 7px;
              margin-right: 5px;
              line-height: 36px;
              text-align: center;
              font-size: 13px;
              border: 1rpx solid #eee;
              &.active {
                background-color: #43cf7c;
                color: #fff;
              }
              &.disable {
                background-color: #ccc !important;
                color: #999 !important;
              }
            }
          }
        }
        .hours {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          .hour {
            flex: 0 0 24%;
            box-sizing: border-box;
            text-align: center;
            margin-right: 1%;
            margin-bottom: 10px;
            line-height: 45px;
            font-size: 16px;
            border: 1rpx solid #eee;
            &.active {
              background-color: #43cf7c;
              color: #fff;
            }
            &.disable {
              background-color: #ccc !important;
              color: #999 !important;
            }
          }
        }
      }
    }
    .tips {
      padding: 0 15px;
      padding-top: 15px;
      margin-top: 15px;
      border-top: 1rpx solid #eee;
      > div {
        display: inline-block;
        margin-right: 15px;
        > span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .already-block,
      .can-block,
      .none-block {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .already-block {
        background-color: #43cf7c;
      }
      .can-block {
        border: 1rpx solid #eee;
      }
      .none-block {
        background-color: #ccc;
      }
    }
    .confirm-date {
      margin: 15px;
      line-height: 42px;
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
  }
  .cards-pop {
    .cards-list {
      .cards-popup-item {
        display: flex;
        padding: 15px 15px;
        border-top: 1rpx solid #eee;
        .cover {
          flex: 0 0 100px;
          margin-right: 10px;
          > img {
            width: 100%;
            height: 60px;
            border-radius: 4px;
            background-color: #eee;
          }
        }
        .cards-info {
          flex: 1;
          .name {
            line-height: 20px;
            .range {
              margin-left: 10px;
              font-size: 12px;
              color: @theme-color;
            }
          }
          .times,
          .date {
            line-height: 20px;
            color: #bababa;
            .Mult-line(1);
          }
        }
      }
    }
  }
}
</style>
