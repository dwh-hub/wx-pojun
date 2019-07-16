<template>
  <div class="private_coach_class">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>
    <div class="class-list">
      <staff-coach-item
        :info="item"
        v-for="(item, index) in list"
        @clickItem="selectClass(item)"
        :key="index"
      ></staff-coach-item>
    </div>
    <van-loading :color="themeColor" v-if="isLoading" />
    <none-result text="暂无课程" v-if="!list.length && !isLoading"></none-result>
    <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>

    <van-popup
      :show="showOperate"
      @close="showOperate = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="operate-list">
        <div
          class="operate-item"
          v-for="(item, index) in actionList"
          :key="index"
          @click="item.action(item)"
        >{{item.text}}</div>
      </div>
    </van-popup>
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime"
    ></timePicker>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import listPageMinxi from "../components/list-page-mixin.vue";
import colorMixin from "COMPS/colorMixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";

export default {
  data() {
    return {
      nav: [
        {
          navTitle: "今日",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterDate(0);
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterDate(1);
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate(30);
              }
            },
            {
              sonText: "自定义",
              action: () => {
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "教练",
          children: []
        },
        {
          navTitle: "课程状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterStatus();
              }
            },
            {
              sonText: "待确认",
              action: () => {
                this.filterStatus(0);
              }
            },
            {
              sonText: "可上课",
              action: () => {
                this.filterStatus(1);
              }
            },
            {
              sonText: "正在上课",
              action: () => {
                this.filterStatus(2);
              }
            },
            {
              sonText: "完成课程",
              action: () => {
                this.filterStatus(3);
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "课程数",
          dataNum: "0"
        },
        {
          dataText: "数据二",
          dataNum: "0"
        },
        {
          dataText: "数据三",
          dataNum: "0"
        }
      ],
      storeList: [],
      coachList: [],
      selectedStore: {},
      actionList: [],
      showOperate: false,
      actionList_0: [
        {
          text: "确认预约",
          action: () => {
            this.confirmAppoint();
          }
        },{
          text: "取消预约",
          action: () => {
            this.cancelClass();
          }
        }
      ],
      actionList_1: [
        {
          text: "查看详情",
          action: () => {
            this.toDetail();
          }
        },
        {
          text: "上课",
          action: () => {
            this.attendClass();
          }
        },
        {
          text: "改约",
          action: () => {
            this.anotherTime();
          }
        },
        {
          text: "取消预约",
          action: () => {
            this.cancelClass();
          }
        }
      ],
      actionList_2: [
        {
          text: "查看详情",
          action: () => {
            this.toDetail();
          }
        },
        {
          text: "下课",
          action: () => {
            this.classOver();
          }
        }
      ],
      actionList_9: [
        {
          text: "上课",
          action: () => {
            this.attendClass()
          }
        },
        {
          text: "取消预约",
          action: () => {
            this.cancelClass();
          }
        }
      ],
      filter: {
        nameOrPhone: "",
        coachId: "",
        calendarEnd: "",
        calendarStart: "",
        status: "" // 3 完成课程
      },
      curSelectClass: {}
    };
  },
  mounted() {
    this.nav[0].navTitle = "今日";
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    // this.getList();
    this.filterDate(1);
    this.getCoachList();
  },
  onShow() {
    if (this.selectedStore.storeId) {
      this.refreshList(1);
    }
  },
  mixins: [colorMixin, listPageMinxi],
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    headerSearch,
    noneResult
  },
  methods: {
    selectStore(item) {
      this.selectedStore = item;
      this.refreshList();
    },
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    toDetail() {
      wx.navigateTo({
        url: `../../appointmentResult/main?coachAppointId=${
          this.curSelectClass.coachAppointId
        }&type=staff`
      });
      this.showOperate = false;
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            pageNo: that.page,
            searchStore: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: window.api + "/coach/private/appoint/pages",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              return (that.list = []);
            }
            let _res = res.data.data;
            let _data;
            that.headerData[0].dataNum = _res.recCount;
            _data = _res.result.map(async e => {
              if (e.coachHeadImg) {
                if (e.coachHeadImg.indexOf(".jsp") != -1) {
                  await that.getAvatar(e.coachHeadImg).then(res => {
                    e.coachHeadImg = res;
                  });
                } else {
                  e.coachHeadImg = window.api + e.coachHeadImg;
                }
              }
              return {
                id: e.customerId,
                storeId: e.storeId,
                sex: e.sex,
                coachAppointId: e.coachAppointId,
                coachId: e.coachId,
                coachName: e.coachName,
                studentName: e.name,
                cover: e.coachHeadImg
                  ? e.coachHeadImg
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                status: e.status,
                color: that.transformColor(e.status),
                first_1: e.name,
                second_1: e.cardClassName,
                third_1: e.timeStart,
                rightText: e.statusChar || ""
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    getCoachList() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/getcoach",
        success(res) {
          if (res.data.data) {
            that.coachList = res.data.data.map(e => {
              return {
                sonText: e.userName,
                coachId: e.userId,
                coachName: e.userName,
                appointNumber: e.appointNumber,
                attendNumber: e.attendNumber,
                sex: (e.sex == 1 ? "男" : "女") || "",
                action: () => {
                  that.filterCoach(e.userId);
                }
              };
            });
            let first = [
              {
                sonText: "全部",
                coachId: "",
                action: () => {
                  that.filterCoach();
                }
              }
            ];
            that.nav[1].children = first.concat(that.coachList);
          }
        }
      });
    },
    selectClass(item) {
      this.curSelectClass = item;
      if (item.status != 1 && item.status != 2 && item.status != 0) {
        this.toDetail();
        return;
      }
      if (item.status == 0) {
        this.actionList = this.actionList_0;
      }
      if (item.status == 1) {
        this.actionList = this.actionList_1;
      }
      if (item.status == 2) {
        this.actionList = this.actionList_2;
      }
      if(item.status == 9){
        this.actionList = this.actionList_9;
      }
      this.showOperate = true;
    },
    transformColor(status) {
      // 1 预约成功 2 上课中 3 已下课 7 已撤销
      switch (status) {
        case 0:
          return "#ff9800";
        case 1:
          return "#70b624";
        case 2:
          return "#ef4f4f";
        case 3:
          return "#2ab4fc";
        case 5:
          return "#ef4f4f";
        case 7:
          return "#ef4f4f";
        case 9:
          return "#ffcccc";
      }
    },
    // 上课
    attendClass() {
      this.checkAttendStatus();
    },
    // 取消预约
    cancelClass() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "是否取消预约？",
        success: function success(model_res) {
          if (model_res.confirm) {
            wx.showLoading();
            HttpRequest({
              url: window.api + "/coach/private/appoint/cancelClass",
              data: {
                coachAppointId: that.curSelectClass.coachAppointId,
                storeId: that.curSelectClass.storeId
              },
              success(res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                  HttpRequest({
                    url: '/sendmsg/customer/cancelappointmsg',
                    data: {
                      coachAppointId: that.curSelectClass.coachAppointId
                    }
                  })
                  wx.showModal({
                    title: "提示",
                    content: "取消成功",
                    showCancel: false
                  });
                } else {
                  wx.showModal({
                    title: "提示",
                    content: res.data.message || res.data,
                    showCancel: false
                  });
                }
                that.page = 1;
                that.getList();
                that.showOperate = false;
              }
            });
          }
        }
      });
    },
    // 改约
    anotherTime() {
      wx.navigateTo({
        url: `../appoint_coach/main?type=改约&id=${
          this.curSelectClass.coachAppointId
        }`
      });
    },
    // 下课
    classOver() {
      let that = this;
      wx.showModal({
        title: "提示",
        content: `下课时间：${formatDate(new Date(), "hh:mm")}`,
        confirmText: "确认下课",
        success: function success(res) {
          if (res.confirm) {
            wx.showLoading();
            HttpRequest({
              url: window.api + "/mobile/coach/appoint/finishclass",
              data: {
                coachAppointId: that.curSelectClass.coachAppointId,
                realTimeEnd: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              },
              success(res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                  that.refreshList();
                  wx.showModal({
                    title: "提示",
                    content: "下课成功",
                    showCancel: false
                  });
                } else {
                  wx.showModal({
                    title: "提示",
                    content: res.data.message || res.data,
                    showCancel: false
                  });
                }
                that.page = 1;
                that.getList();
                that.showOperate = false;
              }
            });
          }
        }
      });
    },
    // 获取上课方式
    getAttendClassWay() {
      let that = this;
      HttpRequest({
        url: window.api + "/coach/private/eliminateclass/way",
        data: {
          storeId: that.curSelectClass.storeId
        },
        success(res) {
          if (res.data.code == 200) {
            let way = res.data.data.privateSignWay;
            if (way == 1) {
              // 教练自签
              that.attendclassMethod();
            } else {
              let params;
              params = {
                way: way,
                coachName: that.curSelectClass.coachName,
                coachId: that.curSelectClass.coachId,
                studentName: that.curSelectClass.studentName,
                studentId: that.curSelectClass.id,
                appointId: that.curSelectClass.coachAppointId
              };
              that.showOperate = false;
              wx.hideLoading()
              wx.navigateTo({
                url: "../QRCodeSignIn/main?params=" + JSON.stringify(params)
              });
            }
          }
        }
      });
    },
    // 上课
    attendclassMethod() {
      let that = this;
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/attendclass",
        data: {
          coachAppointId: that.curSelectClass.coachAppointId,
          realTimeStart: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
        },
        success(res) {
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false,
            success(model_res) {
              if (model_res.confirm && res.data.code == 200) {
                let msgData = res.data.data;
                for (let k in msgData) {
                  msgData[k] = msgData[k] ? msgData[k] : "";
                  if(k == "cardCustomerInfoArray") {
                    msgData[k] = null
                  }
                }
                HttpRequest({
                  url: '/sendmsg/customer/consumemsg',
                  data: msgData
                })
                wx.navigateTo({
                  url: `../../appointmentResult/main?coachAppointId=${
                    this.curSelectClass.coachAppointId
                  }&type=staff`
                });
              }
            }
          });
        }
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.calendarStart = obj.startTime;
      this.filter.calendarEnd = obj.endTime;
    },
    filterStatus(status) {
      this.filter.status = status == 0 ? 0 : (status || '');
    },
    filterCoach(id) {
      this.filter.coachId = id || "";
    },
    checkAttendStatus() {
      let that = this;
      wx.showLoading()
      HttpRequest({
        url: window.api + "/coach/private/appoint/verify",
        data: {
          coachAppointId: that.curSelectClass.coachAppointId
        },
        success(res) {
          if (res.data.code == 200) {
            that.getAttendClassWay();
          }
          if (res.data.code == 300) {
            wx.hideLoading()
            wx.showModal({
              title: "提示",
              content: res.data.message,
              success(modal_res) {
                if (modal_res.confirm) {
                  wx.showLoading()
                  HttpRequest({
                    url: window.api + "/mobile/coach/appoint/finishclass",
                    data: {
                      coachAppointId: res.data.data[0].coachAppointId,
                      realTimeEnd: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                    },
                    success(finish_res) {
                      wx.hideLoading()
                      if (finish_res.data.code == 200) {
                        that.getAttendClassWay();
                      } else {
                        wx.showModal({
                          title: "提示",
                          content: finish_res.data.message || finish_res.data,
                          showCancel: false
                        });
                      }
                    }
                  });
                }
              }
            });
          }
          if (res.data.code == 405) {
            wx.hideLoading()
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    // 确认预约 - 确认会员的预约
    confirmAppoint() {
      let that = this
      HttpRequest({
        url: '/mobile/coach/appoint/affirmappoint',
        data: {
          coachAppointId: that.curSelectClass.coachAppointId
        },
        success(res) {
          if(res.data.code == 200) {
            HttpRequest({
              url: '/sendmsg/customer/affirmAppointMsg',
              data: {
                coachAppointId: that.curSelectClass.coachAppointId,
                storeId: that.curSelectClass.storeId
              }
            })
            wx.showModal({
              title: "提示",
              content: res.data.data,
              showCancel: false
            });
            that.showOperate = false
            that.refreshList()
          }
        }
      })
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.private_coach_class {
  .filter-nav {
    .mask {
      top: 165px;
    }
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    .icon-right {
      line-height: 60px;
    }
  }
  .operate-list {
    max-height: 50vh;
    .operate-item {
      border-top: 1rpx solid #eee;
      line-height: 48px;
      text-align: center;
    }
  }
}
</style>
