import type * as fillIcons from './icon/fill';
import type * as lineIcons from './icon/line';
import type * as logoIcons from './icon/logo';
import type * as defaultIcons from './icon/content';

export declare interface BoxIcons {
  default: keyof typeof defaultIcons;
  fill: keyof typeof fillIcons;
  line: keyof typeof lineIcons;
  logo: keyof typeof logoIcons;
}

export * from './icon/content/index';
