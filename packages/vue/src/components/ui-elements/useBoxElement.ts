import { ref } from 'vue-demi';
import { whenever } from '@vueuse/core';
import type { MaybeRef } from '@whoj/utils';
import type { Func } from '@whoj/utils-types';
import { hasProperty, objectEntries, unrefOf } from '@whoj/utils';

import { useCdn } from './cdn';
import type { UseCdnOptions } from './cdn';
import type { BaseEl, UnObj } from '../../types';

export enum BoxUiElements {
  explorer = 'ContentExplorer',
  picker = 'FilePicker',
  preview = 'Preview',
  sidebar = 'ContentSidebar',
  uploader = 'ContentUploader'
}

export type BoxUiElementName = keyof typeof BoxUiElements;
export type GlobalBoxUiElements = ReverseMap<typeof BoxUiElements>;

export type ReverseMap<T extends Record<keyof T, any>> = {
  [V in T[keyof T]]: {
    [K in keyof T]: T[K] extends V ? K : never;
  }[keyof T];
};

export type UseBoxElementsOptions<Opt, E extends object = any> = Opt & UseCdnOptions & {
  listeners?: E,
  immediate?: boolean
};

export function useBoxElement<T extends BaseEl<Opt, E>, Opt extends UnObj, E extends { [p: string]: Func<any, void> }>(
  id: MaybeRef<string>,
  accessToken: MaybeRef<string>,
  {
    cdn,
    disposeOnUnmount,
    el,
    immediate = true,
    listeners,
    onload,
    version,
    style,
    ...options
  }: UseBoxElementsOptions<Opt, E> & { el: keyof typeof BoxUiElements }
) {
  const instance = ref<T>();
  const getInstance = () => instance.value;

  const { loaded, newBoxEl } = useCdn<T>(el, {
    cdn,
    style,
    version,
    onload,
    disposeOnUnmount
  });

  whenever(() => loaded.value, () => {
    if (!getInstance() || !hasProperty(getInstance(), 'addListener')) {
      instance.value = newBoxEl();
    }

    if (listeners) {
      objectEntries<E>(listeners).forEach(([event, listener]) => {
        getInstance()!.addListener(event, listener!);
      });
    }

    if (immediate) {
      getInstance()!.show(unrefOf(id), unrefOf(accessToken), (options || {}) as unknown as Opt);
    }
  });

  return {
    loaded,
    instance,
    newBoxEl,
    getInstance
  };
}

export * from './box-element';
