<template>
  <div class="customer_register" :class="{'safe-bottom': isIphoneX}">
    <div class="notice-bar">
      <van-icon name="warning-o" color="#119bf0"/>
      <div class="notice">请输入客户手机号，按提示填写客户信息，*必填</div>
      <!-- <van-icon name="cross" color="#f95d51"/> -->
    </div>
    <div class="check-in-block shadow-block-item">
      <div class="input-cell-wrapper">
        <div class="cell-value">登记门店</div>
        <div
          class="cell-content"
          @click="showAction = true;actionList = storeActions;"
        >{{selectedStore.storeName}}</div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value must-input">手机号码</div>
        <div class="cell-content">
          <input
            class="cell-input"
            type="number"
            maxlength="11"
            @input="checkPhone"
            v-model="phone"
            placeholder="请输入手机号"
            placeholder-class="placeholder"
          />
        </div>
      </div>
    </div>

    <div class="reminder" v-if="phoneType == 200">
      <span>
        <span class="customer-name">{{customerInfo.name}}</span>
        于{{customerInfo.addTime}}在{{selectedStore.storeName}}登记过
      </span>
    </div>

    <div class="register-content shadow-block-item" v-if="phoneType == 201 || phoneType == '202-1'">
      <div class="input-cell-wrapper">
        <div class="cell-value must-input">姓名</div>
        <div class="cell-content">
          <input
            class="cell-input"
            type="text"
            :disabled="phoneType == '202-1'"
            v-model="name"
            placeholder="请输入客户姓名"
            placeholder-class="placeholder"
          />
        </div>
      </div>
      <div class="input-cell-wrapper" v-if="phoneType == 201">
        <div class="cell-value must-input">性别</div>
        <!-- <div class="cell-content">
          <radio-group class="radio-group" @change="onChangeSex">
            <radio value="1" :color="themeColor" :checked="sex == 1" />
            <span class="radio-span">男</span>
            <radio value="2" :color="themeColor" :checked="sex == 2" />
            <span class="radio-span">女</span>
          </radio-group>
        </div> -->
        <div class="cell-content" @click="showAction = true;actionList = sexList;">
          <input
            class="cell-input"
            type="text"
            :value="sex ? sexList[sex-1].name : ''"
            placeholder="请选择客户性别"
            placeholder-class="placeholder"
            disabled
          />
        </div>
        <van-icon name="arrow" color="#999" v-if="!sex"/>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value must-input">服务销售</div>
        <div class="cell-content" @click="showAction = true;actionList = saleListAction;positionType=0">
          <input
            class="cell-input"
            type="text"
            :value="selectedSale.userName"
            placeholder="请选择服务销售"
            placeholder-class="placeholder"
            disabled
          />
        </div>
        <van-icon name="arrow" color="#999" v-if="!selectedSale.userName"/>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">服务教练</div>
        <div class="cell-content" @click="showAction = true;actionList = coachListAction;positionType=1">
          <input
            class="cell-input"
            type="text"
            :value="selectedCoach.userName"
            placeholder="请选择服务教练"
            placeholder-class="placeholder"
            disabled
          />
        </div>
        <van-icon name="arrow" color="#999" v-if="!selectedCoach.userName"/>
      </div>
      <div v-show="phoneType == 201">
        <div class="input-cell-wrapper">
          <div class="cell-value">客户来源</div>
          <div class="cell-content" @click="showAction = true;actionList = sourceList;">
            <input
              class="cell-input"
              type="text"
              :value="source ? sourceList[source-1].name : ''"
              placeholder="请选择客户来源"
              placeholder-class="placeholder"
              disabled
            />
          </div>
          <van-icon name="arrow" color="#999" v-if="!source"/>
        </div>
        <!-- <div class="input-cell-wrapper">
          <radio-group class="radio-group" @change="selectSource">
            <label class="radio" v-for="(item, index) in sourceList" :key="index">
              <radio :color="themeColor" :value="item.value" />
              <span class="radio-span">{{item.name}}</span>
            </label>
          </radio-group>
        </div> -->
        <div class="input-cell-wrapper">
          <div class="cell-value">身份证</div>
          <div class="cell-content">
            <input
              class="cell-input"
              type="text"
              v-model="idCard"
              placeholder="请输入身份证号"
              placeholder-class="placeholder"
            />
          </div>
        </div>
        <div class="input-cell-wrapper">
          <div class="cell-value">居住地</div>
          <div class="cell-content">
            <input
              class="cell-input"
              type="text"
              v-model="address"
              placeholder="请输入居住地址"
              placeholder-class="placeholder"
            />
          </div>
        </div>
        <div class="input-cell-wrapper">
          <div class="cell-value">客户星级</div>
          <div class="cell-content">
            <van-rate :value="rateValue" @change="onChangeRate" />
          </div>
        </div>
        <div class="input-cell-wrapper">
          <div class="cell-value">健身历史</div>
          <div class="cell-content" @click="showAction = true;actionList = fitness;">
            <input
              class="cell-input"
              type="text"
              :value="fitness[isFitness].name"
              placeholder="请选择健身历史"
              placeholder-class="placeholder"
              disabled
            />
          </div>
          <!-- <div class="cell-content">
            <radio-group class="radio-group" @change="onChangeFitness">
              <radio value="1" :color="themeColor" :checked="isFitness == 1" />
              <span class="radio-span">有</span>
              <radio value="0" :color="themeColor" />
              <span class="radio-span">无</span>
            </radio-group>
          </div> -->
        </div>
        <div class="input-cell-wrapper">
          <div class="cell-value">健身目的</div>
          <div class="cell-content">
            <checkbox-group @change="selectPurpose">
              <checkbox value="1" :color="themeColor" />
              <span class="check-span">减肥</span>
              <checkbox value="2" :color="themeColor" />
              <span class="check-span">塑性</span>
              <checkbox value="3" :color="themeColor" />
              <span class="check-span">增肌</span>
              <checkbox value="4" :color="themeColor" />
              <span class="check-span">其他</span>
            </checkbox-group>
          </div>
        </div>
        <div class="input-cell-wrapper">
          <div class="cell-value">喜好</div>
          <div class="cell-content">
            <checkbox-group @change="selectInterest">
              <checkbox value="1" :color="themeColor" />
              <span class="check-span">课程</span>
              <checkbox value="2" :color="themeColor" />
              <span class="check-span">器械</span>
            </checkbox-group>
          </div>
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">跟进记录</div>
      </div>
      <div class="textarea-wrapper">
        <textarea
          v-show="!showPopup"
          v-model="followUpContent"
          placeholder="备注不能超过120字"
          maxlength="120"
          placeholder-style="placeholder"
        />
      </div>
      <div class="quick-tip-wrapper">
        <div
          class="quick-tip-item"
          v-for="(item, index) in quickTipList"
          :key="index"
          @click="addTip(item)"
        >{{item}}</div>
      </div>
      <div class="register" :style="{'background-color': themeColor}" @click="registerCustomer">确定</div>
    </div>

    <van-popup
      :show="showPopup"
      @close="showPopup = false"
      :duration="200"
      custom-style="width:90%;border-radius: 5px;"
    >
      <div class="success-popup">
        <div class="success-tip">客户录入成功！请选择下一步操作</div>
        <div class="btn-group">
          <div class="success-btn" @click="toCustomerDetail">查看客户</div>
          <div class="success-btn" @click="alignRegister">继续录入</div>
          <div class="success-btn" @click="toNav('../pay_card/main')" v-if="isCanPay">前往开单</div>
          <div class="success-btn" @click="toNav('../workbench/main')">返回首页</div>
        </div>
      </div>
    </van-popup>

    <van-action-sheet
      :show="showAction"
      :actions="actionList"
      :safe-area-inset-bottom="false"
      @close="showAction = false"
      @select="selectAction"
    ></van-action-sheet>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
