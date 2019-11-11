<template>
  <div class="customer">
    <div class="sticky-block">
      <div class="customer-base-info" :style="{'background-color': themeColor}">
        <div class="cover">
          <!-- <div class="avatar"></div> -->
          <image :src="userInfo.headImgPath" mode="aspectFill"></image>
        </div>
        <div class="coach-info">
          <div class="coach-name">{{userInfo.name}}</div>
          <div class="coach-phone">{{userInfo.phone}}</div>
        </div>
        <div class="icon-right" @click="call">
          <img src="/static/images/staff/phone_2.png" alt>
        </div>
      </div>
      <div class="surface">
        <div class="circular" :style="{'background-color': themeColor}"></div>
      </div>
      <header-data :headerData="customerSumData"></header-data>
      <van-tabs :active="tabIndex" @change="changeTab" tab-class="van-tab-class" line-height="1" :color="themeColor">
        <van-tab title="基本资料"></van-tab>
        <van-tab title="出勤信息"></van-tab>
        <van-tab title="跟进回访"></van-tab>
        <van-tab title="合同"></van-tab>
      </van-tabs>
    </div>
    
    <swiper :indicator-dots="false" duration="500" :style="{height: scrollViewHeight+'px'}" :current="tabIndex" @change="swiperTab">
      <swiper-item style="overflow: scroll">
        <div class="info shadow-block-item">
          <van-cell-group custom-class="van-cell-group">
            <!-- <van-cell title="基本信息" is-link @click="toUserInfo"/> -->
            <van-cell title="姓名" is-link :value="userInfo.name" @click="toInfoCell('name', userInfo.name)"></van-cell>
            <van-cell title="性别" is-link :value="userInfo.sexChar" @click="showSexAction"/>
            <van-cell title="手机号" :value="userInfo.phone" @click="toInfoCell('phone', userInfo.phone)" is-link/>
          </van-cell-group>
           <!-- ↓↓旧版 -->
          <!-- <van-cell title="服务教练" @click="showCoachList()">
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
          </van-cell> -->
          <van-cell title="服务教练" :value="serviceCoachText || '无'" />
          <van-cell title="服务销售" :value="serviceSaleText || '无'" />
          <van-cell title="预约记录" @click="toAppointList" :value="appointList.length+'条'" is-link/>
          <van-cell title="身份证号" :value="userInfo.identityCard || '未填写'" @click="toInfoCell('identityCard', userInfo.identityCard)" is-link />
          <van-cell title="出生日期" is-link>
            <div style="color: #999">
              <picker mode="date" :value="userInfo.birthTime" @change="changeBirthTime">
                <view class="picker">
                  {{userInfo.birthTime || '未填写'}}
                </view>
              </picker>
            </div>
          </van-cell>
          <van-cell title="客户备注" :value="userInfo.remarks || '未填写'"/>
          <van-cell title="健身目的" :value="userInfo.purpose || '未填写'"/>
          <van-cell title="客户星级">
            <van-rate :value="userInfo.starLevel" v-if="userInfo.starLevel" readonly/>
            <div style="color: #999;" v-else>未填写</div>
          </van-cell>
          <!-- <van-cell title="客户星级" :value="userInfo.starLevel"/> -->
          <van-cell title="喜好" :value="userInfo.interest || '未填写'"/>
        </div>
      </swiper-item>
      <swiper-item>
        <header-data :headerData="checkInData"></header-data>
        <scroll-view
          scroll-y
          :style="{height: scrollViewHeight-80 + 'px'}"
          @scrolltolower="getCheckInList()"
        >
          <!-- <list-day-item :info="item" v-for="(item,index) in checkInList" :key="index"></list-day-item> -->
          <div class="check-in-list shadow-block-item">
            <div class="check-in-item" v-for="(item,index) in checkInList" :key="index">
              <div class="check-in-content">
                <div class="name">{{item.name}}</div>
                <div class="time">{{item.date}}</div>
              </div>
              <div class="check-in-type">{{item.type}}</div>
            </div>
          </div>
          <none-result text="暂无出勤记录" v-if="!checkInList.length && !isCheckInLoading"></none-result>
          <van-loading :color="themeColor" v-if="isCheckInLoading"/>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <!-- <header-data :headerData="FollowUpData"></header-data> -->
        <scroll-view scroll-y :style="{height: scrollViewHeight + 'px'}">
          <!-- <list-day-item :info="item" v-for="(item,index) in followUpList" :key="index"></list-day-item> -->
          <div class="scroll-cell-list">
            <div class="cell-block shadow-block-item" v-for="(item,index) in followUpList" :key="index">
              <div class="time"><img class="clock" src="/static/images/clock-icon.png"><span>{{item.trackTime}}</span></div>
              <div class="cell-item">
                <div class="cell-text">跟进内容</div>
                <div class="cell-value">{{item.content || '无'}}</div>
              </div>
              <div class="cell-item">
                <div class="cell-text">跟进人</div>
                <div class="cell-value">{{item.userName}}</div>
              </div>
            </div>
          </div> 
          <none-result text="暂无跟进回访" v-if="!followUpList.length && !isFollowUpLoading"></none-result>
          <van-loading :color="themeColor" v-if="isFollowUpLoading"/>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <!-- <header-data :headerData="cardData"></header-data> -->
        <scroll-view
          scroll-y
          :style="{height: scrollViewHeight + 'px'}"
          @scrolltolower="getCardList()"
        >
          <div class="card-list shadow-block-item">
            <!-- <card
              v-for="(item,index) in cardList"
              :info="item"
              :key="index"
              @hasClick="toCardDetail(item)"
            ></card> -->
            <div class="card-item" v-for="(item,index) in cardList" :key="index" @click="toCardDetail(item)">
              <div class="card-wrapper">
                <div class="time"><img class="clock" src="/static/images/clock-icon.png"><span>{{item.buyCardTime}}</span></div>
                <div class="card-new" :style="{'background-color': item.color}">
                  <div class="card-top">
                    <div class="card-info">
                      <div class="card-name">{{item.cardClassName}}</div>
                      <div class="card-equity">{{item.doomsday}}到期  {{item.totalAuthority}}{{item.authorityUnit}}  余{{item.balanceAuthority}}{{item.authorityUnit}}</div>
                    </div>
                    <div class="card-type">
                      <img src="/static/images/staff/card.png" alt="">
                      <span>次卡</span>
                    </div>
                  </div>
                  <div class="card-bottom">
                    <div class="card-use">
                      <div class="use-people">
                        <img :src="userInfo.headImgPath" class="avatar" alt="">
                      </div>
                      <div class="use-NO">NO:{{item.physicsCardNo || '--'}}</div>
                    </div>
                    <div class="card-status" :style="{'color': item.color}">{{item.cardStatusChar}}</div>
                  </div>
                </div>
              </div>
              <van-icon name="arrow"></van-icon>
            </div>
          </div>
          <none-result text="暂无合同" v-if="!cardList.length && !isCardLoading"></none-result>
          <van-loading :color="themeColor" v-if="isCardLoading"/>
        </scroll-view>
      </swiper-item>
    </swiper>

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
      custom-style="width:85vw;border-radius:5px;top: 40%;"
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
          <!-- <van-cell
            title="跟进类型"
            is-link
            :value="selectedTrackType.text"
            @click="selectListType=2;selectList = trackusertype;showSelectPopup = true"
          />-->
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
      custom-style="width:85vw;border-radius:5px;top: 40%;"
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

    <suspension :operateList="operateList" @operate="getOperate"></suspension>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import {checkAuth} from "../common/js/service_config.js";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import listDayItem from "../components/list-day-item.vue";
