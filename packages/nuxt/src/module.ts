import { defineNuxtModule } from '@nuxt/kit';
import { name, version } from '../package.json';
import type { BoxComponent } from '@whoj/box-vue';
import { isString, kebabCase, objectEntries, pascalCase } from '@whoj/utils';

export interface BoxNuxtOptions {
  components?: {
    [K in BoxComponent]?: boolean | string
  };
}

const configKey = 'boxVue' as const;

const defaultComponents = <BoxNuxtOptions['components']>{
  ContentExplorer: true,
  ContentPreview: true
};

export default defineNuxtModule<BoxNuxtOptions>({
  meta: {
    name,
    version,
    configKey,
    compatibility: {
      nuxt: '>=2.16',
      bridge: true
    }
  },

  setup({ components = defaultComponents }, nuxt) {
    nuxt.hook('components:extend', (_components) => {
      objectEntries(components!).forEach(([name, value]) => {
        if (value) {
          const _name = isString(value) ? value : name;
          _components.push({
            export: name,
            preload: true,
            prefetch: true,
            mode: 'client',
            shortPath: '@whoj/box-vue',
            kebabName: kebabCase(_name),
            pascalName: pascalCase(_name),
            filePath: `@whoj/box-vue/${kebabCase(name)}`,
            chunkName: `whoj__box-vue__${kebabCase(name)}`
          });
        }
      });
    });
  }
});
