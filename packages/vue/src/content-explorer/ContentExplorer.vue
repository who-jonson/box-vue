<script lang="ts" setup>
import { computed, useAttrs } from 'vue-demi';
import { useBoxExplorer } from './useBoxExplorer';
import type { ExplorerOptions, File, Folder, WebLink } from './types';

export interface ContentExplorerProps {
  folderId: string;

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
  options?: ExplorerOptions;

  /**
   * Version of box-ui-elements to use.
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
  folderId = '0',
  accessToken,
  height = '87vh',
  options = {},
  cdn,
  version = '17.0.0',
  disposeOnUnmount = true
} = defineProps<ContentExplorerProps>();

const emits = defineEmits<{
  (e: 'select', data: Array<File | Folder | WebLink>): void,
  (e: 'rename', data: File | Folder | WebLink): void,
  (e: 'preview', data: File): void,
  (e: 'download', data: File[]): void,
  (e: 'delete', data: File[]): void,
  (e: 'upload', data: File[]): void,
  (e: 'navigate', data: Folder): void,
  (e: 'create', data: Folder): void
}>();

const attrs = useAttrs();
const id = computed(() => (attrs.id || 'boxContentExplorerContainer') as string);

const explorer = useBoxExplorer(
  $$(folderId),
  accessToken,
  {
    ...$$(options).value,
    cdn,
    version,
    disposeOnUnmount,
    container: `#${id.value}`,
    style: `.box-content-explorer-wrapper > div { height: ${$$(height).value}; }`,
    listeners: {
      navigate: args => emits('navigate', args),
      select: args => emits('select', args),
      rename: args => emits('rename', args),
      preview: args => emits('preview', args),
      download: args => emits('download', args),
      delete: args => emits('delete', args),
      upload: args => emits('upload', args),
      create: args => emits('create', args)
    }
  }
);

defineExpose({
  explorer
});
</script>

<template>
  <div v-bind="$attrs" :id="id" class="box-content-explorer-wrapper" />
</template>
