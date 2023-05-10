<script setup lang="ts">
import { ref } from 'vue';
import { FileBoxNote32 } from '../../../packages/icons/src/icon/content';
// import type { BoxContentUploader as BoxPreview } from '../../../packages/vue/src';

const fid = ref('0');
const show = ref(true);
// const el = ref<InstanceType<typeof BoxPreview>>();

const token: string = import.meta.env.VITE_BOX_VUE_DEV_TOKEN;
</script>

<template>
  <div class="test-app">
    <FileBoxNote32 />

    <!--    <BoxPreview -->
    <!--      ref="el" -->
    <!--      v-model="fid" -->
    <!--      :access-token="token" -->
    <!--      style="min-height: 87vh" -->
    <!--    /> -->
  </div>
</template>

<style>
.test-app {
  min-height: 100vh;
}
</style>
