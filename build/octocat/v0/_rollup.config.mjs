import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as buildShared } from '../../manifest.mjs';


const
	_dir = import.meta.dirname,
	buildInfo = {
		fhost: {
			url: NodeProcess.env.DEMO_FILE_HOST || new NodeURL('../../../distribution/demo', import.meta.url),
			path: NodeProcess.env.DEMO_DIR || NodePath.resolve(_dir, '../../../distribution/demo'),
		},
		lhost: {
			url: NodeProcess.env.LHOST_HOST || new NodeURL('http://localhost:54321', import.meta.url)
		},
		prod: {
			path: NodeProcess.env.OCTOCAT_HOST_DIR || NodePath.resolve(_dir, '../../../docs')
		}
	};


const
	fhostConfig = {
	  input: NodePath.resolve(buildShared.behavior_path, 'demo.main.js'),
	  output: [{
			file: NodePath.resolve(buildInfo.fhost.path, buildShared.es_main),
			format: 'iife',
			name: 'PCS',
			plugins: [ RollupTerser() ],
			sourcemap: true,
			sourcemapBaseUrl: new NodeURL(buildInfo.fhost.url).toString()
		}]
	},
	lhostConfig = {
	  input: NodePath.resolve(buildShared.behavior_path, 'demo.main.js'),
	  output: [{
			file: NodePath.resolve(buildInfo.fhost.path, buildShared.es_main),
			format: 'iife',
			name: 'PCS',
			plugins: [ RollupTerser() ],
			sourcemap: true,
			sourcemapBaseUrl: new NodeURL(buildInfo.lhost.url).toString()
		}]
	},
	prodConfig = {
	  input: NodePath.resolve(buildShared.behavior_path, 'demo.main.js'),
	  output: [{
			file: NodePath.resolve(buildInfo.prod.path, 'main.js'),
			format: 'iife',
			name: 'PCS',
			plugins: [ RollupTerser() ]
		}]
	};


export default {
	prodConfig,
	fhostConfig,
	lhostConfig
};
