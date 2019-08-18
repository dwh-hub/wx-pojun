<template>
  <div class="achievement"></div>
</template>

<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import colorMixin from "COMPS/colorMixin.vue";
import listDayItem from "../components/list-day-item";
import filterNav from "../components/filter-nav.vue";
export default {
  data() {
    return {
      achievementTable: [],
      achievementForm: [],
      requestData: {
        // masterCardClassId: '',
        // secondCardClassId: '',
        // customerName: '',
        // storeId: '',
        transactUserId: wx.getStorageSync("userInfo").userId,
        timeStart: "2019-8-1 00:00:00",
        timeEnd: "2019-8-31 23:59:59",
        belongerId: wx.getStorageSync("userInfo").userId,
        isCoverage: 0
      },
      page: 1
    };
  },
  mixins: [colorMixin],
  components: {
    listDayItem,
    filterNav
  },
  mounted() {
    setNavTab();
  },
  methods: {
    getAchievementTable() {
      let that = this;
      HttpRequest({
        url: "/performance/card/pagestotal",
        data: that.requestData,
        success(res) {
          if (res.data.code == 200) {
            that.achievementTable = res.data.data;
          }
        }
      });
    },
    getAchievementForm() {
      let that = this;
      HttpRequest({
        url: "/performance/card/pages",
        data: that.requestData,
        success(res) {
          if (res.data.code == 200 && res.data.data.length) {
            let _data
            _data = res.data.data.map(e => {
              // TODO:
            });
            if (that.page == 1) {
              that.achievementForm = _data;
            } else {
              that.achievementForm = that.achievementForm.concat(_data);
            }
            that.page++
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
</style>