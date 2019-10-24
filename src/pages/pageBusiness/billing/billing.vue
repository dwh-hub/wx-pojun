<template>
  <div class="billing" :class="{'isPhoneX-wrap': isIphoneX}">
    <!-- <div class="store-wrapper input-cell-wrapper">
      <div>门店</div>
      <div
        class="store-content"
        @click="showStoreList = true"
      >{{selectedStore.storeName}}</div>
    </div> -->
    <div class="billing-header">
      <div class="subtitle">
        <img class="screening-icon" src="/static/images/staff/title-icon.svg">
        <span class="subtitle-text">{{billingText}}</span>
      </div>
      <div class="store" @click="showStoreList = true">当前门店：{{selectedStore.storeName}}</div>
    </div>

    <div class="search-wrapper" v-if="showSearch">
      <div class="phone-search-wrapper input-cell-wrapper">
        <input type="text" placeholder="输入名字、手机号搜索" @input="searchInput" v-model="condition">
        <div class="add-customer" @click="toAddCustomer">添加会员</div>
      </div>
      <div class="tip">请选择需要办理的客户</div>
      <!-- <filter-nav :nav="nav"></filter-nav> -->
      <div class="search-list">
        <staff-coach-item v-for="(item, index) in searchCustomerList" :key="index" :info="item" @clickItem="selectCustomer(item)"></staff-coach-item>
        <van-loading color="#999" custom-class="loading" v-if="searching"/>
        <none-result text="暂无搜索的用户" v-if="isNothingCustomer"></none-result>
      </div>
    </div>

    <div class="bulling-content" v-if="!showSearch">
      <div class="customer-info shadow-block-item" v-if="showCustomerInfo">
        <div class="customer-card-tip">会员购卡信息</div>
        <user-item-s :info="selectedCustomer" @iconevent="delCurSelect">
          <van-icon name="cross" color="#f95d51"/>
        </user-item-s>
        <!-- <div class="cover"><image mode="aspectFill" :src="selectedCustomer.headImgPath || ''"></image></div>
        <div class="customer-middle">
          <div><span>{{selectedCustomer.name}}</span><span class="verify" :class="selectedCustomer.colorClass">{{selectedCustomer.phoneVerifyText}}</span></div>
          <div>性别：{{selectedCustomer.sex}}</div>
          <div>{{selectedCustomer.phone}}</div>
        </div>
        <img src="/static/images/staff/delete.png" class="del" @click="delCurSelect"> -->
      </div>

      <div class="verify-wrapper" v-if="showVerify">
        <div class="verify-phone">
          <span class="verify-text">验证码</span>
          <input type="text" placeholder="请输入验证码" v-model="verifyCode" @input="inputVerifyCode">
        </div>
        <div class="verify-btn-wrapper">
          <div class="verify send-v" v-show="isSend">{{"已发送("+CDTime+"s)" }}</div>
          <div class="verify note-v" @click="sendCode" v-show="!isSend">短信验证</div>
          <div class="verify phone-v" @click="phoneVerify">电话验证</div>
          <div class="verify none-v" @click="showVerify = false;showCardForm = true">未验证</div>
        </div>
      </div>

      <div class="card-form shadow-block-item" v-show="showCardForm">
        <div class="subtitle" style="border-bottom: 1rpx solid #eee;" v-if="billingType != 4">
          <img class="screening-icon" src="/static/images/staff/title-icon.svg">
          <span class="subtitle-text">选择要购买的卡种</span>
          <span class="more-set" @click="toMore" v-if="billingType != 4">更多设置选项</span>
        </div>
        <div class="input-cell-wrapper" v-if="billingType != 4">
          <div class="cell-value must-input">办卡卡种</div>
          <div class="cell-content">
            <input
              class="cell-input"
              disabled
              v-model="selectedCard.first_1"
              @click="showCardList = true"
              placeholder="请选择卡种"
              placeholder-class="placeholder"
            />
          </div>
        </div>
        <div v-show="isSelectCard">
          <div class="input-cell-wrapper">
            <div class="cell-value">办理时间</div>
            <div class="cell-content" @click="isPickerShow = true">
              {{date}}
            </div>
          </div>
          <div class="input-cell-wrapper">
            <div class="cell-value must-input">合同编号</div>
            <div class="cell-content">
              <input
                class="cell-input"
                v-model="pactId"
                placeholder="请输入合同编号"
                placeholder-class="placeholder"
              />
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="billingType != 4">
            <div class="cell-value">合同标签</div>
            <div class="cell-content">
                <!-- @click="actionsList = cardLabelList;showActionsList = true;actionType='label'" -->
              <input
                class="cell-input"
                disabled
                :value="selectedLableName"
                @click="selectLabel"
                :placeholder="cardLabelList.length? '请选择合同标签' : '无可用合同标签'"
                placeholder-class="placeholder"
              />
            </div>
          </div>
          <div class="input-cell-wrapper">
            <div class="cell-value">办理销售</div>
            <div class="cell-content">
              <input
                class="cell-input"
                disabled
                v-model="selectedSale.userName"
                @click="showSaleList = true;actionType='sale'"
                placeholder="请选择办理销售"
                placeholder-class="placeholder"
              />
            </div>
          </div>
          <div class="input-cell-wrapper">
            <div class="cell-value">合同来源</div>
            <div class="cell-content">
              <input
                class="cell-input"
                disabled
                v-model="selectedSource.name"
                @click="selectSource"
                placeholder="请选择合同来源"
                placeholder-class="placeholder"
              />
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="billingType == 4">
            <div class="cell-content">
              <radio-group class="radio-group" @change="onCanpayment">
                <radio value="1" :color="themeColor" :checked="canpayment == 1" />
                <span class="radio-span">可退定金</span>
                <radio value="0" :color="themeColor" :checked="canpayment == 0" />
                <span class="radio-span">不可退定金</span>
              </radio-group>
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="billingType == 4">
            <div class="cell-value must-input">付款金额</div>
            <div class="cell-content">
              <input
                class="cell-input"
                v-model="depositSellingPrice"
                placeholder="请输入付款金额"
                placeholder-class="placeholder"
              />
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="billingType == 2 || billingType == 3">
            <div class="cell-value">上课教练</div>
            <div class="cell-content">
              <input
                class="cell-input"
                disabled
                v-model="selectedCoach.name"
                @click="actionsList = coachList;showActionsList = true;actionType='coach'"
                placeholder="请选择上课教练"
                placeholder-class="placeholder"
              />
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="billingType != 4">
            <div class="cell-value must-input">{{selectedCard.cellValue}}(可修改)</div>
            <div class="cell-content">
              <input
                class="cell-input cell-input-short"
                type="number"
                @input="changeDayPeriodOfValidity"
                :placeholder="selectedCard.buyAuthorityText || ''"
                v-model="selectedCard.buyAuthority"
              />
              <div>{{selectedCard.unit}}</div>
              <!-- <div class="modify-text">可修改</div> -->
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="billingType != 4">
            <div class="cell-value must-input">会员卡总价({{(curCardSet.canModifyPrice == 1 && curCardSet.modifiableMinValue==0)?'不可修改':'可修改'}})</div>
            <div class="cell-content">
              <input
                class="cell-input cell-input-short"
                @input="inputSalePrice"
                type="number"
                :placeholder="selectedCard.salePriceText || ''"
                :disabled="curCardSet.canModifyPrice == 1 && curCardSet.modifiableMinValue==0"
                v-model="selectedCard.salePrice"
              />
              <div>元</div>
              <!-- <div class="modify-text">{{(curCardSet.canModifyPrice == 1 && curCardSet.modifiableMinValue==0)?'不可修改':'可修改'}}</div> -->
            </div>
          </div>
          <div class="limt-cell" v-if="isShowSalePriceTip">会员卡单价的范围是{{constCardInfo.salePrice - 20}}-{{constCardInfo.salePrice+20}}</div>
          <div class="input-cell-wrapper" v-if="billingType != 4">
            <div class="cell-value must-input">赠送{{selectedCard.cellValue}}(可修改)</div>
            <div class="cell-content">
              <input
                class="cell-input cell-input-short"
                type="number"
                @input="inputGifHit"
                :placeholder="curCardSet.giveAwayAuthorityText || ''"
                v-model="curCardSet.giveAwayAuthority"
              />
              <div>{{selectedCard.unit}}</div>
              <!-- <div class="modify-text">可修改</div> -->
            </div>
          </div>
          <div class="limt-cell" v-if="isShowGifTip">赠送权益的范围是{{curCardSet.theHighestGiftInterest}}</div>
          <div class="input-cell-wrapper" v-if="selectedCard.authorityUnit != 1 && billingType != 4">
            <div class="cell-value must-input">有效天数({{(curCardSet.canModifyTheValidDate == 1 && curCardSet.modifiableValidDateThreshold == 0)?'不可修改':'可修改'}})</div>
            <div class="cell-content">
              <input
                class="cell-input cell-input-short"
                @input="changePeriodOfValidity"
                type="number"
                :placeholder="selectedCard.periodOfValidityText || ''"
                :disabled="curCardSet.canModifyTheValidDate == 1 && curCardSet.modifiableValidDateThreshold == 0"
                v-model="selectedCard.periodOfValidity"
              />
              <div>天</div>
              <!-- <div class="modify-text">{{(curCardSet.canModifyTheValidDate == 1 && curCardSet.modifiableValidDateThreshold == 0)?'不可修改':'可修改'}}</div> -->
            </div>
          </div>
          <div class="limt-cell" v-if="isShowlimtDate">修改有效天数浮动值不能超过{{curCardSet.modifiableValidDateThreshold}}</div>
          <div class="input-cell-wrapper pay-card-type-wrapper" v-if="billingType != 4">
            <div class="cell-value">开卡方式</div>
            <div class="cell-content">
              <radio-group class="radio-group" @change="onPayCardType">
                <radio class="radio" value="3" :checked="payCardType == 3">手动开卡</radio>
                <radio class="radio" value="2" :checked="payCardType == 2">立即开卡</radio>
                <radio class="radio" value="1" :checked="payCardType == 1">定期开卡</radio>
              </radio-group>
              <!-- <div class="pay-card-type-btn-wrapper">
                <div class="pay-card-type-btn" :class="{'payActive': payCardType == 3}" @click="payCardType = 3">手动开卡</div>
                <div class="pay-card-type-btn" :class="{'payActive': payCardType == 2}" @click="payCardType = 2">立即开卡</div>
                <div class="pay-card-type-btn" :class="{'payActive': payCardType == 1}" @click="payCardType = 1">定期开卡</div>
              </div> -->
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="(payCardType == 2 || payCardType == 1) && billingType != 4">
            <div class="cell-value must-input">开始日期</div>
            <div class="cell-content">
              <picker 
                @change="onPayCardStartDate" 
                :value="payCardStartDate"
                :disabled="payCardType == 2"
                mode="date">
                <view class="picker">{{payCardStartDate}}</view>
              </picker>
            </div>
          </div>
          <div class="input-cell-wrapper" v-if="(payCardType == 2 || payCardType == 1) && billingType != 4">
            <div class="cell-value must-input">结束日期</div>
            <div class="cell-content">
              <picker 
                @change="onPayCardEndDate"
                :value="payCardEndDate" 
                mode="date"
                :disabled="payCardType == 2 || (curCardSet.canModifyTheValidDate == 1 && curCardSet.modifiableValidDateThreshold == 0)">
                <view class="picker">{{payCardEndDate}}</view>
              </picker>
            </div>
          </div>
          <!-- <div class="input-cell-wrapper pay-card-date" v-if="billingType != 4">
            <div class="pay-card-timePicker" v-if="payCardType == 1">
              <picker 
                @change="onPayCardStartDate" 
                :value="payCardStartDate" 
                mode="date">
                <view class="picker">开卡日期：{{payCardStartDate}}</view>
              </picker>
              <picker 
                @change="onPayCardEndDate"
                :value="payCardEndDate" 
                mode="date"
                :disabled="curCardSet.canModifyTheValidDate == 1 && curCardSet.modifiableValidDateThreshold == 0">
                <view class="picker">结束日期：{{payCardEndDate}}</view>
              </picker>
            </div>
            <div class="date-tip" v-if="payCardType == 2 || payCardType == 1">将于{{payCardStartDate}}自动激活,于{{payCardEndDate}}时结束</div>
          </div> -->
          <div class="input-cell-wrapper" v-if="billingType != 4"> 
            <div class="cell-value must-input">实体卡号</div>
            <div class="cell-content">
              <input
                class="cell-input cell-input-lang"
                v-model="cardNum"
                placeholder="请输入卡号，无需卡号可不填"
                placeholder-class="placeholder"
              />
              <div class="random-card-num" @click="randomCardId">随机</div>
              <!-- <div class="card-num-btn">
                <div class="no-card-num" @click="unwantedCardNum" v-if="isNeedCardNum">无需卡号</div>
                <div class="random-card-num" @click="randomCardId">随机卡号</div>
              </div> -->
            </div>
          </div>
          <div class="cell-subtitle" v-if="billingType != 4">合同照片</div>
          <div class="card-img-list" v-if="billingType != 4">
            <template v-if="showImgList.length">
              <div class="img-item img-wrapper" v-for="(item, index) in showImgList" :key="index">
                <image :src="item" mode="aspectFit" @click="previewImage(item)"></image>
                <img src="/static/images/staff/close.svg" class="select-icon" @click="delImg(index)">
              </div>
            </template>
            <div class="img-btn img-item" @click="chooseImg">+</div>
          </div> 
          <div class="cell-subtitle">备注</div>
          <div class="carRemark" v-show="!showEntryBox">
            <textarea v-model="remarks" maxlength="120" cursor-spacing="50" placeholder="备注不能超过120个字" placeholder-class="placeholder"></textarea>
          </div>
          <!-- <div class="cell-subtitle" @click="toMore" v-if="billingType != 4">更多设置选项</div> -->
          <div class="submit-wrapper" :class="{'safe-bottom': isIphoneX}">
            <div class="submit-btn clear" :style="{'color': themeColor}" @click="clearForm">清空</div>
            <div class="submit-btn submit" @click="submitCashier" :style="{'color': themeColor}">提交收银台</div>
            <div class="submit-btn collection" v-if="isCanPay" @click="toPay" :style="{'background-color': themeColor}">收款</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 选择门店操作 -->
    <van-action-sheet
      :show="showStoreList"
      :actions="storeList"
      :safe-area-inset-bottom="false"
      @close="showStoreList = false"
      @select="selectStore"
    ></van-action-sheet>

    <!-- 下拉公用框 -->
    <van-action-sheet
      :show="showActionsList"
      :actions="actionsList"
      :safe-area-inset-bottom="false"
      @close="showActionsList = false"
      @select="selectAction"
    ></van-action-sheet>

    <!-- 合同标签 -->
    <van-popup
      class="label-list-pop"
      :show="showLabelList"
      position="bottom"
      @close="showLabelList = false"
      custom-style="width:100%;max-height:60vh;min-height:30vh;"
    >
      <div class="label-list">
        <checkbox-group class="radio-group">
          <label class="radio" v-for="(item, index) in cardLabelList" :key="index" @click="selectAction(item)">
            <checkbox :value="item.id" :color="themeColor" :checked="item.checked"/>
            <span class="radio-span">{{item.name}}</span>
          </label>
        </checkbox-group>
        <div class="fixed-bottom-btn" @click="showLabelList = false" :style="{'background-color': themeColor}">确认</div>
      </div> 
    </van-popup>

    <!-- 办理销售 -->
    <van-popup
      class="sale-list-pop"
      :show="showSaleList"
      position="bottom"
      @close="showSaleList = false"
      custom-style="width:100%;height:60vh;"
    >
      <header-search :search="searchSale" placeholder="请输入办理销售的名字查询"></header-search>
      <div class="sale-list">
        <div v-for="(item, index) in filterSaleList" :key="index">
          <div class="sale-item"  @click="selectAction(item)">
            <img :src="item.cover" @error="loadFail(index)">
            <span>{{item.userName}}</span>
            <span>{{item.sex}}</span>
          </div>
        </div>
      </div> 
    </van-popup>

    <!-- 办卡列表 -->
    <van-popup
      class="card-list-pop"
      :show="showCardList"
      position="bottom"
      @close="showCardList = false;filterCardType = 3"
      custom-style="width:100%;height:70vh;"
    >
      <div class="card-fixed-header">
        <div class="card-type-group">
          <div class="card-type-item all" @click="filterCardType = 3" :class="{'active': filterCardType == 3}">全部</div>
          <div class="card-type-item yuan" @click="filterCardType = 0" :class="{'active': filterCardType == 0}">储值卡</div>
          <div class="card-type-item day"  @click="filterCardType = 1" :class="{'active': filterCardType == 1}">时期卡</div>
          <div class="card-type-item unit" @click="filterCardType = 2" :class="{'active': filterCardType == 2}">次卡</div>
        </div>
        <header-search :search="searchCard" placeholder="请输入合同名称查询"></header-search>
      </div>
      <div class="card-group">
        <div v-for="(item, index) in filterCardList" :key="index">
          <!-- <staff-coach-item v-if="filterCardType == 3 ? true : (item.authorityUnit == filterCardType)" :info="item" @clickItem="selectCard(item)">
          </staff-coach-item> -->
          <div
            class="cards-popup-item"
            @click="selectCard(item)"
            v-if="filterCardType == 3 ? true : (item.authorityUnit == filterCardType)"
          >
            <div class="cover" :style="{'background-image': item.linearColor}">
              <img :src="item.backImg">
              <div class="cover-desc">{{item.cardName}}</div>
            </div>
            <div class="cards-info">
              <div class="name">
                {{item.first_1}}
              </div>
              <div class="times">有效期：{{item.second_1 || '--'}}</div>
              <div class="date">{{item.third_1}}</div>
            </div>
            <div class="right-block" :style="{'background-color': item.color}">{{item.rightBlock}}</div>
          </div>
        </div>
      </div> 
    </van-popup>

    <van-popup
      :show="showEntryBox"
      @close="showEntryBox = false"
      :duration="200"
      custom-style="width:85%;border-radius: 5px;"
    >
      <div class="entry-box">
        <div class="box-title">办理信息</div> 
        <div class="box-item"><span class="text-left">办理门店</span><span class="text-right">{{selectedStore.storeName}}</span></div>
        <div class="box-item"><span class="text-left">办理日期</span><span class="text-right">{{date}}</span></div>
        <div class="box-item"><span class="text-left">合同名称</span><span class="text-right">{{billingType == 4 ? '定金合同' : selectedCard.first_1}}</span></div>
        <div class="box-item"><span class="text-left">合同编号</span><span class="text-right">{{pactId}}</span></div>
        <div class="box-item"><span class="text-left">需付金额</span><span class="text-right">{{ billingType == 4 ? depositSellingPrice : (selectedCard.salePrice || 0)}}</span></div>
        <div class="btn-wrapper">
          <span class="cancel" @click="showEntryBox = false">取消</span>
          <span class="confirm" @click="billingSubmit" :style="{'background-color': themeColor}">确认</span>
        </div>
      </div>
    </van-popup>

    <timePicker :pickerShow="isPickerShow" :config="pickerConfig" @hidePicker="isPickerShow = false" @setPickerTime="setPickerTime"></timePicker>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate,
  debounce
} from "COMMON/js/common.js";
import colorMixin from "COMPS/colorMixin.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import userItemS from "../components/user-item-s.vue";
import store from "@/utils/store.js";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
import { transformJspImg,getStoreSet,getUserofrole,qiniuUpload } from "../common/js/http.js";
import headerSearch from "../components/header-search.vue";
// import filterNav from "../components/filter-nav.vue";
import billingData from "../common/js/billingData";
import noneResult from "COMPS/noneResult.vue";
import {checkAuth} from "../common/js/service_config.js";

