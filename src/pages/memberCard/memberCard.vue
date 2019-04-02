<template>
  <div class="memberCard">
    <card @hasClick="toCardDetail" :info="item" v-for="(item, index) in cardInfoList" :key="index"></card>

    <van-popup :show="showPopup" @close="closePopup" custom-style="width: 80%;border-radius:5px;">
      <div class="project-popup">
        <div class="title">请选择项目</div>
        <div class="poject-wrap">
          <div
            class="poject-item"
            v-for="(item, index) in pojectList"
            :key="index"
            :class="{active: selectProIndex == index}"
            @click="selectProIndex = index"
          >{{item.projectName}}</div>
        </div>
        <div class="btn-wrapper">
          <span class="cancel" @click="closePopup">取消</span>
          <span class="confirm" @click="selectPro">确认</span>
        </div>
      </div>
    </van-popup>
    <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading"/>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import card from "COMPS/card";
import store from "../../utils/store";

export default {
  data() {
    return {
      cardInfoList: [],
      pojectList: [],
      userInfo: {},
      // 团课 场馆 门店ID
      teamScheduleId: "",
      storeId: "",
      venueId: "",
      showPopup: false,
      // 选择的项目
      selectProIndex: 0,
      selectCardInfo: {},
      isLoading: false
    };
  },
  components: {
    card
  },
  onLoad(option) {
    console.log(option);
    if (option.classId) {
      this.teamScheduleId = option.classId;
      this.storeId = option.storeId;
      this.venueId = option.venueId;
      setNavTab("选择合同");
      return;
    }
    setNavTab();
  },
  mounted() {
    this.userInfo = wx.getStorageSync("userInfo");
    if (this.teamScheduleId) {
      this.getCanuseCards();
    } else {
      this.getCards();
    }
  },
  methods: {
    closePopup() {
      this.showPopup = false;
    },
    // 跳转合同详情/获取消费项目
    toCardDetail(item) {
      let that = this;
      this.selectCardInfo = item;
      if (this.teamScheduleId) {
        wx.showLoading({
          title: "获取可消费项目..."
        });
        HttpRequest({
          url: window.api + "/teamClass/getProject",
          data: {
            cardClassId: item.cardClassId,
            storeId: that.storeId,
            venueId: that.venueId,
            teamScheduleId: that.teamScheduleId
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code === 200) {
              that.pojectList = res.data.data;
              that.showPopup = true;
              console.log(that.pojectList);
            } else {
              wx.showModal({
                title: "提示",
                content: res.data.message,
                showCancel: false
              });
            }
          }
        });
      } else {
        wx.navigateTo({
          url: "../cardDetail/main?id=" + item.id
        });
      }
    },
    // 选择项目 确认预约
    selectPro() {
      let that = this;
      let projectId = this.pojectList[this.selectProIndex].projectId;
      wx.showLoading({
        title: "确认预约..."
      });
      HttpRequest({
        url: window.api + "/teamClass/teamAppoint/add",
        data: {
          cardId: that.selectCardInfo.id,
          projectId: projectId,
          teamScheduleId: that.teamScheduleId,
          customerId: that.userInfo.id,
          name: that.userInfo.name,
          phone: that.userInfo.phone
        },
        success(data) {
          wx.hideLoading();
          that.showPopup = false;
          if (data.data.code === 200) {
            wx.showModal({
              title: "提示",
              content: data.data.message,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url:
                      "../appointmentResult/main?teamAttendId=" +
                      data.data.data.teamAttendId
                  });
                }
              }
            });
          } else {
            wx.showModal({
              title: "提示",
              content: data.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    // 获取全部合同
    getCards() {
      let that = this;
      wx.showLoading({
        title: "加载中"
      });
      HttpRequest({
        url: window.api + "/customer/card/cardInfos",
        data: {
          page: 1,
          pageCount: 100,
          customerId: that.userInfo.id
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code) {
            that.cardInfoList = res.data.data.result;
          }
        }
      });
    },
    // 获取可上课的合同
    getCanuseCards() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/getCardInfos",
        data: {
          teamScheduleId: that.teamScheduleId,
          companyId: that.userInfo.companyId,
          customerId: that.userInfo.id
        },
        success(res) {
          console.log(res.data.data);
          that.cardInfoList = res.data.data;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";

.memberCard {
  padding: 0 20px;
  padding-top: 15px;
  .card {
    margin-bottom: 15px;
  }
  .project-popup {
    padding: 10px;
    .title {
      font-size: 14px;
      margin-bottom: 15px;
    }
    .poject-wrap {
      padding: 0 10px;
      .poject-item {
        line-height: 36px;
        border: 1rpx solid #eee;
        margin-bottom: 15px;
        text-align: center;
        &.active {
          border: 1rpx solid @theme-color;
        }
      }
    }
    .btn-wrapper {
      padding: 0 10px;
      > span {
        display: inline-block;
        line-height: 36px;
        background-color: @theme-color;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        width: 45%;
        &:active {
          opacity: 0.8;
        }
      }
      .cancel {
        margin-right: 10%;
      }
    }
  }
}
</style>


