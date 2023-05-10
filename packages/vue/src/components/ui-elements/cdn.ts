import type { Ref } from 'vue-demi';
import { useHead } from '@unhead/vue';
import { ref, unref } from 'vue-demi';
import { tryOnUnmounted } from '@vueuse/core';
import { getGlobal, getProperty, isDef } from '@whoj/utils';
import type { Constructor, Func, MaybeRef } from '@whoj/utils';

import type { CdnOption } from '../../types';
import { BoxUiElements } from './useBoxElement';

export interface UseCdnOptions {
  /**
   * Custom CDN links to use for specific element/component
   */
  cdn?: CdnOption;

  /**
   * Version of box-ui-elements to use.
   * It will have no effect when using custom cdn links
   */
  version?: string;

  /**
   * Whether to dispose the Head on unmount
   */
  disposeOnUnmount?: boolean;

  /**
   * Script onload handler
   */
  onload?: Func<Event, void>;

  /**
   * Css Code as string
   */
  style?: MaybeRef<string>;
}

interface UseCdnReturn<T extends object = any> {
  head: Exclude<ReturnType<typeof useHead>, void>;
  loaded: Ref<boolean>;
  newBoxEl(): T | undefined;
}

export function useCdn<T extends object = any>(
  boxEl: keyof typeof BoxUiElements,
  { cdn, style, onload, version, disposeOnUnmount = true }: UseCdnOptions
): UseCdnReturn<T> {
  version = version || (boxEl === 'preview' ? '2.91.0' : '17.0.0');
  const element = boxEl === 'preview' ? 'preview' : 'elements';

  const { css, js } = cdn || {
    css: `https://cdn01.boxcdn.net/platform/${element}/${version}/en-US/${boxEl}.css`,
    js: `https://cdn01.boxcdn.net/platform/${element}/${version}/en-US/${boxEl}.js`
  };

  const loaded = ref(false);
  const head = useHead({
    link: [
      {
        href: css,
        rel: 'stylesheet',
        key: `whoj-box-vue__${boxEl}-css`
      }
    ],
    script: [
      {
        src: js,
        fetchpriority: 'high',
        type: 'text/javascript',
        key: `whoj-box-vue__${boxEl}-js`,
        onload(e) {
          loaded.value = true;
          isDef(onload) && onload(e);
        }
      }
    ],
    style: style
      ? [
          {
            innerHTML: unref(style),
            key: `whoj-box-vue__${boxEl}-style`
          }
        ]
      : undefined
  }) as UseCdnReturn['head'];

  tryOnUnmounted(() => {
    if (disposeOnUnmount) {
      head.dispose();
    }
  });

  const newBoxEl = () => {
    if (!loaded.value) {
      return undefined;
    }
    return new (getProperty(getGlobal().Box, BoxUiElements[boxEl]) as unknown as Constructor<T>)();
  };

  return {
    head,
    loaded,
    newBoxEl
  };
}
