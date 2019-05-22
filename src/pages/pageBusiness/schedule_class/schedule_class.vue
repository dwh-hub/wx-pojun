<template>
  <div class="schedule-class">
    <div class="item-group">
      <div class="item-cell">
        <div class="cell-left">课程名称</div>
        <div class="cell-right"></div>
      </div>
      <div class="item-cell">
        <div class="cell-left">上课场地</div>
        <div class="cell-right"></div>
      </div>
      <div class="item-cell">
        <div class="cell-left">课程时长</div>
        <div class="cell-right">
          <div class="input-wrapper">
            <input type="text" v-model="classTime">
            <span>分</span>
          </div>
        </div>
      </div>
      <div class="item-cell">
        <div class="cell-left">上课教练</div>
        <div class="cell-right"></div>
      </div>
    </div>
    <div class="item-group">
      <div class="item-cell">
        <div class="cell-left">课程周期</div>
        <div class="cell-right"></div>
      </div>
    </div>

    <div class="cell-son">
      <div class="class-cycle">
        
      </div>
    </div>
    <div class="item-group">
      <div class="item-cell">
        <div class="cell-left">是否收费</div>
        <div class="cell-right">
          <van-radio-group :value="isCharge" @change="onChangeCharge" custom-class="radio-group">
            <van-radio custom-class="radio" name="2">免费</van-radio>
            <van-radio custom-class="radio" name="1">收费</van-radio>
          </van-radio-group>
          <div class="input-wrapper">
            <input type="text" v-model="cost">
            <span>元/人</span>
          </div>
        </div>
      </div>
    </div>
    <div class="item-group">
      <div class="item-cell">
        <div class="cell-left">是否预约</div>
        <div class="cell-right">
          <van-radio-group :value="isAppoint" @change="onChangeAppoint" custom-class="radio-group">
            <van-radio custom-class="radio" name="1">是</van-radio>
            <van-radio custom-class="radio" name="2">否</van-radio>
          </van-radio-group>
        </div>
      </div>
    </div>
    <div class="cell-son">
      <div class="item-cell">
        <div class="cell-left">预约人数</div>
        <div class="cell-right">
          <van-radio-group :value="isLimit" @change="onChangeLimit" custom-class="radio-group">
            <van-radio custom-class="radio" name="2">不限</van-radio>
            <van-radio custom-class="radio" name="1">限制</van-radio>
          </van-radio-group>
          <div class="input-wrapper">
            <input type="text" v-model="appointNum">
            <span>人</span>
          </div>
        </div>
      </div>

      <div class="item-cell">
        <div class="cell-left">预约时间</div>
        <div class="cell-right">
          <van-radio-group
            :value="isLimitTime"
            @change="onChangeAppointTime"
            custom-class="radio-group"
          >
            <van-radio custom-class="radio" name="2">不限</van-radio>
            <van-radio custom-class="radio" name="1">限制</van-radio>
          </van-radio-group>
          <div class="input-wrapper">
            <span>开课前</span>
            <input type="text" v-model="limitTime">
            <span>分</span>
          </div>
        </div>
      </div>

      <div class="item-cell">
        <div class="cell-left">取消预约</div>
        <div class="cell-right">
          <van-radio-group
            :value="isLimitCanceTime"
            @change="onChangeAppointCancelTime"
            custom-class="radio-group"
          >
            <van-radio custom-class="radio" name="2">不限</van-radio>
            <van-radio custom-class="radio" name="1">限制</van-radio>
          </van-radio-group>
          <div class="input-wrapper">
            <span>开课前</span>
            <input type="text" v-model="limitCancelTime">
            <span>分</span>
          </div>
        </div>
      </div>
    </div>
    <div class="item-group">
      <div class="item-cell">
        <div class="cell-left">上课名单</div>
        <div class="cell-right"></div>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="cancel">取消</div>
      <div class="confirm" @click="confirmSchedule">确认排课</div>
    </div>
    <van-dialog id="van-dialog"/>
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import { setNavTab, window } from "COMMON/js/common.js";
import Dialog from "../../../../static/vant/dialog/dialog";
import Toast from "../../../../static/vant/toast/toast";
export default {
  data() {
    return {
      isCharge: "2", // 是否收费
      cost: "", // 收费价格
      classTime: "", // 课程时间
      isAppoint: "1", // 是否预约
      isLimit: "2", // 是否限制
      appointNum: "", // 预约人数
      isLimitTime: "1",
      limitTime: "",
      isLimitCanceTime: "2",
      limitCancelTime: ""
    };
  },
  mounted() {
    setNavTab();
  },
  methods: {
    onChangeCharge(event) {
      this.isCharge = event.mp.detail;
    },
    onChangeAppoint(event) {
      this.isAppoint = event.mp.detail;
    },
    onChangeLimit(event) {
      this.isLimit = event.mp.detail;
    },
    onChangeAppointTime(event) {
      this.isLimitTime = event.mp.detail;
    },
    onChangeAppointCancelTime(event) {
      this.isLimitCanceTime = event.mp.detail;
    },
    confirmSchedule() {
      Dialog.confirm({
        message: "确认提示？",
        asyncClose: true
      })
        .then(() => {
          setTimeout(() => {
            Dialog.close();
            Toast("排课成功");
          }, 1000);
        })
        .catch(() => {
          Dialog.close();
        });
    }
  }
};
</script>

<style lang="less">
@import "../common/less/staff_common.less";
page {
  height: 100%;
  background-color: #f6f6f6;
}
.schedule-class {
  .item-group {
    margin-top: 5px;
    padding: 10px 0;
    background-color: #fff;
  }
  .cell-son {
    background-color: #fff;
    padding: 5px 10px;
    margin: 5px 10px;
    border: 1px solid #eee;
  }
  .bottom-btn {
    display: flex;
    > div {
      flex: 1;
      line-height: 36px;
    }
    .cancel {
      color: #333;
      background-color: #fff;
    }
    .confirm {
      color: #fff;
      background-color: #2a82e4;
    }
  }
  .input-wrapper {
    display: flex;
    height: 25px;
    margin-top: 5px;
    border-bottom: 1px solid #eee;
    > input {
      display: inline-block;
      width: 50px;
    }
  }
}
</style>
