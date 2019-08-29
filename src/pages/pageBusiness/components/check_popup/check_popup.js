import {
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";

let checkPopupData = {
  customerId: '',
  showMask: false,
  showProject: false,
  showTeam: false,
  cardId: '',
  cardClassId: '',
  cardName: '',
  storeId: '',
  storeName: '',
  venueId: '',
  venueName: '',
  selectProject: {},
  physicsCardNo: '',
  projectList: [],
  teamClassList: []
}

let checkMethods = {
  getCardCost() {
    let that = this
    wx.showLoading()
    HttpRequest({
      url: "/consumption/general/card/cost",
      data: {
        storeId: checkPopupData.storeId,
        venueId: checkPopupData.venueId,
        physicsCardNo: checkPopupData.physicsCardNo,
        frontSign: "",
        valueCardFee: "" // 储值卡的扣费金额
      },
      success(res) {
        let data = res.data.data;
        let code = res.data.code;
        if (code == 202 || code == 201) {
          // 消费天 202 其他 201
          // 快速签到时直接签到
          checkPopupData.showMask = false;
          that.successMethod('签到成功')
        } else if (code == 503) {
          // 含有多个项目，选择
          checkPopupData.projectList = data.map(e => {
            e.cardType =
              e.valueCardType == 1
                ? "会籍"
                : e.valueCardType == 2
                  ? "私教"
                  : "团课";
            e.class =
              e.valueCardType == 1
                ? "member"
                : e.valueCardType == 2
                  ? "private"
                  : "team";
            return e;
          });
          checkPopupData.showMask = true;
          checkPopupData.showProject = true;
        } else if (code == 519) {
          // 团课
          that.getTeamSchedule()
        } else if (code == 513) {
          // 私教 TODO: 私教预约页面待处理
          checkPopupData.cardId = data.id
          checkPopupData.cardName = data.secondCardClass
          checkPopupData.cardClassId = data.cardClassId
          that.toCoachCheckIn()
        } else {
          that.failMethod(res.data.message)
        }
        wx.hideLoading()
      }
    });
  },
  // 获取团课
  getTeamSchedule() {
    HttpRequest({
      url: '/teamClass/teamSchedule/frontGet',
      data: {
        storeId: checkPopupData.storeId,
        venueId: checkPopupData.venueId,
      },
      success(res) {
        if (res.data.code == 200) {
          if (!res.data.data.length) {
            return that.failMethod("暂无团课信息")
          }
          checkPopupData.showMask = true
          checkPopupData.showTeam = true
          checkPopupData.teamClassList = res.data.data.map(e => {
            return {
              cover: e.masterImg ? window.api + e.masterImg : window.api + '/assets/img/morenTo.png',
              className: e.courseTitle,
              status: e.status,
              statusChar: e.statusChar,
              storeId: e.storeId,
              coach: e.coachNameArrayStr,
              timeStart: formatDate(new Date(e.timeStart), 'hh:mm'),
              timeEnd: formatDate(new Date(e.timeEnd), 'hh:mm'),
              venueId: e.venueId,
              venueName: e.venueName,
              teamScheduleId: e.teamScheduleId
            }
          })
        }
      }
    })
  },
  successMethod(title) {
    wx.showToast({
      title: title,
      icon: "success",
      duration: 1000,
      success() {
        setTimeout(() => {
          wx.redirectTo({
            url: "/pages/pageBusiness/check_in_type/main"
          });
        }, 600);
      }
    });
  },
  failMethod(title) {
    checkPopupData.showMask = false;
    wx.showModal({
      title: "提示",
      content: title,
      showCancel: false
    });
  },
  toCoachCheckIn() {
    checkPopupData.showMask = false
    wx.navigateTo({
      url: `../appoint_coach/main?cardId=${
        checkPopupData.cardId
        }&cardClassId=${
        checkPopupData.cardClassId
        }&cardName=${checkPopupData.cardName}&storeId=${
        checkPopupData.storeId
        }&storeName=${checkPopupData.storeName}&venueId=${
        checkPopupData.venueId
        }&venueName=${checkPopupData.venueName}&id=${
        checkPopupData.customerId
        }&type=前台代签`
    });
  }
}

export {
  checkPopupData,
  checkMethods
}