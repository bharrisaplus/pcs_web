import { default as NodeProcess } from 'node:process';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as octocatV0Target } from './build/octocat/v0/_rollup.config.mjs'


let targetConfig;

if (NodeProcess.env.NODE_ENV == 'production') {
	targetConfig = octocatV0Target.prodConfig;
} else {
	targetConfig = octocatV0Target.fhostConfig;
}


export default targetConfig;
