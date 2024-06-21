<template>
  <div>
    aaa
    <button @click="test1">button1</button>
    <button @click="test">button</button>
    <relation-network></relation-network>
  </div>
</template>

<script lang="ts" setup>
  import { getTestData } from './api/base';
  import RelationNetwork from './components/relation-network.vue';

  if (!('EventSource' in window)) {
    alert('当前浏览器不支持EventSource，请更换浏览器');
  }

  const test1 = () => {
    getTestData();
  };

  const test = () => {
    const eventSource = new EventSource('/api/base/sse-spider');
    // 单人爬取开始
    eventSource.addEventListener('partStart', (e) => {
      const num = +e.data;
      console.log('partStart', num);
    });
    // 返回每次爬取的关注数据
    eventSource.addEventListener('follows', (e) => {
      const d = JSON.parse(e.data);
      console.log('follows', d);
    });
    // 返回每次爬取的粉丝数据
    eventSource.addEventListener('fans', (e) => {
      const d = JSON.parse(e.data);
      console.log('fans', d);
    });
    // 单人爬取结束
    eventSource.addEventListener('partEnd', (e) => {
      const num = +e.data;
      console.log('partEnd', num);
    });
    // 结束
    eventSource.addEventListener('end', (e) => {
      console.log('end');
      eventSource.close();
    });
    eventSource.onerror = (e) => {
      console.log(e);
      eventSource.close();
    };
  };
</script>

<style lang="scss" scoped></style>
