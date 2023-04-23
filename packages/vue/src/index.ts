import type { Constructor } from '@whoj/utils';
import type { Explorer } from './content-explorer';
import type { Preview } from './content-preview';

declare global {
  export interface Window {
    Box: {
      ContentExplorer: Constructor<Explorer> & {
        instance: Explorer
      },
      Preview: Constructor<Preview> & {
        instance: Preview
      }
    };
  }
}

export * from './content-explorer';
export * from './content-preview';

export type BoxComponent = 'ContentExplorer' | 'ContentPreview';
