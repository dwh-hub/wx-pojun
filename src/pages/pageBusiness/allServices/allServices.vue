<template>
  <div class="all-services">
    <div class="icon-wrapper" v-for="(item,index) in iconList" :key="index">
      <div class="subtitle">
        <img class="screening-icon" src="/static/images/staff/title-icon.svg">
        <span class="subtitle-text">{{item.title}}</span>
      </div>
      <div class="common-services icon-wrapper">
        <div
          class="services-item icon-item"
          @click="toNav(item2.navUrl)"
          v-for="(item2,index2) in item.list"
          :key="index2"
        >
          <image mode="aspectFit" :src="item2.iconUrl"></image>
          <div class="services-icon icon-text">{{item2.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setNavTab, window } from "COMMON/js/common.js";
export default {
  data() {
    return {
      iconList: [
        {
          title: "业务",
          list: [
            {
              iconUrl: "/static/images/staff/business_icon_1.svg",
              text: "购买会籍卡",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_2.svg",
              text: "购买私教卡",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_3.svg",
              text: "购买团课卡",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_4.svg",
              text: "转让",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_5.svg",
              text: "升级",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_6.svg",
              text: "补卡",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_7.svg",
              text: "预交定金",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_8.svg",
              text: "退款",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_9.svg",
              text: "",
              navUrl: "请假停卡"
            }
          ]
        },
        {
          title: "客户服务",
          list: [
            {
              iconUrl: "/static/images/staff/customer_icon_1.svg",
              text: "客户",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/customer_icon_2.svg",
              text: "人脸识别",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/customer_icon_3.svg",
              text: "拍照",
              navUrl: ""
            }
          ]
        },
        {
          title: "私教服务",
          list: [
            {
              iconUrl: "/static/images/staff/business_icon_1.svg",
              text: "私教预约",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_2.svg",
              text: "服务教练分配",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_3.svg",
              text: "上课教练分配",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_4.svg",
              text: "私教延期",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/coach_icon_1.svg",
              text: "私教会员",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/coach_icon_2.svg",
              text: "教练crm",
              navUrl: ""
            }
          ]
        },
        {
          title: "销售服务",
          list: [
            {
              iconUrl: "/static/images/staff/business_icon_1.svg",
              text: "销售客户",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_2.svg",
              text: "服务教练分配",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_3.svg",
              text: "会籍卡延期",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/sale_icon_1.svg",
              text: "销售crm",
              navUrl: ""
            }
          ]
        },
        {
          title: "团课服务",
          list: [
            {
              iconUrl: "/static/images/staff/business_icon_1.svg",
              text: "排课",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_2.svg",
              text: "团课签到",
              navUrl: ""
            }
          ]
        },
        {
          title: "场馆管理",
          list: [
            {
              iconUrl: "/static/images/staff/business_icon_1.svg",
              text: "门店设置",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/business_icon_2.svg",
              text: "场馆设置",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/venue_icon_1.svg",
              text: "人事",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/venue_icon_1.svg",
              text: "公告",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/venue_icon_1.svg",
              text: "消息",
              navUrl: ""
            }
          ]
        },
        {
          title: "经营数据",
          list: [
            {
              iconUrl: "/static/images/staff/manage_icon_1.svg",
              text: "营业报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_2.svg",
              text: "会籍卡销售报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_3.svg",
              text: "私教销售报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_4.svg",
              text: "团课销售报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_5.svg",
              text: "卡销售分析",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_6.svg",
              text: "私教上课报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_7.svg",
              text: "入场签到报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_8.svg",
              text: "业绩统计报表",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_9.svg",
              text: "业绩排行榜",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/manage_icon_10.svg",
              text: "客户分析",
              navUrl: ""
            }
          ]
        }
      ]
    };
  },
  mounted() {
    setNavTab();
  },
  methods: {
    toNav(url) {
      if (!url) {
        return;
      }
      wx.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
.all-services {
  .icon-wrapper {
    margin-bottom: 10px;
    .icon-item {
      .icon-text {
        font-size: 12px;
      }
    }
  }
}
</style>
