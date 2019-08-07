<template>
  <div class="billing-more">
    <div class="input-cell-wrapper">
      <div class="cell-value">是否可以免费请假</div>
      <div class="cell-content">
        <radio-group class="radio-group" @change="onIsCanStopCard">
          <radio value="1" :color="themeColor" :checked="curCardSet.isCanStopCard == 1" />
          <span class="radio-span">是</span>
          <radio value="0" :color="themeColor" :checked="curCardSet.isCanStopCard == 0" />
          <span class="radio-span">否</span>
        </radio-group>
      </div>
    </div>
    <div v-show="curCardSet.isCanStopCard == 1">
      <div class="input-cell-wrapper">
        <div class="cell-value">可请假天数</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="curCardSet.canLeaveDay" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">可请假次数</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="curCardSet.canleaveCount" />
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="cell-value">每次最多请假天数</div>
        <div class="cell-content">
          <input class="cell-input" type="number" v-model="curCardSet.everyleaveDay" />
        </div>
      </div>
    </div>
    <div class="input-cell-wrapper">
      <div class="cell-value">是否可以收费请假</div>
      <div class="cell-content">
        <radio-group class="radio-group" @change="onIsCanOverdueStopCard">
          <radio value="1" :color="themeColor" :checked="curCardSet.isCanOverdueStopCard == 1" />
          <span class="radio-span">是</span>
          <radio value="0" :color="themeColor" :checked="curCardSet.isCanOverdueStopCard == 0" />
          <span class="radio-span">否</span>
        </radio-group>
      </div>
    </div>
    <div class="input-cell-wrapper" v-show="curCardSet.isCanOverdueStopCard == 1">
      <div class="cell-value">收费请假费用(元/天)</div>
      <div class="cell-content">
        <input class="cell-input" type="number" v-model="curCardSet.overdueCost" />
      </div>
    </div>
    <div class="input-cell-wrapper">
      <div class="cell-value">是否可以转卡</div>
      <div class="cell-content">
        <radio-group class="radio-group" @change="onCanTransCard">
          <radio value="1" :color="themeColor" :checked="curCardSet.canTransCard == 1" />
          <span class="radio-span">是</span>
          <radio value="0" :color="themeColor" :checked="curCardSet.canTransCard == 0" />
          <span class="radio-span">否</span>
        </radio-group>
      </div>
    </div>
    <div class="input-cell-wrapper">
      <div class="cell-value">是否可以转让</div>
      <div class="cell-content">
        <radio-group class="radio-group" @change="onCanTransfer">
          <radio value="1" :color="themeColor" :checked="curCardSet.canTransfer == 1" />
          <span class="radio-span">是</span>
          <radio value="0" :color="themeColor" :checked="curCardSet.canTransfer == 0" />
          <span class="radio-span">否</span>
        </radio-group>
      </div>
    </div>
    <div class="input-cell-wrapper" v-show="curCardSet.canTransfer == 1">
      <div class="cell-value">转让收费标准(%)</div>
      <div class="cell-content">
        <input class="cell-input" type="number" v-model="curCardSet.feesTag" />
      </div>
    </div>
    <div class="input-cell-wrapper">
      <div class="cell-value">是否可以挂失/补办</div>
      <div class="cell-content">
        <radio-group class="radio-group" @change="onCanLossMake">
          <radio value="1" :color="themeColor" :checked="curCardSet.canLossMake == 1" />
          <span class="radio-span">是</span>
          <radio value="0" :color="themeColor" :checked="curCardSet.canLossMake == 0" />
          <span class="radio-span">否</span>
        </radio-group>
      </div>
    </div>
    <div class="input-cell-wrapper" v-show="curCardSet.canLossMake == 1">
      <div class="cell-value">补办收费（元）</div>
      <div class="cell-content">
        <input class="cell-input" type="number" v-model="curCardSet.lossMakeFees" />
      </div>
    </div>

    <div class="fixed-bottom-btn" @click="back" :style="{'background-color': themeColor}">确认</div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import billingData from "../common/js/billingData";
import colorMixin from "COMPS/colorMixin.vue";
export default {
  data() {
    return billingData;
  },
  mixins: [colorMixin], 
  mounted() {
    setNavTab();
  },
  methods: {
    onIsCanStopCard(e) {
      this.curCardSet.isCanStopCard = e.mp.detail.value;
      if(this.curCardSet.isCanStopCard == 0) {
        this.curCardSet.everyleaveDay = 0
        this.curCardSet.canleaveCount = 0
        this.curCardSet.canLeaveDay = 0
      }
    },
    onIsCanOverdueStopCard(e) {
      this.curCardSet.isCanOverdueStopCard = e.mp.detail.value;
      if(this.curCardSet.isCanOverdueStopCard == 0) {
        this.curCardSet.overdueCost = 0
      }
    },
    onCanTransfer(e) {
      this.curCardSet.canTransfer = e.mp.detail.value;
    },
    onCanTransCard(e) {
      this.curCardSet.canTransCard = e.mp.detail.value;
      if (this.curCardSet.canTransCard == 0) {
        this.curCardSet.feesTag = 0
      }
    },
    onCanLossMake(e) {
      this.curCardSet.canLossMake = e.mp.detail.value;
      if (this.curCardSet.canLossMake == 0) {
        this.curCardSet.lossMakeFees = 0
      }
    },
    back() {
      wx.navigateBack({
        delta: 1
      })
    }
  }
};
</script>

<style lang="less">
@import "../common/less/form.less";
@import "../common/less/staff_common.less";
.input-cell-wrapper {
  .cell-value {
    flex: 1;
  }
}
</style>
