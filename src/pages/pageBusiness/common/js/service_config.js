let service = [{
    title: "工作台",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_1.svg",
        text: "业务",
        authorityId: 231,
        navUrl: "../pay_card/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-workbench_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_2.svg",
        text: "签到",
        authorityId: 71,
        navUrl: "../check_in_type/main", // 
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-workbench_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_3.svg",
        text: "客户登记",
        authorityId: 26,
        navUrl: "../customer_register/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-workbench_icon_4"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_4.svg",
        text: "商品",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-workbench_icon_3"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_6.jpg",
        text: "客户约访",
        authorityId: 184,
        navUrl: "../customer_interview/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-workbench_icon_6"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/class_icon_2.svg",
        text: "我的私教",
        authorityId: 63,
        hasAuth: true,
        navUrl: "../my_private_class/main",
        isOpen: true,
        class: "iconfont icon-class_icon_2"
      }
    ]
  },
  {
    title: "会员服务",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/member_service_icon_1.svg",
        text: "客户",
        authorityId: 28,
        navUrl: "../customer/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-member_service_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/member_service_icon_2.svg",
        text: "私教学员",
        authorityId: 64,
        hasAuth: true,
        navUrl: "../coach_student/main",
        isOpen: true,
        class: "iconfont icon-member_service_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/member_service_icon_3.svg",
        text: "合同",
        authorityId: 6,
        navUrl: "../contract_list/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-member_service_icon_2"
      }
    ]
  },
  {
    title: "课程",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/class_icon_1.svg",
        text: "团课",
        authorityId: 275,
        hasAuth: true,
        navUrl: "../staff_team_class/main",
        isOpen: true,
        class: "iconfont icon-class_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/class_icon_2.svg",
        text: "私教",
        authorityId: 152,
        hasAuth: true,
        navUrl: "../private_coach_class/main",
        isOpen: true,
        class: "iconfont icon-class_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_3.svg",
        text: "私教代约",
        navUrl: "../allograph_class/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-coach_service_icon_2"
      }
    ]
  },
  {
    title: "销售管理",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/sale_manage_icon_1.svg",
        text: "销售CRM",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-sale_manage_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/sale_manage_icon_2.svg",
        text: "客户公海",
        authorityId: 54,
        navUrl: "../public_sea/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-sale_manage_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/sale_manage_icon_3.svg",
        text: "销售分配",
        authorityId: 58,
        hasAuth: true,
        navUrl: "../customer/main",
        isOpen: true,
        class: "iconfont icon-sale_manage_icon_3"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/sale_manage_icon_4.svg",
        text: "销售工作分析表",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-sale_manage_icon_4"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/sale_manage_icon_6.jpg",
        text: "跟进日志",
        authorityId: 27,
        hasAuth: true,
        navUrl: "../follow_up_log/main?trackUserType=1",
        isOpen: true,
        class: "iconfont icon-sale_manage_icon_6"
      }
    ]
  },
  {
    title: "教练服务",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_1.svg",
        text: "团课排课",
        authorityId: 288,
        navUrl: "../staff_team_class/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-coach_service_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_2.svg",
        text: "教练分配",
        authorityId: 69,
        hasAuth: true,
        navUrl: "../coach_student/main",
        isOpen: true,
        class: "iconfont icon-coach_service_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_3.svg",
        text: "教练跟进表",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-coach_service_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_4.svg",
        text: "课时统计报表",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-coach_service_icon_4"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_5.svg",
        text: "私教耗课", // 上课统计报表
        authorityId: 300,
        navUrl: "../coach_class_total/main", // 
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-coach_service_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_6.svg",
        text: "教练CRM",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-coach_service_icon_"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/coach_service_icon_7.jpg",
        text: "跟进日志",
        authorityId: 67,
        hasAuth: true,
        navUrl: "../follow_up_log/main?trackUserType=2",
        isOpen: true,
        class: "iconfont icon-coach_service_icon_7"
      }
    ]
  },
  {
    title: "运营报表",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/operation_report_icon_1.svg",
        text: "运营报表",
        authorityId: 88,
        hasAuth: true,
        navUrl: "../operation_chart/main",
        isOpen: true,
        class: "iconfont icon-operation_report_icon_"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/operation_report_icon_2.svg",
        text: "业绩报表",
        authorityId: 222,
        navUrl: "../achievement/main", // 
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-operation_report_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/operation_report_icon_3.svg",
        text: "课程报表",
        authorityId: 89,
        navUrl: "../operation_chart/main?nav=1",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-operation_report_icon_3"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/operation_report_icon_4.svg",
        text: "评分报表",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-operation_report_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/operation_report_icon_5.svg",
        text: "签到报表",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-operation_report_icon_4"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/workbench_icon_5.svg",
        text: "运营日报",
        navUrl: "../daily_paper/main",
        isOpen: true,
        hasAuth: true,
        class: "iconfont icon-operation_report_icon_2"
      }
    ]
  },
  {
    title: "场馆管理",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/field_manage_icon_1.svg",
        text: "门店",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-field_manage_icon_"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/field_manage_icon_2.svg",
        text: "手牌",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-field_manage_icon_5"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/field_manage_icon_3.svg",
        text: "短信",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-field_manage_icon_4"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/field_manage_icon_4.svg",
        text: "标签",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-field_manage_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/field_manage_icon_5.svg",
        text: "设备管理",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-field_manage_icon_3"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/field_manage_icon_6.svg",
        text: "公告",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-field_manage_icon_2"
      }
    ]
  },
  {
    title: "员工管理",
    hasAuth: true,
    list: [{
        iconUrl: "/static/images/staff/workbench_icon/staff_manage_icon_1.svg",
        text: "待入职人员",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-staff_manage_icon_1"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/staff_manage_icon_2.svg",
        text: "人事",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-staff_manage_icon_2"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/staff_manage_icon_3.svg",
        text: "组织架构",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-staff_manage_icon_"
      },
      {
        iconUrl: "/static/images/staff/workbench_icon/staff_manage_icon_4.svg",
        text: "公告",
        navUrl: "",
        isOpen: false,
        hasAuth: true,
        class: "iconfont icon-staff_manage_icon_3"
      }
    ]
  }
]

