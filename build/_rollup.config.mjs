import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';

import { default as buildShared } from './manifest.mjs';


const inputFilePath = NodePath.resolve(buildShared.behavior_path, 'index.main.mjs')

let config;

switch (NodeProcess.env.BUILD_AREA) {
  case 'lhost': {
    config = {
      input: inputFilePath,
      output: [{
        file: NodePath.resolve(buildShared.dev_path, `./scripts/${buildShared.es_main}`),
        format: 'es',
        name: 'PCS',
        plugins: [],
        sourcemap: true,
        sourcemapExcludeSources: true,
        sourcemapBaseUrl: `${buildShared.localhost_url}scripts/`
      }]
    }; break;
  }
  case 'fhost':
  default: {
    config = {
      input: inputFilePath,
      output: [{
        file: NodePath.resolve(buildShared.dev_path, `./scripts/${buildShared.es_main}`),
        format: 'es',
        name: 'PCS',
        plugins: [],
        sourcemap: true,
        sourcemapExcludeSources: true,
        sourcemapBaseUrl: `${buildShared.filehost_url}scripts/`
      }]
    };
  }
}


export default config;
