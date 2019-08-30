Component({
  data: {
    keyNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    keyEnInput1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    keyEnInput2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    keyEnInput3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    keyPhone: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    _bottom: "0",
    _keyBoardType: 2,
    isCaps: true,
    capsStr: 'AB'
  },
  properties: {
    bottom: {
      type: Number,
      value: 0
    },
    isShow: {
      type: Boolean,
      value: false
    },
    keyBoardType: {
      type: Number,
      value: 2
    },//键盘样式 “1” 为数字英文键盘 “2” 为数字键盘
    // backgroundColor: {
    //   type: String,
    //   value: "#fff"
    // },
    // onInputChange: {
    //   type: Function,
    //   value: (val) => { }
    // },
    // onIputdelete: {
    //   type: Function,
    //   value: () => { }
    // },
    // onInputOk: {
    //   type: Function,
    //   value: () => { }
    // },
    isAdaptive: {
      type: Boolean,
      value: false
    },
    // onLongPressDelete: {
    //   type: Function,
    //   value: () => { }
    // },
  },
  attached() {
    let that = this
    this.setData({
      _keyBoardType: that.keyBoardType
    })
    this.computedSafe()
  },
  observers: {
    isAdaptive: function(isAdaptive) {
      this.computedSafe()
    }
  },
  methods: {
    computedSafe() {
      let that = this
      if (this.data.isAdaptive) {
        this.setData({
          _bottom: Number(that.data.bottom) + 36
        })
      } else {
        this.setData({
          _bottom: that.data.bottom
        })
      }
    },
    switchKeyboard: function (event) {
      let val = this.data._keyBoardType == 1 ? 2 : 1
      this.setData({
        _keyBoardType: val
      })
    },
    switchCaps: function () {
      let that = this
      this.setData({
        isCaps: !that.data.isCaps
      })
      let keyEnInput1 = this.data.keyEnInput1
      let keyEnInput2 = this.data.keyEnInput2
      let keyEnInput3 = this.data.keyEnInput3
      if (this.data.isCaps) {
        keyEnInput1 = keyEnInput1.map(e => {
          e = e.toUpperCase()
          return e
        })
        keyEnInput2 = keyEnInput2.map(e => {
          e = e.toUpperCase()
          return e
        })
        keyEnInput3 = keyEnInput3.map(e => {
          e = e.toUpperCase()
          return e
        })
      } else {
        keyEnInput1 = keyEnInput1.map(e => {
          e = e.toLowerCase()
          return e
        })
        keyEnInput2 = keyEnInput2.map(e => {
          e = e.toLowerCase()
          return e
        })
        keyEnInput3 = keyEnInput3.map(e => {
          e = e.toLowerCase()
          return e
        })
      }
      this.setData({
        capsStr: that.data.isCaps ? 'AB' : 'ab',
        keyEnInput1: keyEnInput1,
        keyEnInput2: keyEnInput2,
        keyEnInput3: keyEnInput3,
      })
    },
    vehicleTap: function (event) {
      let val = event.target.dataset.value;
      console.log(val)
      switch (val) {
        case 'delete':
          this.triggerEvent("onIputdelete");
          break;
        default:
          this.triggerEvent("onInputChange", val);
      }
    },
    longPressDelete() {
      //长按清除
      this.triggerEvent("onLongPressDelete");
    },
  }
});