<script>
import {
  setNavTab,
  window,
  HttpRequest,
  formatDate
} from "COMMON/js/common.js";
import store from "@/utils/store.js";
import {EventBus} from '../common/js/eventBus.js'
export default {
  data() {
    return {
      list: [{}, {}, {}, {}],
      isLoading: false,
      isNoMore: false,
      page: 1,
      isPickerShow: false,
      // isPickerRender: false,
      pickerConfig: {
        endDate: true,
        column: "day",
        dateLimit: true,
        initStartTime: "2019-01-01",
        initEndTime: "2019-12-01",
        limitStartTime: "2015-05-06",
        limitEndTime: "2055-05-06"
      },
      unLoading: false,
      storeList: [],
      selectedStore: {}
    };
  },
  mounted() {
    this.storeList = store.state.allStore;
    this.selectedStore = this.storeList.filter(e => e.isDefault)[0] || this.storeList[0];
    this.unLoading = false
    EventBus.$emit('selectedStore', this.selectedStore)
    setNavTab();
    console.log("mixin-end")
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onReachBottom() {
    this.getList();
  },
  onPullDownRefresh() {
    this.list = [{}, {}, {}, {}];
    this.page = 1;
    this.isLoading = false;
    this.isNoMore = false;
    this.getList();
    this.pullDownMethods()
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  watch: {
    filter: {
      handler() {
        this.refreshList();
      },
      deep: true
    }
  },
  methods: {
    pullDownMethods() {},
    getList() {
      if (this.isLoading || this.isNoMore || this.unLoading) {
        return;
      }
      this.isLoading = true;
      this.loadData().then(result => {
        if (!result.length) {
          this.isNoMore = true;
        }
        if (this.page == 1) {
          this.list = result;
        } else {
          this.list = this.list.concat(result);
        }
        wx.stopPullDownRefresh();
        this.isLoading = false;
        this.page++;
      });
    },
    // 请求+数据处理
    loadData() {},
    getAvatar(url) {
      return new Promise(function(resolve, reject) {
        wx.request({
          url: window.api + url,
          success(res) {
            if (res.statusCode == 200) {
              resolve(res.data);
            } else {
              resolve(window.api + "/assets/img/morenTo.png");
            }
          }
        });
      });
    },
    refreshList() {
      this.page = 1;
      this.isNoMore = false;
      this.list = [{}, {}, {}, {}];
      this.getList();
    },
    selectStore(item) {
      this.selectedStore = item;
      this.refreshList()
    },
    filterDateMethod(day) {
      let obj = {
        startTime: "",
        endTime: ""
      };
      if (!day) {
        return obj;
      }
      let date = new Date();
      const DAY = 24 * 60 * 60 * 1000;
      const HOUR8 = 8 * 60 * 60 * 1000;
      let nowStamp = date.getTime();
      let today = date.getDate() - 1;
      let weekday =  date.getDay() == 0 ? 6 : date.getDay() - 1;
      if (day == 1) {
        obj.startTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8),
          "yyyy-MM-dd hh:mm:ss"
        );
        obj.endTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY + DAY - HOUR8 - 1),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (day == 7) {
        obj.startTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - weekday * DAY),
          "yyyy-MM-dd hh:mm:ss"
        );
        obj.endTime = formatDate(
          new Date(
            parseInt(nowStamp / DAY) * DAY - HOUR8 + (7 - weekday) * DAY - 1
          ),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (day == 30) {
        obj.startTime = formatDate(
          new Date(parseInt(nowStamp / DAY) * DAY - HOUR8 - today * DAY),
          "yyyy-MM-dd hh:mm:ss"
        );
        obj.endTime = formatDate(
          new Date(
            parseInt(nowStamp / DAY) * DAY - HOUR8 + (30 - today) * DAY - 1
          ),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      return obj;
    },
    showPicker() {
      this.isPickerShow = true;
    },
    hidePicker() {
      this.isPickerShow = false;
    },
    setPickerTime(val, navIndex, childrenIndex) {
      let data = val.mp.detail;
      let date = data.endTime.split(' ')[0]
      data.endTime = date + " 23:59:59"
      if (childrenIndex) {
        // filter-text 自定义栏写入选择的时间
        let timeStr = data.startTime.split(' ')[0].replace(/-/g, "/") + '-' +data.endTime.split(' ')[0].replace(/-/g, "/")
        this.nav[navIndex].children[childrenIndex].sonText = timeStr
        this.nav[navIndex].navTitle = timeStr
      }

      this.setDate(data)
    },
    getFilter(parmas) {
      this.filter = Object.assign({}, this.filter, parmas);
    }
  }
};
</script>

<style>
</style>
 