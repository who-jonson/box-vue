import { defineConfig } from 'tsup';
import type { Options } from 'tsup';
import Vue from 'unplugin-vue/esbuild';
import { entry, getExternals, makeBanner, name } from './utils';

const formats = ['cjs', 'esm'] as const;

export default defineConfig(formats.reduce<Options[]>((options, format) => {
  const isEsm = format === 'esm';
  const isNode = isEsm || format === 'cjs';

  return [
    ...options,
    {
      clean: false,
      outDir: 'dist',
      external: getExternals(),
      watch: process.env.DEV,
      banner: {
        js: makeBanner()
      },
      format: [format],
      target: isNode ? 'es2022' : ['chrome110', 'firefox110', 'edge110', 'opera90', 'safari14'],
      globalName: 'Whoj.BoxVue',
      splitting: format === 'esm',
      skipNodeModulesBundle: isNode,
      platform: !isNode ? 'browser' : 'node',
      define: {
        'import.meta.vitest': 'undefined',
        'import.meta.VITE_BOX_VUE_DEV_TOKEN': 'undefined'
      },
      loader: {
        '.vue': 'ts'
      },
      esbuildPlugins: [
        Vue({
          isProduction: false,
          reactivityTransform: true
        })
      ],
      keepNames: true,
      esbuildOptions(options) {
        options.conditions = ['develop'];
        options.legalComments = 'eof';
        options.chunkNames = '_/boxvue.[hash]';
        options.outExtension = {
          '.js': isEsm
            ? '.mjs'
            : '.cjs'
        };
        options.resolveExtensions = [
          '.ts',
          '.tsx',
          '.mjs',
          '.cjs',
          '.js',
          '.jsx'
        ];
      },
      name,
      entry,
      shims: true,
      dts: format !== 'esm'
        ? false
        : {
            compilerOptions: {
              composite: false,
              moduleResolution: 'bundler',
              customConditions: ['develop']
            }
          }
    } as Options
  ];
}, []));
