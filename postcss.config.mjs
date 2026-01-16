import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';
import { URL as NodeURL } from 'node:url';

const
	_dir = import.meta.dirname,
	buildInfo = {
		shared: {
			project_path: NodeProcess.env.PROJECT_DIR || NodePath.resolve(_dir, './')
		}
	};


const pagesDemoConfig = {
	cwd: buildInfo.shared.project_path,
	map: NodeProcess.env.NODE_ENV == 'production' ? false : true,
	plugins: {
		'postcss-combine-duplicated-selectors': {},
		autoprefixer: {},
		cssnano: { preset: 'default' }
	}
};


export default pagesDemoConfig;
