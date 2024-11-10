<template>
  <div>
    <div style="position: relative">
      <div style="position: relative; z-index: 9">
        <!-- <button @click="test1">button1</button>
        <button @click="start">开始爬取</button> -->
        <button @click="addRelation">添加关系</button>
      </div>
      <!-- <div ref="logRef" class="log-box">
        <div v-for="(item, i) in logList" :key="i">{{ item }}</div>
      </div> -->
    </div>
    <relation-network ref="relationNetworkRef"></relation-network>
    <!-- <test-box ref="relationNetworkRef"></test-box> -->
    <!-- <test-content></test-content> -->
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { getTestData } from './api/base';
  // import TestContent from './components/test-content.vue';
  import RelationNetwork from './components/relation-network.vue';
  // import TestBox from './components/test.vue';
  // import TestBox from './components/test2.vue';

  if (!('EventSource' in window)) {
    alert('当前浏览器不支持EventSource，请更换浏览器');
  }

  const logList = ref<String[]>([]);
  const logRef = ref();

  const test1 = () => {
    getTestData();
  };

  const addLog = (msg: String) => {
    logList.value.push(msg);
    nextTick(() => {
      logRef.value.scrollTop = logRef.value.scrollHeight;
    });
  };

  const start = () => {
    const eventSource = new EventSource('/api/base/sse-spider?id=10200500');
    // 单人爬取开始
    eventSource.addEventListener('partStart', (e) => {
      const num = +e.data;
      console.log('partStart', num);
      addLog(`▶️第${num}人爬取开始...`);
    });
    // 返回每次爬取的关注数据
    eventSource.addEventListener('follows', (e) => {
      const d = JSON.parse(e.data);
      console.log('follows', d);
      addLog(`❤️关注${d.list.length}个...`);
    });
    // 返回每次爬取的粉丝数据
    eventSource.addEventListener('fans', (e) => {
      const d = JSON.parse(e.data);
      console.log('fans', d);
      addLog(`🩷粉丝${d.list.length}个...`);
    });
    // 单人爬取结束
    eventSource.addEventListener('partEnd', (e) => {
      const num = +e.data;
      console.log('partEnd', num);
      addLog(`🆗第${num}人爬取完成`);
    });
    // 结束
    eventSource.addEventListener('end', (e) => {
      console.log('end');
      eventSource.close();
      addLog(`🎉🎉🎉任务结束！大成功~`);
    });
    // 已有任务
    eventSource.addEventListener('occupied', (e) => {
      addLog(`当前爬取未结束！结束后数据会自动保存到本地。可关闭应用强行中断`);
    });
    eventSource.onerror = (e) => {
      console.log(e);
      addLog(`👾👾👾异常：${e}！`);
      eventSource.close();
    };
  };

  const relationNetworkRef = ref();
  /** 添加联系 */
  const addRelation = () => {
    relationNetworkRef.value.addRelation();
  };
</script>

<style lang="scss" scoped>
  .log-box {
    width: 400px;
    height: 300px;
    overflow-y: auto;
    border: 1px solid #f00;
  }
</style>
