<template>
  <div class="authorize">
    <div class="logo-wrapper">
      <image src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png" mode="widthFix"></image>
    </div>
    <p>请完成微信授权以继续使用</p>
    <button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权微信用户信息</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openid: "",
      session_key: ""
    };
  },
  mounted() {
    // this.login();
  },
  methods: {
    getPhoneNumber(e) {
      console.log(e);
      console.log(e.target.errMsg);
      console.log(e.target.iv);
      console.log(e.target.encryptedData);
      if(e.target.errMsg.indexOf('ok') > 0) {
        console.log("回调成功")
        this.globalData.phone = '13010265489'
        wx.setStorage({
          key: 'phone',
          data: '13010265489'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: "../webInline/main"
          })
        }, 200)
        // wx.navigateBack({
        //   delta: 1
        // })
      }
      return
      let that = this;
      // mpvue.checkSession({
      //   success() {
      //     mpvue.request({
      //       url: "",
      //       data: {
      //         encryptedData: e.target.encryptedData,
      //         iv: e.target.iv,
      //         sessionKey: that.session_key
      //       },
      //       methods: "GET",
      //       success(res) {
      //         console.log("获取手机号码成功");
      //         console.log(res);
      //       }
      //     });
      //   },
      //   fail() {
          mpvue.login({
            success(res) {
              if (res.code) {
                mpvue.request({
                  url: "",
                  data: {
                    code: res.code
                  },
                  methods: "POST",
                  success(response) {
                    that.openid = response.data.openid;
                    that.session_key = response.data.session_key;
                    mpvue.request({
                      url: "",
                      data: {
                        encryptedData: e.target.encryptedData,
                        iv: e.target.iv,
                        sessionKey: that.session_key
                      },
                      method: "GET",
                      success: function(res) {
                        // TODO: 把手机号存在全局和本地缓存中
                        // wx.setStorage({
                        //   key: 'phone',
                        //   data: ''
                        // })
                        // this.globalData.phone = ''
                        console.log("获取手机号码成功");
                        console.log(res);
                      }
                    });
                  }
                });
              } else {
                console.log("登录失败！" + res.errMsg);
              }
            }
          });
      //   }
      // });
    },
    // login() {
    //   mpvue.login({
    //     success(res) {
    //       console.log(res);
    //       if (res.code) {
    //         mpvue.request({
    //           url: "",
    //           data: {
    //             code: res.code
    //           },
    //           methods: "POST",
    //           success(response) {
    //             that.openid = response.data.openid;
    //             that.session_key = response.data.session_key;
    //           }
    //         });
    //       } else {
    //         console.log("登录失败！" + res.errMsg);
    //       }
    //     }
    //   });
    // }
  }
};
</script>

<style lang="less">
.authorize {
  text-align: center;
  padding: 0 20px;
  padding-top: 100px;
  .logo-wrapper {
    text-align: center;
    > image {
      width: 50%;
    }
  }
  >p {
    color: #5e729a;
    font-size: 15px;
    line-height: 48px;
  }
}
</style>
