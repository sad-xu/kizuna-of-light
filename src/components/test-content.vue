<template>
  <div>
    111
    <button @click="test">test</button>
  </div>
</template>

<script setup>
  import * as ff from '../../force-source/src/index.js';
  import { testForce } from '@/utils/test.js';

  console.log(ff);

  const test = () => {
    testForce(ff);
  };
</script>

<style lang="scss" scoped></style>
