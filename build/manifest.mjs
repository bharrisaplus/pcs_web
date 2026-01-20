import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';


const
	_dir = import.meta.dirname,
	 milieu = {
	 	project_path: NodeProcess.env.PROJECT_DIR || NodePath.resolve(_dir, '../'),
		behavior_path: NodeProcess.env.BEHAVIOR_DIR || NodePath.resolve(_dir, '../source/behavior'),
		es_main: NodeProcess.env.ES_MAIN_NAME || 'main.js'
	};


export default milieu;

