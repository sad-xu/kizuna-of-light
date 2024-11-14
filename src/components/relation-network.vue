<template>
  <div ref="relationChartRef" class="chart">
    <svg id="svg-chart">
      <defs>
        <marker
          id="arrow-1"
          viewBox="0 -5 10 10"
          refX="15"
          refY="-0.5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path fill="#1f77b4" d="M0,-5L10,0L0,5"></path>
        </marker>
        <marker
          id="arrow-2"
          viewBox="0 -5 10 10"
          refX="15"
          refY="-0.5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path fill="#ff7f0e" d="M0,-5L10,0L0,5"></path>
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
  // @ts-nocheck
  import { onMounted, ref } from 'vue';
  import { mockRelationData, generateRelationData } from '@/utils/mock';

  const relationChartRef = ref();
  let svg;
  // 节点svg
  let gNodes;
  let gLinks;
  // 节点数据
  let allNodesId = new Set();
  const allNodes = [];
  const allLinks = [];
  // 力模拟
  let forceSimulation;
  // 线的类型
  const lineColor = { 1: '#1f77b4', 2: '#ff7f0e' };

  /** 拖拽处理 */
  const onDrag = (simulation) => {
    return d3
      .drag()
      .on('start', (e, d) => {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on('end', (e, d) => {
        if (!e.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  };

  /** 绘制关系线 */
  const drawLine = () => {
    gLinks = gLinks
      .data(allLinks)
      .enter()
      .append('path')
      .attr('stroke', (d) => lineColor[d.type])
      .attr('marker-end', (d) => `url(#arrow-${d.type})`)
      .merge(gLinks);
  };

  /** 绘制点 */
  const drawPoint = () => {
    gNodes = gNodes.data(allNodes).enter().append('g').merge(gNodes).call(onDrag(forceSimulation));
    // .on('mouseover', function (d, i) {
    //   d3.select(this)
    //     .selectAll('circle')
    //     .transition()
    //     .duration(250)
    //     .style('cursor', 'none')
    //     .attr('r', 8)
    //     .attr('fill', '#C61C6F');
    //   d3.select(this)
    //     .select('text')
    //     .transition()
    //     .duration(250)
    //     .style('cursor', 'none')
    //     .attr('font-size', '1.5em')
    //     .attr('x', 15)
    //     .attr('y', 5);
    // })
    // .on('mouseout', function (d, i) {
    //   d3.select(this)
    //     .selectAll('circle')
    //     .transition()
    //     .duration(250)
    //     .attr('r', 5)
    //     .attr('fill', '#fff');
    //   d3.select(this)
    //     .select('text')
    //     .transition()
    //     .duration(250)
    //     .attr('font-size', '1em')
    //     .attr('x', 8)
    //     .attr('y', 4);
    // })

    gNodes.append('circle').attr('stroke', 'white').attr('stroke-width', 1.5).attr('r', 4);
    gNodes
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.character_name);
  };

  /** 初始化 */
  const initChart = (relationData: any) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodesSet = new Set(relationData.flatMap((l) => [l.source, l.target]));
    allNodesId = new Set(Array.from(nodesSet.keys()).map((item) => item.uuid));
    const nodes = Array.from(nodesSet);
    const links = relationData.map((d) => Object.create(d));
    allNodes.push(...nodes);
    allLinks.push(...links);

    forceSimulation = d3
      .forceSimulation(allNodes)
      .force(
        'link',
        d3.forceLink(allLinks).id((d) => d.uuid)
      )
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(0, 0))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    // 画布
    svg = d3
      .select('#svg-chart')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'width: 100%; height: 100%; font: 12px sans-serif;');

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (e) => {
          svg.select('#lines').attr('transform', e.transform);
          svg.select('#dots').attr('transform', e.transform);
        })
    );

    // 关系
    gLinks = svg
      .append('g')
      .attr('id', 'lines')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path');

    drawLine();

    // 节点
    gNodes = svg
      .append('g')
      .attr('id', 'dots')
      .attr('fill', 'currentColor')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g');

    drawPoint();

    forceSimulation.on('tick', () => {
      gLinks.attr('d', (d) => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `M${d.source.x},${d.source.y} A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      gNodes.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  };

  onMounted(() => {
    initChart(mockRelationData);
  });

  // 添加节点和联系
  const addRelation = () => {
    const relationData = generateRelationData(allNodes, 5);
    console.log(relationData);
    new Set(relationData.flatMap((l) => [l.source, l.target])).forEach((item) => {
      if (!allNodesId.has(item.uuid)) {
        allNodesId.add(item.uuid);
        allNodes.push(item);
        console.log(item);
      }
    });

    allLinks.push(...relationData.map((d) => Object.create(d)));

    drawPoint();
    drawLine();

    forceSimulation.nodes(allNodes);
    forceSimulation.force('link').links(allLinks);
    forceSimulation.alpha(1).restart();
  };

  defineExpose({
    addRelation,
  });
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
