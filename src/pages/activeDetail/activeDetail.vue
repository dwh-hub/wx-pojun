<template>
  <div id="memberActiveDetail">
    <div class="active-cover">
      <image mode="widthFix" :src="'https://www.pojun-tech.cn' + activeDetail.thumbUrl" class="cover"></image>
    </div>
    <div class="active-title">{{activeDetail.title}}</div>
    <div class="active-num">{{activeDetail.digest}}</div>
    <div class="active-content-wrapper">
      <div class="active-content-t">活动内容</div>
      <div class="active-content">
        <wxParse :content="activeDetail.content" :imageProp="{domain: 'www.pojun-tech.cn', mode: 'widthFix'}"/>
      </div>
    </div>
    <div class="activeBottom">
      <span class="activeBottomTitle">人数：</span>
      <div class="count-wrapper">
        <span class="decrease" @click="decrease">-</span>
        <span class="numbers">{{signNum}}</span>
        <span class="increase" @click="signNum++">+</span>
      </div>
      <span class="sign">报名</span>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import wxParse from "mpvue-wxparse";
export default {
  data() {
    return {
      signNum: "1",
      activeDetail: {},
      content:
        '<p><span style="background-color: rgb（255, 255, 255）; color: rgb（255, 0, 0）; font-weight: bold;">缴纳定金权益享受下述权益:</span></p><p>1.预存50元定金，可享受办卡首年免费；</p><p>2.获得会所赠送价值200的水吧券一张；</p><p>3.获得会所价值288元的运动背包；</p><p>4.享受会所价值788元的一对一私教二节及专业的健康状况评估；</p><p>5.享受停车2小时免费（卡有效期内来游泳健身）；</p><p>6.享受独立淋浴间（共15间）使用权，极大保护个人隐私；</p><p>7.享受儿童独立淋浴室；</p><p>8.优先获得参加会所举办的所有常规和户外活动的权益；</p><p>9.参加会所开业庆典活动和抽奖活动；</p><p>10.如不办卡，享受持定金单换取会所VIP贵宾券二张。</p><p><br></p><p>门店效果预览图（以门店实际装修为准）</p><p><img src="/images/activities/37/1.55065529299746E12.jpeg" style="width: 874px; float: none;"></p><p><img src="/images/activities/37/1.5506553509545596E12.jpeg" style="width: 1500px; float: none;"></p><p><img src="/images/activities/37/1.5506553654493972E12.jpeg" style="width: 1500px;"></p><p><img src="/images/activities/37/1.5506553892880002E12.jpeg" style="width: 1426px;"></p><p><img src="/images/activities/37/1.550655397923402E12.jpeg" style="width: 1152px;"></p><p><img src="/images/activities/37/1.550655407173489E12.jpeg" style="width: 1152px;"><br></p>'
    };
  },
  onLoad() {
    setNavTab();
  },
  mounted() {
    this.getActiveDetail();
  },
  components: {
    wxParse
  },
  methods: {
    decrease() {
      if (signNum == 1) {
        return;
      }
      signNum--;
    },
    preview(src, e) {
      console.log(src);
    },
    getActiveDetail() {
      let that = this;
      return that.activeDetail = {
        addTime: null,
        addUserId: 1,
        addUserName: null,
        companyId: 37,
        content: `<p><span style="background-color: rgb（255, 255, 255）; color: rgb（255, 0, 0）; font-weight: bold;">缴纳定金权益享受下述权益:</span></p><p>1.预存50元定金，可享受办卡首年免费；</p><p>2.获得会所赠送价值200的水吧券一张；</p><p>3.获得会所价值288元的运动背包；</p><p>4.享受会所价值788元的一对一私教二节及专业的健康状况评估；</p><p>5.享受停车2小时免费（卡有效期内来游泳健身）；</p><p>6.享受独立淋浴间（共15间）使用权，极大保护个人隐私；</p><p>7.享受儿童独立淋浴室；</p><p>8.优先获得参加会所举办的所有常规和户外活动的权益；</p><p>9.参加会所开业庆典活动和抽奖活动；</p><p>10.如不办卡，享受持定金单换取会所VIP贵宾券二张。</p><p><br></p><p>门店效果预览图（以门店实际装修为准）</p><p><img src="/images/activities/37/1.55065529299746E12.jpeg" style="width: 874px; float: none;"></p><p><img src="/images/activities/37/1.5506553509545596E12.jpeg" style="width: 1500px; float: none;"></p><p><img src="/images/activities/37/1.5506553654493972E12.jpeg" style="width: 1500px;"></p><p><img src="/images/activities/37/1.5506553892880002E12.jpeg" style="width: 1426px;"></p><p><img src="/images/activities/37/1.550655397923402E12.jpeg" style="width: 1152px;"></p><p><img src="/images/activities/37/1.550655407173489E12.jpeg" style="width: 1152px;"><br></p>`,
        digest: "仅限前300名",
        enterType: "1,2",
        entryFee: 0.01,
        entryFeeCount: null,
        entryNum: 10,
        isEnter: 1,
        isEntryFee: 1,
        isLimitNum: 1,
        isSelfMaxLimit: 1,
        limitNum: 300,
        markId: 7,
        modifyTime: null,
        modifyUserId: 1,
        modifyUserName: null,
        noRegisterNum: 34,
        registerNum: 94,
        selfMaxLimit: 1,
        showUrl: null,
        state: 1,
        stateChar: null,
        storeId: "101",
        storeName: "马戏城店",
        thumbUrl: "/images/activities/37/1.5506552470484482E12.jpeg",
        title: "前锋体育马戏城店创始会员预定活动",
        venueId: null,
        venueName: null,
        viewNum: 128
      };
      HttpRequest({
        url: window.api + "/wxmarketing/detail",
        data: {
          markId: 7
        },
        success(res) {
          that.activeDetail = res.data.data;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
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
  .active-num {
    margin: 0 15px;
    font-size: 14px;
    color: #666;
    height: 25px;
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
    height: 48px;
    line-height: 48px;
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
      text-align: center;
      background-color: #3b97eb;
      color: #fff;
    }
  }
}
</style>


