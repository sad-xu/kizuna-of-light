<template>
  <div ref="relationChartRef" class="chart"></div>
</template>

<script lang="ts" setup>
  // @ts-nocheck

  import { onMounted, ref } from 'vue';
  import { mockRelationData, generateRelationData } from '@/utils/mock';

  const relationChartRef = ref();
  let svg;
  let lines;
  let dots;
  // 所有节点
  let allNodes = new Set();

  /** svg弧线 */
  function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
  }

  /** 拖拽 */
  const drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  };

  const initChart = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const relationData = mockRelationData;
    const types = [1, 2];
    allNodes = new Set(relationData.flatMap((l) => [l.source, l.target]));
    const nodes = Array.from(allNodes);
    const links = relationData.map((d) => Object.create(d));

    const color = d3.scaleOrdinal(types, d3.schemeCategory10);

    const simulation = d3
      .forceSimulation(nodes)
      // .force(
      //   'link',
      //   d3.forceLink(links).id((d) => d.uuid)
      // )
      .force('charge', d3.forceManyBody().strength(-800))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    // 画布
    svg = d3
      .create('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'width: 100%; height: 100%; font: 12px sans-serif;');

    // 定义线的样式
    svg
      .append('defs')
      .selectAll('marker')
      .data(types)
      .join('marker')
      .attr('id', (d) => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -0.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', color)
      .attr('d', 'M0,-5L10,0L0,5');

    // 关系
    const link = svg
      .append('g')
      .attr('id', 'lines')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', (d) => color(d.type))
      .attr('marker-end', (d) => `url(${new URL(`#arrow-${d.type}`, location)})`);

    // 节点
    const node = svg
      .append('g')
      .attr('id', 'dots')
      .attr('fill', 'currentColor')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation));

    node.append('circle').attr('stroke', 'white').attr('stroke-width', 1.5).attr('r', 4);

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.character_name)
      .clone(true)
      .lower();
    // .attr('fill', 'none')
    // .attr('stroke', 'white')
    // .attr('stroke-width', 3);

    lines = link;
    dots = node;
    simulation.on('tick', () => {
      link.attr('d', linkArc);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    relationChartRef.value.append(Object.assign(svg.node(), { scales: { color } }));
    console.log(svg);
  };

  onMounted(() => {
    initChart();
  });

  const addRelation = () => {
    const relationData = generateRelationData(5);
    const types = Array.from(new Set(relationData.map((d) => d.type)));
    const nodes = Array.from(new Set(relationData.flatMap((l) => [l.source, l.target])));
    const links = relationData.map((d) => Object.create(d));
    const color = d3.scaleOrdinal(types, d3.schemeCategory10);
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => d.uuid)
      )
      .force('charge', d3.forceManyBody().strength(-800))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const link = lines
      .data(links)
      .join('path')
      .attr('stroke', (d) => color(d.type))
      .attr('marker-end', (d) => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const node = dots.data(nodes).join('g').call(drag(simulation));

    node.append('circle').attr('stroke', 'white').attr('stroke-width', 1.5).attr('r', 4);

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.character_name)
      .clone(true)
      .lower();

    simulation.on('tick', () => {
      link.attr('d', linkArc);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
    // relationChartRef.value.append(Object.assign(svg.node(), { scales: { color } }));
    console.log(relationData);
  };

  defineExpose({
    addRelation,
  });
</script>

<style lang="scss" scoped>
  .chart {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
