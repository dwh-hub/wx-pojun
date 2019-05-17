<template>
  <div class="staff-coach-item">
    <div>
      <div class="cover">
        <!-- <image src="" mode="aspectFill"></image> -->
        <div class="avatar"></div>
      </div>
      <div class="coach-info">
        <div class="coach-name">教练名字</div>
        <div class="coach-times">
          <span>2019-04-23 18:00 - 19:00</span>
        </div>
        <div class="coach-desc">
          <span>服务：1对1私教服务</span>
          <span>教练：陈曦</span>
        </div>
      </div>
      <div class="tag" v-if='isTag'>
        <div class="coach-type">上课中</div>
      </div>
      <div class="icon-right" @click="clickIcon">
        <slot></slot>
      </div>
    </div>
    <div class="coach-skeleton" v-if="false">
      <div class="cover">
        <div class="avatar"></div>
      </div>
      <div class="skeleton-wrapper">
        <div class="skeleton-name"></div>
        <div class="skeleton-desc"></div>
        <div class="skeleton-time"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "coach-item",
  props: {
    isTag: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {
    clickIcon() {
      this.$emit("clickIcon")
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";

.staff-coach-item {
  > div {
    display: flex;
    background-color: #fff;
    padding: 10px 0;
    padding-right: 10px;
  }
  .cover {
    flex: 0 0 52px;
    width: 52px;
    height: 52px;
    padding-left: 12px;
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      background-color: #eee;
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
  }
  .coach-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    color: #505050;
    > div {
      flex: 1;
      .Mult-line(1);
    }
    .coach-name {
      font-size: 14px;
    }
    .coach-times,
    .coach-desc {
      > span {
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
  .tag {
    .coach-type {
      font-size: 10px;
      padding: 2px 5px;
      color: #999;
      border: 1px solid #ccc;
    }
    .coach-status {
      font-size: 10px;
      padding: 2px 5px;
      color: #f17f55;
      background-color: #feeee9;
    }
  }
  // .icon-right {
  //   margin-top: 20px;
  //   > img {
  //     width: 18px;
  //     height: 18px;
  //   }
  // }
  .coach-skeleton {
    .cover {
      > image {
        background-color: #eee;
      }
    }
    .skeleton-wrapper {
      padding: 0 12px;
      width: 100%;
      .skeleton-name {
        margin-top: 8px;
        height: 16px;
        background-color: #eee;
      }
      .skeleton-time {
        margin-top: 12px;
        height: 12px;
        width: 200px;
        background-color: #eee;
      }
      .skeleton-desc {
        margin-top: 12px;
        height: 10px;
        width: 100px;
        margin-right: 10px;
        background-color: #eee;
      }
    }
  }
}
</style>


