<template>
  <div class="select-company" v-show="showCompanyPopup">
    <div class="popup">
      <div class="title">请选择要登录的公司</div>
      <div class="company-list">
        <div
          class="company-item"
          @click="selectCompany(item, index)"
          v-for="(item, index) in companyList"
          :key="index"
          :class="{'active': index == tabIndex}"
        >{{item.companyName}}</div>
      </div>
      <div class="btn-group">
        <div class="confirm" @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { window, HttpRequest } from "COMMON/js/common.js";
import { staffLogin, enterStaff, enterMember } from "COMMON/js/only_staff_login.js";
export default {
  props: {
    companyList: {
      type: Array,
      default: []
    },
    role: {
      type: "String"
    }
  },
  data() {
    return {
      showCompanyPopup: true,
      tabIndex: 0
    };
  },
  computed: {
    window() {
      return window;
    }
  },
  methods: {
    selectCompany(item, index) {
      console.log(this.role);
      this.tabIndex = index;
    },
    confirm() {
      console.log(this.companyList[this.tabIndex]);
      wx.setStorageSync("companyId", this.companyList[this.tabIndex].companyId);
      if (this.role == "staff") {
        staffLogin().then(res => {
          enterStaff(res)
        });
      }
      if (this.role == "member") {
        enterMember(this.companyList[this.tabIndex])
      }
      this.showCompanyPopup = false;
    }
  }
};
</script>

<style lang="less">
.select-company {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    padding: 15px;
    border-radius: 6px;
    background-color: #fff;
    z-index: 99;
    .title {
      text-align: center;
      line-height: 30px;
      margin-bottom: 5px;
    }
    .company-list {
      .company-item {
        line-height: 36px;
        text-align: center;
        margin-bottom: 10px;
        border: 1rpx solid #cdcdcd;
        border-radius: 5px;
        font-size: 12px;
        &.active {
          color: #f4b400;
          border: 1rpx solid #f4b400;
        }
      }
    }
    .btn-group {
      display: flex;
      > div {
        flex: 1;
        line-height: 32px;
        text-align: center;
        margin-right: 5px;
        color: #fff;
        border-radius: 5px;
      }
      .cancel {
        background-color: #ec6c62;
      }
      .confirm {
        background-color: #f4b400;
      }
    }
  }
}
</style>
