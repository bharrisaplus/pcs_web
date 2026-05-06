import { default as buildShared } from './manifest.mjs';

const buildConfig = {
	cwd: buildShared.project_path,
	map: true,
	plugins: {
		'postcss-combine-duplicated-selectors': false,
		autoprefixer: {},
		cssnano: false
	}
};


export default buildConfig;
