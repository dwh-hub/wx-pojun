<template>
  <div class="staff-coach-item" @click="clickItem">
    <div v-if="info.id">
      <div class="cover">
        <!-- <image src="" mode="aspectFill"></image> -->
        <div class="avatar"></div>
      </div>
      <div class="coach-info">
        <div class="coach-name">
          <span class="first-1">{{info.first_tip_1 || ''}}{{info.first_1 || ''}}</span>
          <span class="first-2">{{info.first_tip_2 || ''}}{{info.first_2 || ''}}</span>
        </div>
        <div class="coach-times">
          <span class="second-1">{{info.second_tip_1 || ''}}{{undefined == info.second_1 ? '' : info.second_1}}</span>
          <span class="second-2">{{info.second_tip_2 || ''}}{{info.second_2 || ''}}</span>
        </div>
        <div class="coach-desc">
          <span class="third-1">{{info.third_tip_1 || ''}}{{info.third_1 || ''}}</span>
          <span class="third-2">{{info.third_tip_2 || ''}}{{info.third_2 || ''}}</span>
        </div>
      </div>
      <div class="tag" v-if='isTag'>
        <div class="coach-type">上课中</div>
      </div>
      <div class="icon-right" @click.stop="clickIcon">
        <slot></slot>
      </div>
    </div>
    <div class="coach-skeleton" v-else>
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
    },
    info: {
      type: Object,
      default: function() {
        return {
          id: "",
          cover: "",
          first_1: "",
          first_2: "",
          second_1: "",
          second_2: "",
          third_1: "",
          third_2: "",
        }
      }
    }
  },
  computed: {},
  methods: {
    clickIcon() {
      this.$emit("clickIcon")
    },
    clickItem() {
      this.$emit("clickItem")
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
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
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
    .first-1 {
      font-weight: bold;
    }
    .first-2 {
      display: inline-block;
      margin-left: 10px;
      font-size: 12px;
      color: #808080;
    }
    .third-1 {
      color: #aeaeae;
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
      flex: 0 0 70px;
      width: 70px;
      height: 70px;
    }
    .skeleton-wrapper {
      padding: 0 12px;
      width: 100%;
      .skeleton-name {
        margin-top: 4px;
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


