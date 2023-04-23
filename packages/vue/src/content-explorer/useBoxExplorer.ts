import { getGlobal, objectEntries } from '@whoj/utils';
import type { MaybeRef, Optional } from '@whoj/utils';
import { computed, onUnmounted, readonly as readOnly, unref } from 'vue-demi';

import { useCdn } from '../utils';
import type { UseCdnOptions } from '../utils';
import type { Explorer, ExplorerEvents, ExplorerOptions } from '.';

type UseBoxExplorerOptions = ExplorerOptions & UseCdnOptions & {
  listeners?: ExplorerEvents
};

export function useBoxExplorer(
  folderId: MaybeRef<string>,
  accessToken: string,
  { cdn, disposeOnUnmount = true, listeners, onload, version, style, ...options }: Optional<UseBoxExplorerOptions>
) {
  const instance = computed<Explorer>({
    get: () => getGlobal().Box?.ContentExplorer?.instance || {} as Explorer,
    set: (v) => {
      getGlobal().Box.ContentExplorer.instance = v;
    }
  });

  const _onload = () => {
    const { ContentExplorer } = getGlobal().Box;
    instance.value = new ContentExplorer();
    if (listeners) {
      objectEntries(listeners).forEach(([event, listener]) => {
        instance.value.addListener(event, listener);
      });
    }

    instance.value.show(unref(folderId), accessToken, options);
  };

  const BoxHead = useCdn('explorer', {
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
