export type TokenGenerator = () => string | Promise<string>;

export type UnObj<T extends object = {}> = T & {
  [p: string]: any
};

export interface CommonOptions {
  /**
   * Custom CDN links to use for specific element/component
   */
  cdn?: {
    js: string,
    css: string
  };

  /**
   * Version of box-ui-elements to use.
   * It will have no effect when using custom cdn links
   */
  version?: string;

  /**
   * Whether to dispose the Head on unmount
   */
  disposeOnUnmount?: boolean;
}

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
}
