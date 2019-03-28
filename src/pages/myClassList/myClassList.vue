<template>
  <div class="my-class-list">
    <div class="team-group" v-if="options.type == 1">
      <team-class-item
        @clickClass="toClassDetail(item)"
        :info="item"
        :isToDetail="false"
        v-for="(item, index) in list"
        :key="index"
      ></team-class-item>
    </div>
    <div class="coach-group" v-else>
      <coach-item
        @clickCoach="toCoachDetail(item)"
        :info="item"
        :hasBtn="false"
        :isToDetail="false"
        v-for="(item, index) in list"
        :key="index"
      ></coach-item>
    </div>
  </div>
</template>

<script>
import { setNavTab, window, HttpRequest } from "COMMON/js/common.js";
import teamClassItem from "COMPS/teamClassItem.vue";
import coachItem from "COMPS/coachItem.vue";
export default {
  data() {
    return {
      list: [],
      options: {},
      customerId: "",
      page: 1
    };
  },
  components: {
    teamClassItem,
    coachItem
  },
  onLoad(options) {
    setNavTab();
    this.customerId = this.userInfo = wx.getStorageSync("userInfo").id;
    console.log(options);
    // type 1 团课 2 私教课
    this.options = options;
    if (options.type == 1) {
      this.getOwnTeamClassList(options.status, options.waitEvaluate);
    } else if (options.type == 2) {
      this.getOwnCoachClassList(options.status, options.waitEvaluate);
    }
  },
  onUnload() {
    this.list = []
    this.page = 1
  },
  onReachBottom() {
    if (this.options.type == 1) {
      this.getOwnTeamClassList(this.options.status, this.options.waitEvaluate);
    } else if (this.options.type == 2) {
      this.getOwnCoachClassList(this.options.status, this.options.waitEvaluate);
    }
  },
  methods: {
    /**
     * 获取我的课程 团课列表
     * @param {Number} status 1 待上课 3 已下课
     * @param {Number} waitEvaluate 1 待评价
     */
    getOwnTeamClassList(status, waitEvaluate) {
      let that = this;
      HttpRequest({
        url: window.api + "/teamClass/teamAttend/pagesNoLimit",
        data: {
          customerId: that.customerId,
          status: status,
          waitEvaluate: waitEvaluate || "",
          page: that.page
        },
        success(res) {
          if (res.data.code === 200) {
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
      HttpRequest({
        url: window.api + "/mobile/coach/appoint/pages/own",
        data: {
          customerId: that.customerId,
          status: status,
          waitEvaluate: waitEvaluate || "",
          page: that.page
        },
        success(res) {
          if (res.data.code === 200) {
            if (!res.data.data.result.length) {
              return;
            }
            let _data = res.data.data.result.map(e => {
              return {
                userName: e.name,
                userId: e.coachId,
                coachAppointId: e.coachAppointId
              };
            });
            that.page++;
            that.list = that.list.concat(_data);
          }
        }
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


