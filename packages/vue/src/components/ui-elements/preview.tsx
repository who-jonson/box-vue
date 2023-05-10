import { isDef } from '@whoj/utils';
import type { MaybeRef } from '@whoj/utils';
import type { UseBoxElementsOptions } from './useBoxElement';
import { GenericBoxElement, useBoxElement } from './useBoxElement';
import type { BaseEl, BoxUiOptions, MapToReturnVoid } from '../../types';

const PREVIEW_EVENTS = {
  viewer: (args: any) => isDef(args),
  load: (args: any) => isDef(args),
  navigate: (args: any) => isDef(args),
  notification: (args: any) => isDef(args),
  viewerevent: (args: any) => isDef(args)
};

export type PreviewEvents = MapToReturnVoid<typeof PREVIEW_EVENTS>;

export interface PreviewOptions extends BoxUiOptions {

  /**
   * List of file IDs to preview over.
   */
  collection?: string[];

  /**
   * Values that control header visibility and background color.
   * Use none for no header,
   * light for a light header and background,
   * and dark for a dark header and background
   * @default `'light'`
   */
  header?: 'none' | 'light' | 'dark';

  /**
   * Whether annotation button in header and annotations on content are shown
   * @default `false`
   */
  showAnnotations?: boolean;

  /**
   * Whether download button is shown in header.
   * Will also control print button visibility in viewers that support print.
   * Note that this option will not override download permissions on the access token.
   * @default `false`
   */
  showDownload?: boolean;
}

export interface Preview extends BaseEl<PreviewOptions, PreviewEvents> {
  /**
   * Prints the current file, if printable.
   *
   * @return {void}
   */
  print(): void;

  /**
   * Downloads the current file.
   *
   * @return {void}
   */
  download(): void;

  /**
   * Resizes the current preview, if applicable. This function only needs to
   * be called when preview's viewport has changed while the window has not.
   * If the window is resizing, then preview will automatically resize itself.
   *
   * @return {void}
   */
  resize(): void;
}

export function useBoxPreview(fileId: MaybeRef<string>, accessToken: MaybeRef<string>, options: UseBoxElementsOptions<PreviewOptions, PreviewEvents>) {
  return useBoxElement<Preview, PreviewOptions, PreviewEvents>(
    fileId,
    accessToken,
    {
      disposeOnUnmount: true,
      ...(options || {}),
      el: 'preview'
    }
  );
}

export const BoxPreview = /* @__PURE__ */ GenericBoxElement<Preview, PreviewOptions, typeof PREVIEW_EVENTS>(
  'preview',
  PREVIEW_EVENTS
);
