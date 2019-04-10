<template>
  <div id="memberMessageTab" class="clickTab">
    <!-- <span id="turnRead">标记为已读</span> -->
    <!-- <div class="isRead">
      <span class="read" :class="{ select: isRead }" @click="showRead">未读</span>
      <span class="read-none" :class="{ select: !isRead }" @click="showReadNone">已读</span>
    </div>-->
    <div class="header">
      <van-tabs :active="navIndex" @change="onChange" :duration="0" :color="themeColor">
        <van-tab title="未读"></van-tab>
        <van-tab title="已读"></van-tab>
      </van-tabs>
      <!-- <div class="search">
        <input type="text" placeholder="请输入名字/手机号回车搜索" placeholder-style="color: #ccc;">
      </div>-->
    </div>
    <div class="readContent" v-show="navIndex == 0">
      <div
        class="message-item"
        v-for="(item, index) in messageNList"
        :key="index"
        @click="showDetail(item)"
      >
        <div class="img-wrapper">
          <img src="https://www.pojun-tech.com/assets/img/messageDetailIcon.png">
        </div>
        <div class="message-info">
          <div class="message-content">
            <div class="title">{{item.userMessageTemplateTitle}}</div>
            <div class="message-date">{{item.addTime}}</div>
          </div>
          <div class="message-text">{{item.userMessageParam}}</div>
        </div>
      </div>
      <none-result v-if="!messageNList.length" text="暂无未读消息"></none-result>
    </div>
    <div class="readContent" v-show="navIndex == 1">
      <div
        class="message-item"
        v-for="(item, index) in messageYList"
        :key="index"
        @click="showDetail(item)"
      >
        <div class="img-wrapper">
          <img src="https://www.pojun-tech.com/assets/img/messageDetailIcon.png">
        </div>
        <div class="message-info">
          <div class="message-content">
            <div class="title">{{item.userMessageTemplateTitle}}</div>
            <div class="message-date">{{item.addTime}}</div>
          </div>
          <div class="message-text">{{item.userMessageParam}}</div>
        </div>
      </div>
      <none-result v-if="!messageYList.length" text="暂无消息"></none-result>
    </div>
    <van-popup
      position="right"
      :show="showMessageBox"
      @close="showMessageBox = false"
      :duration="200"
      custom-style="width:100%;height:100%"
    >
      <div class="back" @click="showMessageBox = false">返回</div>
      <div class="message-box">
        <div class="title">
          <span class="title">{{curMessage.userMessageTemplateTitle}}</span>
          <span class="time">{{curMessage.addTime}}</span>
        </div>
        <!-- <p>
          <wxParse :content="curMessage.userMessageParam"/>
        </p>-->
        <p>
          <wxParse :content="curMessage.userMessageTemplateContent"/>
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import store from "../../utils/store";
import wxParse from "mpvue-wxparse";
import noneResult from "COMPS/noneResult.vue";
export default {
  data() {
    return {
      // 当前激活的标签 0 未读 1 已读
      navIndex: 0,
      // 未读的页数
      messageNpage: 1,
      messageNList: [],
      // 已读的页数
      messageYPage: 1,
      messageYList: [],
      curMessage: {},
      showMessageBox: false,
      // 未读信息id数组
      arrId: []
    };
  },
  mounted() {
    setNavTab();
  },
  onShow() {
    if (!store.state.isLogin) {
      return;
    }
    this.getMessage(0, 1);
    this.getMessage(1, 1);
  },
  onReachBottom() {
    if (this.navIndex == 0) {
      this.getMessage(0, 1);
    }
    if (this.navIndex == 1) {
      this.getMessage(1, this.messageYPage);
    }
  },
  components: {
    wxParse,
    noneResult
  },
  computed: {
    themeColor() {
      return window.color;
    }
  },
  methods: {
    onChange(e) {
      this.navIndex = e.mp.detail.index;
    },
    // 获取信息 status 0 未读 1 已读
    getMessage(status, page) {
      let that = this;
      HttpRequest({
        url: window.api + "/home/wechat/message/customer/pages",
        data: {
          status: status,
          pageNo: page
        },
        success(res) {
          if (res.data.code === 200) {
            if (!res.data.data.result.length) {
              return;
            }
            let _arrId = [];
            res.data.data.result.map(e => {
              e.addTime = formatDate(new Date(e.addTime), "yyyy-MM-dd hh:mm");
              _arrId.push(e.userMessageId);
            });
            that.arrId = _arrId;
            if (status == 0) {
              that.messageNList = res.data.data.result;
              that.mulitpleMessage();
              // that.messageNPage++
            } else if (status == 1) {
              that.messageYList = that.messageYList.concat(
                res.data.data.result
              );
              that.messageYPage++;
            }
          }
        }
      });
    },
    // 显示消息详情
    showDetail(item) {
      item.addTime = formatDate(new Date(item.addTime), "yyyy-MM-dd hh:mm");
      let _arr = item.userMessageParam.split(",");
      for (let p in _arr) {
        item.userMessageTemplateContent = item.userMessageTemplateContent.replace(
          "%s",
          _arr[p]
        );
      }
      this.curMessage = item;
      this.showMessageBox = true;
    },
    // 标记当前页为已读
    mulitpleMessage(id) {
      let that = this;
      HttpRequest({
        url: window.api + "/home/wechat/message/customer/read/mulitple",
        data: {
          msgIdArray: String(that.arrId)
        },
        success(res) {
          if (res.data.code === 200) {
            that.getMessageCount();
          }
        }
      });
    },
    // 设置消息未读个数
    getMessageCount() {
      HttpRequest({
        url: window.api + "/home/wechat/message/customer/pages",
        data: {
          status: 0,
          pageNo: 1
        },
        success(res) {
          if (res.data.code == 200) {
            if (res.data.data.recCount > 99) {
              return wx.setTabBarBadge({
                index: 3,
                text: "99+"
              });
            }
            if (res.data.data.recCount <= 99 && res.data.data.recCount > 0) {
              return wx.setTabBarBadge({
                index: 3,
                text: String(res.data.data.recCount)
              });
            } else {
              return wx.setTabBarBadge({
                index: 3,
                text: null
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";
@import "~COMMON/less/common";
@import url("~mpvue-wxparse/src/wxParse.css");

#memberMessageTab {
  padding-top: 44px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    height: 44px;
    width: 100%;
    background-color: #fff;
  }
  // .search {
  //   padding: 10px;
  //   background-color: #fafafa;
  //   > input {
  //     border-radius: 5px;
  //     background-color: #fff;
  //     font-size: 14px;
  //     text-align: center;
  //     color: #333;
  //   }
  // }
  .readContent {
    .message-item {
      display: flex;
      padding: 10px 10px;
      border-bottom: 1px solid #eee;
      .img-wrapper {
        flex: 0 0 70px;
        width: 65px;
        height: 65px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .message-info {
        flex: 1;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .message-content {
          width: 100%;
          line-height: 30px;
          .title {
            font-size: 16px;
            display: inline-block;
            font-weight: bold;
          }
          .message-date {
            float: right;
            color: #666;
            font-size: 12px;
          }
        }
        .message-text {
          font-size: 12px;
          line-height: 20px;
          .Mult-line(2);
        }
      }
    }
  }
  .back {
    line-height: 40px;
    width: 80px;
    border: 1rpx solid #eee;
    margin: 15px;
    text-align: center;
    &:active {
      background-color: #e6e6e6;
    }
  }
  .message-box {
    border: 1rpx solid #e6e6e6;
    border-radius: 15px;
    padding: 15px;
    margin: 15px;
    .title {
      line-height: 24px;
      margin-bottom: 10px;
      .time {
        float: right;
      }
    }
  }
}
</style>


