import fs from 'fs-extra';
import glob from 'fast-glob';
import { resolve } from 'path';
import { objectKeys, uniq } from '@whoj/utils';

export const r = (...p: string[]) => resolve(process.cwd(), ...p);

export const { dependencies, name, peerDependencies, version } = fs.readJSONSync(r('package.json'), 'utf8');

export function makeBanner() {
  return `/**
 * @module ${name}
 * @version  ${version}
 * @copyright ${(new Date()).getFullYear()} Jonson B. All rights reserved.
 */
`;
}

export const getExternals = () => uniq<string | RegExp>([
  ...objectKeys<Record<string, string>>({ ...(dependencies || {}), ...(peerDependencies || {}) }),
  /axios/,
  /^@whoj\/utils/,
  /#box-ui-elements\//
]);

export const entry = glob.sync(['**/index.ts'], {
  absolute: false,
  cwd: r('./src/components'),
  ignore: ['index.ts']
}).reduce<Record<string, string>>((entries, input) => ({
  ...entries,
  [input.substring(0, input.indexOf('/'))]: `./src/components/${input}`
}), { index: './src/index.ts' });
