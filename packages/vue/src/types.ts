import type { ArgumentsType, Func } from '@whoj/utils';

export type File = UnObj;
export type Folder = UnObj;
export type WebLink = UnObj;

export type TokenGenerator = () => string | Promise<string>;

export interface CdnOption {
  js: string;
  css: string;
}

export type ExtractComponentProps<TComponent> =
  TComponent extends new () => {
    $props: infer P
  }
    ? P
    : never;

export type UnObj<T extends object = {}> = T & {
  [p: string]: any
};

export interface BoxUiOptions {
  /**
   * CSS selector of the container in which Preview should be placed
   * @default document.body
   */
  container?: string;

  /**
   * Shared link URL, required if file is shared and the access token doesn't belong to an owner or collaborator of the file
   */
  sharedLink?: string;

  /**
   * Shared link password, required if shared link has a password
   */
  sharedLinkPassword?: string;

  /**
   * URL of custom logo to show in header.
   * If this value is the string box then the box logo will show
   */
  logoUrl?: string;

  [p: string]: any;
}

export interface BaseEl<T extends Record<string, any>, _Events extends { [p: string]: Func<any, void> } = {}> {
  /**
   *
   * @public
   * @param {string} id - File/Folder ID to preview
   * @param {string|TokenGenerator} accessToken - Box API access token
   * @param {object} [options] - Options
   *
   * @return {void}
   */
  show(id: string, accessToken: string | TokenGenerator, options?: T): void;

  /**
   * Hides the preview.
   *
   * @return {void}
   */
  hide(): void;

  /**
   * Adds an event listener. Listeners should be added
   * before calling show() so no events are missed.
   *
   * @param {string} eventName - Name of the event
   * @param {Func<any, void>} listener - Callback function
   * @return {void}
   */
  addListener<_Event extends keyof _Events>(eventName: _Event, listener: Func<ArgumentsType<_Events[_Event]>[0], void>): void;

  /**
   * Removes an event listener
   *
   * @param {string} eventName - Name of the event
   * @param {Func<any, void>} listener - Callback function
   * @return {void}
   */
  removeListener<_Event extends keyof _Events>(eventName: _Event, listener: Func<ArgumentsType<_Events[_Event]>[0], void>): void;

  /**
   * Removes all event listeners from the el.
   *
   * @return {void}
   */
  removeAllListeners(): void;

  [p: string]: any;
}

export type MapToReturnVoid<T extends { [p: string]: Func<any, boolean> }> = {
  [K in keyof T]: (...args: ArgumentsType<T[K]>) => void
};

export type MaybePromise<T> = Promise<T> | PromiseLike<T> | T;

export type BoxComponent = 'ContentExplorer' | 'ContentPreview';
