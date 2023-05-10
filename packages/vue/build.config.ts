import fs from 'fs-extra';
import Vue from 'unplugin-vue/rollup';
import { defineBuildConfig } from 'unbuild';
import type { OutputOptions } from 'rollup';
import { flattenArrayable } from '@whoj/utils';
import { getExternals, makeBanner, r } from '../../scripts/utils';

export default defineBuildConfig({
  clean: false,
  declaration: true,
  failOnWarn: false,
  externals: getExternals(),
  rollup: {
    emitCJS: true,
    cjsBridge: true,
    esbuild: {
      target: 'ESNext',
      legalComments: 'eof'
    }
  },
  entries: [
    { input: 'src/', outDir: 'dist/esm-node', ext: 'mjs' }
  ],
  hooks: {
    'rollup:options': async (ctx, options) => {
      // @ts-ignore
      options.plugins.push(
        Vue({
          isProduction: false,
          reactivityTransform: true
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
    },
    'build:done': async () => {
      await fs.remove(r('dist/esm-node/env.d.ts'));
      await fs.writeFile(r('dist/index.d.ts'), 'export * from \'./esm-node\';\n', 'utf-8');
    }
  }
});
