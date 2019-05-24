<template>
  <div class="customer">
    <div class="customer-base-info">
      <div class="cover">
        <div class="avatar"></div>
      </div>
      <div class="coach-info">
        <div class="coach-name">{{userInfo.name}}</div>
        <div class="coach-phone">{{userInfo.phone}}</div>
      </div>
      <div class="icon-right" @click="call">
        <img src="/static/images/staff/phone.svg" alt>
      </div>
    </div>
    <van-tabs :active="tabIndex" @change="changeTab" :color="themeColor" swipeable>
      <van-tab title="出勤信息">
        <header-data :headerData="checkInData"></header-data>
        <filter-nav></filter-nav>
        <div class="tab-list-wrapper">
          <list-day-item v-for="(item,index) in checkInList" :key="index"></list-day-item>
        </div>
      </van-tab>
      <van-tab title="跟进回访">
        <header-data :headerData="FollowUpData"></header-data>
        <filter-nav></filter-nav>
        <div class="tab-list-wrapper">
          <list-day-item :info="item" v-for="(item,index) in followUpList" :key="index"></list-day-item>
        </div>
      </van-tab>
      <van-tab title="合同">
        <header-data :headerData="cardData"></header-data>
        <filter-nav></filter-nav>
        <div class="tab-list-wrapper">
          <div class="card-list">
            <card v-for="(item,index) in cardList" :info="item" :key="index"></card>
          </div>
        </div>
      </van-tab>
      <van-tab title="预约记录">
        <header-data :headerData="appointData"></header-data>
        <filter-nav></filter-nav>
        <div class="tab-list-wrapper">
          <list-day-item :info="item" v-for="(item,index) in appointList" :key="index"></list-day-item>
        </div>
      </van-tab>
      <!-- <van-tab title="订单信息"></van-tab> -->
      <van-tab title="更多信息">
        <div class="info">
          <van-cell-group custom-class="van-cell-group">
            <van-cell title="姓名" :value="userInfo.name"/>
            <van-cell title="性别" :value="userInfo.sexChar"/>
            <van-cell title="手机号" :value="userInfo.phone"/>
            <van-cell title="出生日期" :value="userInfo.birthTime || '未填写'"/>
            <van-cell title="身份证号" :value="userInfo.idCardNum || '未填写'"/>
          </van-cell-group>
          <van-cell title="服务教练" @click="showCoachList()">
            <div slot="right-icon">
              <div class="tab-cover" v-for="(item, index) in serviceCoachList" :key="index">
                <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
              </div>
              <van-icon name="arrow" color="#999"/>
            </div>
          </van-cell>
          <van-cell title="服务销售" @click="showSaleList()">
            <div slot="right-icon">
              <div class="tab-cover" v-for="(item, index) in serviceSaleList" :key="index">
                <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
              </div>
              <van-icon name="arrow" color="#999"/>
            </div>
          </van-cell>
          <van-cell title="健身目的" is-link/>
          <van-cell title="客户星级" :value="userInfo.starLevel" is-link/>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 服务销售、服务教练列表 -->
    <van-popup
      :show="showPopup"
      @close="showPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="list">
        <div class="item" v-for="(item, index) in actionList" :key="index">
          <div class="avatar">
            <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
          </div>
          <div class="name">{{item.name}}</div>
          <div class="store">{{item.storeName}}</div>
        </div>
      </div>
    </van-popup>

    <van-popup
      :show="showSelectPopup"
      @close="showSelectPopup = false"
      :duration="200"
      overlay-style="background-color:rgba(0,0,0,0);"
      position="bottom"
      custom-style="width:100%"
      :z-index="101"
    >
      <div class="select-list">
        <div
          class="select-item"
          v-for="(item, index) in selectList"
          :key="index"
          @click="selectListItem(item)"
        >
          <div class="text">{{item.text}}</div>
        </div>
      </div>
    </van-popup>

    <!-- 跟进弹窗 -->
    <van-popup
      :show="showFollowUpPopup"
      @close="showFollowUpPopup = false"
      :duration="200"
      custom-style="width:85vw;border-radius:5px;"
    >
      <div class="followUp-popup">
        <div class="content">
          <van-cell
            title="跟进结果"
            is-link
            :value="selectTrackResult.text"
            @click="selectListType=1;selectList = trackResult;showSelectPopup = true"
          />
          <van-cell title="下次跟进" is-link :value="currentDate" @click="showDatePopup = true"/>
          <van-cell
            title="跟进类型"
            is-link
            :value="selectedTrackType.text"
            @click="selectListType=2;selectList = trackusertype;showSelectPopup = true"
          />
          <textarea class="textarea" v-model="trackContent" placeholder="请输入跟进内容"/>
        </div>
        <div class="popup-bottom-btn">
          <div class="cancel" :style="{color: themeColor}" @click="showFollowUpPopup = false">取消</div>
          <div class="save" :style="{backgroundColor: themeColor}" @click="saveFollowUp()">保存</div>
        </div>
      </div>
    </van-popup>

    <!-- 预约弹窗 -->
    <van-popup
      :show="showAppointPopup"
      @close="showAppointPopup = false"
      :duration="200"
      custom-style="width:85vw;border-radius:5px;"
    >
      <div class="appoint-popup">
        <div class="content">
          <van-cell
            title="预约目的"
            is-link
            :value="selectObjective.text"
            @click="selectListType=3;selectList = appointObjective;showSelectPopup = true"
          />
          <van-cell title="预约时间" is-link :value="currentDate" @click="showDatePopup = true"/>
          <textarea class="textarea" v-model="trackContent" placeholder="请输入预约备注"/>
        </div>
        <div class="popup-bottom-btn">
          <div class="cancel" :style="{color: themeColor}" @click="showAppointPopup = false">取消</div>
          <div class="save" :style="{backgroundColor: themeColor}" @click="saveAppoint">保存</div>
        </div>
      </div>
    </van-popup>

    <van-popup
      :show="showDatePopup"
      @close="showDatePopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%;"
    >
      <van-datetime-picker
        type="datetime"
        :value="currentDateStamp"
        :min-date="currentDateStamp"
        :formatter="formatter"
        @confirm="changeDate"
      />
    </van-popup>

    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="getOperate"></suspension-window>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import listDayItem from "../components/list-day-item.vue";
