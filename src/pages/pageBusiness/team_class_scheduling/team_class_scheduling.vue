<template>
  <div class="team_class_scheduling">
    <div class="class-info-wrapper">
      <img src alt>
      <div class="class-info">
        <div class="name"></div>
        <div class="duration"></div>
      </div>
    </div>
    <van-cell-group custom-class="van-cell-group">
      <van-cell title="场地" @click="showActionPopup = true" is-link/>
      <van-cell title="课程时长"/>
      <van-cell title="教练" is-link/>
    </van-cell-group>
    <div class="cell-subtitle">课程排期</div>
    <van-cell-group custom-class="van-cell-group">
      <van-cell title="课程日期" @click="changeClassDate" is-link/>
      <van-cell title="开始时间" is-link/>
      <van-cell title="结束时间" is-link/>
      <div class="item-cell">
        <div class="cell-left">是否预约</div>
        <div class="cell-right">
          <van-radio-group :value="isAppoint" @change="onChangeAppoint" custom-class="radio-group">
            <van-radio :checked-color="themeColor" custom-class="radio" name="1">是</van-radio>
            <van-radio :checked-color="themeColor" custom-class="radio" name="2">否</van-radio>
          </van-radio-group>
        </div>
      </div>
      <van-cell title="最小上课人数" is-link/>
      <van-cell title="最大上课人数" is-link/>
      <van-cell title="预约截止时间" is-link/>
      <van-cell title="预约开始时间" is-link/>
    </van-cell-group>
    <div class="save-btn" :style="{backgroundColor: themeColor}">保存</div>

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

    <van-popup
      :show="showActionPopup"
      @close="showActionPopup = false"
      :duration="200"
      overlay-style="background-color:rgba(0,0,0,0);"
      position="bottom"
      custom-style="width:100%"
      :z-index="101"
    >
      <div class="action-list">
        <div
          class="action-item"
          v-for="(item, index) in actionList"
          :key="index"
          @click="actionListItem(item)"
        >
          <div class="text">{{item.text}}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  debounce
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return {
      teamTempStoreId: 0,
      classDeatil: {},
      coachList: [],
      venueList: [],
      setup: {},
      showDatePopup: false,
      showActionPopup: false,
      actionList: [],
      currentDateStamp: "",
      isAppoint: "1", // 是否预约
    };
  },
  onload(options) {
    if(options.params) {
    }
  },
  mounted() {
    setNavTab();
  },
  mixins: [colorMixin],
  methods: {
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
    changeDate() {},
    actionListItem() {},
    getClassDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamTempStore/getOne",
        data: {
          teamTempStoreId: that.teamTempStoreId
        },
        success(res) {
          if (res.data.code == 200) {
            that.classDeatil = res.data.data;
          }
        }
      });
    },
    getCoachList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/register/userofrole",
        data: {
          storeId: "",
          positionType: 1
        },
        success(res) {
          if (res.data.code == 200) {
            that.coachList = res.data.data;
          }
        }
      });
    },
    getStoreSetup() {
      let that = this;
      HttpRequest({
        url: window.api + "/system/setup/store/query",
        data: {
          storeId: ""
        },
        success(res) {
          if (res.data.code == 200) {
            that.setup = res.data.data;
          }
        }
      });
    },
    getVenueList() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/getVenue",
        data: {
          storeId: "",
          teamTempStoreId: ""
        },
        success(res) {
          if (res.data.code == 200) {
            that.venueList = res.data.data;
            that.actionList = that.venueList.map(e => {
              return {
                id: e.venueId,
                storeId: e.storeId,
                text: e.venueName
              }
            })
          }
        }
      });
    },
    onChangeAppoint(event) {
      this.isAppoint = event.mp.detail;
    },
    changeClassDate() {
      this.showDatePopup = true
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.team_class_scheduling {
  padding-bottom: 50px;
  .class-info-wrapper {
    display: flex;
    padding: 15px;
    background-color: #fff;
    > img {
      width: 60px;
      height: 60px;
      background-color: #eee;
    }
    .class-info {
      flex: 1;
      margin-left: 15px;
      > div {
        line-height: 30px;
      }
    }
  }
  .item-cell {
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
  }
  .cell-subtitle {
    padding-left: 15px;
    line-height: 36px;
    color: #999;
  }
  .save-btn {
    position: fixed;
    bottom: 0;
    left: 0px;
    line-height: 46px;
    font-size: 16px;
    width: 100%;
    text-align: center;
    color: #fff;
  }
}
</style>
