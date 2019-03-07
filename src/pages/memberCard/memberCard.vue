<template>
  <div id="memberCard">
    <card @hasClick="toCardDetail"></card>
  </div>
</template>

<script>
import card from 'COMPS/card';
export default {
  data() {
    return {
      cardInfoList: []
    };
  },
  components: {
    card
  },
  methods: {
    toCardDetail(e) {
      console.log(e)
      wx.navigateTo({
        url: '../cardDetail/main'
      })
    }
  }
};
</script>

<style lang="less">
@import '~COMMON/less/reset';

#memberCard {
  padding: 0 20px;
  padding-top: 15px;
}
</style>


