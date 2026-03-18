import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

import { default as buildShared } from '../manifest.mjs';

const buildInfo = {
	fhost: {
		url: buildShared.filehost_url || new NodeURL('../../distribution/demo', import.meta.url),
	},
	lhost: {
		url: buildShared.localhost_url || new NodeURL('http://localhost:54321')
	}
};

const buildConfig = {
	cwd: buildShared.project_path,
	map: NodeProcess.env.BUILD_AREA == 'prod' ? false : {
		annotation: (postCSSOptTo) => {
			let baseURL = NodeProcess.env.BUILD_AREA == 'lhost' ? buildInfo.lhost.url : buildInfo.fhost.url;

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
