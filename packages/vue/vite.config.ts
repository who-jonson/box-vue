import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import ViteDts from 'vite-plugin-dts';
import VueJsx from '@vitejs/plugin-vue-jsx';
import type { OutputOptions } from 'rollup';
import { fixImportHellVite } from './../../scripts/check.js';
import { entry, getExternals, makeBanner, r } from '../../scripts/utils';

export default defineConfig(({ command, mode }) => {
  const isDev = (command === 'serve' || process.env.DEV || mode !== 'production');
  return {
    build: {
      emptyOutDir: false,
      outDir: 'dist',
      minify: false,
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
      legalComments: 'eof',
      treeShaking: true
    },

    plugins: [
      Vue({
        isProduction: false,
        reactivityTransform: true
      }),
      VueJsx(),
      // ReactivityTransform(),
      ViteDts({
        cleanVueFileName: true,
        skipDiagnostics: true,
        // rollupTypes: true,
        noEmitOnError: false,
        outputDir: r('dist/types'),
        entryRoot: 'src',
        tsConfigFilePath: r('../../tsconfig.lib.json'),
        compilerOptions: {
          composite: false,
          customConditions: ['develop']
        }
      }),
      fixImportHellVite()
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
    chunkFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`, // ({ isEntry }) => `${isEntry ? '' : '_shared/'}box-vue.[hash].${format === 'es' ? 'mjs' : 'cjs'}`,
    entryFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`,
    manualChunks: (id) => {
      if (/src\/components\/([\w-]+)\/index\.ts/.test(id)) {
        return /src\/components\/([\w-]+)\//.exec(id)[1];
      }
      return '_/shared';
    }
  };
}

