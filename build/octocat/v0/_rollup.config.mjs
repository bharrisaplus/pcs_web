import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as buildShared } from '../../manifest.mjs';


const
	_dir = import.meta.dirname,
	buildInfo = {
		inputFilePath: NodePath.resolve(buildShared.behavior_path, 'demo.main.js'),
		fhost: {
			url: NodeProcess.env.DEMO_FILE_HOST || new NodeURL('../../../distribution/demo', import.meta.url),
			path: NodeProcess.env.DEMO_DIR || NodePath.resolve(_dir, '../../../distribution/demo'),
		},
		lhost: {
			url: NodeProcess.env.LHOST_HOST || new NodeURL('http://localhost:54321')
		},
		prod: {
			path: NodeProcess.env.OCTOCAT_HOST_DIR || NodePath.resolve(_dir, '../../../docs')
		}
	};

let config;

switch (NodeProcess.env.BUILD_AREA) {
	case 'prod':
		config = {
		  input: buildInfo.inputFilePath,
		  output: [{
				file: NodePath.resolve(buildInfo.prod.path, buildShared.es_main),
				format: 'iife',
				name: 'PCS',
				plugins: [ RollupTerser() ]
			}]
		}; break;
	case 'lhost':
		config = {
		  input: buildInfo.inputFilePath,
		  output: [{
				file: NodePath.resolve(buildInfo.fhost.path, buildShared.es_main),
				format: 'iife',
				name: 'PCS',
				plugins: [],
				sourcemap: true,
				sourcemapExcludeSources: true,
				sourcemapBaseUrl: buildInfo.lhost.url.toString()
			}]
		}; break;
	default:
		config = {
			input: buildInfo.inputFilePath,
			output: [{
				file: NodePath.resolve(buildInfo.fhost.path, buildShared.es_main),
				format: 'iife',
				name: 'PCS',
				plugins: [],
				sourcemap: true,
				sourcemapExcludeSources: true,
				sourcemapBaseUrl: buildInfo.fhost.url.toString()
			}]
		};
}


export default config;
