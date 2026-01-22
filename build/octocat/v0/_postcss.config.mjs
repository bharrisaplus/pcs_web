import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as buildShared } from '../../manifest.mjs';


const buildConfig = {
	cwd: buildShared.project_path,
	map: NodeProcess.env.BUILD_AREA == 'prod' ? false : true,
	plugins: {
		'postcss-combine-duplicated-selectors': {},
		autoprefixer: {},
		cssnano: NodeProcess.env.BUILD_AREA == 'prod' ? { preset: 'default' } : false
	}
};


export default buildConfig;
