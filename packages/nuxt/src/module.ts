import { defineNuxtModule } from '@nuxt/kit';
import type { Component } from '@nuxt/schema';
import type { BoxIcons } from '@whoj/box-icons';
import type { BoxUiComponents, BoxUiComposables } from '@whoj/box-vue';
import { capitalize, ensurePrefix, isArray, kebabCase, objectEntries, pascalCase, setProperty, snakeCase, uniq } from '@whoj/utils';

import { name, version } from '../package.json';

export interface BoxNuxtOptions {
  components?: Array<BoxUiComponents | [BoxUiComponents, string]>;

  composables?: Array<BoxUiComposables>;

  icons?: {
    [K in keyof BoxIcons]?: {
      prefix?: string,
      icons: Array<BoxIcons[K] | [BoxIcons[K], string]>
    } | Array<BoxIcons[K] | [BoxIcons[K], string]>
  };

  // Prefix for Components
  prefix?: string;
}

const configKey = 'boxVue' as const;

export default defineNuxtModule<BoxNuxtOptions>({
  meta: {
    name,
    version,
    configKey
  },

  setup({ components, composables, icons, prefix }, nuxt) {
    setProperty(nuxt, 'options.build.transpile', [
      ...(nuxt.options.build?.transpile || []),
      '@whoj/box-vue',
      icons && '@whoj/box-icons'
    ]);

    nuxt.hook('imports:extend', (_imports) => {
      if (composables?.length) {
        composables.forEach((name) => {
          _imports.push({
            from: '@whoj/box-vue',
            as: name,
            name
          });
        });
      }
    });

    nuxt.hook('components:extend', async (_components) => {
      const componentsToRegister: Component[] = [];

      if (components?.length) {
        uniq(components!.map<[BoxUiComponents, string]>(c => isArray(c) ? c : [c, c]))
          .forEach(([exp, _name]) => {
            componentsToRegister.push(makeComponent(exp, ensurePrefix(prefix || '', _name)));
          });
      }

      if (icons) {
        for (const [iType, iNames] of objectEntries(icons)) {
          let iconPrefix = '';
          if (!isArray(iNames) && iNames!.prefix?.length) {
            iconPrefix = iNames!.prefix;
          } else if (iType !== 'default') {
            iconPrefix = capitalize(iType);
          }

          for (const i of (isArray(iNames) ? iNames : iNames!.icons)) {
            const [exp, _name] = (isArray(i) ? i : [i, i]) as [string, string];
            componentsToRegister.push(makeComponent(
              exp,
              ensurePrefix(iconPrefix, _name),
              iType === 'default' ? 'icons' : `icons/${iType}`
            ));
          }
        }
      }

      if (componentsToRegister.length) {
        _components.push(...componentsToRegister);
      }
    });
  }
});

function makeComponent(exp: string, name: string, mod: 'vue' | 'icons' | `icons/${Exclude<keyof BoxIcons, 'default'>}` = 'vue') {
  return {
    export: exp,
    preload: true,
    prefetch: true,
    filePath: `@whoj/box-${mod}`,
    kebabName: kebabCase(name),
    pascalName: pascalCase(name),
    chunkName: `whoj__box-${mod.replaceAll('/', '-')}__${snakeCase(name)}`
  } as Component;
}
