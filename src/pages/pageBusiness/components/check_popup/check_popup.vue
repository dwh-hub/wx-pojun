<template>
  <div class="check-popup fixed-all" @touchmove.stop="touchPopup">
    <!-- 项目弹窗 -->
    <div class="v-popup" :class="[showProject?'v-bottom-enter':'v-bottom-leave-to']">
      <div class="pop-title">
        <div>请选择服务项目</div>
        <img src="/static/images/icon-close.png" @click.stop="touchMask" />
      </div>
      <div class="pro-list pop-list">
        <div class="pro-item pop-item" v-for="(item, index) in projectList" :key="index">
          <div class="round" :class="item.class">{{item.cardType}}</div>
          <div class="name">{{item.projectName}}</div>
          <div class="stepper" v-if="authorityUnit != '天'">
            <!-- <span class="stepper-doc" v-if="item.isCanModifyFee == 1" @click="decreasePrice(item)">-</span> -->
            <div class="stepper-input">
              <!-- <input type="number" v-model="item.projectPrice" v-if="item.isCanModifyFee == 1" /> -->
              <div>{{item.projectPrice}}{{authorityUnit}}</div>
            </div>
            <!-- <span class="stepper-doc" v-if="item.isCanModifyFee == 1" @click="addPrice(item)">+</span> -->
          </div>
          <div class="select" :style="{'color': window.color}" @click="checkInTo(item)">签到</div>
        </div>
      </div>
    </div>
    <!-- 团课弹窗 -->
    <div class="v-popup" :class="[showTeam?'v-bottom-enter':'v-bottom-leave-to']">
      <div class="pop-title">
        <div>请选择您要上的团课</div>
        <img src="/static/images/icon-close.png" @click.stop="touchMask" />
      </div>
      <div class="team-list pop-list">
        <div class="team-item pop-item" v-for="(item, index) in teamClassList" :key="index">
          <div class="cover">
            <img :src="item.cover" @error="imgError(item)" />
          </div>
          <div class="item-middle">
            <div class="name">{{item.className}}</div>
            <div class="desc">{{item.coach}} {{item.timeStart}}~{{item.timeEnd}}</div>
          </div>
          <div class="select" :style="{'color': window.color}" @click="attendTeamClass(item)">上课</div>
        </div>
      </div>
    </div>
    <div class="v-mask fixed-all" @click.stop="touchMask" v-show="showMask"></div>
  </div>
</template>