export default {
  data() {
    billingData.isCanPay = checkAuth(346)
    billingData.isIphoneX = store.state.isIphoneX
    return billingData
  },
  mixins: [colorMixin],
  components: {
    staffCoachItem,
    headerSearch,
    noneResult,
    userItemS
    // filterNav
  },
  onLoad(options) {
    console.log("billing==onload")
    Object.assign(this.$data, this.$options.data());
    this.isTeachingContract = options.isTeachingContract
    this.teachCardType = options.teachCardType || ''
    this.billingType = options.billingType
    setNavTab();
    let allStore = store.state.allStore.map(e => {
      e.name = e.storeName;
      return e;
    });
    this.storeList = allStore.filter(e => e.storeId)
    // console.log(this.storeList)
    // this.storeList.splice(0, 1)
    // console.log(this.storeList)
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this.searchCustomer()
    this._mounted()
  },
  onReachBottom() {
    if(this.showSearch) {
      this.searchCustomer()
    }
  },
  computed: {
    billingText() {
      if(this.billingType == 1) {
        return "购买会籍卡"
      }
      if(this.billingType == 2) {
        return "购买私教卡"
      }
      if(this.billingType == 3) {
        return "购买团课卡"
      }
      if(this.billingType == 4) {
        return "预交定金"
      }
    }
  },
  onUnload() {
    console.log("billing-onUnload")
    // Object.assign(this.$data, this.$options.data());
    this.resetPage()
  },
  methods: {
    _mounted() {
      this._getStoreSet()
      if (this.billingType == 2 || this.billingType == 3) {
        this.getCoachList()
      }
      if (this.billingType != 4) {
        this.getCardList()
        this.getCardLabelList()
        this.getCardSetList()
      }
    },
    loadFail(index) {
      this.filterSaleList[index].cover = window.api + "/assets/img/morenTo.png";
    },
    searchSale: debounce(function(text) {
      this.filterSaleList = this.saleList.filter(e => e.userName.indexOf(text) > -1)
    }, 100),
    searchCard: debounce(function(text) {
      this.filterCardList = this.cardList.filter(e => e.cardName.indexOf(text) > -1)
    }, 100),
    // day 有效日期
    computedEndTime(day) {
      const DAY = 24 * 60 * 60 * 1000
      let startTime = new Date(this.payCardStartDate).getTime()
      let endTime = startTime + (Number(day) -1) * DAY
      let endDay = formatDate(new Date(endTime), 'yyyy-MM-dd')
      return endDay
    },
    selectStore(e) {
      this.selectedStore = e.mp.detail;
      this.showStoreList = false;
      this._mounted()
      this.resetPage()
    },
    toAddCustomer() {
      wx.navigateTo({
        url: "../customer_register/main"
      });
    },
    searchInput: debounce(function(e){
      this.customerPage = 1
      this.searchCustomer()
    },200),
    // 客户列表
    searchCustomer() {
      let that = this
      this.searching = true
      this.isNothingCustomer = false
      HttpRequest({
        url: '/customer/list/allcustomer/addpact', // '/customer/archives/customertitlelist',
        data: {
          // condition: that.condition,
          nameOrPhone: that.condition,
          page: that.customerPage,
          pageSize: 10,
          storeId: that.selectedStore.storeId,
          addTimeStart: '',
          addTimeEnd: ''
        },
        success(res) {
          if(!res.data.data || !res.data.data.result.length) {
            that.isNothingCustomer = true
            that.searching = false
            if(that.customerPage == 1) {
              that.searchCustomerList = []
            }
            return
          }
          
          let _data = res.data.data.result.map(async e => {
            e.headImgPath = await transformJspImg(e.headImgPath)
            return {
              cover: e.headImgPath,
              id: e.id,
              first_1: e.name,
              sex: e.sex,
              second_tip_1: "客户状态：",
              second_1: e.customerClassChar,
              phone: e.phone,
              third_1: e.phone.slice(0,3) + '****' + e.phone.slice(7),
              customerClassChar: e.customerClassChar
            }
          })
          Promise.all(_data).then(result => {
            if(that.customerPage == 1) {
              that.searchCustomerList = result
            } else {
              that.searchCustomerList = that.searchCustomerList.concat(result)
            }
            that.customerPage++
          });
          that.searching = false
        }
      })
    },
    // 获取选择的开单客户信息
    selectCustomer(item) {
      let that = this
      wx.showLoading({
        title: "数据加载中.."
      })
      HttpRequest({
        url: '/customer/register/latent/queryphone2',
        data: {
          phone: item.phone,
          storeId: that.selectedStore.storeId
        },
        success(res) {
          wx.hideLoading()
          let info = res.data
          if(info.code == 200 || info.code == 405) {
            info.data.headImgPath = item.cover
            // info.data.customerPhone = item.second_1
            // info.data.sex = item.second_1
            if(info.data.phoneVerifyStatus == 0) {
              info.data.phoneVerifyText = '未验证'
              info.data.colorClass = 'gray'
            } else if(info.data.phoneVerifyStatus == 1) {
              info.data.phoneVerifyText = '短信验证'
              info.data.colorClass = 'notev'
            } else if(info.data.phoneVerifyStatus == 2) {
              info.data.phoneVerifyText = '电话验证'
              info.data.colorClass = 'phoneV'
            }
            info.data.customerClassChar = item.customerClassChar
            that.selectedCustomer = info.data
            that.getSaleList()
            that.showCustomerInfo = true
            that.showSearch = false
            if(that.billingType == 4) {
              that.isSelectCard = true
            }
            if(that.billingType != 4) {
              that.showCardList = true
            }
            if(that.storeSetting.isAddCardCode) {
              return that.showVerify = true
            }
            that.showCardForm = true
          } else {
            wx.showModal({
              title: "提示",
              content: info.message,
              showCancel: false
            });
          }
        }
      })
    },
    // 删除选择的客户信息
    delCurSelect() {
      this.showSearch = true
      this.showCustomerInfo = false
      return this.resetPage()
    },
    // 获取卡列表
    getCardList() {
      let that = this
      HttpRequest({
        url: '/customer/card/cardlist',
        data: {
          storeId: that.selectedStore.storeId,
          isTeachingContract: that.isTeachingContract, // 是否是教学合同 0 1 私教团课是 1
          teachCardType: that.teachCardType // 0 会籍 1 团课 2 私教 3 储值卡
        },
        success(res) {
          let data = res.data.data
          let allCardList = []
          data.forEach((e) => {
            allCardList = allCardList.concat(e.child)
          })
          that.cardList = allCardList.map((e) => {
            let TermOfValidity_1 = ""
            let TermOfValidity_2 = ""
            if(e.periodOfValidity == '-1') {  // 有效天数
              e.periodOfValidity = ''
              TermOfValidity_1 = "面议"
              e.periodOfValidityText = "面议"
            } else {
              TermOfValidity_1 = e.periodOfValidity + '天'
            }
            if(e.buyAuthority == '-1'){ // 金额
              e.buyAuthority = ''
              TermOfValidity_2 = " | 面议"
              e.buyAuthorityText = "面议"
            } 
            
            // else {
            if(e.authorityUnit == 0) {
              e.rightBlock = "储值卡"
              e.color = "#22cab9"
              e.unit = "元"
              e.cellValue = "金额"
              TermOfValidity_2 = ` | ${e.buyAuthority}元`
              e.backImg = window.api + "/assets/img/yuanka.png";
              e.linearColor = 'linear-gradient(to left top, #37d8a9, #0dbbc9)'
            } else if (e.authorityUnit == 1){
              e.rightBlock = "时期卡"
              e.color = "#ff9f56"
              e.unit = "天"
              e.cellValue = "天数"
              TermOfValidity_2 = ""
              e.backImg = window.api + "/assets/img/qixianka.png";
              e.linearColor = 'linear-gradient(to left top, #ffc66c, #ff7f44)'
            } else {
              e.rightBlock = "次卡"
              e.color = "#49afff"
              e.unit = "次"
              e.cellValue = "次数"
              TermOfValidity_2 = ` | ${e.buyAuthority}次`
              e.backImg = window.api + "/assets/img/cardImg.png";
              e.linearColor = 'linear-gradient(to left top, #87c6ff, #159bff)'
            }

            // }
            e.cover = e.headImgPath || ''
            e.id = e.cardId
            e.first_1 = e.cardName
            e.second_tip_1 = "有效期："
            e.second_1 = TermOfValidity_1  + TermOfValidity_2
            e.third_1 = e.salePrice == '-1' ? '￥ 面议' : '￥ '+e.salePrice

            if(e.salePrice == '-1') { // 会员卡总价
              e.salePrice = ''
              e.salePriceText = "面议"
            }
            return e
          })
          that.filterCardList = that.cardList
        }
      })
    },
    // 选择卡
    selectCard(item) {
      this.selectedCard = item
      this.constCardInfo = JSON.parse(JSON.stringify(item))
      this.showCardList = false
      this.isSelectCard = true
      if (item.defaultActivteMode == 0) {
        this.payCardType = 2
      } else if (item.defaultActivteMode == 1) {
        this.payCardType = 3
      } else if (item.defaultActivteMode == 2) {
        this.payCardType = 1
      }
      this.payCardStartDate = formatDate(new Date(), 'yyyy-MM-dd')
      this.payCardEndDate = this.computedEndTime(this.selectedCard.periodOfValidity)

      this.getCardSetInfo(item.cardId)
    },
    // 获取合同标签
    getCardLabelList() {
      let that = this
      HttpRequest({
        url: '/card/label/pages',
        data: {
          storeId: that.selectedStore.storeId,
          pageSize: 100
        },
        success(res) {
          that.cardLabelList = res.data.data.result.map((e) => {
            e.name = e.labelName
            e.id = e.cardLabelId
            e.checked = false
            return e
          })
        }
      })
    },
    // 获取办理销售
    getSaleList() {
      getUserofrole(this.selectedStore.storeId, 0).then((data) => {
        let _data = data.map(async (e) => {
          e.headImgPath = await transformJspImg(e.headImgPath)
          return {
            userId: e.userId,
            userName: e.userName,
            sex: e.sex == 0 ? '' : (e.sex == 1 ? '男' : '女'),
            cover: e.headImgPath
          }
        })
        Promise.all(_data).then(result => {
          that.saleList = result
          that.filterSaleList = result
          that.selectedSale = that.saleList[0]
        });
      })
      let that = this
      // HttpRequest({
      //   url: '/customer/register/userofrole2',
      //   data: {
      //     storeId: that.selectedStore.storeId,
      //     isTeachCard: 1, // 开单时 1
      //     phone: that.selectedCustomer.phone
      //   },
      //   success(res) {
      //      let _data = res.data.data.map(async (e) => {
      //       e.headImgPath = await transformJspImg(e.headImgPath)
      //       return {
      //         userId: e.userId,
      //         userName: e.userName,
      //         sex: e.sex == 0 ? '' : (e.sex == 1 ? '男' : '女'),
      //         cover: e.headImgPath
      //       }
      //     })
      //     Promise.all(_data).then(result => {
      //       that.saleList = result
      //       that.filterSaleList = result
      //       that.selectedSale = that.saleList[0]
      //     });
      //   }
      // })
    },
    // 获取上课教练
    getCoachList() {
      getUserofrole(this.selectedStore.storeId, 1).then((res) => {
        this.coachList = res.map((e) => {
          e.name = e.userName
          return e
        })
      })
    },
    // 门店设置
    _getStoreSet() {
      getStoreSet(this.selectedStore.storeId).then((res) => {
        this.storeSetting = res
      })
    },
    // 选择合同标签 
    selectLabel() {
      if(!this.cardLabelList.length) {
        return wx.showToast({
          title: "无可用合同标签",
          icon: "none",
          duration: 1000
        });
      }
      this.actionType = 'label';
      this.showLabelList = true
    },
    selectSource() {
      if(!this.sourceList.length) {
        return wx.showToast({
          title: "无可用合同来源",
          icon: "none",
          duration: 1000
        });
      }
      this.actionsList = this.sourceList;
      this.showActionsList = true;
      this.actionType='source'
    },
    // 会员卡总价金额限制
    inputSalePrice(e) {
      if(this.curCardSet.canModifyPrice == 2) {
        return
      }
      if (Math.abs(e.mp.detail.value - this.constCardInfo.salePrice) > Number(this.curCardSet.modifiableMinValue)) {
        return this.isShowSalePriceTip = true
      }
      this.isShowSalePriceTip = false
    },
    inputGifHit(e) {
      if(this.curCardSet.canGiveAway == 2) {
        return
      }
      this.changeDayPeriodOfValidity()
      if (Math.abs(e.mp.detail.value - this.constGiveAwayAuthority)  > Number(this.curCardSet.theHighestGiftInterest)) {
        return this.isShowGifTip = true
      }
      this.isShowGifTip = false
    },
    onPayCardType(e) {
      this.payCardType = e.mp.detail.value
    },
    // 发送短信
    sendCode() {
      let that = this
      this.codeCountdown()
      HttpRequest({
        url: '/customer/register/compact/sendCode',
        data: {
          phone: that.selectedCustomer.phone,
          storeId: that.selectedStore.storeId
        },
        success(res) {
          if(res.data.code == 200) {
            that.isSend = true
          } else {
            wx.showModal({
              title: "提示",
              content: info.message,
              showCancel: false
            });
          }
        }
      })
    },
    // 倒计时
    codeCountdown: function() {
      this.CDTime = 60;
      this.isSend = true;
      let that = this;
      var interval = setInterval(function() {
        that.CDTime--;
        if (that.CDTime < 1) {
          that.isSend = false;
          clearInterval(interval);
        }
      }, 1000);
    },
    // 校验验证码
    inputVerifyCode() {
      if(this.verifyCode.length == 4) {
        let that = this
        HttpRequest({
          url: '/customer/register/compact/authCode',
          data: {
            phone: that.selectedCustomer.phone,
            code: that.verifyCode
          },
          success(res) {
            if(res.data.code == 200) {
              that.showVerify = false
              that.showCardForm = true
              that.selectedCustomer.phoneVerifyText = "短信验证"
              that.selectedCustomer.colorClass = "noteV"
            } else {
              wx.showModal({
                title: "提示",
                content: res.data.data,
                showCancel: false
              });
            }
          }
        })
      }
    },
    // 电话验证
    phoneVerify() {
      let that = this
      wx.showModal({
        title: "提示",
        content: "是否已拨打客户电话？",
        success(res) {
          that.showVerify = false
          that.showCardForm = true
          if (res.confirm) {
            that.selectedCustomer.phoneVerifyText = "电话验证"
            that.selectedCustomer.colorClass = "phoneV"
          }
        }
      });
    },
    setPickerTime(val) {
      this.date = val.mp.detail.startTime;
    },
    // 校验合同编号
    checkInPactId() {
      let that = this
      return new Promise((resolve,reject) => {
        HttpRequest({
          url: '/customer/register/compact/querypact2',
          data: {
            pactId: that.pactId
          },
          success(res) {
            if(res.data.code == 200) {
              resolve()
            } else {
              reject(res.data.message)
            }
          }
        })
      })
    },
    // 校验卡号
    checkCardNum() {
      let that = this
      return new Promise((resolve,reject) => {
        HttpRequest({
          url: '/customer/register/compact/querycard',
          data: {
            cardId: that.cardNum
          },
          success(res) {
            if(res.data.code == 200) {
              resolve()
            } else {
              reject(res.data.message)
            }
          }
        })
      })
    },
    // 校验
    checkCondition() {
      return new Promise((resolve) => {
        if (!this.pactId) {
          return wx.showToast({
            title: "请填写合同编号",
            icon: "none",
            duration: 1000
          });
        }
        if (this.billingType == 4) {
          if(!this.depositSellingPrice && this.depositSellingPrice != "0") {
            return wx.showToast({
              title: "付款金额",
              icon: "none",
              duration: 1000
            });
          }
        } else {
          if(this.isShowlimtDate) {
            return wx.showToast({
              title: "有效天数有误",
              icon: "none",
              duration: 1000
            });
          }
          if(this.selectedCard.periodOfValidity < 1 && this.selectedCard.authorityUnit != 1) {
            return wx.showToast({
              title: "有效天数需大于0",
              icon: "none",
              duration: 1000
            });
          }
          if(!this.selectedCard.buyAuthority || this.selectedCard.buyAuthority < 1) {
            return wx.showToast({
              title: `请填写${this.selectedCard.cellValue}`,
              icon: "none",
              duration: 1000
            });
          }
          if(!this.selectedCard.salePrice && this.selectedCard.salePrice != "0") {
            return wx.showToast({
              title: `请填写会员总价`,
              icon: "none",
              duration: 1000
            });
          }
          if(!this.curCardSet.giveAwayAuthority && this.curCardSet.giveAwayAuthority != "0") {
            return wx.showToast({
              title: `请填写赠送${this.selectedCard.cellValue}`,
              icon: "none",
              duration: 1000
            });
          }
          if(this.isShowSalePriceTip) {
            return wx.showToast({
              title: "会员卡价格有误",
              icon: "none",
              duration: 1000
            });
          }
          if(this.isShowGifTip) {
            return wx.showToast({
              title: "赠送权益有误",
              icon: "none",
              duration: 1000
            });
          }
          if (!this.cardNum) {
            this.randomCardId()
            // return wx.showToast({
            //   title: "请填写卡号",
            //   icon: "none",
            //   duration: 1000
            // });
          }
        }
        this.checkInPactId().then(res => {
          if(this.billingType == 4) {
            return this.getToken().then(() => {
              resolve()
            })
          }
          this.checkCardNum().then(res => {
            resolve()
            // this.getToken().then(() => {
            //   resolve()
            // })
          }).catch(reject => {
            wx.showModal({
              title: "提示",
              content: reject,
              showCancel: false
            });
          })
        }).catch(reject => {
          wx.showModal({
            title: "提示",
            content: reject,
            showCancel: false
          });
        })
      })
    },
    // 选择action
    selectAction(e) {
      if(this.actionType=='label') {
        if (this.selectedLableName.indexOf(e.labelName) > -1) {
          this.selectedLableName = this.selectedLableName.replace(
            new RegExp(e.labelName + ",", "g"),
            ""
          );
          this.selectedLableId = this.selectedLableId.replace(
            new RegExp(e.id + ",", "g"),
            ""
          );
          e.checked = false
        } else {
          e.checked = true
          this.selectedLableName += `${e.labelName},`
          this.selectedLableId += `${e.id},`
        }
      } else if(this.actionType =='sale') {
        this.selectedSale = e
        this.showSaleList = false
      } else if(this.actionType =='source') {
        this.selectedSource = e.mp.detail
      } else if(this.actionType =='coach') {
        this.selectedCoach = e.mp.detail
      }

      this.showActionsList = false
    },
    // 合同设置信息
    getCardSetList() {
      let that = this
      HttpRequest({
        url: '/customer/register/compact/cardInfo',
        data: {
          storeId: that.selectedStore.storeId
        },
        success(res) {
          that.cardSetList = res.data.data.map((e) => {
            if (e.giveAwayAuthority == "-1") { // 赠送权益
              e.giveAwayAuthority = ''
              e.giveAwayAuthorityText = "面议"
            }
            return e
          })
        }
      })
    },
    // 获取选中的合同的设置信息
    getCardSetInfo(id) {
      this.curCardSet = this.cardSetList.filter(e => id == e.cardClassId)[0]
      this.constGiveAwayAuthority = this.curCardSet.giveAwayAuthority
    },
    // 初始化页面
    resetPage() {
      this.showSearch = true
      this.condition = ""
      this.customerPage = 1
      this.searchCustomer()
      // this.searchCustomerList = []
      this.clearForm()
    },
    // 清空表单
    clearForm() {
      this.pactId = ""
      this.cardNum = ""
      this.selectedLableName = ""
      this.selectedLableId = ""
      this.showImgList = []
      this.uploadImgList = []
      this.isSelectCard = false
      this.selectedCard = {}
      this.constCardInfo = {}
      this.cardLabelList.forEach((e) => {
        e.checked = false
      })
    },
    // 无需卡号，设置一个随机卡号
    // unwantedCardNum() {
    //   this.randomCardId()
    //   this.isNeedCardNum = false;
    // },
    // 随机卡号
    randomCardId() {
      // this.isNeedCardNum = true
      let cardNum = "";
      let mydate = new Date();
      cardNum ="" + mydate.getDay() + mydate.getHours()+ mydate.getMinutes()+mydate.getSeconds()+mydate.getMilliseconds();
      let length = 16 - cardNum.length;
      for(let i = 0 ; i < length ; i++){
        cardNum += parseInt(Math.random()*10);
      }
      this.cardNum = cardNum
    },
    toMore() {
      wx.navigateTo({
        url: '../billingMore/main'
      })
    },
    chooseImg() {
      let that = this
      wx.chooseImage({
        count: 1,
        success(res) {
          that.showImgList.push(res.tempFilePaths[0])
          wx.uploadFile({
            url: window.api + '/customer/archives/uploadheadimg',
            filePath: res.tempFilePaths[0],
            name: "headimg",
            header: {
              "Content-Type": "multipart/form-data",
              Cookie: wx.getStorageSync("Cookie")
            },
            success(info) {
              let filePath = JSON.parse(info.data).data
              qiniuUpload(res.tempFilePaths[0], filePath).then((res) => {
                that.uploadImgList.push(res.key)
              })
            }
          })
        }
      })
    },
    // 天卡修改有效天数
    changeDayPeriodOfValidity(e) {
      console.log("this.selectedCard.authorityUnit:"+this.selectedCard.authorityUnit)
      if (this.selectedCard.authorityUnit == 1) {
        this.payCardEndDate = this.computedEndTime(Number(this.selectedCard.buyAuthority) + Number(this.curCardSet.giveAwayAuthority))
      }
    },
    // 修改有效天数
    changePeriodOfValidity(e) {
      if(this.curCardSet.canModifyTheValidDate == 1 && this.curCardSet.modifiableValidDateThreshold == 0) {
        return wx.showToast({
          title: '不可修改'
        })
      }
      if (Math.abs(e.mp.detail.value  - this.selectedCard.periodOfValidity) > this.curCardSet.modifiableValidDateThreshold) {
        return this.isShowlimtDate = true
      }
      this.isShowlimtDate = false
      this.payCardEndDate = this.computedEndTime(Number(this.selectedCard.periodOfValidity))
    },
    onPayCardStartDate(e) {
      let startTime = new Date(e.mp.detail.value).getTime()
      if(new Date().getTime() > startTime) {
        return wx.showToast({
          title: '开始日期过小',
          icon: "none",
          duration: 1000
        })
      }
      this.payCardStartDate = e.mp.detail.value
      this.payCardEndDate = this.computedEndTime(this.selectedCard.periodOfValidity)
    },
    onPayCardEndDate(e) {
      let endTime = new Date(e.mp.detail.value).getTime()
      let startTime = new Date(this.payCardStartDate).getTime()
      if(endTime < startTime) {
        return wx.showToast({
          title: '有效天数需大于0',
          icon: "none",
          duration: 1000
        })
      }
      this.payCardEndDate = e.mp.detail.value
      let day = 24 * 60 * 60 * 1000
      let startToEndDay = ((endTime - startTime) / day) + 1
      if(this.selectedCard.authorityUnit == 1) {
        if(startToEndDay - this.curCardSet.giveAwayAuthority > 0) {
          this.selectedCard.buyAuthority = startToEndDay  - this.curCardSet.giveAwayAuthority
        } else {
          this.selectedCard.buyAuthority = 0;
          this.curCardSet.giveAwayAuthority = startToEndDay
        }
      } else {
        this.selectedCard.periodOfValidity = startToEndDay
      }
    },
    // 提交表单时获取token
    getToken() {
      let that = this
      return new Promise((resolve) => {
        HttpRequest({
          url: '/customer/card/gettoken',
          data: {
            tokenKey: 1
          },
          success(res) {
            that.token = res.data.data
            resolve()
          }
        })
      })
    },
    async billingSubmit() {
      wx.showLoading({
        title: '加载中..'
      })
      await this.getToken()
      let that = this
      let data = {}
      this.curCardSet.isCanTransCard = this.curCardSet.canTransCard
      if(this.billingType != 4) {
        let _periodOfValidity = 0
        if(this.selectedCard.authorityUnit == 1) {
          _periodOfValidity = Number(this.selectedCard.buyAuthority) + Number(this.curCardSet.giveAwayAuthority)
        } else {
          _periodOfValidity = this.selectedCard.periodOfValidity
        }
        let basaData = {
          storeId: that.selectedStore.storeId,
          phone: that.selectedCustomer.phone,
          id: that.selectedCustomer.id,
          name: that.selectedCustomer.name,
          sex: that.selectedCustomer.sex,
          birthTime: '',
          mainUser: that.selectedCustomer.name,
          transactUserId: that.selectedSale.userId,
          transactuser: that.selectedSale.userId,
          buyCardTime: that.date,
          pactId: that.pactId,
          cardClassId: that.selectedCard.cardId,
          sellingPrice: that.selectedCard.salePrice || 0,
          buyAuthority: that.selectedCard.buyAuthority,
          periodOfValidity: _periodOfValidity,
          teachCardType: that.selectedCard.teachCardType,
          canTeachCard: that.isTeachingContract,
          remarks: that.remarks,
          authorityUnit: that.selectedCard.authorityUnit,
          coachUserId: that.selectedCoach.userId,
          labelIdsStr: that.selectedLableId,
          cardSource: that.selectedSource.value,
          isTimingOfActivation: that.payCardType,
          activateDate: that.payCardType == 1 ? that.payCardStartDate : '',
          doomsday: that.payCardType == 1 ? that.payCardEndDate : '',
          phoneVerifyStatus: "",
          physicsCardNo: that.cardNum,
          pactImgPath: JSON.stringify(that.uploadImgList),
          token: that.token,
          compactNum: 1,
          compactSumMoney: that.selectedCard.salePrice || 0
        }
        data = Object.assign(this.curCardSet, basaData);
      } else {
        data = {
          id: that.selectedCustomer.id,
          isSubscriptionPact: 1,
          storeId: that.selectedStore.storeId,
          phone: that.selectedCustomer.phone,
          transactuser: that.selectedSale.userId,
          transactUserId: that.selectedSale.userId,
          name: that.selectedCustomer.name,
          sex: that.selectedCustomer.sex,
          buyCardTime: that.date,
          customerClass: that.selectedCustomer.customerClass,
          pactId: that.pactId,
          isCanBack: that.canpayment,
          sellingPrice: that.depositSellingPrice,
          remarks: that.remarks,
          phoneVerifyStatus: "",
          token: that.token,
        }
      }
      for(let k in data) {
        if(undefined == data[k] || null == data[k]) {
          data[k] = ""
        }
      }
      HttpRequest({
        url: '/cashi/cashierPayment',
        data: data,
        success(res) {
          wx.hideLoading()
          if(res.data.code == 200){
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            })
            setTimeout(() => {
              // wx.redirectTo({
              //   url: "../pay_card/main"
              // });
              wx.navigateBack({
                delta: 1
              })
            }, 500);
            that.resetPage()
            that.showEntryBox = false
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            });
          }
        }
      })
    },
    onCanpayment(e) {
      this.canpayment = e.mp.detail.value;
    },
    submitCashier() {
      this.checkCondition().then(() => {
        this.showEntryBox = true
      })
    },
    toPay() {
      this.checkCondition().then(() => {
        wx.navigateTo({
          url: '../receivable/main'
        })
      })
    },
    // 查看合同
    previewImage(item) {
      wx.previewImage({
        current: item,
        urls: this.showImgList
      })
    },
    delImg(index) {
      this.showImgList.splice(index, 1)
      this.uploadImgList.splice(index, 1)
    }
  }
};
</script>

