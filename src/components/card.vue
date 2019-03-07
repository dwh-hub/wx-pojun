<template>
  <div class="card" @click="hasClick">
    <img src="https://www.pojun-tech.cn/assets/img/qixianka.png" alt>
    <div class="card-content">
      <div class="card-top">
        <div class="card-info pl">
          <div class="card-name">$私教卡$</div>
          <div class="card-date">$2019.03.01~2019.03.01$</div>
        </div>
        <div class="card-type pr">$年卡$</div>
      </div>
      <div class="card-bottom">
        <div class="card-term pl">$2次$</div>
        <div class="card-status pr">$过期$</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {
    cardBack() {
      return {
        "background-image": "linear-gradient(to left top, #ffc66c, #ff7f44);"
      };
    }
  },
  methods:{
    hasClick() {
      // TODO: 大概还要传id
      this.$emit('hasClick', '参数')
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";

.card {
  position: relative;
  width: 100%;
  height: 50vw;
  border-radius: 10px;
  background-image: linear-gradient(to left top, #ffc66c, #ff7f44);
  box-shadow: 0px 2px 5px #999;
  > img {
    width: 100%;
    height: 100%;
  }
  .card-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;
    color: #fff;
    .card-top {
      .card-info {
        .card-date {
          font-size: 14px;
        }
      }
      .card-type {
        font-size: 14px;
        line-height: 24px;
        padding: 0 10px;
        border-radius: 5px;
        background-color: red;
      }
    }
    .card-bottom {
      .card-status {
        padding: 0px 15px;
        font-size: 14px;
        line-height: 24px;
        border-radius: 20px;
        background-color: red;
      }
    }
  }
}
</style>

