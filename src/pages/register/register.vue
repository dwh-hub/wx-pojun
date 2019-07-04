<template>
  <div class="register">
    <van-cell-group>
      <van-field
        :value="username"
        required
        clearable
        label="姓名"
        @blur="getName"
        placeholder="请输入用户名"
      />
      <div class="sex">
        <van-radio-group :value="sexValue" @change="getSex" custom-class="radio-group">
          <van-radio name="1" custom-class="radio" checked-color="#07c160">男</van-radio>
          <van-radio name="2" custom-class="radio" checked-color="#07c160">女</van-radio>
        </van-radio-group>
      </div>
      <van-field
        :value="store"
        icon="arrow-down"
        required
        disabled
        clearable
        label="门店"
        placeholder="请选择门店"
        @click="showSelect = true"
      />
      <!-- <van-picker :columns="storeList" @change="onChange"/> -->
      <!-- <van-field
        :value="phone"
        @blur="getPhone"
        label="手机号"
        placeholder="请输入手机号"
        required
        :border="false"
      />
      <van-field
        :value="sms"
        center
        required
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        use-button-slot
      > -->
        <!-- <van-button
          slot="button"
          size="small"
          type="primary"
          @blur="getSms"
          :disabled="isSend"
          @click="getVCode"
          v-show="!isSend"
        >{{btnText}}</van-button> -->
      <!-- </van-field> -->
    </van-cell-group>
    <van-action-sheet
      :show="showSelect"
      :actions="storeList"
      @close="showSelect = false;"
      @select="selectCur"
    ></van-action-sheet>
    <button type="primary" @click="register">确认注册</button>
  </div>
</template>

<script>
import { checkPhoneFormat, HttpRequest, window } from "COMMON/js/common";
export default {
  data() {
    return {
      username: "",
      // phone: "",
      // sms: "",
      sexValue: "2",
      store: "",
      storeId: "",
      storeList: [],
      // isSend: false,
      // CDTime: 0,
      // smsSendLogId: "",
      companyId: "",
      showSelect: false,
      actions: []
    };
  },
  mounted() {
    this.companyId = wx.getStorageSync("companyId");
    // this.phone = wx.getStorageSync("phone");
    this.getAllStore();
  },
  computed: {
    // btnText() {
    //   if (!this.isSend) {
    //     return "发送验证码";
    //   }
    //   return "重新发送(" + this.CDTime + "s)";
    // }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    // 获取验证码
    // getVCode() {
    //   let that = this;
    //   console.log(this.phone);
    //   // 手机验证
    //   checkPhoneFormat(this.phone)
    //     .then(() => {
    //       console.log("res");
    //       // 开始倒计时
    //       this.codeCountdown();
    //       // 校验验证码or拿短信id
    //       wx.request({
    //         url: window.api + "/sms/sendcode/nocompany",
    //         data: {
    //           phone: that.phone
    //         },
    //         success(res) {
    //           console.log(res);
    //           that.smsSendLogId = res.data.data;
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       console.log("catch");
    //       wx.showToast({
    //         title: "手机号格式不正确",
    //         icon: "none",
    //         duration: 1000
    //       });
    //     });
    // },
    // 倒计时
    // codeCountdown: function() {
    //   this.CDTime = 60;
    //   this.isSend = true;
    //   let that = this;
    //   var interval = setInterval(function() {
    //     that.CDTime--;
    //     if (that.CDTime < 1) {
    //       that.isSend = false;
    //       clearInterval(interval);
    //     }
    //   }, 1000);
    // },
    // onChange(event) {
    //   const { picker, value, index } = event.detail;
    //   Toast(`当前值：${value}, 当前索引：${index}`);
    // },
    // 获取全部门店
    getAllStore() {
      let that = this;
      wx.request({
        url: window.api + "/store/all-store-name-list-nolimit",
        data: {
          companyId: that.companyId
        },
        success(res) {
          if (res.data.code === 200) {
            that.storeList = res.data.data.map(e => {
              return {
                name: e.storeName,
                id: e.storeId
              };
            });
          }
        }
      });
    },
    // getPhone(event) {
    //   this.phone = event.mp.detail.value;
    // },
    getName(event) {
      this.username = event.mp.detail.value;
    },
    // getSms(event) {
    //   this.sms = event.mp.detail.value;
    // },
    getSex(event) {
      this.sexValue = event.mp.detail;
    },
    // 注册
    register() {
      let that = this;
      HttpRequest({
        url: window.api + "/wxcustomer/addCustomer",
        data: {
          companyId: that.companyId,
          name: that.username,
          storeId: that.storeId,
          phone: wx.getStorageSync("phone"),
          // smsSendLogId: that.smsSendLogId || 15679,
          sex: that.sexValue
        },
        success(res) {
          if (res.data.code === 200) {
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 500);
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },
    // 选择门店
    selectCur(event) {
      this.store = event.mp.detail.name;
      this.storeId = event.mp.detail.id;
      this.showSelect = false;
      console.log(this.storeId);
    }
  }
};
</script>

<style lang="less">
.register {
  padding: 0 15px;
  > button {
    margin-top: 15px;
    font-size: 16px;
    line-height: 36px;
  }
  .sex {
    border-bottom: 1rpx solid #eee;
    margin-left: 15px;
    margin-right: 5px;
  }
  .radio-group {
    border: 1rpx solid #eee;
  }
  .radio {
    display: inline-block;
    margin: 10px 20px 5px 10px;
  }
}
</style>

