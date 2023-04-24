import fs from 'fs-extra';
import glob from 'fast-glob';
import { resolve } from 'path';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';
import Vue from 'unplugin-vue/esbuild';
import { objectKeys, uniq } from '@whoj/utils';

export const r = (...p: string[]) => resolve(process.cwd(), ...p);

export const { dependencies, name, peerDependencies, version } = fs.readJSONSync(r('package.json'), 'utf8');

export function makeBanner() {
  return `/**
 * @module ${name}
 * @version  ${version}
 * @copyright ${(new Date()).getFullYear()} Jonson B. All rights reserved.
 */
`;
}

export const getExternals = () => uniq<string | RegExp>([
  ...objectKeys<Record<string, string>>({ ...(dependencies || {}), ...(peerDependencies || {}) }),
  /^@whoj\/utils/,
  /#box-ui-elements\//
]);

export const entry = glob.sync(['*/index.ts'], {
  absolute: false,
  cwd: r('./src'),
  ignore: ['utils/index.ts']
}).reduce<Record<string, string>>((entries, input) => ({
  ...entries,
  [input.substring(0, input.indexOf('/'))]: `./src/${input}`
}), { index: './src/index.ts' });

const formats = ['cjs', 'esm', 'iife'] as const;

export default defineConfig(formats.reduce<Options[]>((options, format) => {
  const isEsm = format === 'esm';
  const isNode = isEsm || format === 'cjs';

  return [
    ...options,
    {
      clean: false,
      outDir: 'dist',
      external: getExternals(),
      watch: !!process.env.DEV,
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
        'import.meta.VITE_BOX_VUE_DEV_TOKEN': 'undefined',
        'import.meta.DEV': JSON.stringify(process.env.DEV)
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
            : (format === 'iife' ? '.global.js' : '.cjs')
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
