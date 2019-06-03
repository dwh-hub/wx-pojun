<template>
  <div class="operation_chart">
    <div style="height: 100vh">
      <!-- opts 前面加冒号 -->
      <ff-canvas id="column" canvas-id="column" :opts="opts" />
    </div>
  </div>
</template>

<script>
  import {
    setNavTab,
    window
  } from "COMMON/js/common.js";
  // 这里注意路径，要引入 static 文件夹中的f2.js文件
  import F2 from "../../../../static/f2-canvas/lib/f2";

  let chart = null;

  function initChart(canvas, width, height) {
    // 使用 F2 绘制图表
    const data = [{
        year: "1951 年",
        sales: 38
      },
      {
        year: "1952 年",
        sales: 52
      },
      {
        year: "1956 年",
        sales: 61
      },
      {
        year: "1957 年",
        sales: 145
      },
      {
        year: "1958 年",
        sales: 48
      },
      {
        year: "1959 年",
        sales: 38
      },
      {
        year: "1960 年",
        sales: 38
      },
      {
        year: "1962 年",
        sales: 38
      }
    ];
    chart = new F2.Chart({
      el: canvas,
      width,
      height
    });

    chart.source(data, {
      sales: {
        tickCount: 5
      }
    });
    chart.tooltip({
      showItemMarker: false,
      onShow(ev) {
        const {
          items
        } = ev;
        items[0].name = null;
        items[0].name = items[0].title;
        items[0].value = "¥ " + items[0].value;
      }
    });
    chart.interval().position("year*sales");
    chart.render();
    return chart;
  }

  export default {
    data() {
      return {
        motto: "Hello World",
        opts: {
          // 使用延时初始化 -- 重要
          lazyLoad: true
        }
      };
    },
    components: {},
    mounted() {
      setNavTab();
      // 在 onLoad 内部通过id找到该组件, 然后调用该组件的初始化方法
      this.$mp.page.selectComponent('#column').init(initChart)
    },

    methods: {

    },
  };

</script>

<style lang="less">
</style>
