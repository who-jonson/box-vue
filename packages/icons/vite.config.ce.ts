import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import type { OutputOptions } from 'rollup';
import ViteDts from 'vite-plugin-dts';
import { getExternals, makeBanner, r } from '../../scripts/utils';

export default defineConfig(({ command, mode }) => {
  const isDev = (command === 'serve' || process.env.DEV || mode !== 'production');
  return {
    build: {
      emptyOutDir: false,
      outDir: 'dist/ce',
      minify: !isDev,
      lib: {
        entry: './src/index.ce.ts'
      },
      rollupOptions: {
        treeshake: true,
        shimMissingExports: true,
        external: getExternals(),
        makeAbsoluteExternalsRelative: 'ifRelativeSource',
        output: (['es'] as const).map(format => outputOptions(format))

      },
      ssr: true
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
      Vue({
        customElement: true,
        reactivityTransform: true,
        template: {
          compilerOptions: {
            isCustomElement: tag => (tag.startsWith('Box') || tag.startsWith('box-'))
          }
        }
      }),

      VueJsx({
        isCustomElement: tag => (tag.startsWith('Box') || tag.startsWith('box-'))
      }),

      ViteDts({
        cleanVueFileName: true,
        skipDiagnostics: true,
        insertTypesEntry: true,
        noEmitOnError: false,
        entryRoot: 'src',
        // tsConfigFilePath: r('../../tsconfig.lib.json'),
        compilerOptions: {
          composite: false,
          customConditions: ['develop']
        },
        include: [
          'src/**/*.ce.ts'
        ]
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

function outputOptions(format: 'es' | 'iife' = 'es'): OutputOptions {
  return {
    format,
    exports: format === 'es' ? 'named' : 'auto',
    banner: makeBanner(),
    generatedCode: {
      constBindings: true
    },
    name: 'VueBoxIcons',
    minifyInternalExports: false,
    chunkFileNames: `_shared/[name].${format === 'es' ? 'js' : 'iife.js'}`,
    entryFileNames: `[name].${format === 'es' ? 'js' : 'iife.js'}`,
    manualChunks: (id) => {
      if (/src\/([\w-]+)\/([\w-]+)\//.test(id)) {
        return /src\/([\w-]+)\/([\w-]+)\//.exec(id)[2];
      }
    },
    sourcemap: true
  };
}

