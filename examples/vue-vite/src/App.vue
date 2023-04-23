<script setup lang="ts">
import { ref } from 'vue';
import { ContentExplorer } from '../../../packages/vue/src/';

const token: string = import.meta.env.VITE_BOX_VUE_DEV_TOKEN;

const el = ref<InstanceType<typeof ContentExplorer>>();
</script>

<template>
  <div class="test-app">
    <ContentExplorer
      ref="el"
      :access-token="token"
      style="min-height: 87vh"
      :options="{}"
    />
  </div>
</template>

<style>
.test-app {
  min-height: 100vh;
}
</style>
