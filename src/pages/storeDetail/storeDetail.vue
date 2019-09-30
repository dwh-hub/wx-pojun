<template>
  <div class="store-detail">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#fff"
      :indicator-active-color="themeColor"
      :autoplay="true"
      :circular="true"
      :loop="true"
    >
      <div v-for="(item,index) in storeInfo.bannerList" :key="index">
        <swiper-item>
          <!-- <img :src="window.api + item" class="banner"> -->
          <image :src="window.api + item" mode="aspectFill" class="banner" @click="previewImage(window.api+item)"></image>
          <!-- <img
            class="banner"
            src="http://pojun-tech.cn/images/company_exhibition/37/1.5460718947810068E12.jpeg"
          >-->
        </swiper-item>
      </div>
    </swiper>
    <div class="address">
      <!-- <h4>地址</h4> -->
      <div class="store" :style="{'color': themeColor}">
        {{storeInfo.name || '暂无'}}
        <span
          class="range"
          :style="{'color': themeColor}"
        >{{storeInfo.range || ''}}</span>
      </div>
      <div class="address-detail" @click="toMap()">
        <span>{{storeInfo.address || '暂无地址信息'}}<img v-if="storeInfo.address" src="/static/images/address.png"></span>
      </div>
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
      <title-cell
        title="团课"
        moreText="全部"
        :moreSize="14"
        :titleSize="16"
        @tapMore="toAllStore('../teamClassList/main')"
      ></title-cell>
      <team-class-item :info="item" v-for="(item, index)  in teamClassList" :key="index"></team-class-item>
    </div>
    <div class="coach-part">
      <title-cell
        title="私教"
        moreText="全部"
        :moreSize="14"
        :titleSize="16"
        @tapMore="toAllStore('../coachList/main')"
      ></title-cell>
      <coach-item :color="themeColor" :info="item" v-for="(item, index) in coachList" :key="index"></coach-item>
    </div>
    <page-footer></page-footer>
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
import pageFooter from "COMPS/pageFooter.vue";
export default {
  name: "storeDetail",
  data() {
    return {
      storeId: -1,
      storeInfo: {},
      teamClassList: [{}],
      coachList: [{}],
      businessTime: "",
      longitude: "", // 经度
      latitude: "", // 纬度
      loadCount: 0
    };
  },
  components: {
    titleCell,
    teamClassItem,
    coachItem,
    pageFooter
  },
  onLoad(option) {
    wx.showShareMenu({
      withShareTicket: true
    })
    // 进页面前先清空数据
    Object.assign(this.$data, this.$options.data());
    this.storeId = option.storeId;
    setNavTab();
  },
  mounted() {
    wx.showLoading({
      title: "加载中..."
    });
    this.longitude = store.state.longitude;
    this.latitude = store.state.latitude;
    this.getStoreDetail();
    this.getStoreQuery();
    this.getTeamClassList();
    this.getCoachList();
  },
  onUnload() {
    this.loadCount = 0;
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  watch: {
    loadCount() {
      if (this.loadCount >= 2) {
        wx.hideLoading();
      }
    }
  },
  computed: {
    window() {
      return window;
    },
    themeColor() {
      return window.color;
    }
  },
  methods: {
    toAllStore(url) {
      wx.navigateTo({
        url: url
      });
    },
    toMap() {
      if (this.storeInfo.latitude) {
        wx.openLocation({
          latitude: parseFloat(this.storeInfo.latitude),
          longitude: parseFloat(this.storeInfo.longitude),
          scale: 18,
          success(res) {
            console.log(res);
          }
        });
      }
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
          let _range;
          let _lat = null;
          let _lng = null;
          let _address = _data.parentName + _data.cityName + _data.address;
          console.log(_data.storeName);
          _address = _address.replace(/null/g, "");
          _address = _address.replace(/[0]/gi, "");
          if (_data.mapPoint) {
            _lat = _data.mapPoint.split(",")[1];
            _lng = _data.mapPoint.split(",")[0];
            _range = getRange(that.latitude, that.longitude, _lat, _lng);
          }
          let _obj = {
            address: _address || "未设置详细地址",
            name: _data.storeName,
            latitude: _lat,
            longitude: _lng,
            range: _range,
            phone: _data.phone,
            bannerList: _data.images ? _data.images.split(",") : []
          };
          that.storeInfo = _obj;
          console.log(that.storeInfo);
          that.loadCount++;
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
          if (res.data.data) {
            if (
              res.data.data.openingHoursStart &&
              res.data.data.openingHoursEnd
            ) {
              that.businessTime =
                res.data.data.openingHoursStart +
                "~" +
                res.data.data.openingHoursEnd;
            }
          }
          that.loadCount++;
        }
      });
    },
    // 该门店的团课
    getTeamClassList() {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamSchedule/weekView",
        data: {
          companyId: wx.getStorageSync("companyId"),
          storeId: that.storeId,
          calendarStart: formatDate(new Date(), "yyyy-MM-dd"),
          calendarEnd: "2021-01-01"
        },
        success(res) {
          if (res.data.code === 200) {
            that.teamClassList = res.data.data.slice(0, 1);
            that.loadCount++;
          } else {
            that.teamClassList = [];
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
          companyId: wx.getStorageSync("companyId"),
          storeId: that.storeId,
          positionType: 1
        },
        success(res) {
          if (res.data.code == 200) {
            that.coachList = res.data.data.slice(0, 1);
            that.loadCount++;
          } else {
            that.teamClassList = [];
          }
        }
      });
    },
    previewImage(item) {
      wx.previewImage({
        current: item,
        urls: this.storeInfo.bannerList
      })
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
      margin: 8px 0;
      > span {
        display: inline-block;
        margin-left: 5px;
        font-size: 12px;
      }
    }
    .address-detail {
      color: #bababa;
      > span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        display: inline-block;
        vertical-align: middle;
        width: 15px;
        height: 15px;
        margin-left: 10px;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
      }
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
