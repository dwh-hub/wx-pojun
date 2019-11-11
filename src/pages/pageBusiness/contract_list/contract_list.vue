<template>
  <div class="contract-list">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        placeholder="请输入名字或者手机号搜索"
        @selectStore="selectStore"
      ></header-search>
      <filter-date @changeDate="setDate"></filter-date>
      <header-data :headerData="headerData"></header-data>
      <filter-nav :nav="nav" :hasMoreFilter="true" @submitFilter="getFilter" :moreFilterList="moreFilter"></filter-nav>
    </div>
    <div class="card-list common-list">
      <staff-coach-item
        v-for="(item, index) in list"
        :key="index"
        :info="item"
        @clickItem="toCardDetail(item)"
      >
        <div class="slot">
          <img src="/static/images/staff/right-arrow.svg" alt />
        </div>
      </staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading" />
      <none-result text="暂无合同" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
    </div>

    <van-popup
      :show="showModifyPrice"
      @close="showModifyPrice = false"
      :duration="200"
      custom-style="width:85%;border-radius: 5px;"
    >
      <div class="modify-price">
        <div class="modify-title">请输入扣费金额</div>
        <div class="modify-middle">
          <van-stepper :value="modifyPrice" @change="changePrice" />
        </div>
        <div class="modify-btn">
          <div
            class="modify-cancel"
            :style="{background: themeColor}"
            @click="showModifyPrice = false"
          >取消</div>
          <div class="modify-confirm" :style="{background: themeColor}" @click="getUserp">确认</div>
        </div>
      </div>
    </van-popup>

    <van-popup
      :show="showProjectPopup"
      @close="showProjectPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="action-list">
        <div
          class="action-item"
          v-for="(item, index) in projectList"
          :key="index"
          @click="selectProject(item)"
        >{{item.projectName}}</div>
      </div>
    </van-popup>

    <van-popup
      :show="showUserPopup"
      @close="showUserPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="action-list">
        <div
          class="action-item"
          v-for="(item, index) in userpList"
          :key="index"
          @click="selectUser(item)"
        >{{item.customerName}}</div>
      </div>
    </van-popup>
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime(...arguments, 0, 4)"
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
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import filterDate from "../components/filter-date.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      type: "", // 判断点击合同的事件 addStudent = 新增上课学员
      venueId: "", // options 的场馆参数
      teamScheduleId: "", // options 的 teamScheduleId 参数
      classStoreId: "", // 团课的门店
      nav: [
        {
          navTitle: "办理日期",
          name: "办理日期",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterDate();
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
          navTitle: "合同状态",
          name: "合同状态",
          children: [
            {
              sonText: "无"
            }
          ]
        },
        {
          navTitle: "合同类型",
          name: "合同类型",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filterType();
              }
            },
            {
              sonText: "会籍卡",
              action: () => {
                this.filterType(1);
              }
            },
            {
              sonText: "私教卡",
              action: () => {
                this.filterType(4);
              }
            },
            {
              sonText: "团课卡",
              action: () => {
                this.filterType(3);
              }
            },
            {
              sonText: "订金",
              action: () => {
                this.filterType(2);
              }
            }
          ]
        }
      ],
      moreFilter: [
        {
          name: "卡过期",
          isRadio: true,
          isParmas: true,
          isTimer: true,
          param: "doomsdayStart",
          param_2: "doomsdayEnd",
          value: "",
          value_2: "",
          children: [
            {
              name: "今日过期",
              dateValue: "day",
              value: "",
              value_2: ""
            },
            {
              name: "本周过期",
              dateValue: "week",
              value: "",
              value_2: ""
            },
            {
              name: "本月过期",
              dateValue: "month",
              value: "",
              value_2: ""
            },
            {
              name: "昨日过期",
              dateValue: "yesterday",
              value: "",
              value_2: ""
            },
            {
              name: "上周过期",
              dateValue: "lastWeek",
              value: "",
              value_2: ""
            },
            {
              name: "上月过期",
              dateValue: "lastMonth",
              value: "",
              value_2: ""
            },
            {
              name: "近300天过期",
              dateValue: 300,
              value: "",
              value_2: ""
            },
            {
              name: "近90天过期",
              dateValue: 90,
              value: "",
              value_2: ""
            },
            {
              name: "近半年过期",
              dateValue: 180,
              value: "",
              value_2: ""
            }
          ]
        },
        {
          name: "合同标签",
          isRadio: true,
          isParmas: false,
          isTimer: false,
          param: "labelName",
          value: "",
          children: []
        },
        {
          name: "激活日期",
          isRadio: true,
          isParmas: true,
          isTimer: true,
          param: "activateDateStart",
          param_2: "activateDateEnd",
          value: "",
          value_2: "",
          children: [
            {
              name: "今日激活",
              dateValue: "day",
              value: "",
              value_2: ""
            },
            {
              name: "本周激活",
              dateValue: "week",
              value: "",
              value_2: ""
            },
            {
              name: "本月激活",
              dateValue: "month",
              value: "",
              value_2: ""
            },
            {
              name: "昨日激活",
              dateValue: "yesterday",
              value: "",
              value_2: ""
            },
            {
              name: "上周激活",
              dateValue: "lastWeek",
              value: "",
              value_2: ""
            },
            {
              name: "上月激活",
              dateValue: "lastMonth",
              value: "",
              value_2: ""
            },
            {
              name: "近300天激活",
              dateValue: 300,
              value: "",
              value_2: ""
            },
            {
              name: "近90天激活",
              dateValue: 90,
              value: "",
              value_2: ""
            },
            {
              name: "近半年激活",
              dateValue: 180,
              value: "",
              value_2: ""
            }
          ]
        },
      ],
      headerData: [
        {
          dataText: "总计",
          dataNum: "0",
          color: window.color
        },
        {
          dataText: "有效合同",
          dataNum: "0"
        },
        {
          dataText: "过期合同",
          dataNum: "0"
        }
      ],
      // cardstatuslist: [],
      // page: 1,
      list: [{}, {}, {}, {}],
      // isLoading: true,
      filter: {
        nameOrPhone: "",
        transactTimeEnd: "",
        transactTimeStart: "",
        cardType: "",
        cardStatus: "",
        labelName: ""
      },
      selectedCard: {},
      showProjectPopup: false,
      showUserPopup: false,
      showModifyPrice: false,
      modifyPrice: 0,
      projectList: [],
      selectedProject: {},
      userpList: [],
      selectedUser: {}
    };
  },
  onLoad(options) {
    this.type = "";
    if (options.type) {
      this.type = options.type;
      this.venueId = options.venueId;
      this.teamScheduleId = options.teamScheduleId;
      this.classStoreId = options.classStoreId;
    }
    this.getCardStatus();
  },
  mounted() {
    // this.nav[0].navTitle = "今日";
    this.refreshList();
    this.getLabels()
  },
  components: {
    headerSearch,
    headerData,
    filterNav,
    filterDate,
    staffCoachItem,
    noneResult
  },
  mixins: [colorMixin, listPageMixin],
  methods: {
    selectStore(item) {
      this.selectedStore = item;
      this.refreshList()
      this.getLabels()
    },
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    toCardDetail(item) {
      if (this.type == "addStudent") {
        this.selectedCard = item;
        // 新增上课学员
        this.getProject();
        return;
      }
      wx.navigateTo({
        url: `../../cardDetail/main?id=${item.id}&type=staff`
      });
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            page: that.page,
            storeId: that.selectedStore.storeId
          },
          that.filter
        );
        let url = "";
        if (that.type == "addStudent") {
          url = "/customer/card/pages_nolimit";
        } else {
          url = "/customer/card/pages";
        }
        HttpRequest({
          url: "/customer/card/static/count",
          data: _data,
          success(res) {
            that.headerData[1].dataNum = res.data.data.useingCardCount;
            that.headerData[2].dataNum = res.data.data.dueCardCount;
          }
        });
        HttpRequest({
          url: url,
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              that.list = [];
            }
            that.headerData[0].dataNum = res.data.data.recCount || 0;
            let list = res.data.data.result;
            // list = list.filter(e => {
            //   return e.canTeachCard == 1 && e.teachCardType == 2 && e.cardStatus == 2
            // });
            let _data = list.map(async e => {
              if (e.headImgPath) {
                if (e.headImgPath.indexOf(".jsp") != -1) {
                  await that.getAvatar(e.headImgPath).then(res => {
                    e.headImgPath = res;
                  });
                } else {
                  e.headImgPath = window.api + e.headImgPath;
                }
              }
              return {
                id: e.id,
                pactId: e.pactId,
                sex: e.sex,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                rightText: e.cardStatusChar,
                rightBlock: e.masterCradClass + (e.authorityUnitChar ? `/${e.authorityUnitChar}` : ''),
                blockColor: that.transBlockColor(e.teachCardType),
                color: that.transStatusColor(e.cardStatus),
                cardClassId: e.cardClassId || "",
                storeId: e.storeId,
                first_1: e.name,
                // second_1: e.pactId,
                // second_tip_1: "合同编号：",
                second_1: e.secondCardClass,
                third_1: e.activateDate?e.activateDate.split(' ')[0].replace(/-/g, '/')+'-'+e.doomsday.split(' ')[0].replace(/-/g, '/'):'暂未激活',
                third_tip_1: "定期开卡：",
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    // 获取合同标签
    getLabels() {
      let that = this
      HttpRequest({
        url: '/card/label/pages',
        method: 'POST',
        data: {
          storeId: that.selectedStore.storeId,
          isAllData: true
        },
        success(res) {
          that.moreFilter[1].children = res.data.data.result.map(e => {
            return {
              name: e.labelName,
              value: e.labelName
              // value: e.cardLabelId
            }
          })
        }
      })
    },
    transBlockColor(teachCardType) {
      // NORMAL(0,"会籍"),TEAM(1, "团课"),PRIVATE(2, "私教"),VALUE_CARD(3, "储值卡");
      switch (teachCardType) {
        case 0: 
          return '#00baad'
        case 1: 
          return '#7948ea'
        case 2: 
          return '#000000'
        case 3: 
          return '#ff8d1a'
      }
    },
    transStatusColor(status) {
      switch (status) {
        case 2: 
          return '#46c77b'
        case 5: 
          return '#f18d3b'
        case 6: 
          return '#e92444'
        default: 
          return '#666'
      }
    },
    // getCardstatuslist() {
    //   let that = this;
    //   HttpRequest({
    //     url: window.api + "/customer/card/cardstatuslist",
    //     success(res) {
    //       that.cardstatuslist = res.data.data;
    //     }
    //   });
    // },
    // transformCardStatus(status) {
    //   this.cardstatuslist.forEach(e => {
    //     if (e.cardStatus == status) {
    //       return e.cardStatusChar;
    //     }
    //   });
    // },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      // console.log(obj);
      this.filter.transactTimeStart = obj.startTime;
      this.filter.transactTimeEnd = obj.endTime;
    },
    filterType(type) {
      this.filter.cardType = type || "";
    },
    selectProject(item) {
      this.selectedProject = item;
      this.showProjectPopup = false;
      this.modifyPrice = "";
      if (item.isCanModifyFee) {
        this.modifyPrice = item.projectPrice;
        this.showModifyPrice = true;
        return;
      }
      this.getUserp();
    },
    selectUser(item) {
      this.selectedUser = item;
      this.showUserPopup = false;
      this.addAttend();
    },
    /* 上课流程 - 开始 */
    // 获取项目
    getProject() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/getProject",
        data: {
          cardClassId: that.selectedCard.cardClassId,
          storeId: that.classStoreId,
          venueId: that.venueId,
          teamScheduleId: that.teamScheduleId,
          valueCardType: that.selectedCard.teachCardType ? 3 : "" // 2 私教
        },
        success(res) {
          if (res.data.code !== 200) {
            return wx.showModal({
              title: "错误",
              content: res.data.message,
              showCancel: false
            });
          }
          if (res.data.code == 200 && res.data.data.length) {
            let data = res.data.data;
            if (that.selectedCard.teachCardType == 3) {
              data = data.filter(e => e.projectType == 3);
            }
            if (data.length == 1) {
              that.selectedProject = data[0];
              that.selectProject(that.selectedProject);
              // that.getUserp();
            } else {
              that.showProjectPopup = true;
              that.projectList = data;
            }
          }
        }
      });
    },
    // 获取使用人
    getUserp() {
      let that = this;
      this.showModifyPrice = false;
      HttpRequest({
        url: window.api + "/card/relevance/user/get",
        data: {
          cardId: that.selectedCard.id
        },
        success(res) {
          if (res.data.code == 200 && res.data.data.length) {
            if (res.data.data.length == 1) {
              that.selectedUser = res.data.data[0];
              that.addAttend();
            } else {
              that.showUserPopup = true;
              that.userpList = res.data.data;
            }
          }
        }
      });
    },
    addAttend() {
      wx.showLoading({
        title: "上课中..."
      });
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/attend",
        data: {
          projectId: that.selectedProject.projectId,
          storeId: that.classStoreId,
          venueId: that.venueId,
          physicsCardNo: that.selectedUser.physicsCardNo,
          passMode: 10, // 教练点名上课
          teamScheduleId: that.teamScheduleId,
          valueCardFee: that.modifyPrice
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            let msgData = res.data.data;
            for (let k in msgData) {
              msgData[k] = msgData[k] ? msgData[k] : "";
            }
            HttpRequest({
              url: "/sendmsg/customer/teamconsumemsg",
              data: msgData
            });
          }
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          });
        }
      });
    },
    /* 上课流程-结束 */
    changePrice(e) {
      this.modifyPrice = e.mp.detail;
    },
    getCardStatus() {
      let that = this;
      HttpRequest({
        url: "/customer/card/cardstatuslist",
        success(res) {
          let list = res.data.data.map(e => {
            (e.sonText = e.cardStatusChar),
              (e.action = function() {
                that.filter.cardStatus = e.cardStatus;
              });
            return e;
          });
          that.nav[1].children = [
            {
              sonText: "全部(合同状态)",
              action: function() {
                that.filter.cardStatus = "";
              }
            }
          ].concat(list);
        }
      });
    },
    getFilter(parmas) {
      this.filter = Object.assign({}, this.filter, parmas);
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: @pageColor;
}
.contract-list {
  .staff-coach-item {
    border-bottom: 1rpx solid #eee;
    .second-1 {
      color: #999;
    }
    .icon-right {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      padding-right: 10px;
      .right-text {
        font-size: 10px;
      }
      .right-block {
        min-width: 55px;
        box-sizing: border-box;
        line-height: 22px;
        font-size: 10px;
        margin: 0;
        margin-top: 5px;
      }
      .slot {
        height: 100%;
        padding-left: 5px;
        display: flex; 
        align-items: center;
        img {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
  .action-list {
    max-height: 50vh;
    .action-item {
      border-top: 1rpx solid #eee;
      line-height: 48px;
      text-align: center;
    }
  }
}
</style>
