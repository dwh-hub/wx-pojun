<template>
  <div class="base-info">
    <van-cell-group custom-class="van-cell-group">
      <van-cell title="昵称" :value="userInfo.userName" is-link/>
      <van-cell title="性别" :value="userInfo.sex" is-link @click="sexCell()"/>
      <van-cell title="手机号" :value="userInfo.phone" is-link/>
      <van-cell title="出生日期" :value="userInfo.birthTime || '未填写'" is-link/>
      <!-- <van-cell title="身份证号" :value="userInfo.idCardNum || '未填写'"/> -->
    </van-cell-group>
    <van-action-sheet
      :show="showSex"
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
      id: 0,
      showSex: false,
      sexAction: [
        {
          name: "男"
        },
        {
          name: "女"
        }
      ]
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      if (options.type && options.type == "oneself") {
        this.userInfo = wx.getStorageSync("staff_info");
        this.userInfo.sex = this.userInfo.sex == 0 ? "未知" : (this.userInfo.sex == 1 ? "男" : "女");
      } else {
        this.getDetail();
      }
      
    }
  },
  mounted() {
    setNavTab();
  },
  methods: {
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
