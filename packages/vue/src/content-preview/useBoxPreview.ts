import { getGlobal, objectEntries } from '@whoj/utils';
import type { Func, MaybeRef, Optional } from '@whoj/utils';
import { computed, onUnmounted, readonly as readOnly, unref } from 'vue-demi';

import { useCdn } from '../utils';
import type { UseCdnOptions } from '../utils';
import type { Preview, PreviewEvent, PreviewOptions } from '.';

type UseBoxPreviewOptions = PreviewOptions & UseCdnOptions & {
  listeners?: {
    [K in PreviewEvent]?: Func<any, void>
  }
};

export function useBoxPreview(
  fileId: MaybeRef<string>,
  accessToken: string,
  { cdn, disposeOnUnmount = true, listeners, onload, version, style, ...options }: Optional<UseBoxPreviewOptions>
) {
  const instance = computed<Preview>({
    get: () => getGlobal().Box?.Preview?.instance || {} as Preview,
    set: (v) => {
      getGlobal().Box.Preview.instance = v;
    }
  });

  const _onload = () => {
    const { Preview } = getGlobal().Box;
    instance.value = new Preview();
    if (listeners) {
      objectEntries(listeners).forEach(([event, listener]) => {
        instance.value.addListener(event, listener);
      });
    }

    instance.value.show(unref(fileId), accessToken, options);
  };

  const BoxHead = useCdn('preview', {
    cdn,
    style,
    version,
    onload: onload || _onload
  });

  if (disposeOnUnmount) {
    onUnmounted(() => BoxHead.dispose());
  }

  return readOnly(instance);
}
