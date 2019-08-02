<template>
  <div class="contract-list">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav :nav="nav"></filter-nav>
    </div>
    <div class="card-list">
      <staff-coach-item
        v-for="(item, index) in list"
        :key="index"
        :info="item"
        @clickItem="toCardDetail(item)"
      ></staff-coach-item>
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
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      type: "", // 判断点击合同的事件 addStudent = 新增上课学员
      venueId: "", // options 的场馆参数
      teamScheduleId: "", // options 的 teamScheduleId 参数
      nav: [
        {
          navTitle: "今日",
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
          navTitle: "筛选条件二",
          children: [
            {
              sonText: "无"
            }
          ]
        },
        {
          navTitle: "卡类型",
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
      headerData: [
        {
          dataText: "总计",
          dataNum: "0"
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
      selectedStore: {},
      storeList: [],
      // isLoading: true,
      filter: {
        nameOrPhone: "",
        transactTimeEnd: "",
        transactTimeStart: "",
        cardType: ""
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
    if (options.type) {
      this.type = options.type;
      this.venueId = options.venueId;
      this.teamScheduleId = options.teamScheduleId;
    }
  },
  mounted() {
    this.nav[0].navTitle = "今日";
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList[0];
    this.filterDate(1);
  },
  components: {
    headerSearch,
    headerData,
    filterNav,
    staffCoachItem,
    noneResult
  },
  mixins: [colorMixin, listPageMixin],
  methods: {
    searchChange(event) {
      this.filter.nameOrPhone = event;
    },
    selectStore(item) {
      this.selectedStore = item;
      this.refreshList();
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
          url: '/customer/card/static/count',
          data: _data,
          success(res) {            
            that.headerData[1].dataNum = res.data.data.useingCardCount
            that.headerData[2].dataNum = res.data.data.dueCardCount
          }
        })
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
                first_1: `${e.name}(${e.pactId})`,
                second_1: e.secondCardClass,
                rightText: e.cardStatusChar,
                cardClassId: e.cardClassId || "",
                storeId: e.storeId
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
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
          storeId: that.selectedCard.storeId,
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
            let data = res.data.data
            if(that.selectedCard.teachCardType == 3) {
              data = data.filter(e => e.projectType == 3)
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
          storeId: that.selectedCard.storeId,
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
            msgData.storeId = that.selectedCard.storeId;
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
    changePrice(e) {
      this.modifyPrice = e.mp.detail;
    }
    /* 上课流程-结束 */
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.contract-list {
  .filter-nav {
    .mask {
      top: 165px;
    }
  }
  .staff-coach-item {
    border-top: 1rpx solid #eee;
    .coach-info {
      line-height: 26px;
    }
    .icon-right {
      line-height: 60px;
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
