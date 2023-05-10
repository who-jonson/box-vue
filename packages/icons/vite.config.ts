import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import ViteDts from 'vite-plugin-dts';
import VueJsx from '@vitejs/plugin-vue-jsx';
import type { OutputOptions } from 'rollup';
import Macros from 'unplugin-vue-macros/vite';
import { getExternals, makeBanner, r } from '../../scripts/utils';

export default defineConfig(({ command, mode }) => {
  const isDev = (command === 'serve' || process.env.DEV || mode !== 'production');
  return {
    build: {
      emptyOutDir: false,
      outDir: 'dist',
      minify: !isDev,
      lib: {
        entry: './src/index.ts'
      },
      rollupOptions: {
        treeshake: true,
        shimMissingExports: true,
        external: getExternals(),
        makeAbsoluteExternalsRelative: 'ifRelativeSource',
        output: (['cjs', 'es'] as const).map(format => outputOptions(format))
      }
    },
    define: {
      'import.meta.vitest': 'undefined',
      'import.meta.VITE_BOX_VUE_DEV_TOKEN': 'undefined',
      'import.meta.DEV': JSON.stringify(process.env.DEV)
    },
    esbuild: {
      target: 'ES2022',
      legalComments: 'eof',
      treeShaking: true
    },

    plugins: [
      Macros({
        plugins: {
          vue: Vue({
            isProduction: false,
            reactivityTransform: true
          }),
          vueJsx: VueJsx()
        }
      }),
      ViteDts({
        cleanVueFileName: true,
        skipDiagnostics: true,
        rollupTypes: true,
        noEmitOnError: false,
        entryRoot: 'src',
        tsConfigFilePath: r('../../tsconfig.lib.json'),
        compilerOptions: {
          composite: false,
          customConditions: ['develop']
        }
      })
    ],
    resolve: {
      conditions: ['develop', 'module', 'import', 'default']
    },
    optimizeDeps: {
      exclude: ['vue-demi']
    }
  };
});

function outputOptions(format: 'cjs' | 'es' = 'es'): OutputOptions {
  return {
    format,
    exports: 'named',
    banner: makeBanner(),
    generatedCode: {
      constBindings: true
    },
    minifyInternalExports: false,
    chunkFileNames: `_shared/[name].${format === 'es' ? 'mjs' : 'cjs'}`,
    entryFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`,
    manualChunks: (id) => {
      if (/src\/([\w-]+)\//.test(id)) {
        return /src\/([\w-]+)\//.exec(id)[1];
      }
    }
  };
}