<script>
import { window, HttpRequest, formatDate } from "COMMON/js/common.js";
import { checkPopupData, checkMethods } from "./check_popup";
export default {
  data() {
    return checkPopupData;
  },
  computed: {
    window() {
      return window;
    }
  },
  methods: {
    imgError(item) {
      item.cover = window.api + "/assets/img/morenTo.png";
    },
    touchPopup() {},
    touchMask() {
      this.showProject = false;
      this.showMask = false;
      this.showTeam = false;
      this.selectProject = {}
    },
    addPrice(item) {
      item.projectPrice++;
    },
    decreasePrice(item) {
      item.projectPrice--;
    },
    checkInTo(item) {
      this.selectProject = item;
      console.log('canTeachCard:'+this.canTeachCard)
      console.log('teachCardType:'+this.teachCardType)
      console.log(item)
      if (this.teachCardType == 3) {
        // 储值卡判断
        if (item.valueCardType == 1) this.checkInMember(item);
        if (item.valueCardType == 2) checkMethods.toCoachCheckIn();
        if (item.valueCardType == 3) this.attendTeamClass(this.selectTeam);
      } else {
        if (this.canTeachCard == 1) {
          if (this.teachCardType == 1) {
            //团课
            this.attendTeamClass(this.selectTeam)
          } else if (this.teachCardType == 2) {
            //私教
            checkMethods.toCoachCheckIn()
          }
        } else if (this.canTeachCard == 0) {
          // 会籍
          this.checkInMember(item);
        }
      }

      // if (item.valueCardType == 1) {
      //   // 会籍
      //   this.checkInMember(item);
      // } else if (item.valueCardType == 2) {
      //   // 私教
      //   checkMethods.toCoachCheckIn()
      // } else {
      //   // 团课
      //   // checkMethods.getTeamSchedule();
      //   this.attendTeamClass(this.selectTeam)
      // }
      this.touchMask();
    },
    // 会籍
    checkInMember(item) {
      let that = this;
      wx.showLoading({
        title: "签到中.."
      });
      HttpRequest({
        url: "/consumption/general/card/cost",
        data: {
          storeId: that.storeId,
          venueId: that.venueId,
          physicsCardNo: that.physicsCardNo,
          frontSign: 1, //that.frontSign,
          projectId: item.projectId,
          valueCardFee: item.projectPrice // 储值卡的扣费金额
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code == 202 || res.data.code == 201) {
            // 消费天 202 其他 201
            checkMethods.successMethod("签到成功");
          } else {
            checkMethods.failMethod(res.data.message);
          }
        }
      });
    },
    // 团课上课
    attendTeamClass(item) {
      this.selectTeam = item
      let that = this;
      wx.showLoading();
      HttpRequest({
        url: "/teamClass/teamAttend/attend",
        data: {
          projectId: that.selectProject.projectId,
          storeId: that.storeId,
          venueId: that.venueId,
          physicsCardNo: that.physicsCardNo,
          passMode: 8,
          teamScheduleId: item.teamScheduleId,
          valueCardFee: that.selectProject.projectPrice
        },
        success(res) {
          wx.hideLoading();
          that.touchMask();
          if (res.data.code == 200) {
            checkMethods.successMethod("上课成功");
          } 
          else if (res.data.code == 502) {
            // 含有多个项目，选择
            that.projectList = res.data.data.map(e => {
              if (that.teachCardType != 3) {
                e.cardType = checkMethods.transTeachCardType(that.teachCardType)
              } else {
                e.cardType =
                  e.valueCardType == 1
                    ? "会籍"
                    : e.valueCardType == 2
                      ? "私教"
                      : "团课";
              }
              e.class =
                e.valueCardType == 1
                  ? "member"
                  : e.valueCardType == 2
                    ? "private"
                    : "team";
              return e;
            });
            that.showMask = true;
            that.showProject = true;
          } 
          else {
            checkMethods.failMethod(res.data.message);
          }
        }
      });
    }
    // successMethod(title) {
    //   wx.showToast({
    //     title: title,
    //     icon: "success",
    //     duration: 1000,
    //     success() {
    //       setTimeout(() => {
    //         wx.redirectTo({
    //           url: "../check_in_type/main"
    //         });
    //       }, 600);
    //     }
    //   });
    // },
    // failMethod(title) {
    //   wx.showModal({
    //     title: "提示",
    //     content: title,
    //     showCancel: false
    //   });
    // }
  }
};
</script>

<style lang="less">
.check-popup {
  .v-popup {
    position: fixed;
    bottom: 0;
    z-index: 100;
    // height: 300px;
    background-color: #fff;
    width: 100%;
  }
  .pop-title {
    line-height: 30px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    > img {
      width: 12px;
      height: 12px;
    }
  }
  .pop-list {
    .pop-item {
      display: flex;
      align-items: center;
      border-top: 1rpx solid #ccc;
      .select {
        flex: 0 0 50px;
        line-height: 25px;
        margin-left: 10px;
        width: 50px;
        font-size: 12px;
        text-align: center;
        border-radius: 6px;
        border: 1rpx solid #cccccc;
      }
    }
  }
  .pro-list {
    .pro-item {
      height: 80px;
      padding: 0 10px;
      .round {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        border-radius: 50%;
        &.member {
          background-color: #43cf7c;
        }
        &.private {
          background-color: #2a82e4;
        }
        &.team {
          background-color: #ff8d1a;
        }
      }
      .name {
        flex: 1;
        text-align: center;
      }
      .stepper {
        display: flex;
        min-width: 130px;
        .stepper-doc {
          height: 30px;
          width: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 20px;
          border-radius: 6px;
          border: 1rpx solid #cccccc;
        }
        .stepper-input {
          margin: 0 auto;
          border-radius: 6px;
          border: 1rpx solid #cccccc;
          > input {
            height: 30px;
            width: 50px;
            text-align: center;
          }
          > div {
            line-height: 30px;
            padding: 0 10px;
            text-align: center;
          }
        }
      }
    }
  }
  .team-list {
    .team-item {
      padding: 15px;
      .cover {
        width: 50px;
        height: 50px;
        margin-right: 15px;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
      }
      .item-middle {
        flex: 1;
        > div {
          line-height: 25px;
        }
        .desc {
          font-size: 12px;
          color: #888;
        }
      }
    }
  }
  .v-bottom-enter,
  .v-bottom-leave-to {
    transition: transform 0.3s;
  }
  .v-bottom-leave-to {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
  .v-bottom-enter {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  .v-mask {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .fixed-all {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
  }
}
</style>