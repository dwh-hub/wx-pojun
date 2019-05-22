<template>
  <div class="member">
    <div class="tabs" :style="{background: themeColor}">
      <span class="student" :class="{underline: tabIndex == 1}" @click="tabIndex = 1">客户列表</span>
      <span class="customer" :class="{underline: tabIndex == 2}" @click="tabIndex = 2">汇总</span>
    </div>
    <div class="header-search">
      <div class="search-wrapper">
        <van-search
          :value="searchText"
          :background="themeColor"
          @change="searchChange"
          placeholder="请输入搜索内容"
        ></van-search>
      </div>
    </div>
    <header-data :headerData="headerData"></header-data>
    <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>

    <van-popup
      :show="isShowFilter"
      @close="isShowFilter = false"
      position="right"
      custom-style="width:80%;height:100%"
    ></van-popup>

    <div class="customer-list">
      <div class="customer-item" v-for="(item,index) in customerList" :key="index">
        <div class="item-left" @click="selectCustomer(item,index)" v-show="isOperate">
          <div class="icon-wrapper" :class="{border: !item.isSelect}">
            <img src="/static/images/staff/select-icon.png" alt v-show="item.isSelect">
          </div>
        </div>
        <staff-coach-item @clickIcon="call" @clickItem="toDetail(item,index)" :info="item">
          <div>
            <img src="/static/images/staff/phone.svg" alt>
            <img src="/static/images/staff/right-arrow.svg" alt>
          </div>
        </staff-coach-item>
      </div>
    </div>

    <div class="operate-bottom" v-if="isOperate">
      <div class="left" @click="selectAll">
        <div class="icon-wrapper" :class="{border: !isAllSelect}">
          <img src="/static/images/staff/select-icon.png" alt v-show="isAllSelect">
        </div>
        <span class="left-text">全选</span>
      </div>
      <div class="middle">已选{{selectNum}}节</div>
      <div class="right">
        <div class="btn" @click="isOperate = false" :style="{background: themeColor}">取消操作</div>
        <div class="btn" @click="distributionSales" :style="{background: themeColor}">分配服务销售</div>
      </div>
    </div>

    <van-popup
      :show="showSalesPopup"
      @close="showSalesPopup = false"
      :duration="200"
      position="bottom"
      custom-style="width:100%"
    >
      <div class="sales-list">
        <div class="sales-item">
          <div class="avatar">
            <img src="http://pojun-tech.cn/assets/img/manimg.jpg" alt>
          </div>
          <div class="name">销售名字</div>
          <div class="phone">18236497833</div>
        </div>
      </div>
    </van-popup>
    <suspension-window v-if="!isOperate" :operateList="operateList" @operate="operate"></suspension-window>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import suspensionWindow from "../components/suspension-window.vue";
import colorMixin from "COMPS/colorMixin.vue";

