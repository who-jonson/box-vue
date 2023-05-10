import fs from 'fs-extra';
import glob from 'fast-glob';
import { resolve } from 'path';
import Dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import Vue from 'unplugin-vue/rollup';
import Alias from '@rollup/plugin-alias';
import Esbuild from 'rollup-plugin-esbuild';
import VueJsx from 'unplugin-vue-jsx/rollup';
import { objectKeys, uniq } from '@whoj/utils';
import { fixImportHellRollup } from './../../scripts/check.js';
import { publishableResourcesRollup } from './../../scripts/pre-publish.js';

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
  /#box-ui-elements\//,
  /unplugin-vue-components/
]);

const tsconfig = r('./../../tsconfig.lib.json');

const entries = glob.sync(['*/*.{ts,tsx}'], {
  absolute: false,
  cwd: r('./src/icon/')
}).reduce((entries, input) => ({
  ...entries,
  [input.substring(0, input.lastIndexOf('.'))]: `./src/icon/${input}`
}), {
  index: './src/index.ts'
  // resolvers: './src/resolvers.ts'
});

const commonOptions = {
  input: entries,
  treeshake: true,
  external: getExternals(),
  makeAbsoluteExternalsRelative: 'ifRelativeSource'
};

const plugins = [
  Alias({
    entries: [
      { find: /^vue$/, replacement: 'vue-demi' },
      { find: /^lodash\/(.+)$/, replacement: './src/utils/$1.ts' },
      { find: /^box-icons\/(.+)$/, replacement: './src/$1.ts' }
    ]
  }),
  Vue({
    isProduction: false,
    reactivityTransform: true
  }),
  VueJsx(),
  Esbuild({
    tsconfig,
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
    },
    treeShaking: true
  })
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
    sourcemap: false,
    dir: r('dist'),
    minifyInternalExports: false,
    entryFileNames: `[name].${ext}`,
    preserveModules: true,
    preserveModulesRoot: 'src'
    // chunkFileNames: `[name].${ext}`,
    // manualChunks: (id) => {
    //   if (/src\/components\//.test(id)) {
    //     return 'shared/components';
    //   }
    //
    //   if (/src\/icon\/(content|fill|line|logo)\/(\w+)\.tsx$/.test(id)) {
    //     const arr = /src\/icon\/(content|fill|line|logo)\/(\w+)\.tsx$/.exec(id)[1];
    //     return `${arr[1]}/${arr[2]}`;
    //   }
    //   return 'shared/_';
    // }
  };
}

export default defineConfig([
  {
    ...commonOptions,
    output: makeOutputConfig('js'),
    plugins
  },
  {
    ...commonOptions,
    output: makeOutputConfig('d.ts'),
    plugins: [
      Dts({
        tsconfig,
        compilerOptions: {
          composite: false
        },
        respectExternal: true
      }),
      fixImportHellRollup(),
      publishableResourcesRollup()
    ]
  }
]);
