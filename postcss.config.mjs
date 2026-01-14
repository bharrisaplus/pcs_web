import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

const
	_dir = import.meta.dirname,
	buildInfo = {
		common: {
			project_path: NodeProcess.env.PROJECT_DIR || NodePath.resolve(_dir, './')
		}
	};


const pagesDemoConfig = {
	cwd: buildInfo.project_path,
	map: true,
	plugins: {
		'postcss-combine-duplicated-selectors': {},
		autoprefixer: {},
		cssnano: { preset: 'default' }
	}
};


export default pagesDemoConfig;
