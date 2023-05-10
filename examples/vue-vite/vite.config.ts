import { resolve } from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Macros from 'unplugin-vue-macros/vite';

export default defineConfig({
  build: {
    watch: {
      include: resolve(__dirname, '../..', 'packages/vue/src')
    }
  },
  plugins: [
    Macros({
      plugins: {
        vue: Vue({
          reactivityTransform: true
        }),
        vueJsx: VueJsx()
      }
    })
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  server: {
    cors: true
  }
});
