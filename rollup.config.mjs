import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as RollupTerser } from '@rollup/plugin-terser';


const
	_dir = import.meta.dirname,
	buildInfo = {
		common: {
			behavior_path: NodeProcess.env.BEHAVIOR_DIR || NodePath.resolve(_dir, './source/behavior')
		},
		demo: {
			url_host: NodeProcess.env.DEMO_FILE_HOST || new NodeURL('./distribution/demo}', import.meta.url),
			dist_path: NodeProcess.env.DEMO_DIR || NodePath.resolve(_dir, `./distribution/demo`)
		}
	};


const pagesDemoConfig = {
  input: NodePath.resolve(buildInfo.common.behavior_path, 'demo.js'),
  output: [{
		file: NodePath.resolve(buildInfo.demo.dist_path, 'main.js'),
		format: 'iife',
		name: 'Parked',
		plugins: [ RollupTerser() ],
		sourcemap: true,
		sourcemapBaseUrl: new NodeURL(buildInfo.demo.url_host).toString()
	}]
};


export default pagesDemoConfig;
