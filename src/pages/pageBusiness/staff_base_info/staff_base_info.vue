<template>
  <div class="base-info">
    <van-cell-group custom-class="van-cell-group">
      <van-cell title="昵称" :value="nickName" is-link @click="toModify()" />
      <van-cell title="性别" :value="sex" is-link @click="sexCell()" />
      <van-cell title="手机号" :value="phone" is-link />
    </van-cell-group>
    <van-action-sheet
      :show="showSex"
      :actions="sexAction"
      @close="showSex = false"
      @select="selectSex"
    />
  </div>
</template>


<script>
import { setNavTab, window } from "COMMON/js/common.js";
export default {
  data() {
    return {
      showSex: false,
      sexAction: [
        {
          name: "男"
        },
        {
          name: "女" 
        }
      ],
      nickName: "王老板",
      sex: "男",
      phone: "18111111111"
    };
  },
  mounted() {
    setNavTab();
  },
  methods: {
    toModify() {
      // let cellInfo = {
      //   url: "", // 接口地址
      //   cellText: this.nickName // 当前要改的信息
      // }
      // wx.navigateTo({
      //   url: "../modify_cell/main?cellInfo=" + JSON.stringify(cellInfo)
      // });
    },
    sexCell() {
      // this.showSex = true;
    },
    selectSex(event) {
      // this.showSex = false;
      // this.sex = event.mp.detail.name;
    }
  }
};
</script>

<style lang="less">
page {
  height: 100%;
  background-color: #f6f6f6;
}
</style>