import store from "@/utils/store.js";
import { checkAuth } from "../common/js/service_config.js";
import { getUserofrole } from "../common/js/http.js";
export default {
  data() {
    return {
      actionList: [],
      storeActions: [],
      storeList: [],
      coachListAction: [],
      saleListAction: [],
      selectedStore: {},
      showAction: false,
      showPopup: false,
      phone: "",
      customerInfo: {},
      positionType: 0,
      quickTipList: [
        "要优惠",
        "挂断电话",
        "被拉黑一直提示通话中",
        "学瑜伽",
        "觉得价格贵",
        "没有意向，终止跟进",
        "没有空",
        "没人接",
        "在出差",
        "为家人办卡",
        "已交预售定金",
        "其他会所会员",
        "嫌卡价太贵",
        "说不要打了",
        "不喜欢健身",
        "对私教有兴趣"
      ],
      sexList: [
        {
          name: '男',
          action: () => { this.sex = 1 }
        },
        {
          name: '女',
          action: () => { this.sex = 2 }
        }
      ],
      sourceList: [
        {
          name: "AS邀约到场",
          value: 1,
          action: () => { this.source = 1 }
        },
        {
          name: "BR会员转介",
          value: 2,
          action: () => { this.source = 2 }
        },
        {
          name: "DI发单潜在",
          value: 3,
          action: () => { this.source = 3 }
        },
        {
          name: "WI轮排到访",
          value: 4,
          action: () => { this.source = 4 }
        },
        {
          name: "GP单页到访",
          value: 5,
          action: () => { this.source = 5 }
        },
        {
          name: "TI电话咨询",
          value: 6,
          action: () => { this.source = 6 }
        },
        {
          name: "其他",
          value: 7,
          action: () => { this.source = 7 }
        }
      ],
      fitness: [
        {
          name: '无',
          action: () => { this.isFitness = 0}
        },
        {
          name: '有',
          action: () => { this.isFitness = 1}
        }
      ],
      name: "", // 姓名
      sex: 0, // 性别
      idCard: "", // 身份证号
      selectedSale: {}, // 选择的服务销售
      selectedCoach: {}, // 选择的服务教练
      address: "", // 居住地址
      rateValue: 0, // 星级
      isFitness: 0, // 是否健身过
      FitnessPurpose: [], // 健身目的 1 减肥 2 塑性 3 增肌 4 其他
      interest: [], // 喜好
      source: '', // 客户来源
      followUpContent: "",
      phoneType: 0, // 200 客户信息已存在 201 正常录入 202 客户在其他门店有录入 405 在公海中
      successCustomerId: 0,
      customerId: "", // 已存在的客户id
      isCanPay: false,
      isIphoneX: store.state.isIphoneX
    };
  },
  mixins: [colorMixin],
  onLoad() {
    Object.assign(this.$data, this.$options.data());
    this.isCanPay = checkAuth(346)
    setNavTab();
    let allStore = store.state.allStore.map(e => {
      e.name = e.storeName;
      return e;
    });
    this.storeList = allStore.filter(e => e.storeId);
    this.storeActions = this.storeList;
    this.selectedStore =
      this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this.actionList = this.storeActions;
  },
  methods: {
    selectAction(e) {
      if (e.mp.detail.action) {
        e.mp.detail.action()
      } else if (e.mp.detail.storeName) {
        this.phoneType = 0;
        this.phone = "";
        this.selectedStore = e.mp.detail;
      } else if (this.positionType == 1) {
        this.selectedCoach = e.mp.detail;
      } else if (this.positionType == 0) {
        this.selectedSale = e.mp.detail;
      }
      this.showAction = false;
    },
    // 校验手机号
    checkPhone(e) {
      this.phone = e.mp.detail.value.replace(/\s+/g,"");
      if (e.mp.detail.value.length != 11) {
        this.phoneType = 0;
      }
      if (e.mp.detail.value.length == 11) {
        let that = this;
        this.phoneType = 0;
        wx.showLoading({
          title: "校验手机号.."
        });
        HttpRequest({
          url: "/customer/register/latent/queryphone2",
          data: {
            phone: e.mp.detail.value,
            storeId: that.selectedStore.storeId
          },
          success(res) {
            wx.hideLoading();
            that.phoneType = res.data.code;
            that.customerInfo = res.data.data;
            if (res.data.code == 200) {
            } else if (res.data.code == 201) {
              that.getServiceCoachList();
              that.getServiceSaleList();
            } else if (res.data.code == 202) {
              let info = res.data.data;
              wx.showModal({
                title: "提示",
                content: `该客户于${that.customerInfo.addTime}在${
                  that.customerInfo.storeName
                }登记过，是否继续添加到${that.selectedStore.storeName}？`,
                success(res) {
                  if (res.confirm) {
                    that.phoneType = "202-1";
                    // 回显信息
                    that.name = info.name;
                    that.customerId = info.id;
                    that.getServiceCoachList();
                    that.getServiceSaleList();
                  }
                }
              });
            } else if (res.data.code == 405) {
              wx.showModal({
                title: "提示",
                content: "该客户已经存在公海中，是否认领",
                success(res) {
                  if (res.confirm) {
                    that.claim();
                  }
                }
              });
            }
            console.log("that.phoneType:" + that.phoneType);
          }
        });
      }
    },
    // 认领
    claim() {
      let that = this;
      HttpRequest({
        url: "/customer/public/claim",
        data: {
          customerIdArray: that.customerInfo.id,
          storeId: that.selectedStore.storeId
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message
            });
          }
        }
      });
    },
    // 服务销售
    getServiceSaleList() {
      let curSaleId = wx.getStorageSync("staff_info").userId
      getUserofrole(this.selectedStore.storeId, 0).then((data) => {
        this.saleListAction = data.map(e => {
          e.name = e.userName;
          return e;
        });
        this.saleListAction.forEach(e => {
          if(e.userId == curSaleId) {
            this.selectedSale = e
          }
        })
      })
    },
    // 服务教练
    getServiceCoachList() {
      getUserofrole(this.selectedStore.storeId, 1).then((data) => {
        this.coachListAction = data.map(e => {
          e.name = e.userName;
          return e;
        });
      })
      // let that = this;
      // HttpRequest({
      //   url: "/customer/register/userofrole",
      //   data: {
      //     storeId: that.selectedStore.storeId,
      //     positionType: 1
      //   },
      //   success(res) {
      //     if (res.data.code == 200) {
      //       that.coachListAction = res.data.data.map(e => {
      //         e.name = e.userName;
      //         return e;
      //       });
      //     }
      //   }
      // });
    },
    onChangeSex(e) {
      this.sex = e.mp.detail.value;
    },
    onChangeRate(e) {
      this.rateValue = e.mp.detail;
    },
    onChangeFitness(e) {
      this.isFitness = e.mp.detail.value;
    },
    selectPurpose(e) {
      this.FitnessPurpose = e.mp.detail.value;
    },
    selectSource(e) {
      this.source = e.mp.detail.value;
    },
    selectInterest(e) {
      this.interest = e.mp.detail.value;
    },
    addTip(item) {
      if (this.followUpContent.indexOf(item) > -1) {
        return (this.followUpContent = this.followUpContent.replace(
          new RegExp(` ${item} `, "g"),
          ""
        ));
      }
      this.followUpContent += ` ${item} `;
    },
    // 校验身份证号
    checkIdCard() {
      let that = this;
      return new Promise(resolve => {
        if (!that.idCard) {
          return resolve();
        }
        HttpRequest({
          url: "/customer/register/latent/identityCard",
          data: {
            identityCard: that.idCard
          },
          success(res) {
            if (res.data.code == 200) {
              resolve();
            } else {
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 1000
              });
            }
          }
        });
      });
    },
    // 添加客户
    registerCustomerMethod() {
      let that = this;
      return new Promise(resolve => {
        HttpRequest({
          url: "/customer/register/latent/savecustomer",
          data: {
            identityCard: that.idCard,
            serviceCoachId: that.selectedCoach.userId || "",
            phone: that.phone,
            storeId: that.selectedStore.storeId,
            addUserId: that.selectedSale.userId,//wx.getStorageSync("staff_info").userId,
            remarks: that.followUpContent,
            starLevel: that.rateValue,
            isFitness: that.isFitness,
            source: that.source,
            name: that.name,
            sex: that.sex,
            interest: String(that.interest),
            purpose: String(that.FitnessPurpose)
            // isSubscriptionPact: 0,
          },
          success(res) {
            if (res.data.code == 200) {
              resolve(res);
            } else {
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 1000
              });
            }
          }
        });
      });
    },
    // 添加已存在其他门店的客户
    registerCustomer_2() {
      let that = this;
      return new Promise(resolve => {
        HttpRequest({
          url: "/customer/store/add",
          data: {
            customerId: that.customerId,
            storeId: that.selectedStore.storeId,
            addUserId: that.selectedSale.userId,//wx.getStorageSync("staff_info").userId,
            serviceUserId: that.selectedSale.userId,//wx.getStorageSync("staff_info").userId,
            serviceCoachId: that.selectedCoach.userId || "",
            phone: that.phone
          },
          success(res) {
            if (res.data.code == 200) {
              resolve(res);
            } else {
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 1000
              });
            }
          }
        });
      });
    },
    // 登记用户按钮
    registerCustomer() {
      if (this.phoneType == 201) {
        if (!this.name) {
          return wx.showToast({
            title: "请输入姓名",
            icon: "none",
            duration: 1000
          });
        }
        if (!this.sex) {
          return wx.showToast({
            title: "请选择性别",
            icon: "none",
            duration: 1000
          });
        }
        if (this.idCard && this.idCard.length != 18) {
          return wx.showToast({
            title: "身份证号格式不正确",
            icon: "none",
            duration: 1000
          });
        }
      }
      this.checkIdCard().then(() => {
        if (this.phoneType == "202-1") {
          this.registerCustomer_2().then(data => {
            this.successCustomerId = data.data.data;
            this.showPopup = true;
          });
        } else {
          this.registerCustomerMethod().then(data => {
            this.successCustomerId = data.data.data;
            this.showPopup = true;
          });
        }
      });
    },
    toCustomerDetail() {
      wx.redirectTo({
        url: "../customer_detail/main?id=" + this.successCustomerId
      });
    },
    alignRegister() {
      Object.assign(this.$data, this.$options.data());
      wx.redirectTo({
        url: "./main"
      });
    },
    toNav(url) {
      wx.redirectTo({
        url: url
      });
    }
  }
};
</script>

