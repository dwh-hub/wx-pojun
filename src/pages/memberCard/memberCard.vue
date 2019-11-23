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
            @click="selectProject(item, index)"
          >{{item.projectName}}</div>
        </div>
        <div class="modify-middle" v-if="showModifyPrice">
          <van-stepper :value="modifyPrice" @change="changePrice" />
        </div>
        <div class="btn-wrapper">
          <span class="cancel" @click="closePopup">取消</span>
          <span class="confirm" @click="selectProSure">确认</span>
        </div>
      </div>
    </van-popup>
    <van-popup :show="showSeatPopup" custom-style="width: 90%;border-radius:5px;">
      <div class="project-popup">
        <div class="title">请选择座位</div>
        <div class="seat-group">
          <div class="seat-row" v-for="(cols, row_index) in positions" :key="row_index">
            <div
              class="seat-col"
              v-for="(num, col_index) in cols"
              :key="col_index"
              @click="selecetSeat(num)"
            >
              <div class="seat-none" v-if="num.num">{{num.num}}</div>
              <div class="seat-item" :class="{'selected': seatIndex == num}" v-else>{{num}}</div>
              <div class="seat-none" v-if="!num"></div>
            </div>
          </div>
        </div>
        <div class="btn-wrapper">
          <span class="confirm" @click="confrimSeat">确认</span>
        </div>
      </div>
    </van-popup>
    <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading" />
    </div>
    <none-result v-if="isNoneResult" text="暂无可用合同"></none-result>
    <page-footer v-if="!isNoneResult"></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import card from "COMPS/card";
