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
			url: buildShared.filehost_url || new NodeURL('../../../distribution/demo', import.meta.url)
		},
		lhost: {
			url: buildShared.localhost_url || new NodeURL('http://localhost:54321')
		}
	};

let config;

switch (NodeProcess.env.BUILD_AREA) {
	case 'prod':
		config = {
		  input: buildInfo.inputFilePath,
		  output: [{
				file: NodePath.resolve(buildShared.octocat_path, buildShared.es_main),
				format: 'iife',
				name: 'PCS',
				plugins: [ RollupTerser() ]
			}]
		}; break;
	case 'lhost':
		config = {
		  input: buildInfo.inputFilePath,
		  output: [{
				file: NodePath.resolve(buildShared.demo_path, buildShared.es_main),
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
				file: NodePath.resolve(buildShared.demo_path, buildShared.es_main),
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
