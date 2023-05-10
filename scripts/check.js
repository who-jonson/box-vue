import path from 'path';
import { existsSync } from 'fs';
import { createUnplugin } from 'unplugin';
import { lstat, readFile, readdir, writeFile } from 'fs/promises';

const transform = async (content = '') => {
  return content
    .replace(/import '.*';/gm, '')
    .replace(/import ".*";/gm, '')
    .replace(/^require\('.*'\);/gm, '')
    .replace(/^require\(".*"\);/gm, '')
    .replace(/\n\s*\n/g, '\n');
};
const processFiles = async (dir) => {
  if (!existsSync(dir)) {
    return;
  }
  return (await readdir(dir))
    .map(async (entryName) => {
      const currentPath = `${dir}/${entryName}`;

      if ((await lstat(currentPath)).isDirectory()) {
        return processFiles(currentPath);
      }

      if (!['.mjs', '.cjs', '.ts'].includes(path.extname(currentPath))) {
        return;
      }

      const content = await readFile(currentPath, 'utf8');

      const result = await transform(content);

      if (!result) {
        return;
      }

      await writeFile(currentPath, result);
    });
};

const fixImportHell = createUnplugin(({ dir } = {}) => {
  let outDir = '';
  return {
    name: 'fix-import-hell',
    esbuild: {
      setup(build) {
        if (build.initialOptions.outdir) {
          outDir = dir?.(build.initialOptions.outdir) || build.initialOptions.outdir;
        }
      }
    },

    vite: {
      configResolved: (config) => {
        outDir = dir?.(config.build.outDir) || config.build.outDir;
      }
    },

    rollup: {
      outputOptions: (_options) => {
        _options.dir && (outDir = (dir?.(_options.dir) || _options.dir));
      }
    },

    closeBundle: () => processFiles(outDir)
  };
});

export const fixImportHellVite = opt => fixImportHell.vite(opt);
export const fixImportHellRollup = opt => fixImportHell.rollup(opt);
