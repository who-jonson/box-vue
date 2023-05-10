import { isArray, isDef } from '@whoj/utils';
import type { Func, MaybeRef } from '@whoj/utils';
import type { UseBoxElementsOptions } from './useBoxElement';
import { GenericBoxElement, useBoxElement } from './useBoxElement';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BaseEl, BoxUiOptions, File, Folder, MapToReturnVoid, MaybePromise, WebLink } from '../../types';

const EXPLORER_EVENTS = {
  select: (payload: Array<File | Folder | WebLink>) => isArray(payload),
  rename: (payload: File | Folder | WebLink) => isDef(payload),
  preview: (payload: File) => isDef(payload),
  download: (payload: File[]) => isArray(payload),
  delete: (payload: File[]) => isArray(payload),
  upload: (payload: File[]) => isArray(payload),
  navigate: (payload: Folder) => isDef(payload),
  create: (payload: Folder) => isDef(payload)
};

declare type ExplorerEvents = MapToReturnVoid<typeof EXPLORER_EVENTS>;

export interface ExplorerOptions extends BoxUiOptions {

  /**
   * Indicates to the content explorer to fit within a small or large width container.
   * If absent the UI Element will adapt to its container
   * and automatically switch between small width or large width mode.
   */
  size?: 'small' | 'large';

  /**
   * The initial sort by option for the content list.
   */
  sortBy?: 'id' | 'name' | 'date' | 'size';

  /**
   * The initial sort direction option for the content list.
   */
  sortDirection?: 'ASC' | 'DESC';

  /**
   * When set to true, the item grid will get focus on initial load.
   */
  autoFocus?: boolean;

  canCreateNewFolder?: boolean;

  canDelete?: boolean;

  canDownload?: boolean;

  canPreview?: boolean;

  canRename?: boolean;

  canSetShareAccess?: boolean;

  canShare?: boolean;

  canUpload?: boolean;

  /**
   * Indicates to the content explorer that it is being rendered on a touch enabled device.
   * Defaults to the browser and device's default touch support
   */
  isTouch?: boolean;

  /**
   * When set to recents, by default you will see recent items instead of the regular file/folder structure.
   */
  defaultView?: 'files' | 'recents';

  /**
   * // See https://github.com/axios/axios#interceptors
   */
  requestInterceptor?: Func<AxiosRequestConfig, MaybePromise<any | void>>;

  /**
   * // See https://github.com/axios/axios#interceptors
   */
  responseInterceptor?: Func<AxiosResponse, MaybePromise<AxiosResponse | void>>;

  /**
   * Allows you to show the Open With Element when previewing via the explorer.
   */
  ContentOpenWithProps?: {
    show?: boolean,
    [p: string]: any
  };
}

export interface Explorer extends BaseEl<ExplorerOptions, ExplorerEvents> {
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

export function useBoxContentExplorer(fileId: MaybeRef<string>, accessToken: MaybeRef<string>, options: UseBoxElementsOptions<ExplorerOptions, ExplorerEvents>) {
  return useBoxElement<Explorer, ExplorerOptions, ExplorerEvents>(
    fileId,
    accessToken,
    {
      disposeOnUnmount: true,
      ...(options || {}),
      el: 'explorer'
    }
  );
}

export const BoxContentExplorer = /* @__PURE__ */ GenericBoxElement<Explorer, ExplorerOptions, typeof EXPLORER_EVENTS>(
  'explorer',
  EXPLORER_EVENTS
);
