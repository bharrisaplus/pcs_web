import { default as buildShared } from '../manifest.mjs';

const buildConfig = {
	cwd: buildShared.project_path,
	map: false,
	plugins: {
		'postcss-combine-duplicated-selectors': {},
		autoprefixer: {},
		cssnano: { preset: 'default' }
	}
};


export default buildConfig;
