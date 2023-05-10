import { isArray, isDef } from '@whoj/utils';
import type { MaybeRef } from '@whoj/utils';
import type { ExplorerOptions } from './explorer';
import type { UseBoxElementsOptions } from './useBoxElement';
import type { BaseEl, File, MapToReturnVoid } from '../../types';
import { GenericBoxElement, useBoxElement } from './useBoxElement';

const UPLOADER_EVENTS = {
  close: () => true,
  complete: (payload: File[]) => isArray(payload),
  error: (args: Error) => isDef(args),
  upload: (payload: File) => isDef(payload)
};

export type UploaderEvents = MapToReturnVoid<typeof UPLOADER_EVENTS>;

export interface UploaderOptions extends Pick<ExplorerOptions, 'container' | 'requestInterceptor' | 'responseInterceptor' | 'sharedLink' | 'sharedLinkPassword' | 'size' | 'isTouch'> {
  /**
   * Callback function for 'Close' button,
   * which will appear when there are no files to upload or when all uploads are complete.
   * If this option is set to `null` the button will not appear.
   */
  onClose?: null | (() => void);

  /**
   * Number of files or folders that can be selected.
   * Specify 1 if you want only 1 file or folder selected.
   * @default `100`
   */
  fileLimit?: number;

  modal?: {
    buttonLabel?: string, //		Label for the button
    buttonClassName?: string, //	Box Blue Button	CSS class to decorate the button
    modalClassName?: string, //		CSS class to decorate the modal popup content
    overlayClassName?: string //		CSS class to decorate the modal popup overlay
  };
}

export interface Uploader extends BaseEl<UploaderOptions, UploaderEvents> {

}

export function useBoxContentUploader(fileId: MaybeRef<string>, accessToken: MaybeRef<string>, options: UseBoxElementsOptions<UploaderOptions, UploaderEvents>) {
  return useBoxElement<Uploader, UploaderOptions, UploaderEvents>(
    fileId,
    accessToken,
    {
      disposeOnUnmount: true,
      ...(options || {}),
      el: 'uploader'
    }
  );
}

export const BoxContentUploader = /* @__PURE__ */ GenericBoxElement<Uploader, UploaderOptions, typeof UPLOADER_EVENTS>(
  'uploader',
  UPLOADER_EVENTS
);
