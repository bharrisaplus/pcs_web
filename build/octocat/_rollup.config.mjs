import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as buildShared } from '../manifest.mjs';


const inputFilePath = NodePath.resolve(buildShared.behavior_path, 'index.main.mjs')

let config;

switch (NodeProcess.env.BUILD_AREA) {
  case 'prod':
  default: {
    config = {
      input: inputFilePath,
      output: [{
        file: NodePath.resolve(buildShared.octocat_path, `./scripts/${buildShared.es_main}`),
        format: 'es',
        name: 'PCS',
        plugins: [ RollupTerser() ]
      }]
    };
  }
}


export default config;
