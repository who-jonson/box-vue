import { kebabCase } from '@whoj/utils';
import * as fillIcons from './icon/fill/index.ce';
import * as lineIcons from './icon/line/index.ce';
import * as logoIcons from './icon/logo/index.ce';
import * as defaultIcons from './icon/content/index.ce';

export function registerFillIcons() {
  for (const [name, mod] of Object.entries(fillIcons)) {
    customElements.define(kebabCase(name), mod);
  }
}

export function registerLineIcons() {
  for (const [name, mod] of Object.entries(lineIcons)) {
    customElements.define(kebabCase(name), mod);
  }
}

export function registerLogoIcons() {
  for (const [name, mod] of Object.entries(logoIcons)) {
    customElements.define(kebabCase(name), mod);
  }
}

export function registerContentIcons() {
  for (const [name, mod] of Object.entries(defaultIcons)) {
    customElements.define(kebabCase(name), mod);
  }
}

export function register() {
  registerFillIcons();
  registerLineIcons();
  registerLogoIcons();
  registerContentIcons();
}

export default register;

export * from './icon/content/index.ce';
export * from './icon/fill/index.ce';
export * from './icon/line/index.ce';
export * from './icon/logo/index.ce';
