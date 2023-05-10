import { kebabCase, pascalCase } from '@whoj/utils';
import type { ComponentResolver } from 'unplugin-vue-components';

export function BoxIconsResolver({ prefix = 'Box' } = {}): ComponentResolver {
  return {
    type: 'component',
    resolve(_name) {
      const name = kebabCase(_name);
      if (name.startsWith(`${prefix.toLowerCase()}-`)) {
        let path = '@whoj/box-icons';

        const arr = name.split('-');
        if (['fill', 'line', 'logo'].includes(arr[1])) {
          path += `/${arr[1]}`;
        } else {
          path += '/content';
        }
        arr.shift();
        arr.shift();
        path += `/${pascalCase(arr.join('-'))}`;

        return {
          from: path,
          name: 'default'
        };
      }
    }
  };
}