let authArr = []
let serviceList = []
function filterAuth() {
  if(!wx.getStorageSync("authInto")) {
    return
  }
  let authInto = wx.getStorageSync("authInto")
  
  let _authArr = []
  let _serviceList = []
  
  authInto.forEach(e => {
    _authArr = _authArr.concat(e.authArr)
  })
  authArr = _authArr
  
  console.group("权限过滤的项")
  service.forEach((group) => {
    group.hasAuth = true
    if(group.title == "销售管理" && !_authArr.includes(40)) {
      console.log("销售管理")
      group.hasAuth = false
    }
    if(group.title == "教练服务" && !_authArr.includes(63)) {
      console.log("教练服务")
      group.hasAuth = false
    }
    if(group.title == "运营报表" && !_authArr.includes(89)) {
      console.log("运营报表")
      group.hasAuth = false
    }
    if(group.list.filter(e => !e.isOpen || !e.hasAuth).length == group.list.length) {
      group.hasAuth = false
    }
    group.list.forEach(item => {
      if(item.authorityId) {
        if(_authArr.includes(item.authorityId)) {
          item.hasAuth = true
          _serviceList.push(item)
        } else {
          console.log(item.text)
          item.hasAuth = false
        }
      }
    })
  })
  serviceList = _serviceList
  console.groupEnd()
  return service
}
filterAuth()

// function getUseServiceList() {
//   let useServiceList = []
//   let storageList = wx.getStorageSync('serviceList') || []
//   let usedList = []

//   service.forEach((e) => {
//     e.list.forEach((item) => {
//       if (item.isOpen && !storageList.includes(item.text) && item.hasAuth) {
//         useServiceList.push(item)
//       }
//       if (storageList.includes(item.text)) {
//         usedList.push(item)
//       }
//     })
//   })
//   let list = usedList.concat(useServiceList)
//   list = list.slice(0, 7)
//   list.push({
//     iconUrl: "/static/images/staff/workbench_icon/workbench_icon_4.svg",
//     text: "全部服务",
//     navUrl: "../allServices/main"
//   })
//   return list
// }

function checkAuth(authorityId) {
  return authArr.includes(authorityId)
}

export {
  service,
  serviceList, // 一级list
  // getUseServiceList,
  checkAuth,
  filterAuth
}
