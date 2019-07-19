<template>
  <div class="billing">
    <div class="store-wrapper input-cell-wrapper">
      <div>登记门店</div>
      <div
        class="store-content"
        @click="showStoreList = true"
      >{{selectedStore.storeName}}</div>
    </div>
    <div class="search-wrapper">
      <div class="phone-search-wrapper input-cell-wrapper">
        <input type="text" placeholder="输入名字、手机号搜索" @input="searchInput" v-model="condition">
        <div class="add-customer" @click="toAddCustomer">添加会员</div>
      </div>
      <div class="search-list">
        <staff-coach-item v-for="(item, index) in searchCustomerList" :key="index" :info="item"></staff-coach-item>
        <van-loading color="#999" custom-class="loading" v-if="searching"/>
      </div>
    </div>
    <div class="bulling-content">
      
    </div>
    <van-action-sheet
      :show="showStoreList"
      :actions="storeList"
      :safe-area-inset-bottom="false"
      @close="showStoreList = false"
      @select="selectStore"
    ></van-action-sheet>
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
import store from "@/utils/store.js";
export default {
  data() {
    return {
      storeList: [],
      selectedStore: {},
      condition: "",
      searchCustomerList: [],
      showStoreList: false,
      searching: false
    };
  },
  mixins: [colorMixin],
  components: {
    staffCoachItem
  },
  onLoad() {
    setNavTab();
    this.storeList = store.state.allStore.map(e => {
      return {
        name: e.storeName,
        storeName: e.storeName,
        storeId: e.storeId
      };
    });
    this.selectedStore = this.storeList[0];
  },
  methods: {
    selectStore(e) {
      this.selectedStore = e.mp.detail;
      this.showStoreList = false;
    },
    toAddCustomer() {
      wx.navigateTo({
        url: "../customer_register/main"
      });
    },
    searchInput: debounce(function(e){
      this.searchCustomer()
    },200),
    searchCustomer() {
      let that = this
      this.searching = true
      HttpRequest({
        url: '/customer/archives/customertitlelist',
        data: {
          condition: that.condition,
          page: 1,
          pageSize: 10,
          storeId: that.selectedStore.storeId,
        },
        success(res) {
          if(!res.data.data || !res.data.data.result) {
            return that.searching = false
          }
          that.searchCustomerList = res.data.data.result.map((e) => {
            return {
              cover: e.headImgPath ? window.api + '/assets/img/morenTo.png': window.api + e.headImgPath,
              id: e.customerId,
              first_1: e.customerName,
              second_tip_1: "合同数：",
              second_1: e.totalCardCount,
              third_1: e.customerPhone
            }
          })
          that.searching = false
        }
      })
    }
  }
};
</script>

<style lang="less">
.billing {
  .input-cell-wrapper {
    padding: 0 15px;
    display: flex;
    line-height: 46px;
    border-bottom: 1rpx solid #eee;
  }
  .store-content {
    flex: 1;
    text-align: center;
  }
  .search-wrapper {
    .phone-search-wrapper {
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
}
</style>