export default {
  data() {
    return {
      searchText: "",
      isShowFilter: false,
      tabIndex: 1,
      nav: [
        {
          navTitle: "登记时间",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            },
            {
              sonText: "自定义"
            }
          ]
        },
        {
          navTitle: "未维护时间",
          children: [
            {
              sonText: "今日"
            },
            {
              sonText: "本周"
            },
            {
              sonText: "本月"
            },
            {
              sonText: "自定义"
            }
          ]
        },
        {
          navTitle: "会员状态",
          children: [
            {
              sonText: "潜在"
            },
            {
              sonText: "现有"
            },
            {
              sonText: "定金"
            },
            {
              sonText: "失效"
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "人数",
          dataNum: "12"
        },
        {
          dataText: "数据二",
          dataNum: "42"
        },
        {
          dataText: "数据三",
          dataNum: "39"
        }
      ],
      operateList: [
        {
          text: "分配销售",
          iconUrl: "/static/images/staff/close.svg"
        },
        {
          text: "分配教练",
          iconUrl: "/static/images/staff/calendar.svg"
        },
        {
          text: "发送手机短信",
          iconUrl: "/static/images/staff/calendar.svg"
        },
        {
          text: "关注",
          iconUrl: "/static/images/staff/calendar.svg"
        }
      ],
      customerList: [{}, {}, {}, {}],
      isOperate: false,
      isAllSelect: false,
      showSalesPopup: false,
      page: 1
      // showOperate: false
    };
  },
  mounted() {
    setNavTab();
    this.getCustomerList();
  },
  mixins: [colorMixin],
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    suspensionWindow
  },
  computed: {
    window() {
      return window;
    },
    selectNum() {
      let _num = 0;
      this.customerList.forEach(e => {
        if (e.isSelect) {
          _num++;
        }
      });
      return _num;
    }
  },
  onReachBottom() {
    this.getCustomerList();
  },
  methods: {
    getCustomerList() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/list/search",
        data: {
          page: that.page
        },
        success(res) {
          if (res.data.code == 200) {
            let _res = res.data.data;
            if (_res.result.length) {
              that.page++;
            }
            that.headerData[0].dataNum = _res.recCount;
            that.customerList = _res.result.map(e => {
              return {
                isSelect: false,
                id: e.id,
                cover: window.api + e.headImgPath,
                first_1: e.name,
                first_2: e.customerClassChar,
                second_1: e.cardNum,
                second_tip_1: "合同数：",
                second_2: "",
                third_1: e.lastTrackTime,
                third_tip_1: "最后签到时间："
              };
            });
          }
        }
      });
    },
    toDetail(item, index) {
      if (this.isOperate) {
        this.selectCustomer(item, index)
        return
      }
      wx.navigateTo({
        url: "../customer_detail/main?id="
      });
    },
    showFilter() {
      this.isShowFilter = true;
    },
    searchChange(e) {
      console.log(e);
    },
    operate(param) {
      console.log(param);
      if (param == "分配销售") {
        this.isOperate = true;
      }
    },
    call() {
      wx.makePhoneCall({
        phoneNumber: ""
      });
    },
    selectCustomer(item, index) {
      if (!this.isOperate) {
        return;
      }
      console.log(item)
      this.customerList[index].isSelect = !item.isSelect;
      if (this.customerList.filter(e => true !== e.isSelect).length > 0) {
        this.isAllSelect = false;
      } else {
        this.isAllSelect = true;
      }
    },
    selectAll() {
      let that = this;
      this.customerList = this.customerList.map(e => {
        if (that.isAllSelect) {
          e.isSelect = false;
          that.isAllSelect = false;
        } else {
          e.isSelect = true;
          that.isAllSelect = true;
        }
        return e;
      });
    },
    distributionSales() {
      this.showSalesPopup = true;
      // if (!this.selectNum) {
      //   return Toast("未选择课程");
      // }
      // Dialog.confirm({
      //   title: `确认取消课程${this.selectNum}节`,
      //   message: "确认取消所选的课程吗？",
      //   asyncClose: true
      // })
      //   .then(() => {
      //     setTimeout(() => {
      //       Dialog.close();
      //       this.isOperate = false;
      //       Toast("取消成功");
      //     }, 1000);
      //   })
      //   .catch(() => {
      //     Dialog.close();
      //   });
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
.member {
  .tabs {
    padding: 0 5px;
    background-color: #fff;
    > span {
      display: inline-block;
      padding: 0 15px;
      line-height: 36px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      &.underline {
        border-bottom: 2px solid #fff;
      }
    }
  }
  .filter-nav {
    margin-top: 5px;
    margin-bottom: 1px;
    .mask {
      top: 205px;
    }
  }
  .customer-list {
    .customer-item {
      display: flex;
      background-color: #fff;
      .item-left {
        // flex: 0 0 30px;
        padding-left: 10px;
        box-sizing: border-box;
        .icon-wrapper {
          margin-top: 27px;
        }
      }
    }
  }
  .staff-coach-item {
    border-bottom: 1rpx solid #eee;
    flex: 1;
    .icon-right {
      margin-top: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .icon-wrapper {
    width: 20px;
    height: 20px;
    &.border {
      border: 1rpx solid #eee;
      border-radius: 50%;
    }
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .operate-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 40px;
    height: 40px;
    color: #2a82e4;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    justify-content: space-between;
    .left {
      .icon-wrapper {
        display: inline-block;
        margin: 0 15px;
        &.border {
          vertical-align: middle;
        }
      }
      .left-text {
        display: inline-block;
      }
    }
    .right {
      // float: right;
      .btn {
        display: inline-block;
        padding: 0 15px;
        border-left: 1rpx solid #fff;
        color: #fff;
      }
    }
  }
  .sales-list {
    .sales-item {
      display: flex;
      border-top: 1rpx solid #eee;
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
      .name {
        margin-right: 10px;
      }
      .name,
      .phone {
        line-height: 65px;
        border-top: 1rpx solid #eee;
      }
    }
  }
}
</style>
