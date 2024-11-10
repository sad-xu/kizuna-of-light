<template>
  <svg width="800" height="600"></svg>
</template>

<script lang="ts" setup>
  // @ts-nocheck

  import { onMounted, ref } from 'vue';

  let nodes;
  let links;
  let simulation;
  let link;
  let nodeGroup;

  const initChart = () => {
    const width = 800;
    const height = 600;

    // 初始数据
    nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    links = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
      { source: 'C', target: 'A' },
    ];

    // 创建 SVG 容器
    const svg = d3.select('svg');

    // 创建力模拟
    simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 创建节点和链接的容器
    link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link');

    nodeGroup = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(drag(simulation));

    nodeGroup.append('circle').attr('r', 10);

    nodeGroup
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text((d) => d.id);

    // 更新节点和链接的位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  };

  // 拖拽函数
  function drag(simulation) {
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
  }

  // 动态添加节点
  const addRelation = () => {
    const newNode = { id: `Node${nodes.length + 1}` };
    nodes.push(newNode);

    // 添加新的链接（可选）
    const newLink = { source: newNode.id, target: nodes[nodes.length - 2].id };
    links.push(newLink);

    // 更新 DOM 元素
    link = link.data(links).enter().append('line').attr('class', 'link').merge(link);

    nodeGroup = nodeGroup.data(nodes).enter().append('g').merge(nodeGroup).call(drag(simulation));
    nodeGroup.append('circle').attr('r', 10);
    nodeGroup
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text((d) => d.id);

    // 更新力模拟
    simulation.nodes(nodes);
    simulation.force('link').links(links);
    simulation.alpha(1).restart();
  };

  onMounted(() => {
    initChart();
  });

  defineExpose({
    addRelation,
  });
</script>

<style lang="scss">
  .nodes circle {
    fill: steelblue;
    stroke: white;
    stroke-width: 1.5px;
  }

  .nodes text {
    font-size: 12px;
    font-family: Arial, sans-serif;
    fill: white;
  }

  .links {
    stroke: #999;
    stroke-opacity: 0.6;
    stroke-width: 1.5px;
  }
</style>
