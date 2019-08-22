<template>
  <div class="modify-cell">
    <input type="text" v-model="value">
    <div class="confirm" @click="confirm" :style="{'background-color':window.color}">确认</div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import { EventBus } from "../common/js/eventBus.js";
export default {
  data() {
    return {
      userInfo: "",
      type: "",
      value: "", // 属性值
      name: "" // 属性名
    };
  },
  onLoad(options) {
    this.type = options.type;
    this.value = options.value;
    this.name = options.name
    this.userInfo = wx.getStorageSync("staff_info");
  },
  mounted() {
    setNavTab();
  },
  computed: {
    window() {
      return window;
    }
  },
  methods: {
    confirm() {
      if(this.type == "customer") {
        EventBus.$emit('modifyCell', {name: this.name, value: this.value})
        wx.navigateBack({
          delta: 1
        });
        return
      }
      let that = this;
      // let data = {
      //   userId: this.userInfo.userId,
      //   phone: "",
      //   userName: "",
      //   sex: "",
      //   idCardNum: ""
      // };
      // for (let i in data) {
      //   if (i == this.type) {
      //     data[i] = this.text;
      //   }
      //   if(data[i] == '' || !data[i]) {
      //     delete data[i]
      //   }
      // }
      let data = {
        userId: this.userInfo.userId,
      }
      data[this.name] = this.value
      HttpRequest({
        url: "/employee/file/modify/userInfo",
        data: data,
        success(res) {
          if (res.data.code === 200) {
            wx.showToast({
              title: "修改成功"
            });
            that.userInfo[that.name] = that.value
            wx.setStorageSync("staff_info", that.userInfo);
          } else {
            wx.showModal({
              title: "错误",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
.modify-cell {
  > input {
    line-height: 42px;
    height: 42px;
    border-bottom: 1px solid #eee;
    padding-left: 15px;
  }
  .confirm {
    width: 95vw;
    margin: 0 auto;
    margin-top: 10px;
    text-align: center;
    line-height: 36px;
    border-radius: 5px;
    color: #fff;
  }
}
</style>
