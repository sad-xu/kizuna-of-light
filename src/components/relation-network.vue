<template>
  <div ref="relationChartRef" class="chart"></div>
</template>

<script lang="ts" setup>
  // @ts-nocheck

  import { onMounted, ref } from 'vue';
  import { mockRelationData, generateRelationData } from '@/utils/mock';

  const relationChartRef = ref();
  let svg;
  let gNodes;
  let gLinks;
  // 所有节点id
  let allNodesId = new Set();
  const allNodes = [];
  const allLinks = [];
  // 线的类型
  const lineType = [1, 2];
  const lineColor = d3.scaleOrdinal(lineType, d3.schemeCategory10);
  let forceSimulation;

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
      .data(lineType)
      .join('marker')
      .attr('id', (d) => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -0.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', lineColor)
      .attr('d', 'M0,-5L10,0L0,5');

    // 关系
    gLinks = svg
      .append('g')
      .attr('id', 'lines')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(allLinks)
      .join('path')
      .attr('stroke', (d) => lineColor(d.type))
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    // 节点
    gNodes = svg
      .append('g')
      .attr('id', 'dots')
      .attr('fill', 'currentColor')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(allNodes)
      .join('g')
      .on('mouseover', function (d, i) {
        d3.select(this)
          .selectAll('circle')
          .transition()
          .duration(250)
          .style('cursor', 'none')
          .attr('r', 8)
          .attr('fill', '#C61C6F');

        d3.select(this)
          .select('text')
          .transition()
          .duration(250)
          .style('cursor', 'none')
          .attr('font-size', '1.5em')
          .attr('x', 15)
          .attr('y', 5);
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .selectAll('circle')
          .transition()
          .duration(250)
          .attr('r', 5)
          .attr('fill', '#fff');

        d3.select(this)
          .select('text')
          .transition()
          .duration(250)
          .attr('font-size', '1em')
          .attr('x', 8)
          .attr('y', 4);
      })
      .call(drag(forceSimulation));

    gNodes.append('circle').attr('stroke', 'white').attr('stroke-width', 1.5).attr('r', 4);
    gNodes
      .append('text')
      .attr('x', 8)
      .attr('y', 4)
      .text((d) => d.character_name);

    forceSimulation.on('tick', ticked);

    relationChartRef.value.append(Object.assign(svg.node(), { scales: { color: lineColor } }));
    console.log(gNodes);
  };

  onMounted(() => {
    initChart(mockRelationData);
  });

  /** 力更新 */
  function ticked() {
    gLinks.attr('d', (d) => {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
      return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
      `;
    });
    gNodes.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  const addRelation = () => {
    const relationData = generateRelationData(5);
    new Set(relationData.flatMap((l) => [l.source, l.target])).forEach((item) => {
      if (!allNodesId.has(item.uuid)) {
        allNodesId.add(item.uuid);
        allNodes.push(item);
        console.log(item);
      }
    });

    const links = relationData.map((d) => Object.create(d));
    allLinks.push(...links);

    gNodes = gNodes.data(allNodes).enter().append('g').call(drag(forceSimulation));
    gNodes.append('circle').attr('stroke', 'white').attr('stroke-width', 1.5).attr('r', 4);
    gNodes
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.character_name);

    gLinks = gLinks
      .data(allLinks)
      .enter()
      .append('path')
      .attr('stroke', (d) => lineColor(d.type))
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    forceSimulation.nodes(allNodes);
    forceSimulation.force('link').links(allLinks);
    forceSimulation.restart();

    forceSimulation.on('tick', ticked);

    // relationChartRef.value.append(Object.assign(svg.node(), { scales: { color: lineColor } }));
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
    right: 0;
    bottom: 0;
    /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
    left: 0;
    user-select: none;
  }
</style>
