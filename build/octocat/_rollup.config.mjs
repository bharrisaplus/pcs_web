import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as buildShared } from '../manifest.mjs';


const inputFilePath = NodePath.resolve(buildShared.behavior_path, 'index.main.mjs')

let config;

switch (NodeProcess.env.BUILD_AREA) {
	case 'prod': {
		config = {
		  input: inputFilePath,
		  output: [{
				file: NodePath.resolve(buildShared.octocat_path, buildShared.es_main),
				format: 'es',
				name: 'PCS',
				plugins: [ RollupTerser() ]
			}]
		}; break;
	}
	case 'lhost': {
		config = {
		  input: inputFilePath,
		  output: [{
				file: NodePath.resolve(buildShared.dev_path, buildShared.es_main),
				format: 'es',
				name: 'PCS',
				plugins: [],
				sourcemap: true,
				sourcemapExcludeSources: true,
				sourcemapBaseUrl: buildShared.localhost_url.toString()
			}]
		}; break;
	}
	case 'fhost':
	default: {
		config = {
			input: inputFilePath,
			output: [{
				file: NodePath.resolve(buildShared.dev_path, buildShared.es_main),
				format: 'es',
				name: 'PCS',
				plugins: [],
				sourcemap: true,
				sourcemapExcludeSources: true,
				sourcemapBaseUrl: buildShared.filehost_url.toString()
			}]
		};
	}
}


export default config;
