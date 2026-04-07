import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';

import { default as RollupVirtual } from '@rollup/plugin-virtual';
import { nodeResolve as RollupNodeResolve } from '@rollup/plugin-node-resolve';
import { default as RollupCommonJS } from '@rollup/plugin-commonjs';
import { default as RollupJSON } from '@rollup/plugin-json';
import { default as RollupNodePolyfills } from 'rollup-plugin-node-polyfills';

import { default as testShared } from './compass.mjs'


let targetConfig;

if (NodeProcess.env.BUILD_TARGET == "story_preface:testdouble") {
  targetConfig = {
    input: 'testdouble_browser',
    output: {
      file: NodePath.resolve(testShared.story_path, './_td.mjs'),
      format: 'es'
    },
    plugins: [
      RollupVirtual({
        testdouble_browser: `import * as testdouble from 'testdouble'; export default testdouble;`
      }),
      RollupNodeResolve({browser: true}),
      RollupCommonJS({transformMixedEsModules: true, defaultIsModuleExports: true}),
      RollupJSON(),
      RollupNodePolyfills()
    ]
  };
};


export default targetConfig;
