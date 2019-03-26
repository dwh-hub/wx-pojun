<template>
  <div class="card" @click="hasClick" :class="backClass">
    <img src="https://www.pojun-tech.cn/assets/img/qixianka.png" alt>
    <div class="card-content">
      <div class="card-top">
        <div class="card-info pl">
          <div class="card-name">{{info.cardClassName || info.secondCardClass}}</div>
          <div class="card-date">{{activateDate}}~{{doomsday}}</div>
        </div>
        <div class="card-type pr">{{info.masterClassName || info.masterCradClass}}</div>
      </div>
      <div class="card-bottom">
        <div class="card-term pl">{{info.balanceAuthority}}{{type}}</div>
        <div class="card-status pr">{{info.cardStatusChar}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      type: ''
    };
  },
  mounted() {
  },
  computed: {
    // 卡的激活时间
    activateDate() {
      if(this.info.activateDate) {
        return this.info.activateDate.split(" ")[0]
      }
    },
    // 卡的到期时间
    doomsday() {
      if (this.info.doomsday) {
        return this.info.doomsday.split(" ")[0]
      }
    },
    backClass() {
      if(this.info.authorityUnit == '次' || this.info.authorityUnit == '2') {
        this.type = '次'
        return 'times'
      }
      if(this.info.authorityUnit == '元' || this.info.authorityUnit == '0') {
        this.type = '元'
        return 'yuan'
      }
      if(this.info.authorityUnit == '天' || this.info.authorityUnit == '1') {
        this.type = '天'
        return 'day'
      }
    }
  },
  methods: {
    hasClick() {
      this.$emit("hasClick", this.info);
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset.less";
.pl {
  float: left;
}
.pr {
  float: right;
}
.card {
  position: relative;
  width: 100%;
  height: 50vw;
  border-radius: 10px;
  box-shadow: 0px 2px 5px #999;
  // 元卡 绿色  天卡 黄色  次卡 蓝色
  &.day {
    background-image: linear-gradient(to left top, #87c6ff, #159bff);
    .card-status {
      color: #159bff;
    }
  }
  &.yuan {
    background-image: linear-gradient(to left top, #37d8a9, #0dbbc9);
    .card-status {
      color: #0dbbc9;
    }
  }
  &.times {
    background-image: linear-gradient(to left top, #ffc66c, #ff7f44);
    .card-status {
      color: #ff7f44;
    }
  }
  .none {
    color: gray;
    background-image: linear-gradient(to left top, lightgray, gray);
    .card-status {
      color: gray;
    }
  }
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
        .card-name {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
        }
        .card-date {
          margin-top: 5px;
          font-size: 14px;
          color: #fff;
        }
      }
      .card-type {
        font-size: 14px;
        line-height: 24px;
        padding: 0 10px;
        border-radius: 5px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    .card-bottom {
      .card-term {
        font-size: 18px;
        color: #fff;
      }
      .card-status {
        padding: 0px 15px;
        font-size: 14px;
        line-height: 24px;
        border-radius: 20px;
        background-color: #fff;
      }
    }
  }
}
</style>

