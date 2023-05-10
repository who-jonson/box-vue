import fs from 'fs-extra';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';
import MagicString from 'magic-string';
import { basename, dirname, resolve } from 'path';
import { hasProperty, kebabCase, objectEntries, parallel } from '@whoj/utils';

// import '../../../node_modules/box-ui-elements/src/icon/content/FileBoxNote32.tsx';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const r = (...p: string[]) => resolve(__dirname, '..', ...p);
const boxPath = (...p: string[]) => resolve(__dirname, '../../../node_modules/box-ui-elements', ...p);

function getFiles(pattern: string) {
  return glob.sync(pattern, {
    absolute: false,
    cwd: boxPath('src'),
    ignore: ['{**/*,*}.{stories,test}.tsx', '**/AccessibleSVG.tsx']
  });
}

async function transformIconTypes() {
  const source = new MagicString(fs.readFileSync(boxPath('src/icons/iconTypes.ts'), 'utf-8'), {
    filename: 'icons/iconTypes.ts'
  });

  source.replace(/import \{ ReactElement } from 'react';/g, '')
    .replace(/ \| ReactElement<string>/g, '');

  if (!fs.existsSync(dirname(r('src/icons/iconTypes.ts')))) {
    await fs.mkdir(dirname(r('src/icons/iconTypes.ts')), { recursive: true });
  }
  await fs.writeFile(r('src/icons/iconTypes.ts'), source.trim().toString(), 'utf-8');
}

async function transform(filename: string) {
  const source = new MagicString(fs.readFileSync(boxPath('src', filename), 'utf-8'), { filename });

  source.replace(/import \* as React from 'react';/g, '')
    .replace(/\/\* eslint-disable react\/jsx-sort-props \*\//g, '')
    .replace(/import AccessibleSVG, { SVGProps } from/, 'import AccessibleSVG, { type SVGProps, accessibleSVGProps } from')
    // .replace(/const (\w+) = /, (_, $1) => `const ${$1} = /* @__PURE__ */ `)
    .replace(/export default (\w+);/, (_, $1) => {
      const c = [
      `${$1}.inheritAttrs = false;`,
      `${$1}.props = accessibleSVGProps;`,
      `${$1}.displayName = '${$1}';`,
      '',
      `export default ${$1};`
      ];
      return c.join('\n');
    });

  source.replaceAll('fillRule', kebabCase('fillRule'))
    .replaceAll('clipRule', kebabCase('clipRule'))
    .replaceAll('clipPath', kebabCase('clipPath'))
    .replaceAll('stopColor', kebabCase('stopColor'))
    .replaceAll('fillOpacity', kebabCase(' fillOpacity'));

  return source.trimLines().toString();
}

async function main() {
  await fs.remove(r('dist'));
  await fs.remove(r('src/icon'));
  await fs.remove(r('src/icons'));

  const icons = getFiles('icon/*/*.tsx');
  const iconsExports: Record<string, string[]> = {};

  await transformIconTypes();
  await parallel(
    icons,
    async (fileIcon) => {
      const code = await transform(fileIcon);

      if (!fs.existsSync(dirname(r('src', fileIcon)))) {
        await fs.mkdir(dirname(r('src', fileIcon)), { recursive: true });
      }

      await fs.writeFile(r('src', fileIcon), code, 'utf-8');

      const [_, iType, iName] = fileIcon.split('/');
      if (!hasProperty(iconsExports, iType)) {
        iconsExports[iType] = [];
      }

      iconsExports[iType].push(basename(iName, '.tsx'));
    }
  );

  await parallel(
    objectEntries(iconsExports),
    async ([_type, exports]) => {
      let code = exports.reduce((code, exp) => `${code}export { default as ${exp} } from './${exp}';\n`, '');

      code += '';
      await fs.writeFile(r(`./src/icon/${_type}/index.ts`), code, 'utf-8');
    }
  );

  console.log(`${icons.length} files converted`);
}

main().catch((e) => {
  console.error(e);
  process.exit(0);
});
