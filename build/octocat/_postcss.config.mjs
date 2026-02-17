import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as buildShared } from '../manifest.mjs';


const buildConfig = {
	cwd: buildShared.project_path,
	map: NodeProcess.env.BUILD_AREA == 'prod' ? false : {
		annotation: (postCSSOptTo) => {
			let baseURL = NodeProcess.env.BUILD_AREA == 'lhost' ? buildShared.localhost_url : buildShared.filehost_url;

			return `${baseURL.toString()}${NodePath.basename(postCSSOptTo)}.map`;
		}
	},
	plugins: {
		'postcss-combine-duplicated-selectors': {},
		autoprefixer: {},
		cssnano: NodeProcess.env.BUILD_AREA == 'prod' ? { preset: 'default' } : false
	}
};


export default buildConfig;