<style lang="less">
@import "../common/less/form.less";
@import "~COMMON/less/common";
@import "../common/less/staff_common.less";
page {
  background-color: #fff;
}
.billing {
  .input-cell-wrapper {
    line-height: 42px;
    // .cell-value {
    //   flex: 0 0 30%;
    // }
    .cell-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      .cell-input {
        flex: 1;
        height: 42px;
        line-height: 42px;
      }
      // .cell-input-short {
      //   width: 30%;
      // }
      // .cell-input-lang {
      //   width: 100%;
      // }
      .card-num-btn {
        >div {
          display: inline-block;
          line-height: 30px;
          padding: 0 10px;
          margin-right: 10px;
          text-align: center;
          border-radius: 3px;
          border: 1px solid #eee;
          color: #333333;
        }
      }
      .random-card-num {
        font-size: 12px;
        color: #119bf0;
        margin-left: 5px;
      }
      .pay-card-type-btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        .pay-card-type-btn {
          margin-right: 5px;
          height: 30px;
          line-height: 30px;
          padding: 0 5px;
          color: #333;
          border: 1rpx solid #eee;
        }
        .payActive {
          border: 1rpx solid #00ced8;
          color: #00ced8;
        }
      }
      // .modify-text {
      //   text-align: right;
      //   color: #999999;
      // }
    }
  }
  .limt-cell {
    padding-left: 15px;
    line-height: 22px;
    color: red;
    border-bottom: 1rpx solid #eee;
  }
  .pay-card-type-wrapper {
    border-bottom: none;
  }
  .pay-card-date {
    display: block;
    .pay-card-timePicker {
      line-height: 32px;
      display: flex;
      >picker {
        flex: 1;
      }
      // input {
      //   display: inline-block;
      //   height: 30px;
      //   line-height: 30px;
      //   border: 1rpx solid #eee;
      //   padding-left: 5px;
      // }
      // .expiry-day {
      //   margin-left: 10px;
      //   width: 70px;
      // }
    }
    .date-tip {
      line-height: 26px;
      color: #b5b5b5;
    }
  }
  .cell-subtitle {
    padding: 0 15px;
    line-height: 46px;
  }
  .card-img-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 15px;
    // .img-group {
    //   display: flex;
    //   flex-wrap: wrap;
    //   >image {
    //     &:nth-of-type(n+4) {
    //       margin-top: 10px;
    //     }
    //   }
    // }
    .img-wrapper {
      position: relative;
      .select-icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
      }
    }
    .img-item {
      width: 70px;
      height: 70px;
      margin-right: 15px;
      background: #e3e3e3;
      border-radius: 0;
      outline: none;
      >image {
        width: 100%;
        height: 100%;
      }
      &:nth-of-type(n+5) {
        margin-top: 10px;
      }
    }
    .img-btn {
      font-size: 30px;
      text-align: center;
      line-height: 70px;
      color: #fff;
      border: 1rpx solid #b4b4b4;
    }
  }
  .carRemark {
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    >textarea {
      box-sizing: border-box;
      width: 100%;
      height: 128px;
      padding: 5px;
      border: 1rpx solid #eee;
    }
  }
  // .store-content {
  //   flex: 1;
  //   text-align: center;
  // }
  .billing-header {
    display: flex;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;
    .subtitle {
      width: 30%;
    }
    .store {
      flex: 1;
      padding: 10px 5px;
      padding-right: 20px;
      text-align: right;
    }
  }
  .search-wrapper {
    .tip {
      line-height: 26px;
      padding-left: 15px;
      border-bottom: 1rpx solid #eee;
    }
    .phone-search-wrapper {
      position: sticky;
      top: 0;
      z-index: 99;
      >input {
        flex: 1;
        height: 46px;
        line-height: 46px;
      }
      .add-customer {
        color: #2fa0ec;
      }
    }
    .search-list {
      .staff-coach-item {
        border-bottom: 1rpx solid #eee;
      }
    }
  }
  .bulling-content {
    .customer-info {
      background-color: #fff;
      .customer-card-tip {
        padding-left: 10px;
        padding-top: 5px;
        font-size: 13px;
        color: #666;
      }
    }
    // .customer-info {
    //   position: relative;
    //   display: flex;
    //   padding: 10px;
    //   border-bottom: 1rpx solid #eee;
    //   background-color: #fff;
    //   .cover {
    //     flex: 0 0 60px;
    //     width: 60px;
    //     height: 60px;
    //     border-radius: 12px;
    //     background-color: #eee;
    //     >image {
    //       width: 100%;
    //       height: 100%;
    //       border-radius: 12px;
    //     }
    //   }
    //   .customer-middle {
    //     flex: 1;
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: center;
    //     padding-left: 12px;
    //     >div {
    //       line-height: 20px;
    //       font-size: 12px;
    //       color: #505050;
    //     }
    //     .verify {
    //       line-height: 20px;
    //       padding: 0 5px;
    //       margin-left: 10px;
    //       color: #fff;
    //       border-radius: 3px;
    //       &.gray {
    //         background-color: #d3d3d3;
    //       }
    //       &.noteV {
    //         background-color: #67c87b;
    //       }
    //       &.phoneV {
    //         background-color: #ebc445;
    //       }
    //     }
    //   }
    //   .del {
    //     position: absolute;
    //     top: 50%;
    //     right: 15px;
    //     transform: translateY(-50%);
    //     width: 18px;
    //     height: 20px;
    //     padding: 15px;
    //   }
    // }
    .verify-wrapper {
      .verify-phone {
        display: flex;
        padding: 0 15px;
        line-height: 46px;
        font-size: 16px;
        border-bottom: 1rpx solid #eee;
        .verify-text {
          width: 30%;
        }
        >input {
          flex: 1;
          height: 46px;
          line-height: 46px;
        }
      }
      .verify-btn-wrapper {
        display: flex;
        justify-content: space-between;
        padding: 5px 15px;
        border-bottom: 1rpx solid #eee;
        .verify {
          width: 30%;
          border: 1px solid #dbdbdb;
          text-align: center;
          line-height: 32px;
          border-radius: 3px;
          &.send-v {
            background-color: #d3d3d3;
            color: #fff;
          }
        }
      }
    }
  }
  .card-form {
    padding-bottom: 50px;
    .subtitle {
      padding: 5px 10px 5px 5px;
      line-height: 30px;
      .subtitle-text {
        color: #666;
        font-size: 12px;
      }
      .more-set {
        float: right;
        font-size: 12px;
        color: #119bf0;
      }
    }
    .submit-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      border: 1rpx solid #eee;
      display: flex;
      z-index: 2;
      background-color: #fff;
      .submit-btn {
        flex: 1;
        text-align: center;
        line-height: 40px;
        background-color: #fff;
      }
      .clear {
        border-right: 1rpx solid #eee;
      }
      .collection {
        color: #fff;
      }
    }
  }
  .placeholder {
    color: #999;
  }
  .card-list-pop {
    .card-fixed-header {
      position: sticky;
      top: 0;
      z-index: 99;
      background-color: #fff;
      border-bottom: 1rpx solid #eee;
    }
    .card-type-group {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .card-type-item {
        line-height: 28px;
        padding: 0 10px;
        margin-top: 10px;
        margin-bottom: 5px;
        border-radius: 21px;
        text-align: center;
        color: #fff;
        &.all {
          background-color: #07c160;
        }
        &.yuan {
          background-color: #13bfc4;
        }
        &.day {
          background-color: #ff924f;
        }
        &.unit {
          background-color: #58b4ff;
        }
        &.active {
          box-shadow: 1px 2px 2px #929292;
          transform: scale(1.1);
        }
      }
    }
    .card-group {
      .cards-popup-item {
        display: flex;
        padding: 15px 15px;
        border-top: 1rpx solid #eee;
        .cover {
          position: relative;
          flex: 0 0 60px;
          margin-right: 10px;
          border-radius: 4px;
          > img {
            width: 100%;
            height: 60px;
            border-radius: 4px;
          }
          .cover-desc {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            text-align: center;
            font-size: 12px;
            color: #fff;
          }
        }
        .cards-info {
          flex: 1;
          .name {
            line-height: 20px;
          }
          .times,
          .date {
            line-height: 20px;
            color: #bababa;
            font-size: 14px;
            .Mult-line(1);
          }
        }
        .right-block {
          line-height: 24px;
          height: 24px;
          width: 50px;
          text-align: center;
          margin-top: 18px;
          margin-right: 10px;
          color: #fff;
          border-radius: 2px;
          font-size: 14px;
        }
      }
    }
  }
  .entry-box {
    line-height: 46px;
    padding: 15px;
    .box-title {
      text-align: center;
    }
    .text-right {
      float: right;
    }
    .btn-wrapper {
      display: flex;
      >span {
        flex: 1;
        border-radius: 4px;
        color: #fff;
        line-height: 36px;
        text-align: center;
        margin-right: 10px;
        &:active {
          opacity: 0.8;
        }
      }
      .cancel {
        background-color: #fa8178;
      }
    }
  }
  .sale-list-pop {
    position: relative;
    .header-search {
      position: sticky;
      top: 0;
      background-color: #fff;
    }
    .sale-list {
      .sale-item {
        display: flex;
        align-items: center;
        height: 42px;
        padding-left: 15px;
        border-bottom: 1rpx solid #eee;
        >img {
          border-radius: 50%;
          width: 36px;
          height: 36px;
        }
        >span {
          margin-left: 15px;
        }
      }
    }
  }
  .radio-group {
    border: none;
  }
  .radio-span {
    margin-right: 15px;
  }
}
</style>
