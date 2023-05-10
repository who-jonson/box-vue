import fs from 'fs-extra';
import glob from 'fast-glob';
import { resolve } from 'path';
import Dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import Vue from 'unplugin-vue/rollup';
import Alias from '@rollup/plugin-alias';
import Esbuild from 'rollup-plugin-esbuild';
import VueJsx from 'unplugin-vue-jsx/rollup';
import CommonJs from '@rollup/plugin-commonjs';
import { objectKeys, uniq } from '@whoj/utils';
import NodeResolve from '@rollup/plugin-node-resolve';
import { fixImportHellRollup } from './../../scripts/check.js';

export const r = (...p) => resolve(process.cwd(), ...p);

export const { dependencies, name, peerDependencies, version } = fs.readJSONSync(r('package.json'), 'utf8');

export function makeBanner() {
  return `/**
 * @module ${name}
 * @version  ${version}
 * @copyright ${(new Date()).getFullYear()} Jonson B. All rights reserved.
 */
`;
}

export const getExternals = () => uniq([
  ...objectKeys({ ...(dependencies || {}), ...(peerDependencies || {}) }),
  /axios/,
  /^@whoj\/utils/,
  /#box-ui-elements\//
]);

export const entry = glob.sync(['**/index.ts'], {
  absolute: false,
  cwd: r('./src/components'),
  ignore: ['index.ts']
}).reduce((entries, input) => ({
  ...entries,
  [input.substring(0, input.indexOf('/'))]: `./src/components/${input}`
}), { index: './src/index.ts' });

const tsconfig = r('./../../tsconfig.lib.json');

const commonOptions = {
  input: './src/index.ts',
  treeshake: true,
  external: getExternals(),
  makeAbsoluteExternalsRelative: 'ifRelativeSource'
};

const plugins = [
  Alias({
    entries: [
      { find: /^node:(.+)$/, replacement: '$1' },
      { find: /^vue$/, replacement: 'vue-demi' }
    ]
  }),
  NodeResolve({
    preferBuiltins: true,
    exportConditions: ['develop', 'module', 'import', 'default']
  }),
  Vue({
    isProduction: false,
    reactivityTransform: true
  }),
  VueJsx(),
  Esbuild({
    tsconfig,
    target: 'esnext',
    legalComments: 'eof',
    define: {
      'import.meta.vitest': 'undefined'
    },
    loaders: {
      '.ts': 'ts',
      '.js': 'js',
      '.tsx': 'tsx',
      '.jsx': 'jsx',
      '.vue': 'ts'
    }
  }),
  CommonJs()
  // fixImportHellRollup()
];

function makeOutputConfig(ext) {
  return {
    banner: makeBanner(),
    format: ext === 'cjs' ? 'cjs' : 'esm',
    exports: 'auto',
    freeze: false,
    generatedCode: {
      constBindings: true
    },
    sourcemap: 'inline',
    dir: r('dist'),
    minifyInternalExports: false,
    entryFileNames: `[name].${ext}`
    // chunkFileNames: `[name].${ext}`,
    // manualChunks: (id) => {
    //   if (/src\/components\/([\w-]+)\/index\.ts/.test(id)) {
    //     return /src\/components\/([\w-]+)\//.exec(id)[1];
    //   }
    //   return '_/shared';
    // }
  };
}

export default defineConfig([
  {
    ...commonOptions,
    output: makeOutputConfig('cjs'),
    plugins
  },
  {
    ...commonOptions,
    output: makeOutputConfig('mjs'),
    plugins
  },
  {
    ...commonOptions,
    output: makeOutputConfig('d.ts'),
    plugins: [
      Dts({
        tsconfig,
        compilerOptions: {
          composite: false,
          customConditions: ['develop']
        },
        respectExternal: true
      }),
      fixImportHellRollup()
    ]
  }
]);
