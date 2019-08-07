<template>
  <div class="appointment-coach" :class="{'isPhoneX-wrap':isPhoneX}">
    <div class="coach">
      <div class="cover">
        <img :src="window.api + coachInfo.headImgPath">
      </div>
      <div class="coach-info">
        <div class="coach-name">{{coachInfo.userName || '教练名'}}</div>
        <div
          class="coach-times"
          :style="{'color': themeColor}"
        >共授课{{(coachInfo.privateCountByCoach+coachInfo.teamCountByCoach) || '0'}}节</div>
      </div>
      <div class="tiems"></div>
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
            <img :src="window.api + item.images">
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
      custom-style="width: 100%;"
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
          <div class="date-hours">
            <div class="time-icon">
              <div class="day">
                <i class="sun"></i>
              </div>
              <div class="night">
                <i class="moon"></i>
              </div>
            </div>
            <div class="hour-group">
              <!-- active: (curHourIndex == index),  -->
              <div
                class="hour"
                v-for="(item, index) in dayTime"
                :key="index"
                :class="{disable: item.disable}"
                @click="selectHour(item, index)"
              >
                <span
                  v-if="curHourIndex == index"
                  :style="{'background-color':themeColor,color:'#fff'}"
                >{{item.hour}}</span>
                <span v-else>{{item.hour}}</span>
              </div>
            </div>
          </div>
          <div class="date-second">
            <div
              class="second-item"
              v-for="(item, index) in curTimeObj.arr"
              :key="index"
              :class="{disable: item.disable}"
              @click="selectSecond(item,index)"
            >
              <span
                v-if="curSecondIndex == index"
                :style="{'background-color':themeColor,color:'#fff'}"
                :class="{bold: item.second % 15 == 0}"
              >{{item.second}}</span>
              <span :class="{bold: item.second % 15 == 0}" v-else>{{item.second}}</span>
            </div>
          </div>
        </div>
        <div class="date-group-footer">
          <div class="tips">
            <div class="already">
              <span class="already-block" :style="{'background-color': themeColor}"></span>
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
          >确定{{confirmDate}}</div>
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

    <van-popup
      :show="showModifyPrice"
      @close="showModifyPrice = false"
      :duration="200"
      custom-style="width:85%;border-radius: 5px;"
    >
      <div class="modify-price">
        <div class="modify-title">请输入扣费金额</div>
        <div class="modify-middle">
          <van-stepper :value="modifyPrice" @change="changePrice"/>
        </div>
        <div class="modify-btn">
          <div class="modify-cancel" :style="{background: themeColor}" @click="showModifyPrice = false">取消</div>
          <div class="modify-confirm" :style="{background: themeColor}" @click="showModifyPrice = false">确认</div>
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
    <page-footer></page-footer>
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
import pageFooter from "COMPS/pageFooter.vue";

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
      openTimeStart: "",
      // 关店时间
      openTimeEnd: "",
      dayTime: [],
      allMiniTime: [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55"
      ],
      // 当前选择的日期
      curDate: "",
      // 点击选择的时间
      curTime: "",
      curTimeObj: {},
      // 点击选择的时间的结束时间
      curEndTime: "",
      curHourIndex: -1,
      curSecondIndex: -1,
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
      // 不能预约的时间
      todayPeriodTime: [],
      showModifyPrice: false,
      modifyPrice: 0,
      // 是否是储值卡
      isStoredValueCard: false
    };
  },
  components: {
    titleCell,
    selectDate,
    pageFooter
  },
  onLoad(option) {
    // 进页面前先清空数据
    Object.assign(this.$data, this.$options.data());
    this.coachId = option.coachId;
    this.userInfo = wx.getStorageSync("userInfo");
    setNavTab();
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  mounted() {
    this.curDate = formatDate(new Date(), "yyyy-MM-dd");
    this.getCoachDetail();
    // this.computedTime();
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
        return (
          "（" +
          this.curDate +
          " " +
          this.curTime +
          "~" +
          this.curEndTime +
          "）"
        );
      }
      return "";
    },
    themeColor() {
      return window.color;
    },
    window() {
      return window;
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
      if (!this.selectStoreId) {
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
      if (item.disable) {
        return;
      }
      this.curTimeObj = item;
      let _item;
      _item = item.hour;
      this.curTime = _item;
      this.curHourIndex = index;
      this.curSecondIndex = 0;
      let hour = _item.slice(0, 2);
      let _curEndtime =
        Number(_item.split(":")[0]) + 1 + ":" + _item.split(":")[1];
      if (Number(_curEndtime.split(":")[0]) < 10) {
        this.curEndTime = "0" + String(_curEndtime);
      } else {
        this.curEndTime = _curEndtime;
      }
    },
    selectSecond(item, index) {
      if (item.disable) {
        return;
      }
      if (this.curHourIndex == -1) {
        return;
      }
      this.curTime = this.curTime.split(":")[0] + ":" + item.second;
      this.curEndTime = this.curEndTime.split(":")[0] + ":" + item.second;
      this.curSecondIndex = index;
    },
    // 判断当前时间节点是否被占用的函数
    isUsed(start, end) {
      for (let i in this.todayPeriodTime) {
        let element = this.todayPeriodTime[i];

        if (
          // 开始时间在预约时间内
          (element.timeStart - 60 * 60 * 1000 <= start &&
            start <= element.timeEnd) ||
          (element.timeStart <= end && end <= element.timeEnd)
        ) {
          return true;
        }
      }

      return false;
    },
    // 计算可选择预约时间
    computedTime() {
      const HOUR = 60 * 60 * 1000;
      const DAY = 24 * HOUR;

      let target = [];
      let hourTime = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ];
      let _openStart = this.openTimeStart || "00:00";
      let _openEnd = this.openTimeEnd || "23:59";
      let _nowDay = this.curDate;
      // 关店时间 合到被占用时间
      let closeTimeArr = [
        {
          timeStart: new Date(_nowDay + " " + "00:00").getTime(),
          timeEnd: new Date(_nowDay + " " + _openStart).getTime()
        },
        {
          timeStart: new Date(_nowDay + " " + _openEnd).getTime(),
          timeEnd: new Date(_nowDay + " " + "24:00").getTime()
        }
      ];
      this.todayPeriodTime = this.todayPeriodTime.concat(closeTimeArr);
      // 获取当日的时间（0点）
      let baseDay = new Date(_nowDay + " " + "00:00").getTime();
      // let baseDay = parseInt(this.todayPeriodTime[0].timeStart / DAY) * DAY - 8 * HOUR;
      // 填充第一层
      for (let i in hourTime) {
        target.push({
          hour: hourTime[i],
          disable: false,
          start: baseDay + parseInt(i) * HOUR,
          end: baseDay + (parseInt(i) + 1) * HOUR,
          arr: []
        });
      }

      // 5分钟间隔
      const TIME_SPLIT = 5 * 60 * 1000;
      // 填充第二层
      for (let i in target) {
        for (let j = 0; j < 12; ++j) {
          target[i].arr.push({
            second: String(j * 5).length == 2 ? j * 5 : "0" + j * 5,
            disable: false,
            start: target[i].start + j * TIME_SPLIT,
            end: target[i].start + (j + 1) * TIME_SPLIT
          });
        }
      }

      // 比对当前格子是否被占用
      for (let i in target) {
        let hourEle = target[i];
        if (this.isUsed(hourEle.start, hourEle.end)) {
          hourEle.disable = true;
        }
        for (let j = 0; j < 12; ++j) {
          let element = target[i].arr[j];
          if (this.isUsed(element.start, element.end)) {
            element.disable = true;
          }
        }
      }
      this.dayTime = target;
      for (let k in target) {
        if (!target[k].disable) {
          this.selectHour(target[k], k);
          return;
        }
      }
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
      this.isStoredValueCard = item.teachCardType == 3 ? true : false
      if (this.selectStoreId && this.selectCardId) {
        this.getVenueList();
      }
      if (this.cardClassId) {
        this.isVenuePopup = true;
        // this.showVenuePopup()
      }
    },
    // 确认选择时间
    selectDate() {
      if (this.confirmDate == "") {
        return wx.showToast({
          title: "请选择时间",
          icon: "none",
          duration: 1000
        });
      }
      this.isTimePopup = false;
      console.log(this.confirmDate);
      this.timeCellText = this.confirmDate
        .replace(/（/g, "")
        .replace(/）/g, "");
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
      
      this.modifyPrice = ""
      if (item.isCanModifyFee) {
        this.modifyPrice = item.projectPrice
        this.showModifyPrice = true
      }
    },
    // 确认预约
    appointCoach() {
      let that = this;
      if (this.storeCellText == "请选择" || this.storeCellText == "") {
        return wx.showToast({
          title: "请选择授课门店",
          icon: "none",
          duration: 1000
        });
      }
      if (this.timeCellText == "请选择" || this.timeCellText == "") {
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
          valueCardFee: that.modifyPrice,
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
      wx.showLoading({
        title: "加载中..."
      });
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
          wx.hideLoading();
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
            let _list = res.data.data.result;

            // res.data.data.result.forEach(e => {
            //   if (e.teachCardType == 2 && e.cardStatus == 2) {
            //     e.doomsday = e.doomsday.split(" ")[0];
            //     _list.push(e);
            //   }
            // });
            that.cardList = _list.filter(e => {
              if(e.doomsday) {
                e.doomsday = e.doomsday.split(" ")[0];
              }
              if(e.cardStatus != 2) {
                return false
              }
              return e.teachCardType == 3 || (e.canTeachCard == 1 && e.teachCardType == 2)
            });

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
          venueId: that.venueId,
          valueCardType: that.isStoredValueCard ? 2 : '' // 2 私教
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
          if (res.data.code == 200) {
            /*let _time = []
            _time = res.data.data.map(function(e) {
              return {
                startTime: formatDate(new Date(e.timeStart), "yyyy-MM-dd hh:mm"),
                endTime: formatDate(new Date(e.timeEnd), "yyyy-MM-dd hh:mm")
              }
            })
            console.log(_time)*/
            that.todayPeriodTime = res.data.data;
            that.computedTime();
          } else {
            that.todayPeriodTime = [];
          }
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
            if (res.data.code == 200) {
              that.openTimeStart = res.data.data.openingHoursStart || "00";
              that.openTimeEnd = res.data.data.openingHoursEnd || "24";
              that.computedTime();
              resolve();
            }
          }
        });
      });
    },
    changePrice(e) {
      this.modifyPrice = e.mp.detail
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
    .select-date {
      border-bottom: 1rpx solid #eee;
      border-top: 1rpx solid #eee;
      margin-bottom: 10px;
    }
    .specific-date {
      // position: absolute;
      // top: 140px;
      // bottom: 130px;
      width: 100%;
      // overflow: auto;
      // padding: 0 15px;
      .date-hours {
        display: flex;
        align-items: center;
        max-height: 486rpx;
        overflow: hidden;
        border-top: 1rpx solid #eee;
        .time-icon {
          flex: 0 0 40px;
          height: 486rpx;
          .day {
            height: 242rpx;
          }
          .night {
            height: 242rpx;
            border-top: 1rpx solid #e5e5e5;
          }
          .sun,
          .moon {
            display: inline-block;
            width: 25px;
            height: 25px;
            margin-left: 8px;
            margin-top: 50px;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .sun {
            background-image: url("data:image/svg+xml;base64,PHN2ZyB0PSIxNTU0NjQxODU3OTQzIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUxNjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTI3MC45MzMzMzMgNzIzLjJsLTg5LjYgODkuNmMtOC41MzMzMzMgOC41MzMzMzMtOC41MzMzMzMgMjEuMzMzMzMzIDAgMjkuODY2NjY3IDguNTMzMzMzIDguNTMzMzMzIDIxLjMzMzMzMyA4LjUzMzMzMyAyOS44NjY2NjcgMGw4OS42LTg5LjZjOC41MzMzMzMtOC41MzMzMzMgOC41MzMzMzMtMjEuMzMzMzMzIDAtMjkuODY2NjY3QzI5Mi4yNjY2NjcgNzE0LjY2NjY2NyAyNzkuNDY2NjY3IDcxNC42NjY2NjcgMjcwLjkzMzMzMyA3MjMuMnpNMjEzLjMzMzMzMyA1MTJjMC0xMi44LTguNTMzMzMzLTIxLjMzMzMzMy0yMS4zMzMzMzMtMjEuMzMzMzMzTDY0IDQ5MC42NjY2NjdjLTEyLjggMC0yMS4zMzMzMzMgOC41MzMzMzMtMjEuMzMzMzMzIDIxLjMzMzMzM3M4LjUzMzMzMyAyMS4zMzMzMzMgMjEuMzMzMzMzIDIxLjMzMzMzM2wxMjggMEMyMDQuOCA1MzMuMzMzMzMzIDIxMy4zMzMzMzMgNTI0LjggMjEzLjMzMzMzMyA1MTJ6TTc1My4wNjY2NjcgMzAwLjhsODkuNi04OS42YzguNTMzMzMzLTguNTMzMzMzIDguNTMzMzMzLTIxLjMzMzMzMyAwLTI5Ljg2NjY2Ny04LjUzMzMzMy04LjUzMzMzMy0yMS4zMzMzMzMtOC41MzMzMzMtMjkuODY2NjY3IDBsLTg5LjYgODkuNmMtOC41MzMzMzMgOC41MzMzMzMtOC41MzMzMzMgMjEuMzMzMzMzIDAgMjkuODY2NjY3QzczMS43MzMzMzMgMzA5LjMzMzMzMyA3NDQuNTMzMzMzIDMwOS4zMzMzMzMgNzUzLjA2NjY2NyAzMDAuOHpNNTEyIDIxMy4zMzMzMzNjMTIuOCAwIDIxLjMzMzMzMy04LjUzMzMzMyAyMS4zMzMzMzMtMjEuMzMzMzMzTDUzMy4zMzMzMzMgNjRjMC0xMi44LTguNTMzMzMzLTIxLjMzMzMzMy0yMS4zMzMzMzMtMjEuMzMzMzMzcy0yMS4zMzMzMzMgOC41MzMzMzMtMjEuMzMzMzMzIDIxLjMzMzMzM2wwIDEyOEM0OTAuNjY2NjY3IDIwNC44IDQ5OS4yIDIxMy4zMzMzMzMgNTEyIDIxMy4zMzMzMzN6TTI3MC45MzMzMzMgMzAwLjhjOC41MzMzMzMgOC41MzMzMzMgMjEuMzMzMzMzIDguNTMzMzMzIDI5Ljg2NjY2NyAwIDguNTMzMzMzLTguNTMzMzMzIDguNTMzMzMzLTIxLjMzMzMzMyAwLTI5Ljg2NjY2N0wyMTEuMiAxNzkuMmMtOC41MzMzMzMtOC41MzMzMzMtMjEuMzMzMzMzLTguNTMzMzMzLTI5Ljg2NjY2NyAwLTguNTMzMzMzIDguNTMzMzMzLTguNTMzMzMzIDIxLjMzMzMzMyAwIDI5Ljg2NjY2N0wyNzAuOTMzMzMzIDMwMC44ek05NjAgNDkwLjY2NjY2N2wtMTI4IDBjLTEyLjggMC0yMS4zMzMzMzMgOC41MzMzMzMtMjEuMzMzMzMzIDIxLjMzMzMzM3M4LjUzMzMzMyAyMS4zMzMzMzMgMjEuMzMzMzMzIDIxLjMzMzMzM2wxMjggMGMxMi44IDAgMjEuMzMzMzMzLTguNTMzMzMzIDIxLjMzMzMzMy0yMS4zMzMzMzNTOTcyLjggNDkwLjY2NjY2NyA5NjAgNDkwLjY2NjY2N3pNNzUzLjA2NjY2NyA3MjMuMmMtOC41MzMzMzMtOC41MzMzMzMtMjEuMzMzMzMzLTguNTMzMzMzLTI5Ljg2NjY2NyAwLTguNTMzMzMzIDguNTMzMzMzLTguNTMzMzMzIDIxLjMzMzMzMyAwIDI5Ljg2NjY2N2w4OS42IDg5LjZjOC41MzMzMzMgOC41MzMzMzMgMjEuMzMzMzMzIDguNTMzMzMzIDI5Ljg2NjY2NyAwIDguNTMzMzMzLTguNTMzMzMzIDguNTMzMzMzLTIxLjMzMzMzMyAwLTI5Ljg2NjY2N0w3NTMuMDY2NjY3IDcyMy4yek01MTIgMjU2Yy0xNDAuOCAwLTI1NiAxMTUuMi0yNTYgMjU2IDAgMTQwLjggMTE1LjIgMjU2IDI1NiAyNTZzMjU2LTExNS4yIDI1Ni0yNTZDNzY4IDM3MS4yIDY1Mi44IDI1NiA1MTIgMjU2ek01MTIgNzI1LjMzMzMzM2MtMTE3LjMzMzMzMyAwLTIxMy4zMzMzMzMtOTYtMjEzLjMzMzMzMy0yMTMuMzMzMzMzIDAtMTE3LjMzMzMzMyA5Ni0yMTMuMzMzMzMzIDIxMy4zMzMzMzMtMjEzLjMzMzMzM3MyMTMuMzMzMzMzIDk2IDIxMy4zMzMzMzMgMjEzLjMzMzMzM0M3MjUuMzMzMzMzIDYyOS4zMzMzMzMgNjI5LjMzMzMzMyA3MjUuMzMzMzMzIDUxMiA3MjUuMzMzMzMzek01MTIgODEwLjY2NjY2N2MtMTIuOCAwLTIxLjMzMzMzMyA4LjUzMzMzMy0yMS4zMzMzMzMgMjEuMzMzMzMzbDAgMTI4YzAgMTIuOCA4LjUzMzMzMyAyMS4zMzMzMzMgMjEuMzMzMzMzIDIxLjMzMzMzM3MyMS4zMzMzMzMtOC41MzMzMzMgMjEuMzMzMzMzLTIxLjMzMzMzM2wwLTEyOEM1MzMuMzMzMzMzIDgxOS4yIDUyNC44IDgxMC42NjY2NjcgNTEyIDgxMC42NjY2Njd6IiBwLWlkPSI1MTY4IiBmaWxsPSIjYTJhMmEyIj48L3BhdGg+PC9zdmc+");
          }
          .moon {
            background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTU0NjQxODMyNTg5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQxODMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTc0NC43MzIyNiA4NzUuODYwNzc5YzU0LjI3MzY2MiAwIDEwNi4xODg0NjgtMTAuMDcwNDQyIDE1NC4wMTM5MjItMjguMzk5Mzc2LTgzLjE4NTAzOSA3OS4xNjg4MzEtMTk1LjcyNjk2MSAxMjcuNzY1NjEtMzE5LjYxOTMyNSAxMjcuNzY1NjEtMjU2LjEwMzA2NSAwLTQ2My43MDkwOTEtMjA3LjYwNzY4OC00NjMuNzA5MDkxLTQ2My43MDc0MjkgMC0yNTYuMDA5OTc0IDIwNy40NzYzNjQtNDYzLjU2MjgwNSA0NjMuNDU2NDE2LTQ2My42OTA4MDUtMTU1LjQ2ODQ2OCA2NC45NDc1MzItMjY0LjcyMjI4NiAyMTguNDMxMTY5LTI2NC43MjIyODYgMzk3LjQ1MTYzNyAwIDIzNy44MDA3MjcgMTkyLjc3MTMyNSA0MzAuNTgwMzY0IDQzMC41ODAzNjQgNDMwLjU4MDM2M3ogbS03Ni41ODcyMjEtNDgyLjUzMTc0aC04Ny4wNjY1OTdsNzAuNDM4MjMzIDUxLjE4MDA1Mi0yNi45MDY1OTcgODIuODA0MzY0IDcwLjQzOTg5Ni01MS4xODE3MTUgNzAuNDM2NTcxIDUxLjE4MTcxNS0yNi45MDE2MS04Mi44MDQzNjQgNzAuNDM2NTcxLTUxLjE4MDA1MmgtODcuMDY2NTk3TDY5NS4wNDk5NzQgMzEwLjUyNDY3NWwtMjYuOTA0OTM1IDgyLjgwNDM2NHoiIGZpbGw9IiNhMmEyYTIiIHAtaWQ9IjQxODQiPjwvcGF0aD48cGF0aCBkPSJNMzE0LjE1MTg5NiA0NDUuMjc4NzUzYzAtMTc5LjAyMDQ2OCAxMDkuMjUzODE4LTMzMi41MDI0NDIgMjY0LjcyMjI4Ni0zOTcuNDUxNjM2LTI1NS45ODAwNTIgMC4xMjk2NjItNDYzLjQ1NjQxNiAyMDcuNjgyNDk0LTQ2My40NTY0MTYgNDYzLjY5MjQ2NyAwIDI1Ni4xMDE0MDMgMjA3LjYwNjAyNiA0NjMuNzA3NDI5IDQ2My43MDkwOTEgNDYzLjcwNzQyOSAxMjMuODkyMzY0IDAgMjM2LjQzNDI4Ni00OC41OTY3NzkgMzE5LjYxOTMyNS0xMjcuNzY1NjEtNDcuODI3MTE3IDE4LjMyODkzNS05OS43NDAyNiAyOC4zOTkzNzctMTU0LjAxMzkyMiAyOC4zOTkzNzYtMjM3LjgwOTAzOSAwLTQzMC41ODAzNjQtMTkyLjc3OTYzNi00MzAuNTgwMzY0LTQzMC41ODIwMjZ6IiBmaWxsPSIjYTJhMmEyIiBwLWlkPSI0MTg1Ij48L3BhdGg+PHBhdGggZD0iTTY5NS4wNDk5NzQgMzEwLjUyNjMzOGwyNi45MDQ5MzUgODIuODAyNzAxaDg3LjA2NjU5N0w3MzguNTg0OTM1IDQ0NC41MDkwOTFsMjYuOTAxNjEgODIuODA0MzY0LTcwLjQzNjU3MS01MS4xODE3MTUtNzAuNDM5ODk2IDUxLjE4MTcxNSAyNi45MDY1OTctODIuODA0MzY0LTcwLjQzODIzMy01MS4xODAwNTJoODcuMDY2NTk3eiIgZmlsbD0iI2EyYTJhMiIgcC1pZD0iNDE4NiI+PC9wYXRoPjxwYXRoIGQ9Ik03NDQuNzMyMjYgODc1Ljg2MDc3OWM1NC4yNzM2NjIgMCAxMDYuMTg4NDY4LTEwLjA3MDQ0MiAxNTQuMDEzOTIyLTI4LjM5OTM3Ni04My4xODUwMzkgNzkuMTY4ODMxLTE5NS43MjY5NjEgMTI3Ljc2NTYxLTMxOS42MTkzMjUgMTI3Ljc2NTYxLTI1Ni4xMDMwNjUgMC00NjMuNzA5MDkxLTIwNy42MDc2ODgtNDYzLjcwOTA5MS00NjMuNzA3NDI5IDAtMjU2LjAwOTk3NCAyMDcuNDc2MzY0LTQ2My41NjI4MDUgNDYzLjQ1NjQxNi00NjMuNjkwODA1LTE1NS40Njg0NjggNjQuOTQ3NTMyLTI2NC43MjIyODYgMjE4LjQzMTE2OS0yNjQuNzIyMjg2IDM5Ny40NTE2MzcgMCAyMzcuODAwNzI3IDE5Mi43NzEzMjUgNDMwLjU4MDM2NCA0MzAuNTgwMzY0IDQzMC41ODAzNjN6IG0tNzYuNTg3MjIxLTQ4Mi41MzE3NGgtODcuMDY2NTk3bDcwLjQzODIzMyA1MS4xODAwNTItMjYuOTA2NTk3IDgyLjgwNDM2NCA3MC40Mzk4OTYtNTEuMTgxNzE1IDcwLjQzNjU3MSA1MS4xODE3MTUtMjYuOTAxNjEtODIuODA0MzY0IDcwLjQzNjU3MS01MS4xODAwNTJoLTg3LjA2NjU5N0w2OTUuMDQ5OTc0IDMxMC41MjQ2NzVsLTI2LjkwNDkzNSA4Mi44MDQzNjR6IiBmaWxsPSIjYTJhMmEyIiBwLWlkPSI0MTg3Ij48L3BhdGg+PC9zdmc+");
          }
        }
        .hour-group {
          flex: 1;
          width: 100%;
          display: grid;
          // grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
          grid-template-columns: 25% 25% 25% 25%;
          grid-template-rows: auto;
          .hour {
            border-left: 1rpx solid #e5e5e5;
            border-bottom: 1rpx solid #e5e5e5;
            line-height: 40px;
            text-align: center;
            > span {
              display: inline-block;
              width: 100%;
            }
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

      .date-second {
        display: flex;
        width: 100%;
        border-top: 1rpx solid #eee;
        border-bottom: 1rpx solid #eee;
        .second-item {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: #999;
          > span {
            display: inline-block;
            line-height: 42px;
            width: 100%;
          }
          .bold {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }
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
    .tips {
      padding: 0 15px;
      padding-top: 15px;
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
      // .already-block {
      //   background-color: #43cf7c;
      // }
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
