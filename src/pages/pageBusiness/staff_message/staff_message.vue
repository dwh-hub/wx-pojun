<template>
  <div class="staff_message">
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
    <div class="header">
      <van-tabs :active="navIndex" @change="onChange" :color="themeColor" swipeable animated sticky>
        <van-tab title="未读">
          <div class="readContent">
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
            <page-footer v-if="messageNList.length"></page-footer>
          </div>
        </van-tab>
        <van-tab title="已读">
          <div class="readContent">
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
        </van-tab>
      </van-tabs>
    </div>
    <van-tabbar active="3" @change="changeTabbar">
      <van-tabbar-item icon="home-o">快捷</van-tabbar-item>
      <van-tabbar-item icon="question-o">帮助</van-tabbar-item>
      <van-tabbar-item icon="desktop-o">工作台</van-tabbar-item>
      <van-tabbar-item icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {
  HttpRequest,
  setNavTab,
  window,
  formatDate
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
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
    this.getMessage(0, 1);
    this.getMessage(1, 1);
  },
  components: {
    noneResult
  },
  mixins: [colorMixin],
  onReachBottom() {
    if (this.navIndex == 0) {
      this.getMessage(0, 1);
    }
    if (this.navIndex == 1) {
      this.getMessage(1, this.messageYPage);
    }
  },
  methods: {
    onChange(e) {
      this.navIndex = e.mp.detail.index;
    },
    changeTabbar(e) {
      if (e.mp.detail == 0) {
        wx.redirectTo({
          url: "../index/main"
        });
      }
      if (e.mp.detail == 2) {
        wx.redirectTo({
          url: "../workbench/main"
        });
      }
      if (e.mp.detail == 4) {
        wx.redirectTo({
          url: "../staff_mine/main"
        });
      }
    },
    // status 0 未读 1 已读
    getMessage(status, page) {
      let that = this;
      HttpRequest({
        url: window.api + "/home/wechat/message/pages",
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
    // 标记当前页为已读
    mulitpleMessage(id) {
      let that = this;
      HttpRequest({
        url: window.api + "/home/wechat/message/read/mulitple",
        data: {
          msgIdArray: String(that.arrId)
        },
        success(res) {
          if (res.data.code === 200) {
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
</style>
