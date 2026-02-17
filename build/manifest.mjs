import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';


const
	_dir = import.meta.dirname,
	 milieu = {
	 	project_path: NodeProcess.env.PROJECT_DIR || NodePath.resolve(_dir, '../'),
		behavior_path: NodeProcess.env.BEHAVIOR_DIR || NodePath.resolve(_dir, '../source/behavior'),
		demo_path: NodeProcess.env.DEMO_DIR || NodePath.resolve(_dir, '../distribution/demo'),
		dev_path: NodeProcess.env.DEV_DIR || NodePath.resolve(_dir, '../distribution/latest'),
		octocat_path: NodeProcess.env.OCTOCAT_HOST_DIR || NodePath.resolve(_dir, '../distribution/octocat/docs'),
		filehost_url: NodeProcess.env.FHOST_URL,
		localhost_url: NodeProcess.env.LHOST_URL,
		es_main: NodeProcess.env.ES_MAIN_NAME || 'main.js'
	};


export default milieu;

