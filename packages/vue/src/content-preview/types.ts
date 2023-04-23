import type { Func } from '@whoj/utils-types';
import type { BoxUiOptions, TokenGenerator } from '../types';

export type PreviewEvent = 'viewer' | 'load' | 'navigate' | 'notification' | 'viewerevent';

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

export interface Preview {
  /**
   * Shows a preview.
   *
   * @public
   * @param {string} fileId - File ID to preview
   * @param {string|TokenGenerator} accessToken - Box API access token
   * @param {PreviewOptions} [options] - Options
   *
   * @return {void}
   */
  show(fileId: string, accessToken: string | TokenGenerator, options?: PreviewOptions): void;

  /**
   * Hides the preview.
   *
   * @return {void}
   */
  hide(): void;

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

  /**
   * Adds an event listener to the preview. Listeners should be added
   * before calling show() so no events are missed.
   *
   * @param {PreviewEvent} eventName - Name of the event
   * @param {Func<any[], void>} listener - Callback function
   * @return {void}
   */
  addListener(eventName: PreviewEvent, listener: Func<any[], void>): void;

  /**
   * Removes an event listener from the preview.
   *
   * @param {PreviewEvent} eventName - Name of the event
   * @param {Func<any[], void>} listener - Callback function
   * @return {void}
   */
  removeListener(eventName: PreviewEvent, listener: Func<any[], void>): void;

  /**
   * Removes all event listeners from the preview.
   *
   * @return {void}
   */
  removeAllListeners(): void;

  [p: string]: any;
}
