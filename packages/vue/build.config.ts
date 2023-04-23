import Vue from 'unplugin-vue/rollup';
import { defineBuildConfig } from 'unbuild';
import type { OutputOptions } from 'rollup';
import { flattenArrayable } from '@whoj/utils';
import Macros from 'unplugin-vue-macros/rollup';
import { getExternals, makeBanner } from './tsup.config';

export default defineBuildConfig({
  clean: false,
  declaration: true,
  failOnWarn: false,
  externals: getExternals(),
  rollup: {
    emitCJS: true,
    cjsBridge: true,
    esbuild: {
      target: 'ES2022',
      legalComments: 'eof'
    }
  },
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/content-explorer/index', name: 'content-explorer/index' },
    { input: 'src/content-preview/index', name: 'content-preview/index' }
  ],
  hooks: {
    'rollup:options': async (ctx, options) => {
      console.log(options.output);
      // @ts-ignore
      options.plugins.push(
        Macros({
          plugins: {
            vue: Vue({
              isProduction: false,
              reactivityTransform: true
            })
          }
        })
      );

      // options.external = getExternals();
      options.shimMissingExports = true;
      options.makeAbsoluteExternalsRelative = 'ifRelativeSource';

      options.output = flattenArrayable(options.output).reduce<OutputOptions[]>((opts, op) => [
        ...opts,
        {
          ...op,
          exports: 'named',
          banner: makeBanner(),
          generatedCode: {
            constBindings: true
          },
          minifyInternalExports: false
        }
      ], []);
      await Promise.resolve();
    }
  }
});
