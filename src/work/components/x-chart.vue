<template>
  <div class="chart-wrapper">
    <div ref="chartRef" style="height: 100%"></div>
  </div>
</template>

<script lang="js">
  import * as echarts from 'echarts/core';
  import {  LineChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent,
    DataZoomComponent,
    GraphicComponent,
  } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  // 注册必须的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent,
    LineChart,
    CanvasRenderer,
    DataZoomComponent,
    GraphicComponent,
  ]);

  echarts.connect('group1');

  export default {
    setup(props, { expose }) {
      const chartRef = ref();
      const exportChartRef = ref();

      // 是否在导出
      const isExporting = ref(false);

      let chartInstance = null;

      let originOptions = {};

      /** 获取当前实例 */
      const getInstance = () => {
        return chartInstance;
      };

      /** 手动触发loading */
      const showLoading = () => {
        chartInstance?.showLoading('default', {
          text: '',
          color: '#3e62fd',
          lineWidth: 3,
          spinnerRadius: 10,
        });
      };

      /** 尺寸自适应 */
      const handleResize = () => {
        chartInstance?.resize();
      };

      /** 画图 */
      const initChart = (options) => {
        originOptions = {
          ...{
            color: [
              '#165DFF',
              '#2FBAFF',
              '#34FEBB',
              '#33FF32',
              '#BAFF33',
              '#FFBB32',
              '#FF3333',
              '#FF33BB',
              '#BA33FF',
              '#0050B3',
              '#BED700',
              '#F1AD00',
              '#B7EB8F',
              '#016E3B',
              '#9F7B00',
              '#531DAB',
              '#00AE97',
              '#CACC2F',
              '#D9363E',
            ],
          },
          ...options,
        };

        if (chartInstance) {
          chartInstance.clear(); // 清空当前图形，否则会合并
          chartInstance.hideLoading();
          chartInstance.setOption(originOptions);
        } else {
          const el = chartRef.value;
          if (el) {
            chartInstance = echarts.init(el);
            chartInstance.setOption(originOptions);
            window.addEventListener('resize', handleResize);
          }
        }
      };

      /** 挂载后初始化实例 */
      onMounted(() => {
        if (!chartInstance) {
          const el = chartRef.value;
          if (el) {
            chartInstance = echarts.init(el);
            window.addEventListener('resize', handleResize);
          }
          // showLoading();
        }
      });

      /** 组件销毁前清除实例 */
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        chartInstance?.dispose();
      });

      expose({
        getInstance,
        initChart,
        showLoading,
      });

      return {
        chartRef,
        exportChartRef,
        isExporting,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .chart-wrapper {
    position: relative;
    height: 100%;
  }
</style>
