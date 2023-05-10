import {
  deleteProperty,
  getProperty,
  hasProperty,
  isArray,
  isObject,
  isString,
  objectEntries,
  objectMap,
  setProperty
} from '@whoj/utils';
import fs from 'fs-extra';
import { resolve } from 'path';
import { createUnplugin } from 'unplugin';
import { searchForWorkspaceRoot } from 'vite';

const publishableResources = createUnplugin(({ cwd = process.cwd() }) => {
  return {
    name: 'prepare-publishable-resources',

    enforce: 'post',

    closeBundle: async () => {
      const pkgJson = await fs.readJSON(resolve(cwd, 'package.json'), 'utf-8');
      const publishDir = getProperty(pkgJson || {}, 'publishConfig.directory');

      if (publishDir) {
        await makePublishablePkgJson(pkgJson);
        await copyPublishableFile('.npmrc', publishDir);
        await copyPublishableFile('LICENSE', publishDir);
        await copyPublishableFile('README.md', publishDir, false);
      }
    }
  };
});

export const publishableResourcesVite = (opt = {}) => publishableResources.vite(opt);
export const publishableResourcesRollup = (opt = {}) => publishableResources.rollup(opt);

async function copyPublishableFile(name, dir, searchRoot = true, cwd = process.cwd()) {
  if (fs.existsSync(resolve(cwd, name))) {
    await fs.copyFile(resolve(cwd, name), resolve(cwd, dir, name));
  }
  if (searchRoot) {
    const root = searchForWorkspaceRoot(cwd);
    if (fs.existsSync(resolve(root, name))) {
      await fs.copyFile(resolve(root, name), resolve(cwd, dir, name));
    }
  }
}

function transformPath(target) {
  if (isString(target)) {
    return target.replace('dist/', '');
  }
  if (isArray(target)) {
    return target.map(i => transformPath(i));
  }
  if (isObject(target)) {
    return objectMap(target, (k, v) => [k, transformPath(v)]);
  }
}

async function makePublishablePkgJson({ ...pkgJson }, cwd = process.cwd()) {
  const outPath = resolve(cwd, getProperty(pkgJson, 'publishConfig.directory'), 'package.json');

  deleteProperty(pkgJson, 'files');
  deleteProperty(pkgJson, 'scripts');
  deleteProperty(pkgJson, 'publishConfig.directory');
  deleteProperty(pkgJson, 'publishConfig.linkDirectory');

  objectEntries(pkgJson.exports || {}).forEach(([k, v]) => {
    if (!isArray(v)) {
      const path = `exports.${k.startsWith('.') ? `\\${k}` : k}.develop`;
      if (hasProperty(pkgJson, path)) {
        deleteProperty(pkgJson, path);
      }
    }
  });

  for (const [key, value] of objectEntries(pkgJson)) {
    if (/(exports|main|module|types|typesVersions|iife|jsdelivr|unpkg|browser)/.test(String(key))) {
      setProperty(pkgJson, String(key), transformPath(value));
    }
  }

  await fs.writeFile(outPath, JSON.stringify(pkgJson, null, 2), 'utf-8');
}
