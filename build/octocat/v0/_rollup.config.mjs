import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as RollupTerser } from '@rollup/plugin-terser';


const
	_dir = import.meta.dirname,
	buildInfo = {
		common: {
			behavior_path: NodeProcess.env.BEHAVIOR_DIR || NodePath.resolve(_dir, '../../../source/behavior')
		},
		demo: {
			fhost: {
				url: NodeProcess.env.DEMO_FILE_HOST || new NodeURL('../../../distribution/demo', import.meta.url),
				path: NodeProcess.env.DEMO_DIR || NodePath.resolve(_dir, '../../.././distribution/demo'),
			},
			prod: {
				path: NodeProcess.env.PAGES_HOST_DIR || NodePath.resolve(_dir, '../../../docs')
			}
		}
	};


const
	fhostConfig = {
	  input: NodePath.resolve(buildInfo.common.behavior_path, 'demo.js'),
	  output: [{
			file: NodePath.resolve(buildInfo.demo.fhost.path, 'main.js'),
			format: 'iife',
			name: 'PCS',
			plugins: [ RollupTerser() ],
			sourcemap: true,
			sourcemapBaseUrl: new NodeURL(buildInfo.demo.fhost.url).toString()
		}]
	},
	prodConfig = {
	  input: NodePath.resolve(buildInfo.common.behavior_path, 'demo.js'),
	  output: [{
			file: NodePath.resolve(buildInfo.demo.prod.path, 'main.js'),
			format: 'iife',
			name: 'PCS',
			plugins: [ RollupTerser() ]
		}]
	};


export default {
	prodConfig,
	fhostConfig
};
