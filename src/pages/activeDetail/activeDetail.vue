<template>
  <div id="memberActiveDetail" :class="{'isPhoneX-wrap':isPhoneX}">
    <div class="active-cover">
      <image mode="widthFix" :src="window.api + activeDetail.thumbUrl" class="cover"></image>
    </div>
    <div class="active-title">{{activeDetail.title}}</div>
    <div class="active-digest">{{activeDetail.digest}}</div>
    <div class="active-content-wrapper">
      <div class="active-content-t">活动内容</div>
      <div class="active-content">
        <wxParse :content="activeDetail.content||'<p></p>'" :imageProp="{domain: window.api, mode: 'widthFix'}"/>
      </div>
    </div>
    <div class="activeBottom">
      <div>
        <span class="activeBottomTitle">人数：</span>
        <div class="count-wrapper">
          <span class="decrease" @click="decrease">-</span>
          <span class="numbers">{{signNum}}</span>
          <span class="increase" @click="signNum++">+</span>
        </div>
        <span class="sign" v-if="isLogin" :style="{'background-color': window.color}" @click="showPopup()">报名</span>
        <button
          v-else
          class="sign clearBtn"
          :style="{'background-color': window.color}"
          type="default"
          open-type="getPhoneNumber"
          @getphonenumber="_getPhoneNumbe"
        >报名</button>
      </div>
      <div class="block" v-if="isPhoneX"></div>
    </div>
    <van-popup
      :show="showEntryBox"
      @close="showEntryBox = false"
      :duration="200"
      custom-style="width:85%;border-radius: 5px;"
    >
      <div class="entry-box">
        <div class="box-item"><span class="text-left">报名活动</span><span class="text-right">{{activeDetail.title}}</span></div>
        <div class="box-item"><span class="text-left">报名人数</span><span class="text-right">{{signNum}}</span></div>
        <div class="box-item"><span class="text-left">报名费用</span><span class="text-right">{{activeDetail.entryFee*signNum}}</span></div>
        <div class="btn-wrapper">
          <span class="cancel" @click="showEntryBox = false">取消</span>
          <span class="confirm" @click="confirmSignUp" :style="{'background-color': window.color}">确认</span>
        </div>
      </div>
    </van-popup>
    <page-footer></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import wxParse from "mpvue-wxparse";
