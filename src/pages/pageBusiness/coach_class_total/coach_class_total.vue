<template>
  <div class="coach-class-total">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        @selectStore="selectStore"
      ></header-search>
      <header-data :headerData="headerData"></header-data>
      <filter-nav @allFilter="showFilter" :nav="nav"></filter-nav>
    </div>
    <div class="list">
      <staff-coach-item v-for="(item,index) in list" :key="index" :info="item" @clickItem="toDetail(item)">
        <div>
          <div class="appoint" :style="{color: themeColor, border: '1rpx solid '+themeColor}">约课</div>
          <img src="/static/images/staff/right-arrow.svg" alt />
        </div>
      </staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无课程" v-if="!list.length && !isLoading"></none-result>
    </div>
    <timePicker
      :pickerShow="isPickerShow"
      :config="pickerConfig"
      @hidePicker="hidePicker"
      @setPickerTime="setPickerTime"
    ></timePicker>
  </div>
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
import headerSearch from "../components/header-search.vue";
import headerData from "../components/header-data.vue";
import filterNav from "../components/filter-nav.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";

export default {
  data() {
    return {
      nav: [
        {
          navTitle: "上课日期",
          name: "上课日期",
          children: [
            {
              sonText: "全部(上课日期)",
              action: () => {
                this.filterDate(0);
              }
            },
            {
              sonText: "今日",
              action: () => {
                this.filterDate(1);
              }
            },
            {
              sonText: "本周",
              action: () => {
                this.filterDate(7);
              }
            },
            {
              sonText: "本月",
              action: () => {
                this.filterDate(30);
              }
            },
            {
              sonText: "自定义",
              isDiyDate: true,
              action: () => {
                this.showPicker();
              }
            }
          ]
        },
        {
          navTitle: "上课教练",
          name: "上课教练",
          children: []
        },
        {
          navTitle: "卡类型",
          name: "卡类型",
          children: []
        },
        {
          navTitle: "服务项目",
          name: "服务项目",
          children: []
        }
      ],
      headerData: [
        {
          dataText: "上课人数",
          dataNum: "0"
        },
        {
          dataText: "上课数量",
          dataNum: "0"
        },
        {
          dataText: "上课总额",
          dataNum: "0"
        }
      ],
      filter: {
        coachName: "",
        calendarStart: "",
        calendarEnd: ""
      },
      // cardClassMap: [],
      // projectMap: [],
      // userMap: [],
      page: 1
    };
  },
  onLoad(options) {},
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  mounted() {
    setNavTab();
    this.refreshList();
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    headerData,
    filterNav,
    staffCoachItem,
    headerSearch,
    noneResult
  },
  methods: {
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            pageNo: that.page,
            storeId: that.selectedStore.storeId,
            status: 3
          },
          that.filter
        );
        HttpRequest({
          url: "/coach/private/appoint/pages",
          data: _data,
          success(res) {
            if (res.data.code == 200) {
              let data = res.data.data;
              let list = [];
              list = data.result.map(async e => {
                if (e.headImgPath) {
                  if (e.headImgPath.indexOf(".jsp") != -1) {
                    await that.getAvatar(e.headImgPath).then(res => {
                      e.headImgPath = res;
                    });
                  } else {
                    e.headImgPath = window.api + e.headImgPath;
                  }
                }
                return {
                  id: e.customerId,
                  cover: e.headImgPath
                    ? e.headImgPath
                    : "http://pojun-tech.cn/assets/img/morenTo.png",
                  sex: e.sex,
                  first_1: e.name,
                  first_2: e.phone,
                  second_tip_1: "上课时间：",
                  second_1: e.realTimeStart + "-" + e.realTimeEnd.split(" ")[1],
                  third_tip_1: "服务项目：",
                  third_1: `${e.projectName} ${e.thisDeduction}元`,
                  third_2: `\n上课教练：${e.coachName}\n${
                    e.masterCardClassName
                  }：${e.cardClassName}(${e.pactId})`
                };
              });
              Promise.all(list).then(result => {
                resolve(result);
              });
            }
          }
        });
      });
    },
    toDetail(item) {
      wx.navigateTo({
        url: "../customer_detail/main?id=" + item.id
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj);
    },
    setDate(obj) {
      this.filter.calendarStart = obj.startTime;
      this.filter.calendarEnd = obj.endTime;
    }
  }
};
</script>

<style lang="less">
.coach-class-total {
  .list {
    .staff-coach-item {
      border-top: 1rpx solid #eee;
      .appoint {
        display: inline-block;
        vertical-align: middle;
        line-height: 24px;
        width: 50px;
        text-align: center;
        border-radius: 16px;
      }
      .first-2 {
        color: #000;
      }
      .coach-times,
      .coach-desc {
        > span,
        .third {
          color: #808080;
        }
      }
      .coach-desc {
        -webkit-line-clamp: 3;
        overflow: inherit;
      }
      .icon-right {
        img {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
</style>
