<template>
  <div class="web-wrapper">
    <!-- https://www.pojun-tech.cn/wxcustomer/index?cId=3&phone= -->
    <web-view :src="url" @message="getMessage" @load="loaded" @error="loadFail"></web-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      url: "", //http://localhost/wxcustomer/index
      isLoad: false
      // IsAuthorize: false
    };
  },
  created() {
    // let that = this;
    // TODO: 从本地缓存中获取手机号
    // 把缓存中的手机号放到全局变量
    // wx.getStorage({
    //   key: "phone",
    //   success(res) {
    //     that.globalData.phone = res.data;
    //   }
    // });
    
    // if(!this.globalData.phone) {
    //   this.IsAuthorize();
    // }
  },
  onShow() {
    let that = this;
    wx.getStorage({
      key: "loginSH",
      success(res) {
        that.globalData.loginSH = res.data;
        console.log(that.globalData.loginSH);
        // if (!that.url && that.globalData.loginSH != 'true') {
          // that.url = "http://192.168.1.115/loginPage";
        // } else {
        console.log('getStorage:success')
        that.url = "http://192.168.1.115/wxcustomer/index"
        // }
      },
      fail() {
        console.log('getStorage:fail')
        that.url = "http://192.168.1.115/loginPage";
      }
    });

    // console.log(this.globalData.phone);
    // if (!this.url) {
    //   this.url = "http://192.168.1.115/loginPage";
    // }
    // if(this.url.indexOf('wxcustomer') > 0) {
    //   this.IsAuthorize();
    // }
    // this.url = "http://192.168.1.115/wxcustomer/index?phone=" + this.globalData.phone;
    console.log(this.url);
  },
  methods: {
    // 网页加载完成
    loaded() {
      console.log("web-view加载成功");
      this.isLoad = true;
    },
    loadFail() {
      console.log("web-view加载失败");
    },
    IsAuthorize() {
      // 缓存中有手机号代表已授权
      if (!this.globalData.phone) {
        mpvue.navigateTo({
          url: "../authorize/main"
        });
      } else {
        // this.IsAuthorize = true;
      }
    },
    getMessage(e) {
      console.log('getMessage:外')
      console.log(e.target.data[0].login)
      if (e.target.data[0].login) {
        console.log('getMessage:内')
        wx.setStorage({
          key: "loginSH",
          data: "true"
        });
        this.url = "http://192.168.1.115/wxcustomer/index";
      }
    }
  }
};
</script>

<style>
</style>
