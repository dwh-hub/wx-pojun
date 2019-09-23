<template>
  <div class="my-private-class">
    <div class="list-header">
      <header-search
        :storeList="storeList"
        :color="themeColor"
        :search="searchChange"
        :searchText="filter.namePhone"
        :isOverlap="true"
        @selectStore="selectStore"
      ></header-search>
      <header-data :isOverlap="true" :headerData="headerData"></header-data>
      <filter-nav :nav="nav"></filter-nav>
    </div>
    <div class="class-list common-list">
      <staff-coach-item
        :info="item"
        v-for="(item, index) in list"
        @clickItem="toDetail(item)"
        @clickIcon="clickIcon(item)"
        :key="index"
      >
        <div>
          <img src="/static/images/staff/phone.svg" alt />
          <img src="/static/images/staff/right-arrow.svg" alt />
        </div>
      </staff-coach-item>
      <van-loading :color="themeColor" v-if="isLoading"/>
      <none-result text="暂无客户" v-if="!list.length && !isLoading"></none-result>
      <div class="no-more" v-if="isNoMore && list.length">暂无更多</div>
    </div>

    <timePicker :pickerShow="isPickerShow" :config="pickerConfig" @hidePicker="hidePicker" @setPickerTime="setPickerTime"></timePicker>
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
import headerSearch from "../components/header-search.vue";
import filterNav from "../components/filter-nav.vue";
import headerData from "../components/header-data.vue";
import staffCoachItem from "../components/staff-coach-item.vue";
import colorMixin from "COMPS/colorMixin.vue";
import listPageMixin from "../components/list-page-mixin.vue";
import noneResult from "COMPS/noneResult.vue";
import regeneratorRuntime from "../common/js/regenerator-runtime/runtime.js";
export default {
  data() {
    return {
      nav: [
        {
          navTitle: "全部",
          name: "登记时间",
          children: [
            {
              sonText: "全部",
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
                this.showPicker()
              }
            }
          ]
        },
        {
          navTitle: "资料来源",
          name: "资料来源",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filter.coachDataSource = ""
              }
            },
            {
              sonText: "录入",
              action: () => {
                this.filter.coachDataSource = 1
              }
            },
            {
              sonText: "到访",
              action: () => {
                this.filter.coachDataSource = 2
              }
            },
            {
              sonText: "分配",
              action: () => {
                this.filter.coachDataSource = 3
              }
            },
            {
              sonText: "认领",
              action: () => {
                this.filter.coachDataSource = 4
              }
            },
            {
              sonText: "导入",
              action: () => {
                this.filter.coachDataSource = 5
              }
            }
          ]
        },
        {
          navTitle: "私教状态",
          name: "私教状态",
          children: [
            {
              sonText: "全部",
              action: () => {
                this.filter.isTrainer = ""
              }
            },
            {
              sonText: "已办理",
              action: () => {
                this.filter.isTrainer = 1
              }
            },
            {
              sonText: "未办理",
              action: () => {
                this.filter.isTrainer = 0
              }
            }
          ]
        }
      ],
      headerData: [
        {
          dataText: "总人数",
          dataNum: "0"
        },
        {
          dataText: "已办理",
          dataNum: "0"
        },
        {
          dataText: "未办理",
          dataNum: "0"
        }
      ],
      filter: {
        addTimeStart: "",
        addTimeEnd: "",
        namePhone: "",
        coachDataSource: "",
        isTrainer: ""
      }
    };
  },
  mixins: [colorMixin, listPageMixin],
  components: {
    staffCoachItem,
    headerSearch,
    headerData,
    filterNav,
    noneResult
  },
  mounted() {
    this.refreshList();
  },
  methods: {
    searchChange(event) {
      this.filter.namePhone = event;
    },
    loadData() {
      let that = this;
      return new Promise(function(resolve) {
        var _data = Object.assign(
          {},
          {
            pageNo: that.page,
            searchStore: that.selectedStore.storeId
          },
          that.filter
        );
        HttpRequest({
          url: '/mobile/coach/static/count/student',
          data: _data,
          success(res) {
            that.headerData[1].dataNum = res.data.data.transactedCount
            that.headerData[2].dataNum = res.data.data.noTransactCount
          }
        })
        HttpRequest({
          url: "/mobile/coach/student",
          data: _data,
          success(res) {
            if (res.data.code !== 200) {
              return (that.list = []);
            }
            let _res = res.data.data;
            let _data;
            that.headerData[0].dataNum = _res.recCount || 0;
            _data = _res.result.map(async e => {
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
                isSelect: false,
                id: e.customerId,
                sex: e.sex,
                phone: e.phone,
                cover: e.headImgPath
                  ? e.headImgPath
                  : "http://pojun-tech.cn/assets/img/morenTo.png",
                first_1: e.name,
                second_1: e.lastTrackTime ? formatDate(new Date(e.lastTrackTime), 'yyyy/MM/dd hh:mm') : "--",
                second_tip_1: "最近回访时间："
              };
            });
            Promise.all(_data).then(result => {
              resolve(result);
            });
          }
        });
      });
    },
    selectCustomer(item) {
      console.log(item);
    },
    clickIcon(item) {
      wx.makePhoneCall({
        phoneNumber: item.phone
      });
    },
    toDetail(item) {
      wx.navigateTo({
        url: "../customer_detail/main?id=" + item.id
      });
    },
    filterDate(day) {
      let obj = this.filterDateMethod(day);
      this.setDate(obj)
    },
    setDate(obj) {
      this.filter.addTimeStart = obj.startTime;
      this.filter.addTimeEnd = obj.endTime;
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
.my-private-class {
  .class-list {
    .staff-coach-item {
      border-bottom: 1rpx solid #eee;
      flex: 1;
      .coach-info {
        >div {
          line-height: 30px;
        }
      }
      .icon-right {
        img {
          margin-top: 20px;
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
</style>