import suspension from "../components/suspension.vue";
import colorMixin from "COMPS/colorMixin.vue";
import card from "COMPS/card";
import noneResult from "COMPS/noneResult.vue";
import { EventBus } from "../common/js/eventBus.js";

export default {
  data() {
    return {
      // 页面总高度
      windowHeight: 0,
      // scroll-view的高度
      scrollViewHeight: 0,
      tabIndex: 0,
      id: 0,
      storeId: 0,
      customerSumData: [
        {
          dataText: "消费总额",
          dataNum: "0",
          color: '#ff9e17'
        },
        {
          dataText: "活跃次数(次)",
          dataNum: "0",
          color: '#14c88b'
        },
      ],
      checkInData: [
        {
          dataText: "签到",
          dataNum: "0",
          color: '#119bf0'
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
          dataNum: "0"
        },
        {
          dataText: "使用中",
          dataNum: "0"
        },
        {
          dataText: "过期",
          dataNum: "0"
        }
      ],
      appointList: [],
      followUpList: [],
      isFollowUpLoading: true,
      checkInList: [],
      isCheckInLoading: true,
      cardList: [],
      isCardLoading: true,
      operateList: [
        {
          text: "一键上课",
          iconUrl: "/static/images/staff/close.svg",
          class: 'operate icon-yijian',
          authorityId: 168,
          hasAuth: checkAuth(168),
          action: () => {
            this.checkAttendStatus();
          }
        },
        {
          text: "客户跟进",
          iconUrl: "/static/images/staff/genjin.png",
          class: '',
          authorityId: 27,
          hasAuth: checkAuth(27),
          action: () => {
            this.followUp();
          }
        },
        {
          text: "来访预约",
          iconUrl: "/static/images/staff/close.svg",
          class: 'operate icon-yuyue',
          authorityId: 207,
          hasAuth: checkAuth(207),
          action: () => {
            this.appoint();
          }
        },
        {
          text: "预约上课",
          iconUrl: "/static/images/staff/close.svg",
          class: 'operate icon-shangke',
          authorityId: 168,
          hasAuth: checkAuth(168),
          action: () => {
            this.toAppoint();
          }
        },
        {
          text: "上传头像",
          iconUrl: "/static/images/staff/face.svg",
          class: 'operate icon-shangke',
          hasAuth: true,
          action: () => {
            wx.navigateTo({
              url: `../face_collect/main?id=${this.id}&phone=${this.userInfo.phone}`
            })
          }
        }
      ],
      checkInPage: 1,
      cardpage: 1,
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
      serviceCoachText: '',
      serviceSaleText: '',
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
      selectListType: 0 // 1 跟进结果列表 2 跟进类型列表 3 预约目的
    };
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    listDayItem,
    suspension,
    card,
    noneResult
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  onShow() {
    setNavTab();
    this.getDetail();
    EventBus.$on('modifyCell', (obj) => {
      this.modifyInfo(obj.name, obj.value)
    })
  },
  onLoad(options) {
    this.id = options.id;
    this.computedScrollHeight();
    this.getAppointList();
    this.getCheckInList();
    this.getFollowUpList();
    this.getCardList();
  },
  onUnload() {
    this.clearData();
    // console.log("customer_detail_onUnload");
  },
  methods: {
    toCardDetail(item) {
      wx.navigateTo({
        // url: "../../cardDetail/main?id=" + item.id
        url: `../../cardDetail/main?id=${item.id}&type=staff`
      });
    },
    toUserInfo(item) {
      wx.navigateTo({
        url: "../staff_base_info/main?id=" + this.userInfo.id
      });
    },
    attendClass() {
      let that = this;
      wx.navigateTo({
        url: `../appoint_coach/main?id=${that.id}&type=一键上课`
      });
    },
    toAppoint() {
      let that = this;
      wx.navigateTo({
        url: `../appoint_coach/main?id=${that.id}&type=预约`
      });
    },
    swiperTab(e) {
      this.tabIndex = e.mp.detail.current
    },
    clearData() {
      this.tabIndex = 0
      this.checkInPage = 1;
      this.cardpage = 1;
      this.appointList = [];
      this.followUpList = [];
      this.checkInList = [];
      this.cardList = [];
      this.userInfo = {};
      this.isAppointLoading = true;
      this.isFollowUpLoading = true;
      this.isCheckInLoading = true;
      this.isCardLoading = true;
      this.showFollowUpPopup = false
    },
    computedScrollHeight() {
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          that.windowHeight = res.windowHeight;
        }
      });

      let query = wx.createSelectorQuery();
      query.select(".sticky-block").boundingClientRect();
      // let tabsFixedHeight = 110; //164;

      query.exec(res => {
        let stickyHeight = res[0].height;
        let scrollViewHeight = this.windowHeight - stickyHeight;
        this.scrollViewHeight = scrollViewHeight;
      });
    },
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
            let _serviceCoachText = '';
            let _serviceSaleText = '';
            that.customerSumData[0].dataNum = res.data.data.totalSellingPrice || 0
            that.customerSumData[1].dataNum = res.data.data.enterNum || 0

            // _data.starLevel = _data.starLevel ? _data.starLevel + "星" : "暂无";
            _data.headImgPath = _data.headImgPath
              ? window.api + _data.headImgPath
              : window.api + "/assets/img/morenTo.png";
            that.userInfo = _data;
            that.storeId = _data.storeId;
            that.getTrackusertype();
            _data.customerStoreArrays.forEach(e => {
              if (e.serviceCoachId) {
                _serviceCoachText += `${e.storeName}  ${e.serviceCoachName}`
                _serviceCoachList.push({
                  storeId: e.storeId,
                  storeName: e.storeName,
                  name: e.serviceCoachName,
                  // cover: e.headImgPath ? window.api + e.headImgPath : "http://pojun-tech.cn/assets/img/manimg.jpg",
                  id: e.serviceCoachId
                });
              }
              if (e.serviceUserId) {
                _serviceSaleText += `${e.storeName}  ${e.serviceUserName}`
                _serviceSaleList.push({
                  storeId: e.storeId,
                  storeName: e.storeName,
                  name: e.serviceUserName,
                  // cover: e.headImgPath ? window.api + e.headImgPath : "http://pojun-tech.cn/assets/img/manimg.jpg",
                  id: e.serviceUserId
                });
              }
            });

            that.serviceCoachText = _serviceCoachText
            that.serviceSaleText = _serviceSaleText
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
    // 跟进列表
    getFollowUpList() {
      let that = this;
      this.isFollowUpLoading = true;
      HttpRequest({
        url: window.api + "/user/work/customer/track",
        data: {
          customerId: that.id
        },
        success: function(res) {
          that.isFollowUpLoading = false;
          if (res.data.code == 200) {
            that.FollowUpData[0].dataNum = res.data.data.length || 0;
            that.followUpList = res.data.data.map(e => {
              return {
                id: e.trackUserId,
                content: e.content.replace(/&nbsp;/g, '').replace(/null/g, ''),
                userName: e.userName,
                trackTime: e.trackTime.replace(/-/g, '/')
                // day: e.trackTime.substring(8, 10),
                // month: e.trackTime.substring(5, 7),
                // bottomText: "操作人：" + e.userName,
                // topText: "内容：" + e.content
              };
            });
          }
        }
      });
    },
    // 合同列表
    getCardList() {
      let that = this;
      this.isCardLoading = true;
      HttpRequest({
        url: window.api + "/customer/card/cardInfos",
        data: {
          customerId: that.id,
          page: that.cardpage,
          pageCount: 100
        },
        success: function(res) {
          that.isCardLoading = false;
          if (res.data.code == 200) {
            let list = res.data.data.result
            if (!list.length) {
              return;
            }
            that.cardData[0].dataNum = 0
            that.cardpage++;
            that.cardData[0].dataNum = res.data.data.pageSize;
            list = list.map(e => {
              for (let k in e) {
                if (undefined == e[k] || null == e[k]) {
                  delete e[k]
                }
              }
              e.color = that.transCardColor(e)
              e.buyCardTime = e.buyCardTime.split(' ')[0].replace(/-/g, '/')
              e.doomsday = e.doomsday ? e.doomsday.split(' ')[0].replace(/-/g, '/') : '--'
              return e
            })
            that.cardList = that.cardList.concat(list);
          }
        }
      });
    },
    transCardColor(info) {
      if(info.cardStatus != 2) return '#999'
      if(info.authorityUnit == '次' || info.authorityUnit == '2') return '#9061fc'
      if(info.authorityUnit == '元' || info.authorityUnit == '0') return '#13bfc4'
      if(info.authorityUnit == '天' || info.authorityUnit == '1') return '#ff924f'
    },
    // 预约列表
    getAppointList() {
      let that = this;
      HttpRequest({
        url: window.api + "/user/work/customer/reserved/own",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            let list = res.data.data.map(e => {
              return {
                id: e.reservedId,
                day: e.appointmentTime.substring(8, 10),
                month: e.appointmentTime.substring(5, 7),
                topText: "操作人：" + e.receiverName,
                bottomText: "内容：" + e.remarks
              };
            });
            that.appointList = list;
          }
        }
      });
    },
    toAppointList() {
      if (!this.appointList.length) {
        return wx.showToast({
          title: "暂无预约记录",
          icon: "none",
          duration: 1000
        });
      }
      wx.navigateTo({
        url: `../common_list/main?list=${JSON.stringify(
          this.appointList
        )}&title=预约记录`
      });
    },
    // 签到/出勤/消费 列表
    getCheckInList() {
      let that = this;
      this.isCheckInLoading = true;
      let week = ['日','一','二','三','四','五','六']
      HttpRequest({
        url: window.api + "/consumption/log/pages",

        data: {
          customerId: that.id,
          pageNo: that.checkInPage
        },
        success: function(res) {
          that.isCheckInLoading = false;
          that.checkInData[0].dataNum = res.data.data.recCount;
          if (res.data.code == 200) {
            if (!res.data.data.result.length) {
              return;
            }
            that.checkInPage++;
            let _data = res.data.data.result.map(e => {
              let date = e.startTime.replace(/-/g, '/')
              let _week = '星期'+week[new Date(date).getDay()]
              return {
                id: e.consumptionLogId,
                name: e.secondCardClassName,
                type: e.passModeValue,
                date: date.substring(0, 16)+' '+_week
                // day: e.startTime.substring(8, 10),
                // month: e.startTime.substring(5, 7),
                // topText: e.secondCardClassName,
                // bottomText: e.passModeValue
              };
            });
            that.checkInList = that.checkInList.concat(_data);
          }
        }
      });
    },
    changeTab(e) {
      this.tabIndex = e.mp.detail.index;
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
      wx.showLoading()
      HttpRequest({
        url: window.api + "/customer/track/inserttrack",
        data: {
          customerId: that.id,
          trackResult: that.selectTrackResult.id,
          nextTrackTime: that.currentDate,
          content: that.trackContent,
          storeId: that.storeId,
          customerClass: that.userInfo.customerClass,
          TrackUserType: that.selectedTrackType.id || "1"
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message || "跟进成功",
              icon: "success",
              duration: 1000
            });
            that.getFollowUpList();
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
      let that = this;
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
          if (res.data.code == 200) {
            HttpRequest({
              url: '/sendmsg/customer/normalReservedMsg',
              data: {
                customerId: that.id,
                appointmentPurpose: that.selectObjective.id,
                appointmentTime: that.currentDate,
                remarks: that.trackContent,
                content: that.selectObjective.text,
                storeId: that.storeId
              }
            })
            wx.showToast({
              title: res.data.message || "预约成功",
              icon: "success",
              duration: 1000
            });
            that.getAppointList();
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
      if (this.selectListType == 1) {
        this.selectTrackResult = item;
      } else if (this.selectListType == 2) {
        this.selectedTrackType = item;
      } else if (this.selectListType == 3) {
        this.selectObjective = item;
      }
      this.showSelectPopup = false;
    },
    checkAttendStatus() {
      let that = this;
      wx.showLoading()
      HttpRequest({
        url: window.api + "/coach/private/appoint/verifycoachId",
        data: {
          coachId: wx.getStorageSync("staff_info").userId
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.attendClass();
          }
          if (res.data.code == 300) {
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
                        that.attendClass();
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
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    showSexAction() {
      let that = this
      wx.showActionSheet({
        itemList: ['男', '女'],
        success (res) {
          that.modifyInfo('sex',res.tapIndex+1)
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    },
    changeBirthTime(event) {
      this.modifyInfo('birthTime', event.mp.detail.value)
    },
    toInfoCell(name, value) {
      wx.navigateTo({
        url: `../modify_cell/main?type=customer&name=${name}&value=${value || ''}`
      });
    },
    // 修改信息
    modifyInfo(name, value) {
      wx.showLoading({
        title: '修改中..'
      })
      let data = {
        id: this.userInfo.id,
        name: this.userInfo.name,
        phone: this.userInfo.phone,
        sex: this.userInfo.sex,
        birthTime: this.userInfo.birthTime,
        weight: this.userInfo.weight,
        height: this.userInfo.height,
        identityCard: this.userInfo.identityCard
      }
      data[name] = value
      let that = this
      HttpRequest({
        url: '/customer/archives/updatadetail',
        data: data,
        success(res) {
          wx.hideLoading()
          if (res.data.code === 200) {
            wx.showToast({
              title: "修改成功"
            });
            that.getDetail()
          } else {
            wx.showModal({
              title: "错误",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      })
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: @pageColor;
}
.customer {
  .sticky-block {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #fff;
    .customer-base-info {
      display: flex;
      background-color: #fff;
      padding: 10px 0 35px 15px;
      .cover {
        flex: 0 0 52px;
        width: 52px;
        height: 52px;
        padding-left: 12px;
        // .avatar {
        //   width: 100%;
        //   height: 100%;
        //   border-radius: 12px;
        //   background-color: #eee;
        //   background-size: 100% auto;
        //   background-repeat: no-repeat;
        //   background-position: 50% 50%;
        // }
        >image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background-color: #eee;
        }
      }
      .coach-info {
        flex: 1;
        padding-left: 12px;
        > div {
          line-height: 26px;
          color: #fff;
          .Mult-line(1);
        }
      }
      .icon-right {
        margin-top: 10px;
        margin-right: 15px; 
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .surface {
      position: relative;
      height: 25px;
      overflow: hidden;
      z-index: -1;
      .circular {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 500px;
        height: 100px;
        border-radius: 50%;
      }
    }
    .header-data {
      margin-top: -50px;
    }
  }
  .filter-nav {
    .mask {
      top: 240px;
    }
  }
  .van-hairline--top-bottom::after {
    border-width: 0px 0;
  }
  .card-list {
    .card-item {
      display: flex;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1rpx solid #f6f6f6;
      padding-bottom: 10px;
      ._van-icon {
        padding-top: 30px;
      }
      .card-wrapper {
        flex: 1;
        margin-right: 5px;
      }
      .card-new {
        position: relative;
        padding: 10px;
        border-radius: 4px;
        .card-top {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #fff;
          padding-bottom: 10px;
          .card-name {
            font-size: 12px;
            font-weight: bold;
            color: #fff;
          }
          .card-equity {
            font-size: 10px;
            color: #fff;
          }
          .card-type {
            margin-top: 5px;
            >img {
              width: 10px;
              height: 8px;
            }
            >span {
              display: inline-block;
              vertical-align: middle;
              margin-left: 5px;
              font-size: 10px;
              color: #fff;
            }
          }
        }
        .card-bottom {
          margin-top: 30px;
          .card-use {
            .use-people {
              .avatar {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                margin-right: 5px;
                background-color: #fff;
              }
            }
            .use-NO {
              margin-top: 5px;
              font-size: 10px;
              color: #fff;
            }
          }
          .card-status {
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 50px;
            line-height: 20px;
            text-align: center;
            font-size: 10px;
            background-color: #fff;
            border-radius: 2px;
          }
        }
      }
    }
    // .card {
    //   margin-top: 15px;
    // }
  }
  .check-in-list {
    padding: 0 10px;
    .check-in-item {
      display: flex;
      height: 64px;
      align-items: center;
      border-bottom: 1rpx solid #f6f6f6;
      .check-in-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name {
          color: #333;
        }
        .time {
          margin-top: 6px;
          font-size: 13p;
          color: #119bf0;
        }
      }
      .check-in-type {
        flex-shrink: 0;
        font-size: 13px;
        color: #ff9e17;
      }
    }
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
          background-color: #eee;
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
    border-radius: 50%;
    overflow: hidden;
    margin-right: -10px;
    border: 3px solid #fff;
    &:nth-last-of-type(1) {
      margin-right: 0px;
    }
    > img {
      width: 100%;
      height: 100%;
    }
  }
  // .header-data {
  //   margin: 10px;
  // } 
  // .day-item {
  //   &:last-of-type {
  //     border-bottom: 1px solid #eee;
  //   }
  //   .flex-middle {
  //     .middle-2 {
  //       color: #999;
  //     }
  //   }
  // }
  .scroll-cell-list {
    padding: 0 5px;
    .cell-block {
      padding: 0 10px;
      .time {
        font-size: 12px;
        color: #666;
        line-height: 30px;
      }
      .cell-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1rpx solid #f6f6f6;
        .cell-text {
          color: #333;
          flex-shrink: 0;
        }
        .cell-value {
          text-align: right;
          font-size: 13px;
          color: #666;
          line-height: 22px;
        }
      }
    }
  }
  .time {
    .clock {
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
    >span {
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
      color: #666;
      line-height: 30px;
    }
  }
  ._swiper-item {
    .header-data {
      margin-top: 10px;
    }
  }
  .van-tab-class {
    height: 34px;
    line-height: 34px;
  }
  .van-tabs--line {
    margin-top: 15px;
    padding-top: 34px;
    .van-tabs__wrap {
      height: 34px;
    }
  }
  ._van-cell-group {
    margin-bottom: 5px;
  }
  .van-icon {
    display: inline-block;
    vertical-align: middle;
  }
  .van-cell__title,
  .van-cell__value {
    flex-basis: auto;
  }
  .van-cell-group {
    margin-bottom: 5px;
  }
}
</style>
