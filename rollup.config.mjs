import { default as NodeProcess } from 'node:process';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as octocatV0Target } from './build/octocat/v0/_rollup.config.mjs'


let targetConfig;

switch(NodeProcess.env.NODE_ENV) {
	case 'production':
		targetConfig = octocatV0Target.prodConfig;
		break;
	case 'lhost':
		targetConfig = octocatV0Target.lhostConfig;
		break;
	default:
		targetConfig = octocatV0Target.fhostConfig;
}


export default targetConfig;
