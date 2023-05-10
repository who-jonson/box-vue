import glob from 'fast-glob';
import { parallel } from '@whoj/utils';
import { parse, parseMulti } from 'vue-docgen-api';
import { r } from './utils';

const componnts = glob.sync('./src/components/*/Content[a-zA-Z]*.ts', {
  cwd: r(),
  absolute: false
});

async function main() {
  const data = await parallel(
    componnts,
    c => parse(r(c), { jsx: true })
  );

  console.log(data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
