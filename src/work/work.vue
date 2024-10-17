<template>
  <div class="wrapper">
    <div class="menu-wrapper">
      <div class="menu-button" @click="toggleLayout">👁‍🗨</div>
      <div class="menu-button" @click="toggleDiff">δ</div>
      <div class="menu-button" @click="toggleAll">all</div>
    </div>
    <div class="charts" :class="isFulllayout ? 'full-charts' : ''">
      <x-chart ref="chart1Ref" />
      <x-chart ref="chart2Ref" />
      <x-chart ref="chart3Ref" />
      <x-chart ref="chart4Ref" />
      <x-chart ref="chart5Ref" />
    </div>
  </div>
</template>

<script lang="js" setup>
  import {  nextTick, onMounted, ref } from 'vue';
  import XChart from './components/x-chart.vue';
  import authAdminCodeByAuthorJson from './json/auth_admin_code_by_author.json';
  import ywzsAppCodeByAuthorJson from './json/ywzs_app_code_by_author.json';
  import fchCodeByAuthorJson from './json/fch_code_by_author.json';
  import miyeluoCodeByAuthorJson from './json/miyeluo_code_by_author.json';
  import ywzsAdminCodeByAuthorJson from './json/ywzs_admin_code_by_author.json';
  //
  import authAdminCodeJson from './json/auth_admin_code.json';
  import ywzsAppCodeJson from './json/ywzs_app_code.json';
  import fchCodeJson from './json/fch_code.json';
  import miyeluoCodeJson from './json/miyeluo_code.json';
  import ywzsAdminCodeJson from './json/ywzs_admin_code.json';


  const chart1Ref = ref();
  const chart2Ref = ref();
  const chart3Ref = ref();
  const chart4Ref = ref();
  const chart5Ref = ref();

  // 所有图表配置
  const chartConfigList = [
    { ref: chart1Ref, name: '总控管理后台', json: authAdminCodeByAuthorJson, allJson:authAdminCodeJson  },
    { ref: chart2Ref, name: '业务助手app', json: ywzsAppCodeByAuthorJson,allJson:ywzsAppCodeJson },
    { ref: chart3Ref, name: '一码通管理后台', json: fchCodeByAuthorJson,allJson: fchCodeJson},
    { ref: chart4Ref, name: '弥耶罗', json: miyeluoCodeByAuthorJson,allJson: miyeluoCodeJson},
    { ref: chart5Ref, name: '业务助手管理后台', json: ywzsAdminCodeByAuthorJson,allJson: ywzsAdminCodeJson}
  ];

  // 是否显示代码差值
  const showDiff = ref(false);
  // 切换代码显示
  const toggleDiff = () => {
    showDiff.value = !showDiff.value;
    initChart()
  }

  const isFulllayout = ref(true);
  // 切换布局
  const toggleLayout = () => {
    isFulllayout.value = !isFulllayout.value;
    nextTick(() => {
      chartConfigList.forEach(config => {
        config.ref.value.getInstance().resize()
      })
    })
  }

  const isAll = ref(false)
  // 是否显示所有代码
  const toggleAll = () => {
    isAll.value = !isAll.value
    initChart()
  }

  const initChart = () => {
    chartConfigList.forEach(config => {
      const json = isAll.value ? config.allJson : config.json;
      config.ref.value.initChart({
        title: {
          text: config.name,
        },
        xAxis: {
          type: 'time',
          min: 1661731200000,
          max: 1729123200000,
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          top: 50,
          right: 20,
          bottom: 70,
          left: 60,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {},
        dataZoom: [
          {
            type: 'inside',
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
          },
        ],
        series: json.map((d) => {
          let list = []
          if (showDiff.value) {
            const dd = d.data;
             list = [dd[0]];
            for (let i = 1; i < dd.length - 1; i++) {
              list.push([dd[i][0], dd[i][1] - dd[i - 1][1]])
            }
          } else {
            list = d.data
          }

          return {
            name: d.name,
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: { opacity: 0.2 },
            data: list,
          }
        }),
      });
      config.ref.value.getInstance().group = 'group1';
    });
  };

  onMounted(() => {
    initChart();
  });
</script>

<style lang="scss" scoped>
  .wrapper {
    padding: 10px;
  }

  .charts {
    display: flex;
    flex-wrap: wrap;

    > div {
      width: calc(33.3% - 12px);
      height: calc(50vh - 22px);
      margin: 6px;
      border: 1px solid #333;
      border-radius: 4px;
    }
  }

  .full-charts {
    > div {
      width: 100%;
      height: 50vh;
      margin: 6px;
    }
  }

  .menu-wrapper {
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 9;

    .menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin: 4px 0;
      color: #999;
      font-size: 12px;
      text-align: center;
      background-color: #eee;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #eee;
        background-color: #999;
      }
    }
  }
</style>
