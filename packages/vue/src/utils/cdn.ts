import { unref } from 'vue-demi';
import { useHead } from '@unhead/vue';
import type { Func, MaybeRef } from '@whoj/utils';
import type { CommonOptions } from '../types';

type BoxUiElement = 'explorer' | 'openwith' | 'picker' | 'sidebar' | 'preview' | 'uploader';

export interface UseCdnOptions extends CommonOptions {
  onload: Func<never, void>;
  style?: MaybeRef<string>;
}

type UseCdnReturn = Exclude<ReturnType<typeof useHead>, void>;

export function useCdn(boxEl: BoxUiElement, { cdn, onload, version, style }: UseCdnOptions): UseCdnReturn {
  const _style = unref(style);
  version = version || (boxEl === 'preview' ? '2.91.0' : '17.0.0');
  const element = boxEl === 'preview' ? 'preview' : 'elements';

  const { css, js } = cdn || {
    css: `https://cdn01.boxcdn.net/platform/${element}/${version}/en-US/${boxEl}.css`,
    js: `https://cdn01.boxcdn.net/platform/${element}/${version}/en-US/${boxEl}.js`
  };

  return useHead({
    link: [
      {
        href: css,
        rel: 'stylesheet',
        key: `whoj-box-vue__${boxEl}-css`
      }
    ],
    script: [
      {
        onload,
        src: js,
        fetchpriority: 'high',
        type: 'text/javascript',
        key: `whoj-box-vue__${boxEl}-js`
      }
    ],
    style: _style
      ? [
          {
            innerHTML: _style,
            key: `whoj-box-vue__${boxEl}-style`
          }
        ]
      : undefined
  }) as UseCdnReturn;
}
