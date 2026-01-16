import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as buildShared } from '../../manifest.mjs';


const pagesDemoConfig = {
	cwd: buildShared.project_path,
	map: NodeProcess.env.NODE_ENV == 'production' ? false : true,
	plugins: {
		'postcss-combine-duplicated-selectors': {},
		autoprefixer: {},
		cssnano: { preset: 'default' }
	}
};


export default pagesDemoConfig;
