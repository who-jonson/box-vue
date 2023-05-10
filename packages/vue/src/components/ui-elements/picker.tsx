import { isDef } from '@whoj/utils';
import type { Func, MaybeRef } from '@whoj/utils';
import type { UseBoxElementsOptions } from './useBoxElement';
import type { BaseEl, File, Folder, MapToReturnVoid, WebLink } from '../../types';
import type { ExplorerOptions } from './explorer';
import { GenericBoxElement, useBoxElement } from './useBoxElement';

const PICKER_EVENTS = {
  choose: (args: Array<File | Folder | WebLink>) => isDef(args),
  cancel: () => true
};

export type FilePickerEvents = MapToReturnVoid<typeof PICKER_EVENTS>;

export interface FilePickerOptions extends Omit<ExplorerOptions, 'canDelete' | 'canDownload' | 'canPreview' | 'canRename' | 'canShare'> {
  /**
   * Array of file extensions to be allowed for selection
   * @example `['doc', 'ppt']`
   */
  extensions?: string[];

  /**
   * Number of files or folders that can be selected.
   * Specify 1 if you want only 1 file or folder selected.
   * @default `Infinity`
   */
  maxSelectable?: number;

  modal?: {
    buttonLabel?: string, //		Label for the button
    buttonClassName?: string, //	Box Blue Button	CSS class to decorate the button
    modalClassName?: string, //		CSS class to decorate the modal popup content
    overlayClassName?: string //		CSS class to decorate the modal popup overlay
  };
}

export interface FilePicker extends BaseEl<FilePickerOptions, FilePickerEvents> {
  /**
   * Clears out the internal in-memory
   * cache for the content explorer forcing
   * re-load of items via the API.
   *
   * @public
   * @return {void}
   */
  clearCache(): void;
}

export function useBoxFilePicker(fileId: MaybeRef<string>, accessToken: MaybeRef<string>, options: UseBoxElementsOptions<FilePickerOptions, FilePickerEvents>) {
  return useBoxElement<FilePicker, FilePickerOptions, FilePickerEvents>(
    fileId,
    accessToken,
    {
      disposeOnUnmount: true,
      ...(options || {}),
      el: 'picker'
    }
  );
}

export const BoxFilePicker = /* @__PURE__ */ GenericBoxElement<FilePicker, FilePickerOptions, typeof PICKER_EVENTS>(
  'picker',
  PICKER_EVENTS
);
