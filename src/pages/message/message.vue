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
      内容
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRead: true,
    };
  },
  methods: {
    showRead() {
      this.isRead = true
    },
    showReadNone() {
      this.isRead = false
    },
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";

#memberMessageTab {
  .isRead {
    display: flex;
    >span {
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
    >input {
      border-radius: 5px;
      background-color: #fff;
      font-size: 14px;
      text-align: center;
      color: #333;
    }
  }
}
</style>


