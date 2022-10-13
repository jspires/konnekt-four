<script setup lang="ts">
  import K4Controller from './components/K4Controller.vue';
</script>

<template>
  <h1>Konnekt<span>Four</span></h1>
  <K4Controller />
</template>

<style scoped>
  h1 {
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-bottom: 0px;
    font-size: 3.2em;
    line-height: 1.1;
    color: #ff0000;
  }
  h1 > span {
    color: #ffff00;
  }
</style>