import noneResult from "COMPS/noneResult.vue";
import pageFooter from "COMPS/pageFooter.vue";

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
      // 选择项目弹框
      showPopup: false,
      // 选择的项目
      selectProIndex: 0,
      selectedProject: {},
      selectCardInfo: {},
      isLoading: false,
      isNoneResult: false,
      page: 1,
      modifyPrice: 0,
      showModifyPrice: false,
      // 显示座位弹框
      showSeatPopup: false,
      // 座位号
      seatIndex: -1,
      // 座位列表
      positions: [],
      // 是否需要选座位
      isPlanSeat: 0,
      // 座位模板id
      teamSeatId: 0
    };
  },
  components: {
    card,
    noneResult,
    pageFooter
  },
  onLoad(option) {
    this.showPopup = false;
    if (option.classId) {
      this.teamScheduleId = option.classId;
      this.storeId = option.storeId;
      this.venueId = option.venueId;
      this.isPlanSeat = option.isPlanSeat;
      this.teamSeatId = option.teamSeatId;
      return;
    }
    this.teamScheduleId = "";
    setNavTab();
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  mounted() {
    this.userInfo = wx.getStorageSync("userInfo");
    if (this.teamScheduleId) {
      this.getCanuseCards();
    } else {
      this.getCards();
    }
  },
  onReachBottom() {
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
      console.log("this.teamScheduleId:" + this.teamScheduleId);
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
            teamScheduleId: that.teamScheduleId,
            valueCardType: that.selectCardInfo.teachCardType ? 3 : "" // 2 私教
          },
          success(res) {
            wx.hideLoading();
            if (res.data.code === 200) {
              that.pojectList = res.data.data;
              // if (res.data.data.length == 1) {
              that.selectProject(res.data.data[0]);
              // }
              that.showPopup = true;
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
    selectProject(item, index) {
      this.selectedProject = item;
      this.selectProIndex = index || 0;
      this.modifyPrice = "";
      if (item.isCanModifyFee) {
        this.modifyPrice = item.projectPrice;
        this.showModifyPrice = true;
      } else {
        this.showModifyPrice = false;
      }
    },
    // 获取全部合同
    getCards() {
      this.isLoading = true;
      let that = this;
      HttpRequest({
        url: window.api + "/customer/card/cardInfos",
        data: {
          page: that.page,
          pageCount: 20,
          customerId: that.userInfo.id
        },
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            if (!res.data.data.result.length) {
              if (that.page == 1) {
                return (that.isNoneResult = true);
              }
              return;
            }
            that.cardInfoList = that.cardInfoList.concat(res.data.data.result);
            that.page++;
          } else {
            that.isNoneResult = true;
          }
        }
      });
    },
    // 获取可上课的合同
    getCanuseCards() {
      this.isLoading = true;
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/getCardInfos",
        data: {
          teamScheduleId: that.teamScheduleId,
          companyId: that.userInfo.companyId,
          customerId: that.userInfo.id
        },
        success(res) {
          that.isLoading = false;
          if (res.data.code == 200) {
            let list = res.data.data;
            that.cardInfoList = list.filter(e => {
              if (e.cardStatus != 2) {
                return false;
              }
              return (
                e.teachCardType == 3 ||
                (e.canTeachCard == 1 && e.teachCardType == 1)
              );
            });
          }
          if (!that.cardInfoList.length) {
            that.isNoneResult = true;
          }
        }
      });
    },
    // 选择项目 确认预约
    selectProSure() {
      if (this.isPlanSeat == 1) {
        let that = this;
        wx.showLoading();
        // 获取座位
        HttpRequest({
          url: "/teamClass/seat/getOne",
          data: {
            teamSeatId: that.teamSeatId
          },
          success(res) {
            wx.hideLoading();
            let data = res.data.data;
            // 几列
            HttpRequest({
              url: "/teamClass/seat/appointDetail",
              data: {
                teamScheduleId: that.teamScheduleId
              },
              success(info) {
                let _list = info.data.data;
                let positionArr = [];
                let occupy = []
                _list.forEach(e => {
                  occupy.push(e.seatNo)
                })
                data.positions.split(";").forEach(e => {
                  positionArr.push(e.split(","));
                });
                positionArr.forEach((one, one_index) => {
                  one.forEach((two, two_index) => {
                    if (occupy.includes(two)) {
                      positionArr[one_index][two_index] = {
                        num: two
                      }
                    }
                  })
                })
                that.positions = positionArr;
                that.showPopup = false;
                that.showSeatPopup = true;
              }
            });
          }
        });
      } else {
        this.appointClass();
      }
    },
    // 选择座位
    selecetSeat(num) {
      if (!num) {
        return;
      }
      this.seatIndex = num;
    },
    confrimSeat() {
      this.appointClass();
    },
    appointClass() {
      let that = this;
      let projectId = this.pojectList[this.selectProIndex].projectId;
      wx.showLoading({
        title: "正在预约..."
      });
      HttpRequest({
        url: window.api + "/teamClass/teamAppoint/add",
        data: {
          cardId: that.selectCardInfo.id,
          projectId: projectId,
          teamScheduleId: that.teamScheduleId,
          customerId: that.userInfo.id,
          name: that.userInfo.name,
          phone: that.userInfo.phone,
          valueCardFee: that.modifyPrice,
          seatNo: that.seatIndex
        },
        success(data) {
          wx.hideLoading();
          that.showPopup = false;
          that.showSeatPopup = true;
          if (data.data.code === 200) {
            let msgData = data.data.data;
            msgData.storeId = that.storeId;
            HttpRequest({
              url: "/sendmsg/user/allotsCoachMsg",
              data: msgData
            });
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
    changePrice(e) {
      this.modifyPrice = e.mp.detail;
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
      display: flex;
      > span {
        // display: inline-block;
        flex: 1;
        line-height: 36px;
        background-color: @theme-color;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        margin: 0 10px;
        &:active {
          opacity: 0.8;
        }
      }
      .cancel {
        margin-right: 10%;
      }
    }
  }
  .seat-group {
    margin-bottom: 15px;
    .seat-row {
      display: flex;
      .seat-col {
        flex: 1;
        margin: 5px;
        line-height: 30px;
        text-align: center;
        .seat-none {
          background-color: #999;
          border: none;
        }
        .seat-item {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 1rpx solid #999;
          &.selected {
            border: none;
            color: #fff;
            background-color: @theme-color;
          }
        }
      }
    }
  }

  .van-stepper {
    display: flex;
    .van-stepper__input-wrapper {
      flex: 1;
    }
  }
  .modify-middle {
    margin-bottom: 15px;
    padding: 0 10px;
  }
}
</style>