import store from "../../utils/store";
import pageFooter from "COMPS/pageFooter.vue"
import {getPhoneNumber} from "COMMON/js/api.js";
export default {
  data() {
    return {
      signNum: 1,
      activeDetail: {},
      showEntryBox: false,
      markId: "",
      // content:
      //   '<p><span style="background-color: rgb（255, 255, 255）; color: rgb（255, 0, 0）; font-weight: bold;">缴纳定金权益享受下述权益:</span></p><p>1.预存50元定金，可享受办卡首年免费；</p><p>2.获得会所赠送价值200的水吧券一张；</p><p>3.获得会所价值288元的运动背包；</p><p>4.享受会所价值788元的一对一私教二节及专业的健康状况评估；</p><p>5.享受停车2小时免费（卡有效期内来游泳健身）；</p><p>6.享受独立淋浴间（共15间）使用权，极大保护个人隐私；</p><p>7.享受儿童独立淋浴室；</p><p>8.优先获得参加会所举办的所有常规和户外活动的权益；</p><p>9.参加会所开业庆典活动和抽奖活动；</p><p>10.如不办卡，享受持定金单换取会所VIP贵宾券二张。</p><p><br></p><p>门店效果预览图（以门店实际装修为准）</p><p><img src="/images/activities/37/1.55065529299746E12.jpeg" style="width: 874px; float: none;"></p><p><img src="/images/activities/37/1.5506553509545596E12.jpeg" style="width: 1500px; float: none;"></p><p><img src="/images/activities/37/1.5506553654493972E12.jpeg" style="width: 1500px;"></p><p><img src="/images/activities/37/1.5506553892880002E12.jpeg" style="width: 1426px;"></p><p><img src="/images/activities/37/1.550655397923402E12.jpeg" style="width: 1152px;"></p><p><img src="/images/activities/37/1.550655407173489E12.jpeg" style="width: 1152px;"><br></p>',
      companyId: '',
      userInfo: {}
    };
  },
  onLoad(options) {
    this.markId = options.markId
  },
  onUnload() {
    this.activeDetail = {}
    this.signNum = 1
  },
  mounted() {
    setNavTab();
    if (wx.getStorageSync("userInfo")) {
      this.companyId = wx.getStorageSync("companyId");
      this.userInfo = wx.getStorageSync("userInfo")
    }
    this.getActiveDetail();
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  computed: {
    isLogin() {
      return store.state.isLogin
    },
    isPhoneX() {
      return store.state.isIphoneX;
    },
    window() {
      return window
    }
    // amount() {
    //   if(this.activeDetail.entryFee) {
    //     return this.activeDetail.entryFee*this.signNum
    //   }
    //   return ""
    // }
  },
  components: {
    wxParse,
    pageFooter
  },
  methods: {
    _getPhoneNumbe(e) {
      let url = "../activeDetail/main?markId=" + this.markId
      getPhoneNumber(e,url)
    },
    decrease() {
      if (this.signNum == 1) {
        return;
      }
      this.signNum--;
    },
    preview(src, e) {
      console.log(src);
    },
    getActiveDetail() {
      let that = this;
      wx.showLoading({
        title: "加载中..."
      });
      // return that.activeDetail = {
      //   addTime: null,
      //   addUserId: 1,
      //   addUserName: null,
      //   companyId: 37,
      //   content: `<p><span style="background-color: rgb（255, 255, 255）; color: rgb（255, 0, 0）; font-weight: bold;">缴纳定金权益享受下述权益:</span></p><p>1.预存50元定金，可享受办卡首年免费；</p><p>2.获得会所赠送价值200的水吧券一张；</p><p>3.获得会所价值288元的运动背包；</p><p>4.享受会所价值788元的一对一私教二节及专业的健康状况评估；</p><p>5.享受停车2小时免费（卡有效期内来游泳健身）；</p><p>6.享受独立淋浴间（共15间）使用权，极大保护个人隐私；</p><p>7.享受儿童独立淋浴室；</p><p>8.优先获得参加会所举办的所有常规和户外活动的权益；</p><p>9.参加会所开业庆典活动和抽奖活动；</p><p>10.如不办卡，享受持定金单换取会所VIP贵宾券二张。</p><p><br></p><p>门店效果预览图（以门店实际装修为准）</p><p><img src="/images/activities/37/1.55065529299746E12.jpeg" style="width: 874px; float: none;"></p><p><img src="/images/activities/37/1.5506553509545596E12.jpeg" style="width: 1500px; float: none;"></p><p><img src="/images/activities/37/1.5506553654493972E12.jpeg" style="width: 1500px;"></p><p><img src="/images/activities/37/1.5506553892880002E12.jpeg" style="width: 1426px;"></p><p><img src="/images/activities/37/1.550655397923402E12.jpeg" style="width: 1152px;"></p><p><img src="/images/activities/37/1.550655407173489E12.jpeg" style="width: 1152px;"><br></p>`,
      //   digest: "仅限前300名",
      //   enterType: "1,2",
      //   entryFee: 0.01,
      //   entryFeeCount: null,
      //   entryNum: 10,
      //   isEnter: 1,
      //   isEntryFee: 1,
      //   isLimitNum: 1,
      //   isSelfMaxLimit: 1,
      //   limitNum: 300,
      //   markId: 7,
      //   modifyTime: null,
      //   modifyUserId: 1,
      //   modifyUserName: null,
      //   noRegisterNum: 34,
      //   registerNum: 94,
      //   selfMaxLimit: 1,
      //   showUrl: null,
      //   state: 1,
      //   stateChar: null,
      //   storeId: "101",
      //   storeName: "马戏城店",
      //   thumbUrl: "/images/activities/37/1.5506552470484482E12.jpeg",
      //   title: "前锋体育马戏城店创始会员预定活动",
      //   venueId: null,
      //   venueName: null,
      //   viewNum: 128
      // };
      HttpRequest({
        url: window.api + "/wxmarketing/detail",
        data: {
          companyId: that.companyId,
          markId: that.markId
        },
        success(res) {
          that.activeDetail = res.data.data;
          wx.hideLoading()
        }
      });
    },
    showPopup() {
      if(!store.state.isLogin) {
        return wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1000
        });
      }
      this.showEntryBox = true;
    },
    confirmSignUp() {
      let that = this
      HttpRequest({
        url: window.api + '/wxmarketing/addentry/entrydo',
        data: {
          markId: that.activeDetail.markId, // 活动ID
          customerId:	that.userInfo.id, // 客户ID
          customerClass: that.userInfo.customerClass, // 客户类型
          entryName:	that.userInfo.name, // 客户名
          entryPhone:	that.userInfo.phone, // 客户电话
          storeId: that.activeDetail.storeId,	// 报名门店
          entryNum:	that.signNum, // 报名人数
          entryFee:	that.activeDetail.entryFee*that.signNum,// 报名费
          payType: "",// 报名费支付类型
        },
        success(res) {
          if(res.data.code == 200) {
            wx.showToast({
              title: "报名成功",
              icon: "success",
              duration: 1000
            });
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      })
      // TODO: 跳转h5的活动页面去支付
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";
@import url("~mpvue-wxparse/src/wxParse.css");

#memberActiveDetail {
  .active-cover {
    .cover {
      width: 100%;
    }
  }
  .active-title {
    margin: 0px 15px;
    text-align: center;
    height: 40px;
    // padding-bottom: 10px;
    border-bottom: 2px solid #ddd;
    font-weight: bolder;
    line-height: 40px;
    font-size: 15px;
    color: #565656;
  }
  .active-digest {
    margin: 0 15px;
    font-size: 14px;
    color: #666;
    // height: 25px;
    line-height: 25px;
    margin-top: 15px;
  }
  .active-content-wrapper {
    border-top: 5px solid #f4f4f4;
    padding: 0 15px;
    padding-top: 10px;
    .active-content-t {
      color: #333;
      padding-left: 5px;
      border-width: 0 0 0 2px;
      border-style: solid;
      font-size: 14px;
      font-weight: 500;
    }
    .active-content {
      img {
        width: 100%;
      }
    }
  }
  .activeBottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    background-color: #fff;
    .activeBottomTitle {
      display: block;
      float: left;
    }
    .count-wrapper {
      // float: left;
      display: inline-block;
      margin-top: 3px;
      line-height: 30px;
      text-align: center;
      // border-radius: 4px;
      border: 1px solid #dbdbdb;
      .decrease,
      .increase {
        display: inline-block;
        width: 31px;
      }
      .numbers {
        display: inline-block;
        min-width: 40px;
        border-left: 1px solid #dbdbdb;
        border-right: 1px solid #dbdbdb;
      }
    }
    .sign {
      float: right;
      display: block;
      width: 90px;
      line-height: 50px;
      text-align: center;
      color: #fff;
    }
  }
  .entry-box {
    line-height: 46px;
    padding: 15px;
    .text-right {
      float: right;
    }
    .btn-wrapper {
      display: flex;
      >span {
        flex: 1;
        border-radius: 4px;
        color: #fff;
        line-height: 36px;
        text-align: center;
        margin-right: 10px;
        &:active {
          opacity: 0.8;
        }
      }
      .cancel {
        background-color: #fa8178;
      }
    }
  }
}
</style>


