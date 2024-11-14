<template>
  <div ref="relationChartRef" class="chart">
    <div ref="chartRef" style="height: 100%"></div>
  </div>
</template>

<script lang="ts" setup>
  // @ts-nocheck
  import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts/core';
  import { GraphChart } from 'echarts/charts';
  import { CanvasRenderer } from 'echarts/renderers';
  import {
    TooltipComponent,
    GridComponent,
    LegendComponent,
    // VisualMapComponent,
    DataZoomComponent,
    // GraphicComponent,
  } from 'echarts/components';
  import { mockAllUser, mockRelationData, generateRelationData } from '@/utils/mock';

  echarts.use([
    TooltipComponent,
    GridComponent,
    LegendComponent,
    GraphChart,
    CanvasRenderer,
    DataZoomComponent,
  ]);

  const chartRef = ref();
  let chartInstance = null;
  let originOptions = {};

  let allNodes = [];
  let allLinks = [];
  let allNodesId = new Set();

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
    }

    allNodes = [...mockAllUser];
    allLinks = [...mockRelationData];
    allNodesId = new Set(mockAllUser.map((item) => item.name));
    console.log(allNodes, allLinks);

    // TODO: 点击节点展开收起下级
    // TODO: 只展示节点的tooltip
    initChart({
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          legendHoverLink: false,
          layout: 'force',
          draggable: true,
          force: {
            edgeLength: [30, 60],
            repulsion: 50,
            gravity: 0.2,
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 10,
          // categories: [
          //   { name: 'A' },
          //   { name: 'B' },
          //   { name: 'C' },
          // ],
          tooltip: {},
          data: allNodes,
          links: allLinks,
          roam: true,
          label: {
            position: 'right',
            formatter: '{b}',
          },
          lineStyle: {
            curveness: 0.3,
            width: 2,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10,
            },
          },
        },
      ],
    });
  });

  /** 组件销毁前清除实例 */
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    chartInstance?.dispose();
  });

  /** 动态添加新节点 */
  const addRelation = () => {
    const relationData = generateRelationData(allNodes, 4);
    relationData.forEach((item) => {
      allLinks.push({
        source: item.source.name,
        target: item.target.name,
        lineStyle: item.lineStyle,
      });

      if (!allNodesId.has(item.source.name)) {
        allNodesId.add(item.source.name);
        allNodes.push(item.source);
        console.log(item.source.name);
      }
      if (!allNodesId.has(item.target.name)) {
        allNodesId.add(item.target.name);
        allNodes.push(item.target);
        console.log(item.target.name);
      }
    });
    chartInstance.setOption({
      series: [
        {
          data: allNodes,
          edges: allLinks,
        },
      ],
    });
  };

  defineExpose({
    addRelation,
  });

  // expose({
  //   getInstance,
  //   initChart,
  //   showLoading,
  // });
</script>

<style lang="scss" scoped>
  .chart {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
    left: 0;
    user-select: none;
  }
</style>
