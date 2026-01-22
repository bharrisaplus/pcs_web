import { default as NodeProcess } from 'node:process';

import { default as RollupTerser } from '@rollup/plugin-terser';

import { default as octocatV0Target } from './build/octocat/v0/_rollup.config.mjs'


let targetConfig = octocatV0Target;

export default targetConfig;
