<template>
  <div class="staff_team_class_kind">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
    </div>
    <div class="class-list">
      <div class="class-kind" v-for="(item, index) in classkindList" :key="index" @click="selectClassKind(item)">
        <div class="class-cover">
          <img :src="item.masterImg" alt />
        </div>
        <div class="class-kind-desc">
          <div class="class-name">{{item.anotherName}}</div>
          <div class="class-time">时长：{{item.timeSpan}}分钟</div>
        </div>
      </div>
    </div>
    <van-loading :color="themeColor" v-if="isLoading" />
    <none-result text="暂无课程" v-if="!classkindList.length && !isLoading"></none-result>
  </div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import headerSearch from "../components/header-search.vue";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
// import listPageMixin from "../components/list-page-mixin.vue";
import teamClassItem from "COMPS/teamClassItem.vue";

export default {
  data() {
    return {
      type: '',
      isLoading: false,
      classkindList: [],
      storeList: [],
      selectedStore: {}
    };
  },
  onLoad(options) {
    this.type = options.type
  },
  mounted() {
    setNavTab();
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0];
    this.getClasskindList();
  },
  // listPageMixin
  mixins: [colorMixin],
  components: {
    headerSearch,
    teamClassItem,
    headerSearch
  },
  methods: {
    selectStore() {
      this.classkindList = []
      this.getClasskindList();
    },
    searchChange(event) {
      this.filter.namePhone = event;
    },
    getClasskindList() {
      this.isLoading = true
      let that = this;
      HttpRequest({
        url: "/teamClass/teamTempStore/pages",
        data: {
          store: 126, // that.selectedStore.storeId
        },
        success(res) {
          that.isLoading = false
          if (res.data.code !== 200) {
            return (that.classkindList = []);
          }
          res.data.data.result.forEach(e => {
            e.teamScheduleId = "123456789"; // 为了显示正常
            if (!e.masterImg) {
              e.masterImg = window.api + "/assets/img/morenImg.png";
            } else {
              e.masterImg = window.api + e.masterImg;
            }
          });
          that.classkindList = res.data.data.result;
        }
      });
    },
    selectClassKind(item) {
      wx.navigateTo({
        url: `../team_class_scheduling/main?teamTempStoreId=${
          item.teamTempStoreId
        }&storeId=${item.storeId}&type=${this.type}`
      });
    }
  }
};
</script>

<style lang="less">
.staff_team_class_kind {
  .class-list {
    .class-kind {
      display: flex;
      padding: 15px 10px;
      border-bottom: 1rpx solid #eee;
      .class-cover {
        width: 60px;
        height: 60px;
        margin-right: 15px;
        > img {
          width: 100%;
          height: 100%;
          background-color: #eee;
        }
      }
      .class-kind-desc {
        flex: 1;
        > div {
          line-height: 30px;
        }
        .class-name {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
