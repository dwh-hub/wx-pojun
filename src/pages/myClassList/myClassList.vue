<template>
  <div class="my-class-list">
    <div class="team-group" v-if="options.type == 1">
      <team-class-item
        @clickClass="toClassDetail(item)"
        :info="item"
        :isToDetail="false"
        v-for="(item, index) in list"
        :key="index"
        :isTag="true"
      ></team-class-item>
    </div>
    <div class="coach-group" v-else>
      <team-class-item
        @clickClass="toCoachDetail(item)"
        :info="item"
        :isToDetail="false"
        v-for="(item, index) in list"
        :key="index"
        :isTag="true"
      ></team-class-item>
    </div>
    <div class="loading" v-show="isLoading">
      <van-loading color="#999" custom-class="loading"/>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";
import pageFooter from "COMPS/pageFooter.vue"
export default {
  data() {
    return {
      list: [{},{},{},{},{},{}],
      options: {},
      customerId: "",
      page: 1,
      isLoading: false
    };
  },
  components: {
    teamClassItem,
    coachItem,
    pageFooter
  },
  onLoad(options) {
    setNavTab();
    this.customerId = this.userInfo = wx.getStorageSync("userInfo").id;
    console.log(options);
    // type 1 团课 2 私教课
    this.options = options;
    // if (options.type == 1) {
    //   this.getOwnTeamClassList(options.status, options.waitEvaluate);
    // } else if (options.type == 2) {
    //   this.getOwnCoachClassList(options.status, options.waitEvaluate);
    // }
    this.getList();
  },
  onUnload() {
    this.list = [{},{},{},{},{},{}];
    this.page = 1;
  },
  onReachBottom() {
    // if (this.options.type == 1) {
    //   this.getOwnTeamClassList(this.options.status, this.options.waitEvaluate);
    // } else if (this.options.type == 2) {
    //   this.getOwnCoachClassList(this.options.status, this.options.waitEvaluate);
    // }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
    this.getList();
  },
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    getList() {
      // type 1 团课 2 私教课
      if (this.options.type == 1) {
        wx.setNavigationBarTitle({
          title: "我的团课"
        });
        if (this.options.status == 3 && this.options.waitEvaluate == 1) {
          return this.getTWaitEvaluate();
        }
        this.getOwnTeamClassList(
          this.options.status,
          this.options.waitEvaluate
        );
      } else if (this.options.type == 2) {
        wx.setNavigationBarTitle({
          title: "我的私教"
        });
        if (this.options.status == 3 && this.options.waitEvaluate == 1) {
          return this.getWaitEvaluateList();
        }
        this.getOwnCoachClassList(
          this.options.status,
          this.options.waitEvaluate
        );
      }
    },
    /**
     * 获取我的课程 团课列表
     * @param {Number} status 1 待上课 3 已下课
     * @param {Number} waitEvaluate 1 待评价
     */
    getOwnTeamClassList(status, waitEvaluate) {
      let that = this;
      let _data = {};
      if (status == 1) {
        _data = {
          customerId: that.customerId,
          statusType: status,
          pageNo: that.page,
          pageSize: 10
        };
      } else {
        _data = {
          customerId: that.customerId,
          status: status,
          pageNo: that.page,
          pageSize: 10,
          waitEvaluate: waitEvaluate == 0 ? 0 : (waitEvaluate || '')
        };
      }
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/pagesNoLimit",
        data: _data,
        success(res) {
          if (res.data.code === 200) {
            if(that.page == 1) {that.list = []}
            if (!res.data.data.result.length) {
              return;
            }
            that.list = that.list.concat(res.data.data.result);
            that.page++;
          }
        }
      });
    },
    /**
     * 获取我的课程 私教列表
     * @param {Number} status 3 已下课 2 待上课
     * @param {Number} waitEvaluate 1 待评价
     */
    getOwnCoachClassList(status, waitEvaluate) {
      let that = this;
      let _data = {};
      if (status == 2) {
        _data = {
          customerId: that.customerId,
          statusType: status,
          pageNo: that.page,
          pageSize: 10
        };
      } else {
        _data = {
          customerId: that.customerId,
          status: status,
          pageNo: that.page,
          pageSize: 10,
          waitEvaluate: waitEvaluate == 0 ? 0 : (waitEvaluate || '')
        };
      }
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/pages/own",
        data: _data,
        success(res) {
          if (res.data.code === 200) {
            if(that.page == 1) {that.list = []}
            if (!res.data.data.result.length) {
              return;
            }
            let _data = res.data.data.result.map(e => {
              return {
                anotherName: e.projectName,
                userId: e.coachId,
                coachAppointId: e.coachAppointId,
                timeStart: e.timeStart,
                timeEnd: e.timeEnd,
                storeName: e.storeName,
                venueName: e.venueName,
                coachNameArrayStr: e.coachName,
                status: e.status,
                statusChar: e.statusChar
              };
            });
            that.page++;
            that.list = that.list.concat(_data);
          }
        }
      });
    },
    // 获取私教待评价列表
    getWaitEvaluateList() {
      let that = this;
      return new Promise(function(resolve) {
        HttpRequest({
          url: window.api + "/mobile/coach/waitEvaluatePages",
          data: {
            customerId: that.customerId,
            pageNo: that.page,
            pageSize: 10
          },
          success(res) {
            if(that.page == 1) {that.list = []}
            if (res.data.code === 200) {
              that.list = res.data.data.result;
              resolve();
            }
          }
        });
      });
    },
    // 获取团课待评价列表
    getTWaitEvaluate() {
      let that = this;
      return new Promise(function(resolve) {
        HttpRequest({
          url: window.api + "/teamClass/waitEvaluatePages",
          data: {
            customerId: that.customerId,
            pageNo: that.page,
            pageSize: 10
          },
          success(res) {
            if(that.page == 1) {that.list = []}
            if (res.data.code === 200) {
              that.list = res.data.data.result;
              resolve();
            }
          }
        });
      });
    },
    // 跳转团课课程详情
    toClassDetail(item) {
      wx.navigateTo({
        url: "../appointmentResult/main?teamAttendId=" + item.teamAttendId
      });
    },
    // 跳转私教课课程详情
    toCoachDetail(item) {
      wx.navigateTo({
        url: "../appointmentResult/main?coachAppointId=" + item.coachAppointId
      });
    }
  }
};
</script>

<style lang="less">
.my-class-list {
  padding: 15px;
  .team-class-item,
  .coach-item {
    margin-bottom: 15px;
  }
}
</style>


