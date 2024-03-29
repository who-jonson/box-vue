import glob from 'fast-glob';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import ViteDts from 'vite-plugin-dts';
import VueJsx from '@vitejs/plugin-vue-jsx';
import type { OutputOptions } from 'rollup';
import { getExternals, makeBanner, r } from '../../scripts/utils';

const entries = glob.sync(['*/*.{ts,tsx}'], {
  absolute: false,
  cwd: r('./src/icon/'),
  ignore: ['*/*.ce.ts']
}).reduce((entries, input) => ({
  ...entries,
  [input.substring(0, input.lastIndexOf('.'))]: `./src/icon/${input}`
}), {
  index: './src/index.ts',
  resolvers: './src/resolvers.ts'
});

export default defineConfig(({ command, mode }) => {
  const isDev = (command === 'serve' || process.env.DEV || mode !== 'production');
  return {
    build: {
      emptyOutDir: true,
      outDir: 'dist',
      minify: !isDev,
      lib: {
        entry: entries
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
        isProduction: false,
        reactivityTransform: true
      }),
      VueJsx(),
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
        exclude: [
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

function outputOptions(format: 'cjs' | 'es' = 'es'): OutputOptions {
  return {
    format,
    exports: 'named',
    banner: makeBanner(),
    generatedCode: {
      constBindings: true
    },
    minifyInternalExports: false,
    sourcemap: true
    // chunkFileNames: `_shared/[name].${format === 'es' ? 'mjs' : 'cjs'}`,
    // entryFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`,
    // manualChunks: (id) => {
    //   if (/src\/([\w-]+)\//.test(id)) {
    //     return /src\/([\w-]+)\//.exec(id)[1];
    //   }
    // }
  };
}

