<template>
  <div class="appointmentCards">
    <div class="coach">
      <div class="cover">
        <img src="https://www.pojun-tech.cn/assets/img/morenm.png" alt>
      </div>
      <div class="text">正在预约教练$名字$课程</div>
    </div>
    <div class="costCar">
      <div class="title">可预约合同</div>
      <div class="cards">
        <card></card>
      </div>
    </div>
    <div class="costCarno">
      <div class="title">可预约合同</div>
    </div>
  </div>
</template>

<script>
import card from "COMPS/card";
export default {
  data() {
    return {};
  },
  components: {
    card
  }
};
</script>

<style lang="less">
@import "~COMMON/less/reset";

.appointmentCards {
  padding: 0 15px;
  .coach {
    .cover {
      text-align: center;
      > img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
      }
    }
    .text {
      margin-top: 20px;
      margin-bottom: 15px;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
  }
  .costCar,
  .costCarno {
    .title {
      margin: 15px 0;
    }
    .cards {
      box-sizing: border-box;
      padding-left: 20px;
      padding-right: 10px;
    }
  }
}
</style>


