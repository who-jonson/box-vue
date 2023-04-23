import type { Func } from '@whoj/utils-types';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BoxUiOptions, TokenGenerator, UnObj } from '../types';

export type File = UnObj;
export type Folder = UnObj;
export type WebLink = UnObj;
export type MaybePromise<T> = Promise<T> | PromiseLike<T> | T;

export interface ExplorerEvents {
  select: Func<Array<File | Folder | WebLink>, void>;
  rename: Func<File | Folder | WebLink, void>;
  preview: Func<File, void>;
  download: Func<File[], void>;
  delete: Func<File[], void>;
  upload: Func<File[], void>;
  navigate: Func<Folder, void>;
  create: Func<Folder, void>;
}

export type ExplorerEvent = keyof ExplorerEvents;

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

export interface Explorer {

  /**
   * Shows the content explorer.
   *
   * @param {string} folderId - The root folder id
   * @param {string} accessToken - Box API access token
   * @param {ExplorerOptions} [options=`undefined`] - Options
   * @return {void}
   */
  show(folderId: string, accessToken: string | TokenGenerator, options?: ExplorerOptions): void;

  /**
   *  Hides the content explorer, removes all event listeners, and clears out the HTML.
   *
   * @return {void}
   */
  hide(): void;

  /**
   * Clears out the internal in-memory
   * cache for the content explorer forcing
   * re-load of items via the API.
   *
   * @public
   * @return {void}
   */
  clearCache(): void;
  /**
   * Adds an event listener to the content explorer. Listeners should be added
   * before calling show() so no events are missed.
   *
   * @param {ExplorerEvent} eventName - Name of the event
   * @param {Function} listener - Callback function
   * @return {void}
   */
  addListener<T extends ExplorerEvent>(eventName: T, listener: ExplorerEvents[T]): void;

  /**
   * Removes an event listener from the content explorer.
   *
   * @param {ExplorerEvent} eventName - Name of the event
   * @param {Function} listener - Callback function
   * @return {void}
   */
  removeListener<T extends ExplorerEvent>(eventName: T, listener: ExplorerEvents[T]): void;

  /**
   * removes all event listeners from the content explorer.
   *
   * @return {void}
   */
  removeAllListeners(): void;

  [p: string]: any;
}
