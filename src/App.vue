<template>
  <div>
    aaa
    <button @click="test">button</button>
  </div>
</template>

<script lang="ts" setup>
  import { getTestData } from './api/base';

  const test = () => {
    console.log('button');
    getTestData().then((res) => {
      console.log(res);
    });
  };
</script>

<style lang="scss" scoped></style>