import suspensionWindow from "../components/suspension-window.vue";
import colorMixin from "COMPS/colorMixin.vue";
import card from "COMPS/card";
export default {
  data() {
    return {
      tabIndex: 0,
      id: 0,
      storeId: 0,
      isOperate: false,
      checkInData: [
        {
          dataText: "签到",
          dataNum: "0"
        },
        {
          dataText: "团课",
          dataNum: "0"
        },
        {
          dataText: "私教",
          dataNum: "0"
        }
      ],
      FollowUpData: [
        {
          dataText: "总计",
          dataNum: "12"
        },
        {
          dataText: "数据一",
          dataNum: "0"
        },
        {
          dataText: "数据二",
          dataNum: "0"
        }
      ],
      cardData: [
        {
          dataText: "合同数",
          dataNum: "12"
        },
        {
          dataText: "数据一",
          dataNum: "0"
        },
        {
          dataText: "数据二",
          dataNum: "0"
        }
      ],
      appointData: [
        {
          dataText: "预约数",
          dataNum: "12"
        },
        {
          dataText: "数据一",
          dataNum: "0"
        },
        {
          dataText: "数据二",
          dataNum: "0"
        }
      ],
      appointList: [],
      followUpList: [],
      checkInList: [{}, {}, {}],
      cardList: [
        {
          id: 213697,
          storeId: 94,
          customerId: 310742,
          name: "会员",
          sex: null,
          phone: "18000241486",
          handleUserId: null,
          cardClassId: 727,
          cardBalance: null,
          buyCardTime: "2019-05-06 17:11:39.0",
          openCardTime: null,
          endCardTime: null,
          cardStatus: "2",
          cardStatusChar: "使用中",
          cardClassName: "会籍1000元卡",
          cardClass: null,
          storeName: "思明店",
          balanceAuthority: 1000.0,
          totalAuthority: 1000.0,
          authorityUnit: "元",
          isCanTransCard: 1,
          masterClassName: "普通会籍卡",
          activateDate: "2019-05-06 17:11:56",
          doomsday: "2020-05-04 17:11:56",
          cardNo: null,
          companyId: null,
          isSubscriptionPact: 0,
          isCanBack: null,
          physicsCardNo: "1171149410660148",
          authorityUnitChar: null,
          pactId: "3213",
          openId: null,
          periodOfValidity: 365,
          canTeachCard: 0,
          isActivityByPhoto: null,
          sellingPrice: 1000.0,
          canTransfer: 1,
          canLossMake: 1,
          isCanStopCard: 0,
          isCanOverdueStopCard: 0,
          isRealCanstopCard: null,
          isRealCanLossMake: null,
          isRealCanTransfer: null,
          isRealCanTransCard: null,
          isRealCanLabel: null,
          coachName: null,
          coachUserId: null,
          coachSex: null,
          transactUserId: 986,
          transactUserName: "王老板",
          otherDays: null,
          otherAuthority: null,
          cardAddTime: 1557133916000,
          timesUser: null,
          mainUser: "会员",
          teachCardType: 0,
          compactNum: 1,
          remarks: null
        }
      ],
      operateList: [
        {
          text: "一键上课",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "客户跟进",
          iconUrl: "/static/images/staff/close.svg",
          action: () => {
            this.followUp();
          }
        },
        {
          text: "来访预约",
          iconUrl: "/static/images/staff/close.svg",
          action: () => {
            this.appoint();
          }
        },
        {
          text: "预约上课",
          iconUrl: "/static/images/staff/close.svg"
        }
      ],
      // 姓名、电话、性别 、出身月份、身份证
      customerInfo: {
        baseInfo: {
          name: "王小明",
          phone: "18000000000",
          sex: "男",
          birthDay: "1998-08-18",
          identityCard: "3623335649875615231"
        }
      },
      serviceCoachList: [],
      serviceSaleList: [],
      trackusertype: [],
      trackResult: [{ id: 1, text: "继续跟进" }, { id: 3, text: "不确定" }],
      appointObjective: [
        { id: 1, text: "参观" },
        { id: 2, text: "办理" },
        { id: 3, text: "体验课" },
        { id: 4, text: "上课" }
      ],
      userInfo: {},
      showPopup: false,
      showSelectPopup: false,
      showFollowUpPopup: false,
      showDatePopup: false,
      showAppointPopup: false,
      // 下弹出来的list
      actionList: [],
      selectList: [],
      // 当前时间
      currentDateStamp: new Date().getTime(),
      currentDate: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
      selectedTrackType: {},
      selectTrackResult: { id: 1, text: "继续跟进" },
      selectObjective: { id: "", text: "请选择" },
      trackContent: "",
      operateText: "",
      selectListType: 0, // 1 跟进结果列表 2 跟进类型列表 3 预约目的
    };
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    listDayItem,
    suspensionWindow,
    card
  },
  mounted() {
    setNavTab();
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
    this.getAppointList();
    this.getCheckInList();
    this.getFollowUpList();
    this.getCardList();
  },
  methods: {
    call() {
      let that = this;
      wx.makePhoneCall({
        phoneNumber: that.userInfo.phone
      });
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    getDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/archives/detail",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            let _data = res.data.data;
            let _serviceCoachList = [];
            let _serviceSaleList = [];

            _data.starLevel = _data.starLevel ? _data.starLevel + "星" : "暂无";
            that.userInfo = _data;
            that.storeId = _data.storeId;
            that.getTrackusertype();

            _data.customerStoreArrays.forEach(e => {
              _serviceCoachList.push({
                storeId: e.storeId,
                storeName: e.storeName,
                name: e.serviceCoachName,
                id: e.serviceCoachId
              });
              _serviceSaleList.push({
                storeId: e.storeId,
                storeName: e.storeName,
                name: e.serviceUserName,
                id: e.serviceUserId
              });
            });

            that.serviceCoachList = _serviceCoachList;
            that.serviceSaleList = _serviceSaleList;
          }
        }
      });
    },
    showCoachList() {
      this.showPopup = true;
      this.actionList = this.serviceCoachList;
    },
    showSaleList() {
      this.showPopup = true;
      this.actionList = this.serviceSaleList;
    },
    // 跟进
    getFollowUpList() {
      let that = this;
      HttpRequest({
        url: window.api + "/user/work/customer/track",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.FollowUpData[0].dataNum = res.data.data.length || 0;
            that.followUpList = res.data.data.map(e => {
              return {
                id: e.trackUserId,
                day: e.trackTime.substring(8, 10),
                month: e.trackTime.substring(5, 7),
                topText: "操作人：" + e.userName,
                bottomText: "内容：" + e.content
              };
            });
          }
        }
      });
    },
    // 跟进类型
    getTrackusertype() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/track/trackusertype",
        data: {
          storeId: that.storeId,
          customerId: that.id
        },
        success(res) {
          for (let i in res.data.data) {
            that.trackusertype.push({
              id: i,
              text: res.data.data[i]
            });
          }
          that.selectedTrackType = that.trackusertype[0] || "";
        }
      });
    },
    // 合同
    getCardList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/card/cardInfos",
        data: {
          customerId: that.id,
          page: 1
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.cardData[0].dataNum = res.data.data.pageSize;
            that.cardList = res.data.data.result;
          }
        }
      });
    },
    // 预约
    getAppointList() {
      let that = this;
      HttpRequest({
        url: window.api + "/user/work/customer/reserved/own",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.appointData[0].dataNum = res.data.data.length;
            that.appointList = res.data.data.map(e => {
              return {
                id: e.reservedId,
                day: e.appointmentTime.substring(8, 10),
                month: e.appointmentTime.substring(5, 7),
                topText: "操作人：" + e.receiverName,
                bottomText: "内容：" + e.remarks
              };
            });
          }
        }
      });
    },
    // 签到/出勤/消费
    getCheckInList() {
      let that = this;
      HttpRequest({
        url: window.api + "/consumption/log/pages",

        data: {
          customerId: that.id,
          pageNo: 1
        },
        success: function(res) {
          console.log(res);
          that.checkInData[0].dataNum = res.data.data.recCount;
          if (res.data.code == 200) {
            that.checkInList = res.data.data.result.map(e => {
              return {
                id: e.consumptionLogId,
                day: e.startTime.substring(8, 10),
                month: e.startTime.substring(5, 7),
                topText: e.secondCardClassName,
                bottomText: e.passModeValue
              };
            });
          }
        }
      });
    },
    changeTab(e) {
      console.log(e.mp.detail);
      this.changeTab.tabIndex = e.mp.detail.index;
    },
    // 通过回传的iconText来获取对应的列表
    getOperate(param) {},
    changeDate(e) {
      this.showDatePopup = false;
      this.currentDateStamp = e.mp.detail;
      this.currentDate = formatDate(
        new Date(e.mp.detail),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    followUp() {
      this.trackContent = "";
      this.showFollowUpPopup = true;
    },
    appoint() {
      this.trackContent = "";
      this.showAppointPopup = true;
    },
    saveFollowUp() {
      if (!this.trackContent.length) {
        return wx.showToast({
          title: "请输入跟进内容",
          icon: "none",
          duration: 1000
        });
      }
      if (this.trackContent.length < 5) {
        return wx.showModal({
          title: "提示",
          content: "跟进内容不能少于5个字",
          showCancel: false
        });
      }
      let that = this;
      HttpRequest({
        url: window.api + "/customer/track/inserttrack",
        data: {
          customerId: that.id,
          trackResult: that.selectTrackResult.id,
          nextTrackTime: that.currentDate,
          content: that.trackContent,
          storeId: that.storeId,
          customerClass: that.userInfo.customerClass,
          TrackUserType: that.selectedTrackType.id
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message || '跟进成功',
              icon: "success",
              duration: 1000
            });
            that.getFollowUpList()
            that.showFollowUpPopup = false;
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
    saveAppoint() {
      if (!this.selectObjective.id) {
        return wx.showToast({
          title: "请选择预约目的",
          icon: "none",
          duration: 1000
        });
      }
      if (!this.trackContent.length) {
        return wx.showToast({
          title: "请输入预约内容",
          icon: "none",
          duration: 1000
        });
      }
      let that = this
      HttpRequest({
        url: window.api + "/customer/reserved/addreserved",
        data: {
          customerId: that.id,
          appointmentPurpose: that.selectObjective.id,
          appointmentTime: that.currentDate,
          remarks: that.trackContent,
          content: that.selectObjective.text,
          storeId: that.storeId
        },
        success(res) {
          if(res.data.code == 200) {
            wx.showToast({
              title: res.data.message || '预约成功',
              icon: "success",
              duration: 1000
            });
            that.getAppointList()
            that.showAppointPopup = false;
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
    selectListItem(item) {
      if(this.selectListType==1) {
        this.selectTrackResult = item
      } else if (this.selectListType==2) {
        this.selectedTrackType = item
      } else if (this.selectListType==3) {
        this.selectObjective = item
      }
      this.showSelectPopup = false;
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.customer {
  .customer-base-info {
    display: flex;
    background-color: #fff;
    padding: 10px 0;
    padding-right: 15px;
    .cover {
      flex: 0 0 52px;
      width: 52px;
      height: 52px;
      padding-left: 12px;
      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        background-color: #eee;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: 50% 50%;
      }
    }
    .coach-info {
      flex: 1;
      padding-left: 12px;
      color: #505050;
      > div {
        line-height: 26px;
        .Mult-line(1);
      }
    }
    .icon-right {
      margin-top: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .filter-nav {
    margin-top: 5px;
    .mask {
      top: 240px;
    }
  }
  .tab-list-wrapper {
    overflow: auto;
    height: 61vh;
  }
  .card-list {
    padding: 0 20px;
    .card {
      margin-top: 15px;
    }
  }
  ._van-cell-group {
    margin-bottom: 5px;
  }

  .list {
    .item {
      padding-right: 15px;
      border-top: 1rpx solid #eee;
      > div {
        display: inline-block;
      }
      .avatar {
        width: 50px;
        height: 50px;
        padding: 7px 10px;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .store {
        float: right;
      }
      .name,
      .store {
        line-height: 65px;
      }
    }
  }
  .select-list {
    .select-item {
      line-height: 50px;
      padding-left: 20px;
      font-size: 16px;
      border-top: 1rpx solid #eee;
    }
  }
  .followUp-popup,
  .appoint-popup {
    .content {
      padding: 15px;
      box-sizing: border-box;
      .textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        min-height: 75px;
        font-size: 14px;
        border: 1rpx solid #ccc;
      }
    }
  }
  .popup-bottom-btn {
    display: flex;
    border-top: 1rpx solid #eee;
    > div {
      flex: 1;
      line-height: 36px;
      text-align: center;
    }
    .save {
      color: #fff;
    }
    .cancel {
      background-color: #fff;
    }
  }
  .tab-cover {
    display: inline-block;
    vertical-align: middle;
    width: 25px;
    height: 25px;
    margin-right: 5px;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .van-icon {
    display: inline-block;
    vertical-align: middle;
  }
  .van-cell__title,
  .van-cell__value {
    flex-basis: auto;
  }
}
</style>
