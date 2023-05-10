import type { Constructor } from '@whoj/utils';

import type { Explorer } from './explorer';
import type { FilePicker } from './picker';
import type { Preview } from './preview';
import type { Sidebar } from './sidebar';
import type { Uploader } from './uploader';
import type { GlobalBoxUiElements } from './useBoxElement';

declare global {
  interface Window {
    Box: GlobalBox;
  }
}

export interface BoxInterfaces {
  explorer: Explorer;
  picker: FilePicker;
  preview: Preview;
  sidebar: Sidebar;
  uploader: Uploader;
}

export type GlobalBox = {
  [K in keyof GlobalBoxUiElements]?: Constructor<BoxInterfaces[GlobalBoxUiElements[K]]>
};

export * from './explorer';
export * from './preview';
export * from './picker';
export * from './sidebar';
export * from './uploader';

export type BoxUiComponents = `Box${keyof GlobalBoxUiElements}`;
export type BoxUiComposables = `useBox${keyof GlobalBoxUiElements}`;
