<template>
  <div class="base-info">
    <van-cell-group custom-class="van-cell-group">
      <van-cell
        title="昵称"
        :value="userInfo.userName"
        is-link
        @click="toInfoCell('userName',userInfo.userName)"
      />
      <van-cell title="性别" :value="userInfo.sex" is-link @click="type == 'oneself' ? showSex = true : ''"/>
      <!-- @click="toInfoCell('sex',userInfo.sex)" -->
      <van-cell
        title="手机号"
        :value="userInfo.phone"
        is-link
        @click="toInfoCell('phone',userInfo.phone)"
      />
      <!-- <van-cell title="出生日期" :value="userInfo.birthTime || '未填写'" is-link @click="toInfoCell('birthTime',userInfo.birthTime)"/> -->
      <!-- <van-cell
        title="身份证号"
        :value="userInfo.idCardNum || '未填写'"
        @click="toInfoCell('idCardNum',userInfo.idCardNum)"
      />-->
    </van-cell-group>
    <van-action-sheet
      :show="showSex"
      title="请选择修改后的性别"
      :actions="sexAction"
      @close="showSex = false"
      @select="selectSex"
    />
  </div>
</template>


<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
export default {
  data() {
    return {
      userInfo: {},
      type: "",
      id: 0,
      showSex: false,
      sexAction: [
        {
          name: "男",
          id: 1
        },
        {
          name: "女",
          id: 2
        }
      ]
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.type = options.type || "";
    }
  },
  onShow() {
    this.mergeDetail();
  },
  mounted() {
    setNavTab();
  },
  methods: {
    mergeDetail() {
      if (this.type && this.type == "oneself") {
        this.getStaffInfo();
      } else {
        this.getDetail();
      }
    },
    toInfoCell(type, text) {
      if (this.type !== "oneself") {
        return;
      }
      wx.navigateTo({
        url: `../modify_cell/main?type=${type}&text=${text}`
      });
    },
    getDetail() {
      let that = this;
      HttpRequest({
        url: window.api + "/customer/archives/detail",
        data: {
          customerId: that.id
        },
        success: function(res) {
          if (res.data.code == 200) {
            let data = res.data.data;
            that.userInfo = {
              userName: data.nickName || data.name || "昵称",
              sex:
                data.sex == 0 ? "未填写" : that.userInfo.sex == 1 ? "男" : "女",
              phone: data.phone || "未填写",
              birthTime: data.birthTime || "未填写"
              // idCardNum: data.idCardNum || "未填写"
            };
          }
        }
      });
    },
    getStaffInfo() {
      this.userInfo = wx.getStorageSync("staff_info");
      if (escape(this.userInfo.sex).indexOf("%u") < 0) {
        this.userInfo.sex =
          this.userInfo.sex == 0
            ? "未知"
            : this.userInfo.sex == 1
              ? "男"
              : "女";
      }
      // let that = this;
      // HttpRequest({
      //   url: window.api + "/user/detail/own",
      //   success(res) {
      //     let data = res.data.data;
      //     that.userInfo = {
      //       userName: data.name,
      //       sex: data.sex == 0 ? "未填写" : data.sex == 1 ? "男" : "女",
      //       phone: data.phone
      //       // idCardNum: ""
      //     };
      //     // wx.setStorageSync("staff_info", res.data.data);
      //   }
      // });
    },
    selectSex(event) {
      if (this.type == "oneself") {
        return;
      }
      this.userInfo.sex = event.mp.detail.id == 1 ? "男" : "女";
      this.showSex = false;
      let that = this;
      HttpRequest({
        url: "/employee/file/modify/userInfo",
        data: {
          userId: that.userInfo.userId,
          sex: that.userInfo.sex
        },
        success(res) {
          if (res.data.code === 200) {
            wx.showToast({
              title: "修改成功",
              icon: "none",
              duration: 1000
            });
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
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
</style>
