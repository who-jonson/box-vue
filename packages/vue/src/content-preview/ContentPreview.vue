<script lang="ts" setup>
import { computed, useAttrs } from 'vue-demi';
import { useBoxPreview } from './useBoxPreview';
import type { PreviewOptions } from './types';

export interface ContentPreviewProps {
  fileId: string;

  /**
   * Auth Access Token to use for request
   */
  accessToken: string;

  /**
   * Custom CDN links to use for specific element/component
   */
  cdn?: {
    js: string,
    css: string
  };

  /**
   * Preview Options
   */
  options?: PreviewOptions;

  /**
   * Version of box-ui-elements[PREVIEW] to use.
   * It will have no effect when using custom cdn links
   */
  version?: string;

  /**
   * Whether to dispose the Head on unmount
   */
  disposeOnUnmount?: boolean;

  height?: CSSStyleDeclaration['height'];
}

const {
  fileId,
  accessToken,
  height = '500px',
  options = {},
  cdn,
  version = '2.91.0',
  disposeOnUnmount = true
} = defineProps<ContentPreviewProps>();

const emits = defineEmits<{
  (e: 'load', data: any): void,
  (e: 'viewer', data: any): void,
  (e: 'navigate', data: any): void,
  (e: 'notification', data: any): void,
  (e: 'viewerevent', data: any): void
}>();

const attrs = useAttrs();
const id = computed(() => (attrs.id || 'boxContentPreviewContainer') as string);

const preview = useBoxPreview(
  $$(fileId),
  accessToken,
  {
    ...($$(options).value),
    cdn,
    version,
    disposeOnUnmount,
    container: `#${id.value}`,
    style: `.box-content-preview-wrapper > div { height: ${$$(height).value}; }`,
    listeners: {
      load: args => emits('load', args),
      viewer: args => emits('viewer', args),
      navigate: args => emits('navigate', args),
      notification: args => emits('notification', args),
      viewerevent: args => emits('viewerevent', args)
    }
  }
);

defineExpose({
  preview
});
</script>

<template>
  <div v-bind="$attrs" :id="id" class="box-content-preview-wrapper" />
</template>
