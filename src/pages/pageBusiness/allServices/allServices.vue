<template>
  <div class="all-services">
    <div class="icon-group" v-for="(item,index) in iconList" :key="index">
      <div class="icon-title">{{item.title}}</div>
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
          title: "工作台",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/workbench_icon_1.svg",
              text: "业务",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/workbench_icon_2.svg",
              text: "签到",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/workbench_icon_3.svg",
              text: "确认信息",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/workbench_icon_4.svg",
              text: "商品",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/workbench_icon_5.svg",
              text: "营销",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/workbench_icon/workbench_icon_6.jpg",
              text: "客户约访",
              navUrl: "../customer_interview/main"
            }
          ]
        },
        {
          title: "会员服务",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/member_service_icon_1.svg",
              text: "会员",
              navUrl: "../customer/main"
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/member_service_icon_2.svg",
              text: "学员",
              navUrl: "../coach_student/main"
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/member_service_icon_3.svg",
              text: "合同",
              navUrl: "../contract_list/main"
            }
          ]
        },
        {
          title: "课程",
          list: [
            {
              iconUrl: "/static/images/staff/workbench_icon/class_icon_1.svg",
              text: "团课",
              navUrl: "../staff_team_class/main"
            },
            {
              iconUrl: "/static/images/staff/workbench_icon/class_icon_2.svg",
              text: "私教",
              navUrl: "../private_coach_class/main"
            }
          ]
        },
        {
          title: "销售管理",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/sale_manage_icon_1.svg",
              text: "销售CRM",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/sale_manage_icon_2.svg",
              text: "客户公海",
              navUrl: "../public_sea/main"
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/sale_manage_icon_3.svg",
              text: "销售分配",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/sale_manage_icon_4.svg",
              text: "销售工作分析表",
              navUrl: ""
            },
            {
              iconUrl:"/static/images/staff/workbench_icon/sale_manage_icon_6.jpg",
              text: "跟进日志",
              navUrl: "../follow_up_log/main?trackUserType=1"
            }
          ]
        },
        {
          title: "教练服务",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/coach_service_icon_1.svg",
              text: "团课排课",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/coach_service_icon_2.svg",
              text: "教练分配",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/coach_service_icon_3.svg",
              text: "教练跟进表",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/coach_service_icon_4.svg",
              text: "课时统计报表",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/coach_service_icon_5.svg",
              text: "上课统计报表",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/coach_service_icon_6.svg",
              text: "教练CRM",
              navUrl: ""
            },
            {
              iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_7.jpg",
              text: "跟进日志",
              navUrl: "../follow_up_log/main?trackUserType=2"
            }
          ]
        },
        {
          title: "运营报表",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/operation_report_icon_1.svg",
              text: "运营报表",
              navUrl: "../operation_chart/main"
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/operation_report_icon_2.svg",
              text: "业绩报表",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/operation_report_icon_3.svg",
              text: "课程报表",
              navUrl: "../operation_chart/main?nav=1"
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/operation_report_icon_4.svg",
              text: "评分报表",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/operation_report_icon_5.svg",
              text: "签到报表",
              navUrl: ""
            }
          ]
        },
        {
          title: "场馆管理",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/field_manage_icon_1.svg",
              text: "门店",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/field_manage_icon_2.svg",
              text: "手牌",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/field_manage_icon_3.svg",
              text: "短信",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/field_manage_icon_4.svg",
              text: "标签",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/field_manage_icon_5.svg",
              text: "设备管理",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/field_manage_icon_6.svg",
              text: "公告",
              navUrl: ""
            }
          ]
        },
        {
          title: "员工管理",
          list: [
            {
              iconUrl:
                "/static/images/staff/workbench_icon/staff_manage_icon_1.svg",
              text: "待入职人员",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/staff_manage_icon_2.svg",
              text: "人事",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/staff_manage_icon_3.svg",
              text: "组织架构",
              navUrl: ""
            },
            {
              iconUrl:
                "/static/images/staff/workbench_icon/staff_manage_icon_4.svg",
              text: "公告",
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
  padding-bottom: 30px;
  .icon-group {
    &:first-of-type {
      .icon-title {
        margin-top: 0;
      }
    }
    .icon-title {
      line-height: 24px;
      padding-left: 15px;
      margin-top: 10px;
      font-size: 12px;
      color: #222;
      background-color: #f4f4f4;
    }
    .icon-item {
      padding: 0;
      margin-top: 5px;
      >image {
        width: 50px;
        height: 50px;
      }
      .icon-text {
        margin-top: -12px; 
        font-size: 12px;
      }
    }
  }
}
</style>
