import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create package.json for CJS output
const cjsPackageJson = {
  type: 'commonjs'
};

writeFileSync(
  resolve(__dirname, '../dist/cjs/package.json'),
  JSON.stringify(cjsPackageJson, null, 2)
);

// Create package.json for ESM output
const esmPackageJson = {
  type: 'module'
};

writeFileSync(
  resolve(__dirname, '../dist/esm/package.json'),
  JSON.stringify(esmPackageJson, null, 2)
);

console.log('✓ Created package.json files for CJS and ESM outputs');

