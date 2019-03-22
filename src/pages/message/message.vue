<template>
  <div id="memberMessageTab" class="clickTab">
    <!-- <span id="turnRead">标记为已读</span> -->
    <!-- <div class="isRead">
      <span class="read" :class="{ select: isRead }" @click="showRead">未读</span>
      <span class="read-none" :class="{ select: !isRead }" @click="showReadNone">已读</span>
    </div> -->
    <van-tabs :active="navIndex" @change="onChange" color="#2a82e4">
      <van-tab title="未读"></van-tab>
      <van-tab title="已读"></van-tab>
    </van-tabs>
    <div class="search">
      <input type="text" placeholder="请输入名字/手机号回车搜索" placeholder-style="color: #ccc;">
    </div>
    <div class="readContent" v-show="navIndex == 0">
      <div class="message-item" v-for="(item, index) in messageNList" :key="index">
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
    </div>
    <div class="readContent" v-show="navIndex == 1">
      <div class="message-item" v-for="(item, index) in messageYList" :key="index">
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
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest,formatDate } from "COMMON/js/common.js";
export default {
  data() {
    return {
      isRead: true,
      // 当前激活的标签
      navIndex: 0,
      // 未读的页数
      messageNpage: 1,
      messageNList: [],
      // 已读的页数
      messageYPage: 1,
      messageYList: [],
    };
  },
  onLoad() {
    setNavTab("", "#2a82e4");
    this.getMessage(0, 1)
    this.getMessage(1, 1)
  },
  methods: {
    showRead() {
      this.isRead = true;
    },
    showReadNone() {
      this.isRead = false;
    },
    onChange(e) {
      this.navIndex = e.mp.detail.index
    },
    // 获取信息 status 0 未读 1 已读
    getMessage(status, page) {
      let that = this
      HttpRequest({
        url: window.api + '/home/wechat/message/customer/pages',
        data: {
          status: status,
          pageNo: page
        },
        success(res) {
          res.data.data.result.map((e) => {
            e.addTime = formatDate(new Date(e.addTime), 'yyyy-MM-dd hh:mm')
          })
          if(status == 0) {
            that.messageNList = res.data.data.result
          } else if (status == 1) {
            that.messageYList = res.data.data.result
          }
        }
      })
    },
    // 标记当前页为已读
    // mulitpleMessage() {
    //   HttpRequest({
    //     url: '/home/wechat/message/customer/read/mulitple'
    //   })
    // }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";

#memberMessageTab {
  .isRead {
    display: flex;
    > span {
      flex: 1;
      text-align: center;
      line-height: 40px;
      &.select {
        color: #2193fa;
        border-bottom: 1px solid #2193fa;
      }
    }
  }
  .search {
    padding: 10px;
    background-color: #fafafa;
    > input {
      border-radius: 5px;
      background-color: #fff;
      font-size: 14px;
      text-align: center;
      color: #333;
    }
  }
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
        }
      }
    }
  }
}
</style>


