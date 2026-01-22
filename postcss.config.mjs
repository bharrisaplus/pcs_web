import { default as NodeProcess } from 'node:process';

let targetConfig;

if (NodeProcess.env.BUILD_TARGET == 'octocat') {
	switch(NodeProcess.env.BUILD_OBJECTIVE) {
		case 'v0':
		default: {
			const octocatV0 = await import('./build/octocat/v0/_postcss.config.mjs');

			targetConfig = octocatV0.default;
		}
	}
}

export default targetConfig;
