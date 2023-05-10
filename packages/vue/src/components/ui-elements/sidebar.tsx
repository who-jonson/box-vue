import type { MaybeRef } from '@whoj/utils';
import type { ExplorerOptions } from './explorer';
import type { UseBoxElementsOptions } from './useBoxElement';
import type { BaseEl, MapToReturnVoid } from '../../types';
import { GenericBoxElement, useBoxElement } from './useBoxElement';

const SIDEBAR_EVENTS = {};

export type SidebarEvents = MapToReturnVoid<typeof SIDEBAR_EVENTS>;

export interface SidebarOptions extends Pick<ExplorerOptions, 'container' | 'requestInterceptor' | 'responseInterceptor'> {
  /**
   * Set to true to show the activity feed that includes versions, comments and tasks.
   * @default `false`
   */
  hasActivityFeed?: boolean;

  /**
   * Set to true to show box metadata for the file.
   * @default `false`
   */
  hasMetadata?: boolean;

  /**
   * Set to true to show the file skills data.
   * @default `false`
   */
  hasSkills?: boolean;

  detailsSidebarProps?: {
    hasProperties?: boolean, // 	false	Set to true to show file properties in the details sidebar.
    hasAccessStats?: boolean, // 	false	Set to true to show file access stats in the details sidebar.
    hasVersions?: boolean, // 	false	Set to true to show file versions in the details sidebar.
    hasNotices?: boolean // 	false	Set to true to show file related notices in the details sidebar.

  };
}

export interface Sidebar extends BaseEl<SidebarOptions, SidebarEvents> {
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

export function useBoxContentSidebar(fileId: MaybeRef<string>, accessToken: MaybeRef<string>, options: UseBoxElementsOptions<SidebarOptions, SidebarEvents>) {
  return useBoxElement<Sidebar, SidebarOptions, SidebarEvents>(
    fileId,
    accessToken,
    {
      disposeOnUnmount: true,
      ...(options || {}),
      el: 'sidebar'
    }
  );
}

export const BoxContentSidebar = /* @__PURE__ */ GenericBoxElement<Sidebar, SidebarOptions, typeof SIDEBAR_EVENTS>(
  'sidebar',
  SIDEBAR_EVENTS
);
