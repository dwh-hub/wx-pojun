<template>
  <div id="memberMessageTab" class="clickTab">
    <!-- <span id="turnRead">标记为已读</span> -->
    <div class="isRead">
      <span class="read" :class="{ select: isRead }" @click="showRead">未读</span>
      <span class="read-none" :class="{ select: !isRead }" @click="showReadNone">已读</span>
    </div>
    <div class="search">
      <input type="text" placeholder="请输入名字/手机号回车搜索" placeholder-style="color: #ccc;">
    </div>
    <div class="readContent">
      <div class="message-item">
        <div class="img-wrapper">
          <img src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png">
        </div>
        <div class="message-info">
          <div class="message-content">
            <div class="title">$绑定通知$</div>
            <div class="message-date">$2019-03-01 09:42$</div>
          </div>
          <div class="message-text">$你通过微信号一个人进行了账号绑定$</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRead: true
    };
  },
  methods: {
    showRead() {
      this.isRead = true;
    },
    showReadNone() {
      this.isRead = false;
    }
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
            display: inline-block;
            font-weight: bold;
          }
          .message-date {
            float: right;
            color: #666;
            font-size: 14px;
          }
        }
        .message-text {
          font-size: 14px;
        }
      }
    }
  }
}
</style>


