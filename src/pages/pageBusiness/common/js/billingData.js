import {
  formatDate
} from "COMMON/js/common.js";

let billingData = {
  billingType: 0,
  isTeachingContract: 0, // 是否是教学合同 0 1 私教团课是 1
  teachCardType: '', // 0 会籍 1 团课 2 私教 3 储值卡
  storeList: [],
  selectedStore: {},
  condition: "",
  searchCustomerList: [],
  showStoreList: false,
  searching: false,
  showSearch: true,
  showVerify: false,
  showCustomerInfo: false,
  showCardList: false,
  selectedCustomer: {}, // 选中的客户信息
  cardList: [],
  cardLabelList: [],
  saleList: [],
  storeSetting: {}, // isAddCardCode 1 需要验证
  CDTime: 0, // 倒计时
  isSend: false,
  verifyCode: '',
  cardName: '', // 选择的卡名字
  showCardForm: false,
  constCardInfo: {}, // 缓存一份卡信息
  constGiveAwayAuthority: '',
  isShowSalePriceTip: false, // 会员卡总价限制tip
  isShowGifTip: false, // 赠送次数限制tip
  isShowlimtDate: false, // 有效期限制tip
  selectedCard: {}, // 选中的卡
  date: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 办理日期
  isPickerShow: false,
  pickerConfig: {
    endDate: false,
    column: "second",
    dateLimit: true,
    initStartTime: "2019-01-01",
    initEndTime: "2019-12-01"
  },
  pactId: '', // 合同编号
  cardLabel: {},
  showActionsList: false,
  actionType: '', // actionsheet 当前的类型
  actionsList: [],
  selectedLable: {}, // 选择的合同标签
  selectedSale: {}, // 选择的销售
  selectedSource: {}, // 合同来源
  selectedCoach: {}, // 教练
  sourceList: [{
      name: "AS邀约到场",
      value: 1
    },
    {
      name: "BR会员转介",
      value: 2
    },
    {
      name: "DI发单潜在",
      value: 3
    },
    {
      name: "WI轮排到访",
      value: 4
    },
    {
      name: "TI电话咨询",
      value: 5
    },
    {
      name: "GP单页到访",
      value: 6
    },
    {
      name: "线上获客",
      value: 8
    },
    {
      name: "pos模式",
      value: 9
    },
    {
      name: "续卡",
      value: 10
    },
    {
      name: "其他",
      value: 7
    }
  ],
  cardSetList: [], // 合同设置
  curCardSet: {}, // 当前选中的合同设置
  cardNum: "", // 卡号
  isNeedCardNum: true, // 是否需要卡号
  payCardType: 1, // 开卡方式
  payCardStartDate: '', // 开卡日期
  payCardEndDate: '',
  isSelectCard: false,
  isNothingCustomer: false,
  showImgList: [], // 图片预览地址列表
  uploadImgList: [], // 图片上传列表
  time: "",
  token: "",
  showEntryBox: "",
  remarks: "",
  canpayment: 0, // 是否可退定金
  depositSellingPrice: '', // 付款金额
}

export default billingData
