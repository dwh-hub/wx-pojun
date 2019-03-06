<template>
  <div id="memberComes">
    <div class="title">
      <div class="title_img">
        <img
          id="company_imgs"
          alt
          src="https://www.pojun-tech.com/images/company_log/3/1.5355962923289521E12.png"
        >
      </div>
      <p id="company_titles"></p>
      <div class="hello">
        <span>第一次使用，请绑定您的会籍信息</span>
      </div>
      <div class="boundDiv">
        <span class="pl">手机号</span>
        <input class="pl" type="text" maxlength="11" placeholder="请输入手机号" id="boundPhone">
        <button class="pr" id="yz_btn">获取验证码</button>
      </div>
      <div class="boundDiv">
        <input class type="text" placeholder="请输入验证码" id="codeText">
      </div>
      <span class="showTooltips" id="showTooltips">绑定</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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
.pb {
  clear: both;
}
#memberComes {
  .title {
    .title_img {
      margin-top: 30px;
      #company_imgs {
        width: 65px;
        height: 65px;
        border-radius: 5px;
        border: 1px solid #eeeeee;
        display: block;
        margin: auto;
      }
    }
    #company_titles {
      width: 100%;
      text-align: center;
      margin-top: 10px;
    }
    .hello {
      padding: 10px 15px;
      border-bottom: 1px solid #eeeeee;
      > span {
        display: block;
        width: 100%;
        text-align: center;
        height: 36px;
        line-height: 36px;
        background: #98caff;
        color: white;
        border-radius: 20px;
        margin-top: 20px;
      }
    }
    .boundDiv {
      height: 46px;
      width: 100%;
      border-bottom: 1px solid #eeeeee;
      > span {
        display: block;
        width: 20%;
        height: 45px;
        line-height: 45px;
        padding-left: 15px;
      }
      > input {
        height: 45px;
        line-height: 45px;
        padding-left: 15px;
        border: none;
        background: initial;
      }
      #yz_btn {
        width: 30%;
        padding: 0;
        height: 49px;
        border-left: 1px solid #e5e5e5;
        background: white;
        line-height: 46px;
        font-size: 17px;
        color: #3cc51f;
      }
    }
    .showTooltips {
      background-color: #1aad19;
      display: block;
      width: 90%;
      margin: auto;
      text-align: center;
      height: 45px;
      line-height: 45px;
      color: white;
      border-radius: 5px;
      margin-top: 15px;
    }
  }
}
</style>


