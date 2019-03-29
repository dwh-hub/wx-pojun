<template>
  <div class="store-detail">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      indicator-active-color="rgba(74, 134, 232, 1)"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in 3" :key="index">
        <swiper-item>
          <!-- <img :src="item" class="banner"> -->
          <img
            class="banner"
            src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg"
          >
        </swiper-item>
      </div>
    </swiper>
    <div class="address">
      <h4>地址</h4>
      <div class="store">
        {{storeInfo.name}}
        <span class="range">{{storeInfo.range || ''}}</span>
      </div>
      <div class="address-detail">{{storeInfo.address}}</div>
    </div>
    <div class="business-hours">
      <div class="business">
        <div class="business-text">营业时间</div>
        <div class="time">{{businessTime || '未设置营业时间'}}</div>
      </div>
      <div class="phone" @click="call">
        <img src="/static/images/icon-phone.png">
      </div>
    </div>
    <div class="team-class-part">
      <title-cell title="团课" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllStore"></title-cell>
      <team-class-item :info="item" v-for="(item, index)  in teamClassList" :key="index"></team-class-item>
    </div>
    <div class="coach-part">
      <title-cell title="私教" moreText="全部" :moreSize="14" :titleSize="16" @tapMore="toAllStore"></title-cell>
      <coach-item :info="item" v-for="(item, index) in coachList" :key="index"></coach-item>
    </div>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  getRange
} from "COMMON/js/common.js";
import titleCell from "COMPS/titleCell.vue";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";
import store from "../../utils/store";
export default {
  name: "storeDetail",
  data() {
    return {
      storeId: -1,
      storeInfo: {},
      teamClassList: [],
      coachList: [],
      businessTime: "",
      longitude: "", // 经度
      latitude: "" // 纬度
    };
  },
  components: {
    titleCell,
    teamClassItem,
    coachItem
  },
  onLoad(option) {
    this.storeId = option.storeId;
    setNavTab();
  },
  mounted() {
    this.longitude = store.state.longitude;
    this.latitude = store.state.latitude;
    this.getStoreDetail();
    this.getStoreQuery();
    this.getTeamClassList();
    this.getCoachList();
  },
  methods: {
    toAllStore() {
      // wx.navigateTo({
      //   url: "../allStore/main"
      // });
    },
    call() {
      if (!this.storeInfo.phone) {
        return wx.showToast({
          title: "该门店无手机号",
          icon: "none",
          duration: 1000
        });
      }
      wx.makePhoneCall({
        phoneNumber: this.storeInfo.phone
      });
    },
    // 获取门店详情
    getStoreDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/store/detail/" + that.storeId,
        success(res) {
          let _data = res.data.data;
          let _range
          let _address = _data.parentName + _data.cityName + _data.address;
          _address = _address.replace(/null/g, "");
          _address = _address.replace(/[0]/gi, "");
          if (_data.mapPoint) {
            let _lat = _data.mapPoint.split(",")[1];
            let _lng = _data.mapPoint.split(",")[0];
            _range = getRange(that.latitude, that.longitude, _lat, _lng);
            console.log(_data.mapPoint)
            console.log(_range)
          }
          let _obj = {
            address: _address || "未设置详细地址",
            name: _data.storeName,
            range: _range,
            phone: _data.phone,
            bannerList: _data.images.split(",")
          };
          that.storeInfo = _obj;
          // Object.assign(that.storeInfo, _obj);
          console.log(that.storeInfo);
        }
      });
    },
    // 门店系统设置，获取营业时间
    getStoreQuery() {
      let that = this;
      HttpRequest({
        url: window.api + "/system/setup/store/query",
        data: {
          storeId: that.storeId
        },
        success(res) {
          if (res.data.data.openTimeStart && res.data.data.openTimeStart) {
            that.businessTime =
              res.data.data.openTimeStart + "~" + res.data.data.openTimeEnd;
          }
        }
      });
    },
    // 该门店的团课
    getTeamClassList() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/weekView",
        data: {
          storeId: that.storeId,
          calendarStart: formatDate(new Date(), "yyyy-MM-dd"),
          calendarEnd: ""
        },
        success(res) {
          if (res.data.code === 200) {
            that.teamClassList = res.data.data.slice(0, 1);
          }
        }
      });
    },
    // 该门店的教练
    getCoachList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/register/userofrole",
        data: {
          storeId: that.storeId,
          positionType: 1
        },
        success(res) {
          that.coachList = res.data.data.slice(0, 1);
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
.store-detail {
  padding-bottom: 20px;
  .swiper {
    height: 180px;
  }
  .banner {
    width: 100%;
    height: 100%;
  }
  .address {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    > h4 {
      font-weight: bold;
      font-size: 16px;
    }
    .store {
      font-size: 16px;
      color: @theme-color;
      margin: 8px 0;
      > span {
        display: inline-block;
        margin-left: 5px;
        color: @theme-color;
        font-size: 12px;
      }
    }
    .address-detail {
      color: #bababa;
    }
  }
  .business-hours {
    display: flex;
    height: 75px;
    border-bottom: 1px solid #eee;
    .business {
      flex: 1;
      padding-left: 20px;
      .business-text {
        font-size: 16px;
        margin-top: 12px;
        font-weight: bold;
      }
      .time {
        margin-top: 12px;
        color: #bababa;
      }
    }
    .phone {
      flex: 0 0 75px;
      position: relative;
      box-sizing: border-box;
      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 12px 18px;
        width: 30px;
        height: 30px;
        border-left: 1px solid #eee;
      }
    }
  }
  .team-class-part,
  .coach-part {
    padding: 0 15px;
    .title-cell {
      margin: 5px 0;
      .title {
        font-weight: bold;
      }
    }
  }
}
</style>