<style lang="less">
@import "~COMMON/less/common.less";
@import "../common/less/form.less";
page {
  background-color: #f4f5f6;
}
.customer_register {
  .register-content {
    .textarea-wrapper {
      > textarea {
        height: 130px;
        width: 92%;
        margin: 0 auto;
        padding: 5px;
        border: 1rpx solid #eee;
      }
    }
    .placeholder {
      color: #999;
    }
    .quick-tip-wrapper {
      padding: 15px;
      .quick-tip-item {
        display: inline-block;
        padding: 4px 6px;
        margin-bottom: 8px;
        margin-right: 5px;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        background-color: #5db2ff;
      }
    }
    .register {
      color: #fff;
      text-align: center;
      line-height: 42px;
    }
  }
  .check-in-block {
    margin-top: 0px;
  }
  .success-popup {
    padding: 15px;
    .success-tip {
      font-size: 16px;
    }
    .btn-group {
      margin-top: 50px;
      .success-btn {
        display: inline-block;
        padding: 4px 6px;
        border-radius: 4px;
        margin-right: 5px;
        line-height: 22px;
        text-align: center;
        border: 1rpx solid #ccc;
      }
    }
  }
  .reminder {
    width: 90vw;
    margin: 0 auto;
    margin-top: 5%;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 1px 0px 6px #c6c6c6;
    .customer-name {
      color: #2f90f1;
    }
  }
}
</style>